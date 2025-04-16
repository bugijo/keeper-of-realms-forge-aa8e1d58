
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  logIn: (email: string, password: string) => Promise<{ error: any }>;
  logOut: () => Promise<void>;
  googleSignIn: () => Promise<void>;
  facebookSignIn: () => Promise<void>;
  anonymousSignIn: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Mensagens de notificação
const messages = {
  loginSuccess: (nome: string) => `🔥 Tochas Acesas! Bem-vindo, ${nome || 'Aventureiro'}!`,
  loginError: "🧙 Magia Falhou! Credenciais incorretas.",
  signupSuccess: "🛡️ Bem-vindo à Guilda! Verifique seu email.",
  signupError: "🪶 Pergaminho Danificado! Não foi possível criar conta.",
  accountLocked: "🛡️ Portal Bloqueado! Muitas tentativas.",
  resetPassword: "🔮 Feitiço Enviado! Verifique seu email.",
  logoutSuccess: "🌙 As tochas foram apagadas! Até a próxima aventura!",
  verifyEmail: "📜 Pergaminho enviado! Verifique seu email.",
  genericError: "🧝‍♂️ Por elfos! Algo deu errado."
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Configurar ouvinte de mudança de estado de autenticação PRIMEIRO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // DEPOIS verificar sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Funções de autenticação
  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      
      if (!error) {
        toast(messages.signupSuccess);
      }
      
      return { error };
    } catch (error) {
      toast.error(messages.signupError);
      return { error };
    }
  };

  const logIn = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (!error) {
        toast(messages.loginSuccess(data.user?.user_metadata?.name || ''));
      }
      
      return { error };
    } catch (error) {
      toast.error(messages.loginError);
      return { error };
    }
  };

  const logOut = async () => {
    await supabase.auth.signOut();
    toast(messages.logoutSuccess);
  };

  const googleSignIn = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
    } catch (error) {
      toast.error(messages.genericError);
    }
  };

  const facebookSignIn = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: window.location.origin
        }
      });
    } catch (error) {
      toast.error(messages.genericError);
    }
  };

  const anonymousSignIn = async () => {
    try {
      // Como o Supabase não tem login anônimo direto, vamos simular
      // usando um email temporário aleatório
      const randomEmail = `guest_${Math.random().toString(36).substring(2, 15)}@example.com`;
      const randomPassword = Math.random().toString(36).substring(2, 15);
      
      const { error } = await supabase.auth.signUp({
        email: randomEmail,
        password: randomPassword
      });
      
      if (!error) {
        toast(messages.loginSuccess("Aventureiro Anônimo"));
      }
    } catch (error) {
      toast.error(messages.genericError);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      logIn,
      logOut,
      googleSignIn,
      facebookSignIn,
      anonymousSignIn
    }}>
      {children}
    </AuthContext.Provider>
  );
};
