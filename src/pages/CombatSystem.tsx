
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Crosshair, Shield, UsersRound, Dice, 
  Music, EyeOff, Volume2, Crown
} from 'lucide-react';
import TacticalMap, { MapToken } from '@/components/game/TacticalMap';
import CombatTracker from '@/components/game/CombatTracker';
import PersistentAudioPlayer from '@/components/audio/PersistentAudioPlayer';
import { usePersistentAudio } from '@/hooks/usePersistentAudio';
import { toast } from 'sonner';

// Sample data for testing
const sampleTokens: MapToken[] = [
  {
    id: 'player1',
    x: 3,
    y: 3,
    type: 'player',
    name: 'Aragorn',
    size: 'medium',
    color: '#34D399',
  },
  {
    id: 'player2',
    x: 4,
    y: 2,
    type: 'player',
    name: 'Legolas',
    size: 'medium',
    color: '#60A5FA',
  },
  {
    id: 'monster1',
    x: 7,
    y: 5,
    type: 'monster',
    name: 'Orc',
    size: 'medium',
    color: '#F87171',
  },
  {
    id: 'monster2',
    x: 8,
    y: 6,
    type: 'monster',
    name: 'Troll',
    size: 'large',
    color: '#F87171',
  }
];

const sampleCombatants = [
  {
    id: 'player1',
    name: 'Aragorn',
    initiative: 18,
    hp: { current: 45, max: 50 },
    ac: 17,
    type: 'player',
  },
  {
    id: 'player2',
    name: 'Legolas',
    initiative: 20,
    hp: { current: 32, max: 40 },
    ac: 15,
    type: 'player',
  },
  {
    id: 'monster1',
    name: 'Orc',
    initiative: 12,
    hp: { current: 15, max: 15 },
    ac: 13,
    type: 'monster',
  },
  {
    id: 'monster2',
    name: 'Troll',
    initiative: 8,
    hp: { current: 84, max: 84 },
    ac: 16,
    type: 'monster',
  }
];

const CombatSystem: React.FC = () => {
  const [isDM, setIsDM] = useState(true);
  const [tokens, setTokens] = useState<MapToken[]>(sampleTokens);
  const [combatants, setCombatants] = useState(sampleCombatants);
  const [combatActive, setCombatActive] = useState(false);
  const { syncWithGameEvent } = usePersistentAudio();
  
  const handleTokenMove = (token: MapToken) => {
    // Update token position locally
    setTokens(prev => 
      prev.map(t => t.id === token.id ? token : t)
    );
    
    // In a real app, this would sync with the server
    toast.success(`${token.name} moved to position (${token.x}, ${token.y})`);
  };
  
  const toggleCombat = () => {
    const newState = !combatActive;
    setCombatActive(newState);
    
    // Sync audio with combat state
    syncWithGameEvent(newState ? 'combat-start' : 'combat-end');
    
    toast.success(newState 
      ? '⚔️ Combate iniciado! Rolando iniciativa...' 
      : '🛡️ Combate finalizado!'
    );
  };
  
  const handleDamageCombatant = (id: string, damage: number) => {
    setCombatants(prev => 
      prev.map(c => {
        if (c.id === id) {
          const newHp = Math.max(0, c.hp.current - damage);
          
          // Check if combatant is defeated
          if (newHp === 0 && c.hp.current > 0) {
            toast.error(`${c.name} foi derrotado!`);
          }
          
          return {
            ...c,
            hp: {
              ...c.hp,
              current: newHp
            }
          };
        }
        return c;
      })
    );
  };
  
  const handleHealCombatant = (id: string, healing: number) => {
    setCombatants(prev => 
      prev.map(c => {
        if (c.id === id) {
          return {
            ...c,
            hp: {
              ...c.hp,
              current: Math.min(c.hp.max, c.hp.current + healing)
            }
          };
        }
        return c;
      })
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-medievalsharp text-fantasy-gold">Sistema de Combate</h1>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsDM(!isDM)}
              className={isDM ? "bg-fantasy-purple/20" : ""}
            >
              <Crown size={16} className="mr-2" />
              Modo {isDM ? "Mestre" : "Jogador"}
            </Button>
            
            <Button
              variant={combatActive ? "destructive" : "default"}
              size="sm"
              onClick={toggleCombat}
            >
              {combatActive 
                ? <Shield size={16} className="mr-2" /> 
                : <Crosshair size={16} className="mr-2" />
              }
              {combatActive ? "Finalizar Combate" : "Iniciar Combate"}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left column - combat tracker */}
          <div className="lg:col-span-1">
            <div className="fantasy-card mb-4">
              <h2 className="text-lg font-medievalsharp text-fantasy-gold flex items-center">
                <UsersRound size={18} className="mr-2" />
                Iniciativa
              </h2>
              
              <CombatTracker 
                combatants={combatants}
                onDamage={handleDamageCombatant}
                onHeal={handleHealCombatant}
                isActive={combatActive}
                isDM={isDM}
              />
            </div>
            
            <div className="fantasy-card">
              <h2 className="text-lg font-medievalsharp text-fantasy-gold flex items-center mb-2">
                <Music size={18} className="mr-2" />
                Áudio
              </h2>
              
              <PersistentAudioPlayer />
            </div>
          </div>
          
          {/* Right column - tactical map */}
          <div className="lg:col-span-3">
            <div className="fantasy-card relative overflow-hidden">
              <h2 className="text-lg font-medievalsharp text-fantasy-gold flex items-center mb-2">
                <Crosshair size={18} className="mr-2" />
                Mapa Tático
              </h2>
              
              <div className="flex flex-col items-center justify-center overflow-auto">
                <TacticalMap 
                  initialTokens={tokens}
                  isDMView={isDM}
                  onTokenMove={handleTokenMove}
                />
              </div>
              
              {isDM && (
                <div className="absolute bottom-2 right-2 text-xs text-fantasy-stone bg-fantasy-dark/80 p-1 rounded">
                  <p>1 quadrado = 5 pés</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CombatSystem;
