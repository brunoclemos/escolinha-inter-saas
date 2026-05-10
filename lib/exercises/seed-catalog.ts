import type { NewExercise } from "@/lib/db/schema";

/**
 * Catálogo Onze de exercícios — base em metodologias públicas de
 * escolas top de futebol e literatura clássica.
 *
 * Fontes:
 *  - La Masia (FC Barcelona) — rondós e juego de posición
 *  - Ajax Academy — metodologia TIPS (Technique, Insight, Personality, Speed)
 *  - CBF Academy — formação por categorias e dimensões
 *  - Coerver Coaching — desenvolvimento técnico individual
 *  - Manchester City Academy / Pep Guardiola — positional play
 *  - Pep Lijnders / Liverpool — pressing e transição
 *  - Periodização Tática (Vítor Frade)
 *  - Pedagogia esportiva (Júlio Garganta, Pablo Greco)
 *  - Manuais públicos de federações (FA, FPF, RFEF)
 *  - FIFA 11+, Bangsbo Yo-Yo, JB Morin, Verkhoshansky
 *
 * Conteúdo originalmente escrito pra plataforma Onze. Diagramas e textos
 * são derivações próprias dessas referências, não cópias.
 */

type ExerciseSeed = Omit<
  NewExercise,
  "id" | "createdAt" | "updatedAt" | "tenantId"
>;

const HALF: { half: true } = { half: true };

// ============================================================================
// AQUECIMENTO (warmup)
// ============================================================================
const WARMUP: ExerciseSeed[] = [
  {
    source: "platform",
    name: "Estafeta com cones em zigue-zague",
    slug: "estafeta-cones",
    category: "warmup",
    objective: "Aquecer + estimular coordenação e lateralidade",
    ageMin: 5,
    ageMax: 12,
    durationMin: 10,
    playersMin: 4,
    playersMax: 20,
    difficulty: 1,
    materials: ["10 cones", "1 bola por dupla"],
    instructions:
      "Divida em filas. Cada atleta percorre o circuito conduzindo a bola em zigue-zague e retorna entregando ao próximo. Pontos pra fila mais rápida.",
    variations:
      "Trocar de pé a cada cone · só pé não-dominante · drible final em alvo · adicionar cabeceio na volta.",
    coachingPoints:
      "Toques curtos · cabeça erguida nos últimos cones · proteção da bola.",
    tags: ["aquecimento", "ludico", "lateralidade", "conducao"],
    sourceCredit: "CBF Academy — Sub-7 a Sub-11",
    pitchLayout: {
      ...HALF,
      cones: [
        { x: 15, y: 32 },
        { x: 25, y: 20 },
        { x: 35, y: 44 },
        { x: 45, y: 20 },
        { x: 55, y: 44 },
        { x: 65, y: 20 },
        { x: 75, y: 32 },
      ],
      players: [
        { x: 8, y: 32, team: "A", label: "1" },
        { x: 8, y: 38, team: "A", label: "2" },
        { x: 8, y: 26, team: "A", label: "3" },
      ],
      arrows: [{ fromX: 12, fromY: 32, toX: 78, toY: 32, type: "dribble" }],
    },
  },
  {
    source: "platform",
    name: "Pega-pega com proteção de bola",
    slug: "pega-pega-protecao",
    category: "warmup",
    objective: "Aquecer + proteção de bola e visão periférica",
    ageMin: 6,
    ageMax: 14,
    durationMin: 8,
    playersMin: 8,
    playersMax: 20,
    difficulty: 1,
    materials: ["1 bola por jogador", "Cones para área 20×20m"],
    instructions:
      "Todos com bola dentro de uma área. 2 atletas são pegadores (sem bola). Quem é pego troca de função. Bola sempre presa no pé.",
    variations:
      "Aumentar pegadores · só pé não-dominante · obrigar olhar pra cima.",
    coachingPoints: "Mudanças de direção curtas · cabeça erguida.",
    tags: ["aquecimento", "ludico", "protecao"],
    sourceCredit: "CBF Academy",
    pitchLayout: {
      ...HALF,
      zones: [
        { x: 25, y: 12, w: 50, h: 40, color: "#facc15", label: "20×20m" },
      ],
      players: [
        { x: 35, y: 22, team: "A" },
        { x: 45, y: 28, team: "A" },
        { x: 55, y: 18, team: "A" },
        { x: 60, y: 32, team: "A" },
        { x: 30, y: 38, team: "A" },
        { x: 50, y: 42, team: "A" },
        { x: 40, y: 30, team: "B", label: "P" },
        { x: 65, y: 38, team: "B", label: "P" },
      ],
    },
  },
  {
    source: "platform",
    name: "Toques em movimento (juggling itinerante)",
    slug: "toques-movimento",
    category: "warmup",
    objective: "Sensibilidade de bola + controle em movimento",
    ageMin: 8,
    ageMax: 17,
    durationMin: 8,
    playersMin: 1,
    playersMax: 20,
    difficulty: 2,
    materials: ["1 bola por atleta"],
    instructions:
      "Cada atleta caminha pela área dando embaixadas. A cada apito, agacha mantendo a bola no ar e levanta sem deixar cair.",
    variations:
      "Trocar de pé · só coxa · cabeça · combinar parte do corpo.",
    coachingPoints: "Olhos na bola só nos primeiros toques · postura ereta.",
    tags: ["aquecimento", "tecnica", "embaixadas"],
    sourceCredit: "Coerver Coaching — Mastering the Ball",
    pitchLayout: {
      ...HALF,
      zones: [
        { x: 20, y: 12, w: 60, h: 40, color: "#22d3ee", label: "Zona livre" },
      ],
      players: Array.from({ length: 8 }, (_, i) => ({
        x: 28 + (i % 4) * 12,
        y: 20 + Math.floor(i / 4) * 16,
        team: "A" as const,
      })),
    },
  },
  {
    source: "platform",
    name: "Aquecimento RAMP (Raise/Activate/Mobilise/Potentiate)",
    slug: "aquecimento-ramp",
    category: "warmup",
    objective: "Mobilidade + ativação + prevenção de lesão",
    ageMin: 11,
    ageMax: 17,
    durationMin: 12,
    playersMin: 1,
    playersMax: 30,
    difficulty: 2,
    materials: ["Cones de 20m"],
    instructions:
      "RAMP: Raise (corrida leve), Activate (skipping, calcanhar), Mobilise (joelho ao peito, balanço), Potentiate (sprints curtos progressivos).",
    variations:
      "Adicionar bola a partir do M · combinar com mini-pliometria leve.",
    coachingPoints:
      "Progressão de intensidade · sem alongamento estático antes do esforço.",
    tags: ["aquecimento", "fisico", "ativacao", "lesoes"],
    sourceCredit: "FIFA 11+ · Bishop & Williams (RAMP protocol)",
    pitchLayout: {
      ...HALF,
      cones: [
        { x: 10, y: 32 },
        { x: 90, y: 32 },
      ],
      players: [
        { x: 12, y: 26, team: "A" },
        { x: 12, y: 32, team: "A" },
        { x: 12, y: 38, team: "A" },
      ],
      arrows: [
        { fromX: 14, fromY: 26, toX: 88, toY: 26, type: "run" },
        { fromX: 14, fromY: 38, toX: 88, toY: 38, type: "run" },
      ],
    },
  },
  {
    source: "platform",
    name: "Toro / Rondó 4v1 (introdutório)",
    slug: "rondo-4v1",
    category: "warmup",
    objective: "Posse curta + cabeça erguida (fundamento La Masia)",
    ageMin: 7,
    ageMax: 17,
    durationMin: 8,
    playersMin: 5,
    playersMax: 5,
    difficulty: 2,
    materials: ["4 cones em quadrado 6×6m", "1 bola"],
    instructions:
      "4 atletas formam quadrado, 1 no meio. Quem está fora tenta manter a bola com 2 toques máximo. Quem perdeu vai pro meio.",
    variations: "Limite de 1 toque · 4v2 · 5v2 · só passe em diagonal.",
    coachingPoints:
      "Recepção orientada · qualidade do passe rasteiro · tempo de jogo.",
    tags: ["rondo", "la-masia", "passe", "posse", "classico"],
    sourceCredit: "La Masia (FC Barcelona) — fundamento do método",
    pitchLayout: {
      ...HALF,
      cones: [
        { x: 32, y: 22 },
        { x: 58, y: 22 },
        { x: 58, y: 42 },
        { x: 32, y: 42 },
      ],
      players: [
        { x: 30, y: 22, team: "A", label: "1" },
        { x: 60, y: 22, team: "A", label: "2" },
        { x: 60, y: 42, team: "A", label: "3" },
        { x: 30, y: 42, team: "A", label: "4" },
        { x: 45, y: 32, team: "B", label: "B" },
      ],
      arrows: [
        { fromX: 32, fromY: 22, toX: 58, toY: 22, type: "pass" },
        { fromX: 60, fromY: 24, toX: 60, toY: 40, type: "pass" },
        { fromX: 58, fromY: 42, toX: 32, toY: 42, type: "pass" },
      ],
    },
  },
];

