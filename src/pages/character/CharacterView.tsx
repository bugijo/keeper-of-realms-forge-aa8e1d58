import React from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from "@/components/layout/MainLayout";
import { ArrowLeft, Dices, Edit, Trash } from "lucide-react";
import { motion } from "framer-motion";

// This would come from the database in a real app
const mockCharacter = {
  id: '1',
  name: 'Thorian Greystone',
  level: 5,
  class: 'Paladino',
  race: 'Anão',
  background: 'Ferreiro de Guildas',
  alignment: 'Leal e Bom',
  stats: {
    strength: 16,
    dexterity: 10,
    constitution: 18,
    intelligence: 12,
    wisdom: 14,
    charisma: 16
  },
  abilities: {
    hp: { current: 45, max: 45 },
    ac: 18,
    speed: 25,
    initiative: 0,
    proficiencyBonus: 3
  },
  skills: [
    { name: 'Atletismo', proficient: true, value: 6 },
    { name: 'Intimidação', proficient: true, value: 6 },
    { name: 'Religião', proficient: true, value: 4 },
    { name: 'Persuasão', proficient: true, value: 6 }
  ],
  equipment: [
    { name: 'Martelo de Guerra', type: 'weapon', damage: '1d8+3', properties: 'Versatile (1d10)' },
    { name: 'Escudo', type: 'shield', ac: '+2' },
    { name: 'Cota de Malha', type: 'armor', ac: '16' },
    { name: 'Símbolo Sagrado', type: 'item' }
  ],
  spells: [
    { name: 'Curar Ferimentos', level: 1, description: 'Cura 1d8 + modificador de habilidade de conjuração de pontos de vida.' },
    { name: 'Destruir Mortos-Vivos', level: 1, description: 'Mortos-vivos com menos de CR 1/2 devem passar em um teste de sabedoria ou são destruídos.' },
    { name: 'Sopro Curativo', level: 0, description: 'Estabiliza uma criatura com 0 pontos de vida.' }
  ]
};

