
import MainLayout from "@/components/layout/MainLayout";
import { Package, Sword, User2, MapPin, BookOpen, Skull, Filter, Search, Eye, 
  Heart, Brain, Shield, Dices, Coffee, CheckCircle, Table } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DiceRoller } from "@/components/dice/DiceRoller";
import { CharacterCard } from "@/components/game/CharacterCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Categorias do inventário
const inventoryCategories = [
  {
    title: "Personagens",
    icon: User2,
    description: "Heróis, vilões e todos os personagens que você criou",
    count: 4,
    action: "Ver Personagens",
    path: "/inventory/characters"
  },
  {
    title: "Itens & Armas",
    icon: Sword,
    description: "Armas mágicas, itens encantados e tesouros em seu inventário",
    count: 8,
    action: "Ver Itens",
    path: "/inventory/items"
  },
  {
    title: "Mapas",
    icon: MapPin,
    description: "Mapas de reinos, cidades e calabouços que você criou",
    count: 3,
    action: "Ver Mapas",
    path: "/inventory/maps"
  },
  {
    title: "Histórias",
    icon: BookOpen,
    description: "Aventuras, missões e histórias que você elaborou",
    count: 5,
    action: "Ver Histórias",
    path: "/inventory/stories"
  },
  {
    title: "Monstros",
    icon: Skull,
    description: "Criaturas e monstros para desafiar seus jogadores",
    count: 4,
    action: "Ver Monstros",
    path: "/inventory/monsters"
  },
  {
    title: "Mesas",
    icon: Table,
    description: "Mesas de jogo que você criou ou participa",
    count: 2,
    action: "Ver Mesas",
    path: "/inventory/tables"
  }
];

// Dados dos personagens para exibição rápida
const quickCharacters = [
  {
    name: "Elrond Mithrandir",
    level: 5,
    class: "Mago",
    race: "Elfo",
    stats: [
      { name: "Vida", value: 32, max: 40 },
      { name: "Mana", value: 45, max: 50 },
      { name: "Força", value: 10 },
      { name: "Destreza", value: 14 },
      { name: "Constituição", value: 12 },
      { name: "Inteligência", value: 18 },
      { name: "Sabedoria", value: 16 },
      { name: "Carisma", value: 13 }
    ]
  },
  {
    name: "Thorin Escudocarvalho",
    level: 4,
    class: "Guerreiro",
    race: "Anão",
    stats: [
      { name: "Vida", value: 50, max: 55 },
      { name: "Energia", value: 30, max: 35 },
      { name: "Força", value: 16 },
      { name: "Destreza", value: 12 },
      { name: "Constituição", value: 18 },
      { name: "Inteligência", value: 10 },
      { name: "Sabedoria", value: 13 },
      { name: "Carisma", value: 8 }
    ]
  }
];

// Itens para exibição rápida
const quickItems = [
  {
    name: "Cajado Arcano",
    description: "Um cajado poderoso que canaliza energias mágicas.",
    rarity: "rare" as const,
    type: "Arma - Cajado",
    stats: {
      inteligência: 5,
      danoMágico: 15,
      regenMana: 2
    },
    equipped: true
  },
  {
    name: "Vestes Élficas",
    description: "Vestes leves tecidas com seda élfica encantada.",
    rarity: "common" as const,
    type: "Armadura - Tecido",
    stats: {
      defesa: 8,
      resistênciaMágica: 12,
      velocidade: 3
    },
    equipped: true
  },
  {
    name: "Amuleto da Proteção",
    description: "Um amuleto antigo que oferece proteção contra forças malignas.",
    rarity: "uncommon" as const,
    type: "Acessório - Amuleto",
    stats: {
      resistênciaElemental: 10,
      carisma: 3,
      percepção: 5
    },
    equipped: false
  },
];

// Lista de magias do personagem
const quickSpells = [
  { name: "Mísseis Mágicos", level: 1, type: "Evocação", castingTime: "1 ação" },
  { name: "Escudo Arcano", level: 1, type: "Abjuração", castingTime: "1 reação" },
  { name: "Bola de Fogo", level: 3, type: "Evocação", castingTime: "1 ação" },
];

