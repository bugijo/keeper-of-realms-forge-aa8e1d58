
import React from 'react';

export interface ChatTabProps {
  sessionId?: string;
  userId?: string;
  messages?: { sender: string; text: string; }[];
  newMessage?: string;
  setNewMessage?: React.Dispatch<React.SetStateAction<string>>;
  sendMessage?: (e: React.FormEvent) => void;
}

const ChatTab: React.FC<ChatTabProps> = ({ 
  sessionId, 
  userId,
  messages = [],
  newMessage = '',
  setNewMessage,
  sendMessage
}) => {
  return (
    <div>
      <h3 className="text-lg font-medievalsharp text-fantasy-gold mb-4">Chat do Mestre</h3>
      <p className="text-fantasy-stone">Canal de comunicação privado para mestres.</p>
      {sessionId && <p className="text-xs text-fantasy-stone/70 mt-2">ID da sessão: {sessionId}</p>}
    </div>
  );
};

export default ChatTab;
