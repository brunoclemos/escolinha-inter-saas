import { Plus, UserCog, ShieldCheck, Mail, Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { initials, formatDate } from "@/lib/utils";
import { getCurrentTenant } from "@/lib/queries/tenant";
import { listUsers } from "@/lib/queries/users";

export const dynamic = "force-dynamic";

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super admin",
  school_owner: "Dona(o) da escolinha",
  coordinator: "Coordenação",
  coach: "Professor(a)",
  parent: "Responsável",
  athlete: "Atleta",
  scout_external: "Scout externo",
};

const ROLE_VARIANT: Record<
  string,
  "default" | "soft" | "outline" | "ok"
> = {
  super_admin: "default",
  school_owner: "default",
  coordinator: "soft",
  coach: "soft",
  parent: "outline",
  athlete: "outline",
  scout_external: "outline",
};

export default async function UsuariosPage() {
  const tenant = await getCurrentTenant();
  const users = await listUsers(tenant.id);

  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <PageHeader
        title="Usuários"
        description={`${users.length} ${users.length === 1 ? "pessoa tem acesso" : "pessoas têm acesso"} à plataforma da ${tenant.name}.`}
        actions={
          <Button disabled title="Em breve">
            <Plus className="size-4" />
            Convidar usuário
          </Button>
        }
      />

      {users.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <UserCog className="size-10 text-muted-foreground" />
            <p className="font-medium">Nenhum usuário cadastrado.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Pessoa</th>
                  <th className="px-4 py-3 font-medium">Papel</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">2FA</th>
                  <th className="px-4 py-3 font-medium">Cadastrado em</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b transition-colors last:border-0 hover:bg-muted/40"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9">
                          <AvatarFallback className="bg-brand-soft text-brand-text">
                            {initials(u.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium">{u.fullName}</p>
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="size-3" />
                            <span className="truncate">{u.email}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={ROLE_VARIANT[u.role] ?? "outline"}>
                        {ROLE_LABEL[u.role] ?? u.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {u.status === "active" ? (
                        <Badge variant="ok">Ativo</Badge>
                      ) : u.status === "invited" ? (
                        <Badge variant="warn">Convidado</Badge>
                      ) : (
                        <Badge variant="err">Suspenso</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {u.twoFaEnabled ? (
                        <span className="inline-flex items-center gap-1 text-xs text-ok">
                          <ShieldCheck className="size-3" />
                          Ativo
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Desativado
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3" />
                        {formatDate(u.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
