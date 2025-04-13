
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { User2, BookOpen, Users, MapPin, Sword, Skull } from "lucide-react";
import { motion } from "framer-motion";
import { DiceRoller } from "@/components/dice/DiceRoller";

const creationCategories = [
  {
    title: "Personagens",
    icon: User2,
    description: "Crie heróis, vilões e todos os tipos de personagens para suas aventuras",
    count: 8,
    action: "Criar Personagem",
    path: "/creations/characters"
  },
  {
    title: "Histórias",
    icon: BookOpen,
    description: "Desenvolva tramas épicas, side quests e arcos narrativos completos",
    count: 12,
    action: "Criar História",
    path: "/creations/stories"
  },
  {
    title: "NPCs",
    icon: Users,
    description: "Popule seu mundo com personagens não-jogáveis memoráveis",
    count: 24,
    action: "Criar NPC",
    path: "/creations/npcs"
  },
  {
    title: "Mapas",
    icon: MapPin,
    description: "Desenhe mapas detalhados de reinos, cidades e calabouços",
    count: 5,
    action: "Criar Mapa",
    path: "/creations/maps"
  },
  {
    title: "Itens & Armas",
    icon: Sword,
    description: "Forje armas mágicas, itens encantados e tesouros",
    count: 16,
    action: "Criar Item",
    path: "/creations/items"
  },
  {
    title: "Monstros",
    icon: Skull,
    description: "Dê vida a criaturas terríveis para desafiar seus jogadores",
    count: 7,
    action: "Criar Monstro",
    path: "/creations/monsters"
  }
];

const Creations = () => {
  const navigate = useNavigate();
  
  return (
    <MainLayout>
      <div className="container mx-auto pb-16">
        <h1 className="text-3xl font-medievalsharp text-white mb-4 text-center">Suas Criações</h1>
        <p className="text-fantasy-stone text-center mb-8">
          Escolha uma categoria para criar ou gerenciar suas criações
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {creationCategories.map((category, index) => (
            <div key={index} className="fantasy-card p-6 flex flex-col items-center">
              <category.icon className="text-fantasy-purple w-12 h-12 mb-4" />
              <h2 className="text-2xl font-medievalsharp text-fantasy-purple mb-2">{category.title}</h2>
              <p className="text-center text-fantasy-stone mb-4">{category.description}</p>
              
              <div className="mt-auto w-full">
                <div className="bg-fantasy-dark/40 rounded-full py-2 px-4 text-center mb-4">
                  <span className="font-medievalsharp text-fantasy-gold">{category.count} criados</span>
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
        
        {/* Componente de rolagem de dados */}
        <DiceRoller />
      </div>
    </MainLayout>
  );
};

export default Creations;
