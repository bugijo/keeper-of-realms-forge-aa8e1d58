
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function SupabaseConfigDemo() {
  const [tablesInfo, setTablesInfo] = useState<{name: string, exists: boolean}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkTables() {
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
      } catch (error) {
        console.error('Erro ao verificar tabelas:', error);
        toast.error('Erro ao verificar tabelas. Veja o console para mais detalhes.');
      } finally {
        setLoading(false);
      }
    }
    
    checkTables();
  }, []);

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
                    <p>Verifique se você executou as migrações no Supabase.</p>
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
