import { and, desc, eq, sum, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  matches,
  matchStats,
  athletes,
  athleteCategories,
  categories,
} from "@/lib/db/schema";

export async function listMatches(
  tenantId: string,
  opts: { limit?: number } = {}
) {
  return db
    .select({
      id: matches.id,
      kind: matches.kind,
      opponent: matches.opponent,
      date: matches.date,
      startTime: matches.startTime,
      location: matches.location,
      isHome: matches.isHome,
      scoreUs: matches.scoreUs,
      scoreThem: matches.scoreThem,
      result: matches.result,
      categoryId: matches.categoryId,
      categoryName: categories.name,
      categoryColor: categories.color,
    })
    .from(matches)
    .leftJoin(categories, eq(categories.id, matches.categoryId))
    .where(eq(matches.tenantId, tenantId))
    .orderBy(desc(matches.date))
    .limit(opts.limit ?? 100);
}

export async function getMatchById(tenantId: string, matchId: string) {
  const [match] = await db
    .select({
      id: matches.id,
      tenantId: matches.tenantId,
      categoryId: matches.categoryId,
      kind: matches.kind,
      opponent: matches.opponent,
      date: matches.date,
      startTime: matches.startTime,
      location: matches.location,
      isHome: matches.isHome,
      scoreUs: matches.scoreUs,
      scoreThem: matches.scoreThem,
      result: matches.result,
      notes: matches.notes,
      categoryName: categories.name,
    })
    .from(matches)
    .leftJoin(categories, eq(categories.id, matches.categoryId))
    .where(and(eq(matches.tenantId, tenantId), eq(matches.id, matchId)))
    .limit(1);

  if (!match) return null;

  // Atletas da turma + estatísticas (se houver)
  const enrolled = match.categoryId
    ? await db
        .select({
          id: athletes.id,
          fullName: athletes.fullName,
          jerseyNumber: athletes.jerseyNumber,
          photoUrl: athletes.photoUrl,
          minutesPlayed: matchStats.minutesPlayed,
          goals: matchStats.goals,
          assists: matchStats.assists,
          yellowCards: matchStats.yellowCards,
          redCards: matchStats.redCards,
          positionPlayed: matchStats.positionPlayed,
          rating: matchStats.rating,
          notes: matchStats.notes,
        })
        .from(athleteCategories)
        .innerJoin(athletes, eq(athletes.id, athleteCategories.athleteId))
        .leftJoin(
          matchStats,
          and(
            eq(matchStats.athleteId, athletes.id),
            eq(matchStats.matchId, matchId)
          )
        )
        .where(eq(athleteCategories.categoryId, match.categoryId))
    : [];

  return { match, athletes: enrolled };
}

export async function getCareerStatsByAthlete(
  tenantId: string,
  athleteId: string
) {
  const [stats] = await db
    .select({
      games: sql<number>`count(distinct ${matchStats.matchId})`,
      goals: sum(matchStats.goals),
      assists: sum(matchStats.assists),
      yellow: sum(matchStats.yellowCards),
      red: sum(matchStats.redCards),
      minutes: sum(matchStats.minutesPlayed),
    })
    .from(matchStats)
    .innerJoin(matches, eq(matches.id, matchStats.matchId))
    .where(
      and(
        eq(matchStats.athleteId, athleteId),
        eq(matches.tenantId, tenantId)
      )
    );

  return {
    games: Number(stats?.games ?? 0),
    goals: Number(stats?.goals ?? 0),
    assists: Number(stats?.assists ?? 0),
    yellow: Number(stats?.yellow ?? 0),
    red: Number(stats?.red ?? 0),
    minutes: Number(stats?.minutes ?? 0),
  };
}
