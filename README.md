# Onze

> A plataforma de quem forma atletas.

SaaS multi-tenant white-label para gestão e análise de jogadores de escolinhas de futebol. Cliente-zero: rede de franquias da Escola do Sport Club Internacional.

## Stack

- **Next.js 16** (App Router, Turbopack) + **TypeScript** + **Tailwind v3** + **shadcn/ui**
- **Drizzle ORM** + **Postgres** (Supabase)
- **Cloudflare R2** (mídia, PDFs)
- **Bunny / R2 + ffmpeg-wasm** (vídeo)
- **Resend** (e-mail) + **Evolution API** (WhatsApp)
- **Inngest** (jobs em background)
- Hospedagem: Vercel + Supabase + Fly.io (workers)

## Estrutura

```
onze/
├── app/
│   ├── (app)/              # área autenticada (sidebar + topbar)
│   │   ├── dashboard/      # início
│   │   └── atletas/        # CRUD atletas
│   ├── (auth)/             # área pública (login, signup)
│   │   └── login/
│   ├── globals.css         # tema Onze (paleta Inter como default)
│   └── layout.tsx
├── components/
│   ├── app-shell/          # sidebar + topbar (replica protótipo)
│   ├── ui/                 # shadcn/ui
│   └── onze-mark.tsx       # marca "11"
├── lib/
│   ├── db/                 # Drizzle schema, client, seed
│   ├── tenant.ts           # resolver multi-tenant
│   └── utils.ts            # helpers (idade, categoria, etc)
├── proxy.ts                # multi-tenant routing (Next 16 proxy)
├── drizzle.config.ts
└── legacy/                 # protótipo HTML/JSX original (referência visual)
```

## Setup local

```bash
# 1. Instalar deps
npm install

# 2. Copiar env e preencher
cp .env.local.example .env.local
# Edite .env.local com:
#   - DATABASE_URL (Supabase ou Postgres local)
#   - NEXT_PUBLIC_SUPABASE_URL / ANON_KEY (depois)

# 3. Rodar dev
npm run dev
```

Abre em http://localhost:3000 (redireciona para /login).

## Database

```bash
# Gerar migration a partir do schema
npm run db:generate

# Aplicar no banco
npm run db:migrate

# Studio (GUI do Drizzle)
npm run db:studio
```

Schema base inclui: `tenants`, `users`, `athletes`, `guardians`, `categories`, `audit_log`, com RLS planejado por `tenant_id`.

## Multi-tenancy

- **Estratégia:** Row-Level Security (Postgres) com `tenant_id` em toda tabela
- **Roteamento:**
  - `escola-inter.onzehq.com` → tenant `escola-inter` (subdomínio)
  - `app.escolainter.com.br` → custom domain (resolvido contra `tenants.custom_domain`)
  - `localhost:3000` → tenant default `escola-inter` (env `NEXT_PUBLIC_DEFAULT_TENANT`)
- **Theming:** CSS variables `--brand`, `--brand-soft`, `--brand-text` populadas por tenant via JSONB em `tenants.theme`. Default = paleta Inter (vermelho `#C8102E`).

## Status (Fase 0)

- [x] Estrutura Next.js 16 + TS + Tailwind + shadcn/ui
- [x] Tema Inter (CSS vars + dark mode)
- [x] Schema Drizzle base (8 tabelas)
- [x] Sidebar + topbar (replica do protótipo)
- [x] Páginas: `/login`, `/dashboard`, `/atletas` (mockadas)
- [x] Proxy multi-tenant (resolve slug a partir do host)
- [ ] Auth Supabase (Fase 1)
- [ ] CRUD real ligado ao DB (Fase 1)
- [ ] Avaliações + PDF + WhatsApp (Fase 1-2)

## Roadmap

Veja `~/brief-ferramenta-analise-jogadores.md` (brief completo, fora do repo) e o documento de plano consolidado.

| Fase | Escopo | Prazo |
|---|---|---|
| **0** | Foundation (este commit) | semana 1-2 |
| **1** | MVP fechado 50 fundadores: cadastros, avaliações, PDF, e-mail | semana 3-6 |
| **2** | Portal pais + WhatsApp + vídeo | semana 7-10 |
| **3** | Videoanálise, dossiê clube, gamificação | semana 11-14 |
| **4** | White-label completo + billing Stripe/Asaas | semana 15-16 |

## Convenções

- Nunca usar `#C8102E` ou outras cores Inter hardcoded em código de produção. Sempre `hsl(var(--brand))` ou classe `bg-brand`.
- Toda tabela com dado de tenant tem coluna `tenant_id` obrigatória.
- Toda chave estrangeira para `tenants.id` usa `onDelete: "cascade"`.
- Sem fontes serifadas. Sans-serif (DM Sans) + monospace (JetBrains Mono).
- Toda string para o usuário em pt-BR.
