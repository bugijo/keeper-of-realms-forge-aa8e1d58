
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import CombatTracker from '@/components/game/CombatTracker';
import { CombatTrackerGrid } from '@/components/game/CombatTrackerGrid';
import AudioPlayer from '@/components/audio/AudioPlayer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sword, Shield, Crosshair, Map, Music, 
  User, Users, ZoomIn, ZoomOut, Grid
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Token {
  id: string;
  x: number;
  y: number;
  color: string;
  name: string;
  size: number;
  type: 'player' | 'enemy' | 'object';
}

const CombatSystem = () => {
  const [tokens, setTokens] = useState<Token[]>([
    { 
      id: 'player-1', 
      x: 5, 
      y: 5, 
      color: '#3b82f6', 
      name: 'Jogador 1', 
      size: 1, 
      type: 'player' 
    },
    { 
      id: 'enemy-1', 
      x: 8, 
      y: 8, 
      color: '#ef4444', 
      name: 'Inimigo 1', 
      size: 1, 
      type: 'enemy' 
    }
  ]);
  
  const [fogOfWar, setFogOfWar] = useState<boolean[][]>([]);
  const [showFog, setShowFog] = useState(true);
  const [gridSize, setGridSize] = useState(40);
  
  // Handle zoom in/out
  const handleZoomIn = () => {
    setGridSize(prev => Math.min(prev + 10, 80));
  };
  
  const handleZoomOut = () => {
    setGridSize(prev => Math.max(prev - 10, 20));
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-medievalsharp text-fantasy-gold">Sistema de Combate</h1>
          
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={() => setShowFog(!showFog)}
            >
              <Grid size={16} />
              {showFog ? 'Ocultar Névoa' : 'Mostrar Névoa'}
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={handleZoomIn}
            >
              <ZoomIn size={16} />
              Aumentar Zoom
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={handleZoomOut}
            >
              <ZoomOut size={16} />
              Diminuir Zoom
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs defaultValue="map" className="w-full">
              <TabsList className="bg-fantasy-dark/70 border border-fantasy-purple/30 w-full grid grid-cols-3 h-auto">
                <TabsTrigger 
                  value="map" 
                  className="data-[state=active]:bg-fantasy-purple/20 py-2"
                >
                  <Map size={16} className="mr-2" />
                  Mapa Tático
                </TabsTrigger>
                <TabsTrigger 
                  value="initiative" 
                  className="data-[state=active]:bg-fantasy-purple/20 py-2"
                >
                  <Sword size={16} className="mr-2" />
                  Iniciativa
                </TabsTrigger>
                <TabsTrigger 
                  value="audio" 
                  className="data-[state=active]:bg-fantasy-purple/20 py-2"
                >
                  <Music size={16} className="mr-2" />
                  Áudio
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="map" className="mt-4">
                <CombatTrackerGrid 
                  gridSize={gridSize}
                  width={20}
                  height={15}
                  tokens={tokens}
                  onTokensChange={setTokens}
                  fogOfWar={showFog}
                  onFogOfWarChange={setFogOfWar}
                  isDungeonMaster={true}
                />
              </TabsContent>
              
              <TabsContent value="initiative" className="mt-4">
                <CombatTracker />
              </TabsContent>
              
              <TabsContent value="audio" className="mt-4">
                <AudioPlayer 
                  showPlaylist={true}
                  gameEvent="combat_start"
                />
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Tabs defaultValue="players" className="w-full">
              <TabsList className="bg-fantasy-dark/70 border border-fantasy-purple/30 w-full grid grid-cols-2 h-auto">
                <TabsTrigger 
                  value="players" 
                  className="data-[state=active]:bg-fantasy-purple/20 py-2"
                >
                  <User size={16} className="mr-2" />
                  Jogadores
                </TabsTrigger>
                <TabsTrigger 
                  value="enemies" 
                  className="data-[state=active]:bg-fantasy-purple/20 py-2"
                >
                  <Users size={16} className="mr-2" />
                  Inimigos
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="players" className="mt-4">
                <div className="fantasy-card p-4">
                  <h3 className="text-xl font-medievalsharp text-fantasy-gold mb-4">Jogadores</h3>
                  
                  <div className="space-y-3">
                    <div className="p-3 rounded-md border border-fantasy-purple/30 bg-fantasy-dark/50">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <User size={20} className="text-blue-400" />
                        </div>
                        <div>
                          <div className="font-medium">Jogador 1</div>
                          <div className="text-xs text-fantasy-stone">Guerreiro Humano Nv.5</div>
                        </div>
                      </div>
                      
                      <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                        <div className="p-1 bg-fantasy-dark/50 rounded">
                          <div className="text-xs text-fantasy-stone">HP</div>
                          <div className="text-sm font-medium">45/45</div>
                        </div>
                        <div className="p-1 bg-fantasy-dark/50 rounded">
                          <div className="text-xs text-fantasy-stone">CA</div>
                          <div className="text-sm font-medium">18</div>
                        </div>
                        <div className="p-1 bg-fantasy-dark/50 rounded">
                          <div className="text-xs text-fantasy-stone">Init</div>
                          <div className="text-sm font-medium">+2</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-md border border-fantasy-purple/30 bg-fantasy-dark/50">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <User size={20} className="text-blue-400" />
                        </div>
                        <div>
                          <div className="font-medium">Jogador 2</div>
                          <div className="text-xs text-fantasy-stone">Mago Elfo Nv.5</div>
                        </div>
                      </div>
                      
                      <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                        <div className="p-1 bg-fantasy-dark/50 rounded">
                          <div className="text-xs text-fantasy-stone">HP</div>
                          <div className="text-sm font-medium">28/28</div>
                        </div>
                        <div className="p-1 bg-fantasy-dark/50 rounded">
                          <div className="text-xs text-fantasy-stone">CA</div>
                          <div className="text-sm font-medium">13</div>
                        </div>
                        <div className="p-1 bg-fantasy-dark/50 rounded">
                          <div className="text-xs text-fantasy-stone">Init</div>
                          <div className="text-sm font-medium">+3</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="enemies" className="mt-4">
                <div className="fantasy-card p-4">
                  <h3 className="text-xl font-medievalsharp text-fantasy-gold mb-4">Inimigos</h3>
                  
                  <div className="space-y-3">
                    <div className="p-3 rounded-md border border-fantasy-purple/30 bg-fantasy-dark/50">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center">
                          <Shield size={20} className="text-red-400" />
                        </div>
                        <div>
                          <div className="font-medium">Goblin</div>
                          <div className="text-xs text-fantasy-stone">Humanóide Pequeno</div>
                        </div>
                      </div>
                      
                      <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                        <div className="p-1 bg-fantasy-dark/50 rounded">
                          <div className="text-xs text-fantasy-stone">HP</div>
                          <div className="text-sm font-medium">7/7</div>
                        </div>
                        <div className="p-1 bg-fantasy-dark/50 rounded">
                          <div className="text-xs text-fantasy-stone">CA</div>
                          <div className="text-sm font-medium">15</div>
                        </div>
                        <div className="p-1 bg-fantasy-dark/50 rounded">
                          <div className="text-xs text-fantasy-stone">Vel</div>
                          <div className="text-sm font-medium">30ft</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-md border border-fantasy-purple/30 bg-fantasy-dark/50">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center">
                          <Shield size={20} className="text-red-400" />
                        </div>
                        <div>
                          <div className="font-medium">Bugbear</div>
                          <div className="text-xs text-fantasy-stone">Humanóide Médio</div>
                        </div>
                      </div>
                      
                      <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                        <div className="p-1 bg-fantasy-dark/50 rounded">
                          <div className="text-xs text-fantasy-stone">HP</div>
                          <div className="text-sm font-medium">27/27</div>
                        </div>
                        <div className="p-1 bg-fantasy-dark/50 rounded">
                          <div className="text-xs text-fantasy-stone">CA</div>
                          <div className="text-sm font-medium">16</div>
                        </div>
                        <div className="p-1 bg-fantasy-dark/50 rounded">
                          <div className="text-xs text-fantasy-stone">Vel</div>
                          <div className="text-sm font-medium">30ft</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-4">
              <AudioPlayer 
                compact={true}
                showPlaylist={false}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CombatSystem;
