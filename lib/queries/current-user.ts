import { cache } from "react";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";

export type CurrentUser = {
  authUserId: string;
  email: string;
  appUserId: string | null;
  fullName: string;
  role: string | null;
  tenantId: string | null;
};

/**
 * Resolve o user atual (Supabase auth + perfil na tabela users).
 * Cache por request — chamada múltipla em layouts/pages só hit DB uma vez.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [profile] = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      role: users.role,
      tenantId: users.tenantId,
    })
    .from(users)
    .where(eq(users.authUserId, user.id))
    .limit(1);

  return {
    authUserId: user.id,
    email: user.email ?? "",
    appUserId: profile?.id ?? null,
    fullName: profile?.fullName ?? user.email ?? "",
    role: profile?.role ?? null,
    tenantId: profile?.tenantId ?? null,
  };
});

export function isParent(user: CurrentUser | null): boolean {
  return user?.role === "parent";
}

export function isAdmin(user: CurrentUser | null): boolean {
  return (
    user?.role === "school_owner" ||
    user?.role === "coordinator" ||
    user?.role === "super_admin"
  );
}

export function isCoach(user: CurrentUser | null): boolean {
  return user?.role === "coach";
}
