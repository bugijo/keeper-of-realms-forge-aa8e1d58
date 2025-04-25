
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DicePanelProps {
  sessionId: string;
  userId: string;
  isPaused?: boolean;
  isGameMaster?: boolean;
}

interface DiceRoll {
  id: string;
  user_id: string;
  session_id: string;
  dice_type: string;
  result: number;
  created_at: string;
  user_name?: string;
  character_name?: string;
}

const DicePanel: React.FC<DicePanelProps> = ({ sessionId, userId, isPaused = false, isGameMaster = false }) => {
  const [diceRolls, setDiceRolls] = useState<DiceRoll[]>([]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('Jogador');

  useEffect(() => {
    const fetchRolls = async () => {
      try {
        // Buscar o nome do usuário
        const { data: profileData } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', userId)
          .single();
          
        if (profileData?.display_name) {
          setUserName(profileData.display_name);
        }
        
        // Buscar rolagens de dados da sessão
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('table_id', sessionId)
          .eq('type', 'dice')
          .order('created_at', { ascending: false })
          .limit(50);
          
        if (error) throw error;
        
        // Converter para o formato esperado
        const formattedRolls: DiceRoll[] = data ? data.map(message => {
          const metadata = message.metadata || {};
          return {
            id: message.id,
            user_id: message.user_id,
            session_id: message.table_id,
            dice_type: metadata.dice_type || 'd20',
            result: metadata.result || 0,
            created_at: message.created_at,
            user_name: metadata.user_name || 'Jogador',
            character_name: metadata.character_name
          };
        }) : [];
        
        setDiceRolls(formattedRolls);
      } catch (err) {
        console.error("Erro ao buscar rolagens de dados:", err);
      }
    };
    
    fetchRolls();
    
    // Configurar assinatura para novas rolagens
    const channel = supabase
      .channel('dice-rolls')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `table_id=eq.${sessionId} AND type=eq.dice`
        },
        (payload) => {
          const message = payload.new;
          const metadata = message.metadata || {};
          
          const newRoll: DiceRoll = {
            id: message.id,
            user_id: message.user_id,
            session_id: message.table_id,
            dice_type: metadata.dice_type || 'd20',
            result: metadata.result || 0,
            created_at: message.created_at,
            user_name: metadata.user_name || 'Jogador',
            character_name: metadata.character_name
          };
          
          setDiceRolls(prev => [newRoll, ...prev]);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, userId]);

  const rollDice = async (diceType: string) => {
    if (isPaused && !isGameMaster) {
      toast.error("A sessão está pausada. Aguarde o mestre retomá-la.");
      return;
    }
    
    setLoading(true);
    
    try {
      const sides = parseInt(diceType.replace('d', ''));
      const result = Math.floor(Math.random() * sides) + 1;
      
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          table_id: sessionId,
          user_id: userId,
          type: 'dice',
          content: `Rolou ${diceType} e obteve ${result}`,
          metadata: {
            dice_type: diceType,
            result: result,
            user_name: userName
          }
        });
        
      if (error) throw error;
    } catch (err) {
      console.error("Erro ao rolar dados:", err);
      toast.error("Erro ao rolar os dados");
    } finally {
      setLoading(false);
    }
  };

  const getDiceIcon = (diceType: string, result: number) => {
    if (diceType === 'd6') {
      switch (result) {
        case 1: return <Dice1 className="text-fantasy-gold" size={20} />;
        case 2: return <Dice2 className="text-fantasy-gold" size={20} />;
        case 3: return <Dice3 className="text-fantasy-gold" size={20} />;
        case 4: return <Dice4 className="text-fantasy-gold" size={20} />;
        case 5: return <Dice5 className="text-fantasy-gold" size={20} />;
        case 6: return <Dice6 className="text-fantasy-gold" size={20} />;
        default: return null;
      }
    }
    return null;
  };

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit'
      });
    } catch (e) {
      return '--:--';
    }
  };

  return (
    <div className="bg-fantasy-dark border-r border-fantasy-purple/30 w-72">
      <div className="p-3 border-b border-fantasy-purple/30">
        <h2 className="text-xl font-medievalsharp text-fantasy-gold">Dados</h2>
      </div>
      
      <div className="p-3 flex flex-wrap gap-2 border-b border-fantasy-purple/30">
        {['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'].map(diceType => (
          <Button 
            key={diceType}
            onClick={() => rollDice(diceType)}
            disabled={loading || (isPaused && !isGameMaster)}
            className="h-10 w-12 bg-fantasy-purple/20 hover:bg-fantasy-purple/40 text-white"
            title={`Rolar ${diceType}`}
          >
            {diceType}
          </Button>
        ))}
      </div>
      
      <ScrollArea className="h-[calc(100%-112px)]">
        <div className="p-3">
          <h3 className="text-sm font-medievalsharp text-fantasy-stone mb-2">Resultados</h3>
          
          <div className="space-y-2">
            {diceRolls.map(roll => (
              <div 
                key={roll.id}
                className={`p-2 rounded-md bg-fantasy-dark/40 border border-fantasy-purple/10 flex items-center gap-2`}
              >
                {getDiceIcon(roll.dice_type, roll.result) || (
                  <div className="w-6 h-6 rounded-full bg-fantasy-purple/20 flex items-center justify-center text-xs">
                    {roll.dice_type}
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-xs text-fantasy-stone">
                    <span className="font-semibold">{roll.user_name}</span>
                    {roll.character_name && ` (${roll.character_name})`} rolou
                  </p>
                  <p className="text-sm font-bold text-white">
                    {roll.result} <span className="text-xs text-fantasy-stone/70">({roll.dice_type})</span>
                  </p>
                </div>
                <span className="text-xs text-fantasy-stone/60">
                  {formatTime(roll.created_at)}
                </span>
              </div>
            ))}
            
            {diceRolls.length === 0 && (
              <p className="text-center text-fantasy-stone/60 py-4 text-sm">
                Nenhuma rolagem de dados ainda
              </p>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default DicePanel;
