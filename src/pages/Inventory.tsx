import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { CharacterCard } from "@/components/game/CharacterCard";
import InventoryItem from "@/components/game/InventoryItem";
import { MedievalButton } from "@/components/rpg/MedievalButton";
import { Link, useNavigate } from "react-router-dom";
import DiceRoller from "@/components/dice/DiceRoller";
import { 
  User2, 
  Sword, 
  MapPin, 
  BookOpen, 
  Skull, 
  Table as TableIcon, 
  CheckCircle, 
  Eye, 
  Shield, 
  Coffee, 
  Dices,
  Search,
  PlusCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Categorias do inventário
const inventoryCategories = [
  {
    title: "Personagens",
    icon: User2,
    description: "Heróis, vilões e todos os personagens que você criou",
    count: 4,
    action: "Ver Personagens",
    path: "/character"
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
    icon: TableIcon,
    description: "Mesas de jogo que você criou ou participa",
    count: 2,
    action: "Ver Mesas",
    path: "/inventory/tables"
  }
];

// Dados dos personagens para exibição rápida
const quickCharacters = [
  {
    id: '1',
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
    id: '2',
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
    rarity: "rare" as const,
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
  const [activeTab, setActiveTab] = useState('categories');
  const [characterTab, setCharacterTab] = useState('attributes');
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  
  return (
    <MainLayout>
      <div className="container mx-auto pb-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-medievalsharp text-white mb-1">Seu Inventário</h1>
            <p className="text-fantasy-stone">Veja e gerencie todas as suas criações e itens</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fantasy-stone" size={18} />
              <input
                type="text"
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2 w-full bg-fantasy-dark/30 border border-fantasy-purple/20 rounded-lg text-white focus:outline-none focus:border-fantasy-purple/60"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

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
        
        <DiceRoller />
      </div>
    </MainLayout>
  );
};

export default Inventory;