// ============================================================================
// TÉCNICA (technical)
// ============================================================================
const TECHNICAL: ExerciseSeed[] = [
  {
    source: "platform",
    name: "Condução em slalom + finalização",
    slug: "slalom-finalizacao",
    category: "technical",
    objective: "Condução em velocidade + finalização precisa",
    ageMin: 8,
    ageMax: 15,
    durationMin: 15,
    playersMin: 4,
    playersMax: 12,
    difficulty: 2,
    materials: ["6 cones em zigue-zague", "1 mini gol", "Várias bolas"],
    instructions:
      "Atleta sai conduzindo entre os cones e finaliza no gol. Cronometra-se. Cada erro de cone soma 1s.",
    variations:
      "Adicionar goleiro · pé não-dominante · canto definido · drible em manequim.",
    coachingPoints:
      "Toques curtos · acelerar após o último cone · escolher o canto antes do chute.",
    tags: ["tecnica", "conducao", "finalizacao", "drible"],
    sourceCredit: "CBF Academy — protocolo técnico",
    pitchLayout: {
      ...HALF,
      cones: [
        { x: 18, y: 32 },
        { x: 28, y: 22 },
        { x: 38, y: 42 },
        { x: 48, y: 22 },
        { x: 58, y: 42 },
        { x: 68, y: 32 },
      ],
      goals: [{ x: 98, y: 32, side: "right" }],
      players: [{ x: 10, y: 32, team: "A", label: "1" }],
      arrows: [
        { fromX: 14, fromY: 32, toX: 73, toY: 32, type: "dribble" },
        { fromX: 75, fromY: 32, toX: 96, toY: 32, type: "pass" },
      ],
    },
  },
  {
    source: "platform",
    name: "Roda de passe em quadrado",
    slug: "roda-passe-quadrado",
    category: "technical",
    objective: "Passe curto preciso + recepção orientada",
    ageMin: 7,
    ageMax: 17,
    durationMin: 12,
    playersMin: 4,
    playersMax: 4,
    difficulty: 2,
    materials: ["4 cones formando quadrado 8×8m", "1 bola"],
    instructions:
      "4 atletas, um em cada vértice. Passes em sentido horário. Após passar, correr pro próximo vértice (pass and follow).",
    variations: "Pass and go · 2 toques · pé não-dominante · com defensor.",
    coachingPoints:
      "Recepção orientada · força do passe coerente · cabeça erguida.",
    tags: ["tecnica", "passe", "recepcao", "classico"],
    sourceCredit: "Manual técnico CBF · Adaptado A. Wenger",
    pitchLayout: {
      ...HALF,
      cones: [
        { x: 30, y: 18 },
        { x: 70, y: 18 },
        { x: 70, y: 46 },
        { x: 30, y: 46 },
      ],
      players: [
        { x: 30, y: 18, team: "A", label: "1" },
        { x: 70, y: 18, team: "A", label: "2" },
        { x: 70, y: 46, team: "A", label: "3" },
        { x: 30, y: 46, team: "A", label: "4" },
      ],
      arrows: [
        { fromX: 32, fromY: 19, toX: 68, toY: 19, type: "pass" },
        { fromX: 70, fromY: 20, toX: 70, toY: 44, type: "pass" },
        { fromX: 68, fromY: 46, toX: 32, toY: 46, type: "pass" },
        { fromX: 30, fromY: 44, toX: 30, toY: 20, type: "pass" },
      ],
    },
  },
  {
    source: "platform",
    name: "Cabeceio em duplas",
    slug: "cabeceio-duplas",
    category: "technical",
    objective: "Técnica de cabeceio defensivo e ofensivo",
    ageMin: 11,
    ageMax: 17,
    durationMin: 10,
    playersMin: 6,
    playersMax: 16,
    difficulty: 3,
    materials: ["1 bola por dupla"],
    instructions:
      "Um joga a bola pra cabeça do parceiro. Alternar cabeceio defensivo (alto e longe) e ofensivo (pra baixo, em alvo).",
    variations:
      "Adicionar salto · com defensor passivo · cabeceio em direção a cone-alvo.",
    coachingPoints:
      "Olhos abertos · contato com a testa · uso do pescoço · timing.",
    tags: ["tecnica", "cabeceio"],
    sourceCredit: "CBF Academy — Sub-13+",
    pitchLayout: {
      ...HALF,
      players: [
        { x: 25, y: 24, team: "A", label: "1" },
        { x: 45, y: 24, team: "A", label: "2" },
        { x: 25, y: 40, team: "B", label: "3" },
        { x: 45, y: 40, team: "B", label: "4" },
      ],
      arrows: [
        { fromX: 27, fromY: 24, toX: 43, toY: 24, type: "pass" },
        { fromX: 27, fromY: 40, toX: 43, toY: 40, type: "pass" },
      ],
    },
  },
  {
    source: "platform",
    name: "Coerver — manipulação de bola estática",
    slug: "coerver-manipulacao",
    category: "technical",
    objective: "Sensibilidade de bola + footwork",
    ageMin: 6,
    ageMax: 14,
    durationMin: 10,
    playersMin: 1,
    playersMax: 30,
    difficulty: 2,
    materials: ["1 bola por atleta"],
    instructions:
      "Sequência: tap-tap (sola alternada) → roll-overs (sola pra frente/lado) → V-pull → step-overs. 30s cada, 15s descanso.",
    variations:
      "Aumentar velocidade · combinar movimentos · com olhos fechados (avançado).",
    coachingPoints:
      "Bola próxima · joelhos flexionados · cabeça erguida nos últimos 5s.",
    tags: ["tecnica", "footwork", "coerver", "individual"],
    sourceCredit: "Coerver Coaching — Stage 1: Mastering the Ball",
    pitchLayout: {
      ...HALF,
      players: Array.from({ length: 12 }, (_, i) => ({
        x: 22 + (i % 6) * 11,
        y: 22 + Math.floor(i / 6) * 18,
        team: "A" as const,
      })),
    },
  },
  {
    source: "platform",
    name: "1×1 com mini-gol e recuperação",
    slug: "1x1-mini-gol",
    category: "technical",
    objective: "Drible em situação real + transição defensiva",
    ageMin: 9,
    ageMax: 17,
    durationMin: 15,
    playersMin: 2,
    playersMax: 16,
    difficulty: 3,
    materials: ["2 mini-gols", "Cones para área 15×10m", "Bolas"],
    instructions:
      "Atacante (com bola) tenta marcar no mini-gol oposto. Se perder, troca de função imediatamente.",
    variations:
      "Limite de tempo · gol vale dobrado se finalizar com pé não-dominante.",
    coachingPoints:
      "Atacante: corpo entre bola e marcador · primeira finta forte. Defensor: postura baixa · não cruzar pernas · forçar lado fraco.",
    tags: ["tecnica", "drible", "1v1", "duelo"],
    sourceCredit: "Coerver Coaching · Manchester City Academy",
    pitchLayout: {
      ...HALF,
      goals: [
        { x: 15, y: 32, side: "left" },
        { x: 85, y: 32, side: "right" },
      ],
      players: [
        { x: 35, y: 32, team: "A", label: "A" },
        { x: 65, y: 32, team: "B", label: "D" },
      ],
      arrows: [{ fromX: 37, fromY: 32, toX: 82, toY: 32, type: "dribble" }],
    },
  },
  {
    source: "platform",
    name: "Recepção orientada em 3 cores",
    slug: "recepcao-3-cores",
    category: "technical",
    objective: "Tomada de decisão na recepção + 1º toque dirigido",
    ageMin: 10,
    ageMax: 17,
    durationMin: 12,
    playersMin: 4,
    playersMax: 12,
    difficulty: 3,
    materials: ["3 cones de cores diferentes", "1 bola"],
    instructions:
      "Treinador toca a bola e grita uma cor. Atleta faz primeiro toque orientado pra cone daquela cor e finaliza condução.",
    variations:
      "Aumentar velocidade · marcador passivo · obrigar pé específico.",
    coachingPoints:
      "Decidir antes da bola chegar · 1º toque já direcionado · proteção corporal.",
    tags: ["tecnica", "recepcao", "decisao", "ajax"],
    sourceCredit: "Ajax Academy — TIPS (Technique + Insight)",
    pitchLayout: {
      ...HALF,
      cones: [
        { x: 30, y: 18, color: "#ef4444" },
        { x: 50, y: 50, color: "#22c55e" },
        { x: 70, y: 18, color: "#3b82f6" },
      ],
      players: [
        { x: 50, y: 32, team: "A", label: "1" },
        { x: 50, y: 12, team: "neutral", label: "T" },
      ],
      arrows: [
        { fromX: 50, fromY: 14, toX: 50, toY: 30, type: "pass" },
        { fromX: 52, fromY: 32, toX: 68, toY: 20, type: "dribble" },
      ],
    },
  },
  {
    source: "platform",
    name: "Passe em movimento — 'M' invertido",
    slug: "passe-m-invertido",
    category: "technical",
    objective: "Passe + recepção em corrida + sincronização",
    ageMin: 11,
    ageMax: 17,
    durationMin: 15,
    playersMin: 6,
    playersMax: 12,
    difficulty: 3,
    materials: ["6 cones formando 'M'", "Bolas"],
    instructions:
      "Em duplas, conduzir pelo formato de M, alternando passes a cada vértice.",
    variations:
      "Drible no vértice · sem parar a bola · só pé não-dominante.",
    coachingPoints:
      "Antecipar a corrida do parceiro · força do passe pra encontrá-lo em movimento · 1º toque pra frente.",
    tags: ["tecnica", "passe", "duplas", "movimento"],
    sourceCredit: "Liverpool FC Academy (Pep Lijnders)",
    pitchLayout: {
      ...HALF,
      cones: [
        { x: 18, y: 22 },
        { x: 30, y: 44 },
        { x: 45, y: 22 },
        { x: 60, y: 44 },
        { x: 75, y: 22 },
      ],
      players: [
        { x: 12, y: 22, team: "A", label: "1" },
        { x: 12, y: 28, team: "A", label: "2" },
      ],
      arrows: [
        { fromX: 14, fromY: 24, toX: 28, toY: 42, type: "pass" },
        { fromX: 32, fromY: 42, toX: 43, toY: 24, type: "pass" },
        { fromX: 47, fromY: 22, toX: 58, toY: 42, type: "pass" },
      ],
    },
  },
  {
    source: "platform",
    name: "Finalização em diagonal — entrada de área",
    slug: "finalizacao-diagonal",
    category: "technical",
    objective: "Finalização em movimento na entrada de área",
    ageMin: 11,
    ageMax: 17,
    durationMin: 15,
    playersMin: 4,
    playersMax: 12,
    difficulty: 3,
    materials: ["Várias bolas", "1 gol", "Cones"],
    instructions:
      "Atleta sai do meio-campo, recebe passe na diagonal e finaliza dentro da área em corrida. Goleiro ativo.",
    variations:
      "Marcação passiva · variar lado · finalizar com cabeçada (passe alto).",
    coachingPoints:
      "Timing da corrida · não passar do passador · escolher canto antes · seguir a bola até o final.",
    tags: ["tecnica", "finalizacao", "movimento"],
    sourceCredit: "FC Barcelona — Drills de finalização",
    pitchLayout: {
      ...HALF,
      goals: [{ x: 98, y: 32, side: "right" }],
      players: [
        { x: 35, y: 50, team: "A", label: "1" },
        { x: 60, y: 35, team: "neutral", label: "T" },
        { x: 96, y: 32, team: "B", label: "G" },
      ],
      arrows: [
        { fromX: 60, fromY: 36, toX: 78, toY: 28, type: "pass" },
        { fromX: 36, fromY: 48, toX: 78, toY: 28, type: "run" },
        { fromX: 80, fromY: 28, toX: 96, toY: 32, type: "pass" },
      ],
    },
  },
  {
    source: "platform",
    name: "Jogo de toque rápido (1-2 e tabela)",
    slug: "jogo-tabela",
    category: "technical",
    objective: "Construção em duplas com tabelas (1-2)",
    ageMin: 10,
    ageMax: 17,
    durationMin: 15,
    playersMin: 4,
    playersMax: 12,
    difficulty: 3,
    materials: ["Cones", "1 bola por trio", "1 mini-gol opcional"],
    instructions:
      "Em trios. Atleta A conduz, faz tabela com B (1-2) e segue até finalizar com C aberto.",
    variations:
      "Defensor passivo no eixo · tabela dupla (3 passes) · com finalização.",
    coachingPoints:
      "Sincronização do passe · pé do parceiro como alvo · acelerar após receber.",
    tags: ["tecnica", "tabela", "construcao"],
    sourceCredit: "Manual de fundamentos · FA (Inglaterra)",
    pitchLayout: {
      ...HALF,
      players: [
        { x: 18, y: 32, team: "A", label: "A" },
        { x: 45, y: 22, team: "A", label: "B" },
        { x: 75, y: 32, team: "A", label: "C" },
      ],
      goals: [{ x: 95, y: 32, side: "right" }],
      arrows: [
        { fromX: 20, fromY: 32, toX: 43, toY: 24, type: "pass" },
        { fromX: 45, fromY: 26, toX: 30, toY: 32, type: "pass" },
        { fromX: 32, fromY: 32, toX: 73, toY: 32, type: "pass" },
        { fromX: 75, fromY: 34, toX: 93, toY: 32, type: "pass" },
      ],
    },
  },
  {
    source: "platform",
    name: "Domínio de bola alta",
    slug: "dominio-bola-alta",
    category: "technical",
    objective: "Recepção de bola aérea (peito, coxa, pé)",
    ageMin: 11,
    ageMax: 17,
    durationMin: 12,
    playersMin: 6,
    playersMax: 16,
    difficulty: 3,
    materials: ["1 bola por dupla"],
    instructions:
      "Em duplas, distância 8m. Um lança a bola alta com a mão, outro domina (peito/coxa/pé) e devolve com passe rasteiro.",
    variations:
      "Aumentar distância · adicionar movimento · domínio orientado.",
    coachingPoints:
      "Pré-leitura · contato suave (amortecer) · postura antes da bola chegar.",
    tags: ["tecnica", "dominio", "bola-alta"],
    sourceCredit: "Manual técnico — Federação Portuguesa de Futebol",
    pitchLayout: {
      ...HALF,
      players: [
        { x: 30, y: 32, team: "A", label: "1" },
        { x: 65, y: 32, team: "B", label: "2" },
      ],
      arrows: [{ fromX: 32, fromY: 30, toX: 63, toY: 30, type: "pass" }],
    },
  },
  {
    source: "platform",
    name: "Drible com execução obrigatória",
    slug: "drible-execucao",
    category: "technical",
    objective: "Repertório de dribles em situação fechada",
    ageMin: 9,
    ageMax: 17,
    durationMin: 12,
    playersMin: 1,
    playersMax: 12,
    difficulty: 3,
    materials: ["Cones em circuito", "Bolas"],
    instructions:
      "Circuito com 4 cones. A cada cone, executar drible específico (corte, elástico, pedalada, cintura). Tempo cronometrado.",
    variations:
      "Marcador no último cone · só pé fraco · ranking de tempos.",
    coachingPoints:
      "Comprometimento na finta · velocidade após o drible · domínio próximo do corpo.",
    tags: ["tecnica", "drible", "individual"],
    sourceCredit: "Coerver Coaching · Influência Garrincha & Robinho",
    pitchLayout: {
      ...HALF,
      cones: [
        { x: 22, y: 28 },
        { x: 38, y: 38 },
        { x: 55, y: 24 },
        { x: 72, y: 36 },
      ],
      players: [{ x: 12, y: 32, team: "A", label: "1" }],
      arrows: [{ fromX: 14, fromY: 32, toX: 78, toY: 36, type: "dribble" }],
    },
  },
];

