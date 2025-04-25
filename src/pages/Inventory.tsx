
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { MedievalButton } from "@/components/rpg/MedievalButton";
import { Link, useNavigate } from "react-router-dom";
import { 
  User2, 
  Sword, 
  MapPin, 
  BookOpen, 
  Skull, 
  Table as TableIcon,
  Search
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from 'sonner';

// Component to display the inventory
const Inventory = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [counts, setCounts] = useState({
    characters: 0,
    items: 0,
    maps: 0,
    stories: 0,
    monsters: 0,
    npcs: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch counts of different entity types from the database
  useEffect(() => {
    const fetchCounts = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Fetch NPCs count
        const { data: npcsData, error: npcsError } = await supabase
          .from('npcs')
          .select('id')
          .eq('user_id', user.id);
        
        if (npcsError) throw npcsError;

        // Fetch characters count (assuming characters table exists)
        const { data: charactersData, error: charactersError } = await supabase
          .from('characters')
          .select('id')
          .eq('user_id', user.id);

        if (charactersError) throw charactersError;

        // Fetch maps count
        const { data: mapsData, error: mapsError } = await supabase
          .from('maps')
          .select('id')
          .eq('user_id', user.id);

        if (mapsError) throw mapsError;

        // Fetch stories count
        const { data: storiesData, error: storiesError } = await supabase
          .from('stories')
          .select('id')
          .eq('user_id', user.id);

        if (storiesError) throw storiesError;

        // Update counts state
        setCounts({
          characters: charactersData?.length || 0,
          items: 0,  // Placeholder until items table is created
          maps: mapsData?.length || 0,
          stories: storiesData?.length || 0,
          monsters: 0,  // Placeholder until monsters table is created
          npcs: npcsData?.length || 0
        });

      } catch (error: any) {
        console.error("Error fetching inventory counts:", error);
        toast.error("Erro ao carregar dados do inventário");
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [user]);

  // Categories with real counts
  const inventoryCategories = [
    {
      title: "Personagens",
      icon: User2,
      description: "Heróis, vilões e todos os personagens que você criou",
      count: counts.characters,
      action: "Ver Personagens",
      path: "/character"
    },
    {
      title: "Itens & Armas",
      icon: Sword,
      description: "Armas mágicas, itens encantados e tesouros em seu inventário",
      count: counts.items,
      action: "Ver Itens",
      path: "/items"
    },
    {
      title: "Mapas",
      icon: MapPin,
      description: "Mapas de reinos, cidades e calabouços que você criou",
      count: counts.maps,
      action: "Ver Mapas",
      path: "/maps"
    },
    {
      title: "Histórias",
      icon: BookOpen,
      description: "Aventuras, missões e histórias que você elaborou",
      count: counts.stories,
      action: "Ver Histórias",
      path: "/stories"
    },
    {
      title: "Monstros",
      icon: Skull,
      description: "Criaturas e monstros para desafiar seus jogadores",
      count: counts.monsters,
      action: "Ver Monstros",
      path: "/monsters"
    },
    {
      title: "NPCs",
      icon: TableIcon,
      description: "NPCs e personagens não jogáveis",
      count: counts.npcs,
      action: "Ver NPCs",
      path: "/npcs"
    }
  ];
  
  return (
    <MainLayout>
      <div className="container mx-auto pb-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-medievalsharp text-white mb-1">Seu Inventário</h1>
            <p className="text-fantasy-stone">Veja e gerencie todas as suas criações e itens</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fantasy-stone" size={18} />
              <input
                type="text"
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2 w-full bg-fantasy-dark/30 border border-fantasy-purple/20 rounded-lg text-white focus:outline-none focus:border-fantasy-purple/60"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="fantasy-card p-6 animate-pulse">
                <div className="h-12 w-12 bg-fantasy-purple/30 rounded-full mb-4 mx-auto"></div>
                <div className="h-6 bg-fantasy-dark/50 rounded mb-2 w-3/4 mx-auto"></div>
                <div className="h-4 bg-fantasy-dark/30 rounded mb-4 w-full"></div>
                <div className="h-4 bg-fantasy-dark/30 rounded mb-1 w-full"></div>
                <div className="h-4 bg-fantasy-dark/30 rounded mb-4 w-3/4"></div>
                <div className="h-8 bg-fantasy-dark/40 rounded-full mb-4 w-1/3 mx-auto"></div>
                <div className="h-10 bg-fantasy-purple/20 rounded-lg w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {inventoryCategories.map((category, index) => (
              <div key={index} className="fantasy-card p-6 flex flex-col items-center">
                <category.icon className="text-fantasy-purple w-12 h-12 mb-4" />
                <h2 className="text-2xl font-medievalsharp text-fantasy-purple mb-2">{category.title}</h2>
                <p className="text-center text-fantasy-stone mb-4">{category.description}</p>
                
                <div className="mt-auto w-full">
                  <div className="bg-fantasy-dark/40 rounded-full py-2 px-4 text-center mb-4">
                    <span className="font-medievalsharp text-fantasy-gold">{category.count} itens</span>
                  </div>
                  
                  <button
                    className="w-full hover:scale-103 active:scale-98 transition-transform bg-fantasy-purple text-white py-3 rounded-lg font-medievalsharp"
                    onClick={() => navigate(category.path)}
                  >
                    {category.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Inventory;
