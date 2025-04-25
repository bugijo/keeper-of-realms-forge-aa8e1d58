
import React from 'react';
import TacticalMapWithFog from '@/components/game/TacticalMapWithFog';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MapToken {
  id: string;
  x: number;
  y: number;
  color: string;
  label: string;
  size: number;
}

interface Map {
  id: string;
  name: string;
  image_url: string | null;
  description: string | null;
}

interface MapTabProps {
  mapImageUrl: string;
  fogOfWar: { x: number; y: number }[];
  handleMapClick: (x: number, y: number) => void;
  mapTokens: MapToken[];
  handleTokenMove: (tokenId: string, x: number, y: number) => void;
  maps: Map[];
  activeMap: string | null;
  handleMapChange: (mapId: string) => void;
  combatCharacters: any[];
}

const MapTab = ({
  mapImageUrl,
  fogOfWar,
  handleMapClick,
  mapTokens,
  handleTokenMove,
  maps,
  activeMap,
  handleMapChange,
  combatCharacters
}: MapTabProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 fantasy-card p-4">
        <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-4">Mapa Tático</h2>
        <div className="overflow-auto">
          <TacticalMapWithFog 
            mapImageUrl={mapImageUrl}
            fogPoints={fogOfWar}
            onMapClick={handleMapClick}
            isGameMaster={true}
            tokens={mapTokens}
            onTokenMove={handleTokenMove}
          />
        </div>
      </div>
      
      <div>
        <div className="fantasy-card p-4 mb-4">
          <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-3">Seus Mapas</h2>
          <div className="space-y-2">
            {maps.length > 0 ? (
              maps.map(map => (
                <div 
                  key={map.id} 
                  className={`p-3 rounded-lg cursor-pointer ${activeMap === map.id ? 'bg-fantasy-purple/30 border border-fantasy-purple/60' : 'bg-fantasy-dark/30 hover:bg-fantasy-dark/50'}`}
                  onClick={() => handleMapChange(map.id)}
                >
                  <h3 className="text-sm font-medievalsharp text-white">{map.name}</h3>
                </div>
              ))
            ) : (
              <p className="text-fantasy-stone text-center p-3">
                Nenhum mapa encontrado. Adicione mapas na seção de criação.
              </p>
            )}
          </div>
        </div>
        
        <div className="fantasy-card p-4">
          <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-3">Tokens</h2>
          <div className="space-y-3">
            {mapTokens.map(token => {
              const character = combatCharacters.find(c => c.id === token.id);
              return (
                <div key={token.id} className="flex items-center gap-3 p-2 bg-fantasy-dark/40 rounded-lg">
                  <div 
                    style={{
                      backgroundColor: token.color,
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '10px'
                    }}
                  >
                    {token.label}
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm text-white">{character?.name || token.label}</p>
                    <p className="text-xs text-fantasy-stone">({token.x}, {token.y})</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapTab;
