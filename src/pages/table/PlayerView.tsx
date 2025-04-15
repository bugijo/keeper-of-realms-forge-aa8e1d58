
import React, { useState } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import { ArrowLeft, Book, Map, Shield, Sword, ClipboardList, MessageCircle, Dice, User, HeartPulse, Eye, BatteryMedium } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

// Mock data for the character
const mockCharacter = {
  id: '1',
  name: 'Thorian Greystone',
  level: 5,
  class: 'Guerreiro',
  race: 'Anão',
  hp: { current: 38, max: 45 },
  ac: 18,
  status: [
    { name: 'Força', value: 16 },
    { name: 'Destreza', value: 10 },
    { name: 'Constituição', value: 18 },
    { name: 'Inteligência', value: 12 },
    { name: 'Sabedoria', value: 14 },
    { name: 'Carisma', value: 8 }
  ],
  abilities: [
    { name: 'Second Wind', description: 'Recupera 1d10 + 5 pontos de vida. Recarrega após descanso curto.' },
    { name: 'Action Surge', description: 'Realiza uma ação adicional. Recarrega após descanso longo.' }
  ],
  inventory: [
    { name: 'Martelo de Guerra', type: 'weapon', damage: '1d8+3' },
    { name: 'Escudo', type: 'shield', ac: '+2' },
    { name: 'Poção de Cura', type: 'potion', amount: 2 }
  ]
};

// Mock data for the game session
const mockSession = {
  id: '1',
  name: 'A Masmorra do Dragão Vermelho',
  dm: 'Mestre Gabriel',
  players: [
    { id: '1', name: 'João', character: 'Thorian', class: 'Guerreiro', level: 5, hp: { current: 38, max: 45 } },
    { id: '2', name: 'Maria', character: 'Elyndra', class: 'Maga', level: 5, hp: { current: 25, max: 30 } },
    { id: '3', name: 'Pedro', character: 'Grimlock', class: 'Bárbaro', level: 5, hp: { current: 52, max: 55 } },
    { id: '4', name: 'Ana', character: 'Seraphina', class: 'Clérigo', level: 5, hp: { current: 28, max: 40 } }
  ],
  currentMap: {
    name: "Entrada da Masmorra",
    imageUrl: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25"
  }
};

