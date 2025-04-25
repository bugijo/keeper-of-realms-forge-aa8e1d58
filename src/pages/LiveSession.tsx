
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

const LiveSession = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState<any>(null);
  const [isGameMaster, setIsGameMaster] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [tokens, setTokens] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);

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
          .select('*')
          .eq('id', id)
          .single();

        if (tableError || !tableData) {
          toast.error('Erro ao carregar dados da mesa');
          navigate('/tables');
          return;
        }

        setTableData(tableData);
        setSessionStartTime(new Date());

        // Buscar tokens da sessão
        const { data: tokenData } = await supabase
          .from('session_tokens')
          .select('*')
          .eq('session_id', id);

        setTokens(tokenData || []);

        // Buscar participantes da mesa
        const { data: participants } = await supabase
          .from('table_participants')
          .select(`
            id, user_id, role,
            profiles:user_id (display_name),
            characters:character_id (id, name, race, class)
          `)
          .eq('table_id', id);

        setParticipants(participants || []);

        // Configurar assinatura em tempo real para os tokens
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
                setTokens(prev => [...prev, payload.new]);
              } else if (payload.eventType === 'UPDATE') {
                setTokens(prev => 
                  prev.map(token => token.id === payload.new.id ? payload.new : token)
                );
              } else if (payload.eventType === 'DELETE') {
                setTokens(prev => prev.filter(token => token.id !== payload.old.id));
              }
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(tokenChannel);
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

  const handleEndSession = async () => {
    if (!isGameMaster) return;

    const confirm = window.confirm('Tem certeza que deseja encerrar esta sessão?');
    if (!confirm) return;

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

  const handleTokenMove = async (tokenId: string, newX: number, newY: number) => {
    if (!isGameMaster) return;

    try {
      await supabase
        .from('session_tokens')
        .update({ x: newX, y: newY })
        .eq('id', tokenId);
    } catch (error) {
      console.error('Erro ao mover token:', error);
    }
  };

  const addToken = async (tokenData: {
    name: string;
    token_type: string;
    color?: string;
    size: number;
    x: number;
    y: number;
  }) => {
    if (!isGameMaster) return;

    try {
      await supabase
        .from('session_tokens')
        .insert({
          ...tokenData,
          session_id: id,
        });

      toast.success('Token adicionado');
    } catch (error) {
      console.error('Erro ao adicionar token:', error);
      toast.error('Erro ao adicionar token');
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
        <SessionHeader 
          sessionName={tableData?.name} 
          startTime={sessionStartTime} 
          onEndSession={handleEndSession} 
          isGameMaster={isGameMaster}
        />

        <div className="flex flex-1 overflow-hidden">
          {/* Painel de Dados - Barra Lateral Esquerda */}
          <DicePanel sessionId={id || ''} userId={user?.id || ''} />
          
          {/* Área Central - Mapa Tático */}
          <div className="flex-1 h-full overflow-hidden">
            <LiveSessionMap
              tokens={tokens}
              isGameMaster={isGameMaster}
              onTokenMove={handleTokenMove}
              onAddToken={addToken}
              participants={participants}
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
