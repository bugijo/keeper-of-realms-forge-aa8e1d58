
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { MedievalButton } from "@/components/rpg/MedievalButton";
import { Link, useNavigate } from "react-router-dom";
import { 
  User2, 
  Sword, 
  MapPin, 
  BookOpen, 
  Skull, 
  Table as TableIcon,
  Search
} from "lucide-react";

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
    path: "/items"
  },
  {
    title: "Mapas",
    icon: MapPin,
    description: "Mapas de reinos, cidades e calabouços que você criou",
    count: 3,
    action: "Ver Mapas",
    path: "/maps"
  },
  {
    title: "Histórias",
    icon: BookOpen,
    description: "Aventuras, missões e histórias que você elaborou",
    count: 5,
    action: "Ver Histórias",
    path: "/stories"
  },
  {
    title: "Monstros",
    icon: Skull,
    description: "Criaturas e monstros para desafiar seus jogadores",
    count: 4,
    action: "Ver Monstros",
    path: "/monsters"
  },
  {
    title: "NPCs",
    icon: TableIcon,
    description: "NPCs e personagens não jogáveis",
    count: 2,
    action: "Ver NPCs",
    path: "/npcs"
  }
];

const Inventory = () => {
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
      </div>
    </MainLayout>
  );
};

export default Inventory;
