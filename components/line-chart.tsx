/**
 * Line chart simples em SVG nativo. Mobile-friendly, sem dependência extra.
 * Suporta múltiplas séries com cores diferentes.
 */

export type ChartPoint = {
  date: string; // ISO date YYYY-MM-DD
  value: number;
};

export type ChartSeries = {
  label: string;
  color: string;
  points: ChartPoint[];
  unit?: string;
};

export function LineChart({
  series,
  height = 220,
  className,
  yLabel,
}: {
  series: ChartSeries[];
  height?: number;
  className?: string;
  yLabel?: string;
}) {
  const allPoints = series.flatMap((s) => s.points);
  if (allPoints.length === 0) {
    return (
      <div
        className={`flex items-center justify-center rounded-md border border-dashed text-xs text-muted-foreground ${className ?? ""}`}
        style={{ height }}
      >
        Sem dados ainda
      </div>
    );
  }

  // Domínio
  const dates = allPoints.map((p) => new Date(p.date).getTime());
  const minDate = Math.min(...dates);
  const maxDate = Math.max(...dates);
  const dateSpan = Math.max(maxDate - minDate, 1);

  const values = allPoints.map((p) => p.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const valuePadding = (maxVal - minVal) * 0.15 || 1;
  const yMin = Math.max(0, minVal - valuePadding);
  const yMax = maxVal + valuePadding;
  const yRange = yMax - yMin;

  // SVG dims (viewBox)
  const W = 600;
  const H = 220;
  const padL = 36;
  const padR = 12;
  const padT = 16;
  const padB = 28;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const x = (date: string) => {
    const t = new Date(date).getTime();
    return padL + ((t - minDate) / dateSpan) * innerW;
  };
  const y = (val: number) =>
    padT + innerH - ((val - yMin) / yRange) * innerH;

  // Y ticks (5 níveis)
  const yTicks = 5;
  const yStep = yRange / yTicks;
  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => yMin + i * yStep);

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label={`Gráfico de evolução: ${series.map((s) => s.label).join(", ")}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines + Y labels */}
        {ticks.map((t, i) => {
          const yPos = y(t);
          return (
            <g key={i}>
              <line
                x1={padL}
                y1={yPos}
                x2={W - padR}
                y2={yPos}
                stroke="hsl(var(--border))"
                strokeWidth={0.5}
                strokeDasharray={i === 0 ? "0" : "3 3"}
              />
              <text
                x={padL - 5}
                y={yPos + 3}
                textAnchor="end"
                fontSize={9}
                fontFamily="ui-monospace, monospace"
                fill="hsl(var(--muted-foreground))"
              >
                {t.toFixed(t < 10 ? 1 : 0)}
              </text>
            </g>
          );
        })}

        {/* Y label */}
        {yLabel && (
          <text
            x={padL}
            y={padT - 4}
            fontSize={9}
            fontFamily="ui-monospace, monospace"
            fill="hsl(var(--muted-foreground))"
          >
            {yLabel}
          </text>
        )}

        {/* Linhas + pontos por série */}
        {series.map((s, sIdx) => {
          if (s.points.length === 0) return null;
          const sorted = [...s.points].sort(
            (a, b) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          const path = sorted
            .map(
              (p, i) =>
                `${i === 0 ? "M" : "L"} ${x(p.date).toFixed(1)} ${y(p.value).toFixed(1)}`
            )
            .join(" ");
          return (
            <g key={sIdx}>
              <path
                d={path}
                fill="none"
                stroke={s.color}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {sorted.map((p, i) => (
                <g key={i}>
                  <circle
                    cx={x(p.date)}
                    cy={y(p.value)}
                    r={3.5}
                    fill={s.color}
                    stroke="white"
                    strokeWidth={1.5}
                  />
                </g>
              ))}
            </g>
          );
        })}

        {/* Datas no eixo X (primeira e última) */}
        <text
          x={padL}
          y={H - 8}
          fontSize={9}
          fontFamily="ui-monospace, monospace"
          fill="hsl(var(--muted-foreground))"
          textAnchor="start"
        >
          {formatShortDate(new Date(minDate))}
        </text>
        <text
          x={W - padR}
          y={H - 8}
          fontSize={9}
          fontFamily="ui-monospace, monospace"
          fill="hsl(var(--muted-foreground))"
          textAnchor="end"
        >
          {formatShortDate(new Date(maxDate))}
        </text>
      </svg>

      {/* Legenda */}
      {series.length > 1 && (
        <div className="mt-2 flex flex-wrap gap-3 text-xs">
          {series.map((s) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatShortDate(d: Date) {
  return d.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
}
