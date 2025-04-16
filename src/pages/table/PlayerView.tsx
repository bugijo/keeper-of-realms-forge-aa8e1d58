import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import DiceRoller from '@/components/dice/DiceRoller';
import { PlayerStats } from '@/components/game/PlayerStats';
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

const sessionData = {
  name: "A Caverna do Dragão Negro",
  description: "Uma aventura épica para encontrar o tesouro escondido na caverna de um antigo dragão negro.",
  playerCharacter: {
    name: "Elrond Mithrandir",
    race: "Elfo",
    class: "Mago",
    level: 5,
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
    inventory: [
      { name: "Cajado Arcano", type: "Arma", description: "Um cajado mágico que amplifica seus feitiços." },
      { name: "Poção de Cura", type: "Consumível", description: "Restaura 2d4+2 pontos de vida." },
      { name: "Grimório", type: "Ferramenta", description: "Contém seus feitiços conhecidos." }
    ],
    spells: [
      { name: "Mísseis Mágicos", level: 1, description: "Dispara 3 dardos mágicos que causam 1d4+1 de dano cada." },
      { name: "Escudo Arcano", level: 1, description: "Cria uma barreira mágica que concede +5 de CA." },
      { name: "Bola de Fogo", level: 3, description: "Explode em chamas causando 8d6 de dano em uma área." }
    ]
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
            <PlayerStats character={sessionData.playerCharacter} />
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
        
        <DiceRoller />
      </div>
    </MainLayout>
  );
};

export default PlayerView;
