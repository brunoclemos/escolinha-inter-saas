"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { athletes, athleteCategories } from "@/lib/db/schema";
import { getCurrentTenant } from "@/lib/queries/tenant";
import { createClient } from "@/lib/supabase/server";

const createAthleteSchema = z.object({
  fullName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida (formato AAAA-MM-DD)"),
  positionMain: z.string().optional().nullable(),
  dominantFoot: z.enum(["right", "left", "both"]).optional().nullable(),
  jerseyNumber: z
    .string()
    .optional()
    .transform((v) => (v ? Number.parseInt(v, 10) : undefined))
    .pipe(z.number().int().min(1).max(99).optional()),
  categoryId: z.string().uuid().optional().nullable(),
  nickname: z.string().optional().nullable(),
});

export type CreateAthleteState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function createAthleteAction(
  _prev: CreateAthleteState,
  formData: FormData
): Promise<CreateAthleteState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const raw = {
    fullName: formData.get("fullName"),
    dob: formData.get("dob"),
    positionMain: formData.get("positionMain") || null,
    dominantFoot: formData.get("dominantFoot") || null,
    jerseyNumber: formData.get("jerseyNumber") || undefined,
    categoryId: formData.get("categoryId") || null,
    nickname: formData.get("nickname") || null,
  };

  const parsed = createAthleteSchema.safeParse(raw);
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
  let newId: string;

  try {
    const [created] = await db
      .insert(athletes)
      .values({
        tenantId: tenant.id,
        fullName: parsed.data.fullName,
        nickname: parsed.data.nickname,
        dob: parsed.data.dob,
        positionMain: parsed.data.positionMain,
        dominantFoot: parsed.data.dominantFoot ?? null,
        jerseyNumber: parsed.data.jerseyNumber ?? null,
      })
      .returning({ id: athletes.id });
    newId = created.id;

    if (parsed.data.categoryId) {
      await db
        .insert(athleteCategories)
        .values({
          athleteId: newId,
          categoryId: parsed.data.categoryId,
        })
        .onConflictDoNothing();
    }
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof Error
          ? `Erro ao salvar: ${e.message}`
          : "Erro desconhecido ao salvar atleta.",
    };
  }

  revalidatePath("/atletas");
  revalidatePath("/dashboard");
  redirect(`/atletas/${newId}`);
}
