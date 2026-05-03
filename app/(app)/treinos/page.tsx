import Link from "next/link";
import { Calendar, Plus, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { formatDate } from "@/lib/utils";
import { getCurrentTenant } from "@/lib/queries/tenant";
import { listTrainingSessions } from "@/lib/queries/training";

export const dynamic = "force-dynamic";

export default async function TreinosPage() {
  const tenant = await getCurrentTenant();
  const sessions = await listTrainingSessions(tenant.id, { limit: 200 });

  // Agrupa por mês
  const byMonth = sessions.reduce<Record<string, typeof sessions>>(
    (acc, s) => {
      const month = s.date.slice(0, 7);
      (acc[month] = acc[month] ?? []).push(s);
      return acc;
    },
    {}
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <PageHeader
        title="Treinos"
        description={`${sessions.length} ${sessions.length === 1 ? "treino registrado" : "treinos registrados"}.`}
        actions={
          <Button asChild>
            <Link href="/treinos/novo">
              <Plus className="size-4" />
              Novo treino
            </Link>
          </Button>
        }
      />

      {sessions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <Calendar className="size-10 text-muted-foreground" />
            <div>
              <p className="font-medium">Nenhum treino agendado.</p>
              <p className="text-sm text-muted-foreground">
                Cadastre o primeiro treino e marque presenças no campo.
              </p>
            </div>
            <Button asChild>
              <Link href="/treinos/novo">
                <Plus className="size-4" />
                Cadastrar primeiro treino
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(byMonth).map(([month, list]) => {
            const date = new Date(month + "-01");
            const monthLabel = date.toLocaleDateString("pt-BR", {
              month: "long",
              year: "numeric",
            });
            return (
              <div key={month}>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {monthLabel}
                </p>
                <Card>
                  <div className="divide-y">
                    {list.map((s) => (
                      <Link
                        key={s.id}
                        href={`/treinos/${s.id}`}
                        className="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-muted/40"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div
                            className="flex size-10 shrink-0 flex-col items-center justify-center rounded-md font-mono"
                            style={{
                              backgroundColor: s.categoryColor
                                ? `${s.categoryColor}22`
                                : "hsl(var(--muted))",
                              color: s.categoryColor ?? undefined,
                            }}
                          >
                            <span className="text-[9px] uppercase">
                              {new Date(s.date).toLocaleDateString("pt-BR", {
                                weekday: "short",
                              }).slice(0, 3)}
                            </span>
                            <span className="text-sm font-bold leading-none">
                              {new Date(s.date).getDate()}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-medium">
                                {s.focus ?? "Treino"}
                              </p>
                              {s.categoryName && (
                                <Badge
                                  variant="soft"
                                  className="text-[10px]"
                                >
                                  {s.categoryName}
                                </Badge>
                              )}
                            </div>
                            <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                              {s.startTime && <span>{s.startTime}</span>}
                              {s.field && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="size-3" />
                                  {s.field}
                                </span>
                              )}
                              {s.coachName && <span>· {s.coachName}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <Badge variant="outline" className="text-[10px]">
                            <Users className="mr-1 size-3" />
                            {s.attendanceCount} presenças
                          </Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
