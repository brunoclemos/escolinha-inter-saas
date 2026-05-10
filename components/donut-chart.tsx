/**
 * Donut chart simples em SVG nativo. Recebe segments coloridos.
 */

export type DonutSegment = {
  label: string;
  value: number;
  color: string;
};

export function DonutChart({
  segments,
  size = 180,
  thickness = 24,
  centerLabel,
  centerValue,
  className,
}: {
  segments: DonutSegment[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string | number;
  className?: string;
}) {
  const total = segments.reduce((acc, s) => acc + s.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - thickness) / 2;
  const circumference = 2 * Math.PI * r;

  let offset = 0;

  return (
    <div className={className}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          viewBox={`0 0 ${size} ${size}`}
          width={size}
          height={size}
          className="-rotate-90"
        >
          {/* fundo */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={thickness}
          />
          {total > 0 &&
            segments.map((s, i) => {
              const segLen = (s.value / total) * circumference;
              const dasharray = `${segLen} ${circumference - segLen}`;
              const el = (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={thickness}
                  strokeDasharray={dasharray}
                  strokeDashoffset={-offset}
                  strokeLinecap="butt"
                />
              );
              offset += segLen;
              return el;
            })}
        </svg>
        {(centerLabel || centerValue) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {centerValue !== undefined && (
              <p className="font-mono text-3xl font-bold tabular-nums leading-none">
                {centerValue}
              </p>
            )}
            {centerLabel && (
              <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                {centerLabel}
              </p>
            )}
          </div>
        )}
      </div>

      {segments.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {segments.map((s) => (
            <div key={s.label} className="flex items-center gap-2 text-xs">
              <span
                className="size-3 rounded-sm shrink-0"
                style={{ backgroundColor: s.color }}
              />
              <span className="flex-1 truncate">{s.label}</span>
              <span className="font-mono font-semibold tabular-nums">
                {s.value}
              </span>
              <span className="w-10 text-right text-muted-foreground">
                {total > 0
                  ? `${Math.round((s.value / total) * 100)}%`
                  : "0%"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
