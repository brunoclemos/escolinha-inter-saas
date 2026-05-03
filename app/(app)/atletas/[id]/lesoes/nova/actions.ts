"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { athletes, injuries, users } from "@/lib/db/schema";
import { getCurrentTenant } from "@/lib/queries/tenant";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  athleteId: z.string().uuid(),
  type: z.string().min(2, "Tipo da lesão obrigatório"),
  bodyPart: z.string().optional().nullable(),
  severity: z.enum(["minor", "moderate", "severe"]),
  occurredAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  daysOut: z.coerce.number().int().min(0).max(365).optional().nullable(),
  returnedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
  description: z.string().optional().nullable(),
  treatment: z.string().optional().nullable(),
});

export type CreateInjuryState = {
  ok: boolean;
  error?: string;
};

export async function createInjuryAction(
  _prev: CreateInjuryState,
  formData: FormData
): Promise<CreateInjuryState> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const parsed = schema.safeParse({
    athleteId: formData.get("athleteId"),
    type: formData.get("type"),
    bodyPart: formData.get("bodyPart") || null,
    severity: formData.get("severity"),
    occurredAt: formData.get("occurredAt"),
    daysOut: formData.get("daysOut") || undefined,
    returnedAt: formData.get("returnedAt") || null,
    description: formData.get("description") || null,
    treatment: formData.get("treatment") || null,
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  const tenant = await getCurrentTenant();

  const [a] = await db
    .select({ id: athletes.id })
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

  try {
    await db.insert(injuries).values({
      tenantId: tenant.id,
      athleteId: parsed.data.athleteId,
      recordedById: appUser?.id ?? null,
      type: parsed.data.type,
      bodyPart: parsed.data.bodyPart,
      severity: parsed.data.severity,
      occurredAt: parsed.data.occurredAt,
      daysOut: parsed.data.daysOut ?? null,
      returnedAt: parsed.data.returnedAt ?? null,
      description: parsed.data.description,
      treatment: parsed.data.treatment,
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
