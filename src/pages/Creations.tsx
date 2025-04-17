
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";
import { 
  User, 
  Book, 
  Map, 
  Package, 
  Scroll, 
  Skull, 
  Users,
  Sword,
  Shield,
  Bookmark
} from "lucide-react";

const creationOptions = [
  {
    title: "Criar Personagem",
    description: "Crie um novo personagem para suas aventuras",
    icon: User,
    path: "/creations/characters"
  },
  {
    title: "Criar Mapa",
    description: "Desenhe e crie mapas para suas campanhas",
    icon: Map,
    path: "/creations/maps"
  },
  {
    title: "Criar Item",
    description: "Crie itens mágicos e equipamentos",
    icon: Sword,
    path: "/creations/items"
  },
  {
    title: "Criar Monstro",
    description: "Adicione novos monstros ao seu bestiário",
    icon: Skull,
    path: "/creations/monsters"
  },
  {
    title: "Criar NPC",
    description: "Crie personagens não jogáveis para sua campanha",
    icon: Users,
    path: "/creations/npcs"
  },
  {
    title: "Criar História",
    description: "Escreva histórias e eventos para sua campanha",
    icon: Book,
    path: "/creations/stories"
  },
  {
    title: "Criar Equipamento",
    description: "Crie armaduras, escudos e outros equipamentos",
    icon: Shield,
    path: "/creations/equipment"
  },
  {
    title: "Criar Missão",
    description: "Crie missões e aventuras para seus jogadores",
    icon: Bookmark,
    path: "/creations/quests"
  },
  {
    title: "Criar Pergaminho",
    description: "Crie pergaminhos mágicos e documentos importantes",
    icon: Scroll,
    path: "/creations/scrolls"
  }
];

const Creations = () => {
  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-medievalsharp text-white mb-6">Criações</h1>
        
        <div className="fantasy-card p-6 mb-6">
          <h2 className="text-xl font-medievalsharp text-fantasy-gold mb-4">Ferramentas de Criação</h2>
          <p className="text-fantasy-stone mb-4">
            Use estas ferramentas para criar novos elementos para sua campanha de RPG baseada em D&D 5e.
            Você pode criar personagens, mapas, itens, monstros e muito mais.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {creationOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Link key={option.title} to={option.path} className="block transform hover:scale-105 transition-transform duration-200">
                <div className="fantasy-card border border-fantasy-purple/30 hover:border-fantasy-purple/60 bg-gradient-to-br from-[#1a123a] to-[#13102b] p-5 h-full">
                  <div className="flex items-center mb-3">
                    <div className="bg-fantasy-dark/40 p-3 rounded-lg mr-3">
                      <Icon size={28} className="text-fantasy-gold" />
                    </div>
                    <h3 className="text-xl font-medievalsharp text-white">{option.title}</h3>
                  </div>
                  <p className="text-fantasy-stone">{option.description}</p>
                  <div className="mt-4 bg-fantasy-purple/10 py-2 px-3 rounded text-center text-sm text-fantasy-gold font-medievalsharp hover:bg-fantasy-purple/20 transition-colors">
                    Começar a criar
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="fantasy-card p-6 mt-8">
          <h2 className="text-xl font-medievalsharp text-fantasy-gold mb-4">Minhas Criações Recentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-fantasy-purple/20 rounded-lg p-4 bg-fantasy-dark/30">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medievalsharp text-white">Caverna do Dragão</h3>
                <span className="text-xs text-fantasy-stone">Mapa</span>
              </div>
              <p className="text-fantasy-stone text-sm">Última edição: 2 dias atrás</p>
            </div>
            <div className="border border-fantasy-purple/20 rounded-lg p-4 bg-fantasy-dark/30">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medievalsharp text-white">Eldrin o Sábio</h3>
                <span className="text-xs text-fantasy-stone">NPC</span>
              </div>
              <p className="text-fantasy-stone text-sm">Última edição: 4 dias atrás</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/collections" className="text-fantasy-gold hover:underline text-sm flex items-center justify-center">
              Ver todas as minhas criações
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Creations;
