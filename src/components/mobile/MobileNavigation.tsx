
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MapPin, User, Backpack, Scroll, Map, Sword, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { path: "/", icon: MapPin, label: "Missões" },
  { path: "/character", icon: User, label: "Personagem" },
  { path: "/inventory", icon: Backpack, label: "Inventário" },
  { path: "/creations", icon: Scroll, label: "Criações" },
  { path: "/tables", icon: Sword, label: "Mesas" },
  { path: "/shop", icon: ShoppingCart, label: "Loja" },
];

export const MobileNavigation = () => {
  const location = useLocation();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-fantasy-dark border-t border-fantasy-purple/20 py-1 px-2 z-50"
         style={{ boxShadow: `0 -2px 10px rgba(0,0,0,0.2)` }}>
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
              <motion.div
                whileTap={{ scale: 0.8 }}
                animate={isActive ? { 
                  y: [0, -5, 0],
                  transition: { 
                    duration: 0.4,
                    ease: "easeInOut",
                    times: [0, 0.5, 1]
                  }
                } : {}}
              >
                <Icon className={cn(
                  "w-6 h-6",
                  isActive && "fill-fantasy-gold/10"
                )} />
              </motion.div>
              <span className="text-xs mt-1 font-medievalsharp">
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 h-1 w-1/2 rounded-full bg-fantasy-gold"
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
