
import React from 'react';

interface GamePlayer {
  id: string;
  name: string;
  characterId: string | null;
  characterName: string | null;
  characterClass: string | null;
  characterRace: string | null;
  characterLevel: number | null;
  online: boolean;
}

interface PlayersTabProps {
  players: GamePlayer[];
}

const PlayersTab = ({ players }: PlayersTabProps) => {
  return (
    <div className="fantasy-card p-4">
      <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-4">Jogadores na Sessão</h2>
      {players.length > 0 ? (
        <div className="space-y-4">
          {players.map((player) => (
            <div key={player.id} className="p-4 bg-fantasy-dark/40 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medievalsharp text-white flex items-center gap-2">
                  {player.name}
                  <span 
                    className={`inline-block w-2 h-2 rounded-full ${player.online ? 'bg-green-500' : 'bg-gray-500'}`} 
                    title={player.online ? 'Online' : 'Offline'}
                  ></span>
                </h3>
                {player.characterName && (
                  <span className="text-xs bg-fantasy-purple/20 text-fantasy-purple px-2 py-1 rounded-full">
                    Nível {player.characterLevel || '?'}
                  </span>
                )}
              </div>
              
              {player.characterName ? (
                <div>
                  <p className="text-fantasy-stone">
                    {player.characterName} ({player.characterRace} {player.characterClass})
                  </p>
                </div>
              ) : (
                <p className="text-fantasy-stone">Nenhum personagem selecionado</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-fantasy-stone text-center">Nenhum jogador encontrado nesta mesa</p>
      )}
    </div>
  );
};

export default PlayersTab;
