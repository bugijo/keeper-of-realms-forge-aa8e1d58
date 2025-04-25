
import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Dices } from 'lucide-react';

interface DicePanelProps {
  sessionId: string;
  userId: string;
  isPaused: boolean;
  isGameMaster: boolean;
}

interface DiceRoll {
  id: string;
  user_id: string;
  session_id: string;
  roll_formula: string;
  roll_result: number;
  roll_details: {
    dice: number[];
    modifier?: number;
  };
  visible_to_all: boolean;
  created_at: string;
}

interface UserProfile {
  id: string;
  display_name?: string;
}

const DicePanel: React.FC<DicePanelProps> = ({ 
  sessionId, 
  userId,
  isPaused,
  isGameMaster
}) => {
  const [rolls, setRolls] = useState<DiceRoll[]>([]);
  const [profiles, setProfiles] = useState<Record<string, UserProfile>>({});
  
  useEffect(() => {
    const loadRolls = async () => {
      try {
        // Buscar rolagens existentes
        const { data, error } = await supabase.rpc('get_dice_rolls', {
          session_id_param: sessionId,
          user_id_param: userId
        });
        
        if (error) throw error;
        
        if (data) {
          setRolls(data as DiceRoll[]);
          
          // Extrair IDs de usuários únicos
          const userIds = [...new Set(data.map((roll: DiceRoll) => roll.user_id))];
          
          // Buscar perfis dos usuários
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, display_name')
            .in('id', userIds);
            
          if (profilesData) {
            const profileMap: Record<string, UserProfile> = {};
            profilesData.forEach((profile: UserProfile) => {
              profileMap[profile.id] = profile;
            });
            setProfiles(profileMap);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar rolagens:', error);
      }
    };
    
    loadRolls();
    
    // Configurar assinatura em tempo real para rolagens de dados
    const channel = supabase
      .channel('dice_rolls_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'dice_rolls',
          filter: `session_id=eq.${sessionId}`
        },
        async (payload) => {
          const newRoll = payload.new as DiceRoll;
          
          // Verificar se devemos mostrar esta rolagem (pública ou do próprio usuário)
          if (newRoll.visible_to_all || newRoll.user_id === userId) {
            setRolls(prev => [newRoll, ...prev].slice(0, 50)); // Manter apenas as 50 rolagens mais recentes
            
            // Buscar nome do usuário se ainda não tivermos
            if (!profiles[newRoll.user_id]) {
              const { data } = await supabase
                .from('profiles')
                .select('id, display_name')
                .eq('id', newRoll.user_id)
                .single();
                
              if (data) {
                setProfiles(prev => ({
                  ...prev,
                  [data.id]: data
                }));
              }
            }
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, userId]);
  
  const rollDice = async (formula: string) => {
    if (isPaused && !isGameMaster) {
      toast.error("A sessão está pausada. Aguarde o mestre retomá-la.");
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('dice-roll', {
        body: {
          formula,
          sessionId,
          userId,
          visibleToAll: true
        },
      });
      
      if (error) throw error;

      toast.success(`Rolou ${formula}: ${data.total}`);
    } catch (error) {
      console.error('Erro ao rolar dados:', error);
      toast.error('Erro ao rolar dados');
    }
  };
  
  const formatRollTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const getUserName = (userId: string) => {
    return profiles[userId]?.display_name || 'Jogador';
  };
  
  const diceButtons = [
    { label: 'D4', formula: 'd4' },
    { label: 'D6', formula: 'd6' },
    { label: 'D8', formula: 'd8' },
    { label: 'D10', formula: 'd10' },
    { label: 'D12', formula: 'd12' },
    { label: 'D20', formula: 'd20' },
    { label: 'D100', formula: 'd100' },
    { label: '2D6', formula: '2d6' },
    { label: '4D6', formula: '4d6' },
  ];
  
  return (
    <div className="w-80 flex flex-col h-full border-r border-fantasy-purple/30 bg-fantasy-dark/50">
      <div className="p-3 border-b border-fantasy-purple/30 bg-fantasy-dark flex items-center">
        <Dices size={18} className="text-fantasy-gold mr-2" />
        <h3 className="text-white font-medievalsharp">Rolagens de Dados</h3>
      </div>
      
      <div className="p-3 grid grid-cols-3 gap-2">
        {diceButtons.map((dice) => (
          <Button
            key={dice.formula}
            onClick={() => rollDice(dice.formula)}
            variant="outline"
            className="fantasy-button outline"
            disabled={isPaused && !isGameMaster}
          >
            {dice.label}
          </Button>
        ))}
      </div>
      
      <div className="p-3 border-t border-b border-fantasy-purple/30 flex">
        <input
          type="text"
          placeholder="Ex: 2d6+3"
          className="flex-1 bg-fantasy-dark/60 rounded-l p-2 text-white"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const formula = (e.target as HTMLInputElement).value;
              if (formula.trim()) {
                rollDice(formula);
                (e.target as HTMLInputElement).value = '';
              }
            }
          }}
          disabled={isPaused && !isGameMaster}
        />
        <Button
          onClick={() => {
            const input = document.querySelector('input[type="text"]') as HTMLInputElement;
            if (input.value.trim()) {
              rollDice(input.value);
              input.value = '';
            }
          }}
          className="rounded-l-none"
          disabled={isPaused && !isGameMaster}
        >
          Rolar
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {rolls.length === 0 ? (
            <div className="text-center text-fantasy-stone p-4">
              Nenhuma rolagem ainda. Faça a primeira!
            </div>
          ) : (
            rolls.map((roll) => (
              <div 
                key={roll.id}
                className={`rounded-lg p-2 ${
                  roll.user_id === userId
                    ? 'bg-fantasy-purple/30'
                    : 'bg-fantasy-dark/50'
                }`}
              >
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-medium text-sm text-fantasy-gold">
                    {getUserName(roll.user_id)}
                  </span>
                  <span className="text-xs text-fantasy-stone/70">
                    {formatRollTime(roll.created_at)}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-fantasy-dark rounded px-2 py-1 text-white font-mono">
                    {roll.roll_formula}
                  </div>
                  <div className="mx-2 text-fantasy-stone">=</div>
                  <div className="bg-fantasy-gold/20 rounded px-2 py-1 text-fantasy-gold font-bold">
                    {roll.roll_result}
                  </div>
                </div>
                
                {roll.roll_details.dice && (
                  <div className="mt-1 text-xs text-fantasy-stone">
                    Dados: [{roll.roll_details.dice.join(', ')}]
                    {roll.roll_details.modifier ? ` + ${roll.roll_details.modifier}` : ''}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DicePanel;
