"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { getCurrentTenant } from "@/lib/queries/tenant";
import { createClient } from "@/lib/supabase/server";

const updateSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(2, "Nome obrigatório"),
  ageMin: z.coerce.number().int().min(3).max(20),
  ageMax: z.coerce.number().int().min(3).max(20),
  color: z.string().regex(/^#[0-9a-f]{6}$/i, "Cor inválida"),
  headCoachId: z
    .string()
    .uuid()
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export type UpdateCategoryState = {
  ok: boolean;
  error?: string;
};

export async function updateCategoryAction(
  _prev: UpdateCategoryState,
  formData: FormData
): Promise<UpdateCategoryState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = updateSchema.safeParse({
    categoryId: formData.get("categoryId"),
    name: formData.get("name"),
    ageMin: formData.get("ageMin"),
    ageMax: formData.get("ageMax"),
    color: formData.get("color"),
    headCoachId: formData.get("headCoachId") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  if (parsed.data.ageMin > parsed.data.ageMax) {
    return { ok: false, error: "Idade mínima não pode ser maior que máxima." };
  }

  const tenant = await getCurrentTenant();

  const [existing] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(
      and(
        eq(categories.id, parsed.data.categoryId),
        eq(categories.tenantId, tenant.id)
      )
    )
    .limit(1);

  if (!existing) return { ok: false, error: "Turma não encontrada." };

  try {
    await db
      .update(categories)
      .set({
        name: parsed.data.name,
        ageMin: parsed.data.ageMin,
        ageMax: parsed.data.ageMax,
        color: parsed.data.color,
        headCoachId: parsed.data.headCoachId ?? null,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, parsed.data.categoryId));
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof Error ? `Erro: ${e.message}` : "Erro ao atualizar turma.",
    };
  }

  revalidatePath("/turmas");
  revalidatePath(`/turmas/${parsed.data.categoryId}`);
  return { ok: true };
}
