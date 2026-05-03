"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { athletes, physicalTests, users } from "@/lib/db/schema";
import { getCurrentTenant } from "@/lib/queries/tenant";
import { createClient } from "@/lib/supabase/server";
import { PHYSICAL_TESTS_BY_CODE } from "@/lib/eval/physical-tests";

const schema = z.object({
  athleteId: z.string().uuid(),
  testCode: z.string().min(1),
  recordedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  value: z.coerce.number().positive(),
  field: z.string().optional().nullable(),
  shift: z
    .enum(["morning", "afternoon", "evening"])
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
  weather: z
    .enum(["dry", "wet", "indoor"])
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
  observation: z.string().optional().nullable(),
});

export type CreatePhysicalTestState = {
  ok: boolean;
  error?: string;
};

export async function createPhysicalTestAction(
  _prev: CreatePhysicalTestState,
  formData: FormData
): Promise<CreatePhysicalTestState> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const parsed = schema.safeParse({
    athleteId: formData.get("athleteId"),
    testCode: formData.get("testCode"),
    recordedAt: formData.get("recordedAt"),
    value: formData.get("value"),
    field: formData.get("field") || null,
    shift: formData.get("shift") || null,
    weather: formData.get("weather") || null,
    observation: formData.get("observation") || null,
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  const spec = PHYSICAL_TESTS_BY_CODE[parsed.data.testCode];
  if (!spec) {
    return { ok: false, error: "Teste desconhecido." };
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
    await db.insert(physicalTests).values({
      tenantId: tenant.id,
      athleteId: parsed.data.athleteId,
      recordedById: appUser?.id ?? null,
      recordedAt: parsed.data.recordedAt,
      testCode: parsed.data.testCode,
      valueX1000: Math.round(parsed.data.value * 1000),
      unit: spec.unit,
      condition: {
        field: parsed.data.field ?? undefined,
        shift: parsed.data.shift ?? undefined,
        weather: parsed.data.weather ?? undefined,
      },
      observation: parsed.data.observation,
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
