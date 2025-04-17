
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";
import { User, Book, Map, Package, Scroll, Skull, Users } from "lucide-react";
import { DungeonCard } from "@/components/rpg/DungeonCard";

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
    icon: Package,
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
  }
];

const Creations = () => {
  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-medievalsharp text-white mb-6">Criações</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creationOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Link key={option.title} to={option.path}>
                <DungeonCard
                  title={option.title}
                  className="h-full hover:scale-105 transition-transform duration-200"
                >
                  <div className="flex flex-col items-center gap-4">
                    <Icon size={48} className="text-fantasy-gold" />
                    <p className="text-fantasy-stone text-center">
                      {option.description}
                    </p>
                  </div>
                </DungeonCard>
              </Link>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};

export default Creations;
