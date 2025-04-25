
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Timer, Play, Pause } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SessionHeaderProps {
  sessionName: string;
  startTime: Date | null;
  onEndSession: () => void;
  isGameMaster: boolean;
}

const SessionHeader: React.FC<SessionHeaderProps> = ({
  sessionName,
  startTime,
  onEndSession,
  isGameMaster
}) => {
  const [elapsedTime, setElapsedTime] = useState<string>('00:00:00');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  useEffect(() => {
    if (!startTime || isPaused) return;
    
    const intervalId = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - startTime.getTime();
      
      const hours = Math.floor(diff / 3600000).toString().padStart(2, '0');
      const minutes = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
      const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
      
      setElapsedTime(`${hours}:${minutes}:${seconds}`);
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [startTime, isPaused]);
  
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  
  return (
    <div className="px-4 py-3 bg-fantasy-dark border-b border-fantasy-purple/30 flex justify-between items-center">
      <div className="flex items-center">
        <Link to="/tables" className="text-fantasy-stone hover:text-white mr-4">
          &larr; Voltar
        </Link>
        <h1 className="text-xl font-medievalsharp text-fantasy-gold">
          {sessionName || "Sessão de RPG"}
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-fantasy-gold" />
          <span className="font-mono text-lg text-white">{elapsedTime}</span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePause}
            className="ml-1"
          >
            {isPaused ? <Play size={18} /> : <Pause size={18} />}
          </Button>
        </div>
        
        {isGameMaster && (
          <Button 
            variant="destructive" 
            onClick={onEndSession}
            className="fantasy-button destructive"
          >
            Encerrar Sessão
          </Button>
        )}
      </div>
    </div>
  );
};

export default SessionHeader;
