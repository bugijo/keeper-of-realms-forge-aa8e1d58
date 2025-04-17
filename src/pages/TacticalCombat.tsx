import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { TacticalMapWithFog } from '@/components/game/TacticalMapWithFog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Plus, Download, Upload, Eye, EyeOff } from 'lucide-react';

// Define the Token interface that includes all necessary properties
interface Token {
  id: string;
  x: number;
  y: number;
  color: string;
  label: string;
  size: number; // Add size property to match TokenProps
  type: 'player' | 'monster' | 'npc';
}

const TacticalCombat = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [mapImage, setMapImage] = useState<string | null>(null);
  const [gridSize, setGridSize] = useState(50);
  const [fogOfWarEnabled, setFogOfWarEnabled] = useState(true);
  const [newLabel, setNewLabel] = useState('');
  const [newColor, setNewColor] = useState('#FF0000');
  const [newType, setNewType] = useState<'player' | 'monster' | 'npc'>('player');
  const [newSize, setNewSize] = useState(32);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load initial tokens or map from localStorage if needed
  }, []);

  const handleAddToken = () => {
    const newToken: Token = {
      id: Date.now().toString(),
      x: 50,
      y: 50,
      color: newColor,
      label: newLabel,
      size: newSize,
      type: newType,
    };
    setTokens([...tokens, newToken]);
    setNewLabel('');
  };

  const handleRemoveToken = (id: string) => {
    setTokens(tokens.filter(token => token.id !== id));
  };

  const handleTokenChange = (id: string, x: number, y: number) => {
    setTokens(tokens.map(token =>
      token.id === id ? { ...token, x, y } : token
    ));
  };

  const handleMapUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMapImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMapDownload = () => {
    // Implement map download logic
  };

  const handleMapClear = () => {
    setMapImage(null);
    setTokens([]);
  };

  const handleFogOfWarToggle = () => {
    setFogOfWarEnabled(!fogOfWarEnabled);
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-white mb-4">Tactical Combat</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <TacticalMapWithFog
              tokens={tokens}
              mapImage={mapImage}
              gridSize={gridSize}
              fogOfWarEnabled={fogOfWarEnabled}
              onTokenChange={handleTokenChange}
            />
          </div>

          <div>
            <Tabs defaultValue="tokens" className="w-full">
              <TabsList>
                <TabsTrigger value="tokens">Tokens</TabsTrigger>
                <TabsTrigger value="map">Map</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="tokens">
                <div className="bg-gray-800 rounded-md p-4">
                  <h2 className="text-lg font-bold text-white mb-2">Add Token</h2>
                  <div className="mb-2">
                    <Label htmlFor="label" className="text-gray-300">Label</Label>
                    <Input
                      type="text"
                      id="label"
                      className="bg-gray-700 text-white"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                    />
                  </div>
                  <div className="mb-2">
                    <Label htmlFor="color" className="text-gray-300">Color</Label>
                    <Input
                      type="color"
                      id="color"
                      className="bg-gray-700"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                    />
                  </div>
                  <div className="mb-2">
                    <Label htmlFor="size" className="text-gray-300">Size</Label>
                    <Input
                      type="number"
                      id="size"
                      className="bg-gray-700 text-white"
                      value={newSize}
                      onChange={(e) => setNewSize(parseInt(e.target.value))}
                    />
                  </div>
                  <div className="mb-2">
                    <Label htmlFor="type" className="text-gray-300">Type</Label>
                    <select
                      id="type"
                      className="bg-gray-700 text-white rounded-md p-1"
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as 'player' | 'monster' | 'npc')}
                    >
                      <option value="player">Player</option>
                      <option value="monster">Monster</option>
                      <option value="npc">NPC</option>
                    </select>
                  </div>
                  <Button onClick={handleAddToken} className="bg-green-500 hover:bg-green-700 text-white">
                    Add Token
                  </Button>
                </div>

                <div className="mt-4 bg-gray-800 rounded-md p-4">
                  <h2 className="text-lg font-bold text-white mb-2">Token List</h2>
                  <ul>
                    {tokens.map(token => (
                      <li key={token.id} className="flex items-center justify-between text-white py-1">
                        <span>{token.label} ({token.type})</span>
                        <Button
                          onClick={() => handleRemoveToken(token.id)}
                          variant="destructive"
                          size="icon"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="map">
                <div className="bg-gray-800 rounded-md p-4">
                  <h2 className="text-lg font-bold text-white mb-2">Map Options</h2>
                  <div className="mb-2">
                    <Label htmlFor="upload" className="text-gray-300">Upload Map</Label>
                    <Input
                      type="file"
                      id="upload"
                      className="bg-gray-700 text-white"
                      onChange={handleMapUpload}
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                    />
                    <Button onClick={() => fileInputRef.current?.click()} className="bg-blue-500 hover:bg-blue-700 text-white">
                      Upload
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleMapDownload} className="bg-blue-500 hover:bg-blue-700 text-white">
                      Download Map
                    </Button>
                    <Button onClick={handleMapClear} className="bg-red-500 hover:bg-red-700 text-white">
                      Clear Map
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings">
                <div className="bg-gray-800 rounded-md p-4">
                  <h2 className="text-lg font-bold text-white mb-2">Settings</h2>
                  <div className="mb-2">
                    <Label htmlFor="gridSize" className="text-gray-300">Grid Size</Label>
                    <Input
                      type="number"
                      id="gridSize"
                      className="bg-gray-700 text-white"
                      value={gridSize}
                      onChange={(e) => setGridSize(parseInt(e.target.value))}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="fogOfWar" className="text-gray-300">Fog of War</Label>
                    <Button
                      onClick={handleFogOfWarToggle}
                      variant="outline"
                    >
                      {fogOfWarEnabled ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {fogOfWarEnabled ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TacticalCombat;
