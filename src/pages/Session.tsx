
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from 'sonner';
import MainLayout from '@/components/layout/MainLayout';
import TacticalMap from '@/components/session/TacticalMap';
import GameMasterPanel from '@/components/session/GameMasterPanel';
import ChatPanel from '@/components/session/ChatPanel';
import TurnTracker from '@/components/session/TurnTracker';
import { SessionParticipant, TokenPosition, SessionTurn, SessionMessage } from '@/types/session';

const Session = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGameMaster, setIsGameMaster] = useState(false);
  const [participants, setParticipants] = useState<SessionParticipant[]>([]);
  const [tokens, setTokens] = useState<TokenPosition[]>([]);
  const [sessionTurn, setSessionTurn] = useState<SessionTurn | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionData, setSessionData] = useState<any>(null);

  // Verify user participation and load session data
  useEffect(() => {
    const verifyParticipation = async () => {
      if (!id || !user) {
        navigate('/tables');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Check if user is a participant in this session
        const { data: participantData, error: participantError } = await supabase
          .from('table_participants')
          .select('id, user_id, role, character_id')
          .eq('table_id', id)
          .eq('user_id', user.id)
          .single();

        if (participantError) {
          console.error('Participation check error:', participantError);
          throw new Error('You are not a participant in this session');
        }

        setIsGameMaster(participantData.role === 'gm');

        // Fetch table data
        const { data: tableData, error: tableError } = await supabase
          .from('tables')
          .select('*')
          .eq('id', id)
          .single();

        if (tableError) {
          throw new Error('Failed to load session data');
        }

        setSessionData(tableData);
        setIsPaused(tableData.session_paused || false);

        // Load all participants with their profile info
        const { data: allParticipants, error: allParticipantsError } = await supabase
          .from('table_participants')
          .select(`
            id, user_id, role, character_id,
            profiles:user_id (display_name),
            characters:character_id (id, name)
          `)
          .eq('table_id', id);

        if (allParticipantsError) {
          console.error('Error loading participants:', allParticipantsError);
        } else {
          const formattedParticipants: SessionParticipant[] = allParticipants.map((p: any) => ({
            id: p.id,
            user_id: p.user_id,
            role: p.role,
            display_name: p.profiles?.display_name,
            character_id: p.character_id,
            character_name: p.characters?.name
          }));
          setParticipants(formattedParticipants);
        }

        // Load session tokens
        const { data: tokenData, error: tokenError } = await supabase
          .from('session_tokens')
          .select('*')
          .eq('session_id', id);

        if (tokenError) {
          console.error('Error loading tokens:', tokenError);
        } else {
          setTokens(tokenData as TokenPosition[]);
        }

        // Load or create session turn data
        const { data: turnData, error: turnError } = await supabase
          .from('session_turns')
          .select('*')
          .eq('session_id', id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (turnError) {
          if (isGameMaster) {
            // Create session turn data if GM and none exists
            const { data: newTurnData, error: newTurnError } = await supabase
              .from('session_turns')
              .insert([{ 
                session_id: id,
                turn_order: []
              }])
              .select()
              .single();
              
            if (newTurnError) {
              console.error('Error creating turn data:', newTurnError);
            } else {
              setSessionTurn(newTurnData);
            }
          }
        } else {
          setSessionTurn(turnData);
        }
      } catch (err: any) {
        console.error('Session loading error:', err);
        setError(err.message || 'An error occurred while loading the session');
        toast.error(err.message || 'Failed to load session');
        navigate('/tables');
      } finally {
        setLoading(false);
      }
    };

    verifyParticipation();
  }, [id, user, navigate, isGameMaster]);

  // Set up realtime subscriptions
  useEffect(() => {
    if (!id) return;

    // Subscribe to token changes
    const tokenChannel = supabase
      .channel('session_tokens_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session_tokens',
          filter: `session_id=eq.${id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTokens(prev => [...prev, payload.new as TokenPosition]);
          } else if (payload.eventType === 'UPDATE') {
            setTokens(prev => 
              prev.map(token => token.id === payload.new.id ? { ...payload.new as TokenPosition } : token)
            );
          } else if (payload.eventType === 'DELETE') {
            setTokens(prev => prev.filter(token => token.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // Subscribe to turn changes
    const turnChannel = supabase
      .channel('session_turns_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'session_turns',
          filter: `session_id=eq.${id}`
        },
        (payload) => {
          setSessionTurn(payload.new as SessionTurn);
        }
      )
      .subscribe();

    // Subscribe to session pause state
    const tableChannel = supabase
      .channel('session_paused_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'tables',
          filter: `id=eq.${id}`
        },
        (payload) => {
          if ('session_paused' in payload.new) {
            setIsPaused(payload.new.session_paused);
            if (payload.new.session_paused) {
              toast.info('Session paused by the Game Master');
            } else {
              toast.info('Session resumed by the Game Master');
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(tokenChannel);
      supabase.removeChannel(turnChannel);
      supabase.removeChannel(tableChannel);
    };
  }, [id]);

  const handleTokenMove = async (tokenId: string, x: number, y: number) => {
    // Only GMs or token owners can move tokens
    const token = tokens.find(t => t.id === tokenId);
    if (!token) return;
    
    const canMove = isGameMaster || token.user_id === user?.id;
    if (!canMove || isPaused) return;

    try {
      const { error } = await supabase
        .from('session_tokens')
        .update({ x, y })
        .eq('id', tokenId);

      if (error) throw error;
    } catch (error) {
      console.error('Error moving token:', error);
      toast.error('Failed to move token');
    }
  };

  const handleTogglePause = async () => {
    if (!isGameMaster || !id) return;

    try {
      const newPausedState = !isPaused;
      const { error } = await supabase
        .from('tables')
        .update({ session_paused: newPausedState })
        .eq('id', id);

      if (error) throw error;
      
      setIsPaused(newPausedState);
      toast.success(newPausedState ? 'Session paused' : 'Session resumed');
    } catch (error) {
      console.error('Error toggling session pause:', error);
      toast.error('Failed to update session state');
    }
  };

  const handleTokenVisibility = async (tokenId: string, isVisible: boolean) => {
    if (!isGameMaster) return;

    try {
      const { error } = await supabase
        .from('session_tokens')
        .update({ is_visible_to_players: isVisible })
        .eq('id', tokenId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating token visibility:', error);
      toast.error('Failed to update token visibility');
    }
  };

  const handleAddToken = async (tokenData: Omit<TokenPosition, 'id' | 'session_id'>) => {
    if (!isGameMaster || !id) return;

    try {
      const { error } = await supabase
        .from('session_tokens')
        .insert([{
          ...tokenData,
          session_id: id,
          user_id: user?.id
        }]);

      if (error) throw error;
      toast.success('Token added');
    } catch (error) {
      console.error('Error adding token:', error);
      toast.error('Failed to add token');
    }
  };

  const handleDeleteToken = async (tokenId: string) => {
    if (!isGameMaster) return;

    try {
      const { error } = await supabase
        .from('session_tokens')
        .delete()
        .eq('id', tokenId);

      if (error) throw error;
      toast.success('Token deleted');
    } catch (error) {
      console.error('Error deleting token:', error);
      toast.error('Failed to delete token');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="animate-pulse text-fantasy-purple">Loading session...</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex flex-col justify-center items-center h-[calc(100vh-80px)]">
          <div className="text-red-500 mb-4">{error}</div>
          <button 
            onClick={() => navigate('/tables')} 
            className="fantasy-button primary"
          >
            Return to Tables
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-fantasy-dark">
      {/* Header with session info */}
      <header className="bg-fantasy-dark border-b border-fantasy-purple/30 p-3 flex justify-between items-center">
        <h1 className="text-xl font-medievalsharp text-fantasy-gold">{sessionData?.name || 'RPG Session'}</h1>
        
        {isGameMaster && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePause}
              className={`fantasy-button ${isPaused ? 'primary' : 'secondary'}`}
            >
              {isPaused ? 'Resume Session' : 'Pause Session'}
            </button>
          </div>
        )}
      </header>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Game Master Panel - only visible to GM */}
        {isGameMaster && (
          <GameMasterPanel 
            sessionId={id || ''} 
            participants={participants}
            isPaused={isPaused}
            onTogglePause={handleTogglePause}
            sessionTurn={sessionTurn}
            onAddToken={handleAddToken}
          />
        )}

        {/* Main tactical map area */}
        <div className="flex-1 relative">
          {isPaused && !isGameMaster && (
            <div className="absolute inset-0 bg-black/70 z-10 flex items-center justify-center">
              <div className="bg-fantasy-dark p-6 rounded-lg border border-fantasy-purple text-center max-w-md">
                <h2 className="text-xl font-medievalsharp text-fantasy-gold mb-3">Session Paused</h2>
                <p className="text-fantasy-stone">The Game Master has paused the session. Please wait until they resume.</p>
              </div>
            </div>
          )}

          {/* Turn tracker overlay for all participants */}
          <TurnTracker
            sessionTurn={sessionTurn}
            participants={participants}
            isGameMaster={isGameMaster}
          />
          
          <TacticalMap
            tokens={tokens}
            isGameMaster={isGameMaster}
            isPaused={isPaused}
            onTokenMove={handleTokenMove}
            onTokenVisibilityToggle={handleTokenVisibility}
            onDeleteToken={handleDeleteToken}
            onAddToken={handleAddToken}
            userId={user?.id || ''}
            sessionId={id || ''}
          />
        </div>

        {/* Chat panel */}
        <ChatPanel
          sessionId={id || ''}
          userId={user?.id || ''}
          participants={participants}
          isPaused={isPaused && !isGameMaster}
        />
      </div>
    </div>
  );
};

export default Session;
