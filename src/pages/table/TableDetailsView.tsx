
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Calendar, Users, Sword, MapPin, Clock, Book } from 'lucide-react';

const TableDetailsView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const [tableDetails, setTableDetails] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [joinRequestStatus, setJoinRequestStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchTableDetails = async () => {
      if (!id) return;

      // Fetch table details
      const { data: tableData, error: tableError } = await supabase
        .from('tables')
        .select('*')
        .eq('id', id)
        .single();

      if (tableError) {
        toast.error('Erro ao carregar detalhes da mesa');
        return;
      }

      setTableDetails(tableData);

      // Fetch participants
      const { data: participantsData, error: participantsError } = await supabase
        .from('table_participants')
        .select('*, profiles(display_name)')
        .eq('table_id', id);

      if (participantsError) {
        toast.error('Erro ao carregar participantes');
        return;
      }

      setParticipants(participantsData);

      // Check existing join request
      if (session?.user) {
        const { data: requestData } = await supabase
          .from('table_join_requests')
          .select('status')
          .eq('table_id', id)
          .eq('user_id', session.user.id)
          .single();

        setJoinRequestStatus(requestData?.status || null);
      }
    };

    fetchTableDetails();
  }, [id, session]);

  const handleJoinRequest = async () => {
    if (!session?.user) {
      toast.error('Você precisa estar logado para solicitar participação');
      return;
    }

    const { error } = await supabase
      .from('table_join_requests')
      .insert({
        table_id: id,
        user_id: session.user.id,
        status: 'pending'
      });

    if (error) {
      toast.error('Erro ao enviar solicitação');
      return;
    }

    toast.success('Solicitação de participação enviada');
    setJoinRequestStatus('pending');
  };

  if (!tableDetails) return <div>Carregando...</div>;

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
                <span className="text-fantasy-stone">Campanha: {tableDetails.campaign}</span>
              </div>
              <div className="flex items-center mb-2">
                <Sword className="mr-2 text-fantasy-gold" />
                <span className="text-fantasy-stone">Sistema: {tableDetails.system}</span>
              </div>
              <div className="flex items-center mb-2">
                <Calendar className="mr-2 text-fantasy-gold" />
                <span className="text-fantasy-stone">
                  {tableDetails.weekday} - {tableDetails.time}
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
                <span className="text-fantasy-stone">Status: {tableDetails.status}</span>
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
          </div>

          {tableDetails.status === 'open' && (
            <div className="flex justify-center">
              {isTableFull ? (
                <div className="text-red-500 font-bold">Mesa completa</div>
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
