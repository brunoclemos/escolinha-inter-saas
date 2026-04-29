# BRIEF COMPLETO — Sistema de Análise e Desenvolvimento de Jogadores
**Cliente:** Escolinha credenciada do Sport Club Internacional
**Categorias atendidas:** Sub-5 até Sub-17
**Objetivo:** Ferramenta interna de análise, acompanhamento de evolução e geração de relatórios para pais e para o clube parceiro (Internacional).

---

## 1. CONTEXTO E POSICIONAMENTO

A escolinha é credenciada ao Sport Club Internacional e atende crianças e adolescentes de 5 a 17 anos. Hoje, as avaliações são feitas de forma informal. Precisamos profissionalizar esse processo por três motivos:

1. **Desenvolvimento do atleta** — acompanhar evolução física, técnica, tática e psicológica com dados ao longo do tempo.
2. **Diferencial competitivo frente a outras escolinhas** — entregar relatório profissional de evolução aos pais a cada trimestre. Nenhuma escolinha da região faz isso de forma estruturada.
3. **Ponte com o Internacional** — exportar dossiê técnico completo do atleta promissor para o departamento de Avaliações Técnicas das Categorias de Base e para o programa INTERligando Ideias, facilitando testes e captação.

**Meta de maturidade:** sistema equivalente ao que grandes clubes usam (Wyscout, Hudl, InStat, LongoMatch, Nacsport, Catapult), adaptado à realidade de uma escolinha.

---

## 2. REFERÊNCIAS DE MERCADO (BENCHMARK)

Ferramentas que clubes profissionais e academias de base usam hoje — o sistema deve **inspirar-se nas capacidades** destas, não copiar:

| Ferramenta | Uso | O que aproveitar |
|---|---|---|
| **Hudl / Wyscout** | Videoanálise + banco de dados global de atletas | Perfil do jogador com histórico visual + estatísticas |
| **InStat** | Vídeo + estatísticas por jogador | Cards individuais com métricas evolutivas |
| **LongoMatch** (open-source) | Videoanálise para formação | Tagging de ações em vídeos de treino |
| **Nacsport** | Eventos táticos | Categorização de ações técnicas |
| **Catapult** | GPS + wearables | Carga de treino e monitoramento físico |
| **E-Scout** | Banco de atletas de base BR | Modelo de ficha do atleta |
| **CUJU / Footbao / Scoutium** | IA em vídeo para análise de talentos jovens | Relatórios automáticos por IA a partir de vídeos curtos |
| **CBF Academy — modelo de avaliação** | Técnica + tática + física + psicológica | Nosso protocolo segue essas 4 dimensões |
| **Protocolo ISAK** | Padrão antropométrico internacional | Nossas medidas corporais seguem ISAK |

**Gap que a ferramenta fecha:** nenhuma dessas é acessível e adaptada a escolinhas com sub-5 a sub-17 que precisam gerar comunicação para pais + dossiê para clube parceiro.

---

## 3. PÚBLICOS E PERMISSÕES (RBAC)

- **Coordenador técnico / Admin** — acesso total (CRUD de atletas, professores, avaliações, relatórios, exportações).
- **Professor / Avaliador** — lança avaliações da(s) turma(s) dele, vê histórico dos atletas que treina.
- **Pais / Responsáveis** — acesso somente-leitura ao perfil e relatórios do próprio filho, via login.
- **Atleta (sub-13+)** — visualização do próprio dashboard gamificado (evoluções, metas, medalhas).
- **Contato Inter (opcional, futuro)** — link expirável e protegido para dossiê exportado.

---

## 4. MODELO DE DADOS

### 4.1. Atleta (cadastro base)
- Foto (frontal + perfil + corpo inteiro com camisa da escolinha)
- Nome completo, data de nascimento (gera categoria automática), CPF (opcional), RG
- Nacionalidade, naturalidade, endereço
- Nome e contato dos responsáveis (pai, mãe, tutor), e-mail, WhatsApp
- Escola regular, série, turno
- Autorização de uso de imagem (LGPD — upload do termo assinado)
- Plano de saúde, contato de emergência, tipo sanguíneo, alergias, medicações contínuas, condições preexistentes, uso de óculos/lentes
- **Como entrou na escolinha:** origem (indicação / peneira / rede social / outro), data de entrada, professor responsável pela captação, impressão inicial (texto livre)
- Pé dominante, posição principal, posições secundárias
- Clube anterior (se houver) + tempo de prática
- Sonho / objetivo do atleta (texto livre)