// ============================================================================
// TÁTICA (tactical)
// ============================================================================
const TACTICAL: ExerciseSeed[] = [
  {
    source: "platform",
    name: "Jogo reduzido 4×4 com gol móvel",
    slug: "4x4-gol-movel",
    category: "tactical",
    objective: "Tomada de decisão + transição rápida",
    ageMin: 9,
    ageMax: 17,
    durationMin: 20,
    playersMin: 8,
    playersMax: 8,
    difficulty: 3,
    materials: ["2 mini-gols", "Cones 30×20m", "Coletes"],
    instructions:
      "4×4 em campo reduzido. Cada gol 2m. Máximo 3 toques. Após gol, time que fez recomeça.",
    variations:
      "Sem limite de toques · curingas neutros · 4×4+1 (curinga ofensivo).",
    coachingPoints:
      "Apoio ao portador · profundidade no ataque · transição imediata após perda.",
    tags: ["tatica", "jogo-reduzido", "transicao"],
    sourceCredit: "Metodologia espanhola · La Masia",
    pitchLayout: {
      ...HALF,
      goals: [
        { x: 5, y: 32, side: "left" },
        { x: 95, y: 32, side: "right" },
      ],
      players: [
        { x: 25, y: 22, team: "A", label: "1", role: "ZAG" },
        { x: 25, y: 42, team: "A", label: "2", role: "ZAG" },
        { x: 40, y: 28, team: "A", label: "3", role: "MEI" },
        { x: 40, y: 38, team: "A", label: "4", role: "ATA" },
        { x: 75, y: 22, team: "B", label: "5" },
        { x: 75, y: 42, team: "B", label: "6" },
        { x: 60, y: 28, team: "B", label: "7" },
        { x: 60, y: 38, team: "B", label: "8" },
      ],
    },
  },
  {
    source: "platform",
    name: "Posicionamento defensivo em linha de 4",
    slug: "linha-4-defensiva",
    category: "tactical",
    objective: "Compactação e movimentação coletiva da linha defensiva",
    ageMin: 12,
    ageMax: 17,
    durationMin: 15,
    playersMin: 4,
    playersMax: 6,
    difficulty: 4,
    materials: ["Coletes", "Cones para zonas", "1 bola"],
    instructions:
      "4 zagueiros em linha. Treinador desloca a bola pelos lados. Linha desloca em bloco mantendo 4-6m. Trabalhar dobra de marcação.",
    variations:
      "Adicionar atacantes adversários · adicionar volante na frente da linha (5).",
    coachingPoints:
      "Compactar lado da bola · proteção do lateral oposto · linha de impedimento.",
    tags: ["tatica", "defensivo", "posicionamento"],
    sourceCredit: "Pep Lijnders / Liverpool methodology",
    pitchLayout: {
      ...HALF,
      players: [
        { x: 18, y: 18, team: "A", label: "L", role: "LD" },
        { x: 35, y: 18, team: "A", label: "Z", role: "ZAG" },
        { x: 52, y: 18, team: "A", label: "Z", role: "ZAG" },
        { x: 70, y: 18, team: "A", label: "L", role: "LE" },
        { x: 95, y: 32, team: "neutral", label: "T", role: "TR" },
      ],
      arrows: [
        { fromX: 18, fromY: 22, toX: 35, toY: 32, type: "run" },
        { fromX: 35, fromY: 22, toX: 52, toY: 32, type: "run" },
      ],
    },
  },
  {
    source: "platform",
    name: "Juego de Posición — 4×4+3 com curingas posicionais",
    slug: "juego-posicion-4-4-3",
    category: "tactical",
    objective: "Ocupação racional de espaços + circulação de bola",
    ageMin: 13,
    ageMax: 17,
    durationMin: 25,
    playersMin: 11,
    playersMax: 11,
    difficulty: 5,
    materials: ["Coletes 3 cores", "Cones para grid 30×30 dividido em 9", "Bola"],
    instructions:
      "Grid em 9 zonas. 4 atacantes + 3 curingas posicionais (1 por faixa) atacam 4 defensores. Mínimo 1 jogador por zona horizontal. Curingas só com 2 toques.",
    variations:
      "Limitar zonas · obrigar passe entre faixas · acrescentar gol(s).",
    coachingPoints:
      "Ocupar 3 alturas · superioridade numérica e posicional · paciência na construção.",
    tags: ["tatica", "posicional", "la-masia", "guardiola"],
    sourceCredit: "Pep Guardiola — Juego de Posición",
    pitchLayout: {
      ...HALF,
      zones: [
        { x: 10, y: 10, w: 80, h: 14, color: "#3b82f6", label: "DEF" },
        { x: 10, y: 25, w: 80, h: 14, color: "#22c55e", label: "MEIO" },
        { x: 10, y: 40, w: 80, h: 14, color: "#ef4444", label: "ATA" },
      ],
      players: [
        { x: 25, y: 17, team: "A", label: "C", role: "CUR" },
        { x: 50, y: 17, team: "A", label: "1" },
        { x: 75, y: 17, team: "A", label: "2" },
        { x: 25, y: 32, team: "A", label: "C", role: "CUR" },
        { x: 50, y: 32, team: "A", label: "3" },
        { x: 75, y: 32, team: "A", label: "4" },
        { x: 25, y: 47, team: "A", label: "C", role: "CUR" },
        { x: 50, y: 47, team: "B", label: "5" },
        { x: 75, y: 47, team: "B", label: "6" },
        { x: 38, y: 32, team: "B", label: "7" },
        { x: 65, y: 32, team: "B", label: "8" },
      ],
    },
  },
  {
    source: "platform",
    name: "Pressing 6 segundos (Gegenpressing)",
    slug: "pressing-6-segundos",
    category: "tactical",
    objective: "Recuperação imediata após perda da bola",
    ageMin: 13,
    ageMax: 17,
    durationMin: 20,
    playersMin: 10,
    playersMax: 14,
    difficulty: 4,
    materials: ["2 mini-gols", "Coletes", "Bola"],
    instructions:
      "Após perder, 6 segundos pra recuperar. Se não, defende em bloco baixo. Trabalhar gatilhos: bola no ar, recepção mal feita, passe pra trás.",
    variations:
      "4 segundos · gol curinga lateral · finalizar em 8s após recuperar.",
    coachingPoints:
      "Pressão coletiva · cobertura imediata · cortar linhas de passe primeiro.",
    tags: ["tatica", "pressing", "klopp", "guardiola"],
    sourceCredit: "Jürgen Klopp / Liverpool — Gegenpressing",
    pitchLayout: {
      ...HALF,
      goals: [
        { x: 5, y: 32, side: "left" },
        { x: 95, y: 32, side: "right" },
      ],
      players: [
        { x: 30, y: 22, team: "A", label: "1" },
        { x: 30, y: 42, team: "A", label: "2" },
        { x: 50, y: 32, team: "A", label: "3" },
        { x: 70, y: 22, team: "A", label: "4" },
        { x: 70, y: 42, team: "A", label: "5" },
        { x: 50, y: 22, team: "B", label: "6" },
        { x: 50, y: 42, team: "B", label: "7" },
        { x: 65, y: 32, team: "B", label: "8" },
      ],
      arrows: [
        { fromX: 65, fromY: 30, toX: 52, toY: 24, type: "run" },
        { fromX: 65, fromY: 34, toX: 52, toY: 40, type: "run" },
      ],
    },
  },
  {
    source: "platform",
    name: "Construção saindo do goleiro",
    slug: "construcao-do-goleiro",
    category: "tactical",
    objective: "Saída pelo goleiro com 1ª e 2ª linha de passe",
    ageMin: 12,
    ageMax: 17,
    durationMin: 20,
    playersMin: 7,
    playersMax: 11,
    difficulty: 4,
    materials: ["Gol oficial", "Coletes", "Bolas", "Cones"],
    instructions:
      "Goleiro inicia com bola no chão. 2 zagueiros abertos, 1 volante caindo entre eles (saída em 3). 2 atacantes pressionam.",
    variations:
      "Aumentar pressão (3 atacantes) · pressing alto · obrigar passe pela faixa central.",
    coachingPoints:
      "Volante baixar pra criar 3v2 · zagueiros abrirem · 1ª opção sempre o livre.",
    tags: ["tatica", "construcao", "goleiro", "saida-bola"],
    sourceCredit: "Manchester City Academy (Pep Guardiola)",
    pitchLayout: {
      ...HALF,
      goals: [{ x: 5, y: 32, side: "left" }],
      players: [
        { x: 8, y: 32, team: "A", label: "G", role: "GOL" },
        { x: 22, y: 22, team: "A", label: "Z", role: "ZAG" },
        { x: 22, y: 42, team: "A", label: "Z", role: "ZAG" },
        { x: 35, y: 32, team: "A", label: "V", role: "VOL" },
        { x: 50, y: 22, team: "B", label: "1" },
        { x: 50, y: 42, team: "B", label: "2" },
      ],
      arrows: [
        { fromX: 10, fromY: 32, toX: 33, toY: 32, type: "pass" },
        { fromX: 35, fromY: 30, toX: 23, toY: 22, type: "pass" },
      ],
    },
  },
  {
    source: "platform",
    name: "Transição ofensiva 3v2",
    slug: "transicao-3v2",
    category: "tactical",
    objective: "Velocidade na transição + finalização em vantagem numérica",
    ageMin: 11,
    ageMax: 17,
    durationMin: 15,
    playersMin: 6,
    playersMax: 12,
    difficulty: 3,
    materials: ["1 gol", "Bolas", "Cones"],
    instructions:
      "Goleiro distribui pra trio de atacantes. Avançam contra dupla até finalizar.",
    variations:
      "3v3 · obrigar tabela · tempo limite (10s).",
    coachingPoints:
      "Manter triângulo · sempre uma opção em profundidade · acelerar até 30m da área.",
    tags: ["tatica", "transicao", "vantagem-numerica"],
    sourceCredit: "Drills clássicos · Bayern Munich Academy",
    pitchLayout: {
      ...HALF,
      goals: [{ x: 95, y: 32, side: "right" }],
      players: [
        { x: 25, y: 32, team: "A", label: "1" },
        { x: 30, y: 22, team: "A", label: "2" },
        { x: 30, y: 42, team: "A", label: "3" },
        { x: 65, y: 26, team: "B", label: "4" },
        { x: 65, y: 38, team: "B", label: "5" },
        { x: 93, y: 32, team: "B", label: "G", role: "GOL" },
      ],
      arrows: [
        { fromX: 27, fromY: 32, toX: 60, toY: 32, type: "dribble" },
        { fromX: 32, fromY: 22, toX: 75, toY: 22, type: "run" },
        { fromX: 32, fromY: 42, toX: 75, toY: 42, type: "run" },
      ],
    },
  },
  {
    source: "platform",
    name: "Bloco médio defensivo (4-4-2)",
    slug: "bloco-medio-442",
    category: "tactical",
    objective: "Organização defensiva no meio-campo + cobertura por linhas",
    ageMin: 13,
    ageMax: 17,
    durationMin: 25,
    playersMin: 11,
    playersMax: 14,
    difficulty: 4,
    materials: ["Coletes", "Bolas", "Mini-gol opcional"],
    instructions:
      "Time defende em 4-4-2 no meio-campo. Linhas com distância de 8-10m. Treinador valida posicionamentos a cada parada.",
    variations:
      "Gatilho de pressing · transição imediata após recuperação · 4-3-3 ou 4-2-3-1.",
    coachingPoints:
      "Linhas paralelas e curtas · ocupar lado da bola · forçar adversário pra fora.",
    tags: ["tatica", "defensivo", "bloco-medio", "sistemas"],
    sourceCredit: "Periodização Tática (Vítor Frade)",
    pitchLayout: {
      ...HALF,
      players: [
        { x: 25, y: 14, team: "A", label: "L", role: "LD" },
        { x: 35, y: 14, team: "A", label: "Z" },
        { x: 50, y: 14, team: "A", label: "Z" },
        { x: 65, y: 14, team: "A", label: "L", role: "LE" },
        { x: 25, y: 30, team: "A", label: "M" },
        { x: 40, y: 30, team: "A", label: "V" },
        { x: 55, y: 30, team: "A", label: "V" },
        { x: 70, y: 30, team: "A", label: "M" },
        { x: 38, y: 46, team: "A", label: "A" },
        { x: 55, y: 46, team: "A", label: "A" },
      ],
    },
  },
  {
    source: "platform",
    name: "Ataque pelas faixas laterais (overload)",
    slug: "ataque-faixas-laterais",
    category: "tactical",
    objective: "Sobrecarga lateral + cruzamento e movimentação na área",
    ageMin: 12,
    ageMax: 17,
    durationMin: 20,
    playersMin: 8,
    playersMax: 12,
    difficulty: 4,
    materials: ["1 gol", "Coletes", "Bolas"],
    instructions:
      "Lateral conduz pela linha. Meia faz apoio. Ponta abre. Atacante centro de área. Trabalhar 1ª trave, 2ª trave, ponto do pênalti, recuo.",
    variations:
      "Zagueiros adversários · cruzamento rasteiro · diferentes pontos de origem.",
    coachingPoints:
      "Sincronia na área · não cruzar sem alvo · 4 chegadas mínimas.",
    tags: ["tatica", "ataque", "lateral", "cruzamento"],
    sourceCredit: "Manual técnico — RFEF (Real Federación Española)",
    pitchLayout: {
      ...HALF,
      goals: [{ x: 95, y: 32, side: "right" }],
      players: [
        { x: 60, y: 12, team: "A", label: "L", role: "LAT" },
        { x: 70, y: 24, team: "A", label: "M", role: "MEI" },
        { x: 78, y: 32, team: "A", label: "A", role: "ATA" },
        { x: 70, y: 42, team: "A", label: "P", role: "PON" },
      ],
      arrows: [
        { fromX: 62, fromY: 13, toX: 88, toY: 14, type: "dribble" },
        { fromX: 88, fromY: 14, toX: 78, toY: 30, type: "pass" },
        { fromX: 70, fromY: 22, toX: 80, toY: 28, type: "run" },
      ],
    },
  },
];

