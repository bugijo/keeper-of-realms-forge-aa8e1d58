import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Play, Pause, Bell } from 'lucide-react';
import MapTab from './MapTab';
import NotesTab from './NotesTab';
import StoryTab from './StoryTab';
import ChatTab from './ChatTab';
import PlayersTab from './PlayersTab';

interface GameMasterPanelProps {
  sessionId: string;
  userId: string;
  isPaused?: boolean;
  onTogglePause?: () => void;
}

interface GamePlayer {
  id: string;
  name: string;
  characterId: string | null;
  characterName: string | null;
  characterClass: string | null;
  characterRace: string | null;
  characterLevel: number | null;
  online: boolean;
}

const GameMasterPanel: React.FC<GameMasterPanelProps> = ({ 
  sessionId, 
  userId,
  isPaused = false,
  onTogglePause
}) => {
  const [activeTab, setActiveTab] = useState('players');
  const [players, setPlayers] = useState<GamePlayer[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchParticipants = async () => {
      if (!sessionId) return;
      
      try {
        setLoading(true);
        
        // Buscar participantes da mesa
        const { data: participants, error: participantsError } = await supabase
          .from('table_participants')
          .select(`
            id,
            user_id,
            character_id,
            profiles:profiles(display_name),
            characters:characters(id, name, race, class, level)
          `)
          .eq('table_id', sessionId);
        
        if (participantsError) {
          throw participantsError;
        }
        
        if (participants) {
          // Processar os dados e mapear para o formato esperado
          const processedPlayers: GamePlayer[] = participants.map(participant => {
            const profile = participant.profiles as { display_name: string } | null;
            return {
              id: participant.id,
              name: profile?.display_name || 'Jogador',
              characterId: participant.character_id,
              characterName: participant.characters?.name || null,
              characterClass: participant.characters?.class || null,
              characterRace: participant.characters?.race || null,
              characterLevel: participant.characters?.level || null,
              online: true // Podemos atualizar isso com status real depois
            };
          });
          
          setPlayers(processedPlayers);
        }
      } catch (error) {
        console.error('Erro ao buscar participantes:', error);
        toast.error('Erro ao carregar participantes da sessão');
      } finally {
        setLoading(false);
      }
    };
    
    fetchParticipants();
  }, [sessionId]);
  
  const notifyPlayers = async () => {
    try {
      // Obter todos os participantes da mesa
      const { data: participants, error: participantsError } = await supabase
        .from('table_participants')
        .select('user_id')
        .eq('table_id', sessionId)
        .neq('user_id', userId); // Excluir o próprio mestre
      
      if (participantsError) throw participantsError;
      
      if (!participants || participants.length === 0) {
        toast.info('Não há jogadores para notificar');
        return;
      }
      
      // Obter dados da mesa
      const { data: tableData, error: tableError } = await supabase
        .from('tables')
        .select('name')
        .eq('id', sessionId)
        .single();
      
      if (tableError) throw tableError;
      
      // Criar notificações para cada participante
      const notifications = participants.map(participant => ({
        user_id: participant.user_id,
        title: 'Atenção requerida!',
        content: `O mestre está chamando a atenção na mesa "${tableData.name}"!`,
        type: 'attention',
        reference_type: 'table',
        reference_id: sessionId
      }));
      
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert(notifications);
      
      if (notificationError) throw notificationError;
      
      toast.success('Jogadores notificados com sucesso!');
    } catch (error) {
      console.error('Erro ao notificar jogadores:', error);
      toast.error('Erro ao enviar notificações');
    }
  };
  
  return (
    <div className="bg-fantasy-dark border border-fantasy-purple/30 w-96 h-full flex flex-col">
      <div className="p-3 border-b border-fantasy-purple/30 flex justify-between items-center">
        <h2 className="text-xl font-medievalsharp text-fantasy-gold">
          Painel do Mestre
        </h2>
        <div className="flex items-center gap-2">
          {onTogglePause && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onTogglePause}
              className="text-fantasy-stone hover:text-white hover:bg-fantasy-dark"
              title={isPaused ? "Retomar sessão" : "Pausar sessão"}
            >
              {isPaused ? <Play size={20} /> : <Pause size={20} />}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={notifyPlayers}
            className="text-fantasy-stone hover:text-white hover:bg-fantasy-dark"
            title="Notificar jogadores"
          >
            <Bell size={20} />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="border-b border-fantasy-purple/30 bg-transparent">
          <TabsTrigger value="players" className="data-[state=active]:bg-fantasy-purple/20">Jogadores</TabsTrigger>
          <TabsTrigger value="map" className="data-[state=active]:bg-fantasy-purple/20">Mapa</TabsTrigger>
          <TabsTrigger value="chat" className="data-[state=active]:bg-fantasy-purple/20">Chat</TabsTrigger>
          <TabsTrigger value="notes" className="data-[state=active]:bg-fantasy-purple/20">Notas</TabsTrigger>
          <TabsTrigger value="story" className="data-[state=active]:bg-fantasy-purple/20">História</TabsTrigger>
        </TabsList>
        
        <TabsContent value="players" className="flex-1 overflow-y-auto p-4">
          <PlayersTab players={players} />
        </TabsContent>
        
        <TabsContent value="map" className="flex-1 overflow-y-auto p-4">
          <MapTab />
        </TabsContent>
        
        <TabsContent value="chat" className="flex-1 overflow-y-auto p-4">
          <ChatTab />
        </TabsContent>
        
        <TabsContent value="notes" className="flex-1 overflow-y-auto p-4">
          <NotesTab />
        </TabsContent>
        
        <TabsContent value="story" className="flex-1 overflow-y-auto p-4">
          <StoryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GameMasterPanel;
