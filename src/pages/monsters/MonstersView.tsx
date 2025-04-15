
import React, { useState } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import { Search, Filter, Skull, ArrowBigRight, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';

// Mock data for monsters
const mockMonsters = [
  {
    id: '1',
    name: 'Drako, o Dragão Negro',
    type: 'Dragão',
    size: 'Imenso',
    challengeRating: 15,
    hp: 256,
    ac: 19,
    description: 'Um dragão negro antigo que domina as Montanhas Sombrias. Seu bafo ácido pode dissolver armaduras em segundos.',
    abilities: ['Bafo Ácido', 'Visão no Escuro', 'Voo', 'Resistência a Magia']
  },
  {
    id: '2',
    name: 'Espectro da Floresta',
    type: 'Morto-vivo',
    size: 'Médio',
    challengeRating: 4,
    hp: 45,
    ac: 13,
    description: 'Um espírito vingativo que assombra a Floresta de Silverleaf. Ataca viajantes desavisados durante a noite.',
    abilities: ['Drenar Vida', 'Invisibilidade', 'Atravessar Objetos', 'Vulnerabilidade a Dano Radiante']
  },
  {
    id: '3',
    name: 'Golem de Pedra',
    type: 'Constructo',
    size: 'Grande',
    challengeRating: 7,
    hp: 178,
    ac: 17,
    description: 'Uma criatura animada feita de pedra maciça. Praticamente imune a armas não mágicas e implacável em combate.',
    abilities: ['Imunidade a Veneno', 'Resistência a Dano Físico', 'Absorção de Magia', 'Golpe Esmagador']
  },
  {
    id: '4',
    name: 'Rato Gigante da Peste',
    type: 'Besta',
    size: 'Pequeno',
    challengeRating: 1/4,
    hp: 7,
    ac: 12,
    description: 'Um rato mutante portador de doenças que habita esgotos e porões. Normalmente encontrado em bandos.',
    abilities: ['Mordida Infecciosa', 'Visão no Escuro', 'Olfato Aguçado']
  }
];

const MonstersView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  
  // Filter monsters based on search and filter settings
  const filteredMonsters = mockMonsters.filter(monster => {
    // Text search filter
    if (searchTerm && !monster.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !monster.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Type filter
    if (filter !== "all" && monster.type !== filter) {
      return false;
    }
    
    return true;
  });
  
  return (
    <MainLayout>
      <div className="container mx-auto pb-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medievalsharp text-white">Seus Monstros</h1>
          
          <Link to="/creations/monsters">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="fantasy-button primary flex items-center gap-2"
            >
              <Plus size={18} />
              Criar Novo Monstro
            </motion.button>
          </Link>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="text-muted-foreground" size={16} />
            </div>
            <input 
              type="text" 
              className="bg-fantasy-dark border border-fantasy-purple/30 text-white text-sm rounded-lg block w-full pl-10 p-2.5 focus:ring-fantasy-purple focus:border-fantasy-purple"
              placeholder="Buscar monstros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <div className="flex items-center gap-2 bg-fantasy-dark border border-fantasy-purple/30 rounded-lg p-2">
              <Filter className="text-muted-foreground" size={16} />
              <select 
                className="bg-transparent border-none text-sm focus:ring-0 text-white"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">Todos os tipos</option>
                <option value="Dragão">Dragões</option>
                <option value="Morto-vivo">Mortos-vivos</option>
                <option value="Constructo">Constructos</option>
                <option value="Besta">Bestas</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Monsters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMonsters.length > 0 ? (
            filteredMonsters.map((monster) => (
              <Link to={`/monsters/${monster.id}`} key={monster.id}>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="fantasy-card p-4 overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-medievalsharp text-white">{monster.name}</h3>
                    <div className="p-1 rounded-full bg-fantasy-purple/20">
                      <Skull size={16} className="text-fantasy-gold" />
                    </div>
                  </div>
                  
                  <div className="text-sm text-fantasy-stone mb-2">
                    <span className="font-medium">{monster.type} {monster.size}</span>
                    <span className="ml-2 px-2 py-0.5 bg-fantasy-dark/50 rounded-full text-xs">
                      ND {typeof monster.challengeRating === 'number' ? monster.challengeRating : monster.challengeRating.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex space-x-4 mb-3">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-fantasy-stone">HP</span>
                      <span className="text-white font-medievalsharp">{monster.hp}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-fantasy-stone">CA</span>
                      <span className="text-white font-medievalsharp">{monster.ac}</span>
                    </div>
                  </div>
                  
                  <p className="text-fantasy-stone text-sm line-clamp-2 mb-3">{monster.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {monster.abilities.slice(0, 3).map((ability, idx) => (
                      <span key={idx} className="text-xs bg-fantasy-dark px-2 py-0.5 rounded text-fantasy-stone">
                        {ability}
                      </span>
                    ))}
                    {monster.abilities.length > 3 && (
                      <span className="text-xs bg-fantasy-dark px-2 py-0.5 rounded text-fantasy-stone">
                        +{monster.abilities.length - 3} mais
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <span className="text-fantasy-purple flex items-center text-sm">
                      Ver detalhes <ArrowBigRight size={16} className="ml-1" />
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))
          ) : (
            <div className="col-span-full fantasy-card p-8 text-center">
              <Skull className="mx-auto text-fantasy-purple/40 mb-4" size={48} />
              <h3 className="text-xl font-medievalsharp text-fantasy-purple mb-2">Nenhum monstro encontrado</h3>
              <p className="text-fantasy-stone mb-4">
                Não encontramos monstros com os filtros atuais. Tente mudar os critérios de busca ou crie um novo monstro.
              </p>
              <Link to="/creations/monsters">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="fantasy-button primary mx-auto"
                >
                  Criar Novo Monstro
                </motion.button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default MonstersView;
