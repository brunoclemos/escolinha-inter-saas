import Link from "next/link";
import {
  Users,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Plus,
  Heart,
  Trophy,
  Target,
  Goal,
  Star,
  Flame,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScoreRadar } from "@/components/score-radar";
import { LineChart } from "@/components/line-chart";
import { DonutChart } from "@/components/donut-chart";
import { Sparkline } from "@/components/sparkline";
import { formatDate, initials } from "@/lib/utils";
import { getCurrentTenant } from "@/lib/queries/tenant";
import {
  getDashboardStats,
  getUpcomingTrainings,
  getRecentMatches,
  getActiveInjuries,
  getTopScorers,
} from "@/lib/queries/dashboard";
import {
  getMonthlyEvaluationAverages,
  getCategoryDistribution,
  getWeeklyAttendanceTrend,
  getAthleteOfTheMonth,
} from "@/lib/queries/dashboard-extras";

export const dynamic = "force-dynamic";

const RESULT_VARIANT: Record<string, "ok" | "warn" | "err" | "outline"> = {
  win: "ok",
  draw: "warn",
  loss: "err",
  pending: "outline",
};

const RESULT_LABEL: Record<string, string> = {
  win: "V",
  draw: "E",
  loss: "D",
  pending: "—",
};

const FALLBACK_COLORS = [
  "#C8102E",
  "#E76F51",
  "#F4A261",
  "#E9C46A",
  "#2A9D8F",
  "#264653",
  "#118AB2",
  "#9B5DE5",
];

