
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Plus, Book, Users, Calendar, Sword, Search, Filter, Dices } from "lucide-react";
import { motion } from "framer-motion";
import DiceRoller from "@/components/dice/DiceRoller";
import { Link } from "react-router-dom";
import { toast } from "sonner";

// Dados de exemplo para as mesas
const tableMockData = [
  {
    id: 1,
    name: "A Masmorra do Dragão Vermelho",
    dm: "Mestre Gabriel",
    players: ["João", "Maria", "Pedro", "Ana"],
    nextSession: "Amanhã às 19h",
    campaign: "Águas Profundas",
    tags: ["Dungeons", "Combate", "Tesouro"],
    isMaster: true
  },
  {
    id: 2,
    name: "Caçadores de Recompensas",
    dm: "Mestre Lucas",
    players: ["Clara", "Rafael", "Mariana", "Gustavo", "Tiago"],
    nextSession: "Sábado às 14h",
    campaign: "Reinos Esquecidos",
    tags: ["Cidade", "Intriga", "Investigação"],
    isMaster: false
  },
  {
    id: 3,
    name: "A Coroa do Rei Lich",
    dm: "Mestra Júlia",
    players: ["Fernando", "Rodrigo", "Camila"],
    nextSession: "Sexta-feira às 20h",
    campaign: "Ravenloft",
    tags: ["Terror", "Mistério", "Survival"],
    isMaster: false
  }
];

const Tables = () => {
  const [showNewTableModal, setShowNewTableModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  
  // Filtrar mesas de acordo com a pesquisa e filtro
  const filteredTables = tableMockData.filter(table => {
    // Filtro de texto
    if (searchTerm && !table.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !table.dm.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !table.campaign.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filtro de categoria
    if (filter === "dm" && !table.isMaster) {
      return false;
    } else if (filter === "player" && table.isMaster) {
      return false;
    }
    
    return true;
  });
  
  return (
    <MainLayout>
      <div className="container mx-auto pb-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medievalsharp text-white">Suas Mesas</h1>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="fantasy-button primary flex items-center gap-2"
            onClick={() => setShowNewTableModal(true)}
          >
            <Plus size={18} />
            Nova Mesa
          </motion.button>
        </div>
        
        {/* Controles de busca e filtro */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="text-muted-foreground" size={16} />
            </div>
            <input 
              type="text" 
              className="bg-fantasy-dark border border-fantasy-purple/30 text-white text-sm rounded-lg block w-full pl-10 p-2.5 focus:ring-fantasy-purple focus:border-fantasy-purple"
              placeholder="Buscar mesas..."
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
                <option value="all">Todas as Mesas</option>
                <option value="dm">Minhas Mestradas</option>
                <option value="player">Minhas Jogadas</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Lista de mesas */}
        <div className="space-y-6">
          {filteredTables.length > 0 ? (
            filteredTables.map((table) => (
              <div key={table.id} className="fantasy-card p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-1">{table.name}</h2>
                    <div className="flex items-center gap-2 mb-2">
                      <Users size={16} className="text-fantasy-gold" />
                      <span className="text-fantasy-stone text-sm">{table.dm}</span>
                      <span className="text-xs bg-fantasy-purple/30 px-2 py-0.5 rounded-full text-fantasy-gold">
                        {table.players.length} jogadores
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {table.tags.map((tag, index) => (
                        <span key={index} className="text-xs bg-fantasy-dark px-2 py-1 rounded text-fantasy-stone">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2 mb-2 text-fantasy-stone">
                      <Calendar size={16} className="text-fantasy-gold" />
                      <span className="text-sm">{table.nextSession}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2 text-fantasy-stone">
                      <Book size={16} className="text-fantasy-gold" />
                      <span className="text-sm">{table.campaign}</span>
                    </div>
                    
                    <Link to={table.isMaster ? `/tables/master/${table.id}` : `/tables/player/${table.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-fantasy-gold text-fantasy-dark py-2 px-4 rounded-lg mt-2 font-medievalsharp text-sm flex items-center gap-2"
                      >
                        <Sword size={14} />
                        Entrar na Mesa
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="fantasy-card p-8 text-center">
              <Users className="mx-auto text-fantasy-purple/40 mb-4" size={48} />
              <h3 className="text-xl font-medievalsharp text-fantasy-purple mb-2">Nenhuma mesa encontrada</h3>
              <p className="text-fantasy-stone mb-4">
                Não encontramos mesas com os filtros atuais. Tente mudar os critérios de busca ou crie uma nova mesa.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="fantasy-button primary mx-auto"
                onClick={() => setShowNewTableModal(true)}
              >
                <Plus size={18} />
                Criar Nova Mesa
              </motion.button>
            </div>
          )}
        </div>
        
        {/* Modal de Nova Mesa */}
        {showNewTableModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="bg-fantasy-dark border border-fantasy-purple/30 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medievalsharp text-fantasy-purple">Criar Nova Mesa</h2>
                <button 
                  onClick={() => setShowNewTableModal(false)}
                  className="text-fantasy-stone hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white mb-1">Nome da Mesa</label>
                  <input
                    type="text"
                    className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2"
                    placeholder="Dê um nome para sua mesa"
                  />
                </div>
                
                <div>
                  <label className="block text-white mb-1">Campanha</label>
                  <input
                    type="text"
                    className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2"
                    placeholder="Em qual campanha sua mesa se passa?"
                  />
                </div>
                
                <div>
                  <label className="block text-white mb-1">Descrição</label>
                  <textarea
                    className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2 min-h-[100px]"
                    placeholder="Descreva sua mesa para os jogadores"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-white mb-1">Sistema</label>
                  <select className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2">
                    <option>D&D 5ª Edição</option>
                    <option>Pathfinder</option>
                    <option>Call of Cthulhu</option>
                    <option>Tormenta20</option>
                    <option>Vampiro: A Máscara</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white mb-1">Dia da Semana</label>
                    <select className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2">
                      <option>Segunda-feira</option>
                      <option>Terça-feira</option>
                      <option>Quarta-feira</option>
                      <option>Quinta-feira</option>
                      <option>Sexta-feira</option>
                      <option>Sábado</option>
                      <option>Domingo</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white mb-1">Horário</label>
                    <input
                      type="time"
                      className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-white mb-1">Máximo de Jogadores</label>
                  <input
                    type="number"
                    className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2"
                    min={1}
                    max={10}
                    defaultValue={5}
                  />
                </div>
                
                <div className="pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-fantasy-gold text-fantasy-dark py-3 rounded-lg font-medievalsharp"
                    onClick={() => {
                      setShowNewTableModal(false);
                      toast("Mesa criada com sucesso!", {
                        description: "Sua nova mesa está pronta para receber jogadores.",
                        action: {
                          label: "Ver Mesa",
                          onClick: () => { /* link to new table */ }
                        }
                      });
                    }}
                  >
                    Criar Mesa
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        
        {/* Componente de rolagem de dados */}
        <DiceRoller />
      </div>
    </MainLayout>
  );
};

export default Tables;
