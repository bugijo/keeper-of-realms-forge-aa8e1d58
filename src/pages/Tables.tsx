import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Plus, Book, Users, Calendar, Sword, Search, Filter, Eye, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

const Tables = () => {
  const { session } = useAuth();
  const [showNewTableModal, setShowNewTableModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [tables, setTables] = useState<any[]>([]);
  const [myTables, setMyTables] = useState<any[]>([]);
  const [participatingTables, setParticipatingTables] = useState<any[]>([]);
  const [joinRequests, setJoinRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: "",
    campaign: "",
    description: "",
    system: "D&D 5ª Edição",
    weekday: "Sábado",
    time: "19:00",
    max_players: 5,
    synopsis: ""
  });

  useEffect(() => {
    const fetchTables = async () => {
      if (!session?.user) return;
      
      setLoading(true);
      try {
        const { data: createdTables, error: createdError } = await supabase
          .from('tables')
          .select('*')
          .eq('user_id', session.user.id);
          
        if (createdError) throw createdError;
        setMyTables(createdTables || []);
        
        const { data: participations, error: participationsError } = await supabase
          .from('table_participants')
          .select(`
            *,
            tables:table_id (*)
          `)
          .eq('user_id', session.user.id)
          .eq('role', 'player');
          
        if (participationsError) throw participationsError;
        setParticipatingTables(participations?.map(p => p.tables) || []);
        
        const { data: requests, error: requestsError } = await supabase
          .from('table_join_requests')
          .select(`
            *,
            profiles:user_id (display_name),
            tables:table_id (name)
          `)
          .eq('status', 'pending')
          .in('table_id', createdTables?.map(t => t.id) || []);
          
        if (requestsError) throw requestsError;
        setJoinRequests(requests || []);
        
        const { data: allTables, error: tablesError } = await supabase
          .from('tables')
          .select('*')
          .neq('user_id', session.user.id);
          
        if (tablesError) throw tablesError;
        setTables(allTables || []);
        
      } catch (err) {
        console.error('Error:', err);
        toast.error('Erro ao carregar dados');
      }
      setLoading(false);
    };

    fetchTables();
  }, [session]);

  const handleJoinRequest = async (tableId: string, accepted: boolean, requestId: string) => {
    try {
      if (accepted) {
        const { error: participantError } = await supabase
          .from('table_participants')
          .insert({
            table_id: tableId,
            user_id: joinRequests.find(r => r.id === requestId)?.user_id,
            role: 'player'
          });
          
        if (participantError) throw participantError;
      }
      
      const { error: updateError } = await supabase
        .from('table_join_requests')
        .update({ status: accepted ? 'accepted' : 'rejected' })
        .eq('id', requestId);
        
      if (updateError) throw updateError;
      
      setJoinRequests(prev => prev.filter(r => r.id !== requestId));
      toast.success(accepted ? 'Solicitação aceita!' : 'Solicitação rejeitada');
      
    } catch (err) {
      console.error('Error:', err);
      toast.error('Erro ao processar solicitação');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateTable = async () => {
    if (!session?.user) {
      toast.error('Você precisa estar logado para criar uma mesa');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Nome da mesa é obrigatório');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tables')
        .insert({
          name: formData.name,
          campaign: formData.campaign,
          description: formData.description,
          system: formData.system,
          weekday: formData.weekday,
          time: formData.time,
          max_players: parseInt(formData.max_players.toString()),
          synopsis: formData.synopsis,
          user_id: session.user.id,
          status: 'open'
        })
        .select();

      if (error) {
        console.error('Error creating table:', error);
        toast.error('Erro ao criar mesa: ' + error.message);
        return;
      }

      if (data && data.length > 0) {
        const { error: partError } = await supabase
          .from('table_participants')
          .insert({
            table_id: data[0].id,
            user_id: session.user.id,
            role: 'dm'
          });

        if (partError) {
          console.error('Error adding participant:', partError);
        }
      }

      toast.success('Mesa criada com sucesso!', {
        description: "Sua nova mesa está pronta para receber jogadores.",
        action: data && data.length > 0 ? {
          label: "Ver Mesa",
          onClick: () => {
            window.location.href = `/tables/details/${data[0].id}`;
          }
        } : undefined
      });

      setFormData({
        name: "",
        campaign: "",
        description: "",
        system: "D&D 5ª Edição",
        weekday: "Sábado",
        time: "19:00",
        max_players: 5,
        synopsis: ""
      });
      setShowNewTableModal(false);
      
      const { data: newTables } = await supabase.from('tables').select('*');
      if (newTables) setTables(newTables);
      
    } catch (err: any) {
      console.error('Error:', err);
      toast.error('Erro ao criar mesa: ' + (err.message || ''));
    }
  };

  const filteredTables = tables.filter(table => {
    if (searchTerm && !table.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !(table.campaign && table.campaign.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    
    return true;
  });

  return (
    <MainLayout>
      <div className="container mx-auto pb-16">
        {session?.user && (
          <>
            {joinRequests.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-medievalsharp text-white mb-4 flex items-center gap-2">
                  <Bell className="text-fantasy-gold" />
                  Solicitações Pendentes
                </h2>
                <div className="space-y-4">
                  {joinRequests.map(request => (
                    <div key={request.id} className="fantasy-card p-4">
                      <p className="text-fantasy-stone mb-2">
                        {request.profiles?.display_name || 'Usuário'} quer participar da mesa "{request.tables?.name}"
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleJoinRequest(request.table_id, true, request.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Aceitar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleJoinRequest(request.table_id, false, request.id)}
                        >
                          Recusar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {myTables.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-medievalsharp text-white mb-4">Minhas Mesas Criadas</h2>
                <div className="space-y-4">
                  {myTables.map(table => (
                    <div key={table.id} className="fantasy-card p-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                          <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-1">{table.name}</h2>
                          <div className="flex items-center gap-2 mb-2">
                            <Users size={16} className="text-fantasy-gold" />
                            <span className="text-fantasy-stone text-sm">
                              {table.user_id === session?.user?.id ? 'Você (Mestre)' : 'Mestre da Mesa'}
                            </span>
                            <span className="text-xs bg-fantasy-purple/30 px-2 py-0.5 rounded-full text-fantasy-gold">
                              {table.max_players} jogadores max
                            </span>
                          </div>
                          
                          {table.system && (
                            <span className="text-xs bg-fantasy-dark px-2 py-1 rounded text-fantasy-stone mr-2">
                              {table.system}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-end">
                          <Link to={`/tables/details/${table.id}`}>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-fantasy-gold text-fantasy-dark py-2 px-4 rounded-lg mt-2 font-medievalsharp text-sm flex items-center gap-2"
                            >
                              <Sword size={14} />
                              Detalhes da Mesa
                            </motion.button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {participatingTables.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-medievalsharp text-white mb-4">Mesas que Participo</h2>
                <div className="space-y-4">
                  {participatingTables.map(table => (
                    <div key={table.id} className="fantasy-card p-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                          <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-1">{table.name}</h2>
                          <div className="flex items-center gap-2 mb-2">
                            <Users size={16} className="text-fantasy-gold" />
                            <span className="text-fantasy-stone text-sm">
                              {table.user_id === session?.user?.id ? 'Você (Mestre)' : 'Mestre da Mesa'}
                            </span>
                            <span className="text-xs bg-fantasy-purple/30 px-2 py-0.5 rounded-full text-fantasy-gold">
                              {table.max_players} jogadores max
                            </span>
                          </div>
                          
                          {table.system && (
                            <span className="text-xs bg-fantasy-dark px-2 py-1 rounded text-fantasy-stone mr-2">
                              {table.system}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-end">
                          <Link to={`/tables/details/${table.id}`}>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-fantasy-gold text-fantasy-dark py-2 px-4 rounded-lg mt-2 font-medievalsharp text-sm flex items-center gap-2"
                            >
                              <Sword size={14} />
                              Detalhes da Mesa
                            </motion.button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {loading ? (
          <div className="fantasy-card p-8 text-center">
            <Spinner size="lg" className="mx-auto mb-4" />
            <p className="text-fantasy-stone">Carregando mesas...</p>
          </div>
        ) : filteredTables.length > 0 ? (
          <div className="space-y-6">
            {filteredTables.map((table) => (
              <div key={table.id} className="fantasy-card p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-1">{table.name}</h2>
                    <div className="flex items-center gap-2 mb-2">
                      <Users size={16} className="text-fantasy-gold" />
                      <span className="text-fantasy-stone text-sm">
                        {table.user_id === session?.user?.id ? 'Você (Mestre)' : 'Mestre da Mesa'}
                      </span>
                      <span className="text-xs bg-fantasy-purple/30 px-2 py-0.5 rounded-full text-fantasy-gold">
                        {table.max_players} jogadores max
                      </span>
                    </div>
                    
                    {table.system && (
                      <span className="text-xs bg-fantasy-dark px-2 py-1 rounded text-fantasy-stone mr-2">
                        {table.system}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2 mb-2 text-fantasy-stone">
                      <Calendar size={16} className="text-fantasy-gold" />
                      <span className="text-sm">{table.weekday || 'Dia'} às {table.time || 'Horário'}</span>
                    </div>
                    
                    {table.campaign && (
                      <div className="flex items-center gap-2 mb-2 text-fantasy-stone">
                        <Book size={16} className="text-fantasy-gold" />
                        <span className="text-sm">{table.campaign}</span>
                      </div>
                    )}
                    
                    <Link to={`/tables/details/${table.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-fantasy-gold text-fantasy-dark py-2 px-4 rounded-lg mt-2 font-medievalsharp text-sm flex items-center gap-2"
                      >
                        <Sword size={14} />
                        Detalhes da Mesa
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2"
                    placeholder="Dê um nome para sua mesa"
                  />
                </div>
                
                <div>
                  <label className="block text-white mb-1">Campanha</label>
                  <input
                    type="text"
                    name="campaign"
                    value={formData.campaign}
                    onChange={handleInputChange}
                    className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2"
                    placeholder="Em qual campanha sua mesa se passa?"
                  />
                </div>
                
                <div>
                  <label className="block text-white mb-1">Sinopse</label>
                  <textarea
                    name="synopsis"
                    value={formData.synopsis}
                    onChange={handleInputChange}
                    className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2 min-h-[100px]"
                    placeholder="Descreva sua mesa para os jogadores"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-white mb-1">Descrição Adicional (opcional)</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2 min-h-[80px]"
                    placeholder="Detalhes adicionais sobre a mesa"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-white mb-1">Sistema</label>
                  <select 
                    name="system"
                    value={formData.system}
                    onChange={handleInputChange}
                    className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2">
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
                    <select 
                      name="weekday"
                      value={formData.weekday}
                      onChange={handleInputChange}
                      className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2">
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
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-white mb-1">Máximo de Jogadores</label>
                  <input
                    type="number"
                    name="max_players"
                    value={formData.max_players}
                    onChange={handleInputChange}
                    className="w-full bg-fantasy-dark/80 border border-fantasy-purple/30 text-white rounded-lg p-2"
                    min={1}
                    max={10}
                  />
                </div>
                
                <div className="pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-fantasy-gold text-fantasy-dark py-3 rounded-lg font-medievalsharp"
                    onClick={handleCreateTable}
                  >
                    Criar Mesa
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        
        <DiceRoller />
      </div>
    </MainLayout>
  );
};

export default Tables;
