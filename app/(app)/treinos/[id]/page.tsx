import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, Clock, Cloud } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate, initials } from "@/lib/utils";
import { getCurrentTenant } from "@/lib/queries/tenant";
import { getTrainingSessionById } from "@/lib/queries/training";
import { AttendanceToggle } from "./attendance-toggle";

export const dynamic = "force-dynamic";

export default async function TrainingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tenant = await getCurrentTenant();
  const data = await getTrainingSessionById(tenant.id, id);
  if (!data) notFound();
  const { session, athletes } = data;

  const presentCount = athletes.filter(
    (a) => a.attendanceStatus === "present" || a.attendanceStatus === "late"
  ).length;
  const absentCount = athletes.filter(
    (a) => a.attendanceStatus === "absent"
  ).length;

  return (
    <div className="mx-auto max-w-5xl px-6 py-6">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/treinos">
            <ArrowLeft className="size-4" />
            Treinos
          </Link>
        </Button>
        {session.categoryName && (
          <Badge variant="soft">{session.categoryName}</Badge>
        )}
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          {session.focus ?? "Treino"}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            {formatDate(session.date)}
          </span>
          {session.startTime && (
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              {session.startTime}
              {session.durationMin && ` (${session.durationMin} min)`}
            </span>
          )}
          {session.field && (
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              {session.field}
            </span>
          )}
          {session.weather && (
            <span className="flex items-center gap-1.5">
              <Cloud className="size-3.5" />
              {session.weather}
            </span>
          )}
          {session.coachName && <span>Prof. {session.coachName}</span>}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="font-mono text-3xl font-bold text-ok">
              {presentCount}
            </p>
            <p className="text-xs text-muted-foreground">Presentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="font-mono text-3xl font-bold text-err">
              {absentCount}
            </p>
            <p className="text-xs text-muted-foreground">Faltas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="font-mono text-3xl font-bold">{athletes.length}</p>
            <p className="text-xs text-muted-foreground">Total turma</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lista de presença</CardTitle>
        </CardHeader>
        <CardContent>
          {athletes.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              {session.categoryId
                ? "Nenhum atleta nesta turma."
                : "Atribua uma turma a este treino para ver a lista de atletas."}
            </p>
          ) : (
            <div className="space-y-1">
              {athletes.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between gap-3 rounded-md border p-2 hover:bg-muted/30"
                >
                  <Link
                    href={`/atletas/${a.id}`}
                    className="flex items-center gap-3 hover:underline min-w-0 flex-1"
                  >
                    <Avatar className="size-9 shrink-0">
                      {a.photoUrl ? (
                        <AvatarImage src={a.photoUrl} alt={a.fullName} />
                      ) : null}
                      <AvatarFallback className="bg-brand-soft text-brand-text text-xs">
                        {initials(a.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {a.fullName}
                      </p>
                      {a.jerseyNumber && (
                        <p className="text-xs text-muted-foreground">
                          Camisa #{a.jerseyNumber}
                        </p>
                      )}
                    </div>
                  </Link>
                  <AttendanceToggle
                    sessionId={session.id}
                    athleteId={a.id}
                    initial={a.attendanceStatus}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {session.notes && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">Anotações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm">{session.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
