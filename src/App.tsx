
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/SupabaseAuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { StrictMode, useEffect } from "react";
import { MobileNavigation } from "@/components/mobile/MobileNavigation";
import { SwipeableView } from "@/components/mobile/SwipeableView";
import { useResponsive } from "@/hooks/useResponsive";

// Pages
import Index from "./pages/Index";
import Inventory from "./pages/Inventory";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SupabaseConfigDemo from "./pages/SupabaseConfigDemo";
import Creations from "./pages/Creations";
import Tables from "./pages/Tables";
import Shop from "./pages/Shop";

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Mobile route handler with swipe navigation
const MobileRouteHandler = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile } = useResponsive();
  
  const routes = ['/', '/inventory', '/creations', '/tables', '/shop'];
  
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
      <MobileNavigation />
      <SwipeableView 
        onSwipeLeft={handleSwipeLeft} 
        onSwipeRight={handleSwipeRight}
        className="min-h-[calc(100vh-4rem)] overflow-y-auto pt-14 pb-16"
      >
        <main role="main">
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
              <Route path="/config-supabase" element={<SupabaseConfigDemo />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <MobileRouteHandler>
                    <Index />
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
              <Route path="/creations" element={
                <ProtectedRoute>
                  <MobileRouteHandler>
                    <Creations />
                  </MobileRouteHandler>
                </ProtectedRoute>
              } />
              <Route path="/tables" element={
                <ProtectedRoute>
                  <MobileRouteHandler>
                    <Tables />
                  </MobileRouteHandler>
                </ProtectedRoute>
              } />
              <Route path="/shop" element={
                <ProtectedRoute>
                  <MobileRouteHandler>
                    <Shop />
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
