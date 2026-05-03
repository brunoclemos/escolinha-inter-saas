import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";
import { getCurrentTenant } from "@/lib/queries/tenant";
import { countAthletes } from "@/lib/queries/athletes";
import { getCurrentUser, isParent } from "@/lib/queries/current-user";

// Auth check depende de cookies — não pode cachear nem prerender.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Pais não acessam a área administrativa — vão pra /portal
  const profile = await getCurrentUser();
  if (isParent(profile)) {
    redirect("/portal/inicio");
  }

  const tenant = await getCurrentTenant();
  const athleteCount = await countAthletes(tenant.id);

  return (
    <AppShell
      user={{
        email: user.email ?? "",
        id: user.id,
        name: profile?.fullName,
      }}
      tenant={{
        name: tenant.name,
        plan: tenant.plan,
        athleteCount,
      }}
    >
      {children}
    </AppShell>
  );
}
