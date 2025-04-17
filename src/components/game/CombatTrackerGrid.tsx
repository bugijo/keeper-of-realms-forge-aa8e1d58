import React from 'react';

interface Character {
  id: string;
  name: string;
  initiative?: number;
}

interface CombatTrackerGridProps {
  characters: Character[];
  removeCharacter: (id: string) => void;
  rollInitiative: (id: string) => void;
}

const CombatTrackerGrid = ({ characters, removeCharacter, rollInitiative }: CombatTrackerGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {characters.map(character => (
        <div key={character.id} className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold">{character.name}</h3>
          <p>Initiative: {character.initiative != null ? character.initiative : 'Not rolled'}</p>
          <div className="flex justify-between mt-4">
            <button 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => rollInitiative(character.id)}
            >
              Roll Initiative
            </button>
            <button 
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => removeCharacter(character.id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CombatTrackerGrid;
