
import { Bell, MessageSquare, Settings } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Navbar = () => {
  const { user } = useAuth();
  const [xp, setXp] = useState(0);
  const [maxXp, setMaxXp] = useState(500);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) return;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('custom_metadata')
        .eq('id', user.id)
        .single();

      if (profile?.custom_metadata) {
        setLevel(profile.custom_metadata.character_level || 1);
        setXp(profile.custom_metadata.xp || 0);
        setMaxXp(500 * profile.custom_metadata.character_level || 500);
      }
    };

    fetchUserStats();
  }, [user]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-fantasy-purple/20 bg-fantasy-dark/90 backdrop-blur-sm px-4 py-2">
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
        
        <div className="flex-1 max-w-xs mx-4">
          <div className="text-center text-fantasy-gold text-sm mb-1">
            Nível {level}
          </div>
          <Progress value={(xp / maxXp) * 100} className="h-2 bg-fantasy-purple/20" />
          <div className="text-center text-fantasy-stone text-xs mt-1">
            {xp}/{maxXp} XP
          </div>
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
