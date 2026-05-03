import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, initials } from "@/lib/utils";
import { getCurrentTenant } from "@/lib/queries/tenant";
import { getMatchById } from "@/lib/queries/matches";
import { StatRow } from "./stat-row";

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

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tenant = await getCurrentTenant();
  const data = await getMatchById(tenant.id, id);
  if (!data) notFound();
  const { match, athletes } = data;

  return (
    <div className="mx-auto max-w-5xl px-6 py-6">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/jogos">
            <ArrowLeft className="size-4" />
            Jogos
          </Link>
        </Button>
        <Badge variant={RESULT_VARIANT[match.result]}>
          {RESULT_LABEL[match.result]}
        </Badge>
      </div>

      <div className="mb-4 rounded-lg border bg-muted/30 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="soft">{KIND_LABEL[match.kind]}</Badge>
              {match.categoryName && (
                <Badge variant="outline">{match.categoryName}</Badge>
              )}
              <Badge variant="outline">
                {match.isHome ? "Casa" : "Fora"}
              </Badge>
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              {tenant.name}{" "}
              <span className="text-muted-foreground">vs</span>{" "}
              {match.opponent}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                {formatDate(match.date)}
                {match.startTime && ` · ${match.startTime}`}
              </span>
              {match.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  {match.location}
                </span>
              )}
            </div>
          </div>
          <div className="text-center">
            {match.scoreUs !== null && match.scoreThem !== null ? (
              <p className="font-mono text-5xl font-bold">
                {match.scoreUs}{" "}
                <span className="text-muted-foreground text-3xl">×</span>{" "}
                {match.scoreThem}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">Sem placar</p>
            )}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Estatísticas individuais</CardTitle>
        </CardHeader>
        <CardContent>
          {athletes.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              {match.categoryId
                ? "Nenhum atleta nesta turma."
                : "Atribua uma turma a este jogo para lançar estatísticas individuais."}
            </p>
          ) : (
            <div className="space-y-2">
              {athletes.map((a) => (
                <StatRow
                  key={a.id}
                  matchId={match.id}
                  athlete={{
                    id: a.id,
                    fullName: a.fullName,
                    jerseyNumber: a.jerseyNumber,
                    photoUrl: a.photoUrl,
                  }}
                  initial={{
                    minutesPlayed: a.minutesPlayed,
                    goals: a.goals ?? 0,
                    assists: a.assists ?? 0,
                    yellowCards: a.yellowCards ?? 0,
                    redCards: a.redCards ?? 0,
                    rating: a.rating,
                    positionPlayed: a.positionPlayed,
                  }}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {match.notes && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">Anotações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm">{match.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
