
import MainLayout from "@/components/layout/MainLayout";
import { Scroll, User2, BookOpen, Users, MapPin, Sword, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
