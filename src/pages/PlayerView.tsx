
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from "@/components/layout/MainLayout";
import { ArrowLeft } from "lucide-react";

const PlayerView = () => {
  const { id } = useParams();
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Link to="/tables" className="mr-4">
            <ArrowLeft className="text-fantasy-stone hover:text-white transition-colors" />
          </Link>
          <h1 className="text-3xl font-medievalsharp text-white">Visão do Jogador</h1>
        </div>
        
        <div className="fantasy-card p-6">
          <p className="text-fantasy-stone">Visualizando mesa com ID: {id} como Jogador</p>
          
          {/* Player view content would go here */}
          <div className="mt-4 text-white">
            <p>Carregando interface do Jogador...</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PlayerView;