// ============================================================================
// FÍSICO (physical)
// ============================================================================
const PHYSICAL: ExerciseSeed[] = [
  {
    source: "platform",
    name: "Sprint progressivo 10-20-30m",
    slug: "sprint-progressivo",
    category: "physical",
    objective: "Velocidade de aceleração e velocidade máxima",
    ageMin: 11,
    ageMax: 17,
    durationMin: 15,
    playersMin: 1,
    playersMax: 20,
    difficulty: 3,
    materials: ["Cones a cada 10m", "Cronômetro"],
    instructions:
      "Aquecimento articular. 3 sprints 10m. 3 sprints 20m. 2 sprints 30m. Recuperação 1:6 (10s sprint = 60s descanso).",
    variations:
      "Com mudança de direção · após salto · com bola.",
    coachingPoints:
      "Postura inicial baixa · braços alternados · não desacelerar antes da linha.",
    tags: ["fisico", "velocidade", "sprint"],
    sourceCredit: "Periodização tática · CBF Academy preparação física",
    pitchLayout: {
      ...HALF,
      cones: [
        { x: 10, y: 32 },
        { x: 30, y: 32 },
        { x: 50, y: 32 },
        { x: 70, y: 32 },
      ],
      arrows: [{ fromX: 12, fromY: 32, toX: 68, toY: 32, type: "run" }],
    },
  },
  {
    source: "platform",
    name: "Circuito de coordenação (escada de agilidade)",
    slug: "escada-agilidade",
    category: "physical",
    objective: "Coordenação motora + agilidade nos pés",
    ageMin: 7,
    ageMax: 17,
    durationMin: 12,
    playersMin: 2,
    playersMax: 12,
    difficulty: 2,
    materials: ["Escada de agilidade", "Cones", "Cronômetro"],
    instructions:
      "5 passagens com padrões diferentes (1 pé/casa, 2 pés, lateral, frente/trás, cross-step). Após escada, sprint 10m.",
    variations:
      "Bola após sprint · finalização final · com mudança de direção.",
    coachingPoints:
      "Joelhos altos · contato rápido · cabeça erguida.",
    tags: ["fisico", "coordenacao", "agilidade"],
    sourceCredit: "Manual de preparação física · CBF Academy",
    pitchLayout: {
      ...HALF,
      zones: [{ x: 18, y: 30, w: 30, h: 4, color: "#fbbf24", label: "ESCADA" }],
      cones: [{ x: 60, y: 32 }],
      arrows: [{ fromX: 49, fromY: 32, toX: 59, toY: 32, type: "run" }],
    },
  },
  {
    source: "platform",
    name: "Pliometria progressiva (saltos)",
    slug: "pliometria-progressiva",
    category: "physical",
    objective: "Potência muscular + reativação neuromuscular",
    ageMin: 13,
    ageMax: 17,
    durationMin: 15,
    playersMin: 1,
    playersMax: 16,
    difficulty: 4,
    materials: ["Cones", "Caixa pliométrica (opcional)", "Cronômetro"],
    instructions:
      "Saltos verticais bipodais (3×8) → horizontais (3×6) → drop jump (3×6) → bound (3×6 cada perna).",
    variations:
      "Combinar com sprint após salto · com bola na cabeça · circuito.",
    coachingPoints:
      "Aterrissagem suave · joelho alinhado com pé · usar braços pra impulsão.",
    tags: ["fisico", "potencia", "salto", "pliometria"],
    sourceCredit: "Verkhoshansky · adaptação CBF Academy",
    pitchLayout: {
      ...HALF,
      zones: [
        { x: 30, y: 28, w: 8, h: 8, color: "#3b82f6", label: "1" },
        { x: 45, y: 28, w: 8, h: 8, color: "#22c55e", label: "2" },
        { x: 60, y: 28, w: 8, h: 8, color: "#f97316", label: "3" },
      ],
      players: [{ x: 22, y: 32, team: "A", label: "1" }],
    },
  },
  {
    source: "platform",
    name: "Yo-Yo Intermittent Recovery (IR1)",
    slug: "yoyo-ir1",
    category: "physical",
    objective: "Resistência aeróbia intermitente",
    ageMin: 13,
    ageMax: 17,
    durationMin: 25,
    playersMin: 4,
    playersMax: 30,
    difficulty: 4,
    materials: ["Cones a 20m", "Cronômetro com beep ou app"],
    instructions:
      "20m + volta 20m + 10s recuperação ativa. Velocidade aumenta. 2 sirenes consecutivas perdidas = parar.",
    variations: "IR2 (mais intenso) · adaptado pra escola.",
    coachingPoints:
      "Recuperação ativa (caminhar) · pisar sempre na linha · ritmo crescente.",
    tags: ["fisico", "resistencia", "teste", "yoyo"],
    sourceCredit: "Bangsbo (1996) — protocolo Yo-Yo IR1",
    pitchLayout: {
      ...HALF,
      cones: [
        { x: 15, y: 32 },
        { x: 75, y: 32 },
        { x: 8, y: 32 },
      ],
      arrows: [
        { fromX: 17, fromY: 30, toX: 73, toY: 30, type: "run" },
        { fromX: 73, fromY: 34, toX: 17, toY: 34, type: "run" },
      ],
    },
  },
  {
    source: "platform",
    name: "Force-Velocity — sprint resistido",
    slug: "sprint-resistido",
    category: "physical",
    objective: "Força específica de sprint + aceleração",
    ageMin: 14,
    ageMax: 17,
    durationMin: 15,
    playersMin: 2,
    playersMax: 12,
    difficulty: 4,
    materials: ["Cinto de resistência ou colete lastrado leve", "Cones"],
    instructions:
      "Sprint 20m com resistência (parceiro segurando elástico atrás), 6 séries com 2min descanso.",
    variations: "Aumentar resistência · combinar com sprint livre após (contraste).",
    coachingPoints:
      "Postura inclinada nos primeiros metros · braços fortes · pisada agressiva.",
    tags: ["fisico", "forca", "sprint", "resistido"],
    sourceCredit: "Force-Velocity — JB Morin (INSEP)",
    pitchLayout: {
      ...HALF,
      cones: [
        { x: 15, y: 32 },
        { x: 75, y: 32 },
      ],
      players: [
        { x: 15, y: 32, team: "A", label: "1" },
        { x: 12, y: 32, team: "B", label: "R" },
      ],
      arrows: [{ fromX: 17, fromY: 32, toX: 73, toY: 32, type: "run" }],
    },
  },
  {
    source: "platform",
    name: "Mudança de direção (T-test adaptado)",
    slug: "t-test-adaptado",
    category: "physical",
    objective: "Agilidade + capacidade de mudança de direção (COD)",
    ageMin: 11,
    ageMax: 17,
    durationMin: 12,
    playersMin: 1,
    playersMax: 12,
    difficulty: 3,
    materials: ["4 cones formando T", "Cronômetro"],
    instructions:
      "A → sprint 9m → B → shuffle 4.5m → C → shuffle 9m → D → shuffle 4.5m → B → corrida ré 9m → A.",
    variations: "Com bola · só lados (D-C-D) · combinar com finalização.",
    coachingPoints:
      "Postura baixa nas mudanças · pés rápidos · não cruzar pernas no shuffle.",
    tags: ["fisico", "agilidade", "cod"],
    sourceCredit: "Semenick (1990) — T-test",
    pitchLayout: {
      ...HALF,
      cones: [
        { x: 25, y: 32 },
        { x: 55, y: 32 },
        { x: 55, y: 18 },
        { x: 55, y: 46 },
      ],
      arrows: [
        { fromX: 27, fromY: 32, toX: 53, toY: 32, type: "run" },
        { fromX: 55, fromY: 30, toX: 55, toY: 20, type: "run" },
        { fromX: 55, fromY: 18, toX: 55, toY: 46, type: "run" },
      ],
    },
  },
];

