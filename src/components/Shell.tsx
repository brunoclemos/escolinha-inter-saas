"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  User,
  ClipboardList,
  TrendingUp,
  FileText,
  Menu,
  X,
} from "lucide-react";
import clsx from "clsx";

const NAV = [
  { href: "/", label: "Visão geral", icon: Home },
  { href: "/perfil", label: "Perfil completo", icon: User },
  { href: "/avaliacoes", label: "Avaliações", icon: ClipboardList },
  { href: "/evolucao", label: "Evolução", icon: TrendingUp },
  { href: "/relatorio", label: "Relatório trimestral", icon: FileText },
];

export function Shell({
  children,
  userName,
  userImage,
}: {
  children: React.ReactNode;
  userName?: string | null;
  userImage?: string | null;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen lg:flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex w-[260px] shrink-0 border-r border-inter-line bg-white flex-col">
        <SidebarContent
          pathname={pathname}
          userName={userName}
          userImage={userImage}
        />
      </aside>

      {/* Drawer — mobile */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-[280px] bg-white flex flex-col h-full">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-3 right-3 h-8 w-8 inline-flex items-center justify-center text-inter-mute hover:text-inter-graphite"
              aria-label="Fechar menu"
            >
              <X size={18} />
            </button>
            <SidebarContent
              pathname={pathname}
              userName={userName}
              userImage={userImage}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-inter-line">
          <div className="flex items-center gap-3 px-4 lg:px-8 h-14">
            <button
              className="lg:hidden h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-inter-bg"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu size={20} />
            </button>
            <div className="lg:hidden flex items-center gap-2">
              <div className="h-7 w-7 rounded bg-inter-red p-0.5">
                <Image
                  src="/logo-escola.png"
                  alt=""
                  width={28}
                  height={28}
                  className="object-contain w-full h-full"
                />
              </div>
              <span className="font-semibold text-sm">Escola do Inter</span>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <span className="hidden sm:block text-xs text-inter-mute">
                {currentBreadcrumb(pathname)}
              </span>
              <UserChip name={userName} image={userImage} />
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 lg:px-8 py-6 lg:py-8 max-w-[1400px] w-full">
          {children}
        </main>

        <footer className="border-t border-inter-line px-4 lg:px-8 py-4 text-[11px] text-inter-subtle mono">
          Escola do Inter · Rio Grande/RS · prototipo v0.1 · LGPD-compliant
        </footer>
      </div>
    </div>
  );
}

function SidebarContent({
  pathname,
  userName,
  userImage,
  onNavigate,
}: {
  pathname: string;
  userName?: string | null;
  userImage?: string | null;
  onNavigate?: () => void;
}) {
  return (
    <>
      <div className="p-5 flex items-center gap-3 border-b border-inter-line">
        <div className="h-11 w-11 rounded-lg bg-inter-red p-1 shrink-0">
          <Image
            src="/logo-escola.png"
            alt=""
            width={44}
            height={44}
            className="object-contain w-full h-full"
          />
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-sm leading-tight">
            Escola do Inter
          </div>
          <div className="text-[11px] text-inter-mute mono">Rio Grande · RS</div>
        </div>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="text-[10px] uppercase tracking-widest text-inter-subtle font-semibold px-3 py-2">
          Atleta
        </div>
        {NAV.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={clsx(
                "flex items-center gap-2.5 h-10 px-3 rounded-md text-sm font-medium transition-colors",
                active
                  ? "bg-inter-red-soft text-inter-red"
                  : "text-inter-graphite hover:bg-inter-bg"
              )}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-inter-line">
        <div className="flex items-center gap-2.5 px-2 py-2">
          {userImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={userImage}
              alt={userName || ""}
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <div className="ui-avatar h-8 w-8 text-xs">
              {userInitials(userName)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium truncate">
              Acesso público
            </div>
            <div className="text-[10px] text-inter-mute">prototipo aberto</div>
          </div>
        </div>
      </div>
    </>
  );
}

function UserChip({
  name,
  image,
}: {
  name?: string | null;
  image?: string | null;
}) {
  return image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={image} alt={name || ""} className="h-8 w-8 rounded-full" />
  ) : (
    <div className="ui-avatar h-8 w-8 text-xs">{userInitials(name)}</div>
  );
}

function userInitials(name?: string | null) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0] + parts[parts.length - 1]![0]).toUpperCase();
}

function currentBreadcrumb(pathname: string) {
  const map: Record<string, string> = {
    "/": "Visão geral",
    "/perfil": "Perfil completo",
    "/avaliacoes": "Avaliações",
    "/evolucao": "Evolução",
    "/relatorio": "Relatório trimestral",
  };
  return map[pathname] || "";
}
