/**
 * Radar chart simples em SVG nativo. Pra MVP. Substituível por Recharts depois.
 * Aceita 3 dimensões (técnica/tática/psicológica) com score 0-100 (= 0-10 * 10).
 */

export function ScoreRadar({
  tech,
  tactical,
  psych,
  size = 200,
  className,
}: {
  tech: number | null;
  tactical: number | null;
  psych: number | null;
  size?: number;
  className?: string;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.4;

  // Pontos do triângulo de cada eixo (0-100 → distância do centro)
  const score = (s: number | null) => (s ?? 0) / 100;

  // Eixos: técnica em cima, tática inferior direito, psicológica inferior esquerdo
  const axis = (idx: number, ratio: number) => {
    const angle = -Math.PI / 2 + (idx * 2 * Math.PI) / 3;
    return {
      x: cx + r * ratio * Math.cos(angle),
      y: cy + r * ratio * Math.sin(angle),
    };
  };

  const techPt = axis(0, score(tech));
  const tactPt = axis(1, score(tactical));
  const psychPt = axis(2, score(psych));

  // Anéis de fundo (50%, 100%)
  const outer = [axis(0, 1), axis(1, 1), axis(2, 1)];
  const middle = [axis(0, 0.5), axis(1, 0.5), axis(2, 0.5)];

  const polygon = (pts: { x: number; y: number }[]) =>
    pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  // Labels (deslocados pra fora)
  const labelTech = axis(0, 1.18);
  const labelTact = axis(1, 1.18);
  const labelPsych = axis(2, 1.18);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Radar de avaliação"
    >
      {/* Anéis */}
      <polygon
        points={polygon(outer)}
        fill="none"
        stroke="hsl(var(--border))"
        strokeWidth={1}
      />
      <polygon
        points={polygon(middle)}
        fill="none"
        stroke="hsl(var(--border))"
        strokeWidth={1}
        strokeDasharray="3 3"
      />

      {/* Eixos */}
      {[0, 1, 2].map((i) => {
        const p = axis(i, 1);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="hsl(var(--border))"
            strokeWidth={1}
          />
        );
      })}

      {/* Polígono de scores */}
      <polygon
        points={polygon([techPt, tactPt, psychPt])}
        fill="hsl(var(--brand) / 0.25)"
        stroke="hsl(var(--brand))"
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Pontos */}
      {[techPt, tactPt, psychPt].map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={3.5}
          fill="hsl(var(--brand))"
        />
      ))}

      {/* Labels */}
      <text
        x={labelTech.x}
        y={labelTech.y}
        textAnchor="middle"
        fontSize={10}
        fontWeight={500}
        fill="hsl(var(--foreground))"
      >
        Técnica
      </text>
      <text
        x={labelTact.x}
        y={labelTact.y}
        textAnchor="middle"
        fontSize={10}
        fontWeight={500}
        fill="hsl(var(--foreground))"
      >
        Tática
      </text>
      <text
        x={labelPsych.x}
        y={labelPsych.y}
        textAnchor="middle"
        fontSize={10}
        fontWeight={500}
        fill="hsl(var(--foreground))"
      >
        Psicológica
      </text>

      {/* Scores em pequeno ao lado dos pontos */}
      <text
        x={techPt.x}
        y={techPt.y - 8}
        textAnchor="middle"
        fontSize={9}
        fontFamily="ui-monospace, monospace"
        fontWeight={600}
        fill="hsl(var(--brand-text))"
      >
        {tech !== null ? (tech / 10).toFixed(1) : "—"}
      </text>
      <text
        x={tactPt.x + 12}
        y={tactPt.y + 4}
        textAnchor="start"
        fontSize={9}
        fontFamily="ui-monospace, monospace"
        fontWeight={600}
        fill="hsl(var(--brand-text))"
      >
        {tactical !== null ? (tactical / 10).toFixed(1) : "—"}
      </text>
      <text
        x={psychPt.x - 12}
        y={psychPt.y + 4}
        textAnchor="end"
        fontSize={9}
        fontFamily="ui-monospace, monospace"
        fontWeight={600}
        fill="hsl(var(--brand-text))"
      >
        {psych !== null ? (psych / 10).toFixed(1) : "—"}
      </text>
    </svg>
  );
}
