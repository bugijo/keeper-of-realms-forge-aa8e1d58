import React, { useState, useEffect } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sword, 
  FileText, 
  Eye, 
  EyeOff, 
  User, 
  PauseCircle, 
  PlayCircle,
  Plus,
  Trash,
  Save
} from 'lucide-react';
import NotesTab from './NotesTab';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GameMasterPanelProps {
  sessionId: string;
  userId: string;
  isPaused: boolean;
  onTogglePause: () => Promise<void>;
}

interface NPC {
  id: string;
  name: string;
  hp: number;
  ac: number;
  attributes: Record<string, any>;
}

const GameMasterPanel: React.FC<GameMasterPanelProps> = ({
  sessionId,
  userId,
  isPaused,
  onTogglePause
}) => {
  const [activeTab, setActiveTab] = useState('fog');
  const [notes, setNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [npcs, setNPCs] = useState<NPC[]>([]);
  const [newNPC, setNewNPC] = useState<{
    name: string;
    hp: string;
    ac: string;
  }>({
    name: '',
    hp: '10',
    ac: '10'
  });
  
  useEffect(() => {
    const fetchMasterNotes = async () => {
      try {
        const { data, error } = await supabase
          .from('master_notes')
          .select('content')
          .eq('table_id', sessionId)
          .eq('user_id', userId)
          .single();
          
        if (error) {
          if (error.code === 'PGRST116') {
            await supabase
              .from('master_notes')
              .insert({
                table_id: sessionId,
                user_id: userId,
                content: ''
              });
            setNotes('');
          } else {
            console.error('Erro ao carregar notas:', error);
          }
        } else if (data) {
          setNotes(data.content);
        }
      } catch (error) {
        console.error('Erro ao carregar notas do mestre:', error);
      }
    };
    
    fetchMasterNotes();
  }, [sessionId, userId]);
  
  const saveNotes = async () => {
    setIsSavingNotes(true);
    try {
      const { error } = await supabase
        .from('master_notes')
        .upsert({
          table_id: sessionId,
          user_id: userId,
          content: notes,
          last_updated: new Date().toISOString()
        });
        
      if (error) {
        toast.error('Erro ao salvar notas');
        console.error('Erro ao salvar notas:', error);
      } else {
        toast.success('Notas salvas com sucesso');
      }
    } catch (error) {
      console.error('Erro ao salvar notas:', error);
      toast.error('Erro ao salvar notas');
    } finally {
      setIsSavingNotes(false);
    }
  };
  
  const handleAddNPC = () => {
    if (!newNPC.name) {
      toast.error('Nome do NPC é obrigatório');
      return;
    }
    
    const npc: NPC = {
      id: `npc-${Date.now()}`,
      name: newNPC.name,
      hp: parseInt(newNPC.hp) || 10,
      ac: parseInt(newNPC.ac) || 10,
      attributes: {}
    };
    
    setNPCs([...npcs, npc]);
    
    const addNPCToken = async (npc: NPC) => {
      try {
        const tokenData = {
          session_id: sessionId,
          name: npc.name,
          token_type: 'npc',
          x: 5,
          y: 5,
          color: '#FF9900',
          size: 1
        };
        
        const { error } = await supabase
          .from('session_tokens')
          .insert(tokenData as any);
          
        if (error) {
          console.error('Erro ao adicionar token para NPC:', error);
        }
      } catch (error) {
        console.error('Erro ao adicionar token para NPC:', error);
      }
    };
    
    addNPCToken(npc);
    
    setNewNPC({
      name: '',
      hp: '10',
      ac: '10'
    });
    
    toast.success(`NPC ${npc.name} adicionado`);
  };
  
  const handleRemoveNPC = async (id: string) => {
    const npcToRemove = npcs.find(npc => npc.id === id);
    if (!npcToRemove) return;
    
    setNPCs(npcs.filter(npc => npc.id !== id));
    
    const { error } = await supabase
      .from('session_tokens')
      .delete()
      .eq('session_id', sessionId)
      .eq('name', npcToRemove.name)
      .eq('token_type', 'npc');
      
    if (error) {
      console.error('Erro ao remover token do NPC:', error);
    }
    
    toast.success(`NPC ${npcToRemove.name} removido`);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          className="fantasy-button secondary"
          size="sm"
        >
          <Sword size={16} className="mr-1" />
          Painel do Mestre
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] bg-fantasy-dark border-l border-fantasy-purple/30">
        <SheetHeader>
          <SheetTitle className="font-medievalsharp text-fantasy-gold">Painel do Mestre</SheetTitle>
        </SheetHeader>
        
        <div className="flex justify-center mt-4">
          <Button 
            onClick={onTogglePause}
            variant={isPaused ? "default" : "destructive"}
            className="fantasy-button"
          >
            {isPaused ? (
              <>
                <PlayCircle size={16} className="mr-1" />
                Retomar Sessão
              </>
            ) : (
              <>
                <PauseCircle size={16} className="mr-1" />
                Pausar Sessão
              </>
            )}
          </Button>
        </div>
        
        <Tabs defaultValue="fog" className="mt-6" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="fog" className="text-xs">
              <Eye size={14} className="mr-1" />
              Visão do Mapa
            </TabsTrigger>
            <TabsTrigger value="npcs" className="text-xs">
              <User size={14} className="mr-1" />
              Controle de NPCs
            </TabsTrigger>
            <TabsTrigger value="notes" className="text-xs">
              <FileText size={14} className="mr-1" />
              Notas Privadas
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="fog">
            <div className="fantasy-card p-3">
              <h3 className="text-fantasy-purple font-medievalsharp mb-2">
                Controle de Visibilidade
              </h3>
              <p className="text-fantasy-stone text-sm mb-4">
                Gerencie áreas visíveis aos jogadores no mapa tático
              </p>
              
              <div className="flex flex-col gap-3">
                <Button variant="outline" className="w-full">
                  <EyeOff size={16} className="mr-2" />
                  Esconder Toda Área
                </Button>
                <Button variant="outline" className="w-full">
                  <Eye size={16} className="mr-2" />
                  Mostrar Toda Área
                </Button>
              </div>
              
              <div className="mt-4 text-fantasy-stone">
                <p className="text-sm mb-2">Como usar:</p>
                <ul className="list-disc pl-5 text-xs space-y-1 text-fantasy-stone/80">
                  <li>Clique em áreas no mapa para revelar/esconder</li>
                  <li>Use a ferramenta "Pincel" para revelar áreas maiores</li>
                  <li>Os jogadores só veem áreas que você revelar</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="npcs">
            <div className="fantasy-card p-3">
              <h3 className="text-fantasy-purple font-medievalsharp mb-2">
                NPCs & Inimigos
              </h3>
              
              <div className="mb-4 border-b border-fantasy-purple/30 pb-3">
                <h4 className="text-sm font-bold text-fantasy-gold mb-2">Adicionar NPC</h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Nome do NPC"
                    className="w-full bg-fantasy-dark/50 rounded px-3 py-2 text-white"
                    value={newNPC.name}
                    onChange={(e) => setNewNPC({...newNPC, name: e.target.value})}
                  />
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs text-fantasy-stone mb-1">HP</label>
                      <input
                        type="number"
                        className="w-full bg-fantasy-dark/50 rounded px-3 py-2 text-white"
                        value={newNPC.hp}
                        onChange={(e) => setNewNPC({...newNPC, hp: e.target.value})}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-fantasy-stone mb-1">CA</label>
                      <input
                        type="number"
                        className="w-full bg-fantasy-dark/50 rounded px-3 py-2 text-white"
                        value={newNPC.ac}
                        onChange={(e) => setNewNPC({...newNPC, ac: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleAddNPC}
                    className="w-full"
                  >
                    <Plus size={16} className="mr-1" />
                    Adicionar NPC
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <h4 className="text-sm font-bold text-fantasy-gold mb-2">NPCs Ativos ({npcs.length})</h4>
                {npcs.length === 0 ? (
                  <p className="text-fantasy-stone/70 text-xs italic text-center">
                    Nenhum NPC adicionado
                  </p>
                ) : (
                  npcs.map((npc) => (
                    <div key={npc.id} className="flex items-center justify-between bg-fantasy-dark/30 rounded p-2">
                      <div>
                        <p className="text-white">{npc.name}</p>
                        <p className="text-xs text-fantasy-stone">HP: {npc.hp} | CA: {npc.ac}</p>
                      </div>
                      <Button 
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveNPC(npc.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash size={14} className="text-red-500" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notes">
            <NotesTab
              notes={notes}
              setNotes={setNotes}
            />
            <div className="mt-4 flex justify-end">
              <Button 
                onClick={saveNotes}
                disabled={isSavingNotes}
                className="fantasy-button"
              >
                <Save size={16} className="mr-1" />
                {isSavingNotes ? 'Salvando...' : 'Salvar Notas'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default GameMasterPanel;
