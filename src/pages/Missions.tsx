
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scroll, Sword, Shield, Star, User, Map, Package, Skull, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Mission {
  id: string;
  title: string;
  description: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  category: 'personagem' | 'mapa' | 'item' | 'monstro' | 'npc';
  progress: number;
  total: number;
  reward: string;
  icon: React.ReactNode;
}

const missions: Mission[] = [
  {
    id: '1',
    title: 'Iniciante em Criação',
    description: 'Crie seu primeiro personagem para começar sua jornada.',
    difficulty: 'Fácil',
    category: 'personagem',
    progress: 0,
    total: 1,
    reward: '100 moedas de ouro',
    icon: <User className="w-6 h-6 text-fantasy-gold" />
  },
  {
    id: '2',
    title: 'Mestre das Histórias',
    description: 'Crie uma coleção de 5 personagens diferentes.',
    difficulty: 'Médio',
    category: 'personagem',
    progress: 2,
    total: 5,
    reward: '500 moedas de ouro + Item raro',
    icon: <Star className="w-6 h-6 text-fantasy-gold" />
  },
  {
    id: '3',
    title: 'Cartógrafo Iniciante',
    description: 'Crie seu primeiro mapa de dungeon.',
    difficulty: 'Fácil',
    category: 'mapa',
    progress: 0,
    total: 1,
    reward: '150 moedas de ouro',
    icon: <Map className="w-6 h-6 text-fantasy-gold" />
  },
  {
    id: '4',
    title: 'Criador de Artefatos',
    description: 'Crie 3 itens mágicos para suas aventuras.',
    difficulty: 'Médio',
    category: 'item',
    progress: 1,
    total: 3,
    reward: '300 moedas de ouro',
    icon: <Package className="w-6 h-6 text-fantasy-gold" />
  }
];

const Missions = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-medievalsharp text-fantasy-gold mb-6 flex items-center gap-2">
          <Star className="w-8 h-8" />
          Missões Disponíveis
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((mission) => (
            <Card key={mission.id} className="bg-fantasy-dark border border-fantasy-purple/20 p-6 hover:border-fantasy-purple/50 transition-colors">
              <div className="mb-4">{mission.icon}</div>
              <h2 className="text-xl font-medievalsharp text-fantasy-gold mb-2">{mission.title}</h2>
              <p className="text-fantasy-stone mb-4">{mission.description}</p>
              
              {/* Barra de Progresso */}
              <div className="mb-4">
                <div className="w-full bg-fantasy-purple/10 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-fantasy-gold h-full transition-all duration-300"
                    style={{ width: `${(mission.progress / mission.total) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-fantasy-stone mt-1 text-center">
                  {mission.progress}/{mission.total} completados
                </p>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-fantasy-stone">Dificuldade: {mission.difficulty}</span>
                <span className="text-sm text-fantasy-gold">{mission.reward}</span>
              </div>
              
              <Link to="/creations">
                <Button variant="default" className="w-full">
                  Iniciar Missão
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Missions;
