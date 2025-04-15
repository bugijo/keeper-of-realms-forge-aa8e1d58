
import React, { useState } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import { ArrowLeft, Save, Users, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NpcCreation = () => {
  const [personality, setPersonality] = useState<string[]>([]);
  const [newTrait, setNewTrait] = useState("");
  
  const handleAddTrait = () => {
    if (newTrait.trim()) {
      setPersonality([...personality, newTrait.trim()]);
      setNewTrait("");
    }
  };
  
  const handleRemoveTrait = (index: number) => {
    setPersonality(personality.filter((_, i) => i !== index));
  };
  
  // Suggested traits
  const suggestedTraits = [
    "Desconfiado", "Leal", "Ambicioso", "Orgulhoso", "Corajoso", 
    "Tímido", "Generoso", "Mesquinho", "Sábio", "Impulsivo"
  ];
  
  return (
    <MainLayout>
      <div className="container mx-auto pb-16">
        <div className="flex items-center mb-6">
          <Link to="/npcs" className="mr-4">
            <ArrowLeft className="text-fantasy-stone hover:text-white transition-colors" />
          </Link>
          <h1 className="text-2xl font-medievalsharp text-white">Criar Novo NPC</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* NPC Preview */}
          <div className="md:col-span-1">
            <div className="fantasy-card p-6">
              <h3 className="text-lg font-medievalsharp text-white mb-4">Pré-visualização</h3>
              
              <div className="h-40 w-40 mx-auto rounded-full overflow-hidden border-4 border-fantasy-purple/30 mb-4 bg-fantasy-dark/50 flex items-center justify-center">
                <Users className="text-fantasy-purple/40" size={32} />
              </div>
              
              <h4 className="text-center text-xl font-medievalsharp text-white mb-1">Nome do NPC</h4>
              <p className="text-center text-fantasy-stone mb-3">Humano • Comerciante</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-fantasy-stone">Localização:</span>
                  <span className="text-white">Cidade da Coroa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fantasy-stone">Alinhamento:</span>
                  <span className="text-white">Neutro e Bom</span>
                </div>
              </div>
              
              <div className="bg-fantasy-dark/30 p-3 rounded-lg">
                <h5 className="text-sm font-medievalsharp text-fantasy-gold mb-2">Personalidade</h5>
                <div className="flex flex-wrap gap-1">
                  {personality.map((trait, idx) => (
                    <span key={idx} className="text-xs bg-fantasy-dark px-2 py-0.5 rounded text-fantasy-stone">
                      {trait}
                    </span>
                  ))}
                  {personality.length === 0 && (
                    <span className="text-xs text-fantasy-stone/50 italic">
                      Adicione traços de personalidade...
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* NPC Form */}
          <div className="md:col-span-2">
            <div className="fantasy-card p-6">
              <h3 className="text-lg font-medievalsharp text-white mb-4">Informações Básicas</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-fantasy-stone mb-1">Nome</label>
                  <input
                    type="text"
                    className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2"
                    placeholder="Digite o nome do NPC"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-fantasy-stone mb-1">Raça</label>
                    <select
                      className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2"
                    >
                      <option value="humano">Humano</option>
                      <option value="elfo">Elfo</option>
                      <option value="anao">Anão</option>
                      <option value="halfling">Halfling</option>
                      <option value="tiefling">Tiefling</option>
                      <option value="draconato">Draconato</option>
                      <option value="gnomo">Gnomo</option>
                      <option value="meio-elfo">Meio-Elfo</option>
                      <option value="meio-orc">Meio-Orc</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-fantasy-stone mb-1">Ocupação</label>
                    <input
                      type="text"
                      className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2"
                      placeholder="Ex: Comerciante, Guarda, etc."
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-fantasy-stone mb-1">Localização</label>
                    <input
                      type="text"
                      className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2"
                      placeholder="Onde este NPC pode ser encontrado"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-fantasy-stone mb-1">Alinhamento</label>
                    <select
                      className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2"
                    >
                      <option value="LG">Leal e Bom</option>
                      <option value="NG">Neutro e Bom</option>
                      <option value="CG">Caótico e Bom</option>
                      <option value="LN">Leal e Neutro</option>
                      <option value="N">Neutro</option>
                      <option value="CN">Caótico e Neutro</option>
                      <option value="LE">Leal e Mau</option>
                      <option value="NE">Neutro e Mau</option>
                      <option value="CE">Caótico e Mau</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-fantasy-stone mb-1">Aparência</label>
                  <textarea
                    className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2 min-h-[80px]"
                    placeholder="Descreva a aparência física do NPC..."
                  ></textarea>
                </div>
                
                {/* Personality Traits */}
                <div>
                  <label className="block text-fantasy-stone mb-1">Traços de Personalidade</label>
                  <div className="flex mb-2">
                    <input
                      type="text"
                      className="flex-1 bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-l-lg p-2"
                      placeholder="Adicionar traço (ex: Leal, Desconfiado)"
                      value={newTrait}
                      onChange={(e) => setNewTrait(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTrait()}
                    />
                    <button 
                      className="bg-fantasy-purple text-white px-3 rounded-r-lg"
                      onClick={handleAddTrait}
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {personality.map((trait, idx) => (
                      <div key={idx} className="bg-fantasy-dark flex items-center gap-1 px-2 py-1 rounded-full">
                        <span className="text-sm text-fantasy-stone">{trait}</span>
                        <button 
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleRemoveTrait(idx)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-xs text-fantasy-stone mb-2">Traços sugeridos:</p>
                    <div className="flex flex-wrap gap-1">
                      {suggestedTraits.map((trait) => (
                        <button
                          key={trait}
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            personality.includes(trait) 
                              ? 'bg-fantasy-purple/50 text-white cursor-not-allowed' 
                              : 'bg-fantasy-dark/50 text-fantasy-stone hover:bg-fantasy-dark'
                          }`}
                          onClick={() => {
                            if (!personality.includes(trait)) {
                              setPersonality([...personality, trait]);
                            }
                          }}
                          disabled={personality.includes(trait)}
                        >
                          {trait}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="fantasy-card p-6 mt-6">
              <h3 className="text-lg font-medievalsharp text-white mb-4">Detalhes Adicionais</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-fantasy-stone mb-1">História de Fundo</label>
                  <textarea
                    className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2 min-h-[100px]"
                    placeholder="Descreva a história deste NPC..."
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-fantasy-stone mb-1">Motivações & Objetivos</label>
                  <textarea
                    className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2 min-h-[100px]"
                    placeholder="O que este NPC deseja? Quais são seus objetivos?"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-fantasy-stone mb-1">Conexões & Relacionamentos</label>
                  <textarea
                    className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2 min-h-[80px]"
                    placeholder="Quais são as relações deste NPC com outros personagens ou facções?"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-fantasy-stone mb-1">Voz & Maneirismos</label>
                  <textarea
                    className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2 min-h-[80px]"
                    placeholder="Como este NPC fala? Possui algum tique ou maneirismo característico?"
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <Link to="/npcs">
                  <button className="bg-fantasy-dark text-fantasy-stone py-2 px-4 rounded-lg">
                    Cancelar
                  </button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-fantasy-gold text-fantasy-dark py-2 px-6 rounded-lg font-medievalsharp flex items-center gap-2"
                >
                  <Save size={18} />
                  Salvar NPC
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NpcCreation;
