
import NotificationsDropdown from '@/components/notifications/NotificationsDropdown';

export const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-fantasy-dark border-b border-fantasy-purple/30 z-50">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-lg font-medievalsharp text-white">RPG Companion</span>
        </div>
        
        <div className="flex items-center gap-2">
          <NotificationsDropdown />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
