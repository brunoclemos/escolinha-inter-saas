import type { NewExercise } from "@/lib/db/schema";

/**
 * Catálogo inicial de exercícios — base CBF Academy + clássicos da literatura.
 * São exercícios "platform" (tenantId=null) visíveis a todos os tenants.
 * Tenants podem clonar pra customizar.
 */

export const EXERCISE_CATALOG: Omit<
  NewExercise,
  "id" | "createdAt" | "updatedAt" | "tenantId"
>[] = [
  // ========== AQUECIMENTO ==========
  {
    source: "platform",
    name: "Estafeta com cones",
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
      "Divida em filas. Cada atleta percorre o circuito de cones em zigue-zague conduzindo a bola e retorna entregando ao próximo. Quem terminar primeiro ganha pontos.",
    variations:
      "Trocar de pé a cada cone · usar só o pé não-dominante · adicionar um drible final em alvo.",
    coachingPoints:
      "Pequenos toques · cabeça erguida nos últimos 2 cones · proteção da bola.",
    tags: ["aquecimento", "ludico", "lateralidade", "conducao"],
    sourceCredit: "CBF Academy — Sub-7 a Sub-11",
    pitchLayout: {
      half: true,
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
      arrows: [
        { fromX: 12, fromY: 32, toX: 78, toY: 32, type: "dribble" },
      ],
    },
  },
  {
    source: "platform",
    name: "Pega-pega com proteção de bola",
    slug: "pega-pega-protecao",
    category: "warmup",
    objective: "Aquecer + introduzir proteção de bola e visão periférica",
    ageMin: 6,
    ageMax: 14,
    durationMin: 8,
    playersMin: 8,
    playersMax: 20,
    difficulty: 1,
    materials: ["1 bola por jogador", "Cones para delimitar área"],
    instructions:
      "Todos com bola dentro de uma área de 20x20m. 2 atletas são pegadores (sem bola). Quem é pego troca de função. Bola sempre presa no pé.",
    variations:
      "Aumentar pegadores · só pé não-dominante · obrigar olhar pra cima.",
    coachingPoints: "Mudanças de direção curtas · cabeça erguida.",
    tags: ["aquecimento", "ludico", "protecao"],
    sourceCredit: "CBF Academy",
    pitchLayout: {
      half: true,
      zones: [
        {
          x: 25,
          y: 12,
          w: 50,
          h: 40,
          color: "#facc15",
          label: "Área 20x20m",
        },
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

  // ========== TÉCNICA ==========
  {
    source: "platform",
    name: "Condução em slalom + finalização",
    slug: "slalom-finalizacao",
    category: "technical",
    objective: "Condução de bola em velocidade + finalização precisa",
    ageMin: 8,
    ageMax: 15,
    durationMin: 15,
    playersMin: 4,
    playersMax: 12,
    difficulty: 2,
    materials: ["6 cones em zigue-zague", "1 mini gol", "Várias bolas"],
    instructions:
      "Atleta sai conduzindo entre os cones e finaliza no gol. Cronometra-se o tempo. Cada erro de cone soma 1 segundo de penalidade.",
    variations:
      "Adicionar goleiro · pé não-dominante na finalização · finalizar no canto definido.",
    coachingPoints:
      "Toques curtos no slalom · acelerar após o último cone · escolher o canto antes de chutar.",
    tags: ["tecnica", "conducao", "finalizacao", "drible"],
    sourceCredit: "Acervo técnico de academias",
    pitchLayout: {
      half: true,
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
    materials: ["4 cones formando quadrado 8x8m", "1 bola"],
    instructions:
      "4 atletas, um em cada vértice do quadrado. Passes em sentido horário. Após 1 minuto inverter. Variação: depois de passar, correr para o próximo vértice (pass and follow).",
    variations:
      "Pass and go · só com 2 toques · com pé não-dominante · adicionar recepção orientada.",
    coachingPoints:
      "Recepção orientada pra direção do próximo passe · força do passe coerente com distância · cabeça erguida.",
    tags: ["tecnica", "passe", "recepcao"],
    sourceCredit: "Manual técnico CBF",
    pitchLayout: {
      half: true,
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
      "Um joga a bola pra cabeça do parceiro. Alternar cabeceio defensivo (alto e longe) e ofensivo (pra baixo, em alvo no chão).",
    variations:
      "Adicionar salto · com defensor passivo · cabeceio em direção a um cone-alvo.",
    coachingPoints:
      "Olhos abertos · contato com a testa · uso do pescoço (não só salto) · timing.",
    tags: ["tecnica", "cabeceio"],
    sourceCredit: "CBF Academy — Sub-13+",
    pitchLayout: {
      half: true,
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

  // ========== TÁTICA ==========
  {
    source: "platform",
    name: "Jogo reduzido 4x4 com gol móvel",
    slug: "4x4-gol-movel",
    category: "tactical",
    objective: "Tomada de decisão + transição rápida",
    ageMin: 9,
    ageMax: 17,
    durationMin: 20,
    playersMin: 8,
    playersMax: 8,
    difficulty: 3,
    materials: ["2 mini-gols", "Cones para campo 30x20m", "Coletes"],
    instructions:
      "4x4 em campo reduzido. Cada gol tem 2m de largura. Permitido 3 toques no máximo. Após gol, time que fez recomeça.",
    variations:
      "Sem limite de toques · adicionar curingas (atletas neutros) · 4x4+1 (curinga ofensivo).",
    coachingPoints:
      "Apoio ao portador · profundidade no ataque · transição imediata após perda.",
    tags: ["tatica", "jogo-reduzido", "transicao"],
    sourceCredit: "Metodologia espanhola",
    pitchLayout: {
      half: true,
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
    materials: ["Coletes", "Cones para marcar zonas", "1 bola"],
    instructions:
      "4 zagueiros se posicionam em linha. Treinador desloca a bola pelos lados. Linha desloca em bloco mantendo distância de 4-6m entre os jogadores. Trabalhar dobra de marcação.",
    variations:
      "Adicionar atacantes adversários · adicionar volante na frente da linha (5).",
    coachingPoints:
      "Compactar lado da bola · proteção do lateral oposto · ofside line.",
    tags: ["tatica", "defensivo", "posicionamento"],
    sourceCredit: "Pep Lijnders / Liverpool methodology",
    pitchLayout: {
      half: true,
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

  // ========== FÍSICO ==========
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
    materials: ["Cones de 10m em 10m", "Cronômetro"],
    instructions:
      "Aquecimento articular. 3 sprints de 10m. 3 sprints de 20m. 2 sprints de 30m. Recuperação 1:6 (10s sprint = 60s descanso).",
    variations:
      "Sprint com mudança de direção · sprint após salto · sprint com bola.",
    coachingPoints:
      "Postura inicial baixa · braços alternados · não desacelerar antes da linha.",
    tags: ["fisico", "velocidade", "sprint"],
    sourceCredit: "Periodização tática",
    pitchLayout: {
      half: true,
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
      "Sequência de 5 passagens pela escada com padrões diferentes (1 pé por casa, 2 pés, lateral, frente/trás). Após escada, sprint de 10m.",
    variations:
      "Adicionar bola após o sprint · finalização ao final · com mudança de direção.",
    coachingPoints:
      "Joelhos altos · contato rápido com o chão · cabeça erguida olhando frente.",
    tags: ["fisico", "coordenacao", "agilidade"],
    sourceCredit: "Manual de preparação física",
    pitchLayout: {
      half: true,
      zones: [
        {
          x: 18,
          y: 30,
          w: 30,
          h: 4,
          color: "#fbbf24",
          label: "ESCADA",
        },
      ],
      cones: [{ x: 60, y: 32 }],
      arrows: [{ fromX: 49, fromY: 32, toX: 59, toY: 32, type: "run" }],
    },
  },

  // ========== BOLA PARADA ==========
  {
    source: "platform",
    name: "Cobrança de escanteio com 3 zonas-alvo",
    slug: "escanteio-3-zonas",
    category: "set_pieces",
    objective: "Precisão na bola parada + movimentação no ataque",
    ageMin: 13,
    ageMax: 17,
    durationMin: 15,
    playersMin: 4,
    playersMax: 12,
    difficulty: 3,
    materials: ["Várias bolas", "Coletes para zonas", "1 mini-gol"],
    instructions:
      "Cobrador alterna 3 zonas-alvo (primeira trave, segunda trave, ponto do pênalti). Atacantes treinam movimentação para cada zona. Goleiro defende.",
    variations:
      "Adicionar zagueiros · cobrança curta · cobrança rasteira pra fora da área.",
    coachingPoints:
      "Sincronização entre cobrador e atacantes · sinal combinado · trajetória da bola.",
    tags: ["bola-parada", "escanteio", "ataque"],
    sourceCredit: "Manual de bola parada",
    pitchLayout: {
      half: true,
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
      arrows: [
        { fromX: 94, fromY: 10, toX: 84, toY: 22, type: "pass" },
      ],
    },
  },

  // ========== GOLEIRO ==========
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
      "Treinador finaliza alternadamente nos 4 cantos do gol. Goleiro defende e retorna ao centro. Sequência de 10 finalizações. Trocar de goleiro.",
    variations:
      "Finalização rasteira · alta · com defletor antes (parede) · após drible.",
    coachingPoints:
      "Posicionamento na pequena área · queda lateral correta · usar ambas as mãos.",
    tags: ["goleiro", "reflexo", "posicionamento"],
    sourceCredit: "Manual técnico de goleiros",
    pitchLayout: {
      half: true,
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

  // ========== LÚDICO ==========
  {
    source: "platform",
    name: "Bobinho 4x1",
    slug: "bobinho-4x1",
    category: "fun",
    objective: "Passe sob pressão + posicionamento corporal",
    ageMin: 6,
    ageMax: 17,
    durationMin: 8,
    playersMin: 5,
    playersMax: 5,
    difficulty: 1,
    materials: ["Cones para área 8x8m", "1 bola"],
    instructions:
      "4 atletas em volta de 1. O do meio tenta interceptar. Quem perder a bola vai pro meio. Limite de 2 toques pra dificultar.",
    variations:
      "Bobinho 5x2 · 6x2 · só com 1 toque · só com pé não-dominante.",
    coachingPoints:
      "Corpo aberto pra ver opções · qualidade do passe rasteiro · não passar pra quem está perto.",
    tags: ["ludico", "passe", "posicionamento", "classico"],
    sourceCredit: "Universal — clássico do futebol",
    pitchLayout: {
      half: true,
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
];
