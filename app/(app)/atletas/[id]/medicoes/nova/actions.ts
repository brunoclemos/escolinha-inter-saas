"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { athletes, anthropometryRecords, users } from "@/lib/db/schema";
import { getCurrentTenant } from "@/lib/queries/tenant";
import { createClient } from "@/lib/supabase/server";
import { calculateBmiX10 } from "@/lib/queries/anthropometry";
import { estimateBiologicalAge } from "@/lib/eval/phv";
import { ageFromDob } from "@/lib/utils";

const schema = z.object({
  athleteId: z.string().uuid(),
  recordedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  heightCm: z.coerce.number().int().min(50).max(250).optional().nullable(),
  weightKg: z.coerce.number().min(10).max(200).optional().nullable(),
  wingspanCm: z.coerce.number().int().min(50).max(250).optional().nullable(),
  bodyFatPct: z.coerce.number().min(2).max(60).optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type CreateAnthropometryState = {
  ok: boolean;
  error?: string;
};

export async function createAnthropometryAction(
  _prev: CreateAnthropometryState,
  formData: FormData
): Promise<CreateAnthropometryState> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const parsed = schema.safeParse({
    athleteId: formData.get("athleteId"),
    recordedAt: formData.get("recordedAt"),
    heightCm: formData.get("heightCm") || undefined,
    weightKg: formData.get("weightKg") || undefined,
    wingspanCm: formData.get("wingspanCm") || undefined,
    bodyFatPct: formData.get("bodyFatPct") || undefined,
    notes: formData.get("notes") || null,
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  if (
    parsed.data.heightCm == null &&
    parsed.data.weightKg == null &&
    parsed.data.wingspanCm == null &&
    parsed.data.bodyFatPct == null
  ) {
    return {
      ok: false,
      error: "Preencha pelo menos uma medida (altura, peso, etc).",
    };
  }

  const tenant = await getCurrentTenant();

  // Sanity check + busca dob pra calcular PHV
  const [a] = await db
    .select({ id: athletes.id, dob: athletes.dob })
    .from(athletes)
    .where(
      and(
        eq(athletes.id, parsed.data.athleteId),
        eq(athletes.tenantId, tenant.id)
      )
    )
    .limit(1);
  if (!a) return { ok: false, error: "Atleta não encontrado." };

  const [appUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.authUserId, authUser.id))
    .limit(1);

  const heightCm = parsed.data.heightCm ?? null;
  const weightDg =
    parsed.data.weightKg != null
      ? Math.round(parsed.data.weightKg * 10)
      : null;
  const bmi = calculateBmiX10(heightCm, weightDg);
  const chronoAge = ageFromDob(a.dob);
  const bioAge = estimateBiologicalAge(heightCm, chronoAge);
  const bioAgeX10 = bioAge !== null ? Math.round(bioAge * 10) : null;

  try {
    await db.insert(anthropometryRecords).values({
      tenantId: tenant.id,
      athleteId: parsed.data.athleteId,
      recordedById: appUser?.id ?? null,
      recordedAt: parsed.data.recordedAt,
      heightCm,
      weightDg,
      wingspanCm: parsed.data.wingspanCm ?? null,
      bodyFatPctX10:
        parsed.data.bodyFatPct != null
          ? Math.round(parsed.data.bodyFatPct * 10)
          : null,
      bmiX10: bmi,
      biologicalAgeX10: bioAgeX10,
      notes: parsed.data.notes,
    });
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? `Erro: ${e.message}` : "Erro ao salvar.",
    };
  }

  revalidatePath(`/atletas/${parsed.data.athleteId}`);
  redirect(`/atletas/${parsed.data.athleteId}`);
}
