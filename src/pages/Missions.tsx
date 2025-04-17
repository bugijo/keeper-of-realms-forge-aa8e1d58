
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scroll, Sword, Shield, Star } from 'lucide-react';

interface Mission {
  id: string;
  title: string;
  description: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  reward: string;
  icon: React.ReactNode;
}

const missions: Mission[] = [
  {
    id: '1',
    title: 'A Caverna dos Sussurros',
    description: 'Explore uma caverna misteriosa e descubra seus segredos ancestrais.',
    difficulty: 'Fácil',
    reward: '100 moedas de ouro',
    icon: <Scroll className="w-6 h-6 text-fantasy-gold" />
  },
  {
    id: '2',
    title: 'O Dragão Adormecido',
    description: 'Enfrente um dragão ancestral que ameaça a vila próxima.',
    difficulty: 'Difícil',
    reward: '500 moedas de ouro + Item raro',
    icon: <Sword className="w-6 h-6 text-fantasy-gold" />
  },
  {
    id: '3',
    title: 'Proteção da Caravana',
    description: 'Escolte uma caravana de mercadores através de terras perigosas.',
    difficulty: 'Médio',
    reward: '250 moedas de ouro',
    icon: <Shield className="w-6 h-6 text-fantasy-gold" />
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
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-fantasy-stone">Dificuldade: {mission.difficulty}</span>
                <span className="text-sm text-fantasy-gold">{mission.reward}</span>
              </div>
              <Button variant="default" className="w-full">
                Aceitar Missão
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Missions;
