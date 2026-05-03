import { redirect } from "next/navigation";
import { ParentSidebar } from "@/components/app-shell/parent-sidebar";
import { Topbar } from "@/components/app-shell/topbar";
import { createClient } from "@/lib/supabase/server";
import { getCurrentTenant } from "@/lib/queries/tenant";
import { getCurrentUser, isParent } from "@/lib/queries/current-user";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await getCurrentUser();
  if (!isParent(profile)) {
    // Não é pai — manda pra área admin
    redirect("/dashboard");
  }

  const tenant = await getCurrentTenant();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ParentSidebar tenantName={tenant.name} className="hidden md:flex" />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar
          user={{
            email: user.email ?? "",
            id: user.id,
            name: profile?.fullName,
          }}
          variant="parent"
          tenantName={tenant.name}
        />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
}
