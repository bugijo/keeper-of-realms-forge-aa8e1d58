
import React, { useState, useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SessionParticipant, SessionMessage } from '@/types/session';
import { 
  MessageSquare, Send, Dices, User, ArrowRight,
  MessageCircle, Clock, Shield
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ChatPanelProps {
  sessionId: string;
  userId: string;
  participants: SessionParticipant[];
  isPaused: boolean;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ 
  sessionId, 
  userId, 
  participants,
  isPaused
}) => {
  const [messages, setMessages] = useState<SessionMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [diceRoll, setDiceRoll] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('table_id', sessionId)
          .order('created_at', { ascending: true });
          
        if (error) throw error;
        
        // Convert to SessionMessage format
        const formattedMessages: SessionMessage[] = (data || []).map((msg: any) => ({
          id: msg.id,
          session_id: sessionId,
          user_id: msg.user_id,
          content: msg.content,
          type: msg.type || 'text',
          metadata: msg.metadata,
          created_at: msg.created_at
        }));
        
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('chat_messages_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `table_id=eq.${sessionId}`
        },
        (payload) => {
          const newMsg = payload.new as any;
          // Convert to SessionMessage format
          const formattedMessage: SessionMessage = {
            id: newMsg.id,
            session_id: sessionId,
            user_id: newMsg.user_id,
            content: newMsg.content,
            type: newMsg.type || 'text',
            metadata: newMsg.metadata,
            created_at: newMsg.created_at
          };
          setMessages(prev => [...prev, formattedMessage]);
          
          // Show toast for new messages that aren't from this user
          if (formattedMessage.user_id !== userId && formattedMessage.type === 'text') {
            const sender = participants.find(p => p.user_id === formattedMessage.user_id);
            const senderName = sender?.display_name || sender?.character_name || 'Someone';
            toast(`New message from ${senderName}`, {
              description: formattedMessage.content.length > 30
                ? formattedMessage.content.substring(0, 30) + '...'
                : formattedMessage.content
            });
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, userId, participants]);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Send a text message
  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || isPaused) return;
    
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          table_id: sessionId,
          user_id: userId,
          content: newMessage,
          type: 'text'
        });
        
      if (error) throw error;
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };
  
  // Send a dice roll
  const sendDiceRoll = async () => {
    if (!diceRoll.trim() || isPaused) return;
    
    try {
      // Parse dice notation (e.g. 2d6+3)
      const diceRegex = /(\d+)d(\d+)(?:([+-])(\d+))?/;
      const match = diceRoll.match(diceRegex);
      
      if (!match) {
        toast.error('Invalid dice format. Use e.g. 2d6 or 1d20+3');
        return;
      }
      
      const numDice = parseInt(match[1]);
      const numSides = parseInt(match[2]);
      const modifier = match[3] ? (match[3] === '+' ? 1 : -1) * parseInt(match[4]) : 0;
      
      if (numDice <= 0 || numDice > 100 || numSides <= 0 || numSides > 1000) {
        toast.error('Invalid dice values');
        return;
      }
      
      // Roll the dice
      let total = 0;
      const rolls = [];
      
      for (let i = 0; i < numDice; i++) {
        const roll = Math.floor(Math.random() * numSides) + 1;
        total += roll;
        rolls.push(roll);
      }
      
      total += modifier;
      
      // Format the dice roll message
      const rollText = `rolled ${diceRoll}`;
      const rollResult = `${total} [${rolls.join(', ')}]${modifier !== 0 ? `${modifier > 0 ? '+' : ''}${modifier}` : ''}`;
      
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          table_id: sessionId,
          user_id: userId,
          content: rollText,
          type: 'dice',
          metadata: {
            rolls,
            total,
            modifier,
            dice_type: diceRoll,
            result: rollResult
          }
        });
        
      if (error) throw error;
      
      setDiceRoll('');
    } catch (error) {
      console.error('Error sending dice roll:', error);
      toast.error('Failed to send dice roll');
    }
  };
  
  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  // Get the name of a participant
  const getParticipantName = (participantId: string) => {
    const participant = participants.find(p => p.user_id === participantId);
    return participant?.character_name || participant?.display_name || 'Unknown';
  };
  
  // Check if a participant is a GM
  const isGM = (participantId: string) => {
    return participants.find(p => p.user_id === participantId)?.role === 'gm';
  };
  
  // Format timestamp
  const formatMessageTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };
  
  return (
    <div className="w-80 flex flex-col h-full border-l border-fantasy-purple/30 bg-fantasy-dark/50">
      <div className="p-3 border-b border-fantasy-purple/30 flex items-center">
        <MessageSquare size={18} className="text-fantasy-gold mr-2" />
        <h2 className="text-white font-medievalsharp">Session Chat</h2>
      </div>
      
      <ScrollArea className="flex-1">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-pulse text-fantasy-stone">Loading messages...</div>
          </div>
        ) : (
          <div className="p-3 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-fantasy-stone p-4">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map(message => {
                const isSelf = message.user_id === userId;
                const isGameMaster = isGM(message.user_id);
                
                return (
                  <div 
                    key={message.id}
                    className={`rounded-lg ${
                      message.type === 'system' 
                        ? 'bg-fantasy-purple/20 mx-4 text-center py-2 px-3'
                        : isSelf
                          ? 'bg-fantasy-purple/30 ml-8 pl-3 pr-3 py-2'
                          : 'bg-fantasy-dark/70 mr-8 pl-3 pr-3 py-2'
                    }`}
                  >
                    {message.type !== 'system' && (
                      <div className="flex justify-between items-baseline mb-1">
                        <div className="flex items-center">
                          {isGameMaster ? (
                            <Shield size={12} className="text-fantasy-gold mr-1" />
                          ) : (
                            <User size={12} className="text-fantasy-stone mr-1" />
                          )}
                          <span className={`text-xs font-medium ${isGameMaster ? 'text-fantasy-gold' : 'text-white'}`}>
                            {getParticipantName(message.user_id)}
                          </span>
                          {message.type === 'dice' && (
                            <Dices size={12} className="text-fantasy-purple ml-1" />
                          )}
                        </div>
                        <span className="text-[10px] text-fantasy-stone/70">
                          {formatMessageTime(message.created_at)}
                        </span>
                      </div>
                    )}
                    
                    <p className={`${message.type === 'system' ? 'text-fantasy-stone text-sm' : 'text-white'}`}>
                      {message.content}
                    </p>
                    
                    {message.type === 'dice' && message.metadata && (
                      <div className="mt-1 text-center bg-fantasy-dark/40 rounded p-1">
                        <span className="font-bold text-fantasy-gold text-lg">
                          {message.metadata.total}
                        </span>
                        <span className="text-xs text-fantasy-stone ml-2">
                          {message.metadata.result}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>
      
      <div className="p-3 border-t border-fantasy-purple/30">
        {/* Dice roller */}
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={diceRoll}
            onChange={(e) => setDiceRoll(e.target.value)}
            placeholder="e.g. 2d6+3"
            className="flex-1 bg-fantasy-dark/60 rounded p-2 text-white text-sm"
            disabled={isPaused}
          />
          <Button
            onClick={sendDiceRoll}
            size="sm"
            className="fantasy-button secondary"
            disabled={!diceRoll.trim() || isPaused}
          >
            <Dices size={16} />
          </Button>
        </div>
        
        {/* Text message input */}
        <div className="flex gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-fantasy-dark/60 rounded p-2 text-white resize-none h-20"
            disabled={isPaused}
          />
          
          <Button
            onClick={() => sendMessage()}
            size="sm"
            className="self-end fantasy-button primary"
            disabled={!newMessage.trim() || isPaused}
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
