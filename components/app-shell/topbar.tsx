"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bell, LogOut } from "lucide-react";
import { logoutAction } from "@/app/(auth)/login/actions";
import type { AppShellUser } from ".";

export function Topbar({ user }: { user: AppShellUser }) {
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
    <header className="flex h-[52px] shrink-0 items-center justify-between gap-4 border-b bg-card px-4">
      <div className="flex flex-1 items-center gap-3">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar atleta, turma, professor..."
            className="h-8 pl-8 pr-12 text-sm"
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notificações">
          <Bell className="size-4" />
        </Button>

        <div className="hidden items-center gap-2 sm:flex">
          <Avatar className="size-8">
            <AvatarFallback className="bg-brand-soft text-brand-text text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="max-w-[160px] truncate text-xs text-muted-foreground">
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
