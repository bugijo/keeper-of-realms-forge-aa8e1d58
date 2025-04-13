
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full bg-fantasy-gradient bg-fantasy-dark">
        <Navbar />
        <div className="flex flex-1 w-full pt-14">
          <Sidebar />
          <main className="flex-1 p-4 pb-20">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