const CharacterView = () => {
  const { id } = useParams();
  // In a real application, you would fetch the character data based on the ID
  const character = mockCharacter;
  
  return (
    <MainLayout>
      <div className="container mx-auto pb-16">
        <div className="flex items-center mb-6">
          <Link to="/inventory" className="mr-4">
            <ArrowLeft className="text-fantasy-stone hover:text-white transition-colors" />
          </Link>
          <h1 className="text-3xl font-medievalsharp text-white">{character.name}</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Character Info Card */}
          <div className="fantasy-card p-6 md:col-span-1">
            <div className="h-40 w-40 mx-auto rounded-full overflow-hidden border-4 border-fantasy-purple/30 mb-4">
              <img 
                src="https://images.unsplash.com/photo-1501854140801-50d01698950b" 
                alt={character.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <h2 className="text-xl font-medievalsharp text-center text-white mb-1">{character.name}</h2>
            <p className="text-center text-fantasy-stone mb-4">
              Nível {character.level} {character.race} {character.class}
            </p>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-fantasy-stone">Antecedente:</span>
                <span className="text-white">{character.background}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-fantasy-stone">Alinhamento:</span>
                <span className="text-white">{character.alignment}</span>
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
          
          {/* Stats Card */}
          <div className="md:col-span-2 space-y-6">
            {/* Abilities & Combat Stats */}
            <div className="fantasy-card p-6">
              <h3 className="text-xl font-medievalsharp text-white mb-4">Atributos & Combate</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                {Object.entries(character.stats).map(([stat, value]) => (
                  <div key={stat} className="bg-fantasy-dark/30 p-3 rounded-lg text-center">
                    <div className="text-xs text-fantasy-stone uppercase mb-1">{stat}</div>
                    <div className="text-2xl font-medievalsharp text-white">{value}</div>
                    <div className="text-sm text-fantasy-gold mt-1">
                      {Math.floor((value - 10) / 2) >= 0 ? '+' : ''}{Math.floor((value - 10) / 2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-red-900/40 to-red-600/20 p-3 rounded-lg text-center">
                  <div className="text-xs text-fantasy-stone uppercase mb-1">Pontos de Vida</div>
                  <div className="text-xl font-medievalsharp text-white">
                    {character.abilities.hp.current}/{character.abilities.hp.max}
                  </div>
                </div>
                <div className="bg-fantasy-dark/30 p-3 rounded-lg text-center">
                  <div className="text-xs text-fantasy-stone uppercase mb-1">Classe de Armadura</div>
                  <div className="text-xl font-medievalsharp text-white">{character.abilities.ac}</div>
                </div>
                <div className="bg-fantasy-dark/30 p-3 rounded-lg text-center">
                  <div className="text-xs text-fantasy-stone uppercase mb-1">Iniciativa</div>
                  <div className="text-xl font-medievalsharp text-white">
                    {character.abilities.initiative >= 0 ? '+' : ''}{character.abilities.initiative}
                  </div>
                </div>
                <div className="bg-fantasy-dark/30 p-3 rounded-lg text-center">
                  <div className="text-xs text-fantasy-stone uppercase mb-1">Deslocamento</div>
                  <div className="text-xl font-medievalsharp text-white">{character.abilities.speed}ft</div>
                </div>
                <div className="bg-fantasy-dark/30 p-3 rounded-lg text-center">
                  <div className="text-xs text-fantasy-stone uppercase mb-1">Bônus de Prof.</div>
                  <div className="text-xl font-medievalsharp text-white">
                    +{character.abilities.proficiencyBonus}
                  </div>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4 flex items-center justify-center gap-2 bg-fantasy-gold/20 hover:bg-fantasy-gold/30 text-fantasy-gold px-4 py-2 rounded-lg font-medievalsharp w-full"
              >
                <Dices size={16} />
                Rolar Dados
              </motion.button>
            </div>
            
            {/* Proficiencies & Skills */}
            <div className="fantasy-card p-6">
              <h3 className="text-xl font-medievalsharp text-white mb-4">Perícias</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {character.skills.map((skill, index) => (
                  <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-fantasy-dark/30">
                    <span className="text-white">{skill.name}</span>
                    <span className="text-fantasy-gold font-medievalsharp">
                      +{skill.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Equipment */}
            <div className="fantasy-card p-6">
              <h3 className="text-xl font-medievalsharp text-white mb-4">Equipamentos</h3>
              
              <div className="space-y-3">
                {character.equipment.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-fantasy-dark/30">
                    <div>
                      <span className="text-white font-medievalsharp">{item.name}</span>
                      <div className="text-xs text-fantasy-stone">
                        {item.type === 'weapon' && `Dano: ${item.damage}`}
                        {item.type === 'armor' && `CA: ${item.ac}`}
                        {item.type === 'shield' && `CA: ${item.ac}`}
                        {item.properties && ` | ${item.properties}`}
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-fantasy-purple/30 text-fantasy-purple">
                      {item.type === 'weapon' ? 'Arma' : 
                       item.type === 'armor' ? 'Armadura' : 
                       item.type === 'shield' ? 'Escudo' : 'Item'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Spells */}
            <div className="fantasy-card p-6">
              <h3 className="text-xl font-medievalsharp text-white mb-4">Magias</h3>
              
              <div className="space-y-3">
                {character.spells.map((spell, index) => (
                  <div key={index} className="p-3 rounded-lg bg-fantasy-dark/30">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white font-medievalsharp">{spell.name}</span>
                      <span className="text-xs px-2 py-1 rounded bg-fantasy-purple/30 text-fantasy-purple">
                        Nível {spell.level === 0 ? 'Truque' : spell.level}
                      </span>
                    </div>
                    <p className="text-sm text-fantasy-stone">{spell.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CharacterView;
