
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { 
  Plus, 
  Users, 
  Calendar, 
  MapPin, 
  Clock, 
  Edit,
  Eye,
  Check,
  X
} from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Tables = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tables, setTables] = useState<any[]>([]);
  const [myTables, setMyTables] = useState<any[]>([]);
  const [participatingTables, setParticipatingTables] = useState<any[]>([]);
  const [joinRequests, setJoinRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  
  // Fetch tables the user has created
  const fetchMyTables = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('tables')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setMyTables(data || []);
    } catch (err) {
      console.error('Error fetching my tables:', err);
      toast.error('Erro ao carregar suas mesas');
    }
  };
  
  // Fetch tables the user participates in (but didn't create)
  const fetchParticipatingTables = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('table_participants')
        .select('*, tables(*)')
        .eq('user_id', user.id)
        .order('joined_at', { ascending: false });
        
      if (error) throw error;
      
      // Filter out tables the user created (to avoid duplication)
      const participatingTablesData = data
        ?.filter(item => item.tables?.user_id !== user.id)
        .map(item => item.tables) || [];
        
      setParticipatingTables(participatingTablesData);
    } catch (err) {
      console.error('Error fetching participating tables:', err);
      toast.error('Erro ao carregar mesas que você participa');
    }
  };
  
  // Fetch join requests for tables the user owns
  const fetchJoinRequests = async () => {
    if (!user) return;
    
    try {
      // First get all tables created by the user
      const { data: userTables, error: tablesError } = await supabase
        .from('tables')
        .select('id')
        .eq('user_id', user.id);
        
      if (tablesError) throw tablesError;
      
      if (userTables && userTables.length > 0) {
        // Get all pending join requests for these tables
        const tableIds = userTables.map(table => table.id);
        
        const { data: requests, error: requestsError } = await supabase
          .from('table_join_requests')
          .select('*, profiles(display_name), tables(name)')
          .in('table_id', tableIds)
          .eq('status', 'pending')
          .order('created_at', { ascending: false });
          
        if (requestsError) throw requestsError;
        setJoinRequests(requests || []);
      }
    } catch (err) {
      console.error('Error fetching join requests:', err);
      toast.error('Erro ao carregar solicitações de participação');
    }
  };

  // Fetch all public tables for discovery
  const fetchAllTables = async () => {
    try {
      const { data, error } = await supabase
        .from('tables')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(20);
        
      if (error) throw error;
      setTables(data || []);
    } catch (err) {
      console.error('Error fetching tables:', err);
      toast.error('Erro ao carregar mesas disponíveis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      Promise.all([
        fetchMyTables(),
        fetchParticipatingTables(),
        fetchJoinRequests(),
        fetchAllTables()
      ]).finally(() => setLoading(false));
    } else {
      fetchAllTables();
    }
  }, [user]);

  const handleCreateTable = () => {
    if (!user) {
      toast.error('Você precisa estar logado para criar uma mesa');
      navigate('/login');
      return;
    }
    navigate('/table/create');
  };
  
  const handleJoinRequest = async (tableId: string) => {
    if (!user) {
      toast.error('Você precisa estar logado para solicitar participação');
      navigate('/login');
      return;
    }
    
    setLoadingAction(tableId);
    
    try {
      // Check if user already has a request for this table
      const { data: existingRequest, error: checkError } = await supabase
        .from('table_join_requests')
        .select('*')
        .eq('table_id', tableId)
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (existingRequest) {
        toast.info('Você já solicitou participação nesta mesa');
        return;
      }
      
      // Create new request
      const { error } = await supabase
        .from('table_join_requests')
        .insert({
          table_id: tableId,
          user_id: user.id,
          status: 'pending'
        });
        
      if (error) throw error;
      
      toast.success('Solicitação de participação enviada');
      fetchAllTables();  // Refresh the tables list
    } catch (err) {
      console.error('Error sending join request:', err);
      toast.error('Erro ao enviar solicitação');
    } finally {
      setLoadingAction(null);
    }
  };
  
  const handleRequestAction = async (requestId: string, tableName: string, action: 'approve' | 'reject') => {
    setLoadingAction(requestId);
    
    try {
      if (action === 'approve') {
        // Get the request details first
        const { data: request, error: requestError } = await supabase
          .from('table_join_requests')
          .select('*')
          .eq('id', requestId)
          .single();
          
        if (requestError) throw requestError;
        
        // Add user as a participant
        const { error: participantError } = await supabase
          .from('table_participants')
          .insert({
            table_id: request.table_id,
            user_id: request.user_id,
            role: 'player'
          });
          
        if (participantError) throw participantError;
      }
      
      // Update request status
      const { error } = await supabase
        .from('table_join_requests')
        .update({ status: action === 'approve' ? 'approved' : 'rejected' })
        .eq('id', requestId);
        
      if (error) throw error;
      
      toast.success(
        action === 'approve' 
          ? `Participante aprovado na mesa ${tableName}` 
          : `Solicitação rejeitada para mesa ${tableName}`
      );
      
      // Refresh requests list
      fetchJoinRequests();
    } catch (err) {
      console.error(`Error ${action === 'approve' ? 'approving' : 'rejecting'} request:`, err);
      toast.error(`Erro ao ${action === 'approve' ? 'aprovar' : 'rejeitar'} solicitação`);
    } finally {
      setLoadingAction(null);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-16 flex flex-col items-center justify-center">
          <Spinner size="lg" variant="shield" />
          <p className="text-fantasy-stone mt-4">Carregando mesas...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <h1 className="text-3xl font-medievalsharp text-fantasy-purple mb-4 md:mb-0">
            Mesas de RPG
          </h1>
          <Button 
            onClick={handleCreateTable} 
            className="fantasy-button primary flex items-center gap-2"
          >
            <Plus size={16} />
            Criar Mesa
          </Button>
        </div>

        <Tabs defaultValue="discover">
          <TabsList className="mb-6">
            <TabsTrigger value="discover">Descobrir</TabsTrigger>
            {user && (
              <>
                <TabsTrigger value="my-tables">Minhas Mesas</TabsTrigger>
                <TabsTrigger value="participating">Participando</TabsTrigger>
                {joinRequests.length > 0 && (
                  <TabsTrigger value="requests" className="relative">
                    Solicitações
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {joinRequests.length}
                    </span>
                  </TabsTrigger>
                )}
              </>
            )}
          </TabsList>
          
          <TabsContent value="discover">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tables.length > 0 ? (
                tables.map(table => (
                  <Link 
                    to={`/table/${table.id}`} 
                    key={table.id}
                    className="fantasy-card p-6 hover:bg-fantasy-dark/40 transition-colors"
                  >
                    <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-2">
                      {table.name}
                    </h2>
                    
                    <div className="flex items-center text-fantasy-stone mb-2">
                      <Users className="mr-2 text-fantasy-gold" size={16} />
                      <span>
                        {/* We don't have participant count here, would require a join */}
                        {table.max_players || 5} vagas
                      </span>
                    </div>
                    
                    {table.weekday && table.time && (
                      <div className="flex items-center text-fantasy-stone mb-2">
                        <Calendar className="mr-2 text-fantasy-gold" size={16} />
                        <span>{table.weekday} - {table.time}</span>
                      </div>
                    )}
                    
                    {table.system && (
                      <div className="flex items-center text-fantasy-stone mb-2">
                        <MapPin className="mr-2 text-fantasy-gold" size={16} />
                        <span>{table.system}</span>
                      </div>
                    )}
                    
                    {table.status && (
                      <div className="flex items-center text-fantasy-stone mb-4">
                        <Clock className="mr-2 text-fantasy-gold" size={16} />
                        <span>Status: {table.status}</span>
                      </div>
                    )}
                    
                    {user && user.id !== table.user_id && (
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          handleJoinRequest(table.id);
                        }}
                        disabled={loadingAction === table.id}
                        className="fantasy-button secondary w-full"
                      >
                        {loadingAction === table.id ? (
                          <Spinner size="sm" />
                        ) : (
                          'Solicitar Participação'
                        )}
                      </Button>
                    )}
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center fantasy-card p-8">
                  <h3 className="text-xl text-fantasy-stone mb-2">
                    Nenhuma mesa disponível no momento
                  </h3>
                  <p className="text-fantasy-stone/70">
                    Por que não criar uma nova mesa?
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {user && (
            <>
              <TabsContent value="my-tables">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myTables.length > 0 ? (
                    myTables.map(table => (
                      <div 
                        key={table.id}
                        className="fantasy-card p-6"
                      >
                        <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-2">
                          {table.name}
                        </h2>
                        
                        <div className="flex items-center text-fantasy-stone mb-2">
                          <Users className="mr-2 text-fantasy-gold" size={16} />
                          <span>{table.max_players || 5} vagas</span>
                        </div>
                        
                        {table.weekday && table.time && (
                          <div className="flex items-center text-fantasy-stone mb-2">
                            <Calendar className="mr-2 text-fantasy-gold" size={16} />
                            <span>{table.weekday} - {table.time}</span>
                          </div>
                        )}
                        
                        {table.status && (
                          <div className="flex items-center text-fantasy-stone mb-4">
                            <Clock className="mr-2 text-fantasy-gold" size={16} />
                            <span>Status: {table.status}</span>
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <Link 
                            to={`/table/${table.id}`} 
                            className="fantasy-button secondary flex-1 text-center"
                          >
                            <Eye size={16} className="mr-2" />
                            Detalhes
                          </Link>
                          <Link 
                            to={`/gm/${table.id}`}
                            className="fantasy-button primary flex-1 text-center"
                          >
                            <Edit size={16} className="mr-2" />
                            Painel
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center fantasy-card p-8">
                      <h3 className="text-xl text-fantasy-stone mb-2">
                        Você ainda não criou nenhuma mesa
                      </h3>
                      <Button 
                        onClick={handleCreateTable} 
                        className="fantasy-button primary mt-4"
                      >
                        <Plus size={16} className="mr-2" />
                        Criar Mesa
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="participating">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {participatingTables.length > 0 ? (
                    participatingTables.map(table => (
                      <div 
                        key={table.id}
                        className="fantasy-card p-6"
                      >
                        <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-2">
                          {table.name}
                        </h2>
                        
                        {table.weekday && table.time && (
                          <div className="flex items-center text-fantasy-stone mb-2">
                            <Calendar className="mr-2 text-fantasy-gold" size={16} />
                            <span>{table.weekday} - {table.time}</span>
                          </div>
                        )}
                        
                        {table.system && (
                          <div className="flex items-center text-fantasy-stone mb-2">
                            <MapPin className="mr-2 text-fantasy-gold" size={16} />
                            <span>{table.system}</span>
                          </div>
                        )}
                        
                        {table.status && (
                          <div className="flex items-center text-fantasy-stone mb-4">
                            <Clock className="mr-2 text-fantasy-gold" size={16} />
                            <span>Status: {table.status}</span>
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <Link 
                            to={`/table/${table.id}`} 
                            className="fantasy-button secondary flex-1 text-center"
                          >
                            <Eye size={16} className="mr-2" />
                            Detalhes
                          </Link>
                          <Link 
                            to={`/table/player/${table.id}`}
                            className="fantasy-button primary flex-1 text-center"
                          >
                            <Eye size={16} className="mr-2" />
                            Ver Mesa
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center fantasy-card p-8">
                      <h3 className="text-xl text-fantasy-stone mb-2">
                        Você ainda não participa de nenhuma mesa
                      </h3>
                      <p className="text-fantasy-stone/70 mb-4">
                        Explore as mesas disponíveis e solicite participação
                      </p>
                      <Button 
                        onClick={() => document.querySelector('button[value="discover"]')?.click()} 
                        className="fantasy-button secondary"
                      >
                        Descobrir Mesas
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {joinRequests.length > 0 && (
                <TabsContent value="requests">
                  <div className="fantasy-card p-6">
                    <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-4">
                      Solicitações de Participação
                    </h2>
                    
                    <div className="space-y-4">
                      {joinRequests.map(request => (
                        <div 
                          key={request.id}
                          className="p-4 border border-fantasy-gold/20 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div>
                            <p className="text-fantasy-stone font-medium">
                              {request.profiles?.display_name || 'Usuário'} 
                            </p>
                            <p className="text-fantasy-stone/70 text-sm">
                              quer participar da mesa <span className="text-fantasy-gold">{request.tables?.name}</span>
                            </p>
                            <p className="text-fantasy-stone/50 text-xs">
                              {new Date(request.created_at).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleRequestAction(request.id, request.tables?.name, 'approve')}
                              disabled={loadingAction === request.id}
                              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded flex items-center gap-1"
                            >
                              {loadingAction === request.id ? (
                                <Spinner size="sm" />
                              ) : (
                                <>
                                  <Check size={16} />
                                  Aprovar
                                </>
                              )}
                            </Button>
                            <Button
                              onClick={() => handleRequestAction(request.id, request.tables?.name, 'reject')}
                              disabled={loadingAction === request.id}
                              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded flex items-center gap-1"
                            >
                              <X size={16} />
                              Rejeitar
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              )}
            </>
          )}
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Tables;
