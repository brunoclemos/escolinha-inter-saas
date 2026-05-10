import { and, desc, eq, gte, lte, sql, count, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  athletes,
  trainingSessions,
  attendance,
  matches,
  matchStats,
  evaluations,
  injuries,
  categories,
} from "@/lib/db/schema";

export type DashboardStats = {
  athletesActive: number;
  athletesNew30d: number;
  evaluationsThisMonth: number;
  evaluationsDraft: number;
  injuriesActive: number;
  attendanceRate30d: number | null;
  goalsThisMonth: number;
  matchesThisMonth: number;
};

export async function getDashboardStats(
  tenantId: string
): Promise<DashboardStats> {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfMonthStr = startOfMonth.toISOString().split("T")[0];
  const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split("T")[0];

  // Atletas ativos
  const [athleteStats] = await db
    .select({
      total: count(),
      newRecent: sql<number>`count(*) filter (where ${athletes.createdAt} >= ${thirtyDaysAgo.toISOString()})`,
    })
    .from(athletes)
    .where(
      and(eq(athletes.tenantId, tenantId), eq(athletes.status, "active"))
    );

  // Avaliações no mês
  const [evalStats] = await db
    .select({
      total: count(),
      drafts: sql<number>`count(*) filter (where ${evaluations.status} = 'draft')`,
    })
    .from(evaluations)
    .where(
      and(
        eq(evaluations.tenantId, tenantId),
        gte(evaluations.createdAt, startOfMonth)
      )
    );

  // Lesões ativas (não retornaram)
  const [injuryStats] = await db
    .select({ total: count() })
    .from(injuries)
    .where(
      and(eq(injuries.tenantId, tenantId), isNull(injuries.returnedAt))
    );

  // Taxa de presença últimos 30d
  const [attStats] = await db
    .select({
      total: count(),
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
        gte(trainingSessions.date, thirtyDaysAgoStr)
      )
    );

  // Gols + jogos no mês
  const [matchStatsRow] = await db
    .select({
      goals: sql<number>`coalesce(sum(${matchStats.goals}), 0)`,
    })
    .from(matchStats)
    .innerJoin(matches, eq(matches.id, matchStats.matchId))
    .where(
      and(
        eq(matches.tenantId, tenantId),
        gte(matches.date, startOfMonthStr)
      )
    );

  const [matchCountRow] = await db
    .select({ total: count() })
    .from(matches)
    .where(
      and(
        eq(matches.tenantId, tenantId),
        gte(matches.date, startOfMonthStr)
      )
    );

  return {
    athletesActive: Number(athleteStats?.total ?? 0),
    athletesNew30d: Number(athleteStats?.newRecent ?? 0),
    evaluationsThisMonth: Number(evalStats?.total ?? 0),
    evaluationsDraft: Number(evalStats?.drafts ?? 0),
    injuriesActive: Number(injuryStats?.total ?? 0),
    attendanceRate30d:
      attStats && Number(attStats.total) > 0
        ? Math.round(
            (Number(attStats.present) / Number(attStats.total)) * 100
          )
        : null,
    goalsThisMonth: Number(matchStatsRow?.goals ?? 0),
    matchesThisMonth: Number(matchCountRow?.total ?? 0),
  };
}

export async function getUpcomingTrainings(tenantId: string, limit = 5) {
  const today = new Date().toISOString().split("T")[0];
  return db
    .select({
      id: trainingSessions.id,
      date: trainingSessions.date,
      startTime: trainingSessions.startTime,
      focus: trainingSessions.focus,
      field: trainingSessions.field,
      categoryName: categories.name,
      categoryColor: categories.color,
    })
    .from(trainingSessions)
    .leftJoin(categories, eq(categories.id, trainingSessions.categoryId))
    .where(
      and(
        eq(trainingSessions.tenantId, tenantId),
        gte(trainingSessions.date, today)
      )
    )
    .orderBy(trainingSessions.date, trainingSessions.startTime)
    .limit(limit);
}

export async function getRecentMatches(tenantId: string, limit = 5) {
  return db
    .select({
      id: matches.id,
      date: matches.date,
      opponent: matches.opponent,
      scoreUs: matches.scoreUs,
      scoreThem: matches.scoreThem,
      result: matches.result,
      isHome: matches.isHome,
      categoryName: categories.name,
    })
    .from(matches)
    .leftJoin(categories, eq(categories.id, matches.categoryId))
    .where(eq(matches.tenantId, tenantId))
    .orderBy(desc(matches.date))
    .limit(limit);
}

export async function getActiveInjuries(tenantId: string) {
  return db
    .select({
      id: injuries.id,
      type: injuries.type,
      bodyPart: injuries.bodyPart,
      severity: injuries.severity,
      occurredAt: injuries.occurredAt,
      daysOut: injuries.daysOut,
      athleteId: injuries.athleteId,
      athleteName: athletes.fullName,
    })
    .from(injuries)
    .leftJoin(athletes, eq(athletes.id, injuries.athleteId))
    .where(
      and(eq(injuries.tenantId, tenantId), isNull(injuries.returnedAt))
    )
    .orderBy(desc(injuries.occurredAt));
}

export async function getTopScorers(tenantId: string, limit = 5) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth() - 2, 1);
  const startStr = startOfMonth.toISOString().split("T")[0];

  return db
    .select({
      athleteId: matchStats.athleteId,
      athleteName: athletes.fullName,
      photoUrl: athletes.photoUrl,
      goals: sql<number>`sum(${matchStats.goals})`.as("total_goals"),
      assists: sql<number>`sum(${matchStats.assists})`.as("total_assists"),
      games: sql<number>`count(distinct ${matchStats.matchId})`.as("games"),
    })
    .from(matchStats)
    .innerJoin(athletes, eq(athletes.id, matchStats.athleteId))
    .innerJoin(matches, eq(matches.id, matchStats.matchId))
    .where(
      and(eq(matches.tenantId, tenantId), gte(matches.date, startStr))
    )
    .groupBy(matchStats.athleteId, athletes.fullName, athletes.photoUrl)
    .orderBy(desc(sql`sum(${matchStats.goals})`))
    .limit(limit);
}
