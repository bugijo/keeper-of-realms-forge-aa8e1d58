import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { ArrowLeft, User, Users, Shield, MessageSquare, MapPin, Dices, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DiceRoller from '@/components/dice/DiceRoller';
import TacticalMapWithFog from '@/components/game/TacticalMapWithFog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from 'sonner';

interface Player {
  id: string;
  name: string;
  character?: {
    id: string;
    name: string;
    class: string;
    race: string;
    level: number;
  };
  isGameMaster?: boolean;
}

interface MapToken {
  id: string;
  x: number;
  y: number;
  color: string;
  label: string;
  size: number;
}

const PlayerView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState<any>(null);
  const [character, setCharacter] = useState<any>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameMaster, setGameMaster] = useState<Player | null>(null);
  const [activeTab, setActiveTab] = useState('character');
  
  const [mapImageUrl, setMapImageUrl] = useState('/placeholder.svg');
  const [fogOfWar, setFogOfWar] = useState<{x: number, y: number}[]>([]);
  const [mapTokens, setMapTokens] = useState<MapToken[]>([]);
  
  const [messages, setMessages] = useState([
    { sender: "Sistema", text: "Bem-vindo à sessão!" },
    { sender: "Mestre", text: "Preparem-se para a aventura!" }
  ]);
  const [newMessage, setNewMessage] = useState("");
  
  useEffect(() => {
    const fetchData = async () => {
      if (!id || !user) return;
      
      try {
        setLoading(true);
        
        const { data: tableData, error: tableError } = await supabase
          .from('tables')
          .select('*')
          .eq('id', id)
          .single();
          
        if (tableError) throw tableError;
        
        setTableData(tableData);
        
        const { data: participationData, error: participationError } = await supabase
          .from('table_participants')
          .select(`
            id, 
            user_id,
            role,
            character_id,
            characters:character_id(*)
          `)
          .eq('table_id', id)
          .eq('user_id', user.id)
          .single();
          
        if (participationError) {
          if (participationError.code === 'PGRST116') {
            toast.error('Você não está participando desta mesa');
            navigate('/tables');
            return;
          }
          throw participationError;
        }
        
        if (participationData.role === 'gm') {
          navigate(`/table/gm/${id}`);
          return;
        }
        
        if (participationData.characters) {
          setCharacter(participationData.characters);
        }
        
        const { data: allParticipantsData, error: allParticipantsError } = await supabase
          .from('table_participants')
          .select(`
            id, 
            user_id,
            role,
            character_id,
            profiles:user_id (display_name),
            characters:character_id (id, name, class, race, level)
          `)
          .eq('table_id', id);
          
        if (allParticipantsError) throw allParticipantsError;
        
        const playersData: Player[] = [];
        let gmData: Player | null = null;
        
        (allParticipantsData || []).forEach(p => {
          const player: Player = {
            id: p.id,
            name: p.profiles?.display_name || "Jogador sem nome",
            isGameMaster: p.role === 'gm'
          };
          
          if (p.characters) {
            player.character = {
              id: p.characters.id,
              name: p.characters.name,
              class: p.characters.class,
              race: p.characters.race,
              level: p.characters.level
            };
          }
          
          if (p.role === 'gm') {
            gmData = player;
          } else if (p.user_id !== user.id) {
            playersData.push(player);
          }
        });
        
        setPlayers(playersData);
        setGameMaster(gmData);
        
        const tokens: MapToken[] = [];
        
        if (character) {
          tokens.push({
            id: 'self',
            x: 5,
            y: 5,
            color: 'rgb(59, 130, 246)',
            label: character.name.substring(0, 2),
            size: 1
          });
        }
        
        playersData.forEach((player, index) => {
          if (player.character) {
            tokens.push({
              id: player.id,
              x: 5 + (index + 1) * 2,
              y: 5,
              color: getPlayerColor(index),
              label: player.character.name.substring(0, 2),
              size: 1
            });
          }
        });
        
        setMapTokens(tokens);
        
      } catch (error) {
        console.error('Error fetching table data:', error);
        toast.error('Erro ao carregar dados da mesa');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, user, navigate]);
  
  const getPlayerColor = (index: number): string => {
    const colors = [
      'rgb(16, 185, 129)',
      'rgb(239, 68, 68)',
      'rgb(217, 119, 6)',
      'rgb(139, 92, 246)',
      'rgb(236, 72, 153)',
      'rgb(14, 165, 233)',
      'rgb(168, 85, 247)'
    ];
    return colors[index % colors.length];
  };
  
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const playerName = character ? character.name : 'Jogador';
    setMessages([...messages, { sender: playerName, text: newMessage }]);
    setNewMessage("");
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6">
          <div className="fantasy-card p-6 text-center">
            <p className="text-fantasy-stone animate-pulse">Carregando sessão...</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!tableData) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6">
          <div className="fantasy-card p-6 text-center">
            <p className="text-fantasy-stone">Mesa não encontrada ou você não tem permissão para acessá-la.</p>
            <Link to="/tables" className="fantasy-button primary mt-4 inline-block">
              Voltar para Mesas
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6 justify-between">
          <div className="flex items-center">
            <Link to="/tables" className="mr-4">
              <ArrowLeft className="text-fantasy-stone hover:text-white transition-colors" />
            </Link>
            <h1 className="text-3xl font-medievalsharp text-white">{tableData.name}</h1>
          </div>
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-fantasy-dark/70 border-b border-fantasy-purple/30 p-0 rounded-none w-full grid grid-cols-5">
            <TabsTrigger 
              value="character" 
              className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-fantasy-gold rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent flex items-center gap-2"
            >
              <User size={16} />
              Personagem
            </TabsTrigger>
            <TabsTrigger 
              value="party" 
              className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-fantasy-gold rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent flex items-center gap-2"
            >
              <Users size={16} />
              Grupo
            </TabsTrigger>
            <TabsTrigger 
              value="map" 
              className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-fantasy-gold rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent flex items-center gap-2"
            >
              <MapPin size={16} />
              Mapa
            </TabsTrigger>
            <TabsTrigger 
              value="chat" 
              className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-fantasy-gold rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent flex items-center gap-2"
            >
              <MessageSquare size={16} />
              Chat
            </TabsTrigger>
            <TabsTrigger 
              value="dice" 
              className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-fantasy-gold rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent flex items-center gap-2"
            >
              <Dices size={16} />
              Dados
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="character" className="pt-4">
            {character ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="fantasy-card p-4">
                  <div className="h-40 w-40 mx-auto rounded-full overflow-hidden border-4 border-fantasy-purple/30 mb-4">
                    <img 
                      src={character.image_url || "/lovable-uploads/6be414ac-e1d0-4348-8246-9fe914618c47.png"} 
                      alt={character.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <h2 className="text-xl font-medievalsharp text-center text-white mb-1">{character.name}</h2>
                  <p className="text-center text-fantasy-stone mb-4">
                    Nível {character.level} {character.race} {character.class}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-fantasy-stone">Antecedente:</span>
                      <span className="text-white">{character.background || "Desconhecido"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-fantasy-stone">Alinhamento:</span>
                      <span className="text-white">{character.alignment || "Não especificado"}</span>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <div className="fantasy-card p-6">
                    <h3 className="text-xl font-medievalsharp text-white mb-4">Atributos & Combate</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                      {character.attributes && [
                        { name: 'STR', value: character.attributes.str || 10 },
                        { name: 'DEX', value: character.attributes.dex || 10 },
                        { name: 'CON', value: character.attributes.con || 10 },
                        { name: 'INT', value: character.attributes.int || 10 },
                        { name: 'WIS', value: character.attributes.wis || 10 },
                        { name: 'CHA', value: character.attributes.cha || 10 }
                      ].map((stat) => (
                        <div key={stat.name} className="bg-fantasy-dark/30 p-3 rounded-lg text-center">
                          <div className="text-xs text-fantasy-stone uppercase mb-1">{stat.name}</div>
                          <div className="text-2xl font-medievalsharp text-white">{stat.value}</div>
                          <div className="text-sm text-fantasy-gold mt-1">
                            {Math.floor((stat.value - 10) / 2) >= 0 ? '+' : ''}{Math.floor((stat.value - 10) / 2)}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="bg-gradient-to-br from-red-900/40 to-red-600/20 p-3 rounded-lg text-center">
                        <div className="text-xs text-fantasy-stone uppercase mb-1">Pontos de Vida</div>
                        <div className="text-xl font-medievalsharp text-white flex items-center justify-center gap-1">
                          <Heart size={18} className="text-red-400" />
                          {character.attributes?.hp?.current || 10}/{character.attributes?.hp?.max || 10}
                        </div>
                      </div>
                      <div className="bg-fantasy-dark/30 p-3 rounded-lg text-center">
                        <div className="text-xs text-fantasy-stone uppercase mb-1">Classe de Armadura</div>
                        <div className="text-xl font-medievalsharp text-white flex items-center justify-center gap-1">
                          <Shield size={16} className="text-fantasy-purple" />
                          {character.attributes?.ac || 10}
                        </div>
                      </div>
                      <div className="bg-fantasy-dark/30 p-3 rounded-lg text-center">
                        <div className="text-xs text-fantasy-stone uppercase mb-1">Iniciativa</div>
                        <div className="text-xl font-medievalsharp text-white">
                          {Math.floor((character.attributes?.dex - 10) / 2) >= 0 ? '+' : ''}{Math.floor((character.attributes?.dex - 10) / 2) || 0}
                        </div>
                      </div>
                      <div className="bg-fantasy-dark/30 p-3 rounded-lg text-center">
                        <div className="text-xs text-fantasy-stone uppercase mb-1">Deslocamento</div>
                        <div className="text-xl font-medievalsharp text-white">{character.attributes?.speed || 30}ft</div>
                      </div>
                      <div className="bg-fantasy-dark/30 p-3 rounded-lg text-center">
                        <div className="text-xs text-fantasy-stone uppercase mb-1">Bônus de Prof.</div>
                        <div className="text-xl font-medievalsharp text-white">
                          +{Math.floor(2 + (character.level - 1) / 4) || 2}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="fantasy-card p-6 mt-4">
                    <h3 className="text-xl font-medievalsharp text-white mb-4 flex items-center gap-2">
                      <Star size={20} className="text-fantasy-gold" />
                      Ações Rápidas
                    </h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <Button variant="default" className="bg-fantasy-purple/20 hover:bg-fantasy-purple/40">
                        Ataque Corpo a Corpo
                      </Button>
                      <Button variant="default" className="bg-fantasy-purple/20 hover:bg-fantasy-purple/40">
                        Ataque à Distância
                      </Button>
                      <Button variant="default" className="bg-fantasy-purple/20 hover:bg-fantasy-purple/40">
                        Lançar Magia
                      </Button>
                      <Button variant="default" className="bg-fantasy-purple/20 hover:bg-fantasy-purple/40">
                        Usar Item
                      </Button>
                      <Button variant="default" className="bg-fantasy-purple/20 hover:bg-fantasy-purple/40">
                        Estabilizar Aliado
                      </Button>
                      <Button variant="default" className="bg-fantasy-purple/20 hover:bg-fantasy-purple/40">
                        Esquivar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="fantasy-card p-6 text-center">
                <p className="text-fantasy-stone mb-4">Você não tem um personagem selecionado para esta mesa.</p>
                <Link to="/character" className="fantasy-button primary">
                  Escolher ou criar um personagem
                </Link>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="party" className="pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 fantasy-card p-4">
                <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-4">Grupo de Aventureiros</h2>
                
                <div className="space-y-4">
                  {gameMaster && (
                    <div className="p-3 bg-fantasy-dark/60 rounded-lg">
                      <div className="flex items-center">
                        <Shield size={20} className="text-fantasy-gold mr-2" />
                        <div>
                          <p className="text-white font-medievalsharp">Mestre de Jogo</p>
                          <p className="text-sm text-fantasy-stone">{gameMaster.name}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {character && (
                    <div className="p-3 bg-fantasy-purple/20 border border-fantasy-purple/40 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-white font-medievalsharp">{character.name} (Você)</p>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-fantasy-purple/30 text-fantasy-purple">
                          Nível {character.level}
                        </span>
                      </div>
                      <p className="text-sm text-fantasy-stone">
                        {character.race} {character.class}
                      </p>
                    </div>
                  )}
                  
                  {players.length > 0 ? players.map((player) => (
                    <div key={player.id} className="p-3 bg-fantasy-dark/40 rounded-lg">
                      {player.character ? (
                        <>
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-white font-medievalsharp">{player.character.name}</p>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-fantasy-purple/20 text-fantasy-stone">
                              Nível {player.character.level}
                            </span>
                          </div>
                          <p className="text-sm text-fantasy-stone">
                            {player.character.race} {player.character.class} • {player.name}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-white font-medievalsharp">{player.name}</p>
                          <p className="text-sm text-fantasy-stone">Sem personagem selecionado</p>
                        </>
                      )}
                    </div>
                  )) : (
                    <p className="text-fantasy-stone text-center p-4">
                      Nenhum outro jogador encontrado nesta mesa.
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <div className="fantasy-card p-4 mb-4">
                  <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-2">Informações da Sessão</h2>
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm text-fantasy-stone">Campanha</h3>
                      <p className="text-white">{tableData.campaign || "Campanha sem nome"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-fantasy-stone">Sistema</h3>
                      <p className="text-white">{tableData.system || "D&D 5e"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-fantasy-stone">Mestre</h3>
                      <p className="text-white">{gameMaster?.name || "Não definido"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="fantasy-card p-4">
                  <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-2">Resumo da História</h2>
                  <p className="text-fantasy-stone">
                    {tableData.synopsis || "Nenhuma sinopse disponível para esta aventura."}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="map" className="pt-4">
            <div className="fantasy-card p-4">
              <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-4">Mapa da Aventura</h2>
              
              <div className="flex justify-center">
                <TacticalMapWithFog 
                  mapImageUrl={mapImageUrl}
                  fogPoints={fogOfWar}
                  tokens={mapTokens}
                  isGameMaster={false}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="chat" className="pt-4">
            <div className="fantasy-card p-4">
              <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-3">Chat da Sessão</h2>
              <div className="h-96 overflow-y-auto mb-4 p-3 bg-fantasy-dark/40 rounded-lg">
                {messages.map((message, index) => (
                  <div key={index} className={`p-3 rounded mb-2 ${message.sender === "Mestre" ? 'bg-fantasy-purple/30' : message.sender === "Sistema" ? 'bg-gray-700/30' : 'bg-fantasy-dark/40'}`}>
                    <span className={`text-sm font-medium ${message.sender === "Mestre" ? 'text-fantasy-gold' : message.sender === "Sistema" ? 'text-gray-400' : 'text-blue-300'}`}>
                      {message.sender}:
                    </span>
                    <p className="text-sm text-white">{message.text}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={sendMessage} className="mt-4">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-grow bg-fantasy-dark/50 text-white rounded-l-md py-2 px-3 focus:outline-none"
                  />
                  <Button type="submit" className="fantasy-button primary rounded-l-none text-sm py-2.5">Enviar</Button>
                </div>
              </form>
            </div>
          </TabsContent>
          
          <TabsContent value="dice" className="pt-4">
            <div className="fantasy-card p-4">
              <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-4">Rolagem de Dados</h2>
              <div className="flex justify-center">
                <DiceRoller />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default PlayerView;