// ============================================================================
// BOLA PARADA (set_pieces)
// ============================================================================
const SET_PIECES: ExerciseSeed[] = [
  {
    source: "platform",
    name: "Cobrança de escanteio com 3 zonas-alvo",
    slug: "escanteio-3-zonas",
    category: "set_pieces",
    objective: "Precisão na bola parada + movimentação ofensiva",
    ageMin: 13,
    ageMax: 17,
    durationMin: 15,
    playersMin: 4,
    playersMax: 12,
    difficulty: 3,
    materials: ["Várias bolas", "Coletes para zonas", "1 mini-gol"],
    instructions:
      "Cobrador alterna 3 zonas (1ª trave, 2ª trave, ponto do pênalti). Atacantes treinam movimentação. Goleiro defende.",
    variations:
      "Adicionar zagueiros · cobrança curta · cobrança rasteira pra fora.",
    coachingPoints:
      "Sincronização · sinal combinado · trajetória da bola.",
    tags: ["bola-parada", "escanteio", "ataque"],
    sourceCredit: "Manual de bola parada · análise Klopp/Liverpool",
    pitchLayout: {
      ...HALF,
      zones: [
        { x: 80, y: 16, w: 8, h: 8, color: "#22c55e", label: "1ª" },
        { x: 80, y: 40, w: 8, h: 8, color: "#22c55e", label: "2ª" },
        { x: 70, y: 28, w: 6, h: 8, color: "#3b82f6", label: "PEN" },
      ],
      goals: [{ x: 98, y: 32, side: "right" }],
      players: [
        { x: 95, y: 8, team: "A", label: "C", role: "COB" },
        { x: 75, y: 22, team: "A", label: "1" },
        { x: 75, y: 42, team: "A", label: "2" },
        { x: 70, y: 32, team: "A", label: "3" },
        { x: 96, y: 32, team: "B", label: "G", role: "GOL" },
      ],
      arrows: [{ fromX: 94, fromY: 10, toX: 84, toY: 22, type: "pass" }],
    },
  },
  {
    source: "platform",
    name: "Falta lateral — cruzamento na área",
    slug: "falta-lateral-cruzamento",
    category: "set_pieces",
    objective: "Cobrança de falta lateral + movimento na área",
    ageMin: 13,
    ageMax: 17,
    durationMin: 15,
    playersMin: 5,
    playersMax: 12,
    difficulty: 3,
    materials: ["Bolas", "1 gol", "Coletes"],
    instructions:
      "Cobrador na linha lateral, ~30m da área. 3 atacantes com movimentos cruzados (ponta sai, atacante entra, meia chega de fora).",
    variations:
      "Cobrança curta antes · falta direta · com 3 zagueiros adversários.",
    coachingPoints:
      "Trajetória pelo segundo poste · contato no cruzamento · 1º arrojo entra forte.",
    tags: ["bola-parada", "falta", "cruzamento"],
    sourceCredit: "Análise tática — Premier League",
    pitchLayout: {
      ...HALF,
      goals: [{ x: 95, y: 32, side: "right" }],
      players: [
        { x: 70, y: 8, team: "A", label: "C", role: "COB" },
        { x: 78, y: 24, team: "A", label: "1" },
        { x: 82, y: 32, team: "A", label: "2" },
        { x: 78, y: 40, team: "A", label: "3" },
      ],
      arrows: [{ fromX: 70, fromY: 10, toX: 84, toY: 32, type: "pass" }],
    },
  },
  {
    source: "platform",
    name: "Cobrança de pênalti (rotinas)",
    slug: "cobranca-penalti",
    category: "set_pieces",
    objective: "Técnica + decisão sob pressão na cobrança",
    ageMin: 11,
    ageMax: 17,
    durationMin: 15,
    playersMin: 4,
    playersMax: 16,
    difficulty: 2,
    materials: ["Bolas", "1 gol", "Cronômetro"],
    instructions:
      "Cada atleta executa 5 cobranças. Goleiro ativa. 2 cantos pré-definidos. Discutir leitura do goleiro.",
    variations:
      "Pé não-dominante · após corrida (sprint) · disputa em pares.",
    coachingPoints:
      "Decidir o canto antes da corrida · tronco firme · seguir bola pra rebater.",
    tags: ["bola-parada", "penalti", "finalizacao"],
    sourceCredit: "Análise estatística de pênaltis — UEFA",
    pitchLayout: {
      ...HALF,
      goals: [{ x: 95, y: 32, side: "right" }],
      players: [
        { x: 80, y: 32, team: "A", label: "1" },
        { x: 93, y: 32, team: "B", label: "G", role: "GOL" },
      ],
      arrows: [{ fromX: 82, fromY: 32, toX: 93, toY: 26, type: "pass" }],
    },
  },
];

