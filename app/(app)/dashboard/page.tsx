import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  ClipboardCheck,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Plus,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    label: "Atletas ativos",
    value: "5",
    delta: "+0 esta semana",
    icon: Users,
    color: "text-brand",
  },
  {
    label: "Avaliações no mês",
    value: "12",
    delta: "8 pendentes",
    icon: ClipboardCheck,
    color: "text-ok",
  },
  {
    label: "Frequência média",
    value: "92%",
    delta: "+3 vs. mês passado",
    icon: TrendingUp,
    color: "text-ok",
  },
  {
    label: "Avaliações vencidas",
    value: "2",
    delta: "Sub-13 e Sub-15",
    icon: AlertTriangle,
    color: "text-warn",
  },
];

const upcoming = [
  {
    when: "Hoje · 18h",
    what: "Treino Sub-13",
    where: "Campo 2",
    coach: "Prof. Ricardo",
  },
  {
    when: "Amanhã · 16h",
    what: "Avaliação física Sub-11",
    where: "Sala 1",
    coach: "Prof. Diego",
  },
  {
    when: "Sex · 19h",
    what: "Jogo amistoso Sub-15",
    where: "CT do Inter",
    coach: "Prof. Ricardo",
  },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Início</h1>
          <p className="text-sm text-muted-foreground">
            Visão geral da Escolinha Sport Club Internacional.
          </p>
        </div>
        <Button asChild>
          <Link href="/atletas/novo">
            <Plus className="size-4" />
            Cadastrar atleta
          </Link>
        </Button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-start justify-between pt-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-1 font-mono text-3xl font-semibold">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {stat.delta}
                  </p>
                </div>
                <Icon className={`size-5 ${stat.color}`} />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="size-4 text-muted-foreground" />
              Próximas atividades
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcoming.map((item) => (
              <div
                key={item.what}
                className="flex items-start justify-between border-l-2 border-brand pl-3"
              >
                <div>
                  <p className="text-sm font-medium">{item.what}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.where} · {item.coach}
                  </p>
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {item.when}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pendências do mês</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="text-sm font-medium">
                  Avaliação trimestral · Sub-13
                </p>
                <p className="text-xs text-muted-foreground">
                  Vence em 5 dias · 8 atletas
                </p>
              </div>
              <Badge variant="warn">Pendente</Badge>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="text-sm font-medium">
                  Relatórios para pais · Maio
                </p>
                <p className="text-xs text-muted-foreground">
                  Disparo automático em 03/05
                </p>
              </div>
              <Badge variant="soft">Agendado</Badge>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="text-sm font-medium">
                  Termos de imagem (LGPD)
                </p>
                <p className="text-xs text-muted-foreground">
                  2 atletas sem termo assinado
                </p>
              </div>
              <Badge variant="err">Atenção</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
