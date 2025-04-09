import MainLayout from "@/components/layout/MainLayout";
import QuestCard from "@/components/game/QuestCard";
import CharacterCard from "@/components/game/CharacterCard";
import TreasureChest from "@/components/game/TreasureChest";
import { Scroll, Sword, HandMetal, Brain, Heart, Activity, Shield } from "lucide-react";

const quests = [
  {
    title: "The Forgotten Tomb",
    description: "Explore the ancient tomb beneath the Whispering Woods and retrieve the lost artifact.",
    difficulty: 3,
    rewards: {
      xp: 250,
      gold: 500,
      items: ["Common Sword", "Health Potion"]
    },
    progress: 0,
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05"
  },
  {
    title: "Dragon's Lair",
    description: "Defeat the dragon terrorizing the local village and claim its treasure.",
    difficulty: 5,
    rewards: {
      xp: 500,
      gold: 1000,
      items: ["Dragon Scale Armor", "Fire Gem", "Gold Ring"]
    },
    progress: 0,
    imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e"
  },
  {
    title: "The Dark Forest",
    description: "Clear the path through the dark forest to establish a safe trade route.",
    difficulty: 2,
    rewards: {
      xp: 150,
      gold: 300,
      items: ["Ranger's Bow"]
    },
    progress: 35,
    imageUrl: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb"
  }
];

const characterStats = [
  { name: "Health", value: 250, max: 250 },
  { name: "Mana", value: 120, max: 150 },
  { name: "Strength", value: 18 },
  { name: "Dexterity", value: 14 },
  { name: "Intelligence", value: 12 },
  { name: "Constitution", value: 16 }
];

const Index = () => {
  return (
    <MainLayout>
      <div className="container mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Scroll className="text-fantasy-gold" size={24} />
          <h2 className="text-2xl font-medievalsharp text-white">Welcome, Adventurer</h2>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Character */}
          <div className="lg:col-span-1 space-y-6">
            <CharacterCard 
              name="Elyndra"
              level={5}
              class="Mage"
              race="Elf"
              stats={characterStats}
              imageUrl="https://images.unsplash.com/photo-1466442929976-97f336a657be"
            />
            
            <div className="fantasy-card">
              <div className="flex items-center gap-2 mb-4">
                <Sword className="text-fantasy-purple" size={18} />
                <h3 className="font-medievalsharp">Daily Tasks</h3>
              </div>
              
              <div className="space-y-3">
                {[
                  { text: "Complete 2 quests", complete: true },
                  { text: "Defeat 5 monsters", complete: true },
                  { text: "Collect 3 rare items", complete: false },
                  { text: "Upgrade 1 equipment", complete: false }
                ].map((task, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                      task.complete 
                        ? "bg-fantasy-purple/20 border-fantasy-purple" 
                        : "border-fantasy-purple/30"
                    }`}>
                      {task.complete && <div className="h-2 w-2 rounded-full bg-fantasy-purple"></div>}
                    </div>
                    <span className={`text-sm ${task.complete ? "line-through text-muted-foreground" : ""}`}>
                      {task.text}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-3 border-t border-fantasy-purple/20">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>2/4</span>
                </div>
                <div className="h-1.5 bg-fantasy-dark rounded-full mt-1">
                  <div className="h-full bg-gradient-to-r from-fantasy-purple to-fantasy-accent rounded-full w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Middle Column - Quests */}
          <div className="lg:col-span-2 space-y-6">
            <div className="fantasy-card">
              <div className="flex items-center gap-2 mb-4">
                <HandMetal className="text-fantasy-gold" size={18} />
                <h3 className="font-medievalsharp">Active Quests</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quests.map((quest, index) => (
                  <QuestCard key={index} {...quest} />
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TreasureChest 
                type="common"
                contents="Common equipment and resources"
                cost={{ type: 'gold', amount: 100 }}
              />
              
              <TreasureChest 
                type="rare"
                contents="Rare equipment and resources"
                cost={{ type: 'gems', amount: 50 }}
              />
              
              <TreasureChest 
                type="legendary"
                contents="Legendary item guaranteed!"
                unlockTime="2d 12h"
              />
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-fantasy-purple" size={18} />
            <h3 className="font-medievalsharp">Character Attributes</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: Heart, name: "Vitality", value: 45, color: "text-red-400" },
              { icon: Sword, name: "Attack", value: 78, color: "text-orange-400" },
              { icon: Shield, name: "Defense", value: 62, color: "text-blue-400" },
              { icon: Brain, name: "Magic", value: 95, color: "text-fantasy-purple" },
              { icon: Activity, name: "Speed", value: 70, color: "text-green-400" },
              { icon: HandMetal, name: "Luck", value: 55, color: "text-fantasy-gold" }
            ].map((stat, index) => (
              <div key={index} className="fantasy-card p-3">
                <div className="flex flex-col items-center">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${stat.color} bg-fantasy-dark`}>
                    <stat.icon size={20} />
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-xs text-muted-foreground">{stat.name}</div>
                    <div className="text-lg font-medievalsharp">{stat.value}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
