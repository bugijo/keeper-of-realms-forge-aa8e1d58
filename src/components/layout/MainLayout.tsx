
import { ReactNode, useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { MobileNavigation } from '@/components/mobile/MobileNavigation';
import { useResponsive } from '@/hooks/useResponsive';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { isMobile } = useResponsive();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full bg-fantasy-gradient bg-fantasy-dark">
        <Navbar>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-2"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </Navbar>
        <div className="flex flex-1 w-full pt-14">
          <div className={`fixed z-40 h-full transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <Sidebar isOpen={sidebarOpen} />
          </div>
          <main className={`flex-1 p-4 ${isMobile ? 'pb-20 overflow-y-auto' : 'pb-8'}`}>
            {children}
          </main>
        </div>
        {isMobile && <MobileNavigation />}
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
