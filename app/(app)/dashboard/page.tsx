import Link from "next/link";
import {
  Users,
  ClipboardCheck,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Plus,
  Heart,
  Trophy,
  Target,
  MapPin,
  Goal,
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
import { formatDate, initials } from "@/lib/utils";
import { getCurrentTenant } from "@/lib/queries/tenant";
import {
  getDashboardStats,
  getUpcomingTrainings,
  getRecentMatches,
  getActiveInjuries,
  getTopScorers,
} from "@/lib/queries/dashboard";

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

export default async function DashboardPage() {
  const tenant = await getCurrentTenant();
  const [stats, upcoming, recentMatches, activeInjuries, topScorers] =
    await Promise.all([
      getDashboardStats(tenant.id),
      getUpcomingTrainings(tenant.id, 5),
      getRecentMatches(tenant.id, 5),
      getActiveInjuries(tenant.id),
      getTopScorers(tenant.id, 5),
    ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Início</h1>
          <p className="text-sm text-muted-foreground">
            Visão geral da {tenant.name}.
          </p>
        </div>
        <Button asChild>
          <Link href="/atletas/novo">
            <Plus className="size-4" />
            Cadastrar atleta
          </Link>
        </Button>
      </div>

      {/* Stats principais */}
      <div className="mb-4 grid gap-3 grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Atletas ativos"
          value={stats.athletesActive}
          delta={
            stats.athletesNew30d > 0
              ? `+${stats.athletesNew30d} em 30 dias`
              : "Sem novos em 30 dias"
          }
          icon={Users}
          color="text-brand"
        />
        <StatCard
          label="Frequência (30d)"
          value={
            stats.attendanceRate30d !== null
              ? `${stats.attendanceRate30d}%`
              : "—"
          }
          delta={
            stats.attendanceRate30d === null
              ? "Sem dados"
              : stats.attendanceRate30d >= 85
                ? "Saudável"
                : "Acompanhar de perto"
          }
          icon={TrendingUp}
          color={
            stats.attendanceRate30d === null
              ? "text-muted-foreground"
              : stats.attendanceRate30d >= 85
                ? "text-ok"
                : "text-warn"
          }
        />
        <StatCard
          label="Avaliações no mês"
          value={stats.evaluationsThisMonth}
          delta={
            stats.evaluationsDraft > 0
              ? `${stats.evaluationsDraft} ${stats.evaluationsDraft === 1 ? "rascunho" : "rascunhos"}`
              : "Todas publicadas"
          }
          icon={ClipboardCheck}
          color="text-ok"
        />
        <StatCard
          label="Lesões ativas"
          value={stats.injuriesActive}
          delta={
            stats.injuriesActive === 0
              ? "Nenhum atleta afastado"
              : "Em recuperação"
          }
          icon={Heart}
          color={stats.injuriesActive === 0 ? "text-ok" : "text-warn"}
        />
      </div>

      {/* Stats secundários */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SmallStat
          label="Jogos no mês"
          value={stats.matchesThisMonth}
          icon={Trophy}
        />
        <SmallStat
          label="Gols no mês"
          value={stats.goalsThisMonth}
          icon={Goal}
        />
        <SmallStat
          label="Plano"
          value={tenant.plan === "trial" ? "Trial" : tenant.plan}
          icon={Target}
        />
        <SmallStat
          label="Desde"
          value={formatDate(tenant.createdAt).slice(3)}
          icon={Calendar}
        />
      </div>

      {/* 2 colunas — próximos treinos + jogos recentes */}
      <div className="mb-4 grid gap-4 lg:grid-cols-2">
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
                      {t.field && ` · ${t.field}`}
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
                  className="flex items-center gap-3 rounded-md border p-2.5 transition-colors hover:bg-muted/40"
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
                      {m.categoryName && ` · ${m.categoryName}`}
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

      {/* Top scorers + lesões ativas */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Goal className="size-4 text-muted-foreground" />
              Artilheiros (últimos 90 dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topScorers.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Nenhum gol registrado ainda.
              </p>
            ) : (
              <div className="space-y-2">
                {topScorers.map((s, idx) => (
                  <Link
                    key={s.athleteId}
                    href={`/atletas/${s.athleteId}` as never}
                    className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted/40"
                  >
                    <span className="w-5 text-center font-mono text-xs text-muted-foreground">
                      {idx + 1}
                    </span>
                    <Avatar className="size-8 shrink-0">
                      {s.photoUrl ? (
                        <AvatarImage src={s.photoUrl} alt={s.athleteName ?? ""} />
                      ) : null}
                      <AvatarFallback className="bg-brand-soft text-brand-text text-xs">
                        {initials(s.athleteName ?? "")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {s.athleteName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {Number(s.games)} {Number(s.games) === 1 ? "jogo" : "jogos"} ·{" "}
                        {Number(s.assists)}{" "}
                        {Number(s.assists) === 1 ? "ass" : "ass"}
                      </p>
                    </div>
                    <span className="font-mono text-lg font-bold text-brand">
                      {Number(s.goals)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="size-4 text-warn" />
              Atletas em recuperação
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeInjuries.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Nenhum atleta em recuperação. ✓
              </p>
            ) : (
              <div className="space-y-2">
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
                          <Badge
                            variant={sevVariant}
                            className="text-[10px]"
                          >
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
                          {i.daysOut != null && ` · ${i.daysOut}d afast.`}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  delta?: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-2 pt-6">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 font-mono text-2xl sm:text-3xl font-semibold">
            {value}
          </p>
          {delta && (
            <p className="mt-1 truncate text-[10px] sm:text-xs text-muted-foreground">
              {delta}
            </p>
          )}
        </div>
        <Icon className={`size-4 sm:size-5 shrink-0 ${color ?? ""}`} />
      </CardContent>
    </Card>
  );
}

function SmallStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center gap-2 rounded-md border bg-muted/20 px-3 py-2">
      <Icon className="size-3.5 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground leading-tight">
          {label}
        </p>
        <p className="font-mono text-sm font-semibold tabular-nums">
          {value}
        </p>
      </div>
    </div>
  );
}
