"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { OnzeMark } from "@/components/onze-mark";
import { NAV } from "./nav-config";
import { cn } from "@/lib/utils";

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-screen w-60 flex-col border-r bg-card",
        className
      )}
    >
      <div className="flex h-[52px] shrink-0 items-center border-b px-4">
        <Link href="/dashboard" aria-label="Onze">
          <OnzeMark size="sm" />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4">
        {NAV.map((group) => (
          <div key={group.title} className="mb-5">
            <p className="mb-1.5 px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-brand-soft text-brand-text"
                          : "text-foreground/80 hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-4 shrink-0",
                          isActive ? "text-brand" : "text-muted-foreground"
                        )}
                      />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge !== undefined && (
                        <span
                          className={cn(
                            "ml-auto rounded px-1.5 py-0.5 text-[10px] font-semibold",
                            isActive
                              ? "bg-brand text-brand-fg"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t p-3 text-[11px] text-muted-foreground">
        <p className="font-medium text-foreground/80">Escolinha Inter</p>
        <p>Plano Pro · 5 atletas</p>
      </div>
    </aside>
  );
}