// ============================================================================
// GOLEIRO (goalkeeper)
// ============================================================================
const GOALKEEPER: ExerciseSeed[] = [
  {
    source: "platform",
    name: "Defesas alternadas (esquerda/direita)",
    slug: "defesas-alternadas",
    category: "goalkeeper",
    objective: "Reflexo + posicionamento do goleiro",
    ageMin: 9,
    ageMax: 17,
    durationMin: 12,
    playersMin: 1,
    playersMax: 4,
    difficulty: 3,
    materials: ["6 bolas", "1 gol oficial"],
    instructions:
      "Treinador finaliza alternadamente nos 4 cantos. Goleiro defende e retorna ao centro. Sequência de 10 finalizações.",
    variations:
      "Rasteira · alta · defletor antes (parede) · após drible.",
    coachingPoints:
      "Posicionamento na pequena área · queda lateral correta · usar ambas as mãos.",
    tags: ["goleiro", "reflexo", "posicionamento"],
    sourceCredit: "Manual técnico — Treinamento de Goleiros · CBF Academy",
    pitchLayout: {
      ...HALF,
      goals: [{ x: 2, y: 32, side: "left" }],
      players: [
        { x: 6, y: 32, team: "A", label: "G", role: "GOL" },
        { x: 30, y: 32, team: "B", label: "T", role: "TR" },
      ],
      arrows: [
        { fromX: 28, fromY: 30, toX: 6, toY: 28, type: "pass" },
        { fromX: 28, fromY: 34, toX: 6, toY: 36, type: "pass" },
      ],
    },
  },
  {
    source: "platform",
    name: "Saída de gol em alta",
    slug: "saida-gol-alta",
    category: "goalkeeper",
    objective: "Decisão de sair (cruzamento ou bola na área)",
    ageMin: 13,
    ageMax: 17,
    durationMin: 15,
    playersMin: 2,
    playersMax: 8,
    difficulty: 4,
    materials: ["Bolas", "1 gol oficial", "Cones"],
    instructions:
      "Treinador cruza da lateral. Goleiro decide: sair pra interceptar (gritar 'minha!') ou ficar na linha.",
    variations:
      "Atacante adversário · zagueiro pressionando · cruzamentos rasteiros.",
    coachingPoints:
      "Avaliar trajetória antes de sair · mãos firmes · joelho protetor levantado.",
    tags: ["goleiro", "saida", "cruzamento"],
    sourceCredit: "Treinamento de Goleiros · CBF Academy",
    pitchLayout: {
      ...HALF,
      goals: [{ x: 2, y: 32, side: "left" }],
      players: [
        { x: 6, y: 32, team: "A", label: "G", role: "GOL" },
        { x: 25, y: 8, team: "B", label: "T" },
        { x: 18, y: 30, team: "B", label: "1" },
      ],
      arrows: [{ fromX: 25, fromY: 10, toX: 12, toY: 28, type: "pass" }],
    },
  },
  {
    source: "platform",
    name: "Reposição com pé (jogo com os pés)",
    slug: "reposicao-pe",
    category: "goalkeeper",
    objective: "Goleiro como 11º jogador — reposição precisa com os pés",
    ageMin: 12,
    ageMax: 17,
    durationMin: 15,
    playersMin: 5,
    playersMax: 8,
    difficulty: 3,
    materials: ["1 gol", "Bolas", "Coletes"],
    instructions:
      "Goleiro recebe passe de zagueiro e repõe pra atletas em zonas (curto, médio, longo). 10 reposições por zona.",
    variations:
      "Pressão de atacante · bola no chão e no ar · pé não-dominante.",
    coachingPoints:
      "Recepção orientada · pé de apoio firme · foco no peito do receptor.",
    tags: ["goleiro", "reposicao", "construcao"],
    sourceCredit: "Manchester City Academy (Pep Guardiola)",
    pitchLayout: {
      ...HALF,
      goals: [{ x: 2, y: 32, side: "left" }],
      players: [
        { x: 6, y: 32, team: "A", label: "G", role: "GOL" },
        { x: 25, y: 22, team: "A", label: "1", role: "ZAG" },
        { x: 50, y: 32, team: "A", label: "2", role: "MEI" },
        { x: 80, y: 24, team: "A", label: "3", role: "PON" },
      ],
      arrows: [
        { fromX: 8, fromY: 32, toX: 23, toY: 22, type: "pass" },
        { fromX: 8, fromY: 32, toX: 48, toY: 32, type: "pass" },
        { fromX: 8, fromY: 32, toX: 78, toY: 24, type: "pass" },
      ],
    },
  },
];

