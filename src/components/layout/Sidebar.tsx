
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, User, Book, Map, Sword, Users, ShoppingCart, 
  Settings, Scroll, Skull, Shield, Crosshair
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  
  const links = [
    { to: '/', label: 'Início', icon: <Home size={20} /> },
    { to: '/character', label: 'Personagens', icon: <User size={20} /> },
    { to: '/creations/npc', label: 'NPCs', icon: <Users size={20} /> },
    { to: '/creations/monster', label: 'Monstros', icon: <Skull size={20} /> },
    { to: '/creations/item', label: 'Itens', icon: <Sword size={20} /> },
    { to: '/creations/map', label: 'Mapas', icon: <Map size={20} /> },
    { to: '/creations/story', label: 'Histórias', icon: <Book size={20} /> },
    { to: '/tables', label: 'Mesas', icon: <Scroll size={20} /> },
    { to: '/combat', label: 'Combate', icon: <Crosshair size={20} /> },
    { to: '/shop', label: 'Loja', icon: <ShoppingCart size={20} /> },
    { to: '/settings', label: 'Configurações', icon: <Settings size={20} /> },
  ];
  
  return (
    <div 
      className={cn(
        "fixed top-16 left-0 h-screen bg-fantasy-dark border-r border-fantasy-purple/20 transition-all duration-300 z-40",
        "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 py-4 overflow-y-auto scrollbar-hide">
          <ul className="space-y-2 px-2">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={cn(
                    "flex items-center p-2 rounded-lg transition-colors",
                    "hover:bg-fantasy-purple/10 hover:text-fantasy-gold",
                    location.pathname === link.to || location.pathname.startsWith(link.to + '/') 
                      ? "bg-fantasy-purple/20 text-fantasy-gold" 
                      : "text-fantasy-stone"
                  )}
                >
                  <div className="flex-shrink-0">
                    {link.icon}
                  </div>
                  <span className="ml-3 whitespace-nowrap">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
