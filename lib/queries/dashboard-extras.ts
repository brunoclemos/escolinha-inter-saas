import { and, asc, desc, eq, gte, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  athletes,
  evaluations,
  matches,
  matchStats,
  attendance,
  trainingSessions,
  categories,
  athleteCategories,
} from "@/lib/db/schema";

/**
 * Média mensal de scores das avaliações publicadas (últimos 12 meses).
 * Retorna [{month: '2025-08', tech, tactical, psych}, ...]
 */
export async function getMonthlyEvaluationAverages(tenantId: string) {
  const result = await db
    .select({
      month: sql<string>`to_char(${evaluations.createdAt}, 'YYYY-MM')`.as(
        "month"
      ),
      tech: sql<number>`avg(${evaluations.techScore})`,
      tactical: sql<number>`avg(${evaluations.tacticalScore})`,
      psych: sql<number>`avg(${evaluations.psychScore})`,
    })
    .from(evaluations)
    .where(
      and(
        eq(evaluations.tenantId, tenantId),
        eq(evaluations.status, "published")
      )
    )
    .groupBy(sql`to_char(${evaluations.createdAt}, 'YYYY-MM')`)
    .orderBy(sql`to_char(${evaluations.createdAt}, 'YYYY-MM')`);

  return result.map((r) => ({
    month: r.month,
    tech: r.tech ? Number(r.tech) / 10 : null,
    tactical: r.tactical ? Number(r.tactical) / 10 : null,
    psych: r.psych ? Number(r.psych) / 10 : null,
  }));
}

/**
 * Distribuição de atletas por categoria (turma).
 */
export async function getCategoryDistribution(tenantId: string) {
  return db
    .select({
      id: categories.id,
      name: categories.name,
      color: categories.color,
      count: sql<number>`count(distinct ${athleteCategories.athleteId})`.as(
        "count"
      ),
    })
    .from(categories)
    .leftJoin(
      athleteCategories,
      eq(athleteCategories.categoryId, categories.id)
    )
    .where(eq(categories.tenantId, tenantId))
    .groupBy(categories.id, categories.name, categories.color)
    .orderBy(asc(categories.ageMin));
}

/**
 * Frequência por semana (últimas 8 semanas) — % de presença.
 */
export async function getWeeklyAttendanceTrend(tenantId: string) {
  const eightWeeksAgo = new Date();
  eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);
  const fromStr = eightWeeksAgo.toISOString().split("T")[0];

  const result = await db
    .select({
      week: sql<string>`to_char(date_trunc('week', ${trainingSessions.date}::date), 'YYYY-MM-DD')`.as(
        "week"
      ),
      total: sql<number>`count(*)`,
      present: sql<number>`count(*) filter (where ${attendance.status} in ('present', 'late'))`,
    })
    .from(attendance)
    .innerJoin(
      trainingSessions,
      eq(trainingSessions.id, attendance.sessionId)
    )
    .where(
      and(
        eq(trainingSessions.tenantId, tenantId),
        gte(trainingSessions.date, fromStr)
      )
    )
    .groupBy(sql`date_trunc('week', ${trainingSessions.date}::date)`)
    .orderBy(sql`date_trunc('week', ${trainingSessions.date}::date)`);

  return result.map((r) => ({
    week: r.week,
    rate:
      Number(r.total) > 0
        ? Math.round((Number(r.present) / Number(r.total)) * 100)
        : 0,
  }));
}

/**
 * Atleta destaque do período: mais gols nos últimos 60 dias + foto + última avaliação.
 */
export async function getAthleteOfTheMonth(tenantId: string) {
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
  const fromStr = sixtyDaysAgo.toISOString().split("T")[0];

  const [topScorer] = await db
    .select({
      athleteId: matchStats.athleteId,
      goals: sql<number>`sum(${matchStats.goals})`.as("g"),
      assists: sql<number>`sum(${matchStats.assists})`.as("a"),
      games: sql<number>`count(distinct ${matchStats.matchId})`.as("games"),
      avgRating: sql<number>`avg(${matchStats.rating})`.as("rating"),
    })
    .from(matchStats)
    .innerJoin(matches, eq(matches.id, matchStats.matchId))
    .where(
      and(eq(matches.tenantId, tenantId), gte(matches.date, fromStr))
    )
    .groupBy(matchStats.athleteId)
    .orderBy(desc(sql`sum(${matchStats.goals})`))
    .limit(1);

  if (!topScorer) return null;

  const [athlete] = await db
    .select({
      id: athletes.id,
      fullName: athletes.fullName,
      nickname: athletes.nickname,
      photoUrl: athletes.photoUrl,
      jerseyNumber: athletes.jerseyNumber,
      positionMain: athletes.positionMain,
      dob: athletes.dob,
    })
    .from(athletes)
    .where(eq(athletes.id, topScorer.athleteId))
    .limit(1);

  if (!athlete) return null;

  // Última avaliação publicada
  const [latestEval] = await db
    .select({
      tech: evaluations.techScore,
      tactical: evaluations.tacticalScore,
      psych: evaluations.psychScore,
      periodLabel: evaluations.periodLabel,
    })
    .from(evaluations)
    .where(
      and(
        eq(evaluations.athleteId, athlete.id),
        eq(evaluations.status, "published")
      )
    )
    .orderBy(desc(evaluations.createdAt))
    .limit(1);

  // Categoria
  const [cat] = await db
    .select({ name: categories.name })
    .from(athleteCategories)
    .innerJoin(
      categories,
      eq(categories.id, athleteCategories.categoryId)
    )
    .where(eq(athleteCategories.athleteId, athlete.id))
    .limit(1);

  return {
    athlete,
    stats: {
      goals: Number(topScorer.goals),
      assists: Number(topScorer.assists),
      games: Number(topScorer.games),
      avgRating: topScorer.avgRating ? Number(topScorer.avgRating) : null,
    },
    evaluation: latestEval ?? null,
    categoryName: cat?.name ?? null,
  };
}
