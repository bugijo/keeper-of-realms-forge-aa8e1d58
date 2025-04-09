
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MapPin, User, Backpack } from "lucide-react";

const navItems = [
  { path: "/", icon: MapPin, label: "Missões" },
  { path: "/character", icon: User, label: "Personagem" },
  { path: "/inventory", icon: Backpack, label: "Inventário" },
];

export const MobileNavigation = () => {
  const location = useLocation();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-fantasy-dark border-t border-fantasy-purple/20 py-1 px-2 z-50">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-colors",
                isActive ? "text-fantasy-gold" : "text-fantasy-stone/70 hover:text-fantasy-stone"
              )}
            >
              <Icon className={cn(
                "w-6 h-6",
                isActive && "fill-fantasy-gold/10"
              )} />
              <span className="text-xs mt-1 font-medievalsharp">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
