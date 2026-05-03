import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User2, FileText } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScoreRadar } from "@/components/score-radar";
import { formatDateTime, initials } from "@/lib/utils";
import { getCurrentTenant } from "@/lib/queries/tenant";
import { getAthleteById } from "@/lib/queries/athletes";
import { getEvaluationById } from "@/lib/queries/evaluations";
import {
  TECHNICAL_LABELS,
  TACTICAL_LABELS,
  PSYCH_LABELS,
} from "@/lib/eval/fundamentos";

export const dynamic = "force-dynamic";

export default async function EvaluationDetailPage({
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

  const { evaluation, technical, tactical, psych } = data;

  return (
    <div className="mx-auto max-w-5xl px-6 py-6">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/atletas/${id}`}>
            <ArrowLeft className="size-4" />
            Voltar pro atleta
          </Link>
        </Button>
        <Badge
          variant={evaluation.status === "published" ? "ok" : "soft"}
          className="text-xs"
        >
          {evaluation.status === "published" ? "Publicada" : "Rascunho"}
        </Badge>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <Avatar className="size-12">
          <AvatarFallback className="bg-brand-soft text-brand-text">
            {initials(athleteData.athlete.fullName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {evaluation.periodLabel ?? "Avaliação"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {athleteData.athlete.fullName}
          </p>
        </div>
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Resumo</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-3">
            <ScoreRadar
              tech={evaluation.techScore}
              tactical={evaluation.tacticalScore}
              psych={evaluation.psychScore}
              size={220}
            />
            <div className="grid w-full grid-cols-3 gap-2 text-center">
              <Stat label="Técnica" value={evaluation.techScore} />
              <Stat label="Tática" value={evaluation.tacticalScore} />
              <Stat label="Psico" value={evaluation.psychScore} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Field
              icon={<Calendar className="size-3.5" />}
              label="Criada em"
              value={formatDateTime(evaluation.createdAt)}
            />
            {evaluation.publishedAt && (
              <Field
                icon={<Calendar className="size-3.5" />}
                label="Publicada em"
                value={formatDateTime(evaluation.publishedAt)}
              />
            )}
            <Separator className="my-3" />
            {evaluation.summaryText ? (
              <div>
                <p className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <FileText className="size-3" />
                  Parecer geral
                </p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {evaluation.summaryText}
                </p>
              </div>
            ) : (
              <p className="text-sm italic text-muted-foreground">
                Sem parecer geral.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <DimensionCard
        title="Técnica"
        rows={technical.map((t) => ({
          label: TECHNICAL_LABELS[t.fundamental] ?? t.fundamental,
          score: t.score,
          comment: t.comment,
        }))}
      />
      <DimensionCard
        title="Tática"
        rows={tactical.map((t) => ({
          label: TACTICAL_LABELS[t.dimension] ?? t.dimension,
          score: t.score,
          comment: t.comment,
        }))}
      />
      <DimensionCard
        title="Psicológica"
        rows={psych.map((t) => ({
          label: PSYCH_LABELS[t.dimension] ?? t.dimension,
          score: t.score,
          comment: t.comment,
        }))}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded-md border bg-muted/30 px-2 py-2">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="font-mono text-lg font-semibold">
        {value !== null ? (value / 10).toFixed(1) : "—"}
      </p>
    </div>
  );
}

function Field({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      {icon && <span className="text-muted-foreground">{icon}</span>}
      <span className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}:
      </span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

function DimensionCard({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; score: number; comment: string | null }[];
}) {
  if (rows.length === 0) return null;
  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          {title}{" "}
          <span className="text-xs font-normal text-muted-foreground">
            · {rows.length} avaliados
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {rows.map((r) => (
          <div key={r.label} className="rounded-md border p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">{r.label}</p>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                  <div
                    className={
                      r.score >= 8
                        ? "h-full bg-ok"
                        : r.score >= 5
                          ? "h-full bg-warn"
                          : "h-full bg-err"
                    }
                    style={{ width: `${r.score * 10}%` }}
                  />
                </div>
                <span className="font-mono text-sm font-semibold tabular-nums">
                  {r.score}
                </span>
              </div>
            </div>
            {r.comment && (
              <p className="mt-2 text-xs italic text-muted-foreground">
                "{r.comment}"
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
