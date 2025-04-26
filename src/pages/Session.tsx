
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
          // Convert token data to TokenPosition format and add is_visible_to_players if missing
          const formattedTokens: TokenPosition[] = (tokenData || []).map((token: any) => ({
            ...token,
            is_visible_to_players: token.is_visible_to_players !== undefined ? token.is_visible_to_players : true
          }));
          setTokens(formattedTokens);
        }

        // For now, we'll use the tables table to store turn data temporarily
        // This will be replaced with the session_turns table once the types are updated
        const { data: tableCustomData, error: tableCustomError } = await supabase
          .from('tables')
          .select('id, custom_data')
          .eq('id', id)
          .single();

        if (!tableCustomError && tableCustomData?.custom_data) {
          // Create a mock session turn object using the custom_data
          const customData = tableCustomData.custom_data;
          const mockTurn: SessionTurn = {
            id: id,
            session_id: id,
            current_turn_user_id: customData.current_turn_user_id || null,
            turn_started_at: customData.turn_started_at || null,
            turn_ends_at: customData.turn_ends_at || null,
            turn_duration: customData.turn_duration || 60,
            is_paused: customData.is_paused || false,
            round_number: customData.round_number || 1,
            turn_order: customData.turn_order || []
          };
          setSessionTurn(mockTurn);
        } else {
          if (isGameMaster) {
            // Create default turn data
            const defaultTurn: SessionTurn = {
              id: id,
              session_id: id,
              current_turn_user_id: null,
              turn_started_at: null,
              turn_ends_at: null,
              turn_duration: 60,
              is_paused: false,
              round_number: 1,
              turn_order: []
            };
            setSessionTurn(defaultTurn);
          }
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
            const newToken = {
              ...payload.new,
              is_visible_to_players: payload.new.is_visible_to_players !== undefined 
                ? payload.new.is_visible_to_players 
                : true
            } as TokenPosition;
            
            setTokens(prev => [...prev, newToken]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedToken = {
              ...payload.new,
              is_visible_to_players: payload.new.is_visible_to_players !== undefined 
                ? payload.new.is_visible_to_players 
                : true
            } as TokenPosition;
            
            setTokens(prev => 
              prev.map(token => token.id === updatedToken.id ? updatedToken : token)
            );
          } else if (payload.eventType === 'DELETE') {
            setTokens(prev => prev.filter(token => token.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // Subscribe to table changes for turn data (temporary solution)
    const tableChannel = supabase
      .channel('table_custom_data_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'tables',
          filter: `id=eq.${id}`
        },
        (payload) => {
          const customData = payload.new.custom_data;
          
          if (customData && typeof customData === 'object') {
            setSessionTurn(prevTurn => {
              if (!prevTurn) return null;
              
              return {
                ...prevTurn,
                current_turn_user_id: customData.current_turn_user_id || prevTurn.current_turn_user_id,
                turn_started_at: customData.turn_started_at || prevTurn.turn_started_at,
                turn_ends_at: customData.turn_ends_at || prevTurn.turn_ends_at,
                turn_duration: customData.turn_duration || prevTurn.turn_duration,
                is_paused: customData.is_paused !== undefined ? customData.is_paused : prevTurn.is_paused,
                round_number: customData.round_number || prevTurn.round_number,
                turn_order: customData.turn_order || prevTurn.turn_order
              };
            });
          }
          
          // Update session pause state
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
          user_id: user?.id,
          is_visible_to_players: tokenData.is_visible_to_players !== undefined ? tokenData.is_visible_to_players : true
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
