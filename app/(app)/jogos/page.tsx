import Link from "next/link";
import { Plus, Trophy, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { formatDate } from "@/lib/utils";
import { getCurrentTenant } from "@/lib/queries/tenant";
import { listMatches } from "@/lib/queries/matches";

export const dynamic = "force-dynamic";

const KIND_LABEL: Record<string, string> = {
  friendly: "Amistoso",
  official: "Oficial",
  training: "Treino-jogo",
  tournament: "Torneio",
};

const RESULT_VARIANT: Record<string, "ok" | "warn" | "err" | "outline"> = {
  win: "ok",
  draw: "warn",
  loss: "err",
  pending: "outline",
};

const RESULT_LABEL: Record<string, string> = {
  win: "Vitória",
  draw: "Empate",
  loss: "Derrota",
  pending: "Pendente",
};

export default async function JogosPage() {
  const tenant = await getCurrentTenant();
  const matches = await listMatches(tenant.id, { limit: 200 });

  const wins = matches.filter((m) => m.result === "win").length;
  const draws = matches.filter((m) => m.result === "draw").length;
  const losses = matches.filter((m) => m.result === "loss").length;

  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <PageHeader
        title="Jogos"
        description={`${matches.length} jogos · ${wins}V ${draws}E ${losses}D`}
        actions={
          <Button asChild>
            <Link href="/jogos/novo">
              <Plus className="size-4" />
              Novo jogo
            </Link>
          </Button>
        }
      />

      {matches.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <Trophy className="size-10 text-muted-foreground" />
            <div>
              <p className="font-medium">Nenhum jogo registrado.</p>
              <p className="text-sm text-muted-foreground">
                Cadastre amistosos, oficiais e torneios. Em cada jogo você
                lança estatísticas individuais por atleta.
              </p>
            </div>
            <Button asChild>
              <Link href="/jogos/novo">
                <Plus className="size-4" />
                Cadastrar primeiro jogo
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="divide-y">
            {matches.map((m) => (
              <Link
                key={m.id}
                href={`/jogos/${m.id}`}
                className="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex size-10 shrink-0 flex-col items-center justify-center rounded-md bg-muted">
                    <span className="text-[9px] uppercase">
                      {new Date(m.date)
                        .toLocaleDateString("pt-BR", { weekday: "short" })
                        .slice(0, 3)}
                    </span>
                    <span className="text-sm font-bold leading-none">
                      {new Date(m.date).getDate()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium">
                        {m.isHome ? "vs " : "@ "}
                        {m.opponent}
                      </p>
                      <Badge variant="soft" className="text-[10px]">
                        {KIND_LABEL[m.kind]}
                      </Badge>
                      {m.categoryName && (
                        <Badge variant="outline" className="text-[10px]">
                          {m.categoryName}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{formatDate(m.date)}</span>
                      {m.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3" />
                          {m.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-3">
                  {m.scoreUs !== null && m.scoreThem !== null ? (
                    <span className="font-mono text-lg font-bold">
                      {m.scoreUs} <span className="text-muted-foreground">×</span> {m.scoreThem}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                  <Badge variant={RESULT_VARIANT[m.result]}>
                    {RESULT_LABEL[m.result]}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
