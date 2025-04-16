
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { toast } from "sonner";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
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

  return <>{children}</>;
};
