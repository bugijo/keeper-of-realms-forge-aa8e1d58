
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Calendar, Users, Sword, MapPin, Clock, Book } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

const TableDetailsView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const [tableDetails, setTableDetails] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [joinRequestStatus, setJoinRequestStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTableDetails = async () => {
      if (!id) {
        setError("ID da mesa não fornecido");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch table details
        const { data: tableData, error: tableError } = await supabase
          .from('tables')
          .select('*')
          .eq('id', id)
          .single();

        if (tableError) {
          console.error("Erro ao carregar detalhes da mesa:", tableError);
          setError("Erro ao carregar detalhes da mesa");
          setLoading(false);
          return;
        }

        if (!tableData) {
          setError("Mesa não encontrada");
          setLoading(false);
          return;
        }

        setTableDetails(tableData);

        // Fetch participants
        const { data: participantsData, error: participantsError } = await supabase
          .from('table_participants')
          .select('*, profiles(display_name)')
          .eq('table_id', id);

        if (participantsError) {
          console.error("Erro ao carregar participantes:", participantsError);
          toast.error('Erro ao carregar participantes');
        } else {
          setParticipants(participantsData || []);
        }

        // Check existing join request if user is logged in
        if (session?.user) {
          const { data: requestData, error: requestError } = await supabase
            .from('table_join_requests')
            .select('status')
            .eq('table_id', id)
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (requestError) {
            console.error("Erro ao verificar solicitação:", requestError);
          } else {
            setJoinRequestStatus(requestData?.status || null);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Ocorreu um erro ao carregar os dados");
        setLoading(false);
      }
    };

    fetchTableDetails();
  }, [id, session]);

  const handleJoinRequest = async () => {
    if (!session?.user) {
      toast.error('Você precisa estar logado para solicitar participação');
      return;
    }

    try {
      const { error } = await supabase
        .from('table_join_requests')
        .insert({
          table_id: id,
          user_id: session.user.id,
          status: 'pending'
        });

      if (error) {
        console.error("Erro ao enviar solicitação:", error);
        toast.error('Erro ao enviar solicitação');
        return;
      }

      toast.success('Solicitação de participação enviada');
      setJoinRequestStatus('pending');
    } catch (err) {
      console.error("Erro ao enviar solicitação:", err);
      toast.error('Erro ao enviar solicitação');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-16 flex flex-col items-center justify-center">
          <Spinner size="lg" variant="shield" />
          <p className="text-fantasy-stone mt-4">Carregando detalhes da mesa...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto py-16 text-center">
          <div className="fantasy-card p-8">
            <h2 className="text-2xl text-red-500 mb-4">Erro</h2>
            <p className="text-fantasy-stone mb-6">{error}</p>
            <Button 
              onClick={() => navigate('/tables')}
              className="fantasy-button primary"
            >
              Voltar para Mesas
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!tableDetails) {
    return (
      <MainLayout>
        <div className="container mx-auto py-16 text-center">
          <div className="fantasy-card p-8">
            <h2 className="text-2xl text-fantasy-purple mb-4">Mesa não encontrada</h2>
            <p className="text-fantasy-stone mb-6">Não foi possível encontrar os detalhes desta mesa.</p>
            <Button 
              onClick={() => navigate('/tables')}
              className="fantasy-button primary"
            >
              Voltar para Mesas
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const isTableFull = participants.length >= (tableDetails.max_players || 5);

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="fantasy-card p-6 mb-6">
          <h1 className="text-3xl font-medievalsharp text-fantasy-purple mb-4">
            {tableDetails.name}
          </h1>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <div className="flex items-center mb-2">
                <Book className="mr-2 text-fantasy-gold" />
                <span className="text-fantasy-stone">Campanha: {tableDetails.campaign || 'Não definida'}</span>
              </div>
              <div className="flex items-center mb-2">
                <Sword className="mr-2 text-fantasy-gold" />
                <span className="text-fantasy-stone">Sistema: {tableDetails.system || 'D&D 5e'}</span>
              </div>
              <div className="flex items-center mb-2">
                <Calendar className="mr-2 text-fantasy-gold" />
                <span className="text-fantasy-stone">
                  {tableDetails.weekday || 'Dia não definido'} - {tableDetails.time || 'Horário não definido'}
                </span>
              </div>
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <Users className="mr-2 text-fantasy-gold" />
                <span className="text-fantasy-stone">
                  Participantes: {participants.length} / {tableDetails.max_players || 5}
                </span>
              </div>
              <div className="flex items-center mb-2">
                <MapPin className="mr-2 text-fantasy-gold" />
                <span className="text-fantasy-stone">{tableDetails.meeting_url || 'Local não definido'}</span>
              </div>
              <div className="flex items-center mb-2">
                <Clock className="mr-2 text-fantasy-gold" />
                <span className="text-fantasy-stone">Status: {tableDetails.status || 'aberto'}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-medievalsharp text-fantasy-stone mb-2">Sinopse</h2>
            <p className="text-fantasy-stone">{tableDetails.synopsis || 'Nenhuma sinopse disponível'}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-medievalsharp text-fantasy-stone mb-2">
              Participantes Confirmados ({participants.length})
            </h2>
            {participants.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {participants.map((participant) => (
                  <div 
                    key={participant.id} 
                    className="bg-fantasy-dark/50 px-3 py-1 rounded-full text-fantasy-stone"
                  >
                    {participant.profiles?.display_name || 'Jogador'}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-fantasy-stone italic">Nenhum participante confirmado ainda</p>
            )}
          </div>

          {tableDetails.status === 'open' && (
            <div className="flex justify-center">
              {isTableFull ? (
                <div className="text-red-500 font-bold">Mesa completa</div>
              ) : joinRequestStatus === 'approved' ? (
                <div className="text-green-500 font-bold">Você já é um participante desta mesa</div>
              ) : (
                <Button 
                  onClick={handleJoinRequest} 
                  disabled={joinRequestStatus === 'pending'}
                  className="fantasy-button primary"
                >
                  {joinRequestStatus === 'pending' ? 'Solicitação Enviada' : 'Solicitar Participação'}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default TableDetailsView;
