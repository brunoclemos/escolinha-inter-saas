"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { athletes, athleteCategories } from "@/lib/db/schema";
import { getCurrentTenant } from "@/lib/queries/tenant";
import { createClient } from "@/lib/supabase/server";

const updateAthleteSchema = z.object({
  athleteId: z.string().uuid(),
  fullName: z.string().min(2, "Nome obrigatório"),
  nickname: z.string().nullable().optional(),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  positionMain: z.string().nullable().optional(),
  dominantFoot: z.enum(["right", "left", "both"]).nullable().optional(),
  jerseyNumber: z
    .string()
    .optional()
    .transform((v) => (v ? Number.parseInt(v, 10) : undefined))
    .pipe(z.number().int().min(1).max(99).optional()),
  categoryId: z.string().uuid().nullable().optional(),
});

export type UpdateAthleteState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function updateAthleteAction(
  _prev: UpdateAthleteState,
  formData: FormData
): Promise<UpdateAthleteState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = updateAthleteSchema.safeParse({
    athleteId: formData.get("athleteId"),
    fullName: formData.get("fullName"),
    nickname: formData.get("nickname") || null,
    dob: formData.get("dob"),
    positionMain: formData.get("positionMain") || null,
    dominantFoot: formData.get("dominantFoot") || null,
    jerseyNumber: formData.get("jerseyNumber") || undefined,
    categoryId: formData.get("categoryId") || null,
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

  // Sanity check do tenant
  const [existing] = await db
    .select({ id: athletes.id })
    .from(athletes)
    .where(
      and(
        eq(athletes.id, parsed.data.athleteId),
        eq(athletes.tenantId, tenant.id)
      )
    )
    .limit(1);

  if (!existing) {
    return { ok: false, error: "Atleta não encontrado." };
  }

  try {
    await db
      .update(athletes)
      .set({
        fullName: parsed.data.fullName,
        nickname: parsed.data.nickname ?? null,
        dob: parsed.data.dob,
        positionMain: parsed.data.positionMain ?? null,
        dominantFoot: parsed.data.dominantFoot ?? null,
        jerseyNumber: parsed.data.jerseyNumber ?? null,
        updatedAt: new Date(),
      })
      .where(eq(athletes.id, parsed.data.athleteId));

    if (parsed.data.categoryId !== undefined) {
      // remove categorias atuais e adiciona a selecionada (1 categoria principal por atleta)
      await db
        .delete(athleteCategories)
        .where(eq(athleteCategories.athleteId, parsed.data.athleteId));

      if (parsed.data.categoryId) {
        await db
          .insert(athleteCategories)
          .values({
            athleteId: parsed.data.athleteId,
            categoryId: parsed.data.categoryId,
          })
          .onConflictDoNothing();
      }
    }
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof Error
          ? `Erro ao salvar: ${e.message}`
          : "Erro ao atualizar atleta.",
    };
  }

  revalidatePath(`/atletas/${parsed.data.athleteId}`);
  revalidatePath("/atletas");
  redirect(`/atletas/${parsed.data.athleteId}`);
}
