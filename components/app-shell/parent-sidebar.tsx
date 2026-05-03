"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, FileText, MessageCircle } from "lucide-react";
import { OnzeMark } from "@/components/onze-mark";
import { cn } from "@/lib/utils";

const PARENT_NAV = [
  { href: "/portal/inicio", label: "Início", icon: Home },
  { href: "/portal/filhos", label: "Meus filhos", icon: Users },
  { href: "/portal/relatorios", label: "Relatórios", icon: FileText },
  { href: "/portal/mensagens", label: "Mensagens", icon: MessageCircle },
];

export function ParentSidebar({
  tenantName,
  className,
}: {
  tenantName: string;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-screen w-60 flex-col border-r bg-card",
        className
      )}
    >
      <div className="flex h-[52px] shrink-0 items-center border-b px-4">
        <Link href="/portal/inicio" aria-label="Onze">
          <OnzeMark size="sm" />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-1.5 px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Portal dos Pais
        </p>
        <ul className="space-y-0.5">
          {PARENT_NAV.map((item) => {
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
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t p-3 text-[11px] text-muted-foreground">
        <p className="truncate font-medium text-foreground/80">{tenantName}</p>
        <p>Acesso de responsável</p>
      </div>
    </aside>
  );
}
