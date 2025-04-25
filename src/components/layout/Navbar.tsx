import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { NotificationsDropdown } from '@/components/notifications/NotificationsDropdown';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logOut } = useAuth();
  const { setTheme } = useTheme();
  
  return (
    <nav className="bg-fantasy-dark/95 border-b border-fantasy-purple/30">
      <div className="container mx-auto py-4 px-6 flex items-center justify-between">
        <Link to="/" className="text-2xl font-medievalsharp text-white">
          Keeper of Realms
        </Link>
        
        {user ? (
          <div className="flex items-center gap-4">
            <NotificationsDropdown />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://avatars.dicebear.com/api/pixel-art-neutral/${user.email}.svg`} alt={user.email} />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem>
                  Olá, {user.user_metadata?.name || user.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  Usar tema do sistema
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <SunIcon className="mr-2 h-4 w-4" />
                  Claro
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <MoonIcon className="mr-2 h-4 w-4" />
                  Escuro
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logOut}>
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Button variant="secondary" onClick={() => navigate('/login')}>
              Entrar
            </Button>
            <Button onClick={() => navigate('/register')}>
              Cadastrar
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