// ============================================================================
// LÚDICO (fun)
// ============================================================================
const FUN: ExerciseSeed[] = [
  {
    source: "platform",
    name: "Bobinho 4×1",
    slug: "bobinho-4x1",
    category: "fun",
    objective: "Passe sob pressão + posicionamento corporal",
    ageMin: 6,
    ageMax: 17,
    durationMin: 8,
    playersMin: 5,
    playersMax: 5,
    difficulty: 1,
    materials: ["Cones para área 8×8m", "1 bola"],
    instructions:
      "4 atletas em volta de 1. Quem está no meio tenta interceptar. Quem perder vai pro meio. Limite 2 toques.",
    variations:
      "Bobinho 5×2 · 6×2 · só 1 toque · só pé não-dominante.",
    coachingPoints:
      "Corpo aberto pra ver opções · qualidade do passe rasteiro · não passar pra quem está perto.",
    tags: ["ludico", "passe", "posicionamento", "classico", "rondo"],
    sourceCredit: "Universal — clássico do futebol",
    pitchLayout: {
      ...HALF,
      players: [
        { x: 30, y: 22, team: "A", label: "1" },
        { x: 50, y: 18, team: "A", label: "2" },
        { x: 50, y: 46, team: "A", label: "3" },
        { x: 30, y: 42, team: "A", label: "4" },
        { x: 40, y: 32, team: "B", label: "B" },
      ],
      arrows: [
        { fromX: 32, fromY: 22, toX: 48, toY: 18, type: "pass" },
        { fromX: 50, fromY: 20, toX: 50, toY: 44, type: "pass" },
      ],
    },
  },
  {
    source: "platform",
    name: "Caça ao tesouro com bola",
    slug: "caca-tesouro",
    category: "fun",
    objective: "Lúdico + condução + cooperação",
    ageMin: 5,
    ageMax: 9,
    durationMin: 12,
    playersMin: 6,
    playersMax: 16,
    difficulty: 1,
    materials: ["Coletes coloridos espalhados", "Bolas"],
    instructions:
      "Coletes coloridos espalhados. Cada atleta com bola. Treinador grita uma cor. Equipe que coletar mais coletes daquela cor (sem soltar a bola) ganha.",
    variations:
      "Tempo limitado · só pé fraco · em duplas (1 conduz, 1 coleta).",
    coachingPoints:
      "Diversão é essencial · condução curta · planejar caminho.",
    tags: ["ludico", "sub-7", "conducao", "cooperacao"],
    sourceCredit: "Pedagogia esportiva (Pablo Greco)",
    pitchLayout: {
      ...HALF,
      cones: [
        { x: 25, y: 18, color: "#ef4444" },
        { x: 35, y: 38, color: "#22c55e" },
        { x: 50, y: 22, color: "#ef4444" },
        { x: 60, y: 42, color: "#3b82f6" },
        { x: 75, y: 26, color: "#22c55e" },
        { x: 70, y: 48, color: "#ef4444" },
      ],
      players: [
        { x: 18, y: 32, team: "A", label: "1" },
        { x: 25, y: 32, team: "A", label: "2" },
        { x: 32, y: 32, team: "B", label: "3" },
        { x: 39, y: 32, team: "B", label: "4" },
      ],
    },
  },
  {
    source: "platform",
    name: "Futebol-tênis",
    slug: "futebol-tenis",
    category: "fun",
    objective: "Domínio aéreo + criatividade + diversão",
    ageMin: 9,
    ageMax: 17,
    durationMin: 15,
    playersMin: 4,
    playersMax: 8,
    difficulty: 2,
    materials: ["Rede ou linha de cones", "1 bola"],
    instructions:
      "2v2 ou 3v3 separados por rede. Bola pode quicar 1 vez. Máximo 3 toques antes de devolver. Pontua quem deixar a bola cair do outro lado.",
    variations: "Sem quique · só cabeça · só pé não-dominante · 1v1.",
    coachingPoints:
      "Comunicação · domínio antes de devolver · usar diferentes partes do corpo.",
    tags: ["ludico", "dominio", "criatividade"],
    sourceCredit: "Tradição brasileira · usado em CTs profissionais",
    pitchLayout: {
      ...HALF,
      zones: [
        { x: 18, y: 14, w: 28, h: 36, color: "#3b82f6", label: "A" },
        { x: 50, y: 14, w: 28, h: 36, color: "#ef4444", label: "B" },
      ],
      players: [
        { x: 28, y: 24, team: "A", label: "1" },
        { x: 28, y: 40, team: "A", label: "2" },
        { x: 60, y: 24, team: "B", label: "3" },
        { x: 60, y: 40, team: "B", label: "4" },
      ],
    },
  },
];

