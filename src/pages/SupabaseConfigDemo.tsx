
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function SupabaseConfigDemo() {
  const [tablesInfo, setTablesInfo] = useState<{name: string, exists: boolean}[]>([]);
  const [loading, setLoading] = useState(true);
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');

  const checkTables = async () => {
    try {
      setLoading(true);
      
      // Verificar tabela profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      setTablesInfo([
        { name: 'profiles', exists: !profilesError }
      ]);
      
      return !profilesError;
    } catch (error) {
      console.error('Erro ao verificar tabelas:', error);
      toast.error('Erro ao verificar tabelas. Veja o console para mais detalhes.');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    checkTables();
  }, []);

  const executarMigracoes = async () => {
    try {
      setLoading(true);
      setMigrationStatus('running');
      toast.info('Executando migrações do Supabase...');
      
      // Tente executar as migrações usando RPC (stored procedure)
      const { error: rpcError } = await supabase.rpc('execute_migrations', {
        migration_sql: `
-- Verificar se a tabela de perfis existe, se não, criar
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  custom_metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Garantir que RLS está ativado
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Criar políticas caso não existam
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can view their own profile'
    ) THEN
        CREATE POLICY "Users can view their own profile"
          ON public.profiles
          FOR SELECT
          USING (auth.uid() = id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can update their own profile'
    ) THEN
        CREATE POLICY "Users can update their own profile"
          ON public.profiles
          FOR UPDATE
          USING (auth.uid() = id);
    END IF;
END
$$;

-- Recriar a função para lidar com novos usuários
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email, custom_metadata)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    json_build_object(
      'last_login', now(),
      'character_level', 1
    )::jsonb
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recriar o trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
        `
      });
      
      if (rpcError) {
        console.error('Erro ao executar migrações via RPC:', rpcError);
        
        // Se o RPC falhar, informar ao usuário para usar o Editor SQL
        toast.error('Erro ao executar migrações automaticamente. Por favor, use o Editor SQL do Supabase.');
        setMigrationStatus('error');
      } else {
        toast.success('Migrações executadas com sucesso!');
        setMigrationStatus('success');
      }
      
      // Verificar se as tabelas foram criadas com sucesso
      const tablesExist = await checkTables();
      
      if (!tablesExist) {
        toast.warning('As migrações foram executadas, mas não foi possível verificar as tabelas. Por favor, verifique no Supabase.');
      }
    } catch (error) {
      console.error('Erro ao executar migrações:', error);
      toast.error('Erro ao executar migrações. Verifique o console para mais detalhes.');
      setMigrationStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const executarMigracaoSQL = () => {
    window.open('https://supabase.com/dashboard/project/iilbczoanafeqzjqovjb/editor', '_blank');
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="fantasy-card p-6 shadow-lg">
        <h1 className="text-2xl font-medievalsharp text-fantasy-gold mb-6">
          Configuração do Supabase
        </h1>
        
        <div className="space-y-6">
          <section className="border border-fantasy-purple/30 rounded-lg p-4">
            <h2 className="text-xl font-medievalsharp text-fantasy-gold mb-4">
              1. Status das Tabelas
            </h2>
            
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 border-t-2 border-fantasy-gold rounded-full animate-spin"></div>
                <p>Verificando tabelas...</p>
              </div>
            ) : (
              <div className="space-y-2">
                {tablesInfo.map((table) => (
                  <div key={table.name} className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full ${table.exists ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <p>
                      Tabela <span className="font-bold">{table.name}</span>: 
                      {table.exists ? ' Encontrada ✓' : ' Não encontrada ✗'}
                    </p>
                  </div>
                ))}
                
                {tablesInfo.some(t => !t.exists) && (
                  <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mt-4">
                    <p className="font-bold">Algumas tabelas não foram encontradas!</p>
                    <p>Você pode executar as migrações diretamente pelo Editor SQL do Supabase ou usar o botão abaixo para tentar executar as migrações automaticamente.</p>
                    
                    <div className="flex flex-col sm:flex-row gap-2 mt-3">
                      <Button 
                        onClick={executarMigracoes}
                        className="fantasy-button primary"
                        disabled={loading || migrationStatus === 'running'}
                      >
                        {loading ? 'Executando...' : 'Executar Migrações Automaticamente'}
                      </Button>
                      
                      <Button 
                        onClick={executarMigracaoSQL}
                        className="fantasy-button"
                      >
                        Abrir Editor SQL
                      </Button>
                    </div>
                    
                    {migrationStatus === 'success' && (
                      <div className="mt-3 p-2 bg-green-100 text-green-800 rounded">
                        Migrações executadas com sucesso! Verifique se as tabelas aparecem agora.
                      </div>
                    )}
                    
                    {migrationStatus === 'error' && (
                      <div className="mt-3 p-2 bg-red-100 text-red-800 rounded">
                        Houve um erro ao executar as migrações. Por favor, tente usar o Editor SQL diretamente.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-4">
              <Button 
                onClick={() => window.open('https://supabase.com/dashboard/project/iilbczoanafeqzjqovjb/editor', '_blank')}
                className="fantasy-button primary"
              >
                Abrir Editor SQL do Supabase
              </Button>
            </div>
          </section>
          
          <section className="border border-fantasy-purple/30 rounded-lg p-4">
            <h2 className="text-xl font-medievalsharp text-fantasy-gold mb-4">
              2. Configurar Autenticação
            </h2>
            
            <div className="space-y-4">
              <div className="bg-fantasy-dark/50 p-4 rounded-lg">
                <h3 className="font-medievalsharp text-fantasy-gold mb-2">Desabilitar Confirmação de Email</h3>
                <p className="text-fantasy-stone/90 mb-2">
                  Para facilitar os testes, recomendamos desabilitar a confirmação de email no Supabase.
                </p>
                <Button 
                  onClick={() => window.open('https://supabase.com/dashboard/project/iilbczoanafeqzjqovjb/auth/providers', '_blank')}
                  className="fantasy-button"
                >
                  Configurar Provedores de Autenticação
                </Button>
              </div>
              
              <div className="bg-fantasy-dark/50 p-4 rounded-lg">
                <h3 className="font-medievalsharp text-fantasy-gold mb-2">Adicionar Provedores OAuth</h3>
                <p className="text-fantasy-stone/90 mb-2">
                  Você pode adicionar provedores como Google e Facebook no painel do Supabase.
                </p>
                <Button 
                  onClick={() => window.open('https://supabase.com/dashboard/project/iilbczoanafeqzjqovjb/auth/providers', '_blank')}
                  className="fantasy-button"
                >
                  Configurar Provedores OAuth
                </Button>
              </div>
            </div>
          </section>
          
          <section className="border border-fantasy-purple/30 rounded-lg p-4">
            <h2 className="text-xl font-medievalsharp text-fantasy-gold mb-4">
              3. Verificar Usuários
            </h2>
            
            <p className="text-fantasy-stone/90 mb-4">
              Após criar usuários, você pode verificá-los no painel de administração do Supabase.
            </p>
            
            <Button 
              onClick={() => window.open('https://supabase.com/dashboard/project/iilbczoanafeqzjqovjb/auth/users', '_blank')}
              className="fantasy-button"
            >
              Ver Usuários Cadastrados
            </Button>
          </section>
        </div>
        
        <div className="mt-8 text-center">
          <Button 
            onClick={() => window.location.href = '/login'}
            className="fantasy-button primary"
          >
            Voltar para Login
          </Button>
        </div>
      </div>
    </div>
  );
}
