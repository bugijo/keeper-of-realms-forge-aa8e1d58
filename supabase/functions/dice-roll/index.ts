
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const supabaseClient = createClient(
      // Use a direct URL reference
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { formula, sessionId, isPrivate } = await req.json();

    // Verificar a entrada
    if (!formula || !sessionId) {
      return new Response(
        JSON.stringify({ error: 'Fórmula de dados e ID da sessão são necessários' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Analisar a fórmula dos dados
    const diceRegex = /(\d*)d(\d+)(?:([+-])(\d+))?/;
    const match = formula.match(diceRegex);
    
    if (!match) {
      return new Response(
        JSON.stringify({ error: 'Fórmula de dados inválida' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    const count = match[1] ? parseInt(match[1]) : 1;
    const sides = parseInt(match[2]);
    const hasModifier = match[3] !== undefined;
    const modifierSign = match[3] === '+' ? 1 : -1;
    const modifierValue = hasModifier ? parseInt(match[4]) : 0;
    
    // Rolar os dados
    const dice: number[] = [];
    for (let i = 0; i < count; i++) {
      dice.push(Math.floor(Math.random() * sides) + 1);
    }
    
    // Calcular o resultado
    const diceSum = dice.reduce((sum, value) => sum + value, 0);
    const result = hasModifier ? diceSum + (modifierSign * modifierValue) : diceSum;

    // Obter usuário atual da sessão
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Usuário não autenticado' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Salvar a rolagem no banco de dados
    const { data, error } = await supabaseClient
      .from('dice_rolls')
      .insert({
        session_id: sessionId,
        user_id: user.id,
        roll_formula: formula,
        roll_result: result,
        roll_details: {
          dice,
          modifier: hasModifier ? modifierSign * modifierValue : undefined
        },
        visible_to_all: !isPrivate
      })
      .select('*')
      .single();

    if (error) {
      console.error('Erro ao salvar rolagem:', error);
      throw error;
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        roll: data
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Erro:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
