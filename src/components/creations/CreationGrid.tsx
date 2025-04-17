
import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Eye, Trash, Map, Book, User, Sword, Skull, Users } from 'lucide-react';

type CreationType = 'map' | 'story' | 'character' | 'item' | 'monster' | 'npc';

type Creation = {
  id: string;
  title: string;
  type: CreationType;
  description?: string;
  imageUrl?: string;
  createdAt: string;
};

interface CreationGridProps {
  creations: Creation[];
  type: CreationType;
  onDelete?: (id: string) => void;
}

const CreationGrid = ({ creations, type, onDelete }: CreationGridProps) => {
  const getIcon = (type: CreationType) => {
    switch (type) {
      case 'map': return <Map className="text-fantasy-gold" />;
      case 'story': return <Book className="text-fantasy-gold" />;
      case 'character': return <User className="text-fantasy-gold" />;
      case 'item': return <Sword className="text-fantasy-gold" />;
      case 'monster': return <Skull className="text-fantasy-gold" />;
      case 'npc': return <Users className="text-fantasy-gold" />;
      default: return <Book className="text-fantasy-gold" />;
    }
  };

  const getViewPath = (type: CreationType, id: string) => {
    switch (type) {
      case 'map': return `/maps/view/${id}`;
      case 'story': return `/stories/view/${id}`;
      case 'character': return `/character/view/${id}`;
      case 'item': return `/items/view/${id}`;
      case 'monster': return `/monsters/view/${id}`;
      case 'npc': return `/npcs/view/${id}`;
      default: return `/`;
    }
  };

  const getCreatePath = (type: CreationType, id?: string) => {
    const basePath = `/creations/${type}s`;
    return id ? `${basePath}/${id}` : basePath;
  };

  if (creations.length === 0) {
    return (
      <div className="text-center py-12 fantasy-card">
        <div className="flex justify-center mb-4">{getIcon(type)}</div>
        <h3 className="text-xl font-medievalsharp text-fantasy-gold">Nenhuma criação encontrada</h3>
        <p className="text-fantasy-stone mt-2">Crie sua primeira {getCreationTypeInPortuguese(type)} para começar!</p>
        <Link to={getCreatePath(type)} className="fantasy-button primary mt-4 inline-block">
          Criar {getCreationTypeInPortuguese(type)}
        </Link>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {creations.map((creation) => (
        <div key={creation.id} className="fantasy-card p-4 relative group">
          <div className="h-40 rounded-lg overflow-hidden border-2 border-fantasy-purple/30 mb-3">
            {creation.imageUrl ? (
              <img 
                src={creation.imageUrl} 
                alt={creation.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-fantasy-dark/50 flex items-center justify-center">
                <div className="text-4xl text-fantasy-purple/50">
                  {getIcon(creation.type)}
                </div>
              </div>
            )}
          </div>
          
          <h3 className="text-lg font-medievalsharp text-white mb-1">{creation.title}</h3>
          {creation.description && (
            <p className="text-fantasy-stone text-sm line-clamp-2">
              {creation.description}
            </p>
          )}
          
          <div className="mt-3 text-xs text-fantasy-stone">
            Criado em {new Date(creation.createdAt).toLocaleDateString('pt-BR')}
          </div>
          
          <div className="absolute inset-0 bg-fantasy-dark/80 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-opacity duration-200 rounded-lg">
            <Link to={getViewPath(creation.type, creation.id)} className="fantasy-button primary p-2">
              <Eye size={20} />
            </Link>
            <Link to={getCreatePath(creation.type, creation.id)} className="fantasy-button secondary p-2">
              <Edit size={20} />
            </Link>
            {onDelete && (
              <button 
                onClick={() => onDelete(creation.id)} 
                className="bg-red-500/20 hover:bg-red-500/40 text-red-400 p-2 rounded-lg transition-colors"
              >
                <Trash size={20} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper function to get creation type in Portuguese
const getCreationTypeInPortuguese = (type: CreationType) => {
  switch (type) {
    case 'map': return 'mapa';
    case 'story': return 'história';
    case 'character': return 'personagem';
    case 'item': return 'item';
    case 'monster': return 'monstro';
    case 'npc': return 'NPC';
    default: return 'criação';
  }
};

export default CreationGrid;