export default async function DashboardPage() {
  const tenant = await getCurrentTenant();
  const [
    stats,
    upcoming,
    recentMatches,
    activeInjuries,
    topScorers,
    monthlyEvals,
    categoryDist,
    weeklyAtt,
    athleteOfTheMonth,
  ] = await Promise.all([
    getDashboardStats(tenant.id),
    getUpcomingTrainings(tenant.id, 4),
    getRecentMatches(tenant.id, 4),
    getActiveInjuries(tenant.id),
    getTopScorers(tenant.id, 5),
    getMonthlyEvaluationAverages(tenant.id),
    getCategoryDistribution(tenant.id),
    getWeeklyAttendanceTrend(tenant.id),
    getAthleteOfTheMonth(tenant.id),
  ]);

  const attendanceSparkValues = weeklyAtt.map((w) => w.rate);
  const totalAthletesByCategory = categoryDist.reduce(
    (acc, c) => acc + Number(c.count),
    0
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Visão geral
          </h1>
          <p className="text-sm text-muted-foreground">{tenant.name}</p>
        </div>
        <Button asChild>
          <Link href="/atletas/novo">
            <Plus className="size-4" />
            Cadastrar atleta
          </Link>
        </Button>
      </div>

      {/* HERO — Atleta destaque do mês */}
      {athleteOfTheMonth && (
        <Link
          href={`/atletas/${athleteOfTheMonth.athlete.id}` as never}
          className="mb-6 block group"
        >
          <Card className="overflow-hidden border-brand/40 bg-gradient-to-br from-brand-soft/60 via-card to-card transition-shadow group-hover:shadow-lg">
            <CardContent className="grid gap-6 p-6 sm:grid-cols-[1fr_auto_auto] sm:items-center">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="size-24 ring-4 ring-brand/30 sm:size-28">
                    {athleteOfTheMonth.athlete.photoUrl ? (
                      <AvatarImage
                        src={athleteOfTheMonth.athlete.photoUrl}
                        alt={athleteOfTheMonth.athlete.fullName}
                      />
                    ) : null}
                    <AvatarFallback className="bg-brand text-brand-fg text-2xl font-bold">
                      {initials(athleteOfTheMonth.athlete.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 flex size-9 items-center justify-center rounded-full bg-brand text-brand-fg shadow-md">
                    <Star className="size-4 fill-current" />
                  </div>
                </div>
                <div className="min-w-0">
                  <Badge variant="default" className="mb-1.5 gap-1 text-[10px]">
                    <Flame className="size-3" />
                    DESTAQUE DO MÊS
                  </Badge>
                  <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                    {athleteOfTheMonth.athlete.fullName}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {athleteOfTheMonth.categoryName ?? "—"}
                    {athleteOfTheMonth.athlete.positionMain &&
                      ` · ${athleteOfTheMonth.athlete.positionMain}`}
                    {athleteOfTheMonth.athlete.jerseyNumber &&
                      ` · #${athleteOfTheMonth.athlete.jerseyNumber}`}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs">
                    <span className="flex items-center gap-1">
                      <Goal className="size-3 text-brand" />
                      <strong className="font-mono">
                        {athleteOfTheMonth.stats.goals}
                      </strong>{" "}
                      gols
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="size-3 text-ok" />
                      <strong className="font-mono">
                        {athleteOfTheMonth.stats.assists}
                      </strong>{" "}
                      ass
                    </span>
                    <span className="flex items-center gap-1">
                      <Trophy className="size-3 text-warn" />
                      <strong className="font-mono">
                        {athleteOfTheMonth.stats.games}
                      </strong>{" "}
                      jogos
                    </span>
                    {athleteOfTheMonth.stats.avgRating && (
                      <span className="flex items-center gap-1">
                        <Sparkles className="size-3 text-brand" />
                        <strong className="font-mono">
                          {athleteOfTheMonth.stats.avgRating.toFixed(1)}
                        </strong>{" "}
                        nota méd
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {athleteOfTheMonth.evaluation && (
                <div className="hidden sm:block">
                  <ScoreRadar
                    tech={athleteOfTheMonth.evaluation.tech}
                    tactical={athleteOfTheMonth.evaluation.tactical}
                    psych={athleteOfTheMonth.evaluation.psych}
                    size={140}
                  />
                </div>
              )}

              {athleteOfTheMonth.evaluation && (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-1">
                  <ScoreBubble
                    label="Téc"
                    value={
                      athleteOfTheMonth.evaluation.tech !== null
                        ? (athleteOfTheMonth.evaluation.tech / 10).toFixed(1)
                        : "—"
                    }
                  />
                  <ScoreBubble
                    label="Tát"
                    value={
                      athleteOfTheMonth.evaluation.tactical !== null
                        ? (
                            athleteOfTheMonth.evaluation.tactical / 10
                          ).toFixed(1)
                        : "—"
                    }
                  />
                  <ScoreBubble
                    label="Psi"
                    value={
                      athleteOfTheMonth.evaluation.psych !== null
                        ? (athleteOfTheMonth.evaluation.psych / 10).toFixed(1)
                        : "—"
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
      )}

      {/* Stats principais */}
      <div className="mb-6 grid gap-3 grid-cols-2 lg:grid-cols-4">
        <BigStat
          label="Atletas ativos"
          value={stats.athletesActive}
          delta={
            stats.athletesNew30d > 0
              ? `+${stats.athletesNew30d} em 30 dias`
              : "Sem novos em 30 dias"
          }
          icon={Users}
          color="bg-brand/10 text-brand"
        />
        <BigStat
          label="Frequência (30d)"
          value={
            stats.attendanceRate30d !== null
              ? `${stats.attendanceRate30d}%`
              : "—"
          }
          delta={
            attendanceSparkValues.length >= 2
              ? `${attendanceSparkValues.length} semanas analisadas`
              : "Sem histórico ainda"
          }
          icon={TrendingUp}
          color="bg-ok/10 text-ok"
          spark={
            attendanceSparkValues.length >= 2 ? attendanceSparkValues : undefined
          }
          sparkColor="hsl(var(--ok))"
        />
        <BigStat
          label="Gols no mês"
          value={stats.goalsThisMonth}
          delta={
            stats.matchesThisMonth > 0
              ? `${stats.matchesThisMonth} ${stats.matchesThisMonth === 1 ? "jogo" : "jogos"}`
              : "Sem jogos esse mês"
          }
          icon={Goal}
          color="bg-warn/10 text-warn"
        />
        <BigStat
          label="Lesões ativas"
          value={stats.injuriesActive}
          delta={
            stats.injuriesActive === 0
              ? "Elenco saudável ✓"
              : "Em recuperação"
          }
          icon={Heart}
          color={
            stats.injuriesActive === 0
              ? "bg-ok/10 text-ok"
              : "bg-err/10 text-err"
          }
        />
      </div>

      {/* Linha 1: Evolução média + Distribuição */}
      <div className="mb-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="size-4 text-muted-foreground" />
              Evolução média da escolinha
              <span className="text-xs font-normal text-muted-foreground">
                · técnica · tática · psicológica
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyEvals.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                Quando houver avaliações publicadas, a evolução média da
                escolinha aparece aqui.
              </p>
            ) : (
              <LineChart
                height={220}
                yLabel="Score 0-10"
                series={[
                  {
                    label: "Técnica",
                    color: "hsl(var(--brand))",
                    points: monthlyEvals
                      .filter((m) => m.tech !== null)
                      .map((m) => ({
                        date: `${m.month}-15`,
                        value: m.tech as number,
                      })),
                  },
                  {
                    label: "Tática",
                    color: "hsl(var(--ok))",
                    points: monthlyEvals
                      .filter((m) => m.tactical !== null)
                      .map((m) => ({
                        date: `${m.month}-15`,
                        value: m.tactical as number,
                      })),
                  },
                  {
                    label: "Psicológica",
                    color: "hsl(var(--warn))",
                    points: monthlyEvals
                      .filter((m) => m.psych !== null)
                      .map((m) => ({
                        date: `${m.month}-15`,
                        value: m.psych as number,
                      })),
                  },
                ]}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="size-4 text-muted-foreground" />
              Atletas por turma
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <DonutChart
              size={170}
              thickness={20}
              centerLabel="Total"
              centerValue={totalAthletesByCategory}
              segments={categoryDist
                .filter((c) => Number(c.count) > 0)
                .map((c, i) => ({
                  label: c.name,
                  value: Number(c.count),
                  color: c.color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length],
                }))}
            />
          </CardContent>
        </Card>
      </div>

      {/* Linha 2: Top scorers + Próximos treinos + Jogos recentes */}
      <div className="mb-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Goal className="size-4 text-brand" />
              Artilheiros (90d)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {topScorers.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Nenhum gol registrado ainda.
              </p>
            ) : (
              (() => {
                const maxGoals = Math.max(
                  ...topScorers.map((s) => Number(s.goals))
                );
                return topScorers.map((s, idx) => {
                  const goals = Number(s.goals);
                  const pct = maxGoals > 0 ? (goals / maxGoals) * 100 : 0;
                  return (
                    <Link
                      key={s.athleteId}
                      href={`/atletas/${s.athleteId}` as never}
                      className="block rounded-md p-2 transition-colors hover:bg-muted/40"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                            idx === 0
                              ? "bg-brand text-brand-fg"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <Avatar className="size-7 shrink-0">
                          {s.photoUrl ? (
                            <AvatarImage
                              src={s.photoUrl}
                              alt={s.athleteName ?? ""}
                            />
                          ) : null}
                          <AvatarFallback className="bg-brand-soft text-brand-text text-[10px]">
                            {initials(s.athleteName ?? "")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="flex-1 truncate text-sm font-medium">
                          {s.athleteName}
                        </span>
                        <span className="font-mono text-base font-bold tabular-nums text-brand">
                          {goals}
                        </span>
                      </div>
                      <div className="mt-1.5 ml-9 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-brand transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </Link>
                  );
                });
              })()
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="size-4 text-muted-foreground" />
              Próximos treinos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcoming.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Nenhum treino agendado.{" "}
                <Link
                  href="/treinos/novo"
                  className="text-brand hover:underline"
                >
                  Cadastrar
                </Link>
              </p>
            ) : (
              upcoming.map((t) => (
                <Link
                  key={t.id}
                  href={`/treinos/${t.id}` as never}
                  className="flex items-center gap-3 rounded-md border p-2.5 transition-colors hover:bg-muted/40"
                >
                  <div
                    className="flex size-9 shrink-0 flex-col items-center justify-center rounded-md font-mono"
                    style={{
                      backgroundColor: t.categoryColor
                        ? `${t.categoryColor}22`
                        : "hsl(var(--muted))",
                      color: t.categoryColor ?? undefined,
                    }}
                  >
                    <span className="text-[8px] uppercase">
                      {new Date(t.date)
                        .toLocaleDateString("pt-BR", { weekday: "short" })
                        .slice(0, 3)}
                    </span>
                    <span className="text-xs font-bold leading-none">
                      {new Date(t.date).getDate()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {t.focus ?? "Treino"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {t.startTime && `${t.startTime} · `}
                      {t.categoryName ?? "Sem turma"}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Trophy className="size-4 text-muted-foreground" />
              Jogos recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentMatches.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Nenhum jogo registrado.
              </p>
            ) : (
              recentMatches.map((m) => (
                <Link
                  key={m.id}
                  href={`/jogos/${m.id}` as never}
                  className="flex items-center gap-2 rounded-md border p-2.5 transition-colors hover:bg-muted/40"
                >
                  <Badge
                    variant={RESULT_VARIANT[m.result]}
                    className="size-7 shrink-0 justify-center p-0 text-[10px] font-bold"
                  >
                    {RESULT_LABEL[m.result]}
                  </Badge>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {m.isHome ? "vs " : "@ "}
                      {m.opponent}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {formatDate(m.date)}
                    </p>
                  </div>
                  {m.scoreUs !== null && m.scoreThem !== null && (
                    <span className="font-mono text-sm font-semibold tabular-nums">
                      {m.scoreUs}×{m.scoreThem}
                    </span>
                  )}
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {activeInjuries.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="size-4 text-warn" />
              Atletas em recuperação ({activeInjuries.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {activeInjuries.map((i) => {
                const sevVariant: "ok" | "warn" | "err" =
                  i.severity === "severe"
                    ? "err"
                    : i.severity === "moderate"
                      ? "warn"
                      : "ok";
                return (
                  <Link
                    key={i.id}
                    href={`/atletas/${i.athleteId}` as never}
                    className="flex items-start gap-3 rounded-md border p-2.5 transition-colors hover:bg-muted/40"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="truncate text-sm font-medium">
                          {i.athleteName}
                        </p>
                        <Badge variant={sevVariant} className="text-[10px]">
                          {i.severity === "severe"
                            ? "Severa"
                            : i.severity === "moderate"
                              ? "Moderada"
                              : "Leve"}
                        </Badge>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {i.type}
                        {i.bodyPart && ` · ${i.bodyPart}`}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function BigStat({
  label,
  value,
  delta,
  icon: Icon,
  color,
  spark,
  sparkColor,
}: {
  label: string;
  value: string | number;
  delta?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  spark?: number[];
  sparkColor?: string;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <p className="mt-1 font-mono text-2xl sm:text-4xl font-bold leading-none">
              {value}
            </p>
            {delta && (
              <p className="mt-2 truncate text-[10px] sm:text-xs text-muted-foreground">
                {delta}
              </p>
            )}
          </div>
          <div
            className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${color}`}
          >
            <Icon className="size-4 sm:size-5" />
          </div>
        </div>
        {spark && spark.length >= 2 && (
          <div className="mt-3">
            <Sparkline
              values={spark}
              width={200}
              height={28}
              color={sparkColor ?? "hsl(var(--brand))"}
              className="w-full"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ScoreBubble({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-card border p-3 text-center">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="font-mono text-2xl font-bold tabular-nums leading-tight text-brand">
        {value}
      </p>
    </div>
  );
}
