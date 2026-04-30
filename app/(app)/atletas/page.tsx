import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, Filter, Users } from "lucide-react";
import { ageFromDob, initials } from "@/lib/utils";
import { getCurrentTenant } from "@/lib/queries/tenant";
import { listAthletes } from "@/lib/queries/athletes";

const FOOT_LABEL: Record<string, string> = {
  right: "Direito",
  left: "Esquerdo",
  both: "Ambidestro",
};

export default async function AtletasPage() {
  const tenant = await getCurrentTenant();
  const athletes = await listAthletes(tenant.id);

  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Atletas</h1>
          <p className="text-sm text-muted-foreground">
            {athletes.length === 0
              ? "Nenhum atleta cadastrado ainda."
              : `${athletes.length} ${athletes.length === 1 ? "atleta" : "atletas"}.`}
          </p>
        </div>
        <Button asChild>
          <Link href="/atletas/novo">
            <Plus className="size-4" />
            Novo atleta
          </Link>
        </Button>
      </div>

      <Card className="mb-4">
        <CardContent className="flex flex-wrap items-center gap-3 pt-6">
          <div className="relative min-w-[240px] flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por nome..." className="pl-8" />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="size-4" />
            Categoria
          </Button>
          <Button variant="outline" size="sm">
            Posição
          </Button>
          <Button variant="outline" size="sm">
            Professor
          </Button>
        </CardContent>
      </Card>

      {athletes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <Users className="size-10 text-muted-foreground" />
            <div>
              <p className="font-medium">Você ainda não tem atletas</p>
              <p className="text-sm text-muted-foreground">
                Cadastre o primeiro atleta para começar a acompanhar a evolução.
              </p>
            </div>
            <Button asChild>
              <Link href="/atletas/novo">
                <Plus className="size-4" />
                Cadastrar primeiro atleta
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Atleta</th>
                  <th className="px-4 py-3 font-medium">Categoria</th>
                  <th className="px-4 py-3 font-medium">Posição</th>
                  <th className="px-4 py-3 font-medium">Pé</th>
                  <th className="px-4 py-3 text-right font-medium">#</th>
                </tr>
              </thead>
              <tbody>
                {athletes.map((a) => {
                  const age = ageFromDob(a.dob);
                  return (
                    <tr
                      key={a.id}
                      className="border-b transition-colors last:border-0 hover:bg-muted/40"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/atletas/${a.id}` as never}
                          className="flex items-center gap-3 hover:underline"
                        >
                          <Avatar className="size-9">
                            {a.photoUrl ? (
                              <AvatarImage src={a.photoUrl} alt={a.fullName} />
                            ) : null}
                            <AvatarFallback className="bg-brand-soft text-brand-text">
                              {initials(a.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{a.fullName}</p>
                            <p className="text-xs text-muted-foreground">
                              {age} anos
                            </p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        {a.categoryName ? (
                          <Badge variant="soft">{a.categoryName}</Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Sem categoria
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {a.positionMain ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {a.dominantFoot ? FOOT_LABEL[a.dominantFoot] : "-"}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-sm">
                        {a.jerseyNumber ?? "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
