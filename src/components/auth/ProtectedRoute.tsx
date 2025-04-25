
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
        const paths = location.pathname.split('/');
        let tableId = "";
        
        // Find the table ID based on the parameter position
        for (let i = 0; i < paths.length - 1; i++) {
          if (paths[i] === tableIdParam) {
            tableId = paths[i + 1];
            break;
          }
        }
        
        // If no tableId found in URL path segments, try to get it from URL params
        if (!tableId) {
          const urlParams = new URLSearchParams(location.search);
          tableId = urlParams.get(tableIdParam) || "";
        }
        
        if (!tableId) {
          console.log("No table ID found in URL");
          setIsGM(false);
          setIsChecking(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('table_participants')
          .select('role')
          .eq('user_id', user.id)
          .eq('table_id', tableId)
          .eq('role', 'gm')
          .single();
          
        if (error) {
          console.error("Error checking GM status:", error);
          setIsGM(false);
        } else {
          setIsGM(!!data);
        }
      } catch (error) {
        console.error("Error checking GM status:", error);
        setIsGM(false);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkGMStatus();
  }, [user, requireGM, location.pathname, location.search, tableIdParam]);

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
    
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  
  if (requireGM && isGM === false) {
    toast.error("Acesso restrito", {
      description: "Apenas mestres podem acessar esta área",
    });
    
    return <Navigate to="/tables" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
