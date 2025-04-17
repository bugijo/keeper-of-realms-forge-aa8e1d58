
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import CreationGrid from '@/components/creations/CreationGrid';
import { Search, Plus, Filter } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

// Mock data - replace with actual API call in production
const mockCreations = {
  maps: [
    {
      id: '1',
      title: 'Caverna do Dragão',
      type: 'map' as const,
      description: 'Um mapa detalhado da caverna onde o dragão vermelho habita.',
      imageUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf',
      createdAt: '2025-03-15T10:30:00Z'
    },
    {
      id: '2',
      title: 'Cidade de Neverwinter',
      type: 'map' as const,
      description: 'Mapa da cidade principal da campanha.',
      imageUrl: 'https://images.unsplash.com/photo-1566288623394-377af472d81b',
      createdAt: '2025-03-10T14:20:00Z'
    }
  ],
  stories: [
    {
      id: '1',
      title: 'A Queda de Durotar',
      type: 'story' as const,
      description: 'Uma história épica sobre a queda do antigo império.',
      createdAt: '2025-03-18T09:15:00Z'
    },
    {
      id: '2',
      title: 'Lendas do Vale Sombrio',
      type: 'story' as const,
      description: 'Contos e lendas sobre o Vale Sombrio e seus habitantes misteriosos.',
      createdAt: '2025-03-05T16:45:00Z'
    }
  ],
  items: [
    {
      id: '1',
      title: 'Espada Flamejante',
      type: 'item' as const,
      description: 'Uma espada ancestral com lâmina envolta em chamas mágicas eternas.',
      imageUrl: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819',
      createdAt: '2025-03-20T11:30:00Z'
    }
  ],
  monsters: [
    {
      id: '1',
      title: 'Troll das Montanhas',
      type: 'monster' as const,
      description: 'Um troll gigante que habita as regiões montanhosas.',
      createdAt: '2025-03-12T10:00:00Z'
    }
  ],
  npcs: [
    {
      id: '1',
      title: 'Eldrin o Sábio',
      type: 'npc' as const,
      description: 'Um antigo mago que guarda conhecimentos ancestrais.',
      imageUrl: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f',
      createdAt: '2025-03-22T15:10:00Z'
    }
  ]
};

type CreationType = 'maps' | 'stories' | 'items' | 'monsters' | 'npcs';

const titleMap: Record<CreationType, string> = {
  maps: 'Meus Mapas',
  stories: 'Minhas Histórias',
  items: 'Meus Itens',
  monsters: 'Meus Monstros',
  npcs: 'Meus NPCs'
};

const descriptionMap: Record<CreationType, string> = {
  maps: 'Gerencie todos os mapas que você criou',
  stories: 'Gerencie todas as histórias que você criou',
  items: 'Gerencie todos os itens que você criou',
  monsters: 'Gerencie todos os monstros que você criou',
  npcs: 'Gerencie todos os NPCs que você criou'
};

const singularTypeMap: Record<CreationType, 'map' | 'story' | 'item' | 'monster' | 'npc'> = {
  maps: 'map',
  stories: 'story',
  items: 'item',
  monsters: 'monster',
  npcs: 'npc'
};

const CreationsCollection = () => {
  const { type } = useParams<{ type: CreationType }>();
  const [searchTerm, setSearchTerm] = useState('');
  
  if (!type || !titleMap[type]) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6">
          <div className="fantasy-card p-6">
            <h1 className="text-3xl font-medievalsharp text-fantasy-gold">Tipo de criação não encontrado</h1>
            <p className="text-fantasy-stone mt-2">O tipo de criação solicitado não existe.</p>
            <Link to="/creations" className="fantasy-button primary mt-4 inline-block">
              Voltar para Criações
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  const creations = mockCreations[type] || [];
  const singularType = singularTypeMap[type];
  
  const filteredCreations = creations.filter(creation => 
    creation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (creation.description && creation.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleDelete = (id: string) => {
    // In actual implementation, make API call to delete from database
    console.log(`Delete creation with id: ${id}`);
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-medievalsharp text-fantasy-gold">{titleMap[type]}</h1>
            <p className="text-fantasy-stone">{descriptionMap[type]}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fantasy-stone" size={18} />
              <input
                type="text"
                placeholder={`Buscar ${titleMap[type].toLowerCase()}...`}
                className="pl-10 pr-4 py-2 w-full bg-fantasy-dark/30 border border-fantasy-purple/20 rounded-lg text-white focus:outline-none focus:border-fantasy-purple/60"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Link to={`/creations/${singularType}`} className="fantasy-button primary sm:w-auto w-full">
              <Plus size={18} className="mr-2" />
              {`Novo ${getCreationTypeInPortuguese(singularType)}`}
            </Link>
          </div>
        </div>
        
        <div className="mb-6">
          <CreationGrid 
            creations={filteredCreations} 
            type={singularType}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </MainLayout>
  );
};

// Helper function to get creation type in Portuguese
const getCreationTypeInPortuguese = (type: 'map' | 'story' | 'item' | 'monster' | 'npc') => {
  switch (type) {
    case 'map': return 'Mapa';
    case 'story': return 'História';
    case 'item': return 'Item';
    case 'monster': return 'Monstro';
    case 'npc': return 'NPC';
    default: return 'Criação';
  }
};

export default CreationsCollection;
