/**
 * Radar chart com overlay de até 2 períodos pra comparar evolução.
 * Variant do score-radar.tsx que aceita "previous" opcional.
 */

export function ScoreRadarOverlay({
  current,
  previous,
  size = 220,
  className,
  showLabels = true,
}: {
  current: { tech: number | null; tactical: number | null; psych: number | null; label?: string };
  previous?: { tech: number | null; tactical: number | null; psych: number | null; label?: string };
  size?: number;
  className?: string;
  showLabels?: boolean;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.4;

  const score = (s: number | null) => (s ?? 0) / 100;

  const axis = (idx: number, ratio: number) => {
    const angle = -Math.PI / 2 + (idx * 2 * Math.PI) / 3;
    return {
      x: cx + r * ratio * Math.cos(angle),
      y: cy + r * ratio * Math.sin(angle),
    };
  };

  const polygon = (pts: { x: number; y: number }[]) =>
    pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  const triangle = (
    a: number | null,
    b: number | null,
    c: number | null
  ) => [axis(0, score(a)), axis(1, score(b)), axis(2, score(c))];

  const outer = [axis(0, 1), axis(1, 1), axis(2, 1)];
  const middle = [axis(0, 0.5), axis(1, 0.5), axis(2, 0.5)];

  const labelTech = axis(0, 1.18);
  const labelTact = axis(1, 1.18);
  const labelPsych = axis(2, 1.18);

  const currentPoly = triangle(current.tech, current.tactical, current.psych);
  const previousPoly = previous
    ? triangle(previous.tech, previous.tactical, previous.psych)
    : null;

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="w-full h-auto"
        role="img"
        aria-label="Radar comparativo"
      >
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

        {/* Período anterior (cinza, atrás) */}
        {previousPoly && (
          <>
            <polygon
              points={polygon(previousPoly)}
              fill="hsl(var(--muted-foreground) / 0.15)"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              strokeLinejoin="round"
            />
            {previousPoly.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={2.5}
                fill="hsl(var(--muted-foreground))"
              />
            ))}
          </>
        )}

        {/* Período atual (brand, na frente) */}
        <polygon
          points={polygon(currentPoly)}
          fill="hsl(var(--brand) / 0.25)"
          stroke="hsl(var(--brand))"
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {currentPoly.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={3.5}
            fill="hsl(var(--brand))"
          />
        ))}

        {/* Labels */}
        {showLabels && (
          <>
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
          </>
        )}
      </svg>

      {previous && (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-brand" />
            {current.label ?? "Atual"}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-sm border border-dashed border-muted-foreground bg-muted-foreground/20" />
            {previous.label ?? "Anterior"}
          </span>
        </div>
      )}
    </div>
  );
}
