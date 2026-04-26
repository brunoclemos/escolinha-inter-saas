# Escolinha do Inter — Sistema de Análise de Atletas

Plataforma de acompanhamento técnico, físico, tático e psicossocial para uma escolinha credenciada do **Sport Club Internacional** em Rio Grande/RS. Este repositório contém o **prototipo navegável** da Fase 1 — focado no perfil completo de um único atleta (Felipe De David Fonseca, matrícula 171273) para validação com o cliente antes do build do produto multi-atleta.

## O que tem aqui

- **5 telas** responsivas (mobile + desktop) com a paleta do Internacional
  - Visão geral com linha do tempo, próximos compromissos e atalhos
  - Perfil completo (identificação, contato, endereço, escola, atributos, LGPD)
  - Avaliações com radar charts (técnica · tática · física · psicossocial)
  - Evolução com gráficos longitudinais (altura, peso, sprint 20m, CMJ, %BF)
  - Relatório trimestral imprimível (4 páginas A4 · "Salvar PDF" via navegador)
- **Login com Google** (Auth.js v5) — restringível por allowlist de e-mails
- **Tema Inter** — vermelho `#C8102E`, branco, grafite, fonte DM Sans (sem-serif)
- Estrutura preparada para adicionar Postgres + multi-atleta na próxima fase

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS + ícones Lucide
- Auth.js v5 (NextAuth) com provider Google
- Recharts para gráficos

## Rodar localmente

```bash
npm install
cp .env.example .env.local
# preencha AUTH_SECRET (rode: openssl rand -base64 32)
# preencha AUTH_GOOGLE_ID e AUTH_GOOGLE_SECRET (ver passo abaixo)
npm run dev
```

Abre em http://localhost:3000.

## 1. Criar credenciais do Google OAuth (5 min)

1. Vá em https://console.cloud.google.com/apis/credentials
2. Se não tiver projeto, crie um (canto superior esquerdo → "Selecionar projeto" → "Novo projeto" → nome `escolinha-inter-saas`).
3. Menu lateral esquerdo → **APIs e serviços** → **Tela de permissão OAuth**:
   - Tipo: **Externo** → Criar
   - Nome do app: `Escola do Inter`
   - E-mail de suporte: o seu Gmail
   - E-mail do desenvolvedor: o seu Gmail
   - Salvar e continuar até concluir (pode pular escopos e usuários de teste)
   - **Publicar app** (botão no painel da tela de permissão) → confirma. Sem isso, só e-mails de teste podem entrar.
4. Menu lateral → **APIs e serviços** → **Credenciais** → **Criar credenciais** → **ID do cliente OAuth**:
   - Tipo de aplicativo: **Aplicativo da Web**
   - Nome: `escolinha-inter-saas`
   - **Origens JavaScript autorizadas:**
     - `http://localhost:3000`
     - `https://SEU-DOMINIO-VERCEL.vercel.app` (depois do deploy)
   - **URIs de redirecionamento autorizados:**
     - `http://localhost:3000/api/auth/callback/google`
     - `https://SEU-DOMINIO-VERCEL.vercel.app/api/auth/callback/google` (depois)
   - Criar
5. Copie **Client ID** e **Client Secret** que aparecem na tela.

Cole no `.env.local`:

```env
AUTH_SECRET=...                   # openssl rand -base64 32
AUTH_GOOGLE_ID=...apps.googleusercontent.com
AUTH_GOOGLE_SECRET=GOCSPX-...
AUTH_ALLOWED_EMAILS=              # vazio = libera qualquer Google
```

Para restringir, ex.: `AUTH_ALLOWED_EMAILS=brunoclemos1997@gmail.com,paidobruno@email.com`

## 2. Deploy no Vercel (3 min)

1. Vá em https://vercel.com/new
2. Conecte sua conta GitHub se ainda não conectou.
3. Importe o repo `brunoclemos/escolinha-inter-saas`.
4. Em **Environment Variables**, adicione:
   - `AUTH_SECRET` (mesmo valor do `.env.local`)
   - `AUTH_GOOGLE_ID`
   - `AUTH_GOOGLE_SECRET`
   - `AUTH_ALLOWED_EMAILS` (vazio = aberto a qualquer Google)
5. Deploy. Vai gerar um domínio tipo `escolinha-inter-saas.vercel.app`.
6. **Volte no Google Cloud Console** (passo 1.4) e adicione o domínio Vercel nas origens JS e nos URIs de redirect (`https://...vercel.app/api/auth/callback/google`). Sem isso o login Google retorna `redirect_uri_mismatch`.

Pronto. O link `https://escolinha-inter-saas.vercel.app` é o que você manda pro seu pai.

## Estrutura do projeto

```
src/
├── app/
│   ├── (app)/                # rotas protegidas (precisam de login)
│   │   ├── layout.tsx        # checa sessão, monta Shell
│   │   ├── page.tsx          # Visão geral
│   │   ├── perfil/page.tsx   # Perfil completo
│   │   ├── avaliacoes/page.tsx
│   │   ├── evolucao/page.tsx
│   │   └── relatorio/page.tsx
│   ├── api/auth/[...nextauth]/route.ts
│   ├── login/page.tsx        # tela pública de login
│   └── globals.css
├── auth.ts                   # config Auth.js
├── middleware.ts             # protege todas as rotas exceto /login
├── components/
│   ├── Shell.tsx             # sidebar + topbar (drawer no mobile)
│   ├── AthleteHeader.tsx
│   ├── RadarCard.tsx
│   └── EvolutionChart.tsx
└── data/felipe.ts            # ÚNICA fonte de dados do atleta
```

Para mudar dados do Felipe, edite `src/data/felipe.ts`. Para mudar a marca/cores, `tailwind.config.ts` + `src/app/globals.css`.

## Roadmap (próximas fases)

- **Fase 2:** banco Postgres (Supabase/Neon) + Drizzle ORM, multi-atleta, CRUD, modo offline para o professor lançar avaliação no celular.
- **Fase 3:** upload e tagging de vídeo (Mux/Cloudflare Stream), dossiê para o Inter (PDF + link expirável), portal dos pais com mensagens.
- **Fase 4:** dashboard gamificado do atleta (sub-13+), relatórios gerenciais para a coordenação, módulo financeiro.

## LGPD

Este prototipo trata dados de menor de idade. Em produção:
- Termo de consentimento deve ser coletado e arquivado por escrito.
- Foto, dados de saúde e documentos devem ficar em bucket privado com URL assinada.
- Auditoria de acessos obrigatória.
- 2FA para admin e coordenadores.

Os dados do Felipe presentes no código são reais (fornecidos pelo cliente). Não compartilhe este repositório como público em produção sem consentimento formal dos responsáveis.
