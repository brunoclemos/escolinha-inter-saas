import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  trainingSessions,
  attendance,
  athletes,
  athleteCategories,
  categories,
  users,
} from "@/lib/db/schema";

export async function listTrainingSessions(
  tenantId: string,
  opts: { categoryId?: string; from?: string; to?: string; limit?: number } = {}
) {
  const conditions = [eq(trainingSessions.tenantId, tenantId)];
  if (opts.categoryId)
    conditions.push(eq(trainingSessions.categoryId, opts.categoryId));
  if (opts.from) conditions.push(gte(trainingSessions.date, opts.from));
  if (opts.to) conditions.push(lte(trainingSessions.date, opts.to));

  return db
    .select({
      id: trainingSessions.id,
      date: trainingSessions.date,
      startTime: trainingSessions.startTime,
      durationMin: trainingSessions.durationMin,
      focus: trainingSessions.focus,
      field: trainingSessions.field,
      categoryId: trainingSessions.categoryId,
      categoryName: categories.name,
      categoryColor: categories.color,
      coachName: users.fullName,
      attendanceCount: sql<number>`(
        select count(*) from ${attendance}
        where ${attendance.sessionId} = ${trainingSessions.id}
      )`.as("attendance_count"),
    })
    .from(trainingSessions)
    .leftJoin(categories, eq(categories.id, trainingSessions.categoryId))
    .leftJoin(users, eq(users.id, trainingSessions.coachId))
    .where(and(...conditions))
    .orderBy(desc(trainingSessions.date))
    .limit(opts.limit ?? 100);
}

export async function getTrainingSessionById(
  tenantId: string,
  sessionId: string
) {
  const [session] = await db
    .select({
      id: trainingSessions.id,
      tenantId: trainingSessions.tenantId,
      categoryId: trainingSessions.categoryId,
      coachId: trainingSessions.coachId,
      date: trainingSessions.date,
      startTime: trainingSessions.startTime,
      durationMin: trainingSessions.durationMin,
      focus: trainingSessions.focus,
      field: trainingSessions.field,
      weather: trainingSessions.weather,
      notes: trainingSessions.notes,
      categoryName: categories.name,
      categoryColor: categories.color,
      coachName: users.fullName,
    })
    .from(trainingSessions)
    .leftJoin(categories, eq(categories.id, trainingSessions.categoryId))
    .leftJoin(users, eq(users.id, trainingSessions.coachId))
    .where(
      and(
        eq(trainingSessions.tenantId, tenantId),
        eq(trainingSessions.id, sessionId)
      )
    )
    .limit(1);

  if (!session) return null;

  // Atletas da turma + status de presença
  const enrolled = session.categoryId
    ? await db
        .select({
          id: athletes.id,
          fullName: athletes.fullName,
          jerseyNumber: athletes.jerseyNumber,
          photoUrl: athletes.photoUrl,
          attendanceStatus: attendance.status,
        })
        .from(athleteCategories)
        .innerJoin(athletes, eq(athletes.id, athleteCategories.athleteId))
        .leftJoin(
          attendance,
          and(
            eq(attendance.athleteId, athletes.id),
            eq(attendance.sessionId, sessionId)
          )
        )
        .where(eq(athleteCategories.categoryId, session.categoryId))
    : [];

  return { session, athletes: enrolled };
}

export async function getAttendanceStatsByAthlete(
  tenantId: string,
  athleteId: string,
  daysBack = 90
) {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - daysBack);
  const fromStr = fromDate.toISOString().split("T")[0];

  const result = await db
    .select({
      status: attendance.status,
      count: sql<number>`count(*)`,
    })
    .from(attendance)
    .innerJoin(
      trainingSessions,
      eq(trainingSessions.id, attendance.sessionId)
    )
    .where(
      and(
        eq(attendance.athleteId, athleteId),
        eq(trainingSessions.tenantId, tenantId),
        gte(trainingSessions.date, fromStr)
      )
    )
    .groupBy(attendance.status);

  return result.reduce<Record<string, number>>(
    (acc, r) => ({ ...acc, [r.status]: Number(r.count) }),
    {}
  );
}
