import { notFound } from "next/navigation";
import { ScoreRadar } from "@/components/score-radar";
import { OnzeMark } from "@/components/onze-mark";
import { ageFromDob, formatDate, initials } from "@/lib/utils";
import { getCurrentTenant } from "@/lib/queries/tenant";
import { getAthleteById } from "@/lib/queries/athletes";
import { getEvaluationById } from "@/lib/queries/evaluations";
import {
  TECHNICAL_LABELS,
  TACTICAL_LABELS,
  PSYCH_LABELS,
} from "@/lib/eval/fundamentos";
import { PrintButton } from "./print-button";

export const dynamic = "force-dynamic";

export default async function ReportPdfPage({
  params,
}: {
  params: Promise<{ id: string; evalId: string }>;
}) {
  const { id, evalId } = await params;
  const tenant = await getCurrentTenant();

  const athleteData = await getAthleteById(tenant.id, id);
  if (!athleteData) notFound();

  const data = await getEvaluationById(tenant.id, evalId);
  if (!data || data.evaluation.athleteId !== id) notFound();

  const { athlete, categories } = athleteData;
  const { evaluation, technical, tactical, psych } = data;
  const age = ageFromDob(athlete.dob);

  return (
    <div className="report-root mx-auto max-w-[210mm] bg-white px-10 py-8 text-stone-900">
      {/* Botões fora do print */}
      <div className="no-print mb-6 flex items-center justify-between border-b pb-4">
        <p className="text-sm text-stone-500">
          Modo relatório · use <kbd className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-xs">Cmd+P</kbd> ou o botão pra salvar como PDF
        </p>
        <PrintButton
          athleteName={athlete.fullName}
          period={evaluation.periodLabel ?? "avaliacao"}
        />
      </div>

      {/* Cabeçalho */}
      <header className="mb-8 flex items-start justify-between border-b border-stone-200 pb-6">
        <div className="flex items-center gap-3">
          <OnzeMark size="md" showWordmark={false} />
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
              Relatório de avaliação
            </p>
            <h1 className="text-xl font-semibold">{tenant.name}</h1>
          </div>
        </div>
        <div className="text-right text-xs text-stone-500">
          <p>Emitido em {formatDate(new Date())}</p>
          <p>{evaluation.periodLabel ?? "—"}</p>
        </div>
      </header>

      {/* Atleta */}
      <section className="mb-6 flex items-center gap-5 rounded-lg bg-stone-50 p-5">
        <div className="flex size-16 items-center justify-center rounded-full bg-brand-soft text-lg font-bold text-brand-text">
          {initials(athlete.fullName)}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            {athlete.fullName}
          </h2>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-stone-600">
            <span>{age} anos</span>
            <span>·</span>
            <span>nascido em {formatDate(athlete.dob)}</span>
            {athlete.positionMain && (
              <>
                <span>·</span>
                <span>{athlete.positionMain}</span>
              </>
            )}
            {categories[0] && (
              <>
                <span>·</span>
                <span className="rounded bg-brand-soft px-2 py-0.5 text-xs font-medium text-brand-text">
                  {categories[0].name}
                </span>
              </>
            )}
          </div>
        </div>
        {athlete.jerseyNumber && (
          <div className="rounded-lg bg-brand px-4 py-2 text-center text-white">
            <p className="font-mono text-2xl font-bold leading-none">
              {athlete.jerseyNumber}
            </p>
            <p className="mt-0.5 text-[9px] uppercase tracking-wider opacity-90">
              Camisa
            </p>
          </div>
        )}
      </section>

      {/* Resumo com radar */}
      <section className="mb-8 grid grid-cols-[200px_1fr] gap-6 rounded-lg border border-stone-200 p-5">
        <div className="flex flex-col items-center justify-center">
          <ScoreRadar
            tech={evaluation.techScore}
            tactical={evaluation.tacticalScore}
            psych={evaluation.psychScore}
            size={180}
          />
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
              Resumo do período
            </p>
            <h3 className="mt-1 text-lg font-semibold">
              Visão geral do desenvolvimento
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <ScoreCard
              label="Técnica"
              value={evaluation.techScore}
              count={technical.length}
            />
            <ScoreCard
              label="Tática"
              value={evaluation.tacticalScore}
              count={tactical.length}
            />
            <ScoreCard
              label="Psicológica"
              value={evaluation.psychScore}
              count={psych.length}
            />
          </div>
          {evaluation.summaryText && (
            <div className="mt-2 rounded-md bg-stone-50 p-3">
              <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
                Parecer do(a) professor(a)
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">
                {evaluation.summaryText}
              </p>
            </div>
          )}
        </div>
      </section>

      <DimensionSection
        title="Dimensão técnica"
        rows={technical.map((t) => ({
          label: TECHNICAL_LABELS[t.fundamental] ?? t.fundamental,
          score: t.score,
          comment: t.comment,
        }))}
      />
      <DimensionSection
        title="Dimensão tática"
        rows={tactical.map((t) => ({
          label: TACTICAL_LABELS[t.dimension] ?? t.dimension,
          score: t.score,
          comment: t.comment,
        }))}
      />
      <DimensionSection
        title="Dimensão psicológica"
        rows={psych.map((t) => ({
          label: PSYCH_LABELS[t.dimension] ?? t.dimension,
          score: t.score,
          comment: t.comment,
        }))}
      />

      <footer className="mt-12 border-t border-stone-200 pt-4 text-center text-[10px] text-stone-500">
        Relatório gerado pela plataforma Onze · {tenant.name} ·{" "}
        {formatDate(new Date())}
      </footer>
    </div>
  );
}

function ScoreCard({
  label,
  value,
  count,
}: {
  label: string;
  value: number | null;
  count: number;
}) {
  return (
    <div className="rounded-md border border-stone-200 p-3 text-center">
      <p className="text-[10px] uppercase tracking-wider text-stone-500">
        {label}
      </p>
      <p className="mt-1 font-mono text-2xl font-bold">
        {value !== null ? (value / 10).toFixed(1) : "—"}
      </p>
      <p className="text-[10px] text-stone-500">
        {count} {count === 1 ? "item" : "itens"}
      </p>
    </div>
  );
}

function DimensionSection({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; score: number; comment: string | null }[];
}) {
  if (rows.length === 0) return null;
  return (
    <section className="mb-6 break-inside-avoid">
      <h3 className="mb-3 border-b border-stone-200 pb-2 text-sm font-semibold uppercase tracking-wider text-stone-700">
        {title} <span className="text-stone-400">· {rows.length}</span>
      </h3>
      <div className="grid gap-2">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-start justify-between gap-3 rounded-md border border-stone-200 p-2.5"
          >
            <div className="flex-1">
              <p className="text-sm font-medium">{r.label}</p>
              {r.comment && (
                <p className="mt-1 text-xs italic text-stone-600">
                  "{r.comment}"
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-stone-100">
                <div
                  className={
                    r.score >= 8
                      ? "h-full bg-emerald-600"
                      : r.score >= 5
                        ? "h-full bg-amber-500"
                        : "h-full bg-red-600"
                  }
                  style={{ width: `${r.score * 10}%` }}
                />
              </div>
              <span className="font-mono text-sm font-semibold tabular-nums text-stone-700">
                {r.score}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
