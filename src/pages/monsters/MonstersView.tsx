
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Search, Shield, Sword } from 'lucide-react';

const mockMonsters = [
  {
    id: '1',
    name: 'Goblin',
    type: 'Humanoide',
    challenge: 0.25,
    size: 'Pequeno',
    alignment: 'Neutro e Mau',
    hp: 7,
    ac: 15,
    stats: { str: 8, dex: 14, con: 10, int: 10, wis: 8, cha: 8 }
  },
  {
    id: '2',
    name: 'Orc',
    type: 'Humanoide',
    challenge: 0.5,
    size: 'Médio',
    alignment: 'Caótico e Mau',
    hp: 15,
    ac: 13,
    stats: { str: 16, dex: 12, con: 16, int: 7, wis: 11, cha: 10 }
  },
  {
    id: '3',
    name: 'Troll',
    type: 'Gigante',
    challenge: 5,
    size: 'Grande',
    alignment: 'Caótico e Mau',
    hp: 84,
    ac: 15,
    stats: { str: 18, dex: 13, con: 20, int: 7, wis: 9, cha: 7 }
  }
];

const MonstersView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  
  const filteredMonsters = mockMonsters.filter(monster => {
    return (
      monster.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
      (filterType === '' || monster.type === filterType)
    );
  });
  
  const monsterTypes = Array.from(new Set(mockMonsters.map(monster => monster.type)));
  
  return (
    <MainLayout>
      <div className="container mx-auto pb-16">
        <h1 className="text-3xl font-medievalsharp text-white mb-6">Monstros</h1>
        
        <div className="fantasy-card p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fantasy-stone" size={18} />
              <input
                type="text"
                placeholder="Buscar monstros..."
                className="w-full pl-10 pr-4 py-2 bg-fantasy-dark/30 border border-fantasy-purple/20 rounded-lg text-white focus:outline-none focus:border-fantasy-purple/60"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="w-full md:w-auto">
              <select
                className="w-full md:w-auto px-4 py-2 bg-fantasy-dark/30 border border-fantasy-purple/20 rounded-lg text-white focus:outline-none focus:border-fantasy-purple/60"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">Todos os tipos</option>
                {monsterTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMonsters.map(monster => (
            <div key={monster.id} className="fantasy-card p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medievalsharp text-white">{monster.name}</h3>
                <span className="text-xs px-2 py-1 rounded bg-fantasy-purple/30 text-fantasy-purple">
                  ND {monster.challenge}
                </span>
              </div>
              
              <div className="text-sm text-fantasy-stone mb-3">
                {monster.size} {monster.type}, {monster.alignment}
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="flex items-center gap-2 bg-fantasy-dark/30 p-2 rounded-lg">
                  <Shield size={16} className="text-fantasy-stone" />
                  <div>
                    <div className="text-xs text-fantasy-stone">Classe de Armadura</div>
                    <div className="text-white">{monster.ac}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 bg-fantasy-dark/30 p-2 rounded-lg">
                  <Sword size={16} className="text-fantasy-stone" />
                  <div>
                    <div className="text-xs text-fantasy-stone">Pontos de Vida</div>
                    <div className="text-white">{monster.hp}</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-6 gap-1 text-center">
                {Object.entries(monster.stats).map(([stat, value]) => (
                  <div key={stat} className="bg-fantasy-dark/20 p-1 rounded">
                    <div className="text-xs text-fantasy-stone uppercase">{stat}</div>
                    <div className="text-sm text-white">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default MonstersView;
