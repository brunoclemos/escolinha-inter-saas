/**
 * Mini-campo de futebol em SVG, estilo "futebol de botão" / FM Tactics.
 * Usado pra visualizar exercícios e posicionamento.
 *
 * Coordenadas: 0,0 = canto superior esquerdo. 100,100 = canto inferior direito.
 * Pode ser meio-campo (half=true) ou campo inteiro.
 */

export type Player = {
  x: number; // 0-100
  y: number; // 0-100
  team: "A" | "B" | "neutral";
  label?: string; // número ou letra
  role?: string; // posição (ex: "GR", "ZAG", "ATA")
};

export type Cone = {
  x: number;
  y: number;
  color?: string;
};

export type Goal = {
  x: number;
  y: number;
  side: "left" | "right" | "top" | "bottom";
};

export type Arrow = {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  type?: "run" | "pass" | "dribble";
};

export type Zone = {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  label?: string;
};

export function FootballPitch({
  half = false,
  players = [],
  cones = [],
  goals = [],
  arrows = [],
  zones = [],
  className,
  showGrid = false,
}: {
  half?: boolean;
  players?: Player[];
  cones?: Cone[];
  goals?: Goal[];
  arrows?: Arrow[];
  zones?: Zone[];
  className?: string;
  showGrid?: boolean;
}) {
  // Dimensões SVG (relativas ao 100x100 lógico)
  // Usa proporção realista 100:64 (metade) ou 100:64x2
  const aspectRatio = half ? 100 / 64 : 100 / 128; // half = horizontal, full = vertical-ish
  const W = 100;
  const H = half ? 64 : 128;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      className={`w-full h-auto ${className ?? ""}`}
      role="img"
      aria-label="Diagrama do exercício no campo"
    >
      <defs>
        {/* Padrão de grama listrada */}
        <pattern
          id="grass-stripes"
          x="0"
          y="0"
          width="100"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <rect width="100" height="8" fill="#3a8c3f" />
          <rect width="100" height="4" fill="#327336" />
        </pattern>
        {/* Marker de seta */}
        <marker
          id="arrowhead"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="white" />
        </marker>
        <marker
          id="arrowhead-pass"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" />
        </marker>
      </defs>

      {/* Grama */}
      <rect width={W} height={H} fill="url(#grass-stripes)" />

      {/* Linhas brancas do campo */}
      <g stroke="white" strokeWidth={0.4} fill="none">
        {/* Borda */}
        <rect x={2} y={2} width={W - 4} height={H - 4} />

        {half ? (
          <>
            {/* Linha de meio-campo (esquerda) */}
            <line x1={2} y1={2} x2={2} y2={H - 2} strokeWidth={0.4} />
            {/* Círculo central reduzido (no canto da meta) */}
            <circle cx={2} cy={H / 2} r={8} />
            {/* Grande área (direita) */}
            <rect x={W - 22} y={H / 2 - 16} width={20} height={32} />
            {/* Pequena área (direita) */}
            <rect x={W - 8} y={H / 2 - 7} width={6} height={14} />
            {/* Marca do penalti */}
            <circle cx={W - 14} cy={H / 2} r={0.5} fill="white" />
            {/* Trave direita */}
            <line
              x1={W - 2}
              y1={H / 2 - 5}
              x2={W - 2}
              y2={H / 2 + 5}
              stroke="white"
              strokeWidth={1.5}
            />
          </>
        ) : (
          <>
            {/* Linha do meio (horizontal) */}
            <line x1={2} y1={H / 2} x2={W - 2} y2={H / 2} />
            <circle cx={W / 2} cy={H / 2} r={10} />
            <circle cx={W / 2} cy={H / 2} r={0.5} fill="white" />

            {/* Grande área superior */}
            <rect x={W / 2 - 22} y={2} width={44} height={18} />
            {/* Pequena área superior */}
            <rect x={W / 2 - 8} y={2} width={16} height={6} />
            {/* Marca do pênalti superior */}
            <circle cx={W / 2} cy={12} r={0.5} fill="white" />

            {/* Grande área inferior */}
            <rect x={W / 2 - 22} y={H - 20} width={44} height={18} />
            {/* Pequena área inferior */}
            <rect x={W / 2 - 8} y={H - 8} width={16} height={6} />
            <circle cx={W / 2} cy={H - 12} r={0.5} fill="white" />

            {/* Traves */}
            <line
              x1={W / 2 - 5}
              y1={2}
              x2={W / 2 + 5}
              y2={2}
              strokeWidth={1.5}
            />
            <line
              x1={W / 2 - 5}
              y1={H - 2}
              x2={W / 2 + 5}
              y2={H - 2}
              strokeWidth={1.5}
            />
          </>
        )}
      </g>

      {/* Zonas (background colorido com label) */}
      {zones.map((z, i) => (
        <g key={`z-${i}`} opacity={0.35}>
          <rect
            x={z.x}
            y={z.y}
            width={z.w}
            height={z.h}
            fill={z.color}
            stroke={z.color}
            strokeWidth={0.3}
            strokeDasharray="1 1"
          />
          {z.label && (
            <text
              x={z.x + z.w / 2}
              y={z.y + z.h / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={3}
              fontWeight={600}
              fill="white"
            >
              {z.label}
            </text>
          )}
        </g>
      ))}

      {/* Grid (opcional, debugging) */}
      {showGrid && (
        <g opacity={0.2} stroke="white" strokeWidth={0.2}>
          {[...Array(10)].map((_, i) => (
            <line
              key={`gx-${i}`}
              x1={i * 10}
              y1={0}
              x2={i * 10}
              y2={H}
            />
          ))}
          {[...Array(Math.floor(H / 10) + 1)].map((_, i) => (
            <line
              key={`gy-${i}`}
              x1={0}
              y1={i * 10}
              x2={W}
              y2={i * 10}
            />
          ))}
        </g>
      )}

      {/* Setas */}
      {arrows.map((a, i) => {
        const stroke =
          a.type === "pass"
            ? "#fbbf24"
            : a.type === "dribble"
              ? "#fff"
              : "#fff";
        const dash =
          a.type === "pass"
            ? "1.5 1"
            : a.type === "dribble"
              ? "0.8 0.6"
              : "none";
        const marker =
          a.type === "pass" ? "url(#arrowhead-pass)" : "url(#arrowhead)";
        return (
          <line
            key={`a-${i}`}
            x1={a.fromX}
            y1={a.fromY}
            x2={a.toX}
            y2={a.toY}
            stroke={stroke}
            strokeWidth={0.7}
            strokeDasharray={dash}
            markerEnd={marker}
          />
        );
      })}

      {/* Cones */}
      {cones.map((c, i) => (
        <polygon
          key={`c-${i}`}
          points={`${c.x},${c.y - 1.6} ${c.x - 1.2},${c.y + 0.8} ${c.x + 1.2},${c.y + 0.8}`}
          fill={c.color ?? "#f97316"}
          stroke="#7c2d12"
          strokeWidth={0.2}
        />
      ))}

      {/* Gols extras (mini gols dentro do campo) */}
      {goals.map((g, i) => {
        const w = 5;
        const h = 1.5;
        let x = g.x - w / 2;
        let y = g.y - h / 2;
        if (g.side === "left" || g.side === "right") {
          return (
            <rect
              key={`g-${i}`}
              x={g.x - 0.7}
              y={g.y - 2.5}
              width={1.4}
              height={5}
              fill="#1f2937"
              stroke="white"
              strokeWidth={0.3}
            />
          );
        }
        return (
          <rect
            key={`g-${i}`}
            x={x}
            y={y}
            width={w}
            height={h}
            fill="#1f2937"
            stroke="white"
            strokeWidth={0.3}
          />
        );
      })}

      {/* Jogadores */}
      {players.map((p, i) => {
        const fill =
          p.team === "A"
            ? "#dc2626"
            : p.team === "B"
              ? "#1d4ed8"
              : "#6b7280";
        const r = 2.4;
        return (
          <g key={`p-${i}`}>
            <circle
              cx={p.x}
              cy={p.y}
              r={r}
              fill={fill}
              stroke="white"
              strokeWidth={0.5}
            />
            {p.label && (
              <text
                x={p.x}
                y={p.y + 0.7}
                textAnchor="middle"
                fontSize={2.4}
                fontWeight={700}
                fill="white"
              >
                {p.label}
              </text>
            )}
            {p.role && (
              <text
                x={p.x}
                y={p.y + 5}
                textAnchor="middle"
                fontSize={2}
                fontWeight={500}
                fill="white"
                style={{ filter: "drop-shadow(0 0 1px rgba(0,0,0,0.8))" }}
              >
                {p.role}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
