
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import CharacterGrid from '@/components/character/CharacterGrid';
import { Search, Plus, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data - replace with actual API call in production
const mockCharacters = [
  {
    id: '1',
    name: 'Eldric',
    race: 'Elfo',
    class: 'Mago',
    level: 5,
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2'
  },
  {
    id: '2',
    name: 'Thorgar',
    race: 'Anão',
    class: 'Guerreiro',
    level: 7,
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d'
  },
  {
    id: '3',
    name: 'Lyra',
    race: 'Humana',
    class: 'Ladina',
    level: 4,
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
  }
];

const CharactersCollection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [characters, setCharacters] = useState(mockCharacters);
  
  const filteredCharacters = characters.filter(character => 
    character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    character.race.toLowerCase().includes(searchTerm.toLowerCase()) ||
    character.class.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDelete = (id: string) => {
    setCharacters(prev => prev.filter(character => character.id !== id));
    // In actual implementation, make API call to delete from database
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-medievalsharp text-fantasy-gold">Meus Personagens</h1>
            <p className="text-fantasy-stone">Gerencie todos os personagens que você criou</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fantasy-stone" size={18} />
              <input
                type="text"
                placeholder="Buscar personagens..."
                className="pl-10 pr-4 py-2 w-full bg-fantasy-dark/30 border border-fantasy-purple/20 rounded-lg text-white focus:outline-none focus:border-fantasy-purple/60"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Link to="/creations/characters" className="fantasy-button primary sm:w-auto w-full">
              <Plus size={18} className="mr-2" />
              Novo Personagem
            </Link>
          </div>
        </div>
        
        <div className="mb-6">
          <CharacterGrid 
            characters={filteredCharacters} 
            onDelete={handleDelete}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default CharactersCollection;
