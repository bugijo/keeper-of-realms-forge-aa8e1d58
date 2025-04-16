// Import the necessary components and hooks
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import DiceRoller from '@/components/dice/DiceRoller';
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
  FileText
} from 'lucide-react';

// Sample data (in a real app, this would come from your database)
const sessionData = {
  name: "A Caverna do Dragão Negro",
  description: "Uma aventura épica para encontrar o tesouro escondido na caverna de um antigo dragão negro.",
  players: [
    { id: 1, name: "Elrond", class: "Mago", level: 5, online: true },
    { id: 2, name: "Thorin", class: "Guerreiro", level: 4, online: true },
    { id: 3, name: "Legolas", class: "Arqueiro", level: 5, online: false },
    { id: 4, name: "Gimli", class: "Bárbaro", level: 4, online: false }
  ],
  maps: [
    { id: 1, name: "Entrada da Caverna", isActive: true },
    { id: 2, name: "Corredor Principal", isActive: false },
    { id: 3, name: "Sala do Tesouro", isActive: false }
  ],
  monsters: [
    { id: 1, name: "Goblins da Caverna", type: "Goblin", quantity: 4, hp: 7 },
    { id: 2, name: "Ogro Guardião", type: "Ogro", quantity: 1, hp: 35 },
    { id: 3, name: "Dragão Negro Ancião", type: "Dragão", quantity: 1, hp: 120 }
  ]
};

const storySegments = [
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
];

const GameMasterView = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("story");
  const [messages, setMessages] = useState([
    { sender: "Sistema", text: "Sessão iniciada" },
    { sender: "Mestre", text: "Bem-vindos à Caverna do Dragão Negro!" }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [currentStorySegment, setCurrentStorySegment] = useState(0);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setMessages([...messages, { sender: "Mestre", text: newMessage }]);
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
              <Sword size={16} />
              Monstros
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
                  <button 
                    onClick={() => setCurrentStorySegment(prev => Math.max(0, prev - 1))}
                    className="fantasy-button secondary text-sm py-1.5"
                    disabled={currentStorySegment === 0}
                  >
                    Segmento Anterior
                  </button>
                  <button 
                    onClick={() => setCurrentStorySegment(prev => Math.min(storySegments.length - 1, prev + 1))}
                    className="fantasy-button primary text-sm py-1.5"
                    disabled={currentStorySegment === storySegments.length - 1}
                  >
                    Próximo Segmento
                  </button>
                </div>
              </div>
              
              <div className="fantasy-card">
                <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-3">Roteiro da Aventura</h2>
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
            <div>
              <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-3">Mapas da Sessão</h2>
              {sessionData.maps.map(map => (
                <div key={map.id} className="fantasy-card p-4 mb-3">
                  <h3 className="text-lg font-medievalsharp">{map.name}</h3>
                  <p className="text-sm text-fantasy-stone">{map.description || "Sem descrição."}</p>
                  {map.isActive && <span className="text-xs bg-fantasy-purple/20 text-fantasy-purple rounded-full px-2 py-0.5">Ativo</span>}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="monsters" className="pt-4">
            <div>
              <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-3">Monstros Encontrados</h2>
              {sessionData.monsters.map(monster => (
                <div key={monster.id} className="fantasy-card p-4 mb-3">
                  <h3 className="text-lg font-medievalsharp">{monster.name}</h3>
                  <p className="text-sm text-fantasy-stone">Tipo: {monster.type}, Quantidade: {monster.quantity}, HP: {monster.hp}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="players" className="pt-4">
            <div>
              <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-3">Jogadores na Sessão</h2>
              {sessionData.players.map(player => (
                <div key={player.id} className="fantasy-card p-4 mb-3">
                  <h3 className="text-lg font-medievalsharp">{player.name}</h3>
                  <p className="text-sm text-fantasy-stone">Classe: {player.class}, Nível: {player.level}, Online: {player.online ? "Sim" : "Não"}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="chat" className="pt-4">
            <div>
              <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-3">Chat da Sessão</h2>
              <div className="space-y-2">
                {messages.map((message, index) => (
                  <div key={index} className={`p-3 rounded ${message.sender === "Mestre" ? 'bg-fantasy-purple/20' : 'bg-fantasy-dark/30'}`}>
                    <span className="text-sm font-medium">{message.sender}:</span>
                    <p className="text-sm text-fantasy-stone">{message.text}</p>
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
                  <button type="submit" className="fantasy-button primary rounded-l-none text-sm py-2.5">Enviar</button>
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
            <div>
              <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-3">Anotações da Sessão</h2>
              <p className="text-sm text-fantasy-stone">Espaço para o mestre anotar informações importantes sobre a sessão.</p>
            </div>
          </TabsContent>
        </Tabs>
        
        <DiceRoller />
      </div>
    </MainLayout>
  );
};

export default GameMasterView;
