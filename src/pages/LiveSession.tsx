
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from 'sonner';
import LiveSessionMap from '@/components/game/live/LiveSessionMap';
import ChatPanel from '@/components/game/live/ChatPanel';
import DicePanel from '@/components/game/live/DicePanel';
import SessionHeader from '@/components/game/live/SessionHeader';
import GameMasterPanel from '@/components/game/master/GameMasterPanel';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';

// Definindo o tipo para tokens no mapa
interface Token {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  size: number;
  color: string;
  image_url?: string;
}

// Definindo o tipo para os participantes
interface Participant {
  id: string;
  user_id: string;
  role: string;
  profiles: {
    display_name: string;
  } | null;
  characters?: {
    id: string;
    name: string;
    race: string;
    class: string;
  } | null;
}

const LiveSession = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState<any>(null);
  const [isGameMaster, setIsGameMaster] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchSessionData = async () => {
      if (!id || !user) {
        navigate('/tables');
        return;
      }

      try {
        setLoading(true);

        // Verificar se o usuário é participante da mesa
        const { data: participantData, error: participantError } = await supabase
          .from('table_participants')
          .select('role')
          .eq('table_id', id)
          .eq('user_id', user.id)
          .single();

        if (participantError || !participantData) {
          toast.error('Você não é participante desta mesa');
          navigate('/tables');
          return;
        }

        setIsGameMaster(participantData.role === 'gm');

        // Buscar dados da mesa
        const { data: tableData, error: tableError } = await supabase
          .from('tables')
          .select('*, session_paused')
          .eq('id', id)
          .single();

        if (tableError || !tableData) {
          toast.error('Erro ao carregar dados da mesa');
          navigate('/tables');
          return;
        }

        setTableData(tableData);
        setIsPaused(tableData.session_paused || false);
        setSessionStartTime(new Date());

        // Buscar participantes da mesa
        const { data: participantsData, error: participantsError } = await supabase
          .from('table_participants')
          .select(`
            id, user_id, role,
            profiles:user_id (display_name),
            characters:character_id (id, name, race, class)
          `)
          .eq('table_id', id);
          
        if (participantsError) {
          console.error("Erro ao buscar participantes:", participantsError);
        } else if (participantsData) {
          // Convertemos para o tipo correto
          const typedParticipants: Participant[] = participantsData.map(p => ({
            id: p.id,
            user_id: p.user_id,
            role: p.role,
            profiles: p.profiles as any,
            characters: p.characters
          }));
          
          setParticipants(typedParticipants);
        }

        // Configurar assinatura para mudanças de estado da sessão (pausada/ativa)
        const tableChannel = supabase
          .channel('table_status_changes')
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'tables',
              filter: `id=eq.${id}`
            },
            (payload) => {
              if (payload.new && 'session_paused' in payload.new) {
                setIsPaused(payload.new.session_paused as boolean);
                
                if (payload.new.session_paused) {
                  toast.info("A sessão foi pausada pelo mestre");
                } else {
                  toast.info("A sessão foi retomada pelo mestre");
                }
              }
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(tableChannel);
        };
      } catch (error) {
        console.error('Erro ao carregar dados da sessão:', error);
        toast.error('Erro ao carregar dados da sessão');
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [id, user, navigate]);

  const handleEndSession = () => {
    if (!isGameMaster) return;
  };

  const handleTokenMove = async (tokenId: string, newX: number, newY: number) => {
    if (!isGameMaster && isPaused) {
      toast.error("A sessão está pausada. Aguarde o mestre retomá-la.");
      return;
    }
    
    // Implementação a ser feita quando tivermos uma tabela para tokens
    console.log("Movendo token:", tokenId, "para posição:", newX, newY);
  };

  const addToken = async (tokenData: {
    name: string;
    type: string;
    color: string;
    size: number;
    x: number;
    y: number;
  }) => {
    if (!isGameMaster) return;
    
    // Implementação a ser feita quando tivermos uma tabela para tokens
    console.log("Adicionando token:", tokenData);
    
    // Adicionar token temporariamente na UI
    const newToken: Token = {
      id: `temp-${Date.now()}`,
      name: tokenData.name,
      type: tokenData.type,
      x: tokenData.x,
      y: tokenData.y,
      color: tokenData.color,
      size: tokenData.size
    };
    
    setTokens(prev => [...prev, newToken]);
    toast.success('Token adicionado');
  };

  const toggleSessionPause = async () => {
    if (!isGameMaster || !id) return;

    try {
      const newPausedState = !isPaused;
      const { error } = await supabase
        .from('tables')
        .update({ session_paused: newPausedState })
        .eq('id', id);

      if (error) throw error;
      
      setIsPaused(newPausedState);
      toast.success(newPausedState ? 'Sessão pausada' : 'Sessão retomada');
    } catch (error) {
      console.error('Erro ao alterar estado da sessão:', error);
      toast.error('Erro ao alterar estado da sessão');
    }
  };

  const confirmEndSession = async () => {
    if (!isGameMaster) return;

    try {
      await supabase
        .from('tables')
        .update({ status: 'completed' })
        .eq('id', id);

      toast.success('Sessão encerrada com sucesso');
      navigate('/tables');
    } catch (error) {
      console.error('Erro ao encerrar sessão:', error);
      toast.error('Erro ao encerrar sessão');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="animate-pulse text-fantasy-purple">Carregando sessão...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-80px)]">
        <div className="flex justify-between items-center px-4 py-3 bg-fantasy-dark border-b border-fantasy-purple/30">
          <div className="flex items-center">
            <SessionHeader 
              sessionName={tableData?.name} 
              startTime={sessionStartTime} 
              onEndSession={handleEndSession} 
              isGameMaster={isGameMaster}
              isPaused={isPaused}
              onTogglePause={isGameMaster ? toggleSessionPause : undefined}
            />
          </div>
          
          {isGameMaster && (
            <div className="flex items-center gap-2">
              <GameMasterPanel 
                sessionId={id || ''} 
                userId={user?.id || ''} 
                isPaused={isPaused}
                onTogglePause={toggleSessionPause}
              />
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="fantasy-button destructive">
                    Encerrar Sessão
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-fantasy-dark border border-fantasy-purple/50">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-fantasy-gold font-medievalsharp">
                      Encerrar Sessão
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-fantasy-stone">
                      Tem certeza que deseja encerrar esta sessão? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="hover:bg-fantasy-dark/50 hover:text-white">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={confirmEndSession} 
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Encerrar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Painel de Dados - Barra Lateral Esquerda */}
          <DicePanel 
            sessionId={id || ''} 
            userId={user?.id || ''} 
            isPaused={isPaused}
            isGameMaster={isGameMaster}
          />
          
          {/* Área Central - Mapa Tático */}
          <div className="flex-1 h-full overflow-hidden">
            {isPaused && !isGameMaster && (
              <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center">
                <div className="text-center bg-fantasy-dark/90 p-6 rounded-lg border border-fantasy-purple max-w-md">
                  <h2 className="text-xl font-medievalsharp text-fantasy-gold mb-3">
                    Sessão Pausada
                  </h2>
                  <p className="text-fantasy-stone">
                    O mestre pausou a sessão. Por favor, aguarde até que a sessão seja retomada.
                  </p>
                </div>
              </div>
            )}
            <LiveSessionMap
              tokens={tokens} 
              isGameMaster={isGameMaster}
              onTokenMove={handleTokenMove}
              onAddToken={addToken}
              participants={participants}
              isPaused={isPaused && !isGameMaster}
            />
          </div>
          
          {/* Painel de Chat - Barra Lateral Direita */}
          <ChatPanel 
            sessionId={id || ''} 
            userId={user?.id || ''}
            participants={participants}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default LiveSession;
