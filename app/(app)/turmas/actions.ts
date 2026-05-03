"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { getCurrentTenant } from "@/lib/queries/tenant";
import { createClient } from "@/lib/supabase/server";

const categorySchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  ageMin: z.coerce.number().int().min(3).max(20),
  ageMax: z.coerce.number().int().min(3).max(20),
  color: z.string().regex(/^#[0-9a-f]{6}$/i, "Cor inválida (ex: #C8102E)"),
});

export type CreateCategoryState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function createCategoryAction(
  _prev: CreateCategoryState,
  formData: FormData
): Promise<CreateCategoryState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    ageMin: formData.get("ageMin"),
    ageMax: formData.get("ageMax"),
    color: formData.get("color"),
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

  if (parsed.data.ageMin > parsed.data.ageMax) {
    return {
      ok: false,
      error: "Idade mínima maior que máxima.",
      fieldErrors: { ageMin: "Deve ser ≤ idade máxima" },
    };
  }

  const tenant = await getCurrentTenant();

  try {
    await db.insert(categories).values({
      tenantId: tenant.id,
      name: parsed.data.name,
      ageMin: parsed.data.ageMin,
      ageMax: parsed.data.ageMax,
      color: parsed.data.color,
    });
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof Error
          ? `Erro ao salvar: ${e.message}`
          : "Erro ao criar turma.",
    };
  }

  revalidatePath("/turmas");
  return { ok: true };
}
