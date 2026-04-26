import Link from "next/link";
import {
  ChevronRight,
  Activity,
  Calendar,
  TrendingUp,
  Trophy,
  ArrowRight,
} from "lucide-react";
import { AthleteHeader } from "@/components/AthleteHeader";
import { FELIPE } from "@/data/felipe";

export default function HomePage() {
  const lastEval = FELIPE.evolucao[FELIPE.evolucao.length - 1]!;
  const prevEval = FELIPE.evolucao[FELIPE.evolucao.length - 2]!;
  const deltaAltura = (lastEval.altura! - prevEval.altura!).toFixed(1);
  const deltaSprint = (prevEval.sprint20! - lastEval.sprint20!).toFixed(2);

  return (
    <div className="space-y-6">
      <AthleteHeader />

      {/* Stats principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat
          label="Altura"
          value={FELIPE.altura.toString()}
          unit="cm"
          delta={`+${deltaAltura} cm em 6m`}
        />
        <Stat
          label="Peso"
          value={FELIPE.peso.toString()}
          unit="kg"
          delta="+0,9 kg"
        />
        <Stat
          label="Sprint 20m"
          value={FELIPE.sprint20m.toString()}
          unit="s"
          delta={`−${deltaSprint}s (RP)`}
          deltaTone="ok"
        />
        <Stat
          label="Frequência"
          value={FELIPE.frequencia30d.toString()}
          unit="%"
          delta="últimos 30 dias"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Linha do tempo */}
        <div className="lg:col-span-2 ui-card">
          <div className="ui-card-head">
            <div>
              <div className="font-semibold">Linha do tempo</div>
              <div className="text-xs text-inter-mute">
                Eventos recentes do {FELIPE.apelido}
              </div>
            </div>
            <Link
              href="/evolucao"
              className="text-xs font-medium text-inter-red hover:text-inter-red-dark inline-flex items-center gap-1"
            >
              Ver evolução <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-inter-line">
            {FELIPE.timeline.map((ev, i) => (
              <div key={i} className="flex gap-4 px-5 py-3.5">
                <span className="mono text-[11px] text-inter-subtle w-20 shrink-0 pt-0.5">
                  {ev.when}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">{ev.title}</span>
                    {ev.tag === "destaque" && (
                      <span className="ui-badge ui-badge-brand text-[10px] py-0">
                        destaque
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-inter-mute mt-0.5">
                    {ev.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Próximos compromissos */}
        <div className="space-y-5">
          <div className="ui-card">
            <div className="ui-card-head">
              <div>
                <div className="font-semibold">Próximos compromissos</div>
              </div>
            </div>
            <div className="divide-y divide-inter-line">
              {FELIPE.proximos.map((p, i) => (
                <div key={i} className="px-5 py-3 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-md bg-inter-bg flex items-center justify-center text-inter-mute">
                    <Calendar size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {p.title}
                    </div>
                    <div className="text-[11px] text-inter-mute mono">
                      {p.date} · {p.local}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="ui-card">
            <div className="ui-card-head">
              <div>
                <div className="font-semibold">Perfil esportivo</div>
              </div>
            </div>
            <div className="ui-card-body space-y-2.5">
              <PerfilLine label="Time" value={FELIPE.timeFavorito} icon="🔴" />
              <PerfilLine
                label="Jogador atual"
                value={FELIPE.jogadorAtualPreferido}
                icon="⭐"
              />
              <PerfilLine label="Ídolo" value={FELIPE.idolo} icon="👑" />
              <PerfilLine
                label="Posição"
                value={FELIPE.posicaoPrincipal}
                icon="⚽"
              />
              <PerfilLine
                label="Nível técnico"
                value={FELIPE.nivelTecnico}
                icon={<Trophy size={14} className="text-inter-mute" />}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Atalhos */}
      <div className="grid sm:grid-cols-3 gap-3">
        <ShortcutCard
          href="/avaliacoes"
          icon={<Activity size={18} />}
          title="Avaliações"
          subtitle="Técnica · física · tática · psico"
        />
        <ShortcutCard
          href="/evolucao"
          icon={<TrendingUp size={18} />}
          title="Evolução"
          subtitle="Gráficos longitudinais"
        />
        <ShortcutCard
          href="/relatorio"
          icon={<Trophy size={18} />}
          title="Relatório trimestral"
          subtitle="Versão printable / PDF"
        />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  unit,
  delta,
  deltaTone,
}: {
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  deltaTone?: "ok" | "default";
}) {
  return (
    <div className="ui-stat">
      <div className="ui-stat-label">{label}</div>
      <div className="ui-stat-value">
        {value}
        {unit && <span className="ui-stat-unit">{unit}</span>}
      </div>
      {delta && (
        <div
          className={
            "ui-stat-delta " +
            (deltaTone === "ok" ? "text-ok" : "")
          }
        >
          {delta}
        </div>
      )}
    </div>
  );
}

function PerfilLine({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-inter-mute">{label}</span>
      <span className="font-medium flex items-center gap-1.5">
        {icon} {value}
      </span>
    </div>
  );
}

function ShortcutCard({
  href,
  icon,
  title,
  subtitle,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      href={href}
      className="ui-card p-4 flex items-center gap-3 hover:border-inter-red/40 hover:shadow-card transition-all group"
    >
      <div className="h-10 w-10 rounded-md bg-inter-red-soft text-inter-red flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-inter-mute">{subtitle}</div>
      </div>
      <ChevronRight
        size={16}
        className="text-inter-subtle group-hover:text-inter-red"
      />
    </Link>
  );
}
