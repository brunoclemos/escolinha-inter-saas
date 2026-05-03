import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  evaluations,
  evalTechnical,
  evalTactical,
  evalPsych,
  athletes,
  users,
} from "@/lib/db/schema";

export async function listEvaluationsByAthlete(
  tenantId: string,
  athleteId: string
) {
  return db
    .select({
      id: evaluations.id,
      periodLabel: evaluations.periodLabel,
      periodStart: evaluations.periodStart,
      periodEnd: evaluations.periodEnd,
      status: evaluations.status,
      summaryText: evaluations.summaryText,
      techScore: evaluations.techScore,
      tacticalScore: evaluations.tacticalScore,
      psychScore: evaluations.psychScore,
      publishedAt: evaluations.publishedAt,
      createdAt: evaluations.createdAt,
      evaluatorName: users.fullName,
    })
    .from(evaluations)
    .leftJoin(users, eq(users.id, evaluations.evaluatorId))
    .where(
      and(
        eq(evaluations.tenantId, tenantId),
        eq(evaluations.athleteId, athleteId)
      )
    )
    .orderBy(desc(evaluations.createdAt));
}

export async function listEvaluationsByTenant(
  tenantId: string,
  opts: { status?: "draft" | "published"; limit?: number } = {}
) {
  const conditions = [eq(evaluations.tenantId, tenantId)];
  if (opts.status) conditions.push(eq(evaluations.status, opts.status));

  return db
    .select({
      id: evaluations.id,
      periodLabel: evaluations.periodLabel,
      status: evaluations.status,
      techScore: evaluations.techScore,
      tacticalScore: evaluations.tacticalScore,
      psychScore: evaluations.psychScore,
      createdAt: evaluations.createdAt,
      publishedAt: evaluations.publishedAt,
      athleteId: evaluations.athleteId,
      athleteName: athletes.fullName,
      athletePhoto: athletes.photoUrl,
      evaluatorName: users.fullName,
    })
    .from(evaluations)
    .leftJoin(athletes, eq(athletes.id, evaluations.athleteId))
    .leftJoin(users, eq(users.id, evaluations.evaluatorId))
    .where(and(...conditions))
    .orderBy(desc(evaluations.createdAt))
    .limit(opts.limit ?? 100);
}

export async function getEvaluationById(
  tenantId: string,
  evaluationId: string
) {
  const [evaluation] = await db
    .select()
    .from(evaluations)
    .where(
      and(eq(evaluations.tenantId, tenantId), eq(evaluations.id, evaluationId))
    )
    .limit(1);

  if (!evaluation) return null;

  const [tech, tact, psych] = await Promise.all([
    db
      .select()
      .from(evalTechnical)
      .where(eq(evalTechnical.evaluationId, evaluationId)),
    db
      .select()
      .from(evalTactical)
      .where(eq(evalTactical.evaluationId, evaluationId)),
    db.select().from(evalPsych).where(eq(evalPsych.evaluationId, evaluationId)),
  ]);

  return { evaluation, technical: tech, tactical: tact, psych };
}

export async function getLatestEvaluation(
  tenantId: string,
  athleteId: string
) {
  const [latest] = await db
    .select({
      id: evaluations.id,
      techScore: evaluations.techScore,
      tacticalScore: evaluations.tacticalScore,
      psychScore: evaluations.psychScore,
      status: evaluations.status,
      createdAt: evaluations.createdAt,
      periodLabel: evaluations.periodLabel,
    })
    .from(evaluations)
    .where(
      and(
        eq(evaluations.tenantId, tenantId),
        eq(evaluations.athleteId, athleteId),
        eq(evaluations.status, "published")
      )
    )
    .orderBy(desc(evaluations.createdAt))
    .limit(1);
  return latest ?? null;
}
