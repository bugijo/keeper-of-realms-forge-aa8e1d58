
import { useState } from 'react';
import { Dices } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';

const diceSides: Record<DiceType, number> = {
  'd4': 4,
  'd6': 6,
  'd8': 8,
  'd10': 10,
  'd12': 12,
  'd20': 20,
  'd100': 100
};

interface DiceRollerProps {
  onClose?: () => void;
  position?: 'top' | 'bottom';
}

export const DiceRoller = ({ onClose, position = 'bottom' }: DiceRollerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDice, setSelectedDice] = useState<DiceType>('d20');
  const [quantity, setQuantity] = useState(1);
  const [results, setResults] = useState<number[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  
  const toggleRoller = () => {
    setIsOpen(!isOpen);
  };
  
  const rollDice = () => {
    setIsRolling(true);
    
    // Simular o rolamento com um pequeno atraso para efeito visual
    setTimeout(() => {
      const sides = diceSides[selectedDice];
      const rolls = Array.from({ length: quantity }, () => 
        Math.floor(Math.random() * sides) + 1
      );
      
      setResults(rolls);
      setIsRolling(false);
      
      const total = rolls.reduce((sum, roll) => sum + roll, 0);
      
      toast(`🎲 Rolou ${quantity}${selectedDice}: ${total}`, {
        position: 'bottom-center',
        icon: '🎲',
        description: rolls.length > 1 ? `Resultados: ${rolls.join(', ')}` : undefined
      });
    }, 600);
  };
  
  return (
    <div className="fixed z-50 right-4">
      <style jsx>{`
        @keyframes shake {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
          75% { transform: rotate(-5deg); }
          100% { transform: rotate(0deg); }
        }
        
        .dice-rolling {
          animation: shake 0.5s ease-in-out infinite;
        }
      `}</style>
      
      <div className={position === 'bottom' ? 'bottom-20' : 'top-20'}>
        <button
          onClick={toggleRoller}
          className="fantasy-icon p-3 bg-fantasy-purple text-white rounded-full shadow-lg"
          aria-label="Rolar dados"
        >
          <Dices className={`${isRolling ? 'dice-rolling' : ''}`} size={24} />
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="absolute right-0 bottom-16 w-72 bg-fantasy-dark border border-fantasy-purple/30 rounded-lg shadow-xl p-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-medievalsharp">Rolador de Dados</h3>
                <button onClick={() => setIsOpen(false)} className="text-fantasy-stone hover:text-white">
                  ✕
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-white text-sm mb-1">Selecione o Dado</label>
                <div className="grid grid-cols-7 gap-1">
                  {(Object.keys(diceSides) as DiceType[]).map((dice) => (
                    <button
                      key={dice}
                      onClick={() => setSelectedDice(dice)}
                      className={`text-xs p-2 rounded ${
                        selectedDice === dice
                          ? 'bg-fantasy-purple text-white'
                          : 'bg-fantasy-dark/60 text-fantasy-stone border border-fantasy-purple/30'
                      }`}
                    >
                      {dice}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-white text-sm mb-1">Quantidade</label>
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-fantasy-dark/60 text-white p-1 rounded-l border border-fantasy-purple/30"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="bg-fantasy-dark/80 text-white text-center w-12 border-y border-fantasy-purple/30"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(20, quantity + 1))}
                    className="bg-fantasy-dark/60 text-white p-1 rounded-r border border-fantasy-purple/30"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={rollDice}
                disabled={isRolling}
                className="w-full bg-fantasy-gold text-fantasy-dark py-2 rounded font-medievalsharp"
              >
                {isRolling ? 'Rolando...' : `Rolar ${quantity}${selectedDice}`}
              </motion.button>
              
              {results.length > 0 && (
                <div className="mt-4 bg-fantasy-dark/60 p-2 rounded border border-fantasy-purple/30">
                  <div className="text-white text-sm mb-1">Resultado:</div>
                  <div className="flex flex-wrap gap-1">
                    {results.map((result, index) => (
                      <div 
                        key={index} 
                        className="bg-fantasy-purple/20 text-fantasy-gold p-1 rounded text-center min-w-[30px]"
                      >
                        {result}
                      </div>
                    ))}
                  </div>
                  <div className="text-fantasy-gold text-sm mt-2">
                    Total: {results.reduce((sum, roll) => sum + roll, 0)}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
