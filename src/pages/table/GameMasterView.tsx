
import React, { useState } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import { ArrowLeft, Book, Map, Users, Skull, ClipboardList, MessageCircle, Dice, ChevronRight, ChevronLeft, Plus, FileText, Sword, Shield } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

// Mock data for the game session
const mockSession = {
  id: '1',
  name: 'A Masmorra do Dragão Vermelho',
  campaign: 'Águas Profundas',
  dm: 'Mestre Gabriel',
  players: [
    { id: '1', name: 'João', character: 'Thorian', class: 'Guerreiro', level: 4 },
    { id: '2', name: 'Maria', character: 'Elyndra', class: 'Maga', level: 4 },
    { id: '3', name: 'Pedro', character: 'Grimlock', class: 'Bárbaro', level: 4 },
    { id: '4', name: 'Ana', character: 'Seraphina', class: 'Clérigo', level: 4 }
  ],
  npcs: [
    { id: '1', name: 'Balthazar', race: 'Humano', occupation: 'Taverneiro' },
    { id: '2', name: 'Elminster', race: 'Humano', occupation: 'Mago' },
    { id: '3', name: 'Drizzt', race: 'Drow', occupation: 'Ranger' }
  ],
  monsters: [
    { id: '1', name: 'Dragão Vermelho Jovem', cr: '10', hp: 178 },
    { id: '2', name: 'Kobold', cr: '1/8', hp: 5 },
    { id: '3', name: 'Cultista', cr: '1/8', hp: 9 }
  ],
  notes: [
    { id: '1', title: 'Segredos do Dragão', content: 'O dragão está procurando um artefato antigo...' },
    { id: '2', title: 'Recompensas', content: '2000 PO, Espada da Chama Eterna, Poção de Cura Superior' }
  ],
  maps: [
    { id: '1', name: 'Entrada da Masmorra', imageUrl: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25' },
    { id: '2', name: 'Sala do Tesouro', imageUrl: 'https://images.unsplash.com/photo-1514480924801-91ca74ea39e3' }
  ]
};

const GameMasterView = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("story");
  const [currentMapIndex, setCurrentMapIndex] = useState(0);
  const [showPlayerControls, setShowPlayerControls] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  
  const session = mockSession; // In a real app, fetch this based on the ID
  
  const nextMap = () => {
    setCurrentMapIndex((prev) => (prev + 1) % session.maps.length);
  };
  
  const prevMap = () => {
    setCurrentMapIndex((prev) => (prev - 1 + session.maps.length) % session.maps.length);
  };
  
  const tabs = [
    { id: "story", label: "História", icon: Book },
    { id: "maps", label: "Mapas", icon: Map },
    { id: "characters", label: "Personagens", icon: Users },
    { id: "monsters", label: "Monstros", icon: Skull },
    { id: "notes", label: "Notas", icon: ClipboardList }
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
              <p className="text-fantasy-stone text-sm">Campanha: {session.campaign}</p>
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
              Chat da Mesa
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-fantasy-gold text-fantasy-dark py-2 px-4 rounded-lg font-medievalsharp flex items-center gap-2"
            >
              <Dice size={16} />
              Rolar Dados
            </motion.button>
          </div>
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
          {activeTab === "story" && (
            <div>
              <h2 className="text-xl font-medievalsharp text-white mb-4">História da Sessão</h2>
              
              <div className="bg-fantasy-dark/20 p-6 rounded-lg mb-6">
                <div className="prose prose-invert max-w-none">
                  <p>Os aventureiros adentraram a caverna seguindo rumores de que um dragão vermelho jovem havia feito dela seu covil. Eles passaram por várias armadilhas e enfrentaram kobolds que serviam à criatura.</p>
                  
                  <p>Agora, eles estão prestes a chegar à câmara principal, onde o dragão guarda seu tesouro. No entanto, eles precisam primeiro passar pelos cultistas que adoram a besta e protegem a entrada.</p>
                  
                  <h3>Objetivos Atuais:</h3>
                  <ul>
                    <li>Derrotar os cultistas guardando a entrada</li>
                    <li>Encontrar uma maneira de entrar na câmara do tesouro sem alertar o dragão</li>
                    <li>Recuperar o artefato roubado da cidade</li>
                  </ul>
                  
                  <h3>Eventos Recentes:</h3>
                  <ul>
                    <li>Os jogadores encontraram um prisioneiro que revelou informações sobre uma entrada secreta</li>
                    <li>Eles descobriram que o cultista líder carrega uma chave especial</li>
                    <li>Um dos jogadores foi ferido por uma armadilha de fogo, possivelmente alertando os guardas</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-fantasy-purple/80 hover:bg-fantasy-purple text-white py-2 px-4 rounded-lg font-medievalsharp flex items-center gap-2"
                >
                  <FileText size={16} />
                  Editar História
                </motion.button>
              </div>
            </div>
          )}
          
          {activeTab === "maps" && (
            <div>
              <h2 className="text-xl font-medievalsharp text-white mb-4">Mapas da Sessão</h2>
              
              <div className="relative">
                <div className="w-full h-[400px] bg-fantasy-dark/20 rounded-lg overflow-hidden relative mb-4">
                  {session.maps.length > 0 ? (
                    <img 
                      src={session.maps[currentMapIndex].imageUrl} 
                      alt={session.maps[currentMapIndex].name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Map className="text-fantasy-purple/30" size={64} />
                      <p className="text-fantasy-stone mt-2">Nenhum mapa adicionado</p>
                    </div>
                  )}
                  
                  {session.maps.length > 1 && (
                    <>
                      <button 
                        onClick={prevMap}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-fantasy-dark/70 text-white p-2 rounded-full"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button 
                        onClick={nextMap}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-fantasy-dark/70 text-white p-2 rounded-full"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}
                </div>
                
                {session.maps.length > 0 && (
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medievalsharp text-white">
                      {session.maps[currentMapIndex].name}
                    </h3>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-fantasy-purple/80 hover:bg-fantasy-purple text-white py-2 px-4 rounded-lg font-medievalsharp"
                        onClick={() => setShowPlayerControls(!showPlayerControls)}
                      >
                        {showPlayerControls ? "Ocultar Controles" : "Mostrar aos Jogadores"}
                      </motion.button>
                    </div>
                  </div>
                )}
                
                {showPlayerControls && (
                  <div className="bg-fantasy-dark/40 p-4 rounded-lg mb-4">
                    <h3 className="text-sm font-medievalsharp text-white mb-2">Controles para os Jogadores</h3>
                    <div className="flex flex-wrap gap-2">
                      <button className="bg-fantasy-purple/60 hover:bg-fantasy-purple/80 text-white text-sm py-1 px-3 rounded">
                        Revelar Área 1
                      </button>
                      <button className="bg-fantasy-purple/60 hover:bg-fantasy-purple/80 text-white text-sm py-1 px-3 rounded">
                        Revelar Área 2
                      </button>
                      <button className="bg-fantasy-purple/60 hover:bg-fantasy-purple/80 text-white text-sm py-1 px-3 rounded">
                        Ocultar Armadilhas
                      </button>
                      <button className="bg-fantasy-purple/60 hover:bg-fantasy-purple/80 text-white text-sm py-1 px-3 rounded">
                        Mostrar Monstros
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {session.maps.map((map, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentMapIndex(index)}
                      className={`h-20 rounded-lg overflow-hidden relative ${
                        currentMapIndex === index ? 'ring-2 ring-fantasy-gold' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={map.imageUrl} 
                        alt={map.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-fantasy-dark to-transparent opacity-80"></div>
                      <div className="absolute bottom-1 left-0 right-0 text-center">
                        <span className="text-xs font-medievalsharp text-white">{map.name}</span>
                      </div>
                    </button>
                  ))}
                  
                  <Link to="/maps" className="h-20 rounded-lg bg-fantasy-dark/30 flex flex-col items-center justify-center">
                    <Plus size={24} className="text-fantasy-purple" />
                    <span className="text-xs text-fantasy-stone mt-1">Adicionar Mapa</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "characters" && (
            <div>
              <h2 className="text-xl font-medievalsharp text-white mb-4">Personagens & NPCs</h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-medievalsharp text-fantasy-gold mb-3">Jogadores</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {session.players.map(player => (
                    <div key={player.id} className="bg-fantasy-dark/30 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-fantasy-purple/20 flex items-center justify-center">
                          <Users size={20} className="text-fantasy-gold" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-medievalsharp">{player.character}</h4>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-fantasy-stone">{player.class} Nível {player.level}</p>
                            <span className="text-xs text-fantasy-stone">{player.name}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-3">
                        <button className="bg-fantasy-dark hover:bg-fantasy-dark/80 text-white text-sm py-1 px-3 rounded flex items-center gap-1">
                          <Shield size={14} />
                          Status
                        </button>
                        <button className="bg-fantasy-purple/60 hover:bg-fantasy-purple/80 text-white text-sm py-1 px-3 rounded flex items-center gap-1">
                          <Sword size={14} />
                          Atacar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medievalsharp text-fantasy-gold mb-3">NPCs</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {session.npcs.map(npc => (
                    <div key={npc.id} className="bg-fantasy-dark/30 p-3 rounded-lg">
                      <h4 className="text-white font-medievalsharp">{npc.name}</h4>
                      <p className="text-sm text-fantasy-stone">{npc.race} • {npc.occupation}</p>
                      <div className="flex justify-end mt-2">
                        <button className="bg-fantasy-purple/60 hover:bg-fantasy-purple/80 text-white text-xs py-1 px-2 rounded">
                          Detalhes
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <Link to="/npcs" className="bg-fantasy-dark/20 p-3 rounded-lg flex flex-col items-center justify-center min-h-[100px]">
                    <Plus size={24} className="text-fantasy-purple mb-1" />
                    <span className="text-sm text-fantasy-stone">Adicionar NPC</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "monsters" && (
            <div>
              <h2 className="text-xl font-medievalsharp text-white mb-4">Monstros & Encontros</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {session.monsters.map(monster => (
                  <div key={monster.id} className="bg-fantasy-dark/30 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <h4 className="text-white font-medievalsharp">{monster.name}</h4>
                      <span className="text-xs bg-fantasy-purple/30 px-2 py-0.5 rounded text-fantasy-gold">
                        ND {monster.cr}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-fantasy-stone">HP:</span>
                        <input
                          type="number"
                          className="w-16 bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-1 text-center text-sm"
                          defaultValue={monster.hp}
                        />
                      </div>
                      <div className="flex gap-1">
                        <button className="bg-fantasy-dark hover:bg-fantasy-dark/80 text-red-400 text-sm py-1 px-2 rounded">
                          -
                        </button>
                        <button className="bg-fantasy-dark hover:bg-fantasy-dark/80 text-green-400 text-sm py-1 px-2 rounded">
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
                      <button className="bg-fantasy-dark hover:bg-fantasy-dark/80 text-white text-sm py-1 px-3 rounded">
                        Mostrar
                      </button>
                      <button className="bg-fantasy-purple/60 hover:bg-fantasy-purple/80 text-white text-sm py-1 px-3 rounded flex items-center gap-1">
                        <Sword size={14} />
                        Atacar
                      </button>
                    </div>
                  </div>
                ))}
                
                <Link to="/monsters" className="bg-fantasy-dark/20 p-4 rounded-lg flex flex-col items-center justify-center min-h-[140px]">
                  <Plus size={24} className="text-fantasy-purple mb-1" />
                  <span className="text-sm text-fantasy-stone">Adicionar Monstro</span>
                </Link>
              </div>
              
              <div>
                <h3 className="text-lg font-medievalsharp text-fantasy-gold mb-3">Encontros Rápidos</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button className="bg-fantasy-dark/30 p-3 rounded-lg text-left">
                    <h4 className="text-white font-medievalsharp">Emboscada de Kobolds</h4>
                    <p className="text-xs text-fantasy-stone">4 Kobolds + 1 Líder Kobold</p>
                  </button>
                  <button className="bg-fantasy-dark/30 p-3 rounded-lg text-left">
                    <h4 className="text-white font-medievalsharp">Patrulha de Cultistas</h4>
                    <p className="text-xs text-fantasy-stone">3 Cultistas + 1 Fanático</p>
                  </button>
                  <button className="bg-fantasy-dark/30 p-3 rounded-lg text-left">
                    <h4 className="text-white font-medievalsharp">Armadilha da Câmara</h4>
                    <p className="text-xs text-fantasy-stone">Armadilha de Fogo + 2 Estátuas Animadas</p>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "notes" && (
            <div>
              <h2 className="text-xl font-medievalsharp text-white mb-4">Notas da Sessão</h2>
              
              <div className="space-y-4 mb-6">
                {session.notes.map(note => (
                  <div key={note.id} className="bg-fantasy-dark/30 p-4 rounded-lg">
                    <h3 className="text-lg font-medievalsharp text-white mb-2">{note.title}</h3>
                    <p className="text-fantasy-stone">{note.content}</p>
                    <div className="flex justify-end mt-3">
                      <button className="bg-fantasy-purple/60 hover:bg-fantasy-purple/80 text-white text-sm py-1 px-3 rounded">
                        Editar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-fantasy-dark/20 p-4 rounded-lg">
                <h3 className="text-lg font-medievalsharp text-white mb-3">Nova Nota</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2"
                    placeholder="Título da nota"
                  />
                  <textarea
                    className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2 min-h-[100px]"
                    placeholder="Conteúdo da nota..."
                  ></textarea>
                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-fantasy-purple text-white py-2 px-4 rounded-lg"
                    >
                      Salvar Nota
                    </motion.button>
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
                <div className="flex items-start gap-2">
                  <div className="bg-fantasy-purple/20 rounded-full h-8 w-8 flex items-center justify-center">
                    <Users size={14} className="text-fantasy-gold" />
                  </div>
                  <div className="bg-fantasy-dark/60 rounded-lg p-2 max-w-[80%]">
                    <div className="text-xs text-fantasy-gold mb-1">João (Thorian)</div>
                    <p className="text-fantasy-stone text-sm">Eu acho que devemos explorar o corredor da esquerda primeiro.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="bg-fantasy-purple/20 rounded-full h-8 w-8 flex items-center justify-center">
                    <Users size={14} className="text-fantasy-gold" />
                  </div>
                  <div className="bg-fantasy-dark/60 rounded-lg p-2 max-w-[80%]">
                    <div className="text-xs text-fantasy-gold mb-1">Maria (Elyndra)</div>
                    <p className="text-fantasy-stone text-sm">Concordo. Meus sentidos mágicos indicam algo estranho naquela direção.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 justify-end">
                  <div className="bg-fantasy-purple/40 rounded-lg p-2 max-w-[80%]">
                    <div className="text-xs text-fantasy-gold mb-1">Mestre</div>
                    <p className="text-white text-sm">À medida que vocês se aproximam do corredor, sentem um cheiro de enxofre. O ar está mais quente aqui.</p>
                  </div>
                  <div className="bg-red-500/30 rounded-full h-8 w-8 flex items-center justify-center">
                    <Skull size={14} className="text-red-400" />
                  </div>
                </div>
                
                <div className="text-center text-xs text-fantasy-stone my-2">
                  --- Pedro rolou um d20: 18 ---
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="bg-fantasy-purple/20 rounded-full h-8 w-8 flex items-center justify-center">
                    <Users size={14} className="text-fantasy-gold" />
                  </div>
                  <div className="bg-fantasy-dark/60 rounded-lg p-2 max-w-[80%]">
                    <div className="text-xs text-fantasy-gold mb-1">Pedro (Grimlock)</div>
                    <p className="text-fantasy-stone text-sm">Percepção 18. Estou tentando ouvir se há algo se movendo no corredor.</p>
                  </div>
                </div>
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

export default GameMasterView;
