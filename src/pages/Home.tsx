
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';

const Home = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-medievalsharp text-white mb-6">Bem-vindo ao Reino das Aventuras</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/tables" className="fantasy-card p-6 hover:bg-fantasy-purple/10 transition-colors">
            <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-2">Mesas</h2>
            <p className="text-fantasy-stone">Gerencie e participe de mesas de RPG</p>
          </Link>
          
          <Link to="/character" className="fantasy-card p-6 hover:bg-fantasy-purple/10 transition-colors">
            <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-2">Personagens</h2>
            <p className="text-fantasy-stone">Crie e gerencie seus personagens</p>
          </Link>
          
          <Link to="/items" className="fantasy-card p-6 hover:bg-fantasy-purple/10 transition-colors">
            <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-2">Itens</h2>
            <p className="text-fantasy-stone">Explore e crie itens e equipamentos</p>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
