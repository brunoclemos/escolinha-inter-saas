"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { guardians, athleteGuardians, athletes } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { getCurrentTenant } from "@/lib/queries/tenant";
import { createClient } from "@/lib/supabase/server";

const guardianSchema = z.object({
  athleteId: z.string().uuid(),
  fullName: z.string().min(2, "Nome obrigatório"),
  relationship: z.enum([
    "father",
    "mother",
    "stepfather",
    "stepmother",
    "tutor",
    "grandfather",
    "grandmother",
    "uncle",
    "aunt",
    "sibling",
    "other",
  ]),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  email: z
    .string()
    .email("E-mail inválido")
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
  isPrimary: z.string().optional().transform((v) => v === "on" || v === "true"),
});

export type AddGuardianState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function addGuardianAction(
  _prev: AddGuardianState,
  formData: FormData
): Promise<AddGuardianState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = guardianSchema.safeParse({
    athleteId: formData.get("athleteId"),
    fullName: formData.get("fullName"),
    relationship: formData.get("relationship"),
    phone: formData.get("phone") || null,
    whatsapp: formData.get("whatsapp") || null,
    email: formData.get("email") || null,
    isPrimary: formData.get("isPrimary"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join(".")] = issue.message;
    }
    return {
      ok: false,
      error: "Verifique os campos destacados.",
      fieldErrors,
    };
  }

  const tenant = await getCurrentTenant();

  // Sanity check: o atleta pertence a este tenant?
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

  if (!athlete) {
    return { ok: false, error: "Atleta não encontrado." };
  }

  try {
    const [guardian] = await db
      .insert(guardians)
      .values({
        tenantId: tenant.id,
        fullName: parsed.data.fullName,
        relationship: parsed.data.relationship,
        phone: parsed.data.phone,
        whatsapp: parsed.data.whatsapp || parsed.data.phone,
        email: parsed.data.email,
      })
      .returning({ id: guardians.id });

    await db.insert(athleteGuardians).values({
      athleteId: parsed.data.athleteId,
      guardianId: guardian.id,
      isPrimary: parsed.data.isPrimary,
      financialResponsible: parsed.data.isPrimary,
    });
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof Error
          ? `Erro ao salvar: ${e.message}`
          : "Erro ao adicionar responsável.",
    };
  }

  revalidatePath(`/atletas/${parsed.data.athleteId}`);
  return { ok: true };
}
