
import React, { useState, useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Dices } from 'lucide-react';
import { toast } from 'sonner';

interface DicePanelProps {
  sessionId: string;
  userId: string;
}

interface DiceRoll {
  id: string;
  user_id: string;
  roll_formula: string;
  roll_result: number;
  roll_details: {
    dice: number[];
    modifier?: number;
  };
  created_at: string;
  visible_to_all: boolean;
}

interface DiceConfig {
  label: string;
  formula: string;
  color: string;
}

const DicePanel: React.FC<DicePanelProps> = ({ sessionId, userId }) => {
  const [rolls, setRolls] = useState<DiceRoll[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfiles, setUserProfiles] = useState<Record<string, any>>({});
  const rollsEndRef = useRef<HTMLDivElement>(null);
  
  const predefinedDice: DiceConfig[] = [
    { label: 'D4', formula: 'd4', color: 'bg-fantasy-purple/40' },
    { label: 'D6', formula: 'd6', color: 'bg-fantasy-stone/40' },
    { label: 'D8', formula: 'd8', color: 'bg-blue-600/40' },
    { label: 'D10', formula: 'd10', color: 'bg-green-600/40' },
    { label: 'D12', formula: 'd12', color: 'bg-yellow-600/40' },
    { label: 'D20', formula: 'd20', color: 'bg-red-600/40' },
    { label: 'D100', formula: 'd100', color: 'bg-indigo-600/40' }
  ];
  
  const commonRolls: DiceConfig[] = [
    { label: 'Ataque', formula: 'd20', color: 'bg-red-600/40' },
    { label: 'Dano', formula: '2d6', color: 'bg-orange-600/40' },
    { label: 'Iniciativa', formula: 'd20', color: 'bg-yellow-600/40' },
    { label: 'Perícia', formula: 'd20', color: 'bg-green-600/40' },
  ];
  
  useEffect(() => {
    const fetchRolls = async () => {
      try {
        setLoading(true);
        
        // Buscar rolagens públicas ou do próprio usuário
        const { data, error } = await supabase
          .from('dice_rolls')
          .select('*')
          .eq('session_id', sessionId)
          .or(`visible_to_all.eq.true,user_id.eq.${userId}`)
          .order('created_at', { ascending: false })
          .limit(20);
          
        if (error) throw error;
        
        // Inverte para mostrar as mais recentes primeiro
        setRolls(data?.reverse() || []);
        
        // Buscar perfis de usuários
        const userIds = [...new Set(data?.map(roll => roll.user_id) || [])];
        if (userIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, display_name')
            .in('id', userIds);
            
          const profileMap: Record<string, any> = {};
          profiles?.forEach(profile => {
            profileMap[profile.id] = profile;
          });
          
          setUserProfiles(profileMap);
        }
      } catch (error) {
        console.error('Erro ao buscar rolagens:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRolls();
    
    // Configurar assinatura em tempo real
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
          
          // Não atualizar se a rolagem não for pública e não for do usuário
          if (!newRoll.visible_to_all && newRoll.user_id !== userId) return;
          
          setRolls(prev => [...prev, newRoll]);
          
          // Buscar perfil do usuário se ainda não estiver carregado
          if (!userProfiles[newRoll.user_id]) {
            const { data } = await supabase
              .from('profiles')
              .select('id, display_name')
              .eq('id', newRoll.user_id)
              .single();
              
            if (data) {
              setUserProfiles(prev => ({
                ...prev,
                [newRoll.user_id]: data
              }));
            }
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, userId]);
  
  // Rolagem automática para a última rolagem
  useEffect(() => {
    rollsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [rolls]);
  
  const rollDice = async (formula: string, isPublic: boolean = true) => {
    try {
      // Analisar a fórmula
      const diceRegex = /(\d*)d(\d+)(?:([+-])(\d+))?/;
      const match = formula.match(diceRegex);
      
      if (!match) {
        toast.error('Fórmula de dados inválida');
        return;
      }
      
      const count = match[1] ? parseInt(match[1]) : 1;
      const sides = parseInt(match[2]);
      const hasModifier = match[3] !== undefined;
      const modifierSign = match[3] === '+' ? 1 : -1;
      const modifierValue = hasModifier ? parseInt(match[4]) : 0;
      
      // Rolar os dados
      const dice: number[] = [];
      for (let i = 0; i < count; i++) {
        dice.push(Math.floor(Math.random() * sides) + 1);
      }
      
      // Calcular o resultado
      const diceSum = dice.reduce((sum, value) => sum + value, 0);
      const result = hasModifier ? diceSum + (modifierSign * modifierValue) : diceSum;
      
      // Salvar a rolagem
      const { error } = await supabase
        .from('dice_rolls')
        .insert({
          session_id: sessionId,
          user_id: userId,
          roll_formula: formula,
          roll_result: result,
          roll_details: {
            dice,
            modifier: hasModifier ? modifierSign * modifierValue : undefined
          },
          visible_to_all: isPublic
        });
        
      if (error) throw error;
      
      // Feedback sonoro
      const audio = new Audio('/dice_sound.mp3');
      audio.play().catch(e => console.log('Erro ao reproduzir som de dados:', e));
      
    } catch (error) {
      console.error('Erro ao rolar dados:', error);
      toast.error('Erro ao rolar dados');
    }
  };
  
  const getDisplayName = (userId: string) => {
    return userProfiles[userId]?.display_name || "Jogador";
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };
  
  const renderDiceResult = (roll: DiceRoll) => {
    const { roll_details, roll_formula, roll_result } = roll;
    const { dice, modifier } = roll_details;
    
    return (
      <div>
        <div className="text-xs text-fantasy-stone flex gap-1 mb-1">
          {dice.map((value, i) => (
            <span
              key={i}
              className={`inline-block rounded px-1 ${
                value === parseInt(roll_formula.split('d')[1]) ? 'bg-green-500/30' : 'bg-fantasy-dark/50'
              }`}
            >
              {value}
            </span>
          ))}
          {modifier !== undefined && <span className="opacity-70">{modifier >= 0 ? '+' : ''}{modifier}</span>}
        </div>
        <div className="font-bold text-fantasy-gold text-lg">{roll_result}</div>
      </div>
    );
  };
  
  return (
    <div className="w-80 flex flex-col h-full border-r border-fantasy-purple/30 bg-fantasy-dark/50">
      <div className="p-3 border-b border-fantasy-purple/30 bg-fantasy-dark flex items-center">
        <Dices size={18} className="text-fantasy-gold mr-2" />
        <h3 className="text-white font-medievalsharp">Dados</h3>
      </div>
      
      <div className="p-3 border-b border-fantasy-purple/30">
        <h4 className="text-sm text-fantasy-stone mb-2">Dados Básicos</h4>
        <div className="grid grid-cols-4 gap-2">
          {predefinedDice.map(dice => (
            <Button
              key={dice.formula}
              className={`h-10 ${dice.color} hover:opacity-80 text-white font-bold`}
              onClick={() => rollDice(dice.formula)}
            >
              {dice.label}
            </Button>
          ))}
        </div>
        
        <h4 className="text-sm text-fantasy-stone mt-3 mb-2">Rolagens Comuns</h4>
        <div className="grid grid-cols-2 gap-2">
          {commonRolls.map(roll => (
            <Button
              key={roll.label}
              className={`${roll.color} hover:opacity-80 text-white`}
              onClick={() => rollDice(roll.formula)}
            >
              {roll.label}
            </Button>
          ))}
        </div>
        
        <div className="mt-3">
          <h4 className="text-sm text-fantasy-stone mb-2">Rolagem Personalizada</h4>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="2d6+3"
              className="flex-1 bg-fantasy-dark/60 rounded p-2 text-white"
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  const target = e.target as HTMLInputElement;
                  rollDice(target.value);
                  target.value = '';
                }
              }}
            />
            <Button
              variant="default"
              className="fantasy-button primary"
              onClick={() => {
                const input = document.querySelector('input') as HTMLInputElement;
                rollDice(input.value);
                input.value = '';
              }}
            >
              Rolar
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <h4 className="p-3 text-sm text-fantasy-stone">Histórico de Rolagens</h4>
        
        <ScrollArea className="h-[calc(100%-40px)]">
          <div className="p-3 space-y-3">
            {loading ? (
              <div className="text-center text-fantasy-stone p-4">
                Carregando rolagens...
              </div>
            ) : rolls.length === 0 ? (
              <div className="text-center text-fantasy-stone p-4">
                Nenhuma rolagem ainda.
              </div>
            ) : (
              rolls.map((roll) => (
                <div
                  key={roll.id}
                  className="bg-fantasy-dark/40 rounded-lg p-2"
                >
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-medium text-sm">
                      {getDisplayName(roll.user_id)}
                    </span>
                    <span className="text-xs text-fantasy-stone/70">
                      {formatTime(roll.created_at)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-fantasy-stone text-sm">
                      {roll.roll_formula}
                    </span>
                    {renderDiceResult(roll)}
                  </div>
                </div>
              ))
            )}
            <div ref={rollsEndRef} />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default DicePanel;
