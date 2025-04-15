import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { MedievalButton } from "@/components/rpg/MedievalButton";
import { Link } from "react-router-dom";
import { Plus, Sword, Book, Map, User, Wand2, Scroll } from "lucide-react";
import DiceRoller from "@/components/dice/DiceRoller";

const Creations = () => {
  return (
    <MainLayout>
      <div className="container mx-auto">
        <h1 className="text-3xl font-medievalsharp text-white mb-6">Criações</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/creations/characters">
            <div className="fantasy-card p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow duration-200">
              <User size={64} className="text-fantasy-gold mb-4" />
              <h2 className="text-xl font-medievalsharp text-white mb-2">Criar Personagem</h2>
              <p className="text-fantasy-stone text-center">Crie um novo personagem para suas aventuras.</p>
            </div>
          </Link>
          
          <Link to="/creations/stories">
            <div className="fantasy-card p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow duration-200">
              <Book size={64} className="text-fantasy-gold mb-4" />
              <h2 className="text-xl font-medievalsharp text-white mb-2">Criar História</h2>
              <p className="text-fantasy-stone text-center">Escreva uma nova história para compartilhar com seus amigos.</p>
            </div>
          </Link>
          
          <Link to="/creations/npcs">
            <div className="fantasy-card p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow duration-200">
              <Wand2 size={64} className="text-fantasy-gold mb-4" />
              <h2 className="text-xl font-medievalsharp text-white mb-2">Criar NPC</h2>
              <p className="text-fantasy-stone text-center">Crie um personagem não jogável para interagir com os jogadores.</p>
            </div>
          </Link>
          
          <Link to="/creations/maps">
            <div className="fantasy-card p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow duration-200">
              <Map size={64} className="text-fantasy-gold mb-4" />
              <h2 className="text-xl font-medievalsharp text-white mb-2">Criar Mapa</h2>
              <p className="text-fantasy-stone text-center">Crie um novo mapa para suas aventuras.</p>
            </div>
          </Link>
          
          <Link to="/creations/items">
            <div className="fantasy-card p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow duration-200">
              <Plus size={64} className="text-fantasy-gold mb-4" />
              <h2 className="text-xl font-medievalsharp text-white mb-2">Criar Item</h2>
              <p className="text-fantasy-stone text-center">Crie um novo item para seus personagens usarem.</p>
            </div>
          </Link>
          
          <Link to="/creations/monsters">
            <div className="fantasy-card p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow duration-200">
              <Sword size={64} className="text-fantasy-gold mb-4" />
              <h2 className="text-xl font-medievalsharp text-white mb-2">Criar Monstro</h2>
              <p className="text-fantasy-stone text-center">Crie um novo monstro para desafiar seus jogadores.</p>
            </div>
          </Link>
        </div>
        
        <div className="mt-8">
          <DiceRoller />
        </div>
      </div>
    </MainLayout>
  );
};

export default Creations;
