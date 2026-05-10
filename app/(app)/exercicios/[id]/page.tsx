import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Users,
  Target,
  Lightbulb,
  Wand2,
  PackageOpen,
  Video,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FootballPitch } from "@/components/football-pitch";
import { getCurrentTenant } from "@/lib/queries/tenant";
import { getExerciseById } from "@/lib/queries/exercises";
import {
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  DIFFICULTY_LABELS,
} from "@/lib/exercises/labels";

export const dynamic = "force-dynamic";

export default async function ExercicioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tenant = await getCurrentTenant();
  const ex = await getExerciseById(tenant.id, id);
  if (!ex) notFound();

  const catLabel = CATEGORY_LABELS[ex.category] ?? ex.category;
  const catColor = CATEGORY_COLORS[ex.category] ?? "hsl(var(--brand))";

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/exercicios">
            <ArrowLeft className="size-4" />
            Biblioteca
          </Link>
        </Button>
      </div>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge
              className="gap-1 text-xs"
              style={{ backgroundColor: catColor, color: "white" }}
            >
              {catLabel}
            </Badge>
            <Badge variant="soft" className="gap-1 text-xs">
              <Users className="size-3" />
              Sub-{ex.ageMin}–{ex.ageMax}
            </Badge>
            {ex.durationMin && (
              <Badge variant="outline" className="gap-1 text-xs">
                <Clock className="size-3" />
                {ex.durationMin} min
              </Badge>
            )}
            {ex.difficulty && (
              <Badge variant="outline" className="text-xs">
                {DIFFICULTY_LABELS[ex.difficulty] ?? `Nível ${ex.difficulty}`}
              </Badge>
            )}
            {ex.source === "platform" && (
              <Badge variant="outline" className="text-xs">
                Catálogo Onze
              </Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {ex.name}
          </h1>
          {ex.objective && (
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              <Target className="mr-1 inline size-3.5 align-text-bottom text-brand" />
              {ex.objective}
            </p>
          )}
        </div>
      </div>

      {/* Campo de futebol grande */}
      {ex.pitchLayout && (
        <Card className="mb-4 overflow-hidden">
          <div className="bg-stone-900">
            <FootballPitch
              half={ex.pitchLayout.half ?? true}
              players={ex.pitchLayout.players ?? []}
              cones={ex.pitchLayout.cones ?? []}
              goals={ex.pitchLayout.goals ?? []}
              arrows={ex.pitchLayout.arrows ?? []}
              zones={ex.pitchLayout.zones ?? []}
            />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 border-t bg-muted/30 px-4 py-2 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="size-2.5 rounded-full bg-red-600" /> Time A
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2.5 rounded-full bg-blue-700" /> Time B
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2.5 rounded-full bg-gray-500" /> Neutro
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rotate-180 border-l-[4px] border-r-[4px] border-b-[7px] border-l-transparent border-r-transparent border-b-orange-500" />
              Cone
            </span>
            <span>━━ Corrida</span>
            <span className="text-yellow-500">┄┄ Passe</span>
          </div>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Coluna esquerda: instruções + variações */}
        <div className="space-y-4 lg:col-span-2">
          {ex.instructions && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Lightbulb className="size-4 text-brand" />
                  Como executar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {ex.instructions}
                </p>
              </CardContent>
            </Card>
          )}

          {ex.coachingPoints && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="size-4 text-ok" />
                  Pontos-chave do coach
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {ex.coachingPoints}
                </p>
              </CardContent>
            </Card>
          )}

          {ex.variations && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Wand2 className="size-4 text-warn" />
                  Variações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {ex.variations}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Coluna direita: materiais + tags + crédito */}
        <div className="space-y-4">
          {ex.materials && ex.materials.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <PackageOpen className="size-4 text-muted-foreground" />
                  Materiais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5 text-sm">
                  {ex.materials.map((m, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 inline-block size-1.5 shrink-0 rounded-full bg-brand" />
                      {m}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Configuração</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Idade</span>
                <span className="font-medium">
                  {ex.ageMin}–{ex.ageMax} anos
                </span>
              </div>
              {(ex.playersMin || ex.playersMax) && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Jogadores</span>
                  <span className="font-medium">
                    {ex.playersMin === ex.playersMax
                      ? ex.playersMin
                      : `${ex.playersMin ?? "—"} a ${ex.playersMax ?? "—"}`}
                  </span>
                </div>
              )}
              {ex.durationMin && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duração</span>
                  <span className="font-medium">{ex.durationMin} min</span>
                </div>
              )}
              {ex.difficulty && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dificuldade</span>
                  <span className="font-medium">
                    {DIFFICULTY_LABELS[ex.difficulty]} ({ex.difficulty}/5)
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {ex.videoUrl && (
            <Card>
              <CardContent className="pt-6">
                <a
                  href={ex.videoUrl}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-2 text-sm font-medium text-brand hover:underline"
                >
                  <Video className="size-4" />
                  Ver vídeo explicativo
                </a>
              </CardContent>
            </Card>
          )}

          {ex.tags && ex.tags.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Tag className="size-4 text-muted-foreground" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {ex.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-[10px]"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {ex.sourceCredit && (
            <p className="px-1 text-[10px] text-muted-foreground">
              Fonte: {ex.sourceCredit}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
