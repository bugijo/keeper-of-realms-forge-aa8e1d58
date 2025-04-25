
import React, { useState, useEffect, useRef } from 'react';
import { Maximize2, Minimize2, Eye, EyeOff, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapPoint {
  x: number;
  y: number;
}

interface TacticalMapWithFogProps {
  mapImageUrl?: string;
  fogPoints?: MapPoint[];
  onMapClick?: (x: number, y: number) => void;
  isGameMaster?: boolean;
  tokens?: {
    id: string;
    x: number;
    y: number;
    color: string;
    label: string;
    size: number;
  }[];
  onTokenMove?: (id: string, x: number, y: number) => void;
}

const TacticalMapWithFog = ({
  mapImageUrl = '/placeholder.svg',
  fogPoints = [],
  onMapClick,
  isGameMaster = false,
  tokens = [],
  onTokenMove
}: TacticalMapWithFogProps) => {
  const gridSize = 20; // Tamanho da célula do grid
  const [mapWidth, setMapWidth] = useState(800); // Largura total do mapa
  const [mapHeight, setMapHeight] = useState(600); // Altura total do mapa
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFog, setShowFog] = useState(true);
  const [isDraggingToken, setIsDraggingToken] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (mapRef.current?.requestFullscreen) {
        mapRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isDraggingToken || !onMapClick) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / gridSize);
    const y = Math.floor((event.clientY - rect.top) / gridSize);
    onMapClick(x, y);
  };

  const handleTokenMouseDown = (event: React.MouseEvent, tokenId: string) => {
    if (!isGameMaster || !onTokenMove) return;
    
    event.stopPropagation();
    setIsDraggingToken(tokenId);
    
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const token = tokens.find(t => t.id === tokenId);
    if (!token) return;
    
    const offsetX = event.clientX - (rect.left + token.x * gridSize);
    const offsetY = event.clientY - (rect.top + token.y * gridSize);
    setDragOffset({ x: offsetX, y: offsetY });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDraggingToken || !isGameMaster || !onTokenMove) return;
    
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = Math.floor((event.clientX - rect.left - dragOffset.x) / gridSize);
    const y = Math.floor((event.clientY - rect.top - dragOffset.y) / gridSize);
    
    // Ensure within map bounds
    const boundedX = Math.max(0, Math.min(Math.floor(mapWidth / gridSize) - 1, x));
    const boundedY = Math.max(0, Math.min(Math.floor(mapHeight / gridSize) - 1, y));
    
    onTokenMove(isDraggingToken, boundedX, boundedY);
  };

  const handleMouseUp = () => {
    setIsDraggingToken(null);
  };

  // Add event listener for fullscreenchange event
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Add event listeners for drag operations
  useEffect(() => {
    if (isDraggingToken) {
      // Add window-level event listeners to handle drag outside component
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mouseleave', handleMouseUp);
      
      return () => {
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('mouseleave', handleMouseUp);
      };
    }
  }, [isDraggingToken]);

  // Calculate grid dimensions
  const cols = Math.floor(mapWidth / gridSize);
  const rows = Math.floor(mapHeight / gridSize);

  return (
    <div className="relative">
      <div className="flex justify-end mb-2 gap-2">
        {isGameMaster && (
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setShowFog(!showFog)}
            className="flex items-center gap-1"
          >
            {showFog ? <EyeOff size={14} /> : <Eye size={14} />}
            {showFog ? 'Ocultar Névoa' : 'Mostrar Névoa'}
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleFullscreen}
          className="flex items-center gap-1"
        >
          {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          {isFullscreen ? 'Sair' : 'Tela Cheia'}
        </Button>
      </div>
      
      <div
        ref={mapRef}
        style={{
          width: mapWidth,
          height: mapHeight,
          backgroundImage: `url('${mapImageUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          border: '1px solid rgba(138, 75, 175, 0.3)',
          borderRadius: '0.5rem',
          overflow: 'hidden',
          cursor: isGameMaster ? 'pointer' : 'default'
        }}
        onClick={handleMapClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Grid lines */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{ 
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: `${gridSize}px ${gridSize}px` 
          }}
        />

        {/* Fog of war */}
        {showFog && fogPoints.map((point, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: point.x * gridSize,
              top: point.y * gridSize,
              width: gridSize,
              height: gridSize,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            }}
          />
        ))}

        {/* Tokens */}
        {tokens.map((token) => (
          <div
            key={token.id}
            style={{
              position: 'absolute',
              left: token.x * gridSize,
              top: token.y * gridSize,
              width: token.size * gridSize,
              height: token.size * gridSize,
              backgroundColor: token.color,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid white',
              color: 'white',
              fontWeight: 'bold',
              fontSize: token.size * gridSize / 2.5,
              transform: `translate(-${token.size * gridSize / 2}px, -${token.size * gridSize / 2}px)`,
              cursor: isGameMaster ? 'grab' : 'default',
              zIndex: isDraggingToken === token.id ? 10 : 1,
              boxShadow: '0 3px 6px rgba(0,0,0,0.3)',
            }}
            onMouseDown={(e) => handleTokenMouseDown(e, token.id)}
            onClick={(e) => e.stopPropagation()}
          >
            {token.label}
            {isGameMaster && isDraggingToken === token.id && (
              <div className="absolute -top-5 -right-5 bg-fantasy-purple rounded-full p-1">
                <Move size={14} />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {isGameMaster && (
        <div className="mt-2 text-sm text-fantasy-stone">
          {isDraggingToken ? (
            <p>Arraste para mover o token</p>
          ) : (
            <p>Clique para adicionar/remover névoa • Arraste tokens para movê-los</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TacticalMapWithFog;
