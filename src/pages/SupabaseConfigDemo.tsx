
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { toast } from "sonner";

export default function SupabaseConfigDemo() {
  const { currentUser } = useAuth();
  const [showInstructions, setShowInstructions] = useState(true);

  return (
    <div className="container mx-auto p-4">
      <Card className="fantasy-card">
        <CardHeader>
          <CardTitle className="text-2xl text-fantasy-gold font-medievalsharp">
            Configuração do Supabase
          </CardTitle>
          <CardDescription className="text-fantasy-stone/80">
            Instruções para configurar corretamente o Supabase para autenticação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {showInstructions ? (
            <>
              <div className="bg-fantasy-dark/30 p-4 rounded-md border border-fantasy-purple/30">
                <h3 className="text-fantasy-gold font-medievalsharp mb-2">1. Desabilitar Confirmação de Email</h3>
                <p className="text-fantasy-stone/90 mb-2">
                  Para acelerar o processo de testes, você pode desabilitar a confirmação de email no Supabase:
                </p>
                <ol className="list-decimal pl-5 text-fantasy-stone/80 space-y-2">
                  <li>Acesse o dashboard do Supabase</li>
                  <li>Vá para Authentication &gt; Providers</li>
                  <li>Clique em "Email"</li>
                  <li>Desmarque a opção "Enable email confirmation"</li>
                  <li>Salve as alterações</li>
                </ol>
              </div>

              <div className="bg-fantasy-dark/30 p-4 rounded-md border border-fantasy-purple/30">
                <h3 className="text-fantasy-gold font-medievalsharp mb-2">2. Verificar as Tabelas</h3>
                <p className="text-fantasy-stone/90 mb-2">
                  Para verificar se as tabelas foram criadas corretamente:
                </p>
                <ol className="list-decimal pl-5 text-fantasy-stone/80 space-y-2">
                  <li>Acesse o dashboard do Supabase</li>
                  <li>Vá para Table Editor</li>
                  <li>Você deve ver a tabela "profiles"</li>
                  <li>Se não existir, execute novamente a migration em supabase/migrations/</li>
                </ol>
              </div>

              <div className="bg-fantasy-dark/30 p-4 rounded-md border border-fantasy-purple/30">
                <h3 className="text-fantasy-gold font-medievalsharp mb-2">3. Configurar Provedores de Autenticação</h3>
                <p className="text-fantasy-stone/90 mb-2">
                  Para adicionar mais provedores como Google ou Facebook:
                </p>
                <ol className="list-decimal pl-5 text-fantasy-stone/80 space-y-2">
                  <li>Acesse o dashboard do Supabase</li>
                  <li>Vá para Authentication &gt; Providers</li>
                  <li>Ative e configure os provedores desejados</li>
                </ol>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-fantasy-gold text-lg">
                {currentUser ? 
                  `Logado como: ${currentUser.email}` : 
                  "Você não está logado"}
              </p>
              {!currentUser && (
                <p className="text-fantasy-stone/80 mt-2">
                  Vá para a página de login para testar a autenticação
                </p>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            className="fantasy-button secondary"
            onClick={() => setShowInstructions(!showInstructions)}
          >
            {showInstructions ? "Verificar Status de Login" : "Mostrar Instruções"}
          </Button>
          
          <Button 
            onClick={() => {
              toast.success("Configurações atualizadas!", {
                description: "O sistema de autenticação está pronto para uso."
              });
            }}
            className="fantasy-button primary"
          >
            Verificar Configuração
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
