
import React from 'react';
import DiceRoller from './DiceRoller';

interface EnhancedDiceRollerProps {
  compact?: boolean;
}

const EnhancedDiceRoller: React.FC<EnhancedDiceRollerProps> = ({ compact = false }) => {
  return (
    <div className={compact ? "dice-roller-compact" : "dice-roller-full"}>
      <DiceRoller />
      {/* The compact prop is used only to modify the container styling */}
    </div>
  );
};

export default EnhancedDiceRoller;
