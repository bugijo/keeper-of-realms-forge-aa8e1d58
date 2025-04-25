import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MainLayout from "@/components/layout/MainLayout";
import { ArrowLeft, User, Users, MessageSquare, MapPin, Shield, Dices } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedDiceRoller from "@/components/dice/EnhancedDiceRoller";
import CharacterStats from "@/components/character/CharacterStats";
import CharacterHeader from "@/components/character/CharacterHeader";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from 'sonner';

const PlayerView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tableData, setTableData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [character, setCharacter] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [gameMaster, setGameMaster] = useState<any>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!id || !user) return;
      
      try {
        setLoading(true);
        
        const { data: tableData, error: tableError } = await supabase
          .from('tables')
          .select('*')
          .eq('id', id)
          .single();
          
        if (tableError) throw tableError;
        
        setTableData(tableData);
        
        const { data: participationData, error: participationError } = await supabase
          .from('table_participants')
          .select('*, characters:character_id(*)')
          .eq('table_id', id)
          .eq('user_id', user.id)
          .single();
          
        if (participationError && participationError.code !== 'PGRST116') {
          throw participationError;
        }
        
        if (!participationData) {
          toast.error('Você não está participando desta mesa');
          navigate('/tables');
          return;
        }
        
        if (participationData.characters) {
          setCharacter(participationData.characters);
        }
        
        const { data: allParticipantsData, error: allParticipantsError } = await supabase
          .from('table_participants')
          .select(`
            id, 
            user_id,
            role,
            profiles:user_id (display_name),
            characters:character_id (id, name, class, race, level)
          `)
          .eq('table_id', id)
          .neq('user_id', user.id);
          
        if (allParticipantsError) throw allParticipantsError;
        
        const otherPlayers = allParticipantsData.filter(p => p.role !== 'gm');
        const gm = allParticipantsData.find(p => p.role === 'gm');
        
        setParticipants(otherPlayers || []);
        setGameMaster(gm);
        
      } catch (error) {
        console.error('Error fetching table data:', error);
        toast.error('Erro ao carregar dados da mesa');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, user, navigate]);
  
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
        <div className="flex items-center mb-6">
          <Link to="/tables" className="mr-4">
            <ArrowLeft className="text-fantasy-stone hover:text-white transition-colors" />
          </Link>
          <h1 className="text-3xl font-medievalsharp text-white">{tableData.name}</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="character" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="character" className="flex items-center gap-1">
                  <User size={16} />
                  Personagem
                </TabsTrigger>
                <TabsTrigger value="party" className="flex items-center gap-1">
                  <Users size={16} />
                  Grupo
                </TabsTrigger>
                <TabsTrigger value="map" className="flex items-center gap-1">
                  <MapPin size={16} />
                  Mapa
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex items-center gap-1">
                  <MessageSquare size={16} />
                  Chat
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="character">
                {character ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <CharacterHeader 
                      name={character.name}
                      level={character.level}
                      race={character.race}
                      characterClass={character.class}
                      background={character.background || "Desconhecido"}
                      alignment={character.alignment || "Neutro"}
                      id={character.id}
                    />
                    
                    <div className="md:col-span-2">
                      {character.attributes && (
                        <CharacterStats 
                          stats={{
                            STR: character.attributes.str || 10,
                            DEX: character.attributes.dex || 10,
                            CON: character.attributes.con || 10,
                            INT: character.attributes.int || 10,
                            WIS: character.attributes.wis || 10,
                            CHA: character.attributes.cha || 10
                          }}
                          abilities={{
                            hp: {
                              current: character.attributes.hp?.current || character.attributes.hp_current || 10,
                              max: character.attributes.hp?.max || character.attributes.hp_max || 10
                            },
                            ac: character.attributes.ac || 10,
                            speed: character.attributes.speed || 30,
                            initiative: Math.floor((character.attributes.dex - 10) / 2) || 0,
                            proficiencyBonus: Math.floor(2 + (character.level - 1) / 4) || 2
                          }}
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="fantasy-card p-6 text-center">
                    <p className="text-fantasy-stone mb-4">Você não tem um personagem selecionado para esta mesa.</p>
                    <Link to="/character" className="fantasy-button primary">
                      Escolher ou criar um personagem
                    </Link>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="party">
                <div className="fantasy-card p-4">
                  <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-4">Grupo de Aventureiros</h2>
                  
                  {gameMaster && (
                    <div className="p-3 bg-fantasy-dark/60 rounded-lg mb-4">
                      <div className="flex items-center">
                        <Shield size={20} className="text-fantasy-gold mr-2" />
                        <div>
                          <p className="text-white font-medievalsharp">Mestre de Jogo</p>
                          <p className="text-sm text-fantasy-stone">{gameMaster.profiles?.display_name || "Mestre"}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    {participants.length > 0 ? participants.map((participant) => (
                      <div key={participant.id} className="p-3 bg-fantasy-dark/40 rounded-lg">
                        <p className="text-white">{participant.profiles?.display_name || "Jogador"}</p>
                        {participant.characters ? (
                          <p className="text-sm text-fantasy-stone">
                            {`${participant.characters.name} - ${participant.characters.race} ${participant.characters.class} Nível ${participant.characters.level}`}
                          </p>
                        ) : (
                          <p className="text-sm text-fantasy-stone">Sem personagem selecionado</p>
                        )}
                      </div>
                    )) : (
                      <p className="text-fantasy-stone text-center">Nenhum outro jogador encontrado</p>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="map">
                <div className="fantasy-card p-4">
                  <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-2">Mapa da Aventura</h2>
                  <p className="text-fantasy-stone mb-4">O mestre ainda não compartilhou um mapa para esta sessão.</p>
                  
                  <div className="h-64 bg-fantasy-dark/40 rounded-lg flex items-center justify-center">
                    <MapPin size={32} className="text-fantasy-stone opacity-50" />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="chat">
                <div className="fantasy-card p-4">
                  <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-2">Chat da Mesa</h2>
                  
                  <div className="h-64 bg-fantasy-dark/40 rounded-lg p-4 mb-3 overflow-y-auto">
                    <div className="text-center text-fantasy-stone my-8">
                      <MessageSquare className="mx-auto mb-2" size={24} />
                      <p>Nenhuma mensagem ainda</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Digite sua mensagem..." 
                      className="flex-grow bg-fantasy-dark/60 rounded p-2 text-white focus:outline-none focus:ring-1 focus:ring-fantasy-purple"
                    />
                    <Button className="fantasy-button primary">Enviar</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <div className="fantasy-card p-4 mb-4">
              <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-2">Informações da Sessão</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm text-fantasy-stone">Campanha</h3>
                  <p className="text-white">{tableData.campaign || "Campanha sem nome"}</p>
                </div>
                <div>
                  <h3 className="text-sm text-fantasy-stone">Sistema</h3>
                  <p className="text-white">{tableData.system || "D&D 5e"}</p>
                </div>
                <div>
                  <h3 className="text-sm text-fantasy-stone">Mestre</h3>
                  <p className="text-white">{gameMaster?.profiles?.display_name || "Não definido"}</p>
                </div>
              </div>
            </div>
            
            <div className="fantasy-card p-4">
              <h2 className="flex items-center text-xl font-medievalsharp text-fantasy-purple mb-2">
                <Dices size={20} className="mr-2" />
                Dados
              </h2>
              <EnhancedDiceRoller compact />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PlayerView;
