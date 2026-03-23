# 365 com Deus — Devocional Cristão Diário

Um ano de fidelidade na Palavra. Aplicação web de devocional diário, centrada em Cristo, com teologia reformada batista/presbiteriana.

## Tecnologias

- **Frontend:** Next.js 15, React 19, Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Row Level Security)
- **Notificações:** Web Push API
- **Deploy:** Vercel (recomendado)

## Configuração

### 1. Criar projecto Supabase

1. Vai a [supabase.com](https://supabase.com) e cria um projecto
2. No **SQL Editor**, corre o ficheiro `supabase/schema.sql` — isto cria as tabelas, políticas de segurança, triggers e funções
3. Em **Authentication > Providers**, activa:
   - Email (já activo por defeito)
   - Google (necessita de OAuth credentials da Google Cloud Console)
4. Em **Authentication > URL Configuration**, adiciona o URL do teu site nos Redirect URLs:
   - `http://localhost:3000/auth/callback` (desenvolvimento)
   - `https://teu-dominio.com/auth/callback` (produção)

### 2. Configurar variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Preenche com os valores do teu projecto Supabase:
- `NEXT_PUBLIC_SUPABASE_URL` — Settings > API > Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Settings > API > anon public key

Para notificações push:
```bash
npx web-push generate-vapid-keys
```

Coloca as keys geradas em `.env.local`.

### 3. Instalar e correr

```bash
npm install
npm run dev
```

A app estará em `http://localhost:3000`.

### 4. Deploy (Vercel)

```bash
npx vercel
```

Adiciona as variáveis de ambiente no painel da Vercel.

## Estrutura do Projecto

```
365-com-deus/
├── app/
│   ├── layout.tsx              # Layout raiz
│   ├── page.tsx                # Landing page
│   ├── auth/
│   │   ├── login/page.tsx      # Login / Registo
│   │   └── callback/route.ts   # OAuth callback
│   ├── (app)/                  # Rotas protegidas
│   │   ├── layout.tsx          # Layout com nav
│   │   ├── dashboard/page.tsx  # Dashboard principal
│   │   ├── devotional/
│   │   │   ├── [day]/page.tsx  # Devocional por dia
│   │   │   └── today/page.tsx  # Redirect para hoje
│   │   ├── calendar/page.tsx   # Calendário visual
│   │   └── notes/page.tsx      # Histórico de notas
│   └── api/
│       └── notifications/      # Web Push API
├── components/                 # Componentes React
├── hooks/                      # Hooks customizados
├── lib/                        # Configuração Supabase
├── data/                       # 365 devocionais
├── styles/                     # CSS global
├── public/                     # Assets e Service Worker
└── supabase/
    └── schema.sql              # Schema da base de dados
```

## Funcionalidades

- Devocional diário com contexto bíblico, explicação, aplicação e oração
- Plano de leitura de 365 dias (AT + NT equilibrado)
- Sistema de check diário com streak e progresso
- Calendário visual com dias concluídos
- Notas pessoais por devocional
- Modo de recuperação para dias perdidos
- Tema claro/escuro
- Notificações push configuráveis
- Login com email ou Google
- Mobile-first, PWA-ready

## Teologia

Conteúdo centrado em Deus, baseado exclusivamente na Bíblia (Sola Scriptura), com tom pastoral, sóbrio e reverente. Sem teologia da prosperidade, sem linguagem neopentecostal, sem emocionalismo vazio.
