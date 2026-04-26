import { AthleteHeader } from "@/components/AthleteHeader";
import { EvolutionChart } from "@/components/EvolutionChart";
import { FELIPE } from "@/data/felipe";

const METRICS = [
  { key: "altura" as const, label: "Altura", unit: "cm", color: "#C8102E", inverted: false },
  { key: "peso" as const, label: "Peso", unit: "kg", color: "#1f4670", inverted: false },
  {
    key: "sprint20" as const,
    label: "Sprint 20m",
    unit: "s",
    color: "#1B5A37",
    inverted: true,
  },
  { key: "cmj" as const, label: "Salto vertical (CMJ)", unit: "cm", color: "#7a4d0a", inverted: false },
  { key: "bf" as const, label: "% gordura corporal", unit: "%", color: "#4c2f7a", inverted: false },
];

export default function EvolucaoPage() {
  const first = FELIPE.evolucao[0]!;
  const last = FELIPE.evolucao[FELIPE.evolucao.length - 1]!;

  return (
    <div className="space-y-6">
      <AthleteHeader compact />

      {/* Resumo do período */}
      <div className="ui-card">
        <div className="ui-card-head">
          <div>
            <div className="font-semibold">Resumo do período</div>
            <div className="text-xs text-inter-mute">
              Comparação {first.label} → {last.label} ·{" "}
              {FELIPE.evolucao.length} avaliações
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-px bg-inter-line">
          <Compare
            label="Altura"
            from={first.altura!}
            to={last.altura!}
            unit="cm"
          />
          <Compare label="Peso" from={first.peso!} to={last.peso!} unit="kg" />
          <Compare
            label="Sprint 20m"
            from={first.sprint20!}
            to={last.sprint20!}
            unit="s"
            invert
          />
          <Compare label="CMJ" from={first.cmj!} to={last.cmj!} unit="cm" />
          <Compare
            label="% gordura"
            from={first.bf!}
            to={last.bf!}
            unit="%"
            invert
          />
        </div>
      </div>

      {/* Gráficos longitudinais */}
      <div className="grid lg:grid-cols-2 gap-5">
        {METRICS.map((m) => (
          <div key={m.key} className="ui-card">
            <div className="ui-card-head">
              <div>
                <div className="font-semibold">{m.label}</div>
                <div className="text-xs text-inter-mute mono">
                  unidade: {m.unit}
                  {m.inverted && " · menor é melhor"}
                </div>
              </div>
              <div className="mono text-sm font-semibold">
                {(last as never as Record<string, number>)[m.key]} {m.unit}
              </div>
            </div>
            <div className="ui-card-body">
              <EvolutionChart data={FELIPE.evolucao} metric={m} />
            </div>
          </div>
        ))}
      </div>

      {/* Nota interpretativa */}
      <div className="ui-card">
        <div className="ui-card-body">
          <div className="text-xs uppercase tracking-wider text-inter-mute font-semibold mb-2">
            Interpretação
          </div>
          <p className="text-sm leading-relaxed text-inter-graphite">
            O {FELIPE.apelido} apresenta evolução consistente nos últimos
            18 meses: ganhou{" "}
            <strong>{(last.altura! - first.altura!).toFixed(0)} cm</strong> de
            estatura,{" "}
            <strong>{(last.peso! - first.peso!).toFixed(1)} kg</strong> de peso
            e melhorou o sprint de 20m em{" "}
            <strong>
              {(first.sprint20! - last.sprint20!).toFixed(2)}s
            </strong>
            . O percentual de gordura corporal está em queda gradual ({first.bf}%
            → {last.bf}%), o que é positivo para a faixa etária. PHV em{" "}
            <strong>{FELIPE.phv} anos</strong> indica que ele ainda está em fase
            <em> pré-pico</em> de crescimento — o estirão maior deve vir nos
            próximos 18-24 meses.
          </p>
          <p className="text-xs text-inter-mute mt-3">
            Próxima avaliação física agendada para 08/mai/2026. As métricas
            seguem o protocolo CBF Academy adaptado à faixa Sub-11.
          </p>
        </div>
      </div>
    </div>
  );
}

function Compare({
  label,
  from,
  to,
  unit,
  invert,
}: {
  label: string;
  from: number;
  to: number;
  unit: string;
  invert?: boolean;
}) {
  const delta = to - from;
  const improved = invert ? delta < 0 : delta > 0;
  const sign = delta > 0 ? "+" : "";
  return (
    <div className="bg-white p-4">
      <div className="text-[10px] uppercase tracking-wider text-inter-mute font-semibold">
        {label}
      </div>
      <div className="mt-1 mono text-base">
        <span className="text-inter-subtle">{from}</span>
        <span className="mx-1.5 text-inter-subtle">→</span>
        <span className="font-semibold">{to}</span>
        <span className="text-xs text-inter-mute font-normal ml-0.5">
          {unit}
        </span>
      </div>
      <div
        className={
          "mt-1 text-[11px] mono font-semibold " +
          (improved ? "text-ok" : "text-inter-mute")
        }
      >
        {sign}
        {delta.toFixed(unit === "kg" || unit === "%" || unit === "s" ? 2 : 0)}{" "}
        {unit}
      </div>
    </div>
  );
}
