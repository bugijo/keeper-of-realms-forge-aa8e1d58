
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
            is_visible_to_players: true // Default to visible since it's not in the database yet
          }));
          setTokens(formattedTokens);
        }

        // Create a default turn data object
        const defaultTurn: SessionTurn = {
          id: id || '',
          session_id: id || '',
          current_turn_user_id: null,
          turn_started_at: null,
          turn_ends_at: null,
          turn_duration: 60,
          is_paused: false,
          round_number: 1,
          turn_order: []
        };

        // For this implementation, we'll store turn data in a localStorage fallback
        // since the database doesn't yet have a dedicated field for turn data
        const storedTurnData = localStorage.getItem(`session_turn_${id}`);
        
        if (storedTurnData) {
          try {
            const parsedTurnData = JSON.parse(storedTurnData);
            setSessionTurn({
              ...defaultTurn,
              ...parsedTurnData
            });
          } catch (e) {
            console.error('Error parsing stored turn data:', e);
            setSessionTurn(defaultTurn);
          }
        } else {
          setSessionTurn(defaultTurn);
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
  }, [id, user, navigate]);

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
              is_visible_to_players: true // Default to visible for now
            } as TokenPosition;
            
            setTokens(prev => [...prev, newToken]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedToken = {
              ...payload.new,
              is_visible_to_players: true // Default to visible for now
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

    // Subscribe to table changes for pause status
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

  // Function to update and save turn data to localStorage
  const updateSessionTurn = (turnData: Partial<SessionTurn>) => {
    if (!sessionTurn || !id) return;
    
    const updatedTurn = {
      ...sessionTurn,
      ...turnData
    };
    
    setSessionTurn(updatedTurn);
    
    // Store in localStorage as fallback until database support is added
    localStorage.setItem(`session_turn_${id}`, JSON.stringify(updatedTurn));
  };

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

      // Also update the turn pause state
      if (sessionTurn) {
        updateSessionTurn({ is_paused: newPausedState });
      }
    } catch (error) {
      console.error('Error toggling session pause:', error);
      toast.error('Failed to update session state');
    }
  };

  const handleTokenVisibility = async (tokenId: string, isVisible: boolean) => {
    if (!isGameMaster) return;

    try {
      // Since we don't have is_visible_to_players column in the database yet,
      // we'll just update it locally for now
      setTokens(prev =>
        prev.map(token => 
          token.id === tokenId ? { ...token, is_visible_to_players: isVisible } : token
        )
      );
      
      toast.success(`Token ${isVisible ? 'shown to' : 'hidden from'} players`);
    } catch (error) {
      console.error('Error updating token visibility:', error);
      toast.error('Failed to update token visibility');
    }
  };

  const handleAddToken = async (tokenData: Omit<TokenPosition, 'id' | 'session_id'>) => {
    if (!isGameMaster || !id) return;

    try {
      // For now, we'll omit is_visible_to_players as it doesn't exist in the database
      const { is_visible_to_players, ...dbSafeTokenData } = tokenData;
      
      const { data, error } = await supabase
        .from('session_tokens')
        .insert([{
          ...dbSafeTokenData,
          session_id: id,
          user_id: user?.id
        }])
        .select();

      if (error) throw error;
      
      if (data && data[0]) {
        // After successful insert, update our local state with the is_visible_to_players field
        const newToken: TokenPosition = {
          ...data[0],
          is_visible_to_players: tokenData.is_visible_to_players || true
        };
        
        setTokens(prev => [...prev, newToken]);
      }
      
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

  // Handle turn updates from the GM panel
  const handleTurnUpdate = (turnData: Partial<SessionTurn>) => {
    if (!isGameMaster) return;
    updateSessionTurn(turnData);
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
            onTurnUpdate={handleTurnUpdate}
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
