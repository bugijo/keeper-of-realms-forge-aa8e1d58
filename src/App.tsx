
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/SupabaseAuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { StrictMode, useEffect } from "react";
import { FooterTabs } from "@/components/rpg/FooterTabs";
import { SwipeableView } from "@/components/mobile/SwipeableView";
import { useResponsive } from "@/hooks/useResponsive";

// Pages
import Index from "./pages/Index";
import Character from "./pages/Character";
import Inventory from "./pages/Inventory";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Mobile route handler with swipe navigation
const MobileRouteHandler = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile } = useResponsive();
  
  const routes = ['/', '/character', '/inventory'];
  
  const handleSwipeLeft = () => {
    if (!isMobile) return;
    
    const currentIndex = routes.indexOf(location.pathname);
    if (currentIndex < routes.length - 1) {
      navigate(routes[currentIndex + 1]);
    }
  };
  
  const handleSwipeRight = () => {
    if (!isMobile) return;
    
    const currentIndex = routes.indexOf(location.pathname);
    if (currentIndex > 0) {
      navigate(routes[currentIndex - 1]);
    }
  };
  
  useEffect(() => {
    // Adjust viewport for mobile
    if (isMobile) {
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
      }
    }
  }, [isMobile]);
  
  return isMobile ? (
    <>
      <FooterTabs />
      <SwipeableView 
        onSwipeLeft={handleSwipeLeft} 
        onSwipeRight={handleSwipeRight}
        className="min-h-[calc(100vh-4rem)]"
      >
        <main role="main" className="pb-16">
          {children}
        </main>
      </SwipeableView>
    </>
  ) : (
    <>{children}</>
  );
};

const App = () => (
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <MobileRouteHandler>
                    <Index />
                  </MobileRouteHandler>
                </ProtectedRoute>
              } />
              <Route path="/character" element={
                <ProtectedRoute>
                  <MobileRouteHandler>
                    <Character />
                  </MobileRouteHandler>
                </ProtectedRoute>
              } />
              <Route path="/inventory" element={
                <ProtectedRoute>
                  <MobileRouteHandler>
                    <Inventory />
                  </MobileRouteHandler>
                </ProtectedRoute>
              } />
              
              {/* Rotas adicionais */}
              <Route path="/skills" element={
                <ProtectedRoute>
                  <MobileRouteHandler>
                    <NotFound />
                  </MobileRouteHandler>
                </ProtectedRoute>
              } />
              <Route path="/achievements" element={
                <ProtectedRoute>
                  <MobileRouteHandler>
                    <NotFound />
                  </MobileRouteHandler>
                </ProtectedRoute>
              } />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);

export default App;
