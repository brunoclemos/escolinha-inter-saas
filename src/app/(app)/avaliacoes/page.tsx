import { AthleteHeader } from "@/components/AthleteHeader";
import { RadarCard } from "@/components/RadarCard";
import { FELIPE, AssessmentScore } from "@/data/felipe";

export default function AvaliacoesPage() {
  // Médias por dimensão (para um radar consolidado)
  const consolidated = [
    {
      fundamento: "Técnica",
      nota: avg(FELIPE.avaliacaoTecnica),
    },
    {
      fundamento: "Tática",
      nota: avg(FELIPE.avaliacaoTatica),
    },
    {
      fundamento: "Física",
      nota: avg(FELIPE.avaliacaoFisica),
    },
    {
      fundamento: "Psicossocial",
      nota: avg(FELIPE.avaliacaoPsicologica),
    },
  ];

  return (
    <div className="space-y-6">
      <AthleteHeader compact />

      {/* Radar consolidado + média geral */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="ui-card lg:col-span-2">
          <div className="ui-card-head">
            <div>
              <div className="font-semibold">Radar consolidado</div>
              <div className="text-xs text-inter-mute">
                Média por dimensão · escala 0–10 · base CBF Academy adaptada
              </div>
            </div>
            <span className="ui-badge ui-badge-brand">
              Avaliação Mar/2026
            </span>
          </div>
          <div className="ui-card-body">
            <RadarCard data={consolidated} />
          </div>
        </div>

        <div className="space-y-3">
          {consolidated.map((d) => (
            <DimensionCard key={d.fundamento} label={d.fundamento} score={d.nota} />
          ))}
        </div>
      </div>

      {/* Breakdown por dimensão */}
      <div className="grid lg:grid-cols-2 gap-5">
        <DimensionDetail
          title="Técnica"
          subtitle="10 fundamentos · escala 0–10"
          data={FELIPE.avaliacaoTecnica}
          color="#C8102E"
        />
        <DimensionDetail
          title="Física"
          subtitle="6 fundamentos · escala 0–10"
          data={FELIPE.avaliacaoFisica}
          color="#1B5A37"
        />
        <DimensionDetail
          title="Tática"
          subtitle="5 fundamentos · escala 0–10"
          data={FELIPE.avaliacaoTatica}
          color="#1f4670"
        />
        <DimensionDetail
          title="Psicossocial"
          subtitle="6 fundamentos · escala 0–10"
          data={FELIPE.avaliacaoPsicologica}
          color="#7a4d0a"
        />
      </div>

      {/* Métricas físicas brutas */}
      <div className="ui-card">
        <div className="ui-card-head">
          <div>
            <div className="font-semibold">Bateria física · valores brutos</div>
            <div className="text-xs text-inter-mute">
              Última coleta · {FELIPE.evolucao[FELIPE.evolucao.length - 1]!.label}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-inter-line">
          <MetricRaw label="Sprint 10m" value={FELIPE.sprint10m} unit="s" />
          <MetricRaw label="Sprint 20m" value={FELIPE.sprint20m} unit="s" />
          <MetricRaw label="CMJ" value={FELIPE.cmj} unit="cm" />
          <MetricRaw label="Yo-Yo IR1" value={FELIPE.yoYoIR1} unit="m" />
          <MetricRaw label="% gordura" value={FELIPE.bf} unit="%" />
          <MetricRaw label="PHV" value={FELIPE.phv} unit="anos" />
        </div>
      </div>
    </div>
  );
}

function avg(arr: AssessmentScore[]) {
  return Math.round((arr.reduce((s, a) => s + a.nota, 0) / arr.length) * 10) / 10;
}

function DimensionCard({ label, score }: { label: string; score: number }) {
  const pct = (score / 10) * 100;
  return (
    <div className="ui-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-inter-mute font-semibold">
          {label}
        </span>
        <span className="mono font-semibold">{score.toFixed(1)}</span>
      </div>
      <div className="ui-bar mt-2.5">
        <i style={{ width: pct + "%" }} />
      </div>
    </div>
  );
}

function DimensionDetail({
  title,
  subtitle,
  data,
  color,
}: {
  title: string;
  subtitle: string;
  data: AssessmentScore[];
  color: string;
}) {
  return (
    <div className="ui-card">
      <div className="ui-card-head">
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-xs text-inter-mute">{subtitle}</div>
        </div>
        <span className="mono text-sm font-semibold">
          {avg(data).toFixed(1)}
        </span>
      </div>
      <div className="ui-card-body space-y-2.5">
        {data.map((row) => (
          <div key={row.fundamento}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span>{row.fundamento}</span>
              <span className="mono text-xs text-inter-mute">
                {row.nota.toFixed(1)}
              </span>
            </div>
            <div className="ui-bar">
              <i style={{ width: (row.nota / 10) * 100 + "%", background: color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricRaw({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <div className="bg-white p-4 text-center">
      <div className="text-[10px] uppercase tracking-wider text-inter-mute font-semibold">
        {label}
      </div>
      <div className="mt-1 text-xl font-semibold mono">
        {value > 0 ? value : value}
        <span className="text-sm text-inter-mute font-normal ml-0.5">
          {unit}
        </span>
      </div>
    </div>
  );
}
