import { History } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { formatDateTime } from "@/lib/utils";
import { getCurrentTenant } from "@/lib/queries/tenant";
import { listAuditLog } from "@/lib/queries/audit";

export const dynamic = "force-dynamic";

export default async function AuditoriaPage() {
  const tenant = await getCurrentTenant();
  const events = await listAuditLog(tenant.id, 200);

  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <PageHeader
        title="Auditoria"
        description="Trilha completa de quem fez o quê e quando."
      />

      {events.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <History className="size-10 text-muted-foreground" />
            <div>
              <p className="font-medium">Nenhum evento registrado ainda.</p>
              <p className="text-sm text-muted-foreground">
                Toda ação importante (criar atleta, gerar PDF, exportar dados,
                editar avaliação) será registrada aqui automaticamente.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Quando</th>
                  <th className="px-4 py-3 font-medium">Quem</th>
                  <th className="px-4 py-3 font-medium">Ação</th>
                  <th className="px-4 py-3 font-medium">Alvo</th>
                  <th className="px-4 py-3 font-medium">IP</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr
                    key={e.id}
                    className="border-b transition-colors last:border-0 hover:bg-muted/40"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {formatDateTime(e.occurredAt)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {e.actorName ?? (
                        <span className="text-muted-foreground">Sistema</span>
                      )}
                      {e.actorEmail && (
                        <p className="text-xs text-muted-foreground">
                          {e.actorEmail}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{e.action}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {e.targetTable}
                      {e.targetId && (
                        <span className="font-mono"> · {e.targetId.slice(0, 8)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {e.ip ?? "-"}
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
