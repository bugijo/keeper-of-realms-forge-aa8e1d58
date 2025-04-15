
import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from "@/components/layout/MainLayout";
import { Dices } from "lucide-react";

const GameMasterView = () => {
  const { id } = useParams();
  
  return (
    <MainLayout>
      <div className="container mx-auto">
        <h1 className="text-3xl font-medievalsharp text-white mb-6">Mesa #{id} (Mestre)</h1>
        
        <div className="fantasy-card p-6 mb-6">
          <h2 className="text-xl font-medievalsharp text-white mb-4">Controles do Mestre</h2>
          <div className="flex gap-4">
            <button className="bg-fantasy-purple text-white px-4 py-2 rounded-lg font-medievalsharp flex items-center gap-2">
              <Dices size={16} />
              Rolar Dados
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default GameMasterView;
