import { Bell, MessageSquare, Settings, Gem, Coins } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUserBalance } from '@/hooks/useUserBalance';

const Navbar = () => {
  const { user } = useAuth();
  const { gems, coins, loading } = useUserBalance();
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
        const metadata = profile.custom_metadata as { character_level?: number; xp?: number };
        setLevel(metadata.character_level || 1);
        setXp(metadata.xp || 0);
        setMaxXp(500 * (metadata.character_level || 1));
      }
    };

    fetchUserStats();
  }, [user]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-fantasy-purple/20 bg-fantasy-dark/90 backdrop-blur-sm px-4 py-2">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo section */}
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
        
        {/* Character stats section */}
        <div className="flex items-center gap-6">
          {/* Currency display */}
          <div className="flex items-center gap-4 bg-fantasy-dark/30 px-4 py-2 rounded-lg border border-fantasy-purple/20">
            <div className="flex items-center gap-2">
              <Gem className="text-emerald-400" size={16} />
              <span className="text-sm font-medium text-white">{loading ? '...' : gems}</span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="text-yellow-400" size={16} />
              <span className="text-sm font-medium text-white">{loading ? '...' : coins}</span>
            </div>
          </div>
          
          {/* Level and XP */}
          <div className="min-w-[200px]">
            <div className="text-center text-fantasy-gold text-sm font-medievalsharp">
              Nível {level}
            </div>
            <Progress value={(xp / maxXp) * 100} className="h-2 bg-fantasy-purple/20" />
            <div className="text-center text-fantasy-stone text-xs mt-1">
              {xp}/{maxXp} XP
            </div>
          </div>
        </div>
        
        {/* User actions section */}
        <div className="flex items-center gap-4">
          <button className="fantasy-icon-button group relative">
            <Bell size={18} className="text-fantasy-gold" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
            <span className="sr-only">Notificações</span>
          </button>
          
          <button className="fantasy-icon-button group relative">
            <MessageSquare size={18} className="text-fantasy-purple" />
            <span className="sr-only">Mensagens</span>
          </button>
          
          <button className="fantasy-icon-button group relative">
            <Settings size={18} className="text-fantasy-purple" />
            <span className="sr-only">Configurações</span>
          </button>
          
          <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-fantasy-gold/50">
            <img 
              src="https://images.unsplash.com/photo-1501854140801-50d01698950b" 
              alt="Avatar do Jogador" 
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
