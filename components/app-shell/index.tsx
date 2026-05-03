import { Sidebar, type SidebarTenantInfo } from "./sidebar";
import { Topbar } from "./topbar";

export type AppShellUser = {
  id: string;
  email: string;
  name?: string;
};

export function AppShell({
  children,
  user,
  tenant,
}: {
  children: React.ReactNode;
  user: AppShellUser;
  tenant: SidebarTenantInfo;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <Sidebar
        className="hidden md:flex"
        tenant={tenant}
        athleteCount={tenant.athleteCount}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar user={user} tenant={tenant} variant="admin" />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
}
