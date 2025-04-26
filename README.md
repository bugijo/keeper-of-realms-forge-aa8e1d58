
# Dungeon Master Assistant

Uma aplicação web para gerenciamento de campanhas e sessões de RPG de mesa.

## Configuração do Ambiente

### Requisitos
- Node.js v16+ e npm
- Conta no Supabase (para banco de dados e autenticação)

### Configuração das Variáveis de Ambiente

1. Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-do-supabase
```

2. Substitua os valores pelas suas credenciais do Supabase:
   - `VITE_SUPABASE_URL`: URL do seu projeto Supabase
   - `VITE_SUPABASE_ANON_KEY`: Chave anônima de API do seu projeto Supabase

Você pode encontrar essas informações no painel do Supabase em Configurações do Projeto > API.

### Instalação de Dependências

```bash
# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev

# Construir para produção
npm run build

# Executar testes
npm run test
```

## Diagrama de Fluxo de Sessões

```mermaid
sequenceDiagram
    participant GM as Mestre do Jogo
    participant API as Supabase
    participant Player as Jogador
    
    GM->>API: Cria Mesa
    API-->>GM: Retorna ID da Mesa
    
    GM->>API: Convida Jogadores
    API-->>Player: Notifica sobre convite
    
    Player->>API: Aceita Convite
    API-->>GM: Notifica aceitação
    
    GM->>API: Inicia Sessão
    API-->>Player: Notifica início de sessão
    
    par Tempo Real
        Player->>API: Atualiza posição no mapa
        API-->>GM: Sincroniza posição
        GM->>API: Revela área do mapa
        API-->>Player: Atualiza visibilidade do mapa
    end
    
    GM->>API: Finaliza sessão
    API-->>Player: Notifica fim de sessão
```

## Estrutura de Tabelas no Supabase

### Principais Tabelas e Endpoints

| Tabela | Descrição | Endpoint |
|--------|-----------|----------|
| `tables` | Mesas de jogo | `/tables` |
| `table_participants` | Participantes das mesas | `/table_participants` |
| `characters` | Personagens dos jogadores | `/characters` |
| `character_inventory` | Inventário dos personagens | `/character_inventory` |
| `session_tokens` | Tokens no mapa durante sessões | `/session_tokens` |
| `fog_of_war` | Controle de névoa de guerra | `/fog_of_war` |
| `chat_messages` | Mensagens no chat | `/chat_messages` |
| `notifications` | Sistema de notificações | `/notifications` |
| `maps` | Mapas das sessões | `/maps` |
| `stories` | Narrativas e histórias | `/stories` |
| `npcs` | NPCs do mundo | `/npcs` |
| `monsters` | Monstros para combate | `/monsters` |
| `items` | Itens do jogo | `/items` |
| `profiles` | Perfis de usuários | `/profiles` |

## Screenshots das Telas Principais

### Painel do Mestre
![Painel do Mestre](public/lovable-uploads/f6994451-b92c-48d9-be93-feaaf85bff8a.png)

### Mapa Tático
![Mapa Tático](public/lovable-uploads/03a33b04-e3b4-4b96-b0ab-e978d67fe3ee.png)

### Chat Durante Sessão
![Chat](public/lovable-uploads/85fed85e-846f-4915-b38f-351bb4efa9d3.png)

### Sistema de Combate
![Sistema de Combate](public/lovable-uploads/eff6f3ed-69ac-47c8-ada2-50d0852653dc.png)

### Inventário
![Inventário](public/lovable-uploads/c0ce5755-bcb5-423a-baec-11074d96c6cd.png)

## Funcionalidades Principais

- Gerenciamento de mesas e campanhas de RPG
- Sistema de inventário com drag-and-drop
- Chat em tempo real durante as sessões
- Mapa tático com névoa de guerra
- Notificações de sessões e eventos
- Sistema de combate em turnos

## Licença

MIT
