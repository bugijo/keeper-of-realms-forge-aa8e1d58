
import React, { useState } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import { Search, Filter, BookOpen, ArrowBigRight, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';

// Mock data for stories
const mockStories = [
  {
    id: '1',
    title: 'A Queda do Reino',
    type: 'campaign',
    description: 'Uma campanha épica onde os jogadores precisam impedir a queda de um reino antigo às mãos de um usurpador.',
    createdAt: '2025-03-15',
    tags: ['Fantasia Medieval', 'Política', 'Guerra']
  },
  {
    id: '2',
    title: 'O Tesouro do Calabouço Perdido',
    type: 'oneshot',
    description: 'Uma aventura curta onde os jogadores exploram um calabouço esquecido em busca de um tesouro lendário.',
    createdAt: '2025-04-01',
    tags: ['Dungeons', 'Tesouro', 'Exploração']
  },
  {
    id: '3',
    title: 'O Misterioso Assassinato em Neverwinter',
    type: 'sidequest',
    description: 'Uma missão secundária de mistério onde os jogadores precisam investigar um assassinato na cidade de Neverwinter.',
    createdAt: '2025-04-08',
    tags: ['Mistério', 'Cidade', 'Investigação']
  },
  {
    id: '4',
    title: 'A Torre do Mago Louco',
    type: 'oneshot',
    description: 'Os jogadores devem enfrentar os perigos da torre de um mago que perdeu a sanidade após experimentos com magia proibida.',
    createdAt: '2025-03-25',
    tags: ['Magia', 'Torre', 'Combate']
  }
];

const StoriesView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  
  // Filter stories based on search and filter settings
  const filteredStories = mockStories.filter(story => {
    // Text search filter
    if (searchTerm && !story.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !story.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Type filter
    if (filter !== "all" && story.type !== filter) {
      return false;
    }
    
    return true;
  });
  
  return (
    <MainLayout>
      <div className="container mx-auto pb-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medievalsharp text-white">Suas Histórias</h1>
          
          <Link to="/creations/stories">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="fantasy-button primary flex items-center gap-2"
            >
              <Plus size={18} />
              Criar Nova História
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
              placeholder="Buscar histórias..."
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
                <option value="campaign">Campanhas</option>
                <option value="oneshot">One-Shots</option>
                <option value="sidequest">Missões Secundárias</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.length > 0 ? (
            filteredStories.map((story) => (
              <Link to={`/stories/${story.id}`} key={story.id}>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="fantasy-card p-0 overflow-hidden"
                >
                  {/* Story Details */}
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medievalsharp text-white">{story.title}</h3>
                      <div className="p-1 rounded-full bg-fantasy-purple/20">
                        <BookOpen size={16} className="text-fantasy-gold" />
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs text-fantasy-stone">
                      {new Date(story.createdAt).toLocaleDateString('pt-BR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    
                    <p className="text-fantasy-stone text-sm mt-2 line-clamp-3">{story.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {story.tags.map((tag, idx) => (
                        <span key={idx} className="text-xs bg-fantasy-dark px-2 py-0.5 rounded text-fantasy-stone">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
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
              <BookOpen className="mx-auto text-fantasy-purple/40 mb-4" size={48} />
              <h3 className="text-xl font-medievalsharp text-fantasy-purple mb-2">Nenhuma história encontrada</h3>
              <p className="text-fantasy-stone mb-4">
                Não encontramos histórias com os filtros atuais. Tente mudar os critérios de busca ou crie uma nova história.
              </p>
              <Link to="/creations/stories">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="fantasy-button primary mx-auto"
                >
                  Criar Nova História
                </motion.button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default StoriesView;