const PlayerView = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("map");
  const [showChatModal, setShowChatModal] = useState(false);
  const [showCharacterSheet, setShowCharacterSheet] = useState(false);
  
  const character = mockCharacter; // In a real app, fetch character based on the user
  const session = mockSession; // In a real app, fetch this based on the ID
  
  const tabs = [
    { id: "map", label: "Mapa", icon: Map },
    { id: "notes", label: "Anotações", icon: ClipboardList },
    { id: "character", label: "Personagem", icon: User }
  ];
  
  return (
    <MainLayout>
      <div className="container mx-auto pb-16">
        {/* Header */}
        <div className="flex items-center mb-6 justify-between">
          <div className="flex items-center">
            <Link to="/tables" className="mr-4">
              <ArrowLeft className="text-fantasy-stone hover:text-white transition-colors" />
            </Link>
            <div>
              <h1 className="text-2xl font-medievalsharp text-white">{session.name}</h1>
              <p className="text-fantasy-stone text-sm">Mestre: {session.dm}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-fantasy-purple text-white py-2 px-4 rounded-lg font-medievalsharp flex items-center gap-2"
              onClick={() => setShowChatModal(true)}
            >
              <MessageCircle size={16} />
              Chat
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-fantasy-gold text-fantasy-dark py-2 px-4 rounded-lg font-medievalsharp flex items-center gap-2"
            >
              <Dice size={16} />
              Dados
            </motion.button>
          </div>
        </div>
        
        {/* Character Status Bar */}
        <div className="fantasy-card p-3 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-fantasy-gold">
                <img 
                  src="https://images.unsplash.com/photo-1501854140801-50d01698950b" 
                  alt={character.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-white font-medievalsharp">{character.name}</h2>
                <p className="text-fantasy-stone text-xs">{character.race} {character.class} Nível {character.level}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <HeartPulse size={18} className="text-red-500" />
                <span className="text-white">{character.hp.current}/{character.hp.max}</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield size={18} className="text-blue-400" />
                <span className="text-white">{character.ac}</span>
              </div>
              <button 
                className="bg-fantasy-purple/20 hover:bg-fantasy-purple/30 text-fantasy-purple p-1 rounded"
                onClick={() => setShowCharacterSheet(!showCharacterSheet)}
              >
                <Eye size={18} />
              </button>
            </div>
          </div>
          
          {showCharacterSheet && (
            <div className="mt-4 pt-4 border-t border-fantasy-purple/20">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
                {character.status.map((stat, index) => (
                  <div key={index} className="bg-fantasy-dark/40 p-2 rounded text-center">
                    <div className="text-xs text-fantasy-stone">{stat.name}</div>
                    <div className="text-lg text-white font-medievalsharp">{stat.value}</div>
                    <div className="text-xs text-fantasy-gold">
                      {Math.floor((stat.value - 10) / 2) >= 0 ? '+' : ''}{Math.floor((stat.value - 10) / 2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medievalsharp text-fantasy-gold mb-2">Habilidades</h3>
                  <div className="space-y-2">
                    {character.abilities.map((ability, index) => (
                      <div key={index} className="bg-fantasy-dark/40 p-2 rounded">
                        <div className="flex justify-between">
                          <h4 className="text-white text-sm font-medievalsharp">{ability.name}</h4>
                          <button className="bg-fantasy-purple/60 hover:bg-fantasy-purple/80 text-white text-xs py-0.5 px-2 rounded">
                            Usar
                          </button>
                        </div>
                        <p className="text-fantasy-stone text-xs">{ability.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medievalsharp text-fantasy-gold mb-2">Inventário</h3>
                  <div className="space-y-2">
                    {character.inventory.map((item, index) => (
                      <div key={index} className="bg-fantasy-dark/40 p-2 rounded">
                        <div className="flex justify-between">
                          <h4 className="text-white text-sm font-medievalsharp">{item.name}</h4>
                          <button className="bg-fantasy-purple/60 hover:bg-fantasy-purple/80 text-white text-xs py-0.5 px-2 rounded">
                            {item.type === 'weapon' ? 'Atacar' : 
                             item.type === 'potion' ? 'Usar' : 'Equipar'}
                          </button>
                        </div>
                        <p className="text-fantasy-stone text-xs">
                          {item.type === 'weapon' && `Dano: ${item.damage}`}
                          {item.type === 'shield' && `CA: ${item.ac}`}
                          {item.type === 'potion' && `Quantidade: ${item.amount}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Tabs */}
        <div className="flex overflow-x-auto mb-6 gap-2 pb-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`py-3 px-4 rounded-full font-medievalsharp transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id 
                  ? 'bg-fantasy-purple text-white' 
                  : 'bg-fantasy-dark/50 text-fantasy-stone hover:bg-fantasy-dark'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Content based on active tab */}
        <div className="fantasy-card p-6">
          {activeTab === "map" && (
            <div>
              <h2 className="text-xl font-medievalsharp text-white mb-4">Mapa da Aventura</h2>
              
              <div className="w-full h-[400px] bg-fantasy-dark/20 rounded-lg overflow-hidden relative mb-6">
                {session.currentMap ? (
                  <img 
                    src={session.currentMap.imageUrl} 
                    alt={session.currentMap.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Map className="text-fantasy-purple/30" size={64} />
                    <p className="text-fantasy-stone mt-2">Nenhum mapa disponível</p>
                  </div>
                )}
                
                {session.currentMap && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-fantasy-dark to-transparent p-4">
                    <h3 className="text-white font-medievalsharp">{session.currentMap.name}</h3>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-medievalsharp text-fantasy-gold mb-3">Grupo</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {session.players.map(player => (
                    <div key={player.id} className="bg-fantasy-dark/30 p-3 rounded-lg">
                      <h4 className="text-white font-medievalsharp">{player.character}</h4>
                      <p className="text-xs text-fantasy-stone">{player.class} Nível {player.level}</p>
                      <div className="mt-2 h-1 bg-fantasy-dark rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            player.hp.current / player.hp.max > 0.6 ? 'bg-green-500' : 
                            player.hp.current / player.hp.max > 0.3 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${(player.hp.current / player.hp.max) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-fantasy-stone">HP</span>
                        <span className="text-xs text-fantasy-stone">
                          {player.hp.current}/{player.hp.max}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "notes" && (
            <div>
              <h2 className="text-xl font-medievalsharp text-white mb-4">Suas Anotações</h2>
              
              <div className="mb-6">
                <textarea
                  className="w-full bg-fantasy-dark/20 border border-fantasy-purple/30 text-white rounded-lg p-4 min-h-[300px] font-serif leading-relaxed"
                  placeholder="Faça suas anotações da aventura aqui..."
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-fantasy-purple text-white py-2 px-4 rounded-lg font-medievalsharp"
                >
                  Salvar Anotações
                </motion.button>
              </div>
            </div>
          )}
          
          {activeTab === "character" && (
            <div>
              <h2 className="text-xl font-medievalsharp text-white mb-4">Ficha de Personagem</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Character Info */}
                <div className="fantasy-card p-6 md:col-span-1">
                  <div className="h-40 w-40 mx-auto rounded-full overflow-hidden border-4 border-fantasy-purple/30 mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1501854140801-50d01698950b" 
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
                      <span className="text-fantasy-stone">Classe de Armadura:</span>
                      <span className="text-white">{character.ac}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-fantasy-stone">Pontos de Vida:</span>
                      <span className="text-white">{character.hp.current}/{character.hp.max}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-fantasy-purple text-white py-2 rounded-lg font-medievalsharp flex items-center justify-center gap-2"
                    >
                      <HeartPulse size={16} />
                      Restaurar HP
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-fantasy-dark/80 text-fantasy-gold py-2 px-3 rounded-lg"
                    >
                      <BatteryMedium size={16} />
                    </motion.button>
                  </div>
                </div>
                
                {/* Character Stats & Skills */}
                <div className="md:col-span-2 space-y-6">
                  {/* Attributes */}
                  <div className="fantasy-card p-6">
                    <h3 className="text-xl font-medievalsharp text-white mb-4">Atributos</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                      {character.status.map((stat, index) => (
                        <div key={index} className="bg-fantasy-dark/30 p-3 rounded-lg text-center">
                          <div className="text-xs text-fantasy-stone uppercase mb-1">{stat.name}</div>
                          <div className="text-2xl font-medievalsharp text-white">{stat.value}</div>
                          <div className="text-sm text-fantasy-gold mt-1">
                            {Math.floor((stat.value - 10) / 2) >= 0 ? '+' : ''}{Math.floor((stat.value - 10) / 2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Abilities */}
                  <div className="fantasy-card p-6">
                    <h3 className="text-xl font-medievalsharp text-white mb-4">Habilidades</h3>
                    
                    <div className="space-y-3">
                      {character.abilities.map((ability, index) => (
                        <div key={index} className="p-3 rounded-lg bg-fantasy-dark/30">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-white font-medievalsharp">{ability.name}</span>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-fantasy-purple/60 hover:bg-fantasy-purple/80 text-white text-sm py-1 px-3 rounded"
                            >
                              Usar
                            </motion.button>
                          </div>
                          <p className="text-sm text-fantasy-stone">{ability.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Inventory */}
                  <div className="fantasy-card p-6">
                    <h3 className="text-xl font-medievalsharp text-white mb-4">Inventário</h3>
                    
                    <div className="space-y-3">
                      {character.inventory.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-fantasy-dark/30">
                          <div>
                            <span className="text-white font-medievalsharp">{item.name}</span>
                            <div className="text-xs text-fantasy-stone">
                              {item.type === 'weapon' && `Dano: ${item.damage}`}
                              {item.type === 'shield' && `CA: ${item.ac}`}
                              {item.type === 'potion' && `Quantidade: ${item.amount}`}
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-fantasy-purple/60 hover:bg-fantasy-purple/80 text-white text-sm py-1 px-3 rounded flex items-center gap-1"
                          >
                            {item.type === 'weapon' ? (
                              <>
                                <Sword size={14} />
                                Atacar
                              </>
                            ) : item.type === 'potion' ? (
                              <>
                                <HeartPulse size={14} />
                                Usar
                              </>
                            ) : (
                              <>
                                <Shield size={14} />
                                Equipar
                              </>
                            )}
                          </motion.button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="bg-fantasy-dark border border-fantasy-purple/30 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] flex flex-col"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medievalsharp text-fantasy-purple">Chat da Mesa</h2>
              <button 
                onClick={() => setShowChatModal(false)}
                className="text-fantasy-stone hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto mb-4 min-h-[300px] bg-fantasy-dark/50 rounded-lg p-3">
              <div className="space-y-3">
                {/* Chat messages would go here - same as in GameMasterView */}
              </div>
            </div>
            
            <div className="flex gap-2">
              <select className="bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg py-2 px-3 text-sm">
                <option value="normal">Normal</option>
                <option value="sussurro">Sussurro</option>
                <option value="grito">Grito</option>
                <option value="interpretando">Interpretando</option>
              </select>
              <input
                type="text"
                className="flex-1 bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg py-2 px-3"
                placeholder="Digite sua mensagem..."
              />
              <button className="bg-fantasy-purple text-white py-2 px-4 rounded-lg">
                Enviar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </MainLayout>
  );
};

export default PlayerView;
