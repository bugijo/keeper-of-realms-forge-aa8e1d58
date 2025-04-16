
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import DiceRoller from '@/components/dice/DiceRoller';
import PlayerStats from '@/components/game/PlayerStats';
import CharacterSheet from '@/components/game/CharacterSheet';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from '@/components/ui/tabs';
import { 
  User, 
  MapPin, 
  Sword, 
  Users, 
  MessageSquare, 
  Dices, 
  BookOpen 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const sessionData = {
  name: "A Caverna do Dragão Negro",
  description: "Uma aventura épica para encontrar o tesouro escondido na caverna de um antigo dragão negro.",
  playerCharacter: {
    name: "Elrond Mithrandir",
    race: "Elfo",
    class: "Mago",
    level: 5,
    background: "Sábio",
    alignment: "Neutro e Bom",
    experiencePoints: 300,
    nextLevelXP: 500,
    proficiencyBonus: 3,
    armorClass: 14,
    initiative: 2,
    speed: 30,
    hitPoints: { current: 32, max: 40, temporary: 0 },
    hitDice: { current: 5, total: 5, die: "d6" },
    deathSaves: { successes: 0, failures: 0 },
    stats: [
      { name: "Vida", value: 32, max: 40 },
      { name: "Mana", value: 45, max: 50 },
      { name: "Força", value: 10 },
      { name: "Destreza", value: 14 },
      { name: "Constituição", value: 12 },
      { name: "Inteligência", value: 18 },
      { name: "Sabedoria", value: 16 },
      { name: "Carisma", value: 13 }
    ],
    skills: [
      { name: "Arcanismo", value: 7, proficient: true },
      { name: "História", value: 7, proficient: true },
      { name: "Investigação", value: 7, proficient: true },
      { name: "Natureza", value: 4, proficient: false },
      { name: "Religião", value: 4, proficient: false },
      { name: "Percepção", value: 6, proficient: true },
      { name: "Furtividade", value: 2, proficient: false },
      { name: "Sobrevivência", value: 3, proficient: false }
    ],
    savingThrows: [
      { name: "Força", value: 0, proficient: false },
      { name: "Destreza", value: 5, proficient: true },
      { name: "Constituição", value: 1, proficient: false },
      { name: "Inteligência", value: 7, proficient: true },
      { name: "Sabedoria", value: 6, proficient: true },
      { name: "Carisma", value: 1, proficient: false }
    ],
    inventory: [
      { name: "Cajado Arcano", type: "Arma", description: "Um cajado mágico que amplifica seus feitiços." },
      { name: "Poção de Cura", type: "Consumível", description: "Restaura 2d4+2 pontos de vida.", quantity: 2 },
      { name: "Grimório", type: "Ferramenta", description: "Contém seus feitiços conhecidos." },
      { name: "Componentes Arcanos", type: "Item", description: "Bolsa com componentes para lançar magias.", quantity: 1 },
      { name: "Varinha de Detecção Mágica", type: "Maravilhoso", description: "Permite lançar a magia Detectar Magia 3 vezes por dia." }
    ],
    spells: {
      slots: [
        { level: 1, used: 2, total: 4 },
        { level: 2, used: 1, total: 3 },
        { level: 3, used: 0, total: 2 }
      ],
      known: [
        { 
          name: "Mísseis Mágicos", 
          level: 1, 
          castingTime: "1 ação",
          range: "36 metros",
          components: "V, S",
          duration: "Instantânea",
          description: "Dispara 3 dardos mágicos que causam 1d4+1 de dano cada." 
        },
        { 
          name: "Escudo Arcano", 
          level: 1, 
          castingTime: "1 reação",
          range: "Pessoal",
          components: "V, S",
          duration: "1 rodada",
          description: "Cria uma barreira mágica que concede +5 de CA." 
        },
        { 
          name: "Bola de Fogo", 
          level: 3, 
          castingTime: "1 ação",
          range: "45 metros",
          components: "V, S, M",
          duration: "Instantânea",
          description: "Explode em chamas causando 8d6 de dano em uma área." 
        }
      ]
    },
    features: [
      { name: "Magias", source: "Mago", description: "Você pode lançar magias do grimório do mago." },
      { name: "Recuperação Arcana", source: "Mago", description: "Uma vez por dia, durante um descanso curto, você pode recuperar espaços de magia." },
      { name: "Tradição Arcana: Evocação", source: "Mago", description: "Você se especializa em magias que manipulam energia mágica para criar efeitos poderosos." },
      { name: "Esculpir Magias", source: "Evocação", description: "A partir do 2º nível, você pode criar bolsões de segurança relativa dentro dos efeitos de suas magias de evocação." }
    ],
    personalityTraits: "Eu falo com palavras polissilábicas, independentemente de ser necessário.",
    ideals: "Conhecimento. O caminho para o poder e o auto-aperfeiçoamento é através do conhecimento.",
    bonds: "Meu grimório contém segredos arcanos que não podem cair em mãos erradas.",
    flaws: "A maioria das pessoas grita e corre quando vê um demônio. Eu paro e tomo notas sobre sua anatomia.",
    appearance: "Um elfo alto e esbelto com cabelos prateados, olhos azuis penetrantes e vestes elegantes decoradas com símbolos arcanos.",
    backstory: "Estudante da antiga e prestigiada Academia Arcana de Penholder, Elrond sempre foi fascinado pelo poder da magia. Após a destruição da academia por forças misteriosas, ele busca conhecimento e vingança.",
    notes: "Procurando por informações sobre artefatos antigos, especialmente aqueles relacionados ao controle de energia elemental.",
    currency: {
      copper: 15,
      silver: 24,
      electrum: 0,
      gold: 35,
      platinum: 2
    }
  },
  otherPlayers: [
    { id: 2, name: "Thorin", class: "Guerreiro", level: 4, online: true },
    { id: 3, name: "Legolas", class: "Arqueiro", level: 5, online: false },
    { id: 4, name: "Gimli", class: "Bárbaro", level: 4, online: false }
  ],
  activeMap: {
    name: "Entrada da Caverna",
    description: "Uma grande abertura na face da montanha, com estalactites pendendo do teto. O chão é úmido e há marcas de passagem recente."
  }
};

const narrativeHistory = [
  { 
    type: "narrative", 
    content: "Vocês chegam à entrada da caverna. O vento frio sopra da abertura escura, trazendo um odor de umidade e algo queimado. Pegadas recentes sugerem que outras criaturas entraram recentemente."
  },
  { 
    type: "player", 
    character: "Thorin", 
    content: "Vou examinar as pegadas para identificar que criaturas são essas."
  },
  { 
    type: "dice", 
    character: "Thorin", 
    roll: "Sobrevivência",
    result: 17
  },
  { 
    type: "narrative", 
    content: "Thorin identifica as pegadas como sendo de goblins, provavelmente um grupo pequeno de 4 ou 5 criaturas. Elas parecem ter menos de um dia."
  },
  { 
    type: "player", 
    character: "Elrond", 
    content: "Vou conjurar uma luz no meu cajado para iluminar nosso caminho."
  }
];

const PlayerView = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("story");
  const [messages, setMessages] = useState([
    { sender: "Sistema", text: "Você entrou na sessão" },
    { sender: "Mestre", text: "Bem-vindos à Caverna do Dragão Negro!" }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setMessages([...messages, { sender: sessionData.playerCharacter.name, text: newMessage }]);
    setNewMessage("");
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-medievalsharp text-fantasy-gold mb-2">{sessionData.name}</h1>
        <p className="text-fantasy-stone mb-6">{sessionData.description}</p>
        
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
              value="character" 
              className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-fantasy-gold rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent flex items-center gap-2"
            >
              <User size={16} />
              Personagem
            </TabsTrigger>
            <TabsTrigger 
              value="maps" 
              className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-fantasy-gold rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent flex items-center gap-2"
            >
              <MapPin size={16} />
              Mapas
            </TabsTrigger>
            <TabsTrigger 
              value="inventory" 
              className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-fantasy-gold rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent flex items-center gap-2"
            >
              <Sword size={16} />
              Inventário
            </TabsTrigger>
            <TabsTrigger 
              value="players" 
              className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-fantasy-gold rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent flex items-center gap-2"
            >
              <Users size={16} />
              Grupo
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
          
          <TabsContent value="story">
            <div className="fantasy-card p-4">
              <h2 className="text-lg font-medievalsharp text-fantasy-gold mb-3">História Atual</h2>
              <div className="bg-fantasy-dark/30 rounded-lg p-2 h-64 mb-3 overflow-y-auto">
                {narrativeHistory.map((msg, index) => (
                  <div key={index} className={`mb-2 ${msg.type === "narrative" ? 'opacity-70' : ''}`}>
                    <span className={`font-bold ${msg.type === "narrative" ? 'text-blue-400' : msg.type === "player" ? 'text-fantasy-gold' : 'text-fantasy-purple'}`}>
                      {msg.type === "narrative" ? "Narrativa" : msg.character}:
                    </span>
                    <span className="text-fantasy-stone ml-2">{msg.content}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="character">
            <CharacterSheet character={sessionData.playerCharacter} />
          </TabsContent>
          
          <TabsContent value="maps">
            <div className="fantasy-card p-4">
              <h2 className="text-lg font-medievalsharp text-fantasy-gold mb-3">Mapas Atuais</h2>
              <div className="bg-fantasy-dark/30 rounded-lg p-2 h-64 mb-3 overflow-y-auto">
                <div className="mb-2">
                  <span className="font-bold text-fantasy-gold">Entrada da Caverna:</span>
                  <span className="text-fantasy-stone ml-2">{sessionData.activeMap.description}</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="inventory">
            <div className="fantasy-card p-4">
              <h2 className="text-lg font-medievalsharp text-fantasy-gold mb-3">Inventário</h2>
              <ul className="text-xs text-fantasy-stone space-y-1">
                {sessionData.playerCharacter.inventory.map((item, index) => (
                  <li key={index} className="bg-fantasy-dark/30 p-1 px-2 rounded-lg">{item.name}</li>
                ))}
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="players">
            <div className="fantasy-card p-4">
              <h2 className="text-lg font-medievalsharp text-fantasy-gold mb-3">Grupo</h2>
              <ul className="text-xs text-fantasy-stone space-y-1">
                {sessionData.otherPlayers.map((player, index) => (
                  <li key={index} className="bg-fantasy-dark/30 p-1 px-2 rounded-lg">
                    {player.name} ({player.class} Nv. {player.level})
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="chat">
            <div className="fantasy-card p-4">
              <h2 className="text-lg font-medievalsharp text-fantasy-gold mb-3">Chat da Mesa</h2>
              <div className="bg-fantasy-dark/30 rounded-lg p-2 h-64 mb-3 overflow-y-auto">
                {messages.map((msg, index) => (
                  <div key={index} className={`mb-2 ${msg.sender === 'Sistema' ? 'opacity-70' : ''}`}>
                    <span className={`font-bold ${msg.sender === 'Sistema' ? 'text-blue-400' : msg.sender === sessionData.playerCharacter.name ? 'text-fantasy-gold' : 'text-fantasy-purple'}`}>
                      {msg.sender}:
                    </span>
                    <span className="text-fantasy-stone ml-2">{msg.text}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  id="chatInput"
                  type="text" 
                  className="flex-1 bg-fantasy-dark/50 border border-fantasy-purple/20 rounded-lg px-3 py-1 text-white"
                  placeholder="Digite sua mensagem..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage(e)}
                />
                <Button onClick={sendMessage}>
                  <MessageSquare className="mr-1 h-4 w-4" />
                  Enviar
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="dice">
            <div className="fantasy-card p-4">
              <h2 className="text-lg font-medievalsharp text-fantasy-gold mb-3">Dados</h2>
              <DiceRoller />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default PlayerView;
