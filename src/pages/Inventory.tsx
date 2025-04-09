
import MainLayout from "@/components/layout/MainLayout";
import InventoryItem from "@/components/game/InventoryItem";
import { Package, Search, Filter } from "lucide-react";
import { useState } from "react";

// Inventory data
const inventoryItems = [
  {
    name: "Arcane Staff",
    description: "A powerful staff that channels magical energies.",
    rarity: "rare" as const,
    type: "Weapon - Staff",
    stats: {
      intelligence: 5,
      magicDamage: 15,
      manaRegen: 2
    },
    equipped: true
  },
  {
    name: "Elven Robes",
    description: "Light robes woven with enchanted elven silk.",
    rarity: "common" as const,
    type: "Armor - Cloth",
    stats: {
      defense: 8,
      magicResist: 12,
      movementSpeed: 3
    },
    equipped: true
  },
  {
    name: "Amulet of Wisdom",
    description: "Ancient amulet that enhances the wearer's magical abilities.",
    rarity: "epic" as const,
    type: "Accessory - Necklace",
    stats: {
      intelligence: 8,
      wisdom: 5,
      spellPower: 10
    },
    equipped: true
  },
  {
    name: "Boots of Swiftness",
    description: "Enchanted boots that allow the wearer to move with incredible speed.",
    rarity: "rare" as const,
    type: "Armor - Boots",
    stats: {
      movementSpeed: 15,
      dexterity: 3,
      evasion: 5
    },
    equipped: true
  },
  {
    name: "Dragonscale Shield",
    description: "A shield forged from the scales of an ancient dragon.",
    rarity: "epic" as const,
    type: "Armor - Shield",
    stats: {
      defense: 25,
      fireResist: 30,
      health: 50
    }
  },
  {
    name: "Enchanted Dagger",
    description: "A small but deadly dagger with arcane runes carved into the blade.",
    rarity: "rare" as const,
    type: "Weapon - Dagger",
    stats: {
      damage: 12,
      criticalChance: 8,
      attackSpeed: 15
    }
  },
  {
    name: "Ring of Protection",
    description: "A simple ring that provides magical protection to the wearer.",
    rarity: "common" as const,
    type: "Accessory - Ring",
    stats: {
      defense: 5,
      magicResist: 8,
      health: 15
    }
  },
  {
    name: "Phoenix Feather Cloak",
    description: "A majestic cloak made from the feathers of a phoenix, providing protection against fire and cold.",
    rarity: "legendary" as const,
    type: "Armor - Cloak",
    stats: {
      defense: 15,
      fireResist: 50,
      coldResist: 50,
      regeneration: 5
    }
  }
];

const Inventory = () => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  
  // Filter items based on current filter and search
  const filteredItems = inventoryItems.filter(item => {
    // Filter by type
    if (filter !== "all") {
      if (filter === "equipped" && !item.equipped) return false;
      if (filter === "unequipped" && item.equipped) return false;
    }
    
    // Filter by search term
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && 
        !item.description.toLowerCase().includes(search.toLowerCase()) &&
        !item.type.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  return (
    <MainLayout>
      <div className="container mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Package className="text-fantasy-gold" size={24} />
          <h2 className="text-2xl font-medievalsharp text-white">Inventory</h2>
        </div>
        
        {/* Inventory Controls */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="text-muted-foreground" size={16} />
            </div>
            <input 
              type="text" 
              className="bg-fantasy-dark border border-fantasy-purple/30 text-white text-sm rounded-lg block w-full pl-10 p-2.5 focus:ring-fantasy-purple focus:border-fantasy-purple"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <div className="flex items-center gap-2 bg-fantasy-dark border border-fantasy-purple/30 rounded-lg p-2">
              <Filter className="text-muted-foreground" size={16} />
              <select 
                className="bg-transparent border-none text-sm focus:ring-0 text-white"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Items</option>
                <option value="equipped">Equipped</option>
                <option value="unequipped">Unequipped</option>
              </select>
            </div>
            
            <button className="fantasy-button primary text-sm">Sort</button>
          </div>
        </div>
        
        {/* Inventory Stats */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Items", value: inventoryItems.length },
            { label: "Equipped", value: inventoryItems.filter(i => i.equipped).length },
            { label: "Capacity", value: `${inventoryItems.length}/20` },
            { label: "Gold Value", value: "2,450" }
          ].map((stat, index) => (
            <div key={index} className="fantasy-card p-3">
              <div className="text-xs text-muted-foreground">{stat.label}</div>
              <div className="text-lg font-medievalsharp">{stat.value}</div>
            </div>
          ))}
        </div>
        
        {/* Inventory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <InventoryItem key={index} {...item} />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <Package className="text-muted-foreground mb-2" size={48} />
              <p className="text-muted-foreground">No items found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Inventory;
