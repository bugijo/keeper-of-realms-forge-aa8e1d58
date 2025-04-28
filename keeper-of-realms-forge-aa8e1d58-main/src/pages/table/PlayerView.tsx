
import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Create a simple component for the player's view in the game table
// This will be expanded later with more functionality
const TablePlayerView = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [tableData, setTableData] = React.useState<any>(null);
  const [character, setCharacter] = React.useState<any>(null);
  const [otherPlayers, setOtherPlayers] = React.useState<any[]>([]);
  const [profiles, setProfiles] = React.useState<Record<string, any>>({});

  React.useEffect(() => {
    const fetchData = async () => {
      if (!id || !user) return;
      
      try {
        setLoading(true);
        
        // First fetch all profiles to have display names available
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, display_name');
          
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        } else {
          // Create a map of profiles by ID for easy lookup
          const profilesMap: Record<string, any> = {};
          profilesData?.forEach(profile => {
            profilesMap[profile.id] = profile;
          });
          setProfiles(profilesMap);
        }
        
        // Fetch table data
        const { data: tableData, error: tableError } = await supabase
          .from('tables')
          .select('*')
          .eq('id', id)
          .single();
          
        if (tableError) throw tableError;
        setTableData(tableData);
        
        // Check if user is a participant
        const { data: participationData, error: participationError } = await supabase
          .from('table_participants')
          .select('*, characters:character_id(*)')
          .eq('table_id', id)
          .eq('user_id', user.id)
          .single();
          
        if (participationError) {
          if (participationError.code !== 'PGRST116') {
            throw participationError;
          }
          toast.error('Você não está participando desta mesa');
          return;
        }
        
        if (participationData?.characters) {
          setCharacter(participationData.characters);
        }
        
        // Get other players
        const { data: otherPlayersData, error: otherPlayersError } = await supabase
          .from('table_participants')
          .select(`
            id, 
            user_id,
            role,
            character_id,
            characters:character_id (id, name, class, race, level)
          `)
          .eq('table_id', id)
          .neq('user_id', user.id);
          
        if (otherPlayersError) throw otherPlayersError;
        
        setOtherPlayers(otherPlayersData || []);
        
      } catch (error) {
        console.error('Error fetching table data:', error);
        toast.error('Erro ao carregar dados da mesa');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, user]);
  
  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="animate-pulse text-fantasy-purple">Carregando...</div>
        </div>
      </MainLayout>
    );
  }
  
  // Get display name for a user from our profiles map
  const getDisplayName = (userId: string) => {
    return profiles[userId]?.display_name || "Jogador";
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-medievalsharp text-white mb-6">{tableData?.name || "Mesa de RPG"}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="fantasy-card p-4">
              <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-4">Seu Personagem</h2>
              {character ? (
                <div>
                  <p className="text-lg font-medievalsharp">{character.name}</p>
                  <p className="text-fantasy-stone">{character.race} {character.class} (Nível {character.level})</p>
                </div>
              ) : (
                <p className="text-fantasy-stone">Você não tem um personagem selecionado para esta mesa.</p>
              )}
            </div>
            
            <div className="fantasy-card p-4">
              <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-4">Grupo de Aventureiros</h2>
              <div className="space-y-3">
                {otherPlayers.map(player => (
                  <div key={player.id} className="p-3 bg-fantasy-dark/40 rounded-lg">
                    <p className="text-white">{getDisplayName(player.user_id)}</p>
                    {player.characters ? (
                      <p className="text-sm text-fantasy-stone">
                        {player.characters.name} - {player.characters.race} {player.characters.class} (Nível {player.characters.level})
                      </p>
                    ) : (
                      <p className="text-sm text-fantasy-stone">Sem personagem selecionado</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="fantasy-card p-4">
              <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-4">Mapa da Aventura</h2>
              <div className="bg-fantasy-dark/30 h-64 rounded-lg flex items-center justify-center">
                <p className="text-fantasy-stone">O mestre ainda não compartilhou nenhum mapa.</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="fantasy-card p-4">
              <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-4">Informações da Campanha</h2>
              <div className="space-y-2">
                <div>
                  <h3 className="text-sm text-fantasy-stone">Sistema</h3>
                  <p className="text-white">{tableData?.system || "D&D 5e"}</p>
                </div>
                <div>
                  <h3 className="text-sm text-fantasy-stone">Campanha</h3>
                  <p className="text-white">{tableData?.campaign || "Campanha sem nome"}</p>
                </div>
                <div>
                  <h3 className="text-sm text-fantasy-stone">Mestre</h3>
                  <p className="text-white">
                    {otherPlayers.find(p => p.role === 'gm')
                      ? getDisplayName(otherPlayers.find(p => p.role === 'gm').user_id)
                      : "Não definido"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="fantasy-card p-4">
              <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-4">Chat</h2>
              <div className="bg-fantasy-dark/30 h-48 rounded-lg p-3 mb-2">
                <p className="text-fantasy-stone text-center">Nenhuma mensagem ainda.</p>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text"
                  className="flex-grow bg-fantasy-dark/60 rounded p-2 text-white focus:outline-none focus:ring-1 focus:ring-fantasy-purple"
                  placeholder="Digite sua mensagem..."
                />
                <button className="fantasy-button primary">Enviar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TablePlayerView;
