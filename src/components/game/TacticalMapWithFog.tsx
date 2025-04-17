
import React, { useState, useRef, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/components/ui/button';
import { Eraser, Eye, EyeOff, Grid, Move } from 'lucide-react';

interface TokenProps {
  id: string;
  x: number;
  y: number;
  type: 'player' | 'enemy' | 'npc';
  label: string;
  image?: string;
  color: string;
  size: number;
  onTokenMove: (id: string, x: number, y: number) => void;
}

interface FogCellProps {
  x: number;
  y: number;
  isRevealed: boolean;
  toggleCell: (x: number, y: number) => void;
}

interface TacticalMapWithFogProps {
  mapImage?: string;
  gridSize: number;
  cellSize: number;
  tokens: Omit<TokenProps, 'onTokenMove'>[];
  onTokenMove: (id: string, x: number, y: number) => void;
}

// Token component - draggable
const Token: React.FC<TokenProps> = ({ id, x, y, type, label, image, color, size, onTokenMove }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'token',
    item: { id, x, y },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`draggable-token absolute rounded-full flex items-center justify-center 
                 border-2 transition-transform cursor-grab ${
                   isDragging ? 'cursor-grabbing opacity-50' : ''
                 }`}
      style={{
        left: `${x * size}px`,
        top: `${y * size}px`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        borderColor: type === 'player' ? '#3b82f6' : type === 'enemy' ? '#ef4444' : '#10b981',
        zIndex: 20,
      }}
      title={label}
    >
      {image ? (
        <img
          src={image}
          alt={label}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span className="text-white text-xs font-bold">{label.substring(0, 2)}</span>
      )}
    </div>
  );
};

// Fog cell component
const FogCell: React.FC<FogCellProps> = ({ x, y, isRevealed, toggleCell }) => {
  return (
    <div
      className={`absolute ${
        isRevealed ? 'bg-black/0 pointer-events-none' : 'bg-black/80 fog-cell'
      }`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: '20px',
        height: '20px',
        zIndex: 10,
        transition: 'background-color 0.3s ease',
      }}
      onClick={() => toggleCell(x, y)}
    />
  );
};

// Grid cell component for token dropping
const GridCell: React.FC<{
  x: number;
  y: number;
  size: number;
  onDrop: (x: number, y: number, tokenId: string) => void;
}> = ({ x, y, size, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'token',
    drop: (item: { id: string }) => {
      onDrop(x, y, item.id);
      return undefined;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`absolute border border-gray-700/30 ${isOver ? 'bg-indigo-500/20' : ''}`}
      style={{
        left: `${x * size}px`,
        top: `${y * size}px`,
        width: `${size}px`,
        height: `${size}px`,
        zIndex: 5,
      }}
    />
  );
};

