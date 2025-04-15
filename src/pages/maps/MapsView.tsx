
import React, { useState } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import { Search, Filter, Map, ArrowBigRight, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';

// Mock data for maps
const mockMaps = [
  {
    id: '1',
    name: 'Cidade de Aetheria',
    type: 'city',
    description: 'A capital do reino, uma metrópole vibrante com comércio próspero e intrigas políticas.',
    imageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b'
  },
  {
    id: '2',
    name: 'Cavernas do Dragão Negro',
    type: 'dungeon',
    description: 'Um complexo de cavernas onde um antigo dragão negro guarda seu tesouro.',
    imageUrl: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25'
  },
  {
    id: '3',
    name: 'Floresta Élfica de Silverleaf',
    type: 'wilderness',
    description: 'Uma floresta ancestral habitada por elfos e criaturas mágicas.',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b'
  },
  {
    id: '4',
    name: 'Reinos do Norte',
    type: 'world',
    description: 'Um mapa completo dos reinos do norte, incluindo montanhas, florestas e assentamentos.',
    imageUrl: 'https://images.unsplash.com/photo-1566041510639-8d95a2490bfb'
  }
];

const MapsView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  
  // Filter maps based on search and filter settings
  const filteredMaps = mockMaps.filter(map => {
    // Text search filter
    if (searchTerm && !map.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !map.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Type filter
    if (filter !== "all" && map.type !== filter) {
      return false;
    }
    
    return true;
  });
  
  return (
    <MainLayout>
      <div className="container mx-auto pb-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medievalsharp text-white">Seus Mapas</h1>
          
          <Link to="/creations/maps">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="fantasy-button primary flex items-center gap-2"
            >
              <Plus size={18} />
              Criar Novo Mapa
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
              placeholder="Buscar mapas..."
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
                <option value="city">Cidades</option>
                <option value="dungeon">Masmorras</option>
                <option value="wilderness">Regiões Selvagens</option>
                <option value="world">Mapas de Mundo</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Maps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaps.length > 0 ? (
            filteredMaps.map((map) => (
              <Link to={`/maps/${map.id}`} key={map.id}>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="fantasy-card p-0 overflow-hidden"
                >
                  {/* Map Image */}
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={map.imageUrl} 
                      alt={map.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-fantasy-dark to-transparent opacity-80"></div>
                    <div className="absolute bottom-2 left-3 right-3">
                      <div className="text-sm inline-block px-2 py-0.5 rounded bg-fantasy-dark/70 text-fantasy-gold capitalize">
                        {map.type === 'city' ? 'Cidade' : 
                         map.type === 'dungeon' ? 'Masmorra' : 
                         map.type === 'wilderness' ? 'Região Selvagem' : 'Mapa de Mundo'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Map Details */}
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medievalsharp text-white">{map.name}</h3>
                      <div className="p-1 rounded-full bg-fantasy-purple/20">
                        <Map size={16} className="text-fantasy-gold" />
                      </div>
                    </div>
                    
                    <p className="text-fantasy-stone text-sm mt-2 line-clamp-2">{map.description}</p>
                    
                    <div className="mt-4 flex justify-end">
                      <span className="text-fantasy-purple flex items-center text-sm">
                        Ver detalhes <ArrowBigRight size={16} className="ml-1" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))
          ) : (
            <div className="col-span-full fantasy-card p-8 text-center">
              <Map className="mx-auto text-fantasy-purple/40 mb-4" size={48} />
              <h3 className="text-xl font-medievalsharp text-fantasy-purple mb-2">Nenhum mapa encontrado</h3>
              <p className="text-fantasy-stone mb-4">
                Não encontramos mapas com os filtros atuais. Tente mudar os critérios de busca ou crie um novo mapa.
              </p>
              <Link to="/creations/maps">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="fantasy-button primary mx-auto"
                >
                  Criar Novo Mapa
                </motion.button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default MapsView;
