
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from "@/components/layout/MainLayout";
import { 
  Dices, BookOpen, Map, Users, Sword, Skull, 
  FileText, ArrowLeft, ArrowRight, MessagesSquare, 
  PenTool, Clock, Settings, User
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import DiceRoller from "@/components/dice/DiceRoller";
import { toast } from "sonner";

const GameMasterView = () => {
  const { id } = useParams();
  const [activeSection, setActiveSection] = useState('story');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0); // Time in seconds
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  // Mock data
  const sessionData = {
    name: "A Masmorra do Dragão Vermelho",
    campaign: "Águas Profundas",
    nextSession: "Amanhã às 19h",
    players: ["João", "Maria", "Pedro", "Ana"],
    story: "Os aventureiros acabaram de derrotar os goblins que guardavam a entrada da caverna. À frente, eles podem ver um corredor escuro que se estende por vários metros antes de chegar a uma porta ornamentada com símbolos dracônicos.",
    notes: "- Lembrar de descrever o cheiro de enxofre\n- O dragão está ferido e irritado\n- O tesouro contém o pergaminho de ressurreição",
    maps: [
      { id: 1, name: "Entrada da Caverna", description: "Mapa da área externa e entrada da caverna do dragão" },
      { id: 2, name: "Salão Principal", description: "Grande salão onde o dragão descansa sobre seu tesouro" }
    ],
    npcs: [
      { id: 1, name: "Ancião Temeroso", description: "Um velho que conhece a lenda do dragão" },
      { id: 2, name: "Comerciante Suspeito", description: "Vende itens mágicos de origem duvidosa" }
    ],
    monsters: [
      { id: 1, name: "Goblins", hp: 7, ac: 15, description: "Pequenas criaturas verdes que atacam em grupo" },
      { id: 2, name: "Dragão Vermelho", hp: 178, ac: 19, description: "Enorme dragão com escamas vermelhas brilhantes" }
    ]
  };

  const startSession = () => {
    setIsSessionActive(true);
    toast.success("Sessão iniciada!", {
      description: "O cronômetro foi iniciado. Boa aventura!"
    });

    // Start timer
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    
    setTimerInterval(interval);
  };

  const endSession = () => {
    if (timerInterval) clearInterval(timerInterval);
    setIsSessionActive(false);
    setSessionTime(0);
    
    toast({
      title: "Sessão finalizada",
      description: "Um resumo foi salvo no histórico de sessões."
    });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRollInitiative = () => {
    toast.success("Iniciativa rolada para todos!", {
      description: "Os resultados foram enviados para os jogadores."
    });
  };

  // Interactive sections components
  const StorySection = () => (
    <div className="space-y-4">
      <div className="fantasy-card p-4">
        <h3 className="text-lg font-medievalsharp text-fantasy-gold mb-2">Narrativa Atual</h3>
        <p className="text-fantasy-stone whitespace-pre-line">{sessionData.story}</p>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm">
            <PenTool className="mr-2 h-4 w-4" />
            Editar Narrativa
          </Button>
          <Button variant="outline" size="sm">
            <ArrowRight className="mr-2 h-4 w-4" />
            Próxima Cena
          </Button>
        </div>
      </div>
      
      <div className="fantasy-card p-4">
        <h3 className="text-lg font-medievalsharp text-fantasy-gold mb-2">Notas do Mestre</h3>
        <p className="text-fantasy-stone whitespace-pre-line">{sessionData.notes}</p>
        <Button variant="outline" size="sm" className="mt-2">
          <PenTool className="mr-2 h-4 w-4" />
          Editar Notas
        </Button>
      </div>
    </div>
  );

  const MapsSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sessionData.maps.map(map => (
        <div key={map.id} className="fantasy-card p-4">
          <h3 className="text-lg font-medievalsharp text-fantasy-gold mb-2">{map.name}</h3>
          <div className="aspect-video bg-fantasy-dark/50 rounded-lg mb-2 flex items-center justify-center">
            <Map size={48} className="text-fantasy-purple/40" />
          </div>
          <p className="text-fantasy-stone text-sm mb-2">{map.description}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Ver Detalhe</Button>
            <Button variant="outline" size="sm">Compartilhar</Button>
          </div>
        </div>
      ))}
      <div className="fantasy-card p-4 flex flex-col items-center justify-center min-h-[200px]">
        <Button variant="outline">
          <Map className="mr-2 h-4 w-4" />
          Adicionar Novo Mapa
        </Button>
      </div>
    </div>
  );

  const NPCsSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sessionData.npcs.map(npc => (
        <div key={npc.id} className="fantasy-card p-4">
          <h3 className="text-lg font-medievalsharp text-fantasy-gold mb-2">{npc.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-16 h-16 bg-fantasy-dark/50 rounded-full flex items-center justify-center">
              <User size={32} className="text-fantasy-purple/40" />
            </div>
            <div>
              <p className="text-fantasy-stone text-sm">{npc.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Ver Detalhes</Button>
            <Button variant="outline" size="sm">Interagir</Button>
          </div>
        </div>
      ))}
      <div className="fantasy-card p-4 flex flex-col items-center justify-center min-h-[120px]">
        <Button variant="outline">
          <Users className="mr-2 h-4 w-4" />
          Adicionar Novo NPC
        </Button>
      </div>
    </div>
  );

  const MonstersSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sessionData.monsters.map(monster => (
        <div key={monster.id} className="fantasy-card p-4">
          <h3 className="text-lg font-medievalsharp text-fantasy-gold mb-2">{monster.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-16 h-16 bg-fantasy-dark/50 rounded-full flex items-center justify-center">
              <Skull size={32} className="text-fantasy-purple/40" />
            </div>
            <div>
              <div className="grid grid-cols-2 gap-1 mb-1">
                <span className="text-xs bg-fantasy-dark/50 rounded px-2 py-1">HP: {monster.hp}</span>
                <span className="text-xs bg-fantasy-dark/50 rounded px-2 py-1">CA: {monster.ac}</span>
              </div>
              <p className="text-fantasy-stone text-sm">{monster.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Ver Detalhes</Button>
            <Button variant="outline" size="sm">Adicionar ao Encontro</Button>
          </div>
        </div>
      ))}
      <div className="fantasy-card p-4 flex flex-col items-center justify-center min-h-[120px]">
        <Button variant="outline">
          <Skull className="mr-2 h-4 w-4" />
          Adicionar Novo Monstro
        </Button>
      </div>
    </div>
  );

  const PlayersSection = () => (
    <div className="space-y-4">
      <div className="fantasy-card p-4">
        <h3 className="text-lg font-medievalsharp text-fantasy-gold mb-2">Jogadores Presentes</h3>
        <div className="space-y-2">
          {sessionData.players.map((player, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-fantasy-dark/30 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-fantasy-purple/20 rounded-full flex items-center justify-center">
                  <User size={16} className="text-fantasy-purple" />
                </div>
                <span className="text-fantasy-stone">{player}</span>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm">
                  <MessagesSquare size={14} />
                </Button>
                <Button variant="ghost" size="sm">
                  <FileText size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={handleRollInitiative}>
            <Dices className="mr-2 h-4 w-4" />
            Rolar Iniciativa para Todos
          </Button>
        </div>
      </div>
      
      <div className="fantasy-card p-4">
        <h3 className="text-lg font-medievalsharp text-fantasy-gold mb-2">Enviar Notificação</h3>
        <textarea 
          className="w-full bg-fantasy-dark/30 border border-fantasy-purple/20 rounded-lg p-2 text-fantasy-stone mb-2" 
          rows={3}
          placeholder="Escreva uma mensagem para todos os jogadores..."
        ></textarea>
        <Button variant="outline" size="sm">
          <MessagesSquare className="mr-2 h-4 w-4" />
          Enviar para Todos
        </Button>
      </div>
    </div>
  );

  // Return the component
  return (
    <MainLayout>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-medievalsharp text-white">Mesa #{id}</h1>
            <h2 className="text-lg font-medievalsharp text-fantasy-purple">{sessionData.name}</h2>
          </div>
          <div className="flex gap-2">
            {isSessionActive ? (
              <>
                <div className="bg-fantasy-dark/50 px-3 py-1 rounded-md flex items-center gap-2">
                  <Clock size={16} className="text-fantasy-gold" />
                  <span className="text-fantasy-gold font-mono">{formatTime(sessionTime)}</span>
                </div>
                <Button variant="destructive" size="sm" onClick={endSession}>
                  Finalizar Sessão
                </Button>
              </>
            ) : (
              <Button 
                variant="default" 
                className="bg-fantasy-gold text-fantasy-dark hover:bg-fantasy-gold/80"
                onClick={startSession}
              >
                Iniciar Sessão
              </Button>
            )}
            <Button variant="outline" size="icon">
              <Settings size={18} />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="fantasy-card p-4 mb-4">
              <div className="flex flex-col space-y-2">
                <Button 
                  variant={activeSection === 'story' ? 'default' : 'outline'} 
                  className={activeSection === 'story' ? 'bg-fantasy-purple text-white' : ''}
                  onClick={() => setActiveSection('story')}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  História
                </Button>
                <Button 
                  variant={activeSection === 'maps' ? 'default' : 'outline'} 
                  className={activeSection === 'maps' ? 'bg-fantasy-purple text-white' : ''}
                  onClick={() => setActiveSection('maps')}
                >
                  <Map className="mr-2 h-4 w-4" />
                  Mapas
                </Button>
                <Button 
                  variant={activeSection === 'npcs' ? 'default' : 'outline'} 
                  className={activeSection === 'npcs' ? 'bg-fantasy-purple text-white' : ''}
                  onClick={() => setActiveSection('npcs')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  NPCs
                </Button>
                <Button 
                  variant={activeSection === 'monsters' ? 'default' : 'outline'} 
                  className={activeSection === 'monsters' ? 'bg-fantasy-purple text-white' : ''}
                  onClick={() => setActiveSection('monsters')}
                >
                  <Skull className="mr-2 h-4 w-4" />
                  Monstros
                </Button>
                <Button 
                  variant={activeSection === 'players' ? 'default' : 'outline'} 
                  className={activeSection === 'players' ? 'bg-fantasy-purple text-white' : ''}
                  onClick={() => setActiveSection('players')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Jogadores
                </Button>
              </div>
            </div>
            
            <div className="fantasy-card p-4">
              <h3 className="text-lg font-medievalsharp text-fantasy-gold mb-2">Ferramentas</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  <Dices className="mr-2 h-4 w-4" />
                  Dados
                </Button>
                <Button variant="outline" size="sm">
                  <Sword className="mr-2 h-4 w-4" />
                  Combate
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Regras
                </Button>
                <Button variant="outline" size="sm">
                  <MessagesSquare className="mr-2 h-4 w-4" />
                  Chat
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-3">
            <div className="fantasy-card p-4">
              <h2 className="text-xl font-medievalsharp text-fantasy-gold mb-4">
                {activeSection === 'story' && "Narrativa e Notas"}
                {activeSection === 'maps' && "Mapas da Aventura"}
                {activeSection === 'npcs' && "Personagens Não-Jogadores"}
                {activeSection === 'monsters' && "Monstros e Criaturas"}
                {activeSection === 'players' && "Gerenciamento de Jogadores"}
              </h2>
              
              {activeSection === 'story' && <StorySection />}
              {activeSection === 'maps' && <MapsSection />}
              {activeSection === 'npcs' && <NPCsSection />}
              {activeSection === 'monsters' && <MonstersSection />}
              {activeSection === 'players' && <PlayersSection />}
            </div>
          </div>
        </div>
        
        {/* Dice roller at the bottom */}
        <div className="mt-6">
          <DiceRoller />
        </div>
      </div>
    </MainLayout>
  );
};

export default GameMasterView;
