import { Plus, Shield, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { getCurrentTenant } from "@/lib/queries/tenant";
import { listCategoriesWithStats } from "@/lib/queries/categories";

export const dynamic = "force-dynamic";

export default async function TurmasPage() {
  const tenant = await getCurrentTenant();
  const categories = await listCategoriesWithStats(tenant.id);

  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <PageHeader
        title="Turmas"
        description={`${categories.length} ${categories.length === 1 ? "categoria" : "categorias"} cadastradas.`}
        actions={
          <Button disabled title="Em breve">
            <Plus className="size-4" />
            Nova turma
          </Button>
        }
      />

      {categories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <Shield className="size-10 text-muted-foreground" />
            <div>
              <p className="font-medium">Nenhuma turma cadastrada.</p>
              <p className="text-sm text-muted-foreground">
                Cadastre categorias por faixa etária (Sub-7, Sub-9, etc).
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Card key={cat.id} className="overflow-hidden">
              <div
                className="h-1.5 w-full"
                style={{ backgroundColor: cat.color ?? "hsl(var(--brand))" }}
              />
              <CardContent className="space-y-3 pt-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {cat.ageMin === cat.ageMax
                        ? `${cat.ageMin} anos`
                        : `${cat.ageMin} a ${cat.ageMax} anos`}
                    </p>
                  </div>
                  <Badge variant="soft">
                    <Users className="mr-1 size-3" />
                    {cat.athleteCount}
                  </Badge>
                </div>

                <div className="border-t pt-3 text-xs text-muted-foreground">
                  <span className="font-medium uppercase tracking-wider">
                    Professor:{" "}
                  </span>
                  {cat.coachName ?? (
                    <span className="italic">Não atribuído</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
