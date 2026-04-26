# Escolinha do Inter — Sistema de Análise de Atletas

Plataforma de acompanhamento técnico, físico, tático e psicossocial para uma escolinha credenciada do **Sport Club Internacional** em Rio Grande/RS. Este repositório contém o **prototipo navegável** com todas as 17 telas mapeadas no brief, pré-cadastrado com o atleta **Felipe De David Fonseca** (matrícula 171273) para validação com o cliente.

## Acesso

🔗 https://escolinha-inter-saas.vercel.app/

Tela de login no início (público — basta clicar). Aceita "Entrar com Google" ou "Acesso visitante".

## Telas implementadas

**Operação:**
1. Visão geral (dashboard)
2. Atletas — lista + perfil completo (8 abas: visão geral · avaliações · vídeos · saúde & lesões · presenças · responsáveis · documentos)
3. Cadastro de atleta (5 etapas)
4. Avaliação de campo (modo offline · cronômetro)
5. Antropometria (com cálculo PHV — Mirwald)
6. Evolução (gráficos + percentil interno)
7. Turmas
8. Treinos (calendário)
9. Avaliações (catálogo + histórico)
10. Vídeos (upload + tagging)

**Saídas:**
11. Relatório trimestral pais (preview PDF + envio WhatsApp)
12. Dossiê técnico para o Internacional
13. Relatórios gerenciais

**Sistema:**
14. LGPD (consentimentos + exportação/exclusão)
15. Usuários (RBAC)
16. Trilha de auditoria

## Stack

Tecnologia minimalista, sem build:
- HTML5 + React 18 (UMD via unpkg)
- JSX compilado in-browser via Babel Standalone
- CSS puro com design tokens (paleta Internacional)
- DM Sans (sem-serif) + JetBrains Mono
- LocalStorage para persistência da sessão e foto

Sem backend. Dados seed em `mvp_base.jsx`. Para produção, ver brief original (`uploads/brief-ferramenta-analise-jogadores.md`) — proposta é Next.js 15 + Postgres + Auth.js.

## Rodar localmente

Não precisa instalar nada. Basta servir os arquivos estáticos:

```bash
npx serve .
# ou
python3 -m http.server 8000
```

Abra http://localhost:3000 (ou :8000).

## Estrutura

```
.
├── index.html              # entry point (login + app)
├── mvp.css                 # design system + responsivo
├── mvp_base.jsx            # ÚNICA fonte de dados do Felipe
├── mvp_shell.jsx           # Sidebar + Topbar + PageHome
├── mvp_athletes.jsx        # lista, perfil (8 abas), cadastro 5 etapas
├── mvp_tests.jsx           # avaliação campo, antropometria, evolução
├── mvp_reports.jsx         # relatório pais, dossiê Inter
├── mvp_system.jsx          # turmas, treinos, vídeos, LGPD, usuários, auditoria, gerenciais
├── assets/                 # logos
├── uploads/                # brief original do cliente
└── vercel.json             # config deploy estático
```

## Para mudar dados do Felipe

Editar `mvp_base.jsx` linhas 58–110 (objeto `ATHLETES[0]`).

## Roadmap (produto real)

- Multi-atleta + RBAC (coordenador / professor / responsável)
- Banco Postgres + Auth.js (Google OAuth) + Stack Auth
- Modo offline real para professor lançar avaliação no campo
- Upload e tagging de vídeo (Mux ou Cloudflare Stream)
- Dossiê para Inter com QR code + link expirável
- Dashboard gamificado para o atleta (sub-13+)

## LGPD

Os dados do Felipe presentes no código são **reais** (fornecidos pelo cliente). Em produção:
- Termo de consentimento dos responsáveis arquivado
- Dados de saúde criptografados em repouso
- Fotos em bucket privado com URL assinada
- Trilha de auditoria de quem acessou cada perfil
- 2FA para admin/coordenadores
