"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  athletes,
  evaluations,
  evalTechnical,
  evalTactical,
  evalPsych,
  users,
} from "@/lib/db/schema";
import { getCurrentTenant } from "@/lib/queries/tenant";
import { createClient } from "@/lib/supabase/server";
import {
  TECHNICAL_FUNDAMENTALS,
  TACTICAL_DIMENSIONS,
  PSYCH_DIMENSIONS,
  average,
} from "@/lib/eval/fundamentos";

const formSchema = z.object({
  athleteId: z.string().uuid(),
  periodLabel: z.string().optional(),
  summaryText: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
});

export type CreateEvalState = {
  ok: boolean;
  error?: string;
};

export async function createEvaluationAction(
  _prev: CreateEvalState,
  formData: FormData
): Promise<CreateEvalState> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const parsed = formSchema.safeParse({
    athleteId: formData.get("athleteId"),
    periodLabel: formData.get("periodLabel") || undefined,
    summaryText: formData.get("summaryText") || undefined,
    status: formData.get("status") || "draft",
  });
  if (!parsed.success) {
    return { ok: false, error: "Dados inválidos." };
  }

  const tenant = await getCurrentTenant();

  // Sanity check do atleta
  const [athlete] = await db
    .select({ id: athletes.id })
    .from(athletes)
    .where(
      and(
        eq(athletes.id, parsed.data.athleteId),
        eq(athletes.tenantId, tenant.id)
      )
    )
    .limit(1);
  if (!athlete) return { ok: false, error: "Atleta não encontrado." };

  // Resolve user_id do avaliador (auth -> users)
  const [appUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.authUserId, authUser.id))
    .limit(1);

  // Coleta scores
  const techScores: { fundamental: string; score: number; comment?: string }[] = [];
  for (const f of TECHNICAL_FUNDAMENTALS) {
    const raw = formData.get(`tech_${f.key}`);
    const score = raw ? Number.parseInt(String(raw), 10) : NaN;
    if (Number.isFinite(score) && score >= 1 && score <= 10) {
      techScores.push({
        fundamental: f.key,
        score,
        comment: (formData.get(`tech_${f.key}_comment`) as string) || undefined,
      });
    }
  }

  const tactScores: { dimension: string; score: number; comment?: string }[] = [];
  for (const d of TACTICAL_DIMENSIONS) {
    const raw = formData.get(`tact_${d.key}`);
    const score = raw ? Number.parseInt(String(raw), 10) : NaN;
    if (Number.isFinite(score) && score >= 1 && score <= 10) {
      tactScores.push({
        dimension: d.key,
        score,
        comment: (formData.get(`tact_${d.key}_comment`) as string) || undefined,
      });
    }
  }

  const psychScores: { dimension: string; score: number; comment?: string }[] = [];
  for (const d of PSYCH_DIMENSIONS) {
    const raw = formData.get(`psych_${d.key}`);
    const score = raw ? Number.parseInt(String(raw), 10) : NaN;
    if (Number.isFinite(score) && score >= 1 && score <= 10) {
      psychScores.push({
        dimension: d.key,
        score,
        comment: (formData.get(`psych_${d.key}_comment`) as string) || undefined,
      });
    }
  }

  if (
    techScores.length === 0 &&
    tactScores.length === 0 &&
    psychScores.length === 0
  ) {
    return {
      ok: false,
      error: "Pelo menos um fundamento precisa ser avaliado.",
    };
  }

  const techAvg = average(techScores.map((s) => s.score));
  const tactAvg = average(tactScores.map((s) => s.score));
  const psychAvg = average(psychScores.map((s) => s.score));

  let evaluationId: string;
  try {
    const [created] = await db
      .insert(evaluations)
      .values({
        tenantId: tenant.id,
        athleteId: parsed.data.athleteId,
        evaluatorId: appUser?.id ?? null,
        periodLabel:
          parsed.data.periodLabel ?? new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
        summaryText: parsed.data.summaryText,
        status: parsed.data.status,
        techScore: techAvg !== null ? Math.round(techAvg * 10) : null,
        tacticalScore: tactAvg !== null ? Math.round(tactAvg * 10) : null,
        psychScore: psychAvg !== null ? Math.round(psychAvg * 10) : null,
        publishedAt: parsed.data.status === "published" ? new Date() : null,
      })
      .returning({ id: evaluations.id });
    evaluationId = created.id;

    if (techScores.length > 0) {
      await db.insert(evalTechnical).values(
        techScores.map((s) => ({
          evaluationId,
          fundamental: s.fundamental,
          score: s.score,
          comment: s.comment ?? null,
        }))
      );
    }
    if (tactScores.length > 0) {
      await db.insert(evalTactical).values(
        tactScores.map((s) => ({
          evaluationId,
          dimension: s.dimension,
          score: s.score,
          comment: s.comment ?? null,
        }))
      );
    }
    if (psychScores.length > 0) {
      await db.insert(evalPsych).values(
        psychScores.map((s) => ({
          evaluationId,
          dimension: s.dimension,
          score: s.score,
          comment: s.comment ?? null,
        }))
      );
    }
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof Error
          ? `Erro ao salvar: ${e.message}`
          : "Erro ao criar avaliação.",
    };
  }

  revalidatePath(`/atletas/${parsed.data.athleteId}`);
  revalidatePath("/avaliacoes");
  redirect(`/atletas/${parsed.data.athleteId}/avaliacoes/${evaluationId}`);
}
