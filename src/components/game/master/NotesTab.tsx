
import React from 'react';

export interface NotesTabProps {
  sessionId?: string;
  userId?: string;
  notes?: string;
  setNotes?: React.Dispatch<React.SetStateAction<string>>;
}

const NotesTab: React.FC<NotesTabProps> = ({ sessionId, userId, notes, setNotes }) => {
  return (
    <div>
      <h3 className="text-lg font-medievalsharp text-fantasy-gold mb-4">Notas do Mestre</h3>
      <p className="text-fantasy-stone">Mantenha anotações importantes sobre sua campanha.</p>
      {sessionId && <p className="text-xs text-fantasy-stone/70 mt-2">ID da sessão: {sessionId}</p>}
    </div>
  );
};

export default NotesTab;
