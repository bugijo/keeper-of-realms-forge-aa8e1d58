
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

### Banco de Dados Supabase

O projeto utiliza Supabase como banco de dados principal. Certifique-se de configurar as seguintes tabelas:

- characters
- character_inventory
- chat_messages
- tables
- table_participants
- table_join_requests
- profiles
- notifications

As políticas de segurança (RLS) devem ser configuradas para garantir que usuários só acessem seus próprios dados ou dados compartilhados.

## Design e Documentação

### Design no Figma

[Link para o Design no Figma](https://www.figma.com/file/seu-projeto-de-design)

### Documentação da API

A documentação detalhada dos endpoints e estruturas de dados pode ser encontrada na pasta `/docs`.

## Testes

Para executar os testes, use os comandos:

```bash
# Testes unitários
npm run test

# Testes E2E com Cypress
npm run cypress:open
```

## Features Principais

- Gerenciamento de mesas e campanhas de RPG
- Sistema de inventário com drag-and-drop
- Chat em tempo real durante as sessões
- Mapa tático com névoa de guerra
- Notificações de sessões e eventos

## Licença

MIT
