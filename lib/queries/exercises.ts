import { and, asc, eq, ilike, isNull, or, inArray, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { exercises } from "@/lib/db/schema";

export type ExerciseListItem = Awaited<
  ReturnType<typeof listExercises>
>[number];

export async function listExercises(
  tenantId: string,
  opts: {
    search?: string;
    category?: string;
    ageMin?: number;
    ageMax?: number;
  } = {}
) {
  // Visíveis: globais (tenantId IS NULL) + customizados do tenant atual
  const visibilityCondition = or(
    isNull(exercises.tenantId),
    eq(exercises.tenantId, tenantId)
  );

  const conditions = [visibilityCondition];
  if (opts.search) {
    conditions.push(
      or(
        ilike(exercises.name, `%${opts.search}%`),
        sql`${exercises.tags} && array[${opts.search}]::text[]`
      )!
    );
  }
  if (opts.category && opts.category !== "all") {
    conditions.push(eq(exercises.category, opts.category as never));
  }
  if (opts.ageMin !== undefined) {
    // exercício compatível: ageMax >= filtroAgeMin && ageMin <= filtroAgeMax
    conditions.push(sql`${exercises.ageMax} >= ${opts.ageMin}`);
  }
  if (opts.ageMax !== undefined) {
    conditions.push(sql`${exercises.ageMin} <= ${opts.ageMax}`);
  }

  return db
    .select({
      id: exercises.id,
      tenantId: exercises.tenantId,
      source: exercises.source,
      name: exercises.name,
      slug: exercises.slug,
      category: exercises.category,
      objective: exercises.objective,
      ageMin: exercises.ageMin,
      ageMax: exercises.ageMax,
      durationMin: exercises.durationMin,
      playersMin: exercises.playersMin,
      playersMax: exercises.playersMax,
      difficulty: exercises.difficulty,
      tags: exercises.tags,
      pitchLayout: exercises.pitchLayout,
    })
    .from(exercises)
    .where(and(...conditions))
    .orderBy(asc(exercises.category), asc(exercises.ageMin), asc(exercises.name));
}

export async function getExerciseById(tenantId: string, id: string) {
  const [ex] = await db
    .select()
    .from(exercises)
    .where(
      and(
        eq(exercises.id, id),
        or(
          isNull(exercises.tenantId),
          eq(exercises.tenantId, tenantId)
        )
      )
    )
    .limit(1);
  return ex ?? null;
}