### 4.2. Avaliação Antropométrica (a cada 3 meses — **recomendação científica: 30–90 dias**)
- Altura (cm) — estadiômetro
- Peso (kg) — balança 100g precisão
- Envergadura (cm)
- Perímetros: tórax, cintura, quadril, coxa, panturrilha, braço
- Dobras cutâneas (tríceps, subescapular, suprailíaca, abdominal, coxa, panturrilha) — protocolo ISAK
- % de gordura corporal (calculado)
- % de massa magra (calculado)
- IMC (calculado + classificação por idade)
- Somatotipo (endomorfo / mesomorfo / ectomorfo) — calculado
- **Maturação biológica** (PHV — Pico de Velocidade de Crescimento, método Mirwald) — idade biológica estimada vs. idade cronológica. **Crítico para base** — explica por que um sub-14 pode parecer “mais forte” só porque maturou cedo.
- Observações do fisioterapeuta / preparador físico

### 4.3. Avaliação Física (bateria por faixa etária — ver seção 5)
Cada teste guarda: data, valor, unidade, avaliador, condição (campo seco/molhado, turno), observação.

### 4.4. Avaliação Técnica (nota 1–10 + comentário por fundamento)
- Condução de bola
- Passe curto / longo
- Recepção / domínio
- Finalização (pé dominante / não-dominante)
- Cabeceio
- Desarme / marcação
- Drible / 1 contra 1
- Cobrança de bola parada (idades aplicáveis)
- Jogo aéreo
- Fundamentos específicos por posição (ex.: goleiro tem bateria própria: pegada, reposição, saída de gol, defesa de pênalti)

### 4.5. Avaliação Tática (1–10 + comentário)
- Leitura de jogo / tomada de decisão
- Posicionamento
- Movimentação sem bola
- Cobertura / transições
- Cumprimento da função tática
- Compreensão do sistema

### 4.6. Avaliação Psicológica / Socioemocional (1–10 + comentário)
- Concentração / foco
- Liderança
- Competitividade / raça
- Resiliência (reação ao erro, ao placar adverso)
- Disciplina / comportamento
- Trabalho em equipe / comunicação
- Frequência / pontualidade
- Relação com os pais / familiares (observação discreta)

### 4.7. Saúde e Lesões
- Histórico de lesões (tipo, data, afastamento, retorno)
- Atestados médicos
- Check-up anual (upload PDF)

### 4.8. Jogos e Treinos
- Registro de presenças
- Estatísticas por jogo: minutos, gols, assistências, cartões, posição que jogou, nota do professor
- Upload de vídeos / clipes destacados

---

## 5. PROTOCOLOS DE AVALIAÇÃO POR FAIXA ETÁRIA

**REGRA DE OURO:** criança não é adulto em miniatura. A bateria muda conforme idade. Não aplicar teste intenso (ex.: Yo-Yo, RAST) em criança pequena.

### 5.1. Sub-5 a Sub-7 (5–7 anos) — **Fase de Descoberta**
Foco: coordenação, lateralidade, ludicidade. **Nada de testes de esforço máximo.**
- Coordenação motora geral (KTK adaptado — equilíbrio em trave, saltos laterais, transferência em plataformas)
- Lateralidade definida? (dominância)
- Noção espacial (circuito lúdico)
- Controle de bola básico (domínio, condução em zigue-zague)
- Observação comportamental (alegria em jogar, socialização, atenção)

### 5.2. Sub-8 a Sub-10 (8–10 anos) — **Fase de Iniciação**
- Tudo da fase anterior +
- Sprint 10m
- Salto horizontal parado (impulsão em membros inferiores)
- Teste de condução em slalom (técnica + velocidade)
- Passe alvo (precisão)
- Finalização em alvos (precisão — não potência)
- Jogo reduzido para avaliação tática básica (3x3, 4x4)

### 5.3. Sub-11 a Sub-13 (11–13 anos) — **Fase de Aprendizagem Específica**
- Tudo da fase anterior +
- Sprint 20m
- Illinois Agility Test (agilidade)
- T-Test (agilidade com mudança de direção)
- Counter Movement Jump (CMJ) — salto vertical
- Yo-Yo Intermittent Recovery Test Nível 1 (resistência aeróbia intermitente)
- Shuttle Run
- **Monitorar PHV com atenção** — fase de maior variação maturacional

### 5.4. Sub-14 a Sub-17 (14–17 anos) — **Fase de Treinamento / Especialização**
- Bateria completa:
  - Sprint 10m, 20m, 30m
  - Sprint lançado 20m (velocidade máxima)
  - Illinois Agility, T-Test, Teste do Quadrado
  - CMJ, Squat Jump (SJ), Drop Jump
  - Yo-Yo IR1 e/ou IR2
  - **RAST** (Running-based Anaerobic Sprint Test — 6x35m com 10s intervalo)
  - Teste de flexibilidade (sentar-e-alcançar)
  - FMS (Functional Movement Screen) — triagem de qualidade do movimento / prevenção de lesão

