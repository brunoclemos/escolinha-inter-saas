"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq, and, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { matches, matchStats, athletes } from "@/lib/db/schema";
import { getCurrentTenant } from "@/lib/queries/tenant";
import { createClient } from "@/lib/supabase/server";

const createSchema = z.object({
  kind: z.enum(["friendly", "official", "training", "tournament"]),
  opponent: z.string().min(2, "Adversário obrigatório"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().optional(),
  location: z.string().optional().nullable(),
  isHome: z.string().optional().transform((v) => v === "on" || v === "true"),
  categoryId: z
    .string()
    .uuid()
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
  scoreUs: z.coerce.number().int().min(0).max(50).optional().nullable(),
  scoreThem: z.coerce.number().int().min(0).max(50).optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type CreateMatchState = {
  ok: boolean;
  error?: string;
};

export async function createMatchAction(
  _prev: CreateMatchState,
  formData: FormData
): Promise<CreateMatchState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = createSchema.safeParse({
    kind: formData.get("kind"),
    opponent: formData.get("opponent"),
    date: formData.get("date"),
    startTime: formData.get("startTime") || undefined,
    location: formData.get("location") || null,
    isHome: formData.get("isHome"),
    categoryId: formData.get("categoryId") || null,
    scoreUs: formData.get("scoreUs") || undefined,
    scoreThem: formData.get("scoreThem") || undefined,
    notes: formData.get("notes") || null,
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  let result: "win" | "draw" | "loss" | "pending" = "pending";
  if (parsed.data.scoreUs != null && parsed.data.scoreThem != null) {
    result =
      parsed.data.scoreUs > parsed.data.scoreThem
        ? "win"
        : parsed.data.scoreUs < parsed.data.scoreThem
          ? "loss"
          : "draw";
  }

  const tenant = await getCurrentTenant();

  let newId: string;
  try {
    const [created] = await db
      .insert(matches)
      .values({
        tenantId: tenant.id,
        kind: parsed.data.kind,
        opponent: parsed.data.opponent,
        date: parsed.data.date,
        startTime: parsed.data.startTime ?? null,
        location: parsed.data.location,
        isHome: parsed.data.isHome ?? true,
        categoryId: parsed.data.categoryId ?? null,
        scoreUs: parsed.data.scoreUs ?? null,
        scoreThem: parsed.data.scoreThem ?? null,
        result,
        notes: parsed.data.notes,
      })
      .returning({ id: matches.id });
    newId = created.id;
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? `Erro: ${e.message}` : "Erro ao salvar.",
    };
  }

  revalidatePath("/jogos");
  redirect(`/jogos/${newId}`);
}

const statSchema = z.object({
  matchId: z.string().uuid(),
  athleteId: z.string().uuid(),
  minutesPlayed: z.coerce.number().int().min(0).max(150).optional().nullable(),
  goals: z.coerce.number().int().min(0).max(20).default(0),
  assists: z.coerce.number().int().min(0).max(20).default(0),
  yellowCards: z.coerce.number().int().min(0).max(2).default(0),
  redCards: z.coerce.number().int().min(0).max(1).default(0),
  rating: z.coerce.number().int().min(1).max(10).optional().nullable(),
  positionPlayed: z.string().optional().nullable(),
});

export type SetMatchStatsState = {
  ok: boolean;
  error?: string;
};

export async function setMatchStatsAction(
  _prev: SetMatchStatsState,
  formData: FormData
): Promise<SetMatchStatsState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = statSchema.safeParse({
    matchId: formData.get("matchId"),
    athleteId: formData.get("athleteId"),
    minutesPlayed: formData.get("minutesPlayed") || undefined,
    goals: formData.get("goals") || 0,
    assists: formData.get("assists") || 0,
    yellowCards: formData.get("yellowCards") || 0,
    redCards: formData.get("redCards") || 0,
    rating: formData.get("rating") || undefined,
    positionPlayed: formData.get("positionPlayed") || null,
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  const tenant = await getCurrentTenant();

  // Sanity check do match
  const [match] = await db
    .select({ id: matches.id })
    .from(matches)
    .where(
      and(eq(matches.id, parsed.data.matchId), eq(matches.tenantId, tenant.id))
    )
    .limit(1);
  if (!match) return { ok: false, error: "Jogo não encontrado." };

  try {
    await db
      .insert(matchStats)
      .values({
        matchId: parsed.data.matchId,
        athleteId: parsed.data.athleteId,
        minutesPlayed: parsed.data.minutesPlayed ?? null,
        goals: parsed.data.goals,
        assists: parsed.data.assists,
        yellowCards: parsed.data.yellowCards,
        redCards: parsed.data.redCards,
        rating: parsed.data.rating ?? null,
        positionPlayed: parsed.data.positionPlayed,
      })
      .onConflictDoUpdate({
        target: [matchStats.matchId, matchStats.athleteId],
        set: {
          minutesPlayed: parsed.data.minutesPlayed ?? null,
          goals: parsed.data.goals,
          assists: parsed.data.assists,
          yellowCards: parsed.data.yellowCards,
          redCards: parsed.data.redCards,
          rating: parsed.data.rating ?? null,
          positionPlayed: parsed.data.positionPlayed,
        },
      });
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? `Erro: ${e.message}` : "Erro ao salvar.",
    };
  }

  revalidatePath(`/jogos/${parsed.data.matchId}`);
  return { ok: true };
}
