/**
 * Catálogo de fundamentos avaliados, baseado no brief e em referências CBF Academy.
 * Fixos por enquanto. Em fase futura, vira configurável por tenant/categoria.
 */

export const TECHNICAL_FUNDAMENTALS = [
  { key: "conducao", label: "Condução de bola" },
  { key: "passe_curto", label: "Passe curto" },
  { key: "passe_longo", label: "Passe longo" },
  { key: "recepcao", label: "Recepção / domínio" },
  { key: "finalizacao_dom", label: "Finalização (pé dominante)" },
  { key: "finalizacao_nao_dom", label: "Finalização (pé não-dominante)" },
  { key: "cabeceio", label: "Cabeceio" },
  { key: "desarme", label: "Desarme / marcação" },
  { key: "drible", label: "Drible / 1 contra 1" },
  { key: "bola_parada", label: "Cobrança de bola parada" },
] as const;

export const TACTICAL_DIMENSIONS = [
  { key: "leitura_jogo", label: "Leitura de jogo / tomada de decisão" },
  { key: "posicionamento", label: "Posicionamento" },
  { key: "movimentacao", label: "Movimentação sem bola" },
  { key: "cobertura", label: "Cobertura / transições" },
  { key: "funcao_tatica", label: "Cumprimento da função tática" },
  { key: "compreensao", label: "Compreensão do sistema" },
] as const;

export const PSYCH_DIMENSIONS = [
  { key: "concentracao", label: "Concentração / foco" },
  { key: "lideranca", label: "Liderança" },
  { key: "competitividade", label: "Competitividade / raça" },
  { key: "resiliencia", label: "Resiliência" },
  { key: "disciplina", label: "Disciplina / comportamento" },
  { key: "trabalho_equipe", label: "Trabalho em equipe / comunicação" },
  { key: "frequencia", label: "Frequência / pontualidade" },
] as const;

export type TechnicalKey = (typeof TECHNICAL_FUNDAMENTALS)[number]["key"];
export type TacticalKey = (typeof TACTICAL_DIMENSIONS)[number]["key"];
export type PsychKey = (typeof PSYCH_DIMENSIONS)[number]["key"];

export const TECHNICAL_LABELS: Record<string, string> = Object.fromEntries(
  TECHNICAL_FUNDAMENTALS.map((f) => [f.key, f.label])
);
export const TACTICAL_LABELS: Record<string, string> = Object.fromEntries(
  TACTICAL_DIMENSIONS.map((f) => [f.key, f.label])
);
export const PSYCH_LABELS: Record<string, string> = Object.fromEntries(
  PSYCH_DIMENSIONS.map((f) => [f.key, f.label])
);

export function average(scores: number[]): number | null {
  const valid = scores.filter((s) => Number.isFinite(s));
  if (valid.length === 0) return null;
  return Math.round((valid.reduce((a, b) => a + b, 0) / valid.length) * 10) / 10;
}
