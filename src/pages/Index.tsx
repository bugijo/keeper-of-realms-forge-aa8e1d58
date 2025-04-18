import MainLayout from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  TrophyIcon, 
  BookOpen, 
  Users, 
  MapPin,
  Scroll,
  Dice1,
  Sword,
  User,
  Skull
} from "lucide-react";
import { useAuth } from "@/contexts/SupabaseAuthContext";

const creationCards = [
  {
    title: "Criar Personagem",
    description: "Crie heróis e personagens para suas aventuras",
    icon: User,
    path: "/creations/characters",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80",
    category: "Personagens"
  },
  {
    title: "Criar Item",
    description: "Forje armas mágicas e itens lendários",
    icon: Sword,
    path: "/creations/items",
    imageUrl: "https://images.unsplash.com/photo-1599753894977-bc6c46401f15?auto=format&fit=crop&q=80",
    category: "Itens & Armas"
  },
  {
    title: "Criar Mapa",
    description: "Desenhe mapas de reinos e calabouços",
    icon: MapPin,
    path: "/creations/maps",
    imageUrl: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80",
    category: "Mapas"
  },
  {
    title: "Criar História",
    description: "Escreva aventuras épicas e contos mágicos",
    icon: BookOpen,
    path: "/creations/stories",
    imageUrl: "https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?auto=format&fit=crop&q=80",
    category: "Histórias"
  },
  {
    title: "Criar Monstro",
    description: "Crie criaturas terríveis para desafiar heróis",
    icon: Skull,
    path: "/creations/monsters",
    imageUrl: "https://images.unsplash.com/photo-1577493340887-b7bfff550145?auto=format&fit=crop&q=80",
    category: "Monstros"
  },
  {
    title: "Criar NPC",
    description: "Desenvolva personagens não jogáveis memoráveis",
    icon: Users,
    path: "/creations/npcs",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80",
    category: "NPCs"
  }
];

const featuredQuests = [
  {
    title: "Participar de 1 Mesa",
    progress: 0,
    max: 1,
    rewards: { xp: 200, gems: 50 },
    type: "Iniciante",
    description: "Junte-se a sua primeira mesa de RPG!"
  },
  {
    title: "Criar um Personagem",
    progress: 0,
    max: 1,
    rewards: { xp: 100, gems: 20 },
    type: "Criativo",
    description: "Crie seu primeiro herói!"
  }
];

const quickActions = [
  {
    title: "Encontrar Mesa",
    icon: Users,
    path: "/tables",
    description: "Encontre uma mesa para jogar"
  },
  {
    title: "Criar Personagem",
    icon: Scroll,
    path: "/character",
    description: "Crie seu próprio herói"
  },
  {
    title: "Tutorial",
    icon: BookOpen,
    path: "/tutorial",
    description: "Aprenda a jogar"
  },
  {
    title: "Rolar Dados",
    icon: Dice1,
    path: "/dice",
    description: "Teste sua sorte"
  }
];

const Index = () => {
  const { user } = useAuth();
  
  return (
    <MainLayout>
      <div className="container mx-auto pb-20">
        {/* Boas-vindas */}
        <section className="mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fantasy-card p-6"
          >
            <h1 className="text-2xl font-medievalsharp text-fantasy-gold mb-2">
              Bem-vindo{user?.user_metadata?.name ? `, ${user.user_metadata.name}` : ' Aventureiro'}!
            </h1>
            <p className="text-fantasy-stone">
              Prepare-se para uma jornada épica no mundo do RPG!
            </p>
          </motion.div>
        </section>

        {/* Ações Rápidas */}
        <section className="mb-8">
          <h2 className="text-xl font-medievalsharp text-white mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link 
                key={action.title} 
                to={action.path}
                className="fantasy-card p-4 hover:bg-fantasy-purple/10 transition-colors"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: index * 0.1 }
                  }}
                  className="flex flex-col items-center text-center"
                >
                  <action.icon className="w-8 h-8 text-fantasy-gold mb-2" />
                  <h3 className="font-medievalsharp text-white mb-1">{action.title}</h3>
                  <p className="text-xs text-fantasy-stone">{action.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Seção de Criação */}
        <section className="mb-8">
          <h2 className="text-xl font-medievalsharp text-white mb-4">Criações</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {creationCards.map((card, index) => (
              <div key={card.title} className="fantasy-card overflow-hidden bg-fantasy-dark/60 border border-fantasy-purple/30">
                <div className="h-48 w-full overflow-hidden">
                  <img 
                    src={card.imageUrl} 
                    alt={card.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-fantasy-purple/20">
                      <card.icon className="w-6 h-6 text-fantasy-purple" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medievalsharp text-white">{card.title}</h3>
                      <p className="text-sm text-fantasy-stone">{card.category}</p>
                    </div>
                  </div>
                  
                  <p className="text-fantasy-stone mb-6">{card.description}</p>
                  
                  <Link 
                    to={card.path}
                    className="block w-full text-center py-3 px-4 bg-fantasy-purple hover:bg-fantasy-purple/80 
                             text-white rounded-lg font-medievalsharp transition-colors"
                  >
                    {card.title}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Missões em Destaque */}
        <section>
          <h2 className="text-xl font-medievalsharp text-white mb-4">Missões em Destaque</h2>
          <div className="grid gap-4">
            {featuredQuests.map((quest, index) => (
              <motion.div
                key={quest.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: index * 0.2 }
                }}
                className="fantasy-card p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medievalsharp text-white">{quest.title}</h3>
                  <span className="bg-fantasy-purple text-white text-xs px-3 py-1 rounded-full">
                    {quest.type}
                  </span>
                </div>
                
                <p className="text-sm text-fantasy-stone mb-3">{quest.description}</p>
                
                <div className="mb-2">
                  <div className="w-full bg-fantasy-dark/70 h-3 rounded-full">
                    <div 
                      className="bg-gradient-to-r from-fantasy-purple to-fantasy-accent h-full rounded-full"
                      style={{ width: `${(quest.progress / quest.max) * 100}%` }}
                    />
                  </div>
                  <div className="text-center text-fantasy-gold/80 mt-1 text-sm">
                    {quest.progress}/{quest.max}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-fantasy-stone">
                  <TrophyIcon className="w-4 h-4 text-fantasy-gold" />
                  <span>{quest.rewards.xp} XP</span>
                  <span className="text-fantasy-gold">•</span>
                  <span>{quest.rewards.gems} 💎</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