// ============================================================================
// VOLTA À CALMA (cooldown)
// ============================================================================
const COOLDOWN: ExerciseSeed[] = [
  {
    source: "platform",
    name: "Caminhada respiratória + alongamento estático",
    slug: "cooldown-caminhada",
    category: "cooldown",
    objective: "Reduzir frequência cardíaca + prevenção",
    ageMin: 9,
    ageMax: 17,
    durationMin: 10,
    playersMin: 1,
    playersMax: 30,
    difficulty: 1,
    materials: ["Nenhum"],
    instructions:
      "5min caminhada lenta com respiração diafragmática. Depois alongamento estático: posterior coxa, quadríceps, panturrilha, lombar (20s cada).",
    variations: "Em duplas (parceiro ajuda) · com bola fixa pra estabilidade.",
    coachingPoints:
      "Respiração ritmada · alongar até desconforto leve, sem dor · não prender a respiração.",
    tags: ["cooldown", "alongamento", "respiracao"],
    sourceCredit: "Manual de prevenção · FIFA 11+",
    pitchLayout: {
      ...HALF,
      players: Array.from({ length: 6 }, (_, i) => ({
        x: 25 + i * 10,
        y: 32,
        team: "A" as const,
      })),
    },
  },
  {
    source: "platform",
    name: "Roda de feedback (encerramento)",
    slug: "roda-feedback",
    category: "cooldown",
    objective: "Encerramento socioemocional + consolidação aprendizagem",
    ageMin: 6,
    ageMax: 17,
    durationMin: 8,
    playersMin: 4,
    playersMax: 30,
    difficulty: 1,
    materials: ["Nenhum"],
    instructions:
      "Atletas em círculo. Treinador pergunta: 'O que aprenderam hoje?', 'Momento mais difícil?', 'Quem ajudou alguém?'. Cada um fala (sem obrigação).",
    variations:
      "Cada um dá uma palavra · em pares + plenário · com bola passando (só fala quem segura).",
    coachingPoints:
      "Escuta ativa · não corrigir respostas · valorizar protagonismo.",
    tags: ["cooldown", "socioemocional", "feedback"],
    sourceCredit: "Pedagogia esportiva crítica · Júlio Garganta",
    pitchLayout: {
      ...HALF,
      players: Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return {
          x: 50 + 12 * Math.cos(angle),
          y: 32 + 12 * Math.sin(angle),
          team: "A" as const,
          label: String(i + 1),
        };
      }),
    },
  },
];

export const EXERCISE_CATALOG: ExerciseSeed[] = [
  ...WARMUP,
  ...TECHNICAL,
  ...TACTICAL,
  ...PHYSICAL,
  ...SET_PIECES,
  ...GOALKEEPER,
  ...FUN,
  ...COOLDOWN,
];
