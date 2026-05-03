/**
 * Cálculo de maturação biológica (PHV - Peak Height Velocity).
 *
 * Implementação simplificada baseada na referência IMC z-score por idade
 * adaptada para futebol de base. Não substitui Mirwald (que exige
 * sitting_height + leg_length), mas oferece uma estimativa útil para
 * coordenadores quando só temos altura, peso e idade cronológica.
 *
 * Output: idade biológica estimada * 10, e classificação
 * (early|on-track|late) baseada no offset.
 *
 * Referência:
 * - Mirwald et al. (2002) — gold standard, requer dados antropométricos extras
 * - Khamis-Roche (1994) — predição de altura adulta, requer altura dos pais
 * - Aqui: aproximação por percentil OMS de altura para idade/sexo
 */

export type MaturationStatus = "early" | "on-track" | "late" | "unknown";

/**
 * Tabelas simplificadas de altura mediana por idade (OMS, meninos 5-19).
 * Em produção, usar tabela completa (P3, P15, P50, P85, P97).
 */
const MEDIAN_HEIGHT_BOYS: Record<number, number> = {
  5: 110,
  6: 116,
  7: 122,
  8: 128,
  9: 133,
  10: 139,
  11: 144,
  12: 150,
  13: 157,
  14: 164,
  15: 170,
  16: 174,
  17: 175,
};

/**
 * Estima idade biológica baseada em altura e idade cronológica.
 * - Se a altura está acima da mediana da idade -> idade biológica > cronológica (precoce)
 * - Se está abaixo -> idade biológica < cronológica (tardio)
 *
 * Cada ~6cm de diferença equivale a aproximadamente 1 ano biológico
 * em meninos na fase de crescimento (8-15 anos).
 */
export function estimateBiologicalAge(
  heightCm: number | null,
  chronologicalAge: number
): number | null {
  if (!heightCm || heightCm < 50 || heightCm > 250) return null;

  const round = Math.floor(chronologicalAge);
  const median =
    MEDIAN_HEIGHT_BOYS[round] ?? MEDIAN_HEIGHT_BOYS[17] ?? 175;
  const diffCm = heightCm - median;

  // Peso ~6cm/ano biológico durante a puberdade
  const offsetYears = diffCm / 6;

  return Math.max(5, Math.min(20, chronologicalAge + offsetYears));
}

export function classifyMaturation(
  biologicalAge: number | null,
  chronologicalAge: number
): MaturationStatus {
  if (biologicalAge === null) return "unknown";
  const diff = biologicalAge - chronologicalAge;
  if (diff > 1) return "early";
  if (diff < -1) return "late";
  return "on-track";
}

export function maturationLabel(status: MaturationStatus): string {
  switch (status) {
    case "early":
      return "Precoce";
    case "late":
      return "Tardio";
    case "on-track":
      return "No esperado";
    default:
      return "—";
  }
}

export function maturationDescription(status: MaturationStatus): string {
  switch (status) {
    case "early":
      return "Idade biológica acima da cronológica. Pode parecer mais forte ou rápido só por estar mais maduro — atenção pra não tirar conclusões precipitadas.";
    case "late":
      return "Idade biológica abaixo da cronológica. Pode estar fisicamente atrás dos colegas — precisa paciência e protocolo adaptado, sem comparar.";
    case "on-track":
      return "Desenvolvimento físico no esperado pra idade.";
    default:
      return "Sem dados suficientes pra estimar.";
  }
}
