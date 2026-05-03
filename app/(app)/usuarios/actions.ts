"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getCurrentTenant } from "@/lib/queries/tenant";
import {
  createClient,
  createServiceRoleClient,
} from "@/lib/supabase/server";

const inviteSchema = z.object({
  email: z.string().email("E-mail inválido"),
  fullName: z.string().min(2, "Nome obrigatório"),
  role: z.enum(["coach", "coordinator", "school_owner"]),
});

export type InviteUserState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function inviteUserAction(
  _prev: InviteUserState,
  formData: FormData
): Promise<InviteUserState> {
  const supabase = await createClient();
  const {
    data: { user: actor },
  } = await supabase.auth.getUser();
  if (!actor) redirect("/login");

  const parsed = inviteSchema.safeParse({
    email: (formData.get("email") as string)?.toLowerCase().trim(),
    fullName: (formData.get("fullName") as string)?.trim(),
    role: formData.get("role"),
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

  // Verifica se ja existe user com esse email no tenant
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, parsed.data.email))
    .limit(1);

  if (existing) {
    return {
      ok: false,
      error: "Já existe um usuário com esse e-mail nesta escolinha.",
    };
  }

  // 1. Convida via Supabase Auth admin API
  const admin = createServiceRoleClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const { data: invite, error: inviteError } =
    await admin.auth.admin.inviteUserByEmail(parsed.data.email, {
      redirectTo: `${appUrl}/aceitar-convite`,
      data: {
        full_name: parsed.data.fullName,
        tenant_slug: tenant.slug,
        role: parsed.data.role,
      },
    });

  if (inviteError || !invite.user) {
    return {
      ok: false,
      error: `Erro ao enviar convite: ${inviteError?.message ?? "desconhecido"}`,
    };
  }

  // 2. Cria perfil na tabela users com status invited
  try {
    await db.insert(users).values({
      tenantId: tenant.id,
      authUserId: invite.user.id,
      email: parsed.data.email,
      fullName: parsed.data.fullName,
      role: parsed.data.role,
      status: "invited",
    });
  } catch (e) {
    // Se falhar ao criar perfil, deleta o auth user pra não ficar zumbi
    await admin.auth.admin.deleteUser(invite.user.id).catch(() => {});
    return {
      ok: false,
      error:
        e instanceof Error
          ? `Erro ao salvar perfil: ${e.message}`
          : "Erro ao salvar perfil.",
    };
  }

  revalidatePath("/usuarios");
  return { ok: true };
}
