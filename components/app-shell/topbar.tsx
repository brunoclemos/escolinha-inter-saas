"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bell, LogOut } from "lucide-react";
import { logoutAction } from "@/app/(auth)/login/actions";
import { OnzeMark } from "@/components/onze-mark";
import { MobileNav } from "./mobile-nav";
import type { AppShellUser } from ".";
import type { SidebarTenantInfo } from "./sidebar";

export function Topbar({
  user,
  tenant,
  variant = "admin",
  tenantName,
}: {
  user: AppShellUser;
  tenant?: SidebarTenantInfo;
  variant?: "admin" | "parent";
  tenantName?: string;
}) {
  const display = user.name ?? user.email;
  const initials =
    display
      .split(/[\s@]+/)
      .filter(Boolean)
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "??";

  return (
    <header className="sticky top-0 z-30 flex h-[52px] shrink-0 items-center justify-between gap-2 border-b bg-card px-3 sm:px-4">
      <div className="flex flex-1 items-center gap-2 min-w-0">
        <MobileNav variant={variant} tenant={tenant} tenantName={tenantName} />

        {/* Logo Onze visível só no mobile (no desktop fica na sidebar) */}
        <div className="md:hidden">
          <OnzeMark size="sm" showWordmark={false} />
        </div>

        <div className="relative hidden max-w-md flex-1 sm:block">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            className="h-8 pl-8 pr-12 text-sm"
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Buscar"
          className="sm:hidden"
        >
          <Search className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Notificações">
          <Bell className="size-4" />
        </Button>

        <div className="hidden items-center gap-2 sm:flex">
          <Avatar className="size-8">
            <AvatarFallback className="bg-brand-soft text-brand-text text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-[160px] truncate text-xs text-muted-foreground lg:block">
            {user.email}
          </span>
        </div>

        <form action={logoutAction}>
          <Button
            variant="ghost"
            size="icon"
            type="submit"
            aria-label="Sair"
            title="Sair"
          >
            <LogOut className="size-4" />
          </Button>
        </form>
      </div>
    </header>
  );
}
