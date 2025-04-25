import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MainLayout from "@/components/layout/MainLayout";
import { 
  ArrowLeft,
  Share2,
  BookOpen,
  MapPin,
  Sword,
  Users,
  MessageSquare,
  Dices,
  FileText,
  Skull
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DiceRoller from '@/components/dice/DiceRoller';
import CombatTracker from '@/components/game/CombatTracker';
import StoryTab from '@/components/game/master/StoryTab';
import MapTab from '@/components/game/master/MapTab';
import ChatTab from '@/components/game/master/ChatTab';
import PlayersTab from '@/components/game/master/PlayersTab';
import NotesTab from '@/components/game/master/NotesTab';

const GameMasterView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [tableData, setTableData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("story");
  
  const [players, setPlayers] = useState<GamePlayer[]>([]);
  
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
  
  const [mapImageUrl, setMapImageUrl] = useState('/placeholder.svg');
  const [fogOfWar, setFogOfWar] = useState<{x: number, y: number}[]>([]);
  const [mapTokens, setMapTokens] = useState<MapToken[]>([]);
  const [maps, setMaps] = useState<{id: string, name: string, image_url: string | null, description: string | null}[]>([]);
  const [activeMap, setActiveMap] = useState<string | null>(null);
  
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
        
        const { data: tableData, error: tableError } = await supabase
          .from('tables')
          .select('*')
          .eq('id', id)
          .single();
          
        if (tableError) throw tableError;
        
        if (tableData.user_id !== user.id) {
          toast.error('Você não tem permissão para acessar esta página');
          navigate('/tables');
          return;
        }
        
        setTableData(tableData);
        
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, display_name');
          
        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
        }
        
        const profilesMap: Record<string, ProfileData> = {};
        if (profilesData) {
          profilesData.forEach(profile => {
            profilesMap[profile.id] = profile;
          });
        }
        
        const { data: participantsData, error: participantsError } = await supabase
          .from('table_participants')
          .select(`
            id, 
            user_id,
            role,
            character_id,
            characters:character_id (id, name, class, race, level)
          `)
          .eq('table_id', id);
          
        if (participantsError) throw participantsError;
        
        const playersData = (participantsData || [])
          .filter(p => p.role !== 'gm')
          .map(p => {
            const profileData = profilesMap[p.user_id] || {};
            
            return {
              id: p.id,
              name: profileData.display_name || "Jogador sem nome",
              characterId: p.characters?.id || null,
              characterName: p.characters?.name || null,
              characterClass: p.characters?.class || null,
              characterRace: p.characters?.race || null,
              characterLevel: p.characters?.level || null,
              online: Math.random() > 0.5
            };
          });
        
        setPlayers(playersData);
        
        const combatChars = playersData
          .filter(p => p.characterName)
          .map(p => ({
            id: p.characterId || `player-${p.id}`,
            name: p.characterName || p.name,
            initiative: 0,
            armorClass: 12,
            hitPoints: 10,
            maxHitPoints: 10,
            conditions: [],
            type: 'player' as const
          }));
        
        setCombatCharacters(combatChars);
        
        const { data: mapsData, error: mapsError } = await supabase
          .from('maps')
          .select('id, name, image_url, description')
          .eq('user_id', user.id);
          
        if (mapsError) throw mapsError;
        
        setMaps(mapsData || []);
        
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

  const getPlayerColor = (index: number): string => {
    const colors = [
      'rgb(59, 130, 246)',
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

  const handleMapClick = (x: number, y: number) => {
    const existingFogIndex = fogOfWar.findIndex(point => point.x === x && point.y === y);
    
    if (existingFogIndex !== -1) {
      setFogOfWar(fogOfWar.filter((_, idx) => idx !== existingFogIndex));
    } else {
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
      setFogOfWar([]);
    }
  };
  
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
    
    setNewCharacter({
      name: '',
      armorClass: '10',
      hitPoints: '10',
      type: 'monster'
    });
    
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
    const character = combatCharacters.find(c => c.id === characterId);
    if (!character || character.type === 'player') return;
    
    setCombatCharacters(chars => chars.filter(char => char.id !== characterId));
    setCombatLog([...combatLog, `${character.name} foi removido do combate.`]);
    
    setMapTokens(tokens => tokens.filter(token => token.id !== characterId));
  };
  
  const updateCharacterHP = (characterId: string, change: number) => {
    setCombatCharacters(chars =>
      chars.map(char => {
        if (char.id !== characterId) return char;
        
        const newHP = Math.max(0, Math.min(char.maxHitPoints, char.hitPoints + change));
        
        if (change < 0) {
          setCombatLog([...combatLog, `${char.name} recebeu ${-change} pontos de dano.`]);
        } else if (change > 0) {
          setCombatLog([...combatLog, `${char.name} curou ${change} pontos de vida.`]);
        }
        
        return { ...char, hitPoints: newHP };
      })
    );
  };
  
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setMessages([...messages, { sender: "Mestre", text: newMessage }]);
    setNewMessage("");
  };
  
  const copyInviteLink = () => {
    // Implement copy invite link logic here
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
          <Button 
            onClick={copyInviteLink}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Share2 size={16} />
            Convidar
          </Button>
        </div>
        
        <Tabs defaultValue="story" className="w-full">
          <TabsList className="bg-fantasy-dark/70 border-b border-fantasy-purple/30 p-0 rounded-none w-full flex justify-start overflow-x-auto">
            <TabsTrigger value="story" className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-fantasy-gold rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent flex items-center gap-2">
              <BookOpen size={16} />
              História
            </TabsTrigger>
            <TabsTrigger value="maps" className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-fantasy-gold rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent flex items-center gap-2">
              <MapPin size={16} />
              Mapas
            </TabsTrigger>
            <TabsTrigger value="monsters" className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-fantasy-gold rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent flex items-center gap-2">
              <Skull size={16} />
              Monstros
            </TabsTrigger>
            <TabsTrigger value="combat" className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-fantasy-gold rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent flex items-center gap-2">
              <Sword size={16} />
              Combate
            </TabsTrigger>
            <TabsTrigger value="players" className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-fantasy-gold rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent flex items-center gap-2">
              <Users size={16} />
              Jogadores
            </TabsTrigger>
            <TabsTrigger value="chat" className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-fantasy-gold rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent flex items-center gap-2">
              <MessageSquare size={16} />
              Chat
            </TabsTrigger>
            <TabsTrigger value="dice" className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-fantasy-gold rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent flex items-center gap-2">
              <Dices size={16} />
              Dados
            </TabsTrigger>
            <TabsTrigger value="notes" className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-fantasy-gold rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent flex items-center gap-2">
              <FileText size={16} />
              Notas
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="story" className="pt-4">
            <StoryTab
              currentStorySegment={currentStorySegment}
              storySegments={storySegments}
              setCurrentStorySegment={setCurrentStorySegment}
              addStorySegment={addStorySegment}
            />
          </TabsContent>
          
          <TabsContent value="maps" className="pt-4">
            <MapTab
              mapImageUrl={mapImageUrl}
              fogOfWar={fogOfWar}
              handleMapClick={handleMapClick}
              mapTokens={mapTokens}
              handleTokenMove={handleTokenMove}
              maps={maps}
              activeMap={activeMap}
              handleMapChange={handleMapChange}
              combatCharacters={combatCharacters}
            />
          </TabsContent>
          
          <TabsContent value="combat" className="pt-4">
            <CombatTracker />
          </TabsContent>
          
          <TabsContent value="players" className="pt-4">
            <PlayersTab players={players} />
          </TabsContent>
          
          <TabsContent value="chat" className="pt-4">
            <ChatTab
              messages={messages}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              sendMessage={sendMessage}
            />
          </TabsContent>
          
          <TabsContent value="dice" className="pt-4">
            <div className="flex justify-center">
              <DiceRoller />
            </div>
          </TabsContent>
          
          <TabsContent value="notes" className="pt-4">
            <NotesTab notes={notes} setNotes={setNotes} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default GameMasterView;
