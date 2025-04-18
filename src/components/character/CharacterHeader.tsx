
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash } from "lucide-react";
import { motion } from "framer-motion";

interface CharacterHeaderProps {
  name: string;
  level: number;
  race: string;
  characterClass: string;
  background: string;
  alignment: string;
  imageUrl?: string;
}

const CharacterHeader = ({ 
  name, 
  level, 
  race, 
  characterClass, 
  background, 
  alignment,
  imageUrl = "/lovable-uploads/85fed85e-846f-4915-b38f-351bb4efa9d3.png"
}: CharacterHeaderProps) => {
  return (
    <div className="fantasy-card p-6 md:col-span-1">
      <div className="h-40 w-40 mx-auto rounded-full overflow-hidden border-4 border-fantasy-purple/30 mb-4">
        <img 
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <h2 className="text-xl font-medievalsharp text-center text-white mb-1">{name}</h2>
      <p className="text-center text-fantasy-stone mb-4">
        Nível {level} {race} {characterClass}
      </p>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-fantasy-stone">Antecedente:</span>
          <span className="text-white">{background}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-fantasy-stone">Alinhamento:</span>
          <span className="text-white">{alignment}</span>
        </div>
      </div>
      
      <div className="flex gap-2 mt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 bg-fantasy-purple text-white py-2 rounded-lg font-medievalsharp flex items-center justify-center gap-2"
        >
          <Edit size={16} />
          Editar
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-fantasy-dark/80 text-red-400 py-2 px-3 rounded-lg"
        >
          <Trash size={16} />
        </motion.button>
      </div>
    </div>
  );
};

export default CharacterHeader;
