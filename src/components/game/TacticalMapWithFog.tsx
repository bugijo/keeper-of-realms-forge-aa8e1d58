import React from 'react';

interface TacticalMapWithFogProps {
  fogPoints: { x: number; y: number }[];
  onMapClick: (x: number; y: number) => void;
}

const TacticalMapWithFog = ({ fogPoints, onMapClick }: TacticalMapWithFogProps) => {
  const gridSize = 20; // Tamanho da célula do grid
  const mapWidth = 500; // Largura total do mapa
  const mapHeight = 500; // Altura total do mapa
  const cols = mapWidth / gridSize;
  const rows = mapHeight / gridSize;

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / gridSize);
    const y = Math.floor((event.clientY - rect.top) / gridSize);
    onMapClick(x, y);
  };

  return (
    <div
      style={{
        width: mapWidth,
        height: mapHeight,
        background: `url('/assets/tactical-map.jpg')`, // Certifique-se de que o caminho está correto
        backgroundSize: 'cover',
        position: 'relative',
      }}
      onClick={handleClick}
    >
      {fogPoints.map((point, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: point.x * gridSize,
            top: point.y * gridSize,
            width: gridSize,
            height: gridSize,
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Cor da névoa
          }}
        />
      ))}
    </div>
  );
};

export default TacticalMapWithFog;
