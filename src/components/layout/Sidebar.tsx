
import { 
  Sidebar as ShadcnSidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Home, Sword, Book, Shield, ChestIcon, Map, Compass, LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";

const menuItems = [
  {
    title: "Home",
    icon: Home,
    path: "/"
  },
  {
    title: "Quests",
    icon: Compass,
    path: "/quests"
  },
  {
    title: "Character",
    icon: Sword,
    path: "/character"
  },
  {
    title: "Inventory",
    icon: ChestIcon,
    path: "/inventory" 
  },
  {
    title: "Guilds",
    icon: Shield,
    path: "/guilds"
  },
  {
    title: "Spellbook",
    icon: Book,
    path: "/spellbook"
  },
  {
    title: "World Map",
    icon: Map,
    path: "/world-map"
  }
];

const Sidebar = () => {
  return (
    <>
      <ShadcnSidebar className="border-r border-fantasy-purple/20 bg-fantasy-dark/80 backdrop-blur-sm">
        <SidebarContent>
          <div className="md:hidden p-4">
            <PlayerStatsCompact />
          </div>
          
          <SidebarGroup>
            <SidebarGroupLabel className="font-medievalsharp text-lg text-fantasy-gold">
              Adventures
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.path} className="flex items-center gap-2">
                        <item.icon className="text-fantasy-purple" size={18} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <div className="absolute bottom-4 left-0 right-0 px-4">
            <div className="fantasy-card p-3 flex flex-col items-center">
              <div className="text-xs text-fantasy-gold font-medievalsharp mb-1">Daily Login</div>
              <div className="w-full grid grid-cols-7 gap-1">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <div 
                    key={day} 
                    className={`h-5 w-5 rounded-full flex items-center justify-center text-xs border ${
                      day <= 3 
                        ? "bg-fantasy-purple/50 border-fantasy-purple text-white" 
                        : "bg-fantasy-dark/50 border-fantasy-purple/30 text-fantasy-purple/50"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SidebarContent>
      </ShadcnSidebar>
      <div className="fixed bottom-4 right-4 md:hidden z-50">
        <SidebarTrigger asChild>
          <button className="h-12 w-12 rounded-full bg-fantasy-purple text-white flex items-center justify-center shadow-lg">
            <LayoutGrid size={20} />
          </button>
        </SidebarTrigger>
      </div>
    </>
  );
};

// Mobile stats component
const PlayerStatsCompact = () => {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-fantasy-gold">
        <img 
          src="https://images.unsplash.com/photo-1501854140801-50d01698950b" 
          alt="Player Avatar" 
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <div className="font-medievalsharp text-sm">Level 5</div>
          <div className="flex items-center gap-1">
            <div className="text-fantasy-gold text-sm">300/500 XP</div>
          </div>
        </div>
        <div className="w-full h-1.5 bg-fantasy-dark rounded-full mt-1">
          <div className="h-full bg-gradient-to-r from-fantasy-purple to-fantasy-accent rounded-full" style={{ width: '60%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
