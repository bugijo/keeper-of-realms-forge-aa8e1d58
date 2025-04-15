
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from "@/components/layout/MainLayout";
import { 
  Dices, User, Shield, Swords, Scroll, 
  MessageCircle, Bell, Clock, Map, Heart, 
  BookOpen
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import DiceRoller from "@/components/dice/DiceRoller";
import { toast } from "sonner";

const PlayerView = () => {
  const { id } = useParams();
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [activeTab, setActiveTab] = useState("character");
  const [chatMessages, setChatMessages] = useState<{sender: string, message: string, isSystem?: boolean}[]>([
    {sender: "Sistema", message: "Bem-vindo à sessão! O mestre iniciará em breve.", isSystem: true},
    {sender: "Mestre Gabriel", message: "Olá a todos! Hoje vamos explorar a parte norte da Masmorra do Dragão Vermelho."},
    {sender: "Maria", message: "Meu personagem está preparado com poções extras depois do último encontro!"},
  ]);
  
  // Mock data
  const tableData = {
    name: "A Masmorra do Dragão Vermelho",
    dm: "Mestre Gabriel",
    campaign: "Águas Profundas",
    players: ["João", "Maria (você)", "Pedro", "Ana"],
    description: "Vocês acabaram de derrotar os goblins que guardavam a entrada da caverna. À frente, podem ver um corredor escuro que se estende por vários metros antes de chegar a uma porta ornamentada com símbolos dracônicos.",
  };
  
  const characterData = {
    name: "Thorin Escudoférreo",
    race: "Anão",
    class: "Guerreiro",
    level: 5,
    hp: 45,
    maxHp: 45,
    ac: 18,
    initiative: 2,
    stats: {
      str: 16,
      dex: 12,
      con: 16,
      int: 10,
      wis: 14,
      cha: 8
    },
    equipment: [
      "Machado de Batalha +1",
      "Armadura de Placas",
      "Poção de Cura (2)",
      "Kit de Aventureiro"
    ],
    spells: [],
    abilities: [
      "Segundo Fôlego",
      "Surto de Ação",
      "Estilo de Combate: Defesa",
      "Resistência Anã"
    ]
  };
  
  const handleSendChat = () => {
    const messageInput = document.getElementById('chatInput') as HTMLInputElement;
    if (messageInput && messageInput.value.trim() !== '') {
      setChatMessages([
        ...chatMessages,
        {
          sender: characterData.name,
          message: messageInput.value.trim()
        }
      ]);
      messageInput.value = '';
    }
  };
  
  const handleRollDice = (type: string) => {
    let result;
    let message;
    
    switch(type) {
      case 'initiative':
        result = Math.floor(Math.random() * 20) + 1 + characterData.initiative;
        message = `Rolou iniciativa: ${result} (d20 + ${characterData.initiative})`;
        break;
      case 'attack':
        const attackRoll = Math.floor(Math.random() * 20) + 1;
        const attackBonus = 5; // Example attack bonus
        result = attackRoll + attackBonus;
        message = `Ataque: ${result} (${attackRoll} + ${attackBonus})`;
        break;
      case 'damage':
        result = Math.floor(Math.random() * 8) + 1 + 3; // d8+3 example
        message = `Dano: ${result} (d8 + 3)`;
        break;
      case 'skill':
        const skillRoll = Math.floor(Math.random() * 20) + 1;
        const skillBonus = 4; // Example skill bonus
        result = skillRoll + skillBonus;
        message = `Teste de perícia: ${result} (${skillRoll} + ${skillBonus})`;
        break;
      default:
        result = Math.floor(Math.random() * 20) + 1;
        message = `d20: ${result}`;
    }
    
    // Add the roll to the chat
    setChatMessages([
      ...chatMessages,
      {
        sender: characterData.name,
        message: message,
        isSystem: true
      }
    ]);
    
    toast({
      title: "Dado rolado",
      description: message
    });
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-medievalsharp text-white">Mesa #{id}</h1>
            <h2 className="text-lg font-medievalsharp text-fantasy-purple">{tableData.name}</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-fantasy-stone text-sm">{tableData.dm}</span>
            <Button variant="outline" size="sm">
              <Bell size={16} className="mr-1" />
              {isSessionActive ? "Em jogo" : "Aguardando"}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Character sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="fantasy-card p-4">
              <h2 className="text-lg font-medievalsharp text-fantasy-gold mb-2">Seu Personagem</h2>
              <div className="flex flex-col items-center mb-3">
                <div className="w-20 h-20 bg-fantasy-dark/50 rounded-full flex items-center justify-center mb-2">
                  <User size={36} className="text-fantasy-purple/60" />
                </div>
                <h3 className="text-white font-medievalsharp">{characterData.name}</h3>
                <p className="text-fantasy-stone text-sm">{characterData.race} {characterData.class} Nv. {characterData.level}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-fantasy-dark/40 p-2 rounded-lg text-center">
                  <span className="text-xs text-fantasy-stone">HP</span>
                  <div className="text-fantasy-gold flex items-center justify-center gap-1">
                    <Heart size={14} className="text-red-500" />
                    {characterData.hp}/{characterData.maxHp}
                  </div>
                </div>
                <div className="bg-fantasy-dark/40 p-2 rounded-lg text-center">
                  <span className="text-xs text-fantasy-stone">CA</span>
                  <div className="text-fantasy-gold flex items-center justify-center gap-1">
                    <Shield size={14} className="text-blue-400" />
                    {characterData.ac}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-1 mb-3">
                {Object.entries(characterData.stats).map(([stat, value]) => (
                  <div key={stat} className="bg-fantasy-dark/30 p-1 rounded-lg text-center">
                    <span className="text-xs uppercase text-fantasy-stone">{stat}</span>
                    <p className="text-fantasy-gold text-sm">{value}</p>
                  </div>
                ))}
              </div>
              
              <h3 className="text-sm font-medievalsharp text-fantasy-stone mb-1">Rolagens Rápidas</h3>
              <div className="grid grid-cols-2 gap-1">
                <Button variant="outline" size="sm" onClick={() => handleRollDice('initiative')}>
                  <Dices className="mr-1 h-3 w-3" />
                  Iniciativa
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleRollDice('attack')}>
                  <Swords className="mr-1 h-3 w-3" />
                  Ataque
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleRollDice('damage')}>
                  <Swords className="mr-1 h-3 w-3" />
                  Dano
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleRollDice('skill')}>
                  <User className="mr-1 h-3 w-3" />
                  Perícia
                </Button>
              </div>
            </div>
            
            <div className="fantasy-card p-4">
              <Tabs defaultValue="equipment" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-2">
                  <TabsTrigger value="equipment">Equip.</TabsTrigger>
                  <TabsTrigger value="abilities">Habil.</TabsTrigger>
                  <TabsTrigger value="spells">Magias</TabsTrigger>
                </TabsList>
                <TabsContent value="equipment">
                  <h3 className="text-sm font-medievalsharp text-fantasy-stone mb-1">Equipamento</h3>
                  <ul className="text-xs text-fantasy-stone space-y-1">
                    {characterData.equipment.map((item, index) => (
                      <li key={index} className="bg-fantasy-dark/30 p-1 px-2 rounded-lg">{item}</li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="abilities">
                  <h3 className="text-sm font-medievalsharp text-fantasy-stone mb-1">Habilidades</h3>
                  <ul className="text-xs text-fantasy-stone space-y-1">
                    {characterData.abilities.map((ability, index) => (
                      <li key={index} className="bg-fantasy-dark/30 p-1 px-2 rounded-lg">{ability}</li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="spells">
                  <h3 className="text-sm font-medievalsharp text-fantasy-stone mb-1">Magias</h3>
                  {characterData.spells.length > 0 ? (
                    <ul className="text-xs text-fantasy-stone space-y-1">
                      {characterData.spells.map((spell, index) => (
                        <li key={index} className="bg-fantasy-dark/30 p-1 px-2 rounded-lg">{spell}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-fantasy-stone italic">Este personagem não possui magias.</p>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="lg:col-span-3">
            <div className="fantasy-card p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={18} className="text-fantasy-gold" />
                <h2 className="text-lg font-medievalsharp text-fantasy-gold">Narrativa Atual</h2>
              </div>
              <p className="text-fantasy-stone mb-4">{tableData.description}</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <Map className="mr-1 h-4 w-4" />
                  Ver Mapa Atual
                </Button>
                <Button variant="outline" size="sm">
                  <Scroll className="mr-1 h-4 w-4" />
                  Anotações
                </Button>
              </div>
            </div>
            
            <div className="fantasy-card p-4">
              <h2 className="text-lg font-medievalsharp text-fantasy-gold mb-3">Chat da Mesa</h2>
              <div className="bg-fantasy-dark/30 rounded-lg p-2 h-64 mb-3 overflow-y-auto">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`mb-2 ${msg.isSystem ? 'opacity-70' : ''}`}>
                    <span className={`font-bold ${msg.sender === 'Sistema' ? 'text-blue-400' : msg.sender === tableData.dm ? 'text-fantasy-gold' : 'text-fantasy-purple'}`}>
                      {msg.sender}:
                    </span>
                    <span className="text-fantasy-stone ml-2">{msg.message}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  id="chatInput"
                  type="text" 
                  className="flex-1 bg-fantasy-dark/50 border border-fantasy-purple/20 rounded-lg px-3 py-1 text-white"
                  placeholder="Digite sua mensagem..."
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                />
                <Button onClick={handleSendChat}>
                  <MessageCircle className="mr-1 h-4 w-4" />
                  Enviar
                </Button>
              </div>
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

export default PlayerView;
