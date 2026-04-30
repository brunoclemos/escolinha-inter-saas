import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export type AppShellUser = {
  id: string;
  email: string;
  name?: string;
};

export function AppShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: AppShellUser;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar className="hidden md:flex" />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar user={user} />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
}