### 5.5. Avaliação Técnica / Tática / Psicológica
Aplicada em **todas as faixas** com perguntas adaptadas por idade. Coordenador define o questionário ativo por categoria.

---

## 6. MÓDULOS DO SISTEMA

### 6.1. Cadastro e Gestão de Atletas
CRUD completo, busca, filtros (categoria, posição, professor, status), timeline do atleta.

### 6.2. Avaliações
- Formulários dinâmicos por categoria (o sistema sabe qual bateria aplicar dado o sub-X).
- Modo campo: tablet/celular, funciona offline, sincroniza depois (PWA com IndexedDB + sync).
- Cronômetro integrado para testes de sprint.
- Cálculos automáticos (% gordura, somatotipo, PHV, IMC por idade).

### 6.3. Evolução e Comparativos
- Gráficos longitudinais de cada métrica (linha do tempo a cada reavaliação).
- Radar chart do atleta (dimensões técnica, tática, física, psicológica) — com overlay da avaliação anterior para ver evolução visual.
- Percentil contra o grupo da mesma categoria (ex.: “seu filho está no top 20% em sprint 20m do sub-12 da escolinha”).
- Tabela normativa (quando houver dados de referência científica — ex.: CMJ esperado por idade).

### 6.4. Videoanálise (simplificada)
- Upload de vídeos de treino / jogo.
- Tagging de momentos (gol, drible, passe decisivo, erro de posicionamento).
- Gerar clipe curto por tag (exportável em MP4).
- Playlist por atleta: “os melhores lances do João no último trimestre”.

### 6.5. Portal dos Pais
- Login individual.
- Dashboard do filho: foto, categoria, posição, professor, frequência do mês.
- Relatório trimestral em PDF (baixável — ver seção 7).
- Próximos jogos / avaliações.
- Canal de comunicação com coordenação (mensagens).
- Autorizações e documentos (upload/assinatura digital).

### 6.6. Dashboard do Atleta (sub-13+)
Gamificado: medalhas (“evolução em velocidade”, “100% de presença no mês”), metas pessoais, streak de treinos, ranking interno opcional (por categoria).

### 6.7. Dossiê para o Internacional
Exportação do perfil completo do atleta promissor em PDF + link web protegido:
- Foto + dados pessoais
- Histórico na escolinha
- Evolução antropométrica com gráficos
- Resultados de todos os testes físicos vs. referência
- Avaliação técnica/tática/psicológica consolidada
- Vídeos-destaque (3–5 clipes curtos)
- Parecer técnico final do coordenador
- QR Code com link expirável para o dossiê online

### 6.8. Relatórios Gerenciais
Para a coordenação: rotatividade de alunos, evolução média por turma, professor com maior retenção, lesões recorrentes, fluxo de novos alunos por origem.

### 6.9. Financeiro (opcional / fase 2)
Mensalidade, inadimplência, recibos — ou integração com sistema que o cliente já usa.

---

## 7. RELATÓRIOS (OUTPUTS)

### 7.1. Relatório Trimestral para Pais (PDF A4, 4–6 páginas)
- Capa com logo da escolinha + Inter + foto do atleta
- Página 1: dados + resumo executivo do trimestre (texto gerado pelo professor com auxílio de templates)
- Página 2: evolução física (gráfico antes/depois + comentário)
- Página 3: habilidades técnicas/táticas (radar)
- Página 4: destaque em vídeo (QR code abrindo clipe)
- Página 5: metas para o próximo trimestre
- Tom: **positivo, formativo, nunca comparativo entre crianças**

### 7.2. Dossiê Inter (PDF + link web)
Formato técnico, denso, inspirado em ficha de scout Wyscout/InStat.

### 7.3. Ficha Interna de Acompanhamento
Para o professor — evolução semanal + anotações de treino.

---

## 8. UI / UX