const Inventory = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('categories');
  const [characterTab, setCharacterTab] = useState('attributes');
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  
  // Função para renderizar a ficha completa de personagem no estilo D&D 5e
  const renderCharacterSheet = (character: typeof quickCharacters[0]) => {
    return (
      <div className="fantasy-card p-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Cabeçalho da ficha */}
          <div className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <h2 className="text-2xl font-medievalsharp text-fantasy-gold">{character.name}</h2>
                <p className="text-fantasy-stone">{character.race} • {character.class} • Nível {character.level}</p>
              </div>
              
              <div className="mt-2 md:mt-0 flex gap-2">
                <button className="fantasy-button secondary text-xs py-1.5">Editar</button>
                <button className="fantasy-button primary text-xs py-1.5">Imprimir</button>
              </div>
            </div>

            <Tabs defaultValue={characterTab} onValueChange={setCharacterTab} className="w-full">
              <TabsList className="bg-fantasy-dark/70 border-b border-fantasy-purple/30 p-0 rounded-none w-full flex justify-start overflow-x-auto">
                <TabsTrigger 
                  value="attributes" 
                  className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-fantasy-gold rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent"
                >
                  Atributos
                </TabsTrigger>
                <TabsTrigger 
                  value="skills" 
                  className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-fantasy-gold rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent"
                >
                  Perícias
                </TabsTrigger>
                <TabsTrigger 
                  value="equipment" 
                  className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-fantasy-gold rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent"
                >
                  Equipamento
                </TabsTrigger>
                <TabsTrigger 
                  value="spells" 
                  className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-fantasy-gold rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent"
                >
                  Magias
                </TabsTrigger>
                <TabsTrigger 
                  value="background" 
                  className="py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-fantasy-gold rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent"
                >
                  História
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="attributes" className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Vida e recursos */}
                  <div className="fantasy-border p-3">
                    <h3 className="text-center font-medievalsharp text-fantasy-purple mb-2">Recursos</h3>
                    <div className="space-y-3">
                      {character.stats.filter(stat => stat.max).map((stat, index) => (
                        <div key={index}>
                          <div className="flex justify-between">
                            <span className="text-sm">{stat.name}</span>
                            <span className="text-sm font-medium">{stat.value}/{stat.max}</span>
                          </div>
                          <div className="h-2 bg-fantasy-dark/70 rounded-full mt-1">
                            <div 
                              className="h-full bg-gradient-to-r from-fantasy-purple to-fantasy-accent rounded-full" 
                              style={{ width: `${(stat.value / (stat.max || 1)) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Atributos principais */}
                  <div className="fantasy-border p-3">
                    <h3 className="text-center font-medievalsharp text-fantasy-purple mb-2">Atributos Físicos</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {character.stats.filter(stat => ['Força', 'Destreza', 'Constituição'].includes(stat.name)).map((stat, index) => (
                        <div key={index} className="text-center">
                          <div className="w-14 h-14 mx-auto rounded-full border-2 border-fantasy-purple/50 bg-fantasy-dark/30 flex items-center justify-center">
                            <span className="text-xl font-medievalsharp text-fantasy-gold">{stat.value}</span>
                          </div>
                          <div className="mt-1 text-xs text-fantasy-stone">
                            {stat.name}
                            <div className="text-xxs">
                              {Math.floor((stat.value - 10) / 2) >= 0 ? '+' : ''}
                              {Math.floor((stat.value - 10) / 2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Atributos mentais */}
                  <div className="fantasy-border p-3">
                    <h3 className="text-center font-medievalsharp text-fantasy-purple mb-2">Atributos Mentais</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {character.stats.filter(stat => ['Inteligência', 'Sabedoria', 'Carisma'].includes(stat.name)).map((stat, index) => (
                        <div key={index} className="text-center">
                          <div className="w-14 h-14 mx-auto rounded-full border-2 border-fantasy-purple/50 bg-fantasy-dark/30 flex items-center justify-center">
                            <span className="text-xl font-medievalsharp text-fantasy-gold">{stat.value}</span>
                          </div>
                          <div className="mt-1 text-xs text-fantasy-stone">
                            {stat.name}
                            <div className="text-xxs">
                              {Math.floor((stat.value - 10) / 2) >= 0 ? '+' : ''}
                              {Math.floor((stat.value - 10) / 2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="skills" className="pt-4">
                <div className="fantasy-border p-4">
                  <h3 className="text-center font-medievalsharp text-fantasy-purple mb-4">Perícias</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['Acrobacia', 'Arcanismo', 'Atletismo', 'Atuação', 'Blefar', 'Furtividade', 'História', 'Intimidação', 'Intuição', 'Investigação', 'Lidar com Animais', 'Medicina', 'Natureza', 'Percepção', 'Persuasão', 'Prestidigitação', 'Religião', 'Sobrevivência'].map((skill, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border border-fantasy-purple/70 flex items-center justify-center">
                          {index % 3 === 0 && <CheckCircle size={12} className="text-fantasy-gold" />}
                        </div>
                        <span className="text-sm text-fantasy-stone">{skill}</span>
                        <span className="text-xs ml-auto">
                          {index % 3 === 0 ? '+3' : '+0'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="equipment" className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="fantasy-border p-4">
                    <h3 className="text-center font-medievalsharp text-fantasy-purple mb-3">Equipamentos</h3>
                    <div className="space-y-2">
                      {quickItems.map((item, index) => (
                        <div key={index} className="fantasy-border p-2 bg-fantasy-dark/20">
                          <div className="flex justify-between">
                            <div>
                              <span className="text-sm font-medievalsharp">{item.name}</span>
                              <div className="text-xs text-fantasy-stone">{item.type}</div>
                            </div>
                            {item.equipped && (
                              <span className="text-xs bg-fantasy-purple/20 text-fantasy-purple rounded-full px-2 py-0.5 h-fit">
                                Equipado
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="fantasy-border p-4">
                    <h3 className="text-center font-medievalsharp text-fantasy-purple mb-3">Inventário</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Moedas de Ouro</span>
                        <span>120</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Moedas de Prata</span>
                        <span>35</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Moedas de Cobre</span>
                        <span>57</span>
                      </div>
                      <div className="h-px bg-fantasy-purple/20 my-2"></div>
                      <div className="space-y-1">
                        <div className="text-sm">• Poção de Cura (2)</div>
                        <div className="text-sm">• Corda (15m)</div>
                        <div className="text-sm">• Livro de Feitiços</div>
                        <div className="text-sm">• Componentes Arcanos</div>
                        <div className="text-sm">• Símbolo Sagrado</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="spells" className="pt-4">
                <div className="fantasy-border p-4">
                  <h3 className="text-center font-medievalsharp text-fantasy-purple mb-3">Grimório</h3>
                  
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm font-medievalsharp text-fantasy-purple mb-1">
                      <div>Truques</div>
                      <div>Nível 1</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="fantasy-border p-2 bg-fantasy-dark/20">
                        <div className="space-y-1 text-sm">
                          <div>• Luz</div>
                          <div>• Mãos Mágicas</div>
                          <div>• Prestidigitação</div>
                          <div>• Raio de Gelo</div>
                        </div>
                      </div>
                      
                      <div className="fantasy-border p-2 bg-fantasy-dark/20">
                        <div className="space-y-1 text-sm">
                          {quickSpells.filter(spell => spell.level === 1).map((spell, index) => (
                            <div key={index}>• {spell.name}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm font-medievalsharp text-fantasy-purple mb-1 mt-3">
                      <div>Nível 2</div>
                      <div>Nível 3</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="fantasy-border p-2 bg-fantasy-dark/20">
                        <div className="space-y-1 text-sm">
                          <div>• Invisibilidade</div>
                          <div>• Passos Sem Rastros</div>
                        </div>
                      </div>
                      
                      <div className="fantasy-border p-2 bg-fantasy-dark/20">
                        <div className="space-y-1 text-sm">
                          {quickSpells.filter(spell => spell.level === 3).map((spell, index) => (
                            <div key={index}>• {spell.name}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="background" className="pt-4">
                <div className="fantasy-border p-4">
                  <h3 className="text-center font-medievalsharp text-fantasy-purple mb-3">História do Personagem</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medievalsharp text-fantasy-gold mb-1">Antecedente</h4>
                      <p className="text-sm text-fantasy-stone">Sábio - Pesquisador Arcano</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medievalsharp text-fantasy-gold mb-1">Alinhamento</h4>
                      <p className="text-sm text-fantasy-stone">Neutro e Bom</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medievalsharp text-fantasy-gold mb-1">Traços de Personalidade</h4>
                      <p className="text-sm text-fantasy-stone">Curioso e metódico, sempre em busca de conhecimento. Tende a falar de forma complexa mesmo em situações simples.</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medievalsharp text-fantasy-gold mb-1">Ideais</h4>
                      <p className="text-sm text-fantasy-stone">Conhecimento - O caminho para o poder e auto-aperfeiçoamento é através do conhecimento.</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medievalsharp text-fantasy-gold mb-1">Vínculos</h4>
                      <p className="text-sm text-fantasy-stone">Protege uma antiga biblioteca élfica que contém segredos arcanos.</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medievalsharp text-fantasy-gold mb-1">Defeitos</h4>
                      <p className="text-sm text-fantasy-stone">A maioria das pessoas grita e corre quando vê um demônio. Eu paro e tomo notas sobre sua anatomia.</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medievalsharp text-fantasy-gold mb-1">História</h4>
                      <p className="text-sm text-fantasy-stone">Nascido em uma família de magos elfos, Elrond dedicou sua vida ao estudo das artes arcanas. Após séculos de aprendizado na Biblioteca de Candlekeep, decidiu aventurar-se pelo mundo em busca de conhecimentos perdidos e artefatos mágicos.</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto pb-16">
        <h1 className="text-3xl font-medievalsharp text-white mb-4 text-center">Seu Inventário</h1>
        <p className="text-fantasy-stone text-center mb-8">
          Veja e gerencie todas as suas criações e itens
        </p>
        
        {/* Tabs para alternar entre modos de visualização */}
        <div className="flex justify-center mb-8">
          <div className="fantasy-border inline-flex p-1 rounded-xl">
            <button 
              className={`px-4 py-2 rounded-lg text-sm font-medievalsharp ${activeTab === 'categories' ? 'bg-fantasy-purple text-white' : 'text-fantasy-stone hover:bg-fantasy-purple/20'}`}
              onClick={() => setActiveTab('categories')}
            >
              Categorias
            </button>
            <button 
              className={`px-4 py-2 rounded-lg text-sm font-medievalsharp ${activeTab === 'recent' ? 'bg-fantasy-purple text-white' : 'text-fantasy-stone hover:bg-fantasy-purple/20'}`}
              onClick={() => setActiveTab('recent')}
            >
              Recentes
            </button>
            <button 
              className={`px-4 py-2 rounded-lg text-sm font-medievalsharp ${activeTab === 'character' ? 'bg-fantasy-purple text-white' : 'text-fantasy-stone hover:bg-fantasy-purple/20'}`}
              onClick={() => setActiveTab('character')}
            >
              Ficha D&D
            </button>
          </div>
        </div>
        
        {activeTab === 'categories' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {inventoryCategories.map((category, index) => (
              <div key={index} className="fantasy-card p-6 flex flex-col items-center">
                <category.icon className="text-fantasy-purple w-12 h-12 mb-4" />
                <h2 className="text-2xl font-medievalsharp text-fantasy-purple mb-2">{category.title}</h2>
                <p className="text-center text-fantasy-stone mb-4">{category.description}</p>
                
                <div className="mt-auto w-full">
                  <div className="bg-fantasy-dark/40 rounded-full py-2 px-4 text-center mb-4">
                    <span className="font-medievalsharp text-fantasy-gold">{category.count} itens</span>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-fantasy-purple text-white py-3 rounded-lg font-medievalsharp"
                    onClick={() => navigate(category.path)}
                  >
                    {category.action}
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === 'recent' ? (
          <div className="space-y-8">
            {/* Personagens recentes */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-medievalsharp text-white">Personagens Recentes</h2>
                <Link to="/inventory/characters" className="text-fantasy-purple hover:text-fantasy-accent text-sm flex items-center">
                  Ver todos <Eye className="ml-1 h-4 w-4" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickCharacters.map((character, index) => (
                  <CharacterCard 
                    key={index}
                    name={character.name}
                    level={character.level}
                    class={character.class}
                    race={character.race}
                    stats={character.stats.filter(stat => stat.max || ['Força', 'Inteligência'].includes(stat.name))}
                  />
                ))}
              </div>
            </div>
            
            {/* Itens recentes */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-medievalsharp text-white">Itens Recentes</h2>
                <Link to="/inventory/items" className="text-fantasy-purple hover:text-fantasy-accent text-sm flex items-center">
                  Ver todos <Eye className="ml-1 h-4 w-4" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickItems.map((item, index) => (
                  <div key={index} className="fantasy-card">
                    <div className="flex gap-3">
                      <div className={`h-16 w-16 rounded border-2 border-fantasy-purple/30 bg-fantasy-dark/30 flex items-center justify-center overflow-hidden`}>
                        <div className="text-xl font-medievalsharp">
                          {item.type.includes('Cajado') ? <Sword size={24} className="text-fantasy-gold" /> : 
                           item.type.includes('Armadura') ? <Shield size={24} className="text-fantasy-gold" /> : 
                           <Coffee size={24} className="text-fantasy-gold" />}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medievalsharp">{item.name}</h3>
                          {item.equipped && (
                            <span className="text-xs bg-fantasy-purple/20 text-fantasy-purple rounded-full px-2 py-0.5">
                              Equipado
                            </span>
                          )}
                        </div>
                        
                        <div className="text-xs text-muted-foreground">{item.type}</div>
                        <p className="text-xs mt-1 text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-fantasy-purple/20 flex justify-end gap-2">
                      <button className="fantasy-button text-xs py-1 primary">Ver Detalhes</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Ficha completa no estilo D&D 5e
          renderCharacterSheet(quickCharacters[0])
        )}
        
        {/* Componente de rolagem de dados */}
        <div className="fixed bottom-6 right-6 z-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-fantasy-gold text-fantasy-dark w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
            onClick={() => {
              const result = Math.floor(Math.random() * 20) + 1;
              // toast para mostrar o resultado do dado
            }}
          >
            <Dices size={24} />
          </motion.button>
        </div>
        
        <DiceRoller />
      </div>
    </MainLayout>
  );
};

export default Inventory;
