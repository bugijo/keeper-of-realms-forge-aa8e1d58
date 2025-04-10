import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Define the user type for our app
export interface DungeonKeeperUser extends User {
  customMetadata?: {
    lastLogin: Date;
    characterLevel: number;
  };
}

interface AuthContextType {
  currentUser: DungeonKeeperUser | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  logIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updateUserProfile: (displayName: string) => Promise<void>;
  googleSignIn: () => Promise<{ error: AuthError | null }>;
  facebookSignIn: () => Promise<{ error: AuthError | null }>;
  anonymousSignIn: () => Promise<{ error: AuthError | null }>;
  verifyEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Notification messages
const messages = {
  loginSuccess: (name: string) => `🔥 Tochas Acesas! Bem-vindo, ${name || 'Aventureiro'}!`,
  loginError: "🧙 Magia Falhou! Credenciais incorretas.",
  signupSuccess: "🛡️ Bem-vindo à Guilda! Verifique seu email.",
  signupError: "🪶 Pergaminho Danificado! Não foi possível criar conta.",
  accountLocked: "🛡️ Portal Bloqueado! Muitas tentativas.",
  resetPassword: "🔮 Feitiço Enviado! Verifique seu email.",
  logoutSuccess: "🌙 As tochas foram apagadas! Até a próxima aventura!",
  verifyEmail: "📜 Pergaminho enviado! Verifique seu email.",
  genericError: "🧝‍♂️ Por elfos! Algo deu errado."
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<DungeonKeeperUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Create a Supabase user profile
  async function createUserProfile(user: User) {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          display_name: user.user_metadata?.name || user.email?.split('@')[0] || 'Aventureiro',
          custom_metadata: {
            last_login: new Date().toISOString(),
            character_level: 1
          }
        }, { onConflict: 'id' });

      if (error) {
        console.error("Error creating user profile:", error);
      }
    } catch (error) {
      console.error("Error in createUserProfile:", error);
    }
  }

  async function signUp(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (!error) {
        toast(messages.signupSuccess);
      } else {
        toast.error(messages.signupError);
      }
      
      return { error };
    } catch (error) {
      console.error("Sign up error:", error);
      toast.error(messages.signupError);
      return { error: error as AuthError };
    }
  }

  async function logIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error && data.user) {
        toast(messages.loginSuccess(data.user.user_metadata?.name || ''));
      } else {
        toast.error(messages.loginError);
      }
      
      return { error };
    } catch (error) {
      console.error("Login error:", error);
      toast.error(messages.loginError);
      return { error: error as AuthError };
    }
  }

  async function logOut() {
    try {
      await supabase.auth.signOut();
      toast(messages.logoutSuccess);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(messages.genericError);
    }
  }

  async function resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (!error) {
        toast(messages.resetPassword);
      } else {
        toast.error(messages.genericError);
      }
      
      return { error };
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(messages.genericError);
      return { error: error as AuthError };
    }
  }

  async function updateUserProfile(displayName: string) {
    try {
      if (!currentUser) return;
      
      const { error } = await supabase.auth.updateUser({
        data: { name: displayName }
      });
      
      if (error) {
        throw error;
      }
      
      // Update the profile record
      await supabase
        .from('profiles')
        .update({ display_name: displayName })
        .eq('id', currentUser.id);
      
      // Update local state
      setCurrentUser(prev => prev ? { ...prev, user_metadata: { ...prev.user_metadata, name: displayName } } : null);
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error(messages.genericError);
    }
  }

  async function googleSignIn() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (!error) {
        // The success message will be shown after redirect
      } else {
        toast.error(messages.genericError);
      }
      
      return { error };
    } catch (error) {
      console.error("Google sign in error:", error);
      toast.error(messages.genericError);
      return { error: error as AuthError };
    }
  }

  async function facebookSignIn() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (!error) {
        // The success message will be shown after redirect
      } else {
        toast.error(messages.genericError);
      }
      
      return { error };
    } catch (error) {
      console.error("Facebook sign in error:", error);
      toast.error(messages.genericError);
      return { error: error as AuthError };
    }
  }

  async function anonymousSignIn() {
    try {
      // Supabase doesn't have direct anonymous auth, so we'll create a random email
      const anonymousEmail = `anon_${Math.random().toString(36).substring(2)}@anonymous.com`;
      const anonymousPassword = Math.random().toString(36).substring(2);
      
      const { error } = await supabase.auth.signUp({
        email: anonymousEmail,
        password: anonymousPassword,
        options: {
          data: {
            name: "Aventureiro Anônimo"
          }
        }
      });
      
      if (!error) {
        toast(messages.loginSuccess("Aventureiro Anônimo"));
        localStorage.setItem('anonymousUser', JSON.stringify({ email: anonymousEmail, password: anonymousPassword }));
      } else {
        toast.error(messages.genericError);
      }
      
      return { error };
    } catch (error) {
      console.error("Anonymous sign in error:", error);
      toast.error(messages.genericError);
      return { error: error as AuthError };
    }
  }

  async function verifyEmail() {
    // Not directly applicable in Supabase's flow, but we'll keep the function for API compatibility
    toast(messages.verifyEmail);
    return Promise.resolve();
  }

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setCurrentUser(session?.user as DungeonKeeperUser);
        
        // If user just signed in, create/update their profile
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(() => {
            createUserProfile(session.user);
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCurrentUser(session?.user as DungeonKeeperUser);
      
      if (session?.user) {
        setTimeout(() => {
          createUserProfile(session.user);
        }, 0);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value: AuthContextType = {
    currentUser,
    session,
    loading,
    signUp,
    logIn,
    logOut,
    resetPassword,
    updateUserProfile,
    googleSignIn,
    facebookSignIn,
    anonymousSignIn,
    verifyEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
