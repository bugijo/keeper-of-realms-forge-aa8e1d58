
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Rulers, Move, Grid3x3, Grid2x2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Token {
  id: string;
  x: number;
  y: number;
  color: string;
  name: string;
  size: number; // Size in grid squares (1 = 5ft, 2 = 10ft, etc.)
  type: 'player' | 'enemy' | 'object';
}

interface GridProps {
  gridSize: number; // Size of each square in pixels
  width: number; // Grid width in squares
  height: number; // Grid height in squares
  tokens: Token[];
  onTokensChange: (tokens: Token[]) => void;
  fogOfWar?: boolean;
  onFogOfWarChange?: (fogMap: boolean[][]) => void;
  isDungeonMaster?: boolean;
}

export function CombatTrackerGrid({ 
  gridSize = 40, 
  width = 20, 
  height = 20,
  tokens = [],
  onTokensChange,
  fogOfWar = false,
  onFogOfWarChange,
  isDungeonMaster = true
}: GridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [draggingToken, setDraggingToken] = useState<string | null>(null);
  const [measuring, setMeasuring] = useState<boolean>(false);
  const [measureStart, setMeasureStart] = useState<{x: number, y: number} | null>(null);
  const [measureEnd, setMeasureEnd] = useState<{x: number, y: number} | null>(null);
  const [fogMap, setFogMap] = useState<boolean[][]>(() => {
    // Initialize fog of war map (true = fog, false = visible)
    const map = [];
    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        row.push(true); // Start with fog everywhere
      }
      map.push(row);
    }
    return map;
  });
  const [editingFog, setEditingFog] = useState<boolean>(false);
  const [fogBrushSize, setFogBrushSize] = useState<number>(1);

  // Draw grid and tokens
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 1;
    
    // Draw vertical lines
    for (let x = 0; x <= width; x++) {
      ctx.beginPath();
      ctx.moveTo(x * gridSize, 0);
      ctx.lineTo(x * gridSize, height * gridSize);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y <= height; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * gridSize);
      ctx.lineTo(width * gridSize, y * gridSize);
      ctx.stroke();
    }
    
    // Draw fog of war if enabled
    if (fogOfWar) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (fogMap[y][x]) {
            ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
          }
        }
      }
    }
    
    // Draw tokens
    tokens.forEach(token => {
      const x = token.x * gridSize + gridSize / 2;
      const y = token.y * gridSize + gridSize / 2;
      const radius = (token.size * gridSize) / 2;
      
      // Draw token circle
      ctx.beginPath();
      ctx.arc(x, y, radius - 2, 0, Math.PI * 2);
      ctx.fillStyle = token.color;
      ctx.fill();
      
      // Draw token border
      ctx.strokeStyle = token.id === selectedToken ? '#fbbf24' : '#374151';
      ctx.lineWidth = token.id === selectedToken ? 3 : 2;
      ctx.stroke();
      
      // Draw token name
      ctx.fillStyle = '#f3f4f6';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(token.name, x, y + radius + 15);
    });
    
    // Draw measurement line if measuring
    if (measuring && measureStart && measureEnd) {
      const startX = measureStart.x * gridSize + gridSize / 2;
      const startY = measureStart.y * gridSize + gridSize / 2;
      const endX = measureEnd.x * gridSize + gridSize / 2;
      const endY = measureEnd.y * gridSize + gridSize / 2;
      
      // Draw line
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Calculate and display distance
      const dx = Math.abs(measureEnd.x - measureStart.x);
      const dy = Math.abs(measureEnd.y - measureStart.y);
      const distance = Math.max(dx, dy) + Math.floor(Math.min(dx, dy) / 2); // Approximation of diagonal movement
      const feet = distance * 5; // 1 square = 5ft
      
      // Draw distance text
      ctx.fillStyle = '#f3f4f6';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${feet}ft`, (startX + endX) / 2, (startY + endY) / 2 - 10);
    }
  }, [tokens, selectedToken, gridSize, width, height, measuring, measureStart, measureEnd, fogOfWar, fogMap]);

  // Handle canvas click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Get click position in grid coordinates
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / gridSize);
    const y = Math.floor((e.clientY - rect.top) / gridSize);
    
    // If editing fog of war
    if (editingFog && isDungeonMaster) {
      // Update fog map based on brush size
      const newFogMap = [...fogMap];
      for (let dy = -fogBrushSize + 1; dy < fogBrushSize; dy++) {
        for (let dx = -fogBrushSize + 1; dx < fogBrushSize; dx++) {
          const targetX = x + dx;
          const targetY = y + dy;
          
          // Skip if out of bounds
          if (targetX < 0 || targetX >= width || targetY < 0 || targetY >= height) continue;
          
          newFogMap[targetY][targetX] = false; // Remove fog
        }
      }
      
      setFogMap(newFogMap);
      if (onFogOfWarChange) {
        onFogOfWarChange(newFogMap);
      }
      return;
    }
    
    // If measuring distance
    if (measuring) {
      if (!measureStart) {
        setMeasureStart({ x, y });
      } else if (!measureEnd) {
        setMeasureEnd({ x, y });
      } else {
        // Reset measurement
        setMeasureStart({ x, y });
        setMeasureEnd(null);
      }
      return;
    }
    
    // Check if clicked on a token
    const clickedToken = tokens.find(token => {
      const tokenX = token.x;
      const tokenY = token.y;
      const size = token.size;
      
      return x >= tokenX && x < tokenX + size && y >= tokenY && y < tokenY + size;
    });
    
    if (clickedToken) {
      // Select token
      setSelectedToken(clickedToken.id);
      
      // Start dragging token if DM or if player token
      if (isDungeonMaster || (clickedToken.type === 'player')) {
        setDraggingToken(clickedToken.id);
      }
    } else {
      // Deselect if clicked on empty space
      setSelectedToken(null);
    }
  };

  // Handle canvas mouse move
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Get mouse position in grid coordinates
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / gridSize);
    const y = Math.floor((e.clientY - rect.top) / gridSize);
    
    // If dragging a token
    if (draggingToken) {
      // Update token position
      const newTokens = tokens.map(token => {
        if (token.id === draggingToken) {
          // Ensure token stays within grid bounds
          const newX = Math.max(0, Math.min(width - token.size, x));
          const newY = Math.max(0, Math.min(height - token.size, y));
          
          return {
            ...token,
            x: newX,
            y: newY
          };
        }
        return token;
      });
      
      onTokensChange(newTokens);
    }
    
    // If measuring and have start point, update end point
    if (measuring && measureStart) {
      setMeasureEnd({ x, y });
    }
    
    // If editing fog of war
    if (editingFog && isDungeonMaster && e.buttons === 1) { // Left mouse button pressed
      // Update fog map based on brush size
      const newFogMap = [...fogMap];
      for (let dy = -fogBrushSize + 1; dy < fogBrushSize; dy++) {
        for (let dx = -fogBrushSize + 1; dx < fogBrushSize; dx++) {
          const targetX = x + dx;
          const targetY = y + dy;
          
          // Skip if out of bounds
          if (targetX < 0 || targetX >= width || targetY < 0 || targetY >= height) continue;
          
          newFogMap[targetY][targetX] = false; // Remove fog
        }
      }
      
      setFogMap(newFogMap);
      if (onFogOfWarChange) {
        onFogOfWarChange(newFogMap);
      }
    }
  };

  // Handle canvas mouse up
  const handleCanvasMouseUp = () => {
    setDraggingToken(null);
  };

  // Handle adding new token
  const handleAddToken = (type: 'player' | 'enemy' | 'object') => {
    const newToken: Token = {
      id: `token-${Date.now()}`,
      x: Math.floor(width / 2),
      y: Math.floor(height / 2),
      color: type === 'player' ? '#3b82f6' : type === 'enemy' ? '#ef4444' : '#10b981',
      name: type === 'player' ? 'Jogador' : type === 'enemy' ? 'Inimigo' : 'Objeto',
      size: type === 'object' ? 1 : 1, // Default size 5ft (1 square)
      type
    };
    
    onTokensChange([...tokens, newToken]);
    setSelectedToken(newToken.id);
    toast.success(`${newToken.name} adicionado ao mapa!`);
  };

  // Handle removing selected token
  const handleRemoveToken = () => {
    if (!selectedToken) return;
    
    const tokenToRemove = tokens.find(t => t.id === selectedToken);
    if (!tokenToRemove) return;
    
    onTokensChange(tokens.filter(t => t.id !== selectedToken));
    setSelectedToken(null);
    toast.success(`${tokenToRemove.name} removido do mapa!`);
  };

  // Handle toggling measuring mode
  const handleToggleMeasuring = () => {
    setMeasuring(!measuring);
    if (measuring) {
      setMeasureStart(null);
      setMeasureEnd(null);
    }
  };

  // Handle toggling fog of war editing
  const handleToggleFogEditing = () => {
    setEditingFog(!editingFog);
    if (!editingFog) {
      setMeasuring(false);
      setMeasureStart(null);
      setMeasureEnd(null);
    }
  };

  // Handle resetting fog of war (fill with fog)
  const handleResetFog = () => {
    const newFogMap = fogMap.map(row => row.map(() => true));
    setFogMap(newFogMap);
    if (onFogOfWarChange) {
      onFogOfWarChange(newFogMap);
    }
    toast.success('Névoa de guerra redefinida!');
  };

  // Handle revealing all fog of war
  const handleRevealAll = () => {
    const newFogMap = fogMap.map(row => row.map(() => false));
    setFogMap(newFogMap);
    if (onFogOfWarChange) {
      onFogOfWarChange(newFogMap);
    }
    toast.success('Todo o mapa revelado!');
  };

  return (
    <div ref={containerRef} className="fantasy-card p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medievalsharp text-fantasy-gold">Mapa Tático</h2>
        
        {/* Toolbar for DM */}
        {isDungeonMaster && (
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant={measuring ? "default" : "outline"}
              onClick={handleToggleMeasuring}
              className={measuring ? "bg-fantasy-purple" : ""}
            >
              <Rulers size={16} className="mr-1" />
              Medir
            </Button>
            
            <Button 
              size="sm" 
              variant={editingFog ? "default" : "outline"}
              onClick={handleToggleFogEditing}
              className={editingFog ? "bg-fantasy-purple" : ""}
              disabled={!fogOfWar}
            >
              <Move size={16} className="mr-1" />
              Revelar
            </Button>
            
            <div className="flex bg-fantasy-dark/30 rounded-md">
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => handleAddToken('player')}
                className="text-blue-400"
              >
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-1" />
                Jogador
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => handleAddToken('enemy')}
                className="text-red-400"
              >
                <div className="w-3 h-3 rounded-full bg-red-500 mr-1" />
                Inimigo
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => handleAddToken('object')}
                className="text-green-400"
              >
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1" />
                Objeto
              </Button>
            </div>
            
            {selectedToken && (
              <Button 
                size="sm" 
                variant="destructive"
                onClick={handleRemoveToken}
              >
                <Trash2 size={16} className="mr-1" />
                Remover
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* Fog of war controls */}
      {isDungeonMaster && fogOfWar && (
        <div className="flex items-center gap-2 mb-4">
          <div className="text-sm text-fantasy-stone">Névoa de Guerra:</div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleResetFog}
          >
            Redefinir
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleRevealAll}
          >
            Revelar Tudo
          </Button>
          
          {editingFog && (
            <div className="flex items-center ml-4">
              <div className="text-sm text-fantasy-stone mr-2">Tamanho do Pincel:</div>
              <Button 
                size="sm" 
                variant={fogBrushSize === 1 ? "default" : "outline"}
                onClick={() => setFogBrushSize(1)}
                className="p-1 h-8 w-8"
              >
                <Grid2x2 size={16} />
              </Button>
              <Button 
                size="sm" 
                variant={fogBrushSize === 2 ? "default" : "outline"}
                onClick={() => setFogBrushSize(2)}
                className="p-1 h-8 w-8"
              >
                <Grid3x3 size={16} />
              </Button>
              <Button 
                size="sm" 
                variant={fogBrushSize === 3 ? "default" : "outline"}
                onClick={() => setFogBrushSize(3)}
                className="p-1 h-8 w-8"
              >
                <Grid3x3 size={16} />
              </Button>
            </div>
          )}
        </div>
      )}
      
      <ScrollArea className="flex-1">
        <div className="overflow-auto p-1 relative">
          <canvas
            ref={canvasRef}
            width={width * gridSize}
            height={height * gridSize}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            className="border border-fantasy-purple/30 bg-fantasy-dark/20"
          />
        </div>
      </ScrollArea>
      
      <div className="mt-2 text-center text-xs text-fantasy-stone">
        1 quadrado = 5 pés
      </div>
    </div>
  );
}

export default CombatTrackerGrid;
