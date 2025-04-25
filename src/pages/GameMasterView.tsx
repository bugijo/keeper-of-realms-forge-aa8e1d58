
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MainLayout from "@/components/layout/MainLayout";
import { ArrowLeft, Play, Share2, Users, Sword, BookOpen, Map, MessageSquare, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DiceRoller from "@/components/dice/DiceRoller";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from 'sonner';

const GameMasterView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tableData, setTableData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchTableData = async () => {
      if (!id || !user) return;
      
      try {
        setLoading(true);
        
        // Fetch table data
        const { data: tableData, error: tableError } = await supabase
          .from('tables')
          .select('*')
          .eq('id', id)
          .single();
          
        if (tableError) throw tableError;
        
        // Check if user is the game master
        if (tableData.user_id !== user.id) {
          toast.error('Você não tem permissão para acessar esta página');
          navigate('/tables');
          return;
        }
        
        setTableData(tableData);
        
        // Fetch participants
        const { data: participantsData, error: participantsError } = await supabase
          .from('table_participants')
          .select(`
            id, 
            user_id,
            role,
            profiles:user_id (display_name),
            characters:character_id (id, name, class, race, level)
          `)
          .eq('table_id', id);
          
        if (participantsError) throw participantsError;
        
        setParticipants(participantsData || []);
        
      } catch (error) {
        console.error('Error fetching table data:', error);
        toast.error('Erro ao carregar dados da mesa');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTableData();
  }, [id, user, navigate]);
  
  const startSession = () => {
    navigate(`/table/gm/${id}`);
  };
  
  const copyInviteLink = () => {
    const link = `${window.location.origin}/tables/join/${id}`;
    navigator.clipboard.writeText(link);
    toast.success('Link de convite copiado!');
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6">
          <div className="fantasy-card p-6 text-center">
            <p className="text-fantasy-stone animate-pulse">Carregando mesa...</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!tableData) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6">
          <div className="fantasy-card p-6 text-center">
            <p className="text-fantasy-stone">Mesa não encontrada ou você não tem permissão para acessá-la.</p>
            <Link to="/tables" className="fantasy-button primary mt-4 inline-block">
              Voltar para Mesas
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6 justify-between">
          <div className="flex items-center">
            <Link to="/tables" className="mr-4">
              <ArrowLeft className="text-fantasy-stone hover:text-white transition-colors" />
            </Link>
            <h1 className="text-3xl font-medievalsharp text-white">{tableData.name}</h1>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={copyInviteLink}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Share2 size={16} />
              Convidar
            </Button>
            <Button 
              onClick={startSession}
              className="fantasy-button primary flex items-center gap-1"
            >
              <Play size={16} />
              Iniciar Sessão
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="overview" className="flex items-center gap-1">
                  <Eye size={16} />
                  Visão Geral
                </TabsTrigger>
                <TabsTrigger value="participants" className="flex items-center gap-1">
                  <Users size={16} />
                  Participantes
                </TabsTrigger>
                <TabsTrigger value="combat" className="flex items-center gap-1">
                  <Sword size={16} />
                  Combate
                </TabsTrigger>
                <TabsTrigger value="notes" className="flex items-center gap-1">
                  <BookOpen size={16} />
                  Anotações
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="fantasy-card p-4">
                  <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-2">Informações da Mesa</h2>
                  <p className="text-fantasy-stone mb-4">{tableData.description || "Sem descrição."}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div>
                      <h3 className="text-sm text-fantasy-stone">Sistema</h3>
                      <p className="text-white">{tableData.system || "D&D 5e"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-fantasy-stone">Campanha</h3>
                      <p className="text-white">{tableData.campaign || "Campanha sem nome"}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm text-fantasy-stone">Dia da Semana</h3>
                      <p className="text-white">{tableData.weekday || "Não definido"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-fantasy-stone">Horário</h3>
                      <p className="text-white">{tableData.time || "Não definido"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="fantasy-card p-4">
                  <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-2">Sinopse da Aventura</h2>
                  <p className="text-fantasy-stone">{tableData.synopsis || "Nenhuma sinopse disponível para esta aventura."}</p>
                </div>
                
                <div className="fantasy-card p-4">
                  <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-2">Para Iniciar</h2>
                  <p className="text-fantasy-stone mb-4">Quando todos os jogadores estiverem prontos, clique em "Iniciar Sessão" para começar a jogar.</p>
                  
                  <div className="flex justify-center">
                    <Button 
                      onClick={startSession}
                      className="fantasy-button primary flex items-center gap-2 w-full sm:w-auto"
                    >
                      <Play size={16} />
                      Iniciar Sessão
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="participants">
                <div className="fantasy-card p-4">
                  <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-4">Participantes da Mesa</h2>
                  
                  <div className="space-y-4">
                    {participants.length > 0 ? participants.map((participant) => (
                      <div key={participant.id} className="flex justify-between items-center p-3 bg-fantasy-dark/40 rounded-lg">
                        <div>
                          <p className="text-white">{participant.profiles?.display_name || "Jogador"}</p>
                          {participant.characters ? (
                            <p className="text-sm text-fantasy-stone">
                              {`${participant.characters.name} - ${participant.characters.race} ${participant.characters.class} Nível ${participant.characters.level}`}
                            </p>
                          ) : (
                            <p className="text-sm text-fantasy-stone">Sem personagem selecionado</p>
                          )}
                        </div>
                        <div className="px-2 py-1 text-xs rounded bg-fantasy-purple/20 text-fantasy-purple">
                          {participant.role === 'gm' ? 'Mestre' : 'Jogador'}
                        </div>
                      </div>
                    )) : (
                      <p className="text-fantasy-stone text-center">Nenhum participante encontrado</p>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="combat">
                <div className="fantasy-card p-4">
                  <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-4">Preparação de Combate</h2>
                  <p className="text-fantasy-stone mb-4">
                    Configure encontros e gerencie combates para sua sessão.
                  </p>
                  
                  <Link to={`/combat?table=${id}`} className="fantasy-button primary flex items-center justify-center gap-2 w-full">
                    <Sword size={16} />
                    Abrir Rastreador de Combate
                  </Link>
                </div>
                
                <div className="fantasy-card p-4 mt-4">
                  <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-4">Ferramenta de Dados</h2>
                  <DiceRoller />
                </div>
              </TabsContent>
              
              <TabsContent value="notes">
                <div className="fantasy-card p-4">
                  <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-4">Anotações do Mestre</h2>
                  <textarea 
                    className="w-full h-64 bg-fantasy-dark/40 text-white rounded p-3 focus:outline-none focus:ring-2 focus:ring-fantasy-purple"
                    placeholder="Escreva suas anotações para esta sessão aqui..."
                  ></textarea>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <div className="fantasy-card p-4 mb-4">
              <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-4">Ferramentas Rápidas</h2>
              
              <div className="grid grid-cols-2 gap-3">
                <Link to={`/maps?table=${id}`} className="p-3 bg-fantasy-dark/40 rounded-lg text-center hover:bg-fantasy-dark/60 transition-colors">
                  <Map size={24} className="mx-auto mb-2 text-fantasy-purple" />
                  <span className="text-sm text-white">Mapas</span>
                </Link>
                <Link to={`/npcs?table=${id}`} className="p-3 bg-fantasy-dark/40 rounded-lg text-center hover:bg-fantasy-dark/60 transition-colors">
                  <Users size={24} className="mx-auto mb-2 text-fantasy-purple" />
                  <span className="text-sm text-white">NPCs</span>
                </Link>
                <Link to={`/monsters?table=${id}`} className="p-3 bg-fantasy-dark/40 rounded-lg text-center hover:bg-fantasy-dark/60 transition-colors">
                  <Sword size={24} className="mx-auto mb-2 text-fantasy-purple" />
                  <span className="text-sm text-white">Monstros</span>
                </Link>
                <Link to={`/stories?table=${id}`} className="p-3 bg-fantasy-dark/40 rounded-lg text-center hover:bg-fantasy-dark/60 transition-colors">
                  <BookOpen size={24} className="mx-auto mb-2 text-fantasy-purple" />
                  <span className="text-sm text-white">Histórias</span>
                </Link>
              </div>
            </div>
            
            <div className="fantasy-card p-4">
              <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-4">Dados Rápidos</h2>
              <DiceRoller compact />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default GameMasterView;
