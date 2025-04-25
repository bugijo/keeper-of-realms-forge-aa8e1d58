
import React from 'react';

export interface MapTabProps {
  sessionId?: string;
  mapImageUrl?: string;
  fogOfWar?: { x: number, y: number }[];
  handleMapClick?: (x: number, y: number) => void;
  mapTokens?: any[];
  handleTokenMove?: (tokenId: string, x: number, y: number) => void;
  maps?: any[];
  activeMap?: string | null;
  handleMapChange?: (mapId: string) => void;
  combatCharacters?: any[];
}

const MapTab: React.FC<MapTabProps> = ({ 
  sessionId,
  mapImageUrl,
  fogOfWar,
  handleMapClick,
  mapTokens,
  handleTokenMove,
  maps,
  activeMap,
  handleMapChange,
  combatCharacters
}) => {
  return (
    <div>
      <h3 className="text-lg font-medievalsharp text-fantasy-gold mb-4">Mapas</h3>
      <p className="text-fantasy-stone">Visualize e gerencie mapas táticos para a sessão.</p>
      {sessionId && <p className="text-xs text-fantasy-stone/70 mt-2">ID da sessão: {sessionId}</p>}
    </div>
  );
};

export default MapTab;
