import { Building2, Palette, CreditCard, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/page-header";
import { getCurrentTenant } from "@/lib/queries/tenant";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const PLAN_LABEL: Record<string, string> = {
  trial: "Trial",
  starter: "Starter",
  pro: "Pro",
  premium: "Premium",
  franchise: "Franquia",
};

const PLAN_PRICE: Record<string, string> = {
  trial: "Grátis",
  starter: "R$ 197/mês",
  pro: "R$ 297/mês",
  premium: "R$ 597/mês",
  franchise: "R$ 1.497+/mês",
};

export default async function ConfiguracoesPage() {
  const tenant = await getCurrentTenant();

  return (
    <div className="mx-auto max-w-4xl px-6 py-6">
      <PageHeader
        title="Configurações"
        description="Dados da escolinha, plano e personalização."
      />

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="size-4 text-muted-foreground" />
              Dados da escolinha
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Nome" value={tenant.name} />
            {tenant.legalName && (
              <Field label="Razão social" value={tenant.legalName} />
            )}
            <Field
              label="Slug (subdomínio)"
              value={
                <span className="font-mono">
                  {tenant.slug}
                  <span className="text-muted-foreground">.onzehq.com</span>
                </span>
              }
            />
            {tenant.cnpj && <Field label="CNPJ" value={tenant.cnpj} />}
            <Field
              label="Cadastrada em"
              value={formatDate(tenant.createdAt)}
            />

            <Separator />
            <Button variant="outline" size="sm" disabled title="Em breve">
              Editar dados
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="size-4 text-muted-foreground" />
              Plano e cobrança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-md border bg-brand-soft/50 p-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-brand-text">
                  Plano atual
                </p>
                <p className="text-2xl font-semibold">
                  {PLAN_LABEL[tenant.plan]}
                </p>
                <p className="text-sm text-muted-foreground">
                  {PLAN_PRICE[tenant.plan]}
                </p>
              </div>
              <Badge variant={tenant.status === "active" ? "ok" : "warn"}>
                {tenant.status === "active" ? "Ativo" : tenant.status}
              </Badge>
            </div>

            {tenant.billingEmail && (
              <Field
                label="E-mail de cobrança"
                value={tenant.billingEmail}
              />
            )}

            <Separator />
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" disabled title="Em breve">
                Mudar plano
              </Button>
              <Button variant="ghost" size="sm" disabled title="Em breve">
                Ver faturas
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="size-4 text-muted-foreground" />
              Personalização da marca
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              A Onze é white-label: cada escolinha tem sua marca, cores e logo.
              Hoje a plataforma usa o tema padrão Inter.
            </p>

            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-md bg-brand text-brand-fg font-bold">
                11
              </div>
              <div>
                <p className="text-sm font-medium">Tema atual: Inter</p>
                <p className="text-xs text-muted-foreground">
                  Vermelho #C8102E · DM Sans
                </p>
              </div>
            </div>

            <Separator />
            <Button variant="outline" size="sm" disabled title="Fase 4">
              Personalizar tema
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="size-4 text-muted-foreground" />
              Domínio próprio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Conecte seu próprio domínio (ex: <span className="font-mono">app.suaescolinha.com.br</span>) para que pais e atletas acessem com a sua marca.
            </p>
            {tenant.customDomain ? (
              <div className="rounded-md border bg-ok/10 p-3">
                <p className="font-mono text-sm text-ok">
                  {tenant.customDomain}
                </p>
                <p className="text-xs text-muted-foreground">
                  Domínio conectado e verificado
                </p>
              </div>
            ) : (
              <Badge variant="outline">Não configurado</Badge>
            )}

            <Separator />
            <Button variant="outline" size="sm" disabled title="Fase 4">
              Conectar domínio
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="mt-1 text-sm">{value}</div>
    </div>
  );
}
