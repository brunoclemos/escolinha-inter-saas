"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq, and, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { trainingSessions, attendance, users } from "@/lib/db/schema";
import { getCurrentTenant } from "@/lib/queries/tenant";
import { createClient } from "@/lib/supabase/server";

const createSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().optional(),
  durationMin: z.coerce.number().int().min(15).max(300).optional().nullable(),
  categoryId: z.string().uuid().optional().nullable().or(z.literal("").transform(() => null)),
  focus: z.string().optional().nullable(),
  field: z.string().optional().nullable(),
  weather: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type CreateTrainingState = {
  ok: boolean;
  error?: string;
};

export async function createTrainingAction(
  _prev: CreateTrainingState,
  formData: FormData
): Promise<CreateTrainingState> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const parsed = createSchema.safeParse({
    date: formData.get("date"),
    startTime: formData.get("startTime") || undefined,
    durationMin: formData.get("durationMin") || undefined,
    categoryId: formData.get("categoryId") || null,
    focus: formData.get("focus") || null,
    field: formData.get("field") || null,
    weather: formData.get("weather") || null,
    notes: formData.get("notes") || null,
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  const tenant = await getCurrentTenant();

  const [appUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.authUserId, authUser.id))
    .limit(1);

  let newId: string;
  try {
    const [created] = await db
      .insert(trainingSessions)
      .values({
        tenantId: tenant.id,
        categoryId: parsed.data.categoryId ?? null,
        coachId: appUser?.id ?? null,
        date: parsed.data.date,
        startTime: parsed.data.startTime ?? null,
        durationMin: parsed.data.durationMin ?? null,
        focus: parsed.data.focus,
        field: parsed.data.field,
        weather: parsed.data.weather,
        notes: parsed.data.notes,
      })
      .returning({ id: trainingSessions.id });
    newId = created.id;
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? `Erro: ${e.message}` : "Erro ao salvar.",
    };
  }

  revalidatePath("/treinos");
  redirect(`/treinos/${newId}`);
}

const attendanceSchema = z.object({
  sessionId: z.string().uuid(),
  athleteId: z.string().uuid(),
  status: z.enum(["present", "absent", "late", "excused", "injured"]),
});

export type SetAttendanceState = {
  ok: boolean;
  error?: string;
};

export async function setAttendanceAction(
  _prev: SetAttendanceState,
  formData: FormData
): Promise<SetAttendanceState> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const parsed = attendanceSchema.safeParse({
    sessionId: formData.get("sessionId"),
    athleteId: formData.get("athleteId"),
    status: formData.get("status"),
  });
  if (!parsed.success) return { ok: false, error: "Dados inválidos." };

  const tenant = await getCurrentTenant();

  // Sanity check da sessão pertence ao tenant
  const [session] = await db
    .select({ id: trainingSessions.id })
    .from(trainingSessions)
    .where(
      and(
        eq(trainingSessions.id, parsed.data.sessionId),
        eq(trainingSessions.tenantId, tenant.id)
      )
    )
    .limit(1);
  if (!session) return { ok: false, error: "Sessão não encontrada." };

  try {
    await db
      .insert(attendance)
      .values({
        sessionId: parsed.data.sessionId,
        athleteId: parsed.data.athleteId,
        status: parsed.data.status,
      })
      .onConflictDoUpdate({
        target: [attendance.sessionId, attendance.athleteId],
        set: { status: parsed.data.status, recordedAt: sql`now()` },
      });
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? `Erro: ${e.message}` : "Erro ao salvar.",
    };
  }

  revalidatePath(`/treinos/${parsed.data.sessionId}`);
  return { ok: true };
}
