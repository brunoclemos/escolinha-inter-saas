"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";

export type AcceptInviteState = {
  ok: boolean;
  error?: string;
};

export async function acceptInviteAction(
  _prev: AcceptInviteState,
  formData: FormData
): Promise<AcceptInviteState> {
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  if (password.length < 8) {
    return { ok: false, error: "A senha precisa ter pelo menos 8 caracteres." };
  }
  if (password !== passwordConfirm) {
    return { ok: false, error: "As senhas não coincidem." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      ok: false,
      error: "Sessão de convite expirada. Solicite um novo convite.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { ok: false, error: `Erro ao salvar senha: ${error.message}` };
  }

  // Marca o profile como ativo
  try {
    await db
      .update(users)
      .set({ status: "active", updatedAt: new Date() })
      .where(eq(users.authUserId, user.id));
  } catch {
    // não-crítico — o usuário ainda consegue entrar
  }

  redirect("/dashboard");
}
