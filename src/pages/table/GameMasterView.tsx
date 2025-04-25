
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import DiceRoller from '@/components/dice/DiceRoller';
import CombatTracker from '@/components/game/CombatTracker';
import TacticalMapWithFog from '@/components/game/TacticalMapWithFog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from 'sonner';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from '@/components/ui/tabs';
import { 
  BookOpen, 
  MapPin, 
  Sword, 
  Users, 
  MessageSquare,
  Dices,
  FileText,
  Skull,
  PlusCircle,
  Minus,
  Plus,
  Play,
  ArrowLeft,
  Pause,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

interface MapToken {
  id: string;
  x: number;
  y: number;
  color: string;
  label: string;
  size: number;
}

interface CombatCharacter {
  id: string;
  name: string;
  initiative: number;
  armorClass: number;
  hitPoints: number;
  maxHitPoints: number;
  temporary?: number;
  conditions: string[];
  type: 'player' | 'monster' | 'npc';
}

const GameMasterView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Table and session state
  const [tableData, setTableData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("story");
  
  // Players state
  const [players, setPlayers] = useState<GamePlayer[]>([]);
  
  // Story state
  const [currentStorySegment, setCurrentStorySegment] = useState(0);
  const [storySegments, setStorySegments] = useState([
    {
      id: 1,
      text: "Os aventureiros chegam à entrada da caverna. O vento frio sopra da abertura escura, trazendo um odor de umidade e algo queimado. Pegadas recentes sugerem que outras criaturas entraram recentemente.",
      notes: "Permita que os jogadores investiguem a entrada. DC 14 Percepção pode revelar pegadas de goblins."
    },
    {
      id: 2,
      text: "Após avançar pelos corredores estreitos, vocês ouvem vozes ásperas à frente. Espreitando, vocês veem quatro goblins dividindo um saque ao redor de uma pequena fogueira.",
      notes: "Os goblins estão distraídos. Jogadores podem tentar furtividade ou combate direto."
    },
    {
      id: 3, 
      text: "O corredor se abre em uma câmara maior. Um ogro enorme está sentado em um trono improvisado, roendo um osso. Ele parece ser o líder desses goblins.",
      notes: "O ogro tem 35 pontos de vida e ataca com uma clava (1d10+3 de dano)."
    }
  ]);
  
  // Map state
  const [mapImageUrl, setMapImageUrl] = useState('/placeholder.svg');
  const [fogOfWar, setFogOfWar] = useState<{x: number, y: number}[]>([]);
  const [mapTokens, setMapTokens] = useState<MapToken[]>([]);
  const [maps, setMaps] = useState<{id: string, name: string, image_url: string | null, description: string | null}[]>([]);
  const [activeMap, setActiveMap] = useState<string | null>(null);
  
  // Combat state
  const [combatCharacters, setCombatCharacters] = useState<CombatCharacter[]>([]);
  const [isCombatActive, setIsCombatActive] = useState(false);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [newCharacter, setNewCharacter] = useState({
    name: '',
    armorClass: '10',
    hitPoints: '10',
    type: 'monster'
  });
  
  // Chat state
  const [messages, setMessages] = useState([
    { sender: "Sistema", text: "Sessão iniciada" },
    { sender: "Mestre", text: "Bem-vindos à aventura!" }
  ]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchTableData = async () => {
      if (!id || !user) return;
      
      try {
        setLoading(true);
        
        // Fetch table data
        const { data: tableData, error: tableError } = await supabase
          .from('tables')
          .select('*')
          .eq('id', id)
          .single();
          
        if (tableError) throw tableError;
        
        // Check if user is the game master
        if (tableData.user_id !== user.id) {
          toast.error('Você não tem permissão para acessar esta página');
          navigate('/tables');
          return;
        }
        
        setTableData(tableData);
        
        // Fetch participants with their characters
        const { data: participantsData, error: participantsError } = await supabase
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
          
        if (participantsError) throw participantsError;
        
        // Format players data
        const playersData = (participantsData || [])
          .filter(p => p.role !== 'gm')
          .map(p => ({
            id: p.id,
            name: p.profiles?.display_name || "Jogador sem nome",
            characterId: p.characters?.id || null,
            characterName: p.characters?.name || null,
            characterClass: p.characters?.class || null,
            characterRace: p.characters?.race || null,
            characterLevel: p.characters?.level || null,
            online: Math.random() > 0.5 // Mock online status
          }));
        
        setPlayers(playersData);
        
        // Initialize combat characters with player characters
        const combatChars = playersData
          .filter(p => p.characterName)
          .map(p => ({
            id: p.characterId || `player-${p.id}`,
            name: p.characterName || p.name,
            initiative: 0,
            armorClass: 12, // Default value
            hitPoints: 10, // Default value
            maxHitPoints: 10, // Default value
            conditions: [],
            type: 'player' as const
          }));
        
        setCombatCharacters(combatChars);
        
        // Fetch maps
        const { data: mapsData, error: mapsError } = await supabase
          .from('maps')
          .select('id, name, image_url, description')
          .eq('user_id', user.id);
          
        if (mapsError) throw mapsError;
        
        setMaps(mapsData || []);
        
        // Initialize map tokens for each player character
        const initialTokens = playersData
          .filter(p => p.characterName)
          .map((p, idx) => ({
            id: p.characterId || `player-token-${p.id}`,
            x: 5 + idx * 2,
            y: 5,
            color: getPlayerColor(idx),
            label: (p.characterName || p.name).substring(0, 2),
            size: 1
          }));
        
        setMapTokens(initialTokens);
        
      } catch (error) {
        console.error('Error fetching table data:', error);
        toast.error('Erro ao carregar dados da mesa');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTableData();
  }, [id, user, navigate]);

  // Helper functions
  const getPlayerColor = (index: number): string => {
    const colors = [
      'rgb(59, 130, 246)', // blue
      'rgb(16, 185, 129)', // green
      'rgb(239, 68, 68)', // red
      'rgb(217, 119, 6)', // amber
      'rgb(139, 92, 246)', // purple
      'rgb(236, 72, 153)', // pink
      'rgb(14, 165, 233)', // sky
      'rgb(168, 85, 247)', // violet
    ];
    return colors[index % colors.length];
  };

  // Map handlers
  const handleMapClick = (x: number, y: number) => {
    // Toggle fog of war at the clicked position
    const existingFogIndex = fogOfWar.findIndex(point => point.x === x && point.y === y);
    
    if (existingFogIndex !== -1) {
      // Remove fog at this position
      setFogOfWar(fogOfWar.filter((_, idx) => idx !== existingFogIndex));
    } else {
      // Add fog at this position
      setFogOfWar([...fogOfWar, { x, y }]);
    }
  };
  
  const handleTokenMove = (tokenId: string, x: number, y: number) => {
    setMapTokens(prev => 
      prev.map(token => 
        token.id === tokenId ? { ...token, x, y } : token
      )
    );
  };
  
  const handleMapChange = (mapId: string) => {
    const selectedMap = maps.find(m => m.id === mapId);
    if (selectedMap) {
      setActiveMap(mapId);
      setMapImageUrl(selectedMap.image_url || '/placeholder.svg');
      // Reset fog when changing maps
      setFogOfWar([]);
    }
  };
  
  // Combat handlers
  const addCombatCharacter = () => {
    if (!newCharacter.name || !newCharacter.hitPoints || !newCharacter.armorClass) {
      toast.error('Preencha todos os campos do personagem');
      return;
    }
    
    const hp = parseInt(newCharacter.hitPoints);
    const ac = parseInt(newCharacter.armorClass);
    
    const newCombatChar: CombatCharacter = {
      id: `combat-${Date.now()}`,
      name: newCharacter.name,
      initiative: 0,
      armorClass: ac,
      hitPoints: hp,
      maxHitPoints: hp,
      conditions: [],
      type: newCharacter.type as 'player' | 'monster' | 'npc'
    };
    
    setCombatCharacters([...combatCharacters, newCombatChar]);
    
    // Reset form
    setNewCharacter({
      name: '',
      armorClass: '10',
      hitPoints: '10',
      type: 'monster'
    });
    
    // Add token to map for new character
    if (newCharacter.type === 'monster' || newCharacter.type === 'npc') {
      const newToken: MapToken = {
        id: newCombatChar.id,
        x: 10,
        y: 10,
        color: newCharacter.type === 'monster' ? 'rgb(220, 38, 38)' : 'rgb(217, 119, 6)',
        label: newCharacter.name.substring(0, 2),
        size: newCharacter.type === 'monster' ? 1 : 0.8
      };
      
      setMapTokens([...mapTokens, newToken]);
    }
  };
  
  const rollInitiative = (characterId: string) => {
    const roll = Math.floor(Math.random() * 20) + 1;
    setCombatCharacters(chars => 
      chars.map(char => 
        char.id === characterId ? { ...char, initiative: roll } : char
      )
    );
    
    const character = combatCharacters.find(c => c.id === characterId);
    if (character) {
      setCombatLog([...combatLog, `${character.name} rolou ${roll} para iniciativa.`]);
    }
  };
  
  const rollAllInitiatives = () => {
    const newCharacters = combatCharacters.map(char => {
      const roll = Math.floor(Math.random() * 20) + 1;
      return { ...char, initiative: roll };
    });
    
    setCombatCharacters(newCharacters);
    setCombatLog([...combatLog, `Todos os personagens rolaram iniciativa.`]);
  };
  
  const startCombat = () => {
    if (combatCharacters.some(char => char.initiative === 0)) {
      rollAllInitiatives();
    }
    
    // Sort by initiative
    const sortedCharacters = [...combatCharacters].sort((a, b) => b.initiative - a.initiative);
    setCombatCharacters(sortedCharacters);
    
    setIsCombatActive(true);
    setCurrentTurnIndex(0);
    setCombatLog([...combatLog, `Combate iniciado! Turno de ${sortedCharacters[0]?.name || 'ninguém'}.`]);
  };
  
  const nextTurn = () => {
    const nextIndex = (currentTurnIndex + 1) % combatCharacters.length;
    setCurrentTurnIndex(nextIndex);
    
    const nextCharacter = combatCharacters[nextIndex];
    if (nextCharacter) {
      setCombatLog([...combatLog, `Turno de ${nextCharacter.name}.`]);
    }
  };
  
  const endCombat = () => {
    setIsCombatActive(false);
    setCombatLog([...combatLog, `Combate encerrado.`]);
  };
  
  const removeCombatCharacter = (characterId: string) => {
    // Only remove non-player characters
    const character = combatCharacters.find(c => c.id === characterId);
    if (!character || character.type === 'player') return;
    
    setCombatCharacters(chars => chars.filter(char => char.id !== characterId));
    setCombatLog([...combatLog, `${character.name} foi removido do combate.`]);
    
    // Also remove token
    setMapTokens(tokens => tokens.filter(token => token.id !== characterId));
  };
  
  const updateCharacterHP = (characterId: string, change: number) => {
    setCombatCharacters(chars =>
      chars.map(char => {
        if (char.id !== characterId) return char;
        
        const newHP = Math.max(0, Math.min(char.maxHitPoints, char.hitPoints + change));
        
        // Log health change
        if (change < 0) {
          setCombatLog([...combatLog, `${char.name} recebeu ${-change} pontos de dano.`]);
        } else if (change > 0) {
          setCombatLog([...combatLog, `${char.name} curou ${change} pontos de vida.`]);
        }
        
        return { ...char, hitPoints: newHP };
      })
    );
  };
  
  // Chat handlers
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setMessages([...messages, { sender: "Mestre", text: newMessage }]);
    setNewMessage("");
  };
  
  // Notes handlers
  const [notes, setNotes] = useState("");
  
  // Story handlers
  const addStorySegment = () => {
    const newSegment = {
      id: storySegments.length + 1,
      text: "Novo segmento da história...",
      notes: "Notas para o mestre..."
    };
    
    setStorySegments([...storySegments, newSegment]);
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

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6 justify-between">
          <div className="flex items-center">
            <Link to={`/gm/${id}`} className="mr-4">
              <ArrowLeft className="text-fantasy-stone hover:text-white transition-colors" />
            </Link>
            <h1 className="text-3xl font-medievalsharp text-white">{tableData?.name || "Sessão de Jogo"}</h1>
          </div>
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-fantasy-dark/70 border-b border-fantasy-purple/30 p-0 rounded-none w-full flex justify-start overflow-x-auto">
            <TabsTrigger 
              value="story" 
              className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-fantasy-gold rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent flex items-center gap-2"
            >
              <BookOpen size={16} />
              História
            </TabsTrigger>
            <TabsTrigger 
              value="maps" 
              className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-fantasy-gold rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent flex items-center gap-2"
            >
              <MapPin size={16} />
              Mapas
            </TabsTrigger>
            <TabsTrigger 
              value="monsters" 
              className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-fantasy-gold rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent flex items-center gap-2"
            >
              <Skull size={16} />
              Monstros
            </TabsTrigger>
            <TabsTrigger 
              value="combat" 
              className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-fantasy-gold rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent flex items-center gap-2"
            >
              <Sword size={16} />
              Combate
            </TabsTrigger>
            <TabsTrigger 
              value="players" 
              className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-fantasy-gold rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent flex items-center gap-2"
            >
              <Users size={16} />
              Jogadores
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
            <TabsTrigger 
              value="notes" 
              className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-fantasy-gold rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent flex items-center gap-2"
            >
              <FileText size={16} />
              Notas
            </TabsTrigger>
          </TabsList>
          
          {/* Tab contents */}
          <TabsContent value="story" className="pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 fantasy-card">
                <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-3">Narrativa Atual</h2>
                <div className="prose prose-invert max-w-none">
                  {storySegments[currentStorySegment] && (
                    <>
                      <p>{storySegments[currentStorySegment].text}</p>
                      <div className="mt-4 bg-fantasy-dark/40 p-3 rounded">
                        <h3 className="text-sm font-medievalsharp text-fantasy-gold">Notas para o Mestre:</h3>
                        <p className="text-sm italic">{storySegments[currentStorySegment].notes}</p>
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-4 flex justify-between">
                  <Button 
                    onClick={() => setCurrentStorySegment(prev => Math.max(0, prev - 1))}
                    className="fantasy-button secondary text-sm py-1.5"
                    disabled={currentStorySegment === 0}
                  >
                    Segmento Anterior
                  </Button>
                  <Button 
                    onClick={() => setCurrentStorySegment(prev => Math.min(storySegments.length - 1, prev + 1))}
                    className="fantasy-button primary text-sm py-1.5"
                    disabled={currentStorySegment === storySegments.length - 1}
                  >
                    Próximo Segmento
                  </Button>
                </div>
              </div>
              
              <div className="fantasy-card">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-medievalsharp text-fantasy-purple">Roteiro da Aventura</h2>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={addStorySegment}
                    className="h-8 w-8 p-0"
                  >
                    <PlusCircle size={16} />
                  </Button>
                </div>
                <div className="space-y-3">
                  {storySegments.map((segment, index) => (
                    <div 
                      key={segment.id}
                      className={`p-3 rounded cursor-pointer ${currentStorySegment === index ? 'bg-fantasy-purple/30 border border-fantasy-purple/60' : 'bg-fantasy-dark/30 hover:bg-fantasy-dark/50'}`}
                      onClick={() => setCurrentStorySegment(index)}
                    >
                      <h3 className="text-sm font-medievalsharp text-fantasy-gold">Segmento {index + 1}</h3>
                      <p className="text-xs text-fantasy-stone truncate">{segment.text.substring(0, 60)}...</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="maps" className="pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 fantasy-card p-4">
                <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-4">Mapa Tático</h2>
                <div className="overflow-auto">
                  <TacticalMapWithFog 
                    mapImageUrl={mapImageUrl}
                    fogPoints={fogOfWar}
                    onMapClick={handleMapClick}
                    isGameMaster={true}
                    tokens={mapTokens}
                    onTokenMove={handleTokenMove}
                  />
                </div>
              </div>
              
              <div>
                <div className="fantasy-card p-4 mb-4">
                  <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-3">Seus Mapas</h2>
                  <div className="space-y-2">
                    {maps.length > 0 ? (
                      maps.map(map => (
                        <div 
                          key={map.id} 
                          className={`p-3 rounded-lg cursor-pointer ${activeMap === map.id ? 'bg-fantasy-purple/30 border border-fantasy-purple/60' : 'bg-fantasy-dark/30 hover:bg-fantasy-dark/50'}`}
                          onClick={() => handleMapChange(map.id)}
                        >
                          <h3 className="text-sm font-medievalsharp text-white">{map.name}</h3>
                        </div>
                      ))
                    ) : (
                      <p className="text-fantasy-stone text-center p-3">
                        Nenhum mapa encontrado. Adicione mapas na seção de criação.
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="fantasy-card p-4">
                  <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-3">Tokens</h2>
                  <div className="space-y-3">
                    {mapTokens.map(token => {
                      const character = combatCharacters.find(c => c.id === token.id);
                      return (
                        <div key={token.id} className="flex items-center gap-3 p-2 bg-fantasy-dark/40 rounded-lg">
                          <div 
                            style={{
                              backgroundColor: token.color,
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '10px'
                            }}
                          >
                            {token.label}
                          </div>
                          <div className="flex-grow">
                            <p className="text-sm text-white">{character?.name || token.label}</p>
                            <p className="text-xs text-fantasy-stone">({token.x}, {token.y})</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="monsters" className="pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 fantasy-card p-4">
                <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-4">Adicionar ao Combate</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-fantasy-stone mb-1">Nome</label>
                    <Input
                      value={newCharacter.name}
                      onChange={(e) => setNewCharacter({...newCharacter, name: e.target.value})}
                      className="bg-fantasy-dark/40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-fantasy-stone mb-1">CA</label>
                    <Input
                      type="number"
                      value={newCharacter.armorClass}
                      onChange={(e) => setNewCharacter({...newCharacter, armorClass: e.target.value})}
                      className="bg-fantasy-dark/40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-fantasy-stone mb-1">HP</label>
                    <Input
                      type="number"
                      value={newCharacter.hitPoints}
                      onChange={(e) => setNewCharacter({...newCharacter, hitPoints: e.target.value})}
                      className="bg-fantasy-dark/40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-fantasy-stone mb-1">Tipo</label>
                    <select
                      value={newCharacter.type}
                      onChange={(e) => setNewCharacter({...newCharacter, type: e.target.value})}
                      className="w-full rounded-md bg-fantasy-dark/40 text-white p-2 border-fantasy-purple/30"
                    >
                      <option value="monster">Monstro</option>
                      <option value="npc">NPC</option>
                    </select>
                  </div>
                </div>
                
                <Button 
                  onClick={addCombatCharacter}
                  className="fantasy-button primary w-full"
                >
                  Adicionar à Batalha
                </Button>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medievalsharp text-fantasy-purple mb-3">Lista de Combatentes</h3>
                  <div className="space-y-3">
                    {combatCharacters.map((character, index) => {
                      const isActiveCharacter = isCombatActive && index === currentTurnIndex;
                      
                      return (
                        <div 
                          key={character.id}
                          className={`p-3 rounded-lg ${isActiveCharacter ? 'bg-fantasy-purple/30 border border-fantasy-purple' : 'bg-fantasy-dark/40'}`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <div 
                                className={`w-3 h-3 rounded-full ${character.type === 'player' ? 'bg-blue-500' : character.type === 'npc' ? 'bg-amber-500' : 'bg-red-500'}`}
                              ></div>
                              <span className="text-white font-medievalsharp">{character.name}</span>
                              {isActiveCharacter && (
                                <span className="text-xs bg-fantasy-purple/40 text-fantasy-purple px-2 py-0.5 rounded-full">
                                  Turno Atual
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-fantasy-stone">
                                Ini: {character.initiative || '--'}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => rollInitiative(character.id)}
                                className="h-6 w-6 p-0"
                                title="Rolar iniciativa"
                              >
                                <Dices size={12} />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 items-center">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-fantasy-stone">CA:</span>
                              <span className="text-white">{character.armorClass}</span>
                            </div>
                            
                            <div className="flex items-center justify-center">
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateCharacterHP(character.id, -1)}
                                  className="h-6 w-6 p-0 bg-fantasy-dark/40"
                                >
                                  <Minus size={10} />
                                </Button>
                                <span className="text-white w-12 text-center">
                                  {character.hitPoints}/{character.maxHitPoints}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateCharacterHP(character.id, 1)}
                                  className="h-6 w-6 p-0 bg-fantasy-dark/40"
                                >
                                  <Plus size={10} />
                                </Button>
                              </div>
                            </div>
                            
                            {character.type !== 'player' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeCombatCharacter(character.id)}
                                className="justify-self-end text-red-400 hover:text-red-300 hover:bg-red-900/20"
                              >
                                Remover
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="fantasy-card p-4 mb-4">
                  <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-3">Controles de Combate</h2>
                  {!isCombatActive ? (
                    <Button 
                      onClick={startCombat}
                      className="fantasy-button primary w-full flex items-center justify-center gap-2"
                    >
                      <Play size={16} />
                      Iniciar Combate
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3 bg-fantasy-purple/20 rounded-lg">
                        <p className="text-sm text-fantasy-stone">Turno atual</p>
                        <p className="text-white font-medievalsharp">
                          {combatCharacters[currentTurnIndex]?.name || "Ninguém"}
                        </p>
                      </div>
                      
                      <Button 
                        onClick={nextTurn}
                        className="fantasy-button primary w-full"
                      >
                        Próximo Turno
                      </Button>
                      
                      <Button 
                        onClick={endCombat}
                        className="fantasy-button secondary w-full flex items-center justify-center gap-2"
                      >
                        <Pause size={16} />
                        Encerrar Combate
                      </Button>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      onClick={rollAllInitiatives}
                      className="w-full"
                    >
                      Rolar Iniciativa para Todos
                    </Button>
                  </div>
                </div>
                
                <div className="fantasy-card p-4">
                  <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-3">Log de Combate</h2>
                  <div className="h-64 bg-fantasy-dark/40 p-3 rounded-lg overflow-y-auto">
                    {combatLog.length === 0 ? (
                      <p className="text-fantasy-stone text-center">Nenhum evento de combate registrado</p>
                    ) : (
                      <ul className="space-y-1">
                        {combatLog.map((log, index) => (
                          <li key={index} className="text-sm text-fantasy-stone">{log}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCombatLog([])}
                    className="mt-2 w-full flex items-center gap-1"
                  >
                    <RotateCcw size={14} />
                    Limpar Log
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="combat" className="pt-4">
            <CombatTracker />
          </TabsContent>

          <TabsContent value="players" className="pt-4">
            <div className="fantasy-card p-4">
              <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-4">Jogadores na Sessão</h2>
              {players.length > 0 ? (
                <div className="space-y-4">
                  {players.map((player) => (
                    <div key={player.id} className="p-4 bg-fantasy-dark/40 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-medievalsharp text-white flex items-center gap-2">
                          {player.name}
                          <span 
                            className={`inline-block w-2 h-2 rounded-full ${player.online ? 'bg-green-500' : 'bg-gray-500'}`} 
                            title={player.online ? 'Online' : 'Offline'}
                          ></span>
                        </h3>
                        {player.characterName && (
                          <span className="text-xs bg-fantasy-purple/20 text-fantasy-purple px-2 py-1 rounded-full">
                            Nível {player.characterLevel || '?'}
                          </span>
                        )}
                      </div>
                      
                      {player.characterName ? (
                        <div>
                          <p className="text-fantasy-stone">
                            {player.characterName} ({player.characterRace} {player.characterClass})
                          </p>
                        </div>
                      ) : (
                        <p className="text-fantasy-stone">Nenhum personagem selecionado</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-fantasy-stone text-center">Nenhum jogador encontrado nesta mesa</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="chat" className="pt-4">
            <div className="fantasy-card p-4">
              <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-3">Chat da Sessão</h2>
              <div className="h-96 overflow-y-auto mb-4 p-3 bg-fantasy-dark/40 rounded-lg">
                {messages.map((message, index) => (
                  <div key={index} className={`p-3 rounded mb-2 ${message.sender === "Mestre" ? 'bg-fantasy-purple/20' : 'bg-fantasy-dark/30'}`}>
                    <span className="text-sm font-medium text-fantasy-gold">{message.sender}:</span>
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
            <div className="flex justify-center">
              <DiceRoller />
            </div>
          </TabsContent>

          <TabsContent value="notes" className="pt-4">
            <div className="fantasy-card p-4">
              <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-3">Anotações da Sessão</h2>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-96 bg-fantasy-dark/40 text-white rounded p-3 focus:outline-none focus:ring-2 focus:ring-fantasy-purple"
                placeholder="Escreva suas anotações para esta sessão aqui..."
              ></textarea>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default GameMasterView;
