
import React, { useState } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import { Search, Filter, Sword, Shield, Wand, ArrowBigRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';

// Mock data for items
const mockItems = [
  {
    id: '1',
    name: 'Espada da Chama Eterna',
    type: 'weapon',
    rarity: 'raro',
    damage: '1d8+1d6 fogo',
    description: 'Uma lâmina forjada nas chamas do Plano Elemental do Fogo. Adiciona 1d6 de dano de fogo e pode ser ativada para criar uma esfera de luz.',
    properties: ['mágico', 'versátil (1d10)'],
    imageUrl: 'https://images.unsplash.com/photo-1589418763978-8784a7c44800'
  },
  {
    id: '2',
    name: 'Escudo do Guardião',
    type: 'shield',
    rarity: 'incomum',
    ac: '+2',
    description: 'Um escudo encantado que permite ao usuário lançar a magia Santuário uma vez por dia.',
    properties: ['mágico', 'requer sintonia'],
    imageUrl: 'https://images.unsplash.com/photo-1529259539020-241acb189282'
  },
  {
    id: '3',
    name: 'Varinha de Mísseis Mágicos',
    type: 'wand',
    rarity: 'incomum',
    description: 'Uma varinha de madeira polida com 7 cargas. Gasta uma carga para lançar Mísseis Mágicos como uma magia de 1º nível.',
    properties: ['mágico', '7 cargas', 'recupera 1d6+1 cargas no amanhecer'],
    imageUrl: 'https://images.unsplash.com/photo-1513708929605-6dd0e1b081bd'
  },
  {
    id: '4',
    name: 'Poção de Cura',
    type: 'potion',
    rarity: 'comum',
    description: 'Um frasco de líquido vermelho brilhante que cura 2d4+2 pontos de vida quando consumido.',
    properties: ['consumível'],
    imageUrl: 'https://images.unsplash.com/photo-1542935723-1385e5ab3967'
  }
];

const ItemsView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  
  // Filter items based on search and filter settings
  const filteredItems = mockItems.filter(item => {
    // Text search filter
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !item.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Type filter
    if (filter !== "all" && item.type !== filter) {
      return false;
    }
    
    return true;
  });
  
  return (
    <MainLayout>
      <div className="container mx-auto pb-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medievalsharp text-white">Seus Itens & Armas</h1>
          
          <Link to="/creations/items">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="fantasy-button primary flex items-center gap-2"
            >
              Criar Novo Item
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
              placeholder="Buscar itens..."
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
                <option value="weapon">Armas</option>
                <option value="shield">Escudos</option>
                <option value="wand">Varinhas</option>
                <option value="potion">Poções</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <Link to={`/items/${item.id}`} key={item.id}>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="fantasy-card p-0 overflow-hidden"
                >
                  {/* Item Image */}
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-fantasy-dark to-transparent opacity-80"></div>
                    <div className="absolute bottom-2 left-3 right-3">
                      <div className="text-sm inline-block px-2 py-0.5 rounded bg-fantasy-dark/70 text-fantasy-gold capitalize">
                        {item.rarity}
                      </div>
                    </div>
                  </div>
                  
                  {/* Item Details */}
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medievalsharp text-white">{item.name}</h3>
                      <div className="p-1 rounded-full bg-fantasy-purple/20">
                        {item.type === 'weapon' && <Sword size={16} className="text-fantasy-gold" />}
                        {item.type === 'shield' && <Shield size={16} className="text-fantasy-gold" />}
                        {item.type === 'wand' && <Wand size={16} className="text-fantasy-gold" />}
                        {item.type !== 'weapon' && item.type !== 'shield' && item.type !== 'wand' && 
                          <div className="w-4 h-4 rounded-full bg-fantasy-gold"></div>
                        }
                      </div>
                    </div>
                    
                    <p className="text-fantasy-stone text-sm mt-2 line-clamp-2">{item.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {item.properties.map((prop, idx) => (
                        <span key={idx} className="text-xs bg-fantasy-dark px-2 py-0.5 rounded text-fantasy-stone">
                          {prop}
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
              <Sword className="mx-auto text-fantasy-purple/40 mb-4" size={48} />
              <h3 className="text-xl font-medievalsharp text-fantasy-purple mb-2">Nenhum item encontrado</h3>
              <p className="text-fantasy-stone mb-4">
                Não encontramos itens com os filtros atuais. Tente mudar os critérios de busca ou crie um novo item.
              </p>
              <Link to="/creations/items">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="fantasy-button primary mx-auto"
                >
                  Criar Novo Item
                </motion.button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ItemsView;
