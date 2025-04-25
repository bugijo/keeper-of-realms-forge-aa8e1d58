
import React from 'react';

interface NotesTabProps {
  notes: string;
  setNotes: (notes: string) => void;
}

const NotesTab = ({ notes, setNotes }: NotesTabProps) => {
  return (
    <div className="fantasy-card p-4">
      <h2 className="text-xl font-medievalsharp text-fantasy-purple mb-3">Anotações da Sessão</h2>
      <textarea 
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full h-96 bg-fantasy-dark/40 text-white rounded p-3 focus:outline-none focus:ring-2 focus:ring-fantasy-purple"
        placeholder="Escreva suas anotações para esta sessão aqui..."
      ></textarea>
    </div>
  );
};

export default NotesTab;
