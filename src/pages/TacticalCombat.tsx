
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import CombatTracker from '@/components/game/CombatTracker';
import TacticalMapWithFog from '@/components/game/TacticalMapWithFog';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, MapPin, Sword, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PersistentAudioPlayer from '@/components/audio/PersistentAudioPlayer';

interface Token {
  id: string;
  x: number;
  y: number;
  type: 'player' | 'enemy' | 'npc';
  label: string;
  image?: string;
  color: string;
}

const TacticalCombat = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('combat');
  const [mapImage, setMapImage] = useState('/placeholder.svg');
  const [tokens, setTokens] = useState<Token[]>([
    { id: '1', x: 5, y: 5, type: 'player', label: 'Jogador 1', color: '#3b82f6' },
    { id: '2', x: 7, y: 5, type: 'player', label: 'Jogador 2', color: '#3b82f6' },
    { id: '3', x: 9, y: 5, type: 'player', label: 'Jogador 3', color: '#3b82f6' },
    { id: '4', x: 10, y: 8, type: 'enemy', label: 'Goblin', color: '#ef4444' },
    { id: '5', x: 12, y: 8, type: 'enemy', label: 'Orc', color: '#ef4444' },
    { id: '6', x: 8, y: 10, type: 'npc', label: 'Comerciante', color: '#10b981' },
  ]);

  const handleTokenMove = (id: string, x: number, y: number) => {
    setTokens(prevTokens => 
      prevTokens.map(token => 
        token.id === id ? { ...token, x, y } : token
      )
    );
    
    // Measure distance for selected token
    const token = tokens.find(t => t.id === id);
    if (token) {
      toast({
        title: `${token.label} movido`,
        description: `Posição atual: (${x}, ${y})`,
      });
    }
  };

  const calculateDistance = (x1: number, y1: number, x2: number, y2: number): number => {
    // Using grid distance (1 square = 5ft)
    const gridDistance = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
    const ftDistance = gridDistance * 5; // 1 grid = 5ft
    return ftDistance;
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-medievalsharp text-fantasy-gold">Sistema de Combate</h1>
            <p className="text-fantasy-stone">Gerencie combates e controle o mapa tático</p>
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fantasy-stone" size={18} />
              <Input
                type="text"
                placeholder="Buscar regras..."
                className="pl-10 bg-fantasy-dark/50 border-fantasy-purple/30 w-64"
              />
            </div>
            
            <Button variant="outline" className="fantasy-button primary">
              <MapPin size={16} className="mr-1" /> Salvar Estado
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-fantasy-dark/70 border border-fantasy-purple/30 w-full">
                <TabsTrigger value="combat" className="data-[state=active]:bg-fantasy-purple/20">
                  <Sword size={16} className="mr-2" />
                  Combate
                </TabsTrigger>
                <TabsTrigger value="players" className="data-[state=active]:bg-fantasy-purple/20">
                  <Shield size={16} className="mr-2" />
                  Jogadores
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="combat" className="mt-4">
                <CombatTracker />
              </TabsContent>
              
              <TabsContent value="players" className="mt-4">
                <div className="fantasy-card p-4">
                  <h2 className="text-xl font-medievalsharp text-fantasy-gold mb-4">Status dos Jogadores</h2>
                  
                  <div className="space-y-3">
                    {tokens.filter(token => token.type === 'player').map(player => (
                      <div key={player.id} className="p-3 rounded-md border border-fantasy-purple/30 bg-fantasy-dark/20">
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-8 w-8 rounded-full flex items-center justify-center bg-blue-500/20"
                            style={{ backgroundColor: player.color + '33' }}
                          >
                            {player.image ? (
                              <img src={player.image} alt={player.label} className="w-full h-full rounded-full" />
                            ) : (
                              <span className="text-white text-xs font-bold">{player.label.substring(0, 2)}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{player.label}</div>
                            <div className="text-xs text-fantasy-stone">
                              Posição: ({player.x}, {player.y})
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-4">
              <PersistentAudioPlayer />
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <TacticalMapWithFog
              mapImage={mapImage}
              gridSize={20}
              cellSize={30}
              tokens={tokens}
              onTokenMove={handleTokenMove}
            />
            
            <div className="mt-4 text-sm">
              <div className="fantasy-card p-3">
                <h3 className="text-fantasy-gold font-medievalsharp mb-2">Medição de Distância</h3>
                <div className="text-fantasy-stone text-sm">
                  <p>• 1 quadrado = 5 pés (aproximadamente 1,5 metros)</p>
                  <p>• Alcance de magia Cone de Fogo: 20 pés (4 quadrados)</p>
                  <p>• Alcance de movimento típico: 30 pés (6 quadrados)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TacticalCombat;
