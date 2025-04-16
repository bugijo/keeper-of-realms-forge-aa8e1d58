
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
  updateUserProfile: (displayName: string) => Promise<void>;
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
        
        // Mostrar mensagem de boas-vindas no login
        if (event === 'SIGNED_IN' && session) {
          toast.success(messages.loginSuccess(session.user?.user_metadata?.name || ''));
        }
        
        // Mostrar mensagem de logout
        if (event === 'SIGNED_OUT') {
          toast.success(messages.logoutSuccess);
        }
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
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: window.location.origin + '/login'
        }
      });
      
      if (!error) {
        toast.success(messages.signupSuccess);
      } else {
        toast.error(error.message);
      }
      
      return { error };
    } catch (error: any) {
      toast.error(messages.signupError);
      return { error };
    }
  };

  const logIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        toast.error(messages.loginError);
      }
      
      return { error };
    } catch (error: any) {
      toast.error(messages.loginError);
      return { error };
    }
  };

  const logOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    }
  };

  const googleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/login',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });
      
      if (error) {
        console.error("Erro ao autenticar com Google:", error);
        toast.error(error.message);
        throw error;
      }
    } catch (error: any) {
      console.error("Exceção ao autenticar com Google:", error);
      toast.error(messages.genericError);
      throw error;
    }
  };

  const facebookSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: window.location.origin + '/login',
          scopes: 'public_profile,email'
        }
      });
      
      if (error) {
        console.error("Erro ao autenticar com Facebook:", error);
        toast.error(error.message);
        throw error;
      }
    } catch (error: any) {
      console.error("Exceção ao autenticar com Facebook:", error);
      toast.error(messages.genericError);
      throw error;
    }
  };

  const anonymousSignIn = async () => {
    try {
      // Como o Supabase não tem login anônimo direto, vamos criar uma conta temporária
      const randomEmail = `demo_${Math.random().toString(36).substring(2, 15)}@example.com`;
      const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      // Primeiro, fazemos login diretamente (sem registro prévio)
      const { error: signInError, data } = await supabase.auth.signInWithPassword({
        email: randomEmail,
        password: randomPassword
      });
      
      // Se não conseguir fazer login (esperado, pois o usuário não existe), criamos um
      if (signInError) {
        const { error: signUpError } = await supabase.auth.signUp({
          email: randomEmail,
          password: randomPassword,
          options: {
            data: {
              name: "Aventureiro Anônimo"
            }
          }
        });
        
        if (signUpError) {
          console.error("Erro ao criar usuário anônimo:", signUpError);
          toast.error(messages.genericError);
          throw signUpError;
        }
        
        // Agora fazemos login com o usuário criado
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: randomEmail,
          password: randomPassword
        });
        
        if (loginError) {
          console.error("Erro ao fazer login anônimo:", loginError);
          toast.error(messages.genericError);
          throw loginError;
        }
        
        toast.success(messages.loginSuccess("Aventureiro Anônimo"));
      } else {
        // Caso o usuário já exista (improvável)
        toast.success(messages.loginSuccess("Aventureiro Anônimo"));
      }
    } catch (error: any) {
      console.error("Exceção ao criar login anônimo:", error);
      toast.error(messages.genericError);
      throw error;
    }
  };

  const updateUserProfile = async (displayName: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { name: displayName }
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }
    } catch (error: any) {
      toast.error("Erro ao atualizar perfil: " + error.message);
      throw error;
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
      anonymousSignIn,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
