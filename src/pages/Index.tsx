
import MainLayout from "@/components/layout/MainLayout";
import { Zap, Scroll, User2, BookOpen, Users, MapPin, Sword, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const creations = [
  { name: "Personagens", icon: User2, count: 8, color: "bg-indigo-600", path: "/creations/characters" },
  { name: "Histórias", icon: BookOpen, count: 12, color: "bg-purple-600", path: "/creations/stories" },
  { name: "NPCs", icon: Users, count: 24, color: "bg-blue-500", path: "/creations/npcs" },
  { name: "Mapas", icon: MapPin, count: 5, color: "bg-green-600", path: "/creations/maps" },
  { name: "Itens & Armas", icon: Sword, count: 16, color: "bg-amber-600", path: "/creations/items" },
  { name: "Monstros", icon: ShoppingCart, count: 7, color: "bg-red-600", path: "/creations/monsters" },
];

const quests = [
  {
    title: "Participar de 1 Mesa",
    progress: 0,
    max: 1,
    rewards: { xp: 200, gems: 50 },
    type: "Iniciante"
  },
  {
    title: "Participar de 10 Mesas",
    progress: 3,
    max: 10,
    rewards: { xp: 500, gems: 100 },
    type: "Explorador"
  },
  {
    title: "Participar de 50 Mesas",
    progress: 5,
    max: 50,
    rewards: { xp: 1000, gems: 300 },
    type: "Veterano"
  },
  {
    title: "Criar um Personagem",
    progress: 1,
    max: 1,
    rewards: { xp: 100, gems: 20 },
    type: "Criativo"
  }
];

const Index = () => {
  return (
    <MainLayout>
      <div className="container mx-auto pb-16">
        {/* Header section with crystals */}
        <div className="py-2 px-4 bg-fantasy-dark/70 border-b border-fantasy-purple/20 mb-6 flex items-center justify-between">
          <h2 className="text-sm font-medievalsharp text-white">Seu saldo:</h2>
          <div className="flex items-center">
            <span className="text-white font-bold">350</span>
            <span className="text-fantasy-gold ml-2">💎</span>
            <span className="text-fantasy-gold ml-1">Cristais</span>
          </div>
        </div>

        {/* Progress section */}
        <div className="fantasy-card mb-6">
          <div className="w-full bg-fantasy-dark/70 h-4 rounded-full mb-4">
            <div 
              className="bg-gradient-to-r from-fantasy-purple to-fantasy-accent h-full rounded-full"
              style={{ width: '65%' }}
            ></div>
          </div>
          
          <div className="flex justify-center">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-fantasy-purple/80 hover:bg-fantasy-purple text-white px-6 py-3 rounded-lg font-medievalsharp"
            >
              <Zap className="text-fantasy-gold" size={20} />
              Recompensa Rápida
            </motion.button>
          </div>
        </div>
        
        {/* Inventory Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-medievalsharp text-white mb-4">Seu Inventário</h2>
          <div className="grid grid-cols-1 gap-4">
            {creations.map((item, index) => (
              <Link to={item.path} key={index}>
                <div className="bg-fantasy-purple/80 rounded-lg p-4 flex items-center justify-between hover:bg-fantasy-purple/90 transition-colors">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full ${item.color} mr-3 flex items-center justify-center`}>
                      <item.icon className="text-white" size={24} />
                    </div>
                    <span className="text-lg font-medievalsharp text-white">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-medievalsharp text-fantasy-gold">{item.count}</span>
                    <button className="bg-fantasy-gold/20 hover:bg-fantasy-gold/30 text-fantasy-gold px-4 py-2 rounded-lg font-medievalsharp text-sm">
                      Ver Todos
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Quests Section */}
        <div>
          <h2 className="text-2xl font-medievalsharp text-white mb-4">Missões Ativas</h2>
          <div className="grid grid-cols-1 gap-4">
            {quests.map((quest, index) => (
              <div key={index} className="fantasy-card p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medievalsharp text-white">{quest.title}</h3>
                  <span className="bg-fantasy-purple text-white text-xs px-3 py-1 rounded-full font-medievalsharp">
                    {quest.type}
                  </span>
                </div>
                
                <div className="mb-2">
                  <div className="w-full bg-fantasy-dark/70 h-3 rounded-full">
                    <div 
                      className="bg-gradient-to-r from-fantasy-purple to-fantasy-accent h-full rounded-full"
                      style={{ width: `${(quest.progress / quest.max) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-center text-fantasy-gold/80 mt-1 text-sm">
                    {quest.progress}/{quest.max}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <div className="text-green-400 font-medievalsharp">+{quest.rewards.xp} XP</div>
                  <div className="text-fantasy-gold font-medievalsharp">+{quest.rewards.gems} 💎</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
