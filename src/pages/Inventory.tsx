
import MainLayout from "@/components/layout/MainLayout";
import { Package, Sword, User2, MapPin, BookOpen, Skull, Filter, Search, Eye } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DiceRoller } from "@/components/dice/DiceRoller";

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
      { name: "Inteligência", value: 18 },
      { name: "Sabedoria", value: 16 }
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
      { name: "Constituição", value: 18 }
    ]
  }
];

// Itens para exibição rápida
const quickItems = [
  {
    name: "Arcane Staff",
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
    name: "Elven Robes",
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
];

const Inventory = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('categories');
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  
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
          </div>
        </div>
        
        {activeTab === 'categories' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
        ) : (
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
                  <div key={index} className="fantasy-card p-4">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medievalsharp text-lg">{character.name}</h3>
                      <span className="text-fantasy-gold text-sm">Nível {character.level}</span>
                    </div>
                    <div className="text-sm text-fantasy-stone mb-3">{character.race} • {character.class}</div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {character.stats.map((stat, statIndex) => (
                        <div key={statIndex} className="fantasy-border p-2">
                          <div className="flex justify-between mb-1">
                            <span className="text-xs font-medievalsharp">{stat.name}</span>
                            <span className="text-xs font-medium">
                              {stat.max ? `${stat.value}/${stat.max}` : stat.value}
                            </span>
                          </div>
                          
                          {stat.max && (
                            <div className="h-1.5 bg-fantasy-dark rounded-full">
                              <div 
                                className="h-full bg-gradient-to-r from-fantasy-purple to-fantasy-accent rounded-full" 
                                style={{ width: `${(stat.value / stat.max) * 100}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-end">
                      <button className="fantasy-button primary text-xs px-3 py-1">Ver Ficha</button>
                    </div>
                  </div>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickItems.map((item, index) => (
                  <div key={index} className="fantasy-card">
                    <div className="flex gap-3">
                      <div className={`h-16 w-16 rounded border-2 border-fantasy-purple/30 bg-fantasy-dark/30 flex items-center justify-center overflow-hidden`}>
                        <div className="text-xl font-medievalsharp">?</div>
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
        )}
        
        {/* Componente de rolagem de dados */}
        <DiceRoller />
      </div>
    </MainLayout>
  );
};

export default Inventory;
