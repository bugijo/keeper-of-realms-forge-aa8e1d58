
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requireGM?: boolean;
  tableIdParam?: string;
}

export const ProtectedRoute = ({ 
  children, 
  requireGM = false, 
  tableIdParam = 'id' 
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isGM, setIsGM] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(requireGM);

  useEffect(() => {
    const checkGMStatus = async () => {
      if (!user || !requireGM) return;
      
      try {
        // Extract table ID from URL params
        const tableId = location.pathname.split('/').find(
          (part, index, arr) => arr[index - 1] === tableIdParam
        );
        
        if (!tableId) {
          setIsGM(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('table_participants')
          .select('role')
          .eq('user_id', user.id)
          .eq('table_id', tableId)
          .eq('role', 'gm')
          .single();
          
        setIsGM(!!data && !error);
      } catch (error) {
        console.error("Error checking GM status:", error);
        setIsGM(false);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkGMStatus();
  }, [user, requireGM, location.pathname, tableIdParam]);

  if (loading || isChecking) {
    return (
      <div className="h-screen flex justify-center items-center bg-fantasy-dark">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-fantasy-gold rounded-full animate-spin"></div>
          <p className="mt-4 text-fantasy-stone font-medievalsharp">Carregando o reino...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    toast("Você precisa estar logado para acessar esta área", {
      description: "Redirecionando para o portal de entrada...",
      action: {
        label: "Fechar",
        onClick: () => {},
      },
    });
    
    return <Navigate to="/login" replace />;
  }
  
  if (requireGM && isGM === false) {
    toast.error("Acesso restrito", {
      description: "Apenas mestres podem acessar esta área",
    });
    
    return <Navigate to="/tables" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