// Main Tactical Map with Fog component
const TacticalMapWithFog: React.FC<TacticalMapWithFogProps> = ({
  mapImage = '/placeholder.svg',
  gridSize = 20,
  cellSize = 40,
  tokens = [],
  onTokenMove,
}) => {
  const [fogGrid, setFogGrid] = useState<boolean[][]>(() => {
    // Initialize fog grid (true = revealed, false = fogged)
    const grid = [];
    for (let y = 0; y < gridSize; y++) {
      const row: boolean[] = [];
      for (let x = 0; x < gridSize; x++) {
        row.push(false); // Start with all cells fogged
      }
      grid.push(row);
    }
    return grid;
  });

  const [mapTokens, setMapTokens] = useState(tokens);
  const [fogMode, setFogMode] = useState<'reveal' | 'hide'>('reveal');
  const [showGrid, setShowGrid] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Update tokens when props change
  useEffect(() => {
    setMapTokens(tokens);
  }, [tokens]);

  // Handle token movement
  const handleTokenMove = (x: number, y: number, tokenId: string) => {
    // Update token position
    const newTokens = mapTokens.map(token => {
      if (token.id === tokenId) {
        return { ...token, x, y };
      }
      return token;
    });
    setMapTokens(newTokens);
    onTokenMove(tokenId, x, y);
  };

  // Toggle fog cell
  const toggleFogCell = (x: number, y: number) => {
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);
    
    if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
      setFogGrid(prevGrid => {
        const newGrid = [...prevGrid];
        newGrid[gridY] = [...newGrid[gridY]];
        newGrid[gridY][gridX] = fogMode === 'reveal';
        return newGrid;
      });
    }
  };

  // Handle mouse events for drawing fog
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!mapRef.current) return;
    
    setIsDrawing(true);
    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    toggleFogCell(x, y);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !mapRef.current) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    toggleFogCell(x, y);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  // Clear all fog
  const revealAll = () => {
    setFogGrid(prevGrid => 
      prevGrid.map(row => row.map(() => true))
    );
  };

  // Reset all fog
  const hideAll = () => {
    setFogGrid(prevGrid => 
      prevGrid.map(row => row.map(() => false))
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="fantasy-card p-4">
        <h2 className="text-xl font-medievalsharp text-fantasy-gold mb-4">Mapa Tático</h2>
        
        <div className="flex gap-2 mb-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setFogMode('reveal')} 
            className={fogMode === 'reveal' ? 'bg-fantasy-purple/20' : ''}
          >
            <Eye size={16} className="mr-1" /> Revelar
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setFogMode('hide')} 
            className={fogMode === 'hide' ? 'bg-fantasy-purple/20' : ''}
          >
            <EyeOff size={16} className="mr-1" /> Esconder
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowGrid(!showGrid)}
            className={showGrid ? 'bg-fantasy-purple/20' : ''}
          >
            <Grid size={16} className="mr-1" /> Grid
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={revealAll}
          >
            <Eye size={16} className="mr-1" /> Revelar Tudo
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={hideAll}
          >
            <Eraser size={16} className="mr-1" /> Ocultar Tudo
          </Button>
        </div>
        
        <div 
          ref={mapRef}
          className="relative bg-gray-800 overflow-hidden"
          style={{ 
            width: `${gridSize * cellSize}px`, 
            height: `${gridSize * cellSize}px` 
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Map Background */}
          <img 
            src={mapImage} 
            alt="Tactical Map" 
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          
          {/* Grid Overlay */}
          {showGrid && Array.from({ length: gridSize }).map((_, y) =>
            Array.from({ length: gridSize }).map((_, x) => (
              <GridCell
                key={`grid-${x}-${y}`}
                x={x}
                y={y}
                size={cellSize}
                onDrop={handleTokenMove}
              />
            ))
          )}
          
          {/* Fog of War */}
          {Array.from({ length: gridSize }).map((_, y) =>
            Array.from({ length: gridSize }).map((_, x) => (
              <FogCell
                key={`fog-${x}-${y}`}
                x={x * cellSize}
                y={y * cellSize}
                isRevealed={fogGrid[y][x]}
                toggleCell={() => toggleFogCell(x * cellSize, y * cellSize)}
              />
            ))
          )}
          
          {/* Tokens */}
          {mapTokens.map(token => (
            <Token
              key={token.id}
              id={token.id}
              x={token.x}
              y={token.y}
              type={token.type}
              label={token.label}
              image={token.image}
              color={token.color}
              size={cellSize}
              onTokenMove={onTokenMove}
            />
          ))}
        </div>
        
        <div className="mt-4 text-sm text-fantasy-stone">
          <p className="flex items-center">
            <Move size={16} className="mr-1" /> 
            Arraste os tokens para movê-los no mapa. 
          </p>
          <p className="flex items-center mt-1">
            <Eye size={16} className="mr-1" />
            Use o modo Revelar/Esconder para controlar a névoa de guerra.
          </p>
        </div>
      </div>
    </DndProvider>
  );
};

export default TacticalMapWithFog;
