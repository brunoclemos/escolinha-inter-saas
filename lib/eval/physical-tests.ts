/**
 * Catálogo de testes físicos.
 * Baseado em CBF Academy + protocolos clássicos da literatura.
 * Cada teste tem unidade fixa e dica de "melhor é maior" ou "melhor é menor".
 */

export type PhysicalTestSpec = {
  code: string;
  label: string;
  shortLabel: string;
  unit: "s" | "cm" | "m" | "level" | "reps";
  category: "sprint" | "jump" | "agility" | "endurance" | "flexibility" | "strength";
  ageMin: number;
  ageMax: number;
  /** Direção de melhoria: "lower" = menor é melhor (sprint), "higher" = maior é melhor (salto) */
  improvement: "lower" | "higher";
  description: string;
};

export const PHYSICAL_TESTS: PhysicalTestSpec[] = [
  // ===== Sprints =====
  {
    code: "sprint_10m",
    label: "Sprint 10m",
    shortLabel: "10m",
    unit: "s",
    category: "sprint",
    ageMin: 8,
    ageMax: 17,
    improvement: "lower",
    description: "Tempo em segundos para percorrer 10m em linha reta, partida estática.",
  },
  {
    code: "sprint_20m",
    label: "Sprint 20m",
    shortLabel: "20m",
    unit: "s",
    category: "sprint",
    ageMin: 8,
    ageMax: 17,
    improvement: "lower",
    description: "Tempo para percorrer 20m em linha reta, partida estática.",
  },
  {
    code: "sprint_30m",
    label: "Sprint 30m",
    shortLabel: "30m",
    unit: "s",
    category: "sprint",
    ageMin: 14,
    ageMax: 17,
    improvement: "lower",
    description: "Tempo para percorrer 30m em linha reta, partida estática.",
  },
  {
    code: "flying_20m",
    label: "Sprint lançado 20m",
    shortLabel: "Lançado 20m",
    unit: "s",
    category: "sprint",
    ageMin: 14,
    ageMax: 17,
    improvement: "lower",
    description: "Velocidade máxima — 20m com lançamento prévio.",
  },

  // ===== Saltos =====
  {
    code: "horizontal_jump",
    label: "Salto horizontal parado",
    shortLabel: "Salto horiz.",
    unit: "cm",
    category: "jump",
    ageMin: 8,
    ageMax: 17,
    improvement: "higher",
    description: "Distância em cm partindo parado, impulso com os dois pés.",
  },
  {
    code: "cmj",
    label: "Counter Movement Jump (CMJ)",
    shortLabel: "CMJ",
    unit: "cm",
    category: "jump",
    ageMin: 11,
    ageMax: 17,
    improvement: "higher",
    description: "Salto vertical com contramovimento. Mãos na cintura.",
  },
  {
    code: "sj",
    label: "Squat Jump (SJ)",
    shortLabel: "SJ",
    unit: "cm",
    category: "jump",
    ageMin: 14,
    ageMax: 17,
    improvement: "higher",
    description: "Salto vertical partindo de agachamento, sem contramovimento.",
  },
  {
    code: "drop_jump",
    label: "Drop Jump",
    shortLabel: "Drop",
    unit: "cm",
    category: "jump",
    ageMin: 14,
    ageMax: 17,
    improvement: "higher",
    description: "Queda de plataforma + salto reativo imediato.",
  },

  // ===== Agilidade =====
  {
    code: "illinois",
    label: "Illinois Agility Test",
    shortLabel: "Illinois",
    unit: "s",
    category: "agility",
    ageMin: 11,
    ageMax: 17,
    improvement: "lower",
    description: "Circuito clássico de mudanças de direção (10x5m + slalom).",
  },
  {
    code: "t_test",
    label: "T-Test",
    shortLabel: "T-Test",
    unit: "s",
    category: "agility",
    ageMin: 11,
    ageMax: 17,
    improvement: "lower",
    description: "Agilidade com mudança de direção em formato de T.",
  },
  {
    code: "square",
    label: "Teste do Quadrado",
    shortLabel: "Quadrado",
    unit: "s",
    category: "agility",
    ageMin: 14,
    ageMax: 17,
    improvement: "lower",
    description: "4 cones formando quadrado de 4m. Tempo do circuito completo.",
  },
  {
    code: "shuttle_run",
    label: "Shuttle Run",
    shortLabel: "Shuttle",
    unit: "s",
    category: "agility",
    ageMin: 8,
    ageMax: 13,
    improvement: "lower",
    description: "Corrida vai-e-vem entre dois pontos. Comum no Sub-11/13.",
  },

  // ===== Resistência =====
  {
    code: "yoyo_ir1",
    label: "Yo-Yo Intermittent Recovery Nível 1",
    shortLabel: "Yo-Yo IR1",
    unit: "m",
    category: "endurance",
    ageMin: 11,
    ageMax: 17,
    improvement: "higher",
    description: "Distância total percorrida (em metros) até falhar 2x consecutivos.",
  },
  {
    code: "yoyo_ir2",
    label: "Yo-Yo Intermittent Recovery Nível 2",
    shortLabel: "Yo-Yo IR2",
    unit: "m",
    category: "endurance",
    ageMin: 14,
    ageMax: 17,
    improvement: "higher",
    description: "Versão mais intensa do Yo-Yo. Para sub-15+.",
  },
  {
    code: "rast",
    label: "RAST (Running-based Anaerobic Sprint Test)",
    shortLabel: "RAST",
    unit: "s",
    category: "endurance",
    ageMin: 14,
    ageMax: 17,
    improvement: "lower",
    description: "6x35m com 10s de intervalo. Soma dos tempos.",
  },

  // ===== Flexibilidade =====
  {
    code: "sit_and_reach",
    label: "Sentar e alcançar",
    shortLabel: "Senta-alcança",
    unit: "cm",
    category: "flexibility",
    ageMin: 8,
    ageMax: 17,
    improvement: "higher",
    description: "Flexibilidade isquiotibial e lombar.",
  },

  // ===== Força / Triagem =====
  {
    code: "fms",
    label: "Functional Movement Screen (FMS)",
    shortLabel: "FMS",
    unit: "level",
    category: "strength",
    ageMin: 14,
    ageMax: 17,
    improvement: "higher",
    description: "Triagem de qualidade do movimento. Score 0-21.",
  },
];

export const PHYSICAL_TESTS_BY_CODE: Record<string, PhysicalTestSpec> =
  Object.fromEntries(PHYSICAL_TESTS.map((t) => [t.code, t]));

export const PHYSICAL_CATEGORY_LABELS: Record<
  PhysicalTestSpec["category"],
  string
> = {
  sprint: "Velocidade",
  jump: "Salto / Potência",
  agility: "Agilidade",
  endurance: "Resistência",
  flexibility: "Flexibilidade",
  strength: "Força / Triagem",
};

export function testsForAge(age: number): PhysicalTestSpec[] {
  return PHYSICAL_TESTS.filter((t) => age >= t.ageMin && age <= t.ageMax);
}

export function formatTestValue(spec: PhysicalTestSpec, valueX1000: number): string {
  const v = valueX1000 / 1000;
  if (spec.unit === "s") return `${v.toFixed(2)} s`;
  if (spec.unit === "cm") return `${v.toFixed(1)} cm`;
  if (spec.unit === "m") return `${v.toFixed(0)} m`;
  if (spec.unit === "level") return `${v.toFixed(0)}`;
  if (spec.unit === "reps") return `${v.toFixed(0)} reps`;
  return String(v);
}
