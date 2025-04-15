
import React, { useState } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import { Search, Filter, Users, ArrowBigRight, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';

// Mock data for NPCs
const mockNpcs = [
  {
    id: '1',
    name: 'Elric o Ferreiro',
    race: 'Humano',
    occupation: 'Ferreiro',
    location: 'Cidade da Coroa',
    alignment: 'Neutro e Bom',
    description: 'Um ferreiro habilidoso que forja as melhores armas da região. Tem um temperamento forte, mas é justo nos negócios.',
    traits: ['Justo', 'Orgulhoso', 'Trabalhador']
  },
  {
    id: '2',
    name: 'Lyra Silversong',
    race: 'Elfo',
    occupation: 'Barda',
    location: 'Floresta de Silverleaf',
    alignment: 'Caótico e Bom',
    description: 'Uma barda élfica que conhece histórias e canções antigas. Está sempre em busca de novas histórias para compor.',
    traits: ['Curiosa', 'Carismática', 'Aventureira']
  },
  {
    id: '3',
    name: 'Grommash Punho de Ferro',
    race: 'Anão',
    occupation: 'Taberneiro',
    location: 'Cidade da Coroa',
    alignment: 'Leal e Neutro',
    description: 'Dono da taverna "O Machado Embriagado". Conhece todos os rumores da cidade e é respeitado pelos frequentadores.',
    traits: ['Leal', 'Observador', 'Hospitaleiro']
  },
  {
    id: '4',
    name: 'Senhora Vex',
    race: 'Tiefling',
    occupation: 'Mercadora',
    location: 'Mercado da Cidade',
    alignment: 'Neutro',
    description: 'Uma comerciante astuta que vende itens raros e exóticos. Tem contatos em todas as partes do continente.',
    traits: ['Negociadora', 'Esperta', 'Misteriosa']
  }
];

const NpcsView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  
  // Filter NPCs based on search and filter settings
  const filteredNpcs = mockNpcs.filter(npc => {
    // Text search filter
    if (searchTerm && !npc.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !npc.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Location filter (simplified for demo)
    if (filter !== "all" && !npc.location.toLowerCase().includes(filter.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  return (
    <MainLayout>
      <div className="container mx-auto pb-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medievalsharp text-white">Seus NPCs</h1>
          
          <Link to="/creations/npcs">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="fantasy-button primary flex items-center gap-2"
            >
              <Plus size={18} />
              Criar Novo NPC
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
              placeholder="Buscar NPCs..."
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
                <option value="all">Todas as localizações</option>
                <option value="cidade">Cidade da Coroa</option>
                <option value="floresta">Floresta de Silverleaf</option>
                <option value="mercado">Mercado da Cidade</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* NPCs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNpcs.length > 0 ? (
            filteredNpcs.map((npc) => (
              <Link to={`/npcs/${npc.id}`} key={npc.id}>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="fantasy-card p-4 overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-medievalsharp text-white">{npc.name}</h3>
                    <div className="p-1 rounded-full bg-fantasy-purple/20">
                      <Users size={16} className="text-fantasy-gold" />
                    </div>
                  </div>
                  
                  <div className="text-sm text-fantasy-stone mb-2">
                    <span className="font-medium">{npc.race} • {npc.occupation}</span>
                  </div>
                  
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-fantasy-stone">Localização:</span>
                      <span className="text-white">{npc.location}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-fantasy-stone">Alinhamento:</span>
                      <span className="text-white">{npc.alignment}</span>
                    </div>
                  </div>
                  
                  <p className="text-fantasy-stone text-sm line-clamp-2 mb-3">{npc.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {npc.traits.map((trait, idx) => (
                      <span key={idx} className="text-xs bg-fantasy-dark px-2 py-0.5 rounded text-fantasy-stone">
                        {trait}
                      </span>
                    ))}
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
              <Users className="mx-auto text-fantasy-purple/40 mb-4" size={48} />
              <h3 className="text-xl font-medievalsharp text-fantasy-purple mb-2">Nenhum NPC encontrado</h3>
              <p className="text-fantasy-stone mb-4">
                Não encontramos NPCs com os filtros atuais. Tente mudar os critérios de busca ou crie um novo NPC.
              </p>
              <Link to="/creations/npcs">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="fantasy-button primary mx-auto"
                >
                  Criar Novo NPC
                </motion.button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default NpcsView;
