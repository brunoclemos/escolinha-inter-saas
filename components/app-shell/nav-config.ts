import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Shield,
  Calendar,
  ClipboardCheck,
  FileText,
  Video,
  Award,
  UserCog,
  ScrollText,
  Settings,
  History,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string | number;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export const NAV: NavGroup[] = [
  {
    title: "Operação",
    items: [
      { href: "/dashboard", label: "Início", icon: LayoutDashboard },
      { href: "/atletas", label: "Atletas", icon: Users, badge: 5 },
      { href: "/turmas", label: "Turmas", icon: Shield },
      { href: "/treinos", label: "Treinos", icon: Calendar },
      { href: "/avaliacoes", label: "Avaliações", icon: ClipboardCheck },
    ],
  },
  {
    title: "Saídas",
    items: [
      { href: "/relatorios-pais", label: "Relatórios pais", icon: FileText },
      { href: "/videos", label: "Vídeos", icon: Video },
      { href: "/dossies", label: "Dossiês", icon: Award },
    ],
  },
  {
    title: "Sistema",
    items: [
      { href: "/usuarios", label: "Usuários", icon: UserCog },
      { href: "/lgpd", label: "LGPD", icon: ScrollText },
      { href: "/auditoria", label: "Auditoria", icon: History },
      { href: "/configuracoes", label: "Configurações", icon: Settings },
    ],
  },
];
