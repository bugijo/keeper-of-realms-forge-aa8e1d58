
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, User, ShoppingBag } from 'lucide-react';

interface MobileNavigationProps {
  className?: string;
}

export function MobileNavigation({ className }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const routes = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/character', label: 'Character', icon: User },
    { path: '/inventory', label: 'Inventory', icon: ShoppingBag },
  ];

  return (
    <div className={`md:hidden ${className}`}>
      {/* Mobile header with hamburger menu */}
      <div 
        className="mobile-medieval-header" 
        role="header"
      >
        <h1 className="text-fantasy-gold font-medievalsharp text-xl">
          Dungeon Keeper
        </h1>
        <button 
          onClick={toggleMenu}
          className="mobile-touch-target p-2 text-fantasy-gold"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-fantasy-dark/95 z-50 pt-16"
          role="navigation"
        >
          <div className="p-4 flex flex-col space-y-4">
            {routes.map((route) => {
              const Icon = route.icon;
              const isActive = location.pathname === route.path;
              
              return (
                <Link
                  key={route.path}
                  to={route.path}
                  className={`
                    flex items-center space-x-3 p-4 rounded-md
                    mobile-touch-target
                    ${isActive 
                      ? 'bg-fantasy-purple text-white' 
                      : 'bg-fantasy-dark text-fantasy-stone hover:bg-fantasy-purple/20'}
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon size={24} />
                  <span className="font-medievalsharp">{route.label}</span>
                </Link>
              );
            })}
            
            <button 
              className="mobile-medieval-button mt-8 w-full"
              onClick={() => setIsOpen(false)}
            >
              <span>Close Menu</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Mobile bottom navigation for quick access */}
      <div className="fixed bottom-0 left-0 right-0 bg-fantasy-dark border-t border-fantasy-purple/30 md:hidden">
        <div className="grid grid-cols-3 h-16">
          {routes.map((route) => {
            const Icon = route.icon;
            const isActive = location.pathname === route.path;
            
            return (
              <Link
                key={route.path}
                to={route.path}
                className={`
                  flex flex-col items-center justify-center
                  mobile-touch-target
                  ${isActive ? 'text-fantasy-gold' : 'text-fantasy-stone'}
                `}
              >
                <Icon size={20} />
                <span className="text-xs mt-1 font-medievalsharp">{route.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
