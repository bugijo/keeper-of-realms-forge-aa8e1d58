
import { Bell, MessageSquare, Settings } from 'lucide-react';
import PlayerStats from '../game/PlayerStats';

const Navbar = () => {
  return (
    <header className="border-b border-fantasy-purple/20 bg-fantasy-dark/90 backdrop-blur-sm px-4 py-2">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/03a33b04-e3b4-4b96-b0ab-e978d67fe3ee.png" 
              alt="Keeper of Realms" 
              className="h-10 w-10 object-contain" 
            />
            <h1 className="text-xl font-medievalsharp font-bold text-white hidden md:block">
              <span className="text-fantasy-gold">Keeper</span> of <span className="text-fantasy-accent">Realms</span>
            </h1>
          </div>
        </div>
        
        <div className="hidden md:block">
          <PlayerStats />
        </div>
        
        <div className="flex items-center gap-4">
          <button className="fantasy-icon text-fantasy-gold animate-pulse-glow">
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </button>
          
          <button className="fantasy-icon text-fantasy-purple">
            <MessageSquare size={18} />
          </button>
          
          <button className="fantasy-icon text-fantasy-purple">
            <Settings size={18} />
          </button>
          
          <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-fantasy-gold/50">
            <img 
              src="https://images.unsplash.com/photo-1501854140801-50d01698950b" 
              alt="Player Avatar" 
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