**Estilo visual:**
- Paleta baseada nas cores do Internacional (vermelho #C8102E + branco) com neutro (grafite/cinza escuro) para profissionalismo.
- Tipografia sem-serifa moderna (Inter, DM Sans, Manrope) — **NÃO USAR FONTES SERIFADAS.**
- Layout limpo, cards, muito espaço em branco.
- Mobile-first (professor no campo usa celular/tablet).
- Ícones consistentes (Lucide ou Phosphor).
- Dark mode opcional.

**UX:**
- Lançamento de avaliação em 30 segundos por atleta no celular.
- Busca global com atalho (⌘K) para admin.
- Fotos dos atletas em todos os cards — identidade visual.
- Gráficos limpos (Recharts ou visx).
- Acessível (contraste AA, teclado-navegável).

**Não usar:**
- Fontes serif (parecem IA/datadas).
- Depoimentos falsos em nenhuma tela.
- Ícones genéricos de stock sem personalidade.

---

## 9. SEGURANÇA, LGPD E ÉTICA

**CRÍTICO — lidando com menores:**
- Consentimento explícito dos responsáveis (termo assinado arquivado no sistema).
- Dados de saúde criptografados em repouso.
- Fotos armazenadas em bucket privado com URL assinada e expiração curta.
- Log de auditoria (quem acessou qual perfil, quando).
- Exportação e exclusão de dados sob demanda do responsável (direito LGPD).
- Nenhuma integração com redes sociais sem consentimento.
- Backup diário + versionamento.
- 2FA para admin e coordenadores.

---

## 10. STACK TÉCNICA RECOMENDADA

**Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Recharts
**Backend:** Next.js API routes + tRPC (ou Hono)
**Banco:** PostgreSQL (Supabase ou Neon) — relacional é o certo para esse domínio
**ORM:** Drizzle ou Prisma
**Auth:** Clerk ou Supabase Auth (suporta roles)
**Storage:** Supabase Storage ou Cloudflare R2 (fotos e vídeos)
**PDFs:** react-pdf ou Puppeteer server-side
**Offline / PWA:** next-pwa + IndexedDB para modo campo
**Deploy:** Vercel (frontend) + Supabase (DB/Storage)
**Vídeo:** Mux ou Cloudflare Stream para upload/transcoding/player

**Justificativa:** stack moderno, rápido de entregar, baixo custo de manutenção, excelente DX — o Claude Code domina tudo isso.

---

## 11. MVP (ENTREGA 1) vs. ROADMAP

### MVP — 4 semanas
- Cadastro de atleta com foto, dados básicos e responsáveis
- Avaliação antropométrica + física (bateria por categoria)
- Avaliação técnica/tática/psicológica (formulário 1–10)
- Dashboard do atleta com gráficos de evolução
- Relatório trimestral em PDF para pais
- Autenticação admin + professor
- LGPD básica (termo de consentimento)

### Fase 2 — 4 semanas
- Portal dos pais (login + PDF + mensagens)
- Videoanálise simplificada (upload + tag + clipes)
- Dossiê para o Inter (PDF + link web)
- Radar chart comparativo + percentis

### Fase 3
- Dashboard gamificado do atleta
- Relatórios gerenciais
- Módulo financeiro (ou integração)
- IA para análise automática de vídeo (inspirado em CUJU/Footbao) — pode usar Claude Vision / modelos de pose estimation

---

## 12. CRITÉRIOS DE ACEITE DO MVP

- [ ] Cadastrar 1 atleta completo em < 5 min
- [ ] Lançar bateria de avaliação completa em < 10 min pelo celular
- [ ] Gerar PDF trimestral para pais em < 30 s
- [ ] Gráfico de evolução exibe no mínimo 2 avaliações comparáveis
- [ ] Funciona offline no campo e sincroniza ao voltar o sinal
- [ ] Passa em checklist LGPD básico
- [ ] Responsivo em iPhone SE (tela pequena) e tablet

---

## 13. ENTREGÁVEIS ESPERADOS DO CLAUDE CODE

1. Repositório Git inicializado
2. README com instruções de rodar localmente
3. Schema do banco (migrations)
4. Seeds com dados de exemplo (1 escolinha, 5 atletas fictícios, 3 avaliações cada)
5. Todas as páginas/telas listadas nos módulos
6. Autenticação funcionando com 3 roles (admin, professor, responsável)
7. 1 PDF de exemplo gerado e anexado ao repo
8. Deploy em Vercel + Supabase com link funcional
9. Documentação mínima: como cadastrar atleta, como lançar avaliação, como gerar relatório

---

## 14. O QUE **NÃO** FAZER

- Não inventar funcionalidades fora desse escopo sem perguntar.
- Não usar fontes serifadas.
- Não gerar depoimentos ou dados fictícios em telas de produção (só em seeds).
- Não comparar publicamente um atleta com outro no portal dos pais (ético).
- Não expor dados de saúde em lista/tabela — só dentro do perfil protegido.
- Não armazenar imagem de menor sem termo de consentimento registrado.

---

**Instrução final ao Claude Code:** comece pelo schema do banco e pela estrutura de navegação. Antes de escrever código de negócio, mostre-me as 8 telas principais em wireframe (pode ser shadcn puro) e o diagrama ER. Depois disso, implementamos módulo a módulo começando pelo cadastro de atleta → antropometria → bateria física → relatório PDF. Cada módulo entregue e testado antes de seguir.
