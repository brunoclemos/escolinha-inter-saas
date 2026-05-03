import Link from "next/link";
import { ClipboardCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { formatDate, initials } from "@/lib/utils";
import { getCurrentTenant } from "@/lib/queries/tenant";
import { listEvaluationsByTenant } from "@/lib/queries/evaluations";

export const dynamic = "force-dynamic";

export default async function AvaliacoesPage() {
  const tenant = await getCurrentTenant();
  const evals = await listEvaluationsByTenant(tenant.id, { limit: 200 });

  const published = evals.filter((e) => e.status === "published");
  const drafts = evals.filter((e) => e.status === "draft");

  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <PageHeader
        title="Avaliações"
        description={`${published.length} publicadas · ${drafts.length} ${drafts.length === 1 ? "rascunho" : "rascunhos"}.`}
      />

      {evals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <ClipboardCheck className="size-10 text-muted-foreground" />
            <div>
              <p className="font-medium">Nenhuma avaliação registrada ainda.</p>
              <p className="text-sm text-muted-foreground">
                Para criar uma avaliação, abra o perfil do atleta e clique em
                "Nova avaliação".
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
                  <th className="px-4 py-3 font-medium">Atleta</th>
                  <th className="px-4 py-3 font-medium">Período</th>
                  <th className="px-4 py-3 font-medium">Avaliador(a)</th>
                  <th className="px-4 py-3 text-center font-medium">Téc</th>
                  <th className="px-4 py-3 text-center font-medium">Tát</th>
                  <th className="px-4 py-3 text-center font-medium">Psi</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {evals.map((e) => (
                  <tr
                    key={e.id}
                    className="border-b transition-colors last:border-0 hover:bg-muted/40"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/atletas/${e.athleteId}/avaliacoes/${e.id}`}
                        className="flex items-center gap-3 hover:underline"
                      >
                        <Avatar className="size-8">
                          {e.athletePhoto ? (
                            <AvatarImage
                              src={e.athletePhoto}
                              alt={e.athleteName ?? ""}
                            />
                          ) : null}
                          <AvatarFallback className="bg-brand-soft text-brand-text text-xs">
                            {initials(e.athleteName ?? "")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {e.athleteName}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {e.periodLabel ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {e.evaluatorName ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-sm tabular-nums">
                      {e.techScore !== null
                        ? (e.techScore / 10).toFixed(1)
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-sm tabular-nums">
                      {e.tacticalScore !== null
                        ? (e.tacticalScore / 10).toFixed(1)
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-sm tabular-nums">
                      {e.psychScore !== null
                        ? (e.psychScore / 10).toFixed(1)
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {e.status === "published" ? (
                        <Badge variant="ok">Publicada</Badge>
                      ) : (
                        <Badge variant="warn">Rascunho</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {formatDate(e.createdAt)}
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
