import Link from "next/link";
import { Dumbbell, Clock, Users, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { FootballPitch } from "@/components/football-pitch";
import { getCurrentTenant } from "@/lib/queries/tenant";
import { listExercises } from "@/lib/queries/exercises";
import {
  CATEGORY_LABELS,
  CATEGORY_COLORS,
} from "@/lib/exercises/labels";

export const dynamic = "force-dynamic";

export default async function ExerciciosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string; age?: string }>;
}) {
  const params = await searchParams;
  const tenant = await getCurrentTenant();
  const ageFilter = params.age ? parseInt(params.age, 10) : undefined;

  const exercises = await listExercises(tenant.id, {
    search: params.q,
    category: params.cat,
    ageMin: ageFilter,
    ageMax: ageFilter,
  });

  // Agrupa por categoria
  const byCategory: Record<string, typeof exercises> = {};
  for (const ex of exercises) {
    (byCategory[ex.category] = byCategory[ex.category] ?? []).push(ex);
  }

  const allCategories = [
    "warmup",
    "technical",
    "tactical",
    "physical",
    "set_pieces",
    "goalkeeper",
    "fun",
    "cooldown",
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <PageHeader
        title="Biblioteca de exercícios"
        description={`${exercises.length} ${exercises.length === 1 ? "exercício disponível" : "exercícios disponíveis"} pra montar seu plano de treino.`}
      />

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <FilterChip
          label="Todos"
          href="/exercicios"
          active={!params.cat}
        />
        {allCategories.map((c) => (
          <FilterChip
            key={c}
            label={CATEGORY_LABELS[c] ?? c}
            href={`/exercicios?cat=${c}`}
            active={params.cat === c}
            color={CATEGORY_COLORS[c]}
          />
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2 text-xs">
        <span className="text-muted-foreground">Filtrar por idade:</span>
        {[6, 8, 10, 12, 14, 16].map((age) => (
          <Link
            key={age}
            href={
              params.age === String(age)
                ? "/exercicios"
                : `/exercicios?age=${age}`
            }
            className={`rounded-full border px-2 py-0.5 transition-colors ${
              params.age === String(age)
                ? "border-brand bg-brand text-brand-fg"
                : "hover:bg-accent"
            }`}
          >
            Sub-{age}
          </Link>
        ))}
      </div>

      {exercises.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <Dumbbell className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Nenhum exercício encontrado com esse filtro.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(byCategory).map(([cat, list]) => (
            <div key={cat}>
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="size-3 rounded-sm"
                  style={{
                    backgroundColor:
                      CATEGORY_COLORS[cat] ?? "hsl(var(--brand))",
                  }}
                />
                <h2 className="text-sm font-semibold uppercase tracking-wider">
                  {CATEGORY_LABELS[cat] ?? cat}
                </h2>
                <span className="text-xs text-muted-foreground">
                  ({list.length})
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((ex) => (
                  <Link
                    key={ex.id}
                    href={`/exercicios/${ex.id}`}
                    className="group"
                  >
                    <Card className="h-full overflow-hidden transition-shadow group-hover:shadow-md">
                      <div className="aspect-[100/64] bg-stone-900">
                        {ex.pitchLayout ? (
                          <FootballPitch
                            half={ex.pitchLayout.half ?? true}
                            players={ex.pitchLayout.players ?? []}
                            cones={ex.pitchLayout.cones ?? []}
                            goals={ex.pitchLayout.goals ?? []}
                            arrows={ex.pitchLayout.arrows ?? []}
                            zones={ex.pitchLayout.zones ?? []}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-stone-500">
                            <BookOpen className="size-8" />
                          </div>
                        )}
                      </div>
                      <CardContent className="space-y-2 pt-4">
                        <h3 className="line-clamp-2 text-sm font-semibold leading-tight group-hover:underline">
                          {ex.name}
                        </h3>
                        {ex.objective && (
                          <p className="line-clamp-2 text-xs text-muted-foreground">
                            {ex.objective}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <Badge variant="soft" className="gap-1 text-[10px]">
                            <Users className="size-2.5" />
                            Sub-{ex.ageMin}–{ex.ageMax}
                          </Badge>
                          {ex.durationMin && (
                            <Badge variant="outline" className="gap-1 text-[10px]">
                              <Clock className="size-2.5" />
                              {ex.durationMin} min
                            </Badge>
                          )}
                          {ex.difficulty && (
                            <Badge variant="outline" className="text-[10px]">
                              {"⚡".repeat(ex.difficulty)}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  href,
  active,
  color,
}: {
  label: string;
  href: string;
  active: boolean;
  color?: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-brand bg-brand text-brand-fg"
          : "hover:bg-accent"
      }`}
    >
      {color && (
        <span
          className="size-2 rounded-sm"
          style={{ backgroundColor: color }}
        />
      )}
      {label}
    </Link>
  );
}
