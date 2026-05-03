import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Users, User2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ageFromDob, initials } from "@/lib/utils";
import { getCurrentTenant } from "@/lib/queries/tenant";
import {
  getCategoryById,
  listEligibleCoaches,
} from "@/lib/queries/categories";
import { EditCategoryForm } from "./edit-category-form";

export const dynamic = "force-dynamic";

export default async function TurmaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tenant = await getCurrentTenant();

  const data = await getCategoryById(tenant.id, id);
  if (!data) notFound();

  const { category, athletes } = data;
  const coaches = await listEligibleCoaches(tenant.id);

  return (
    <div className="mx-auto max-w-5xl px-6 py-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/turmas">
            <ArrowLeft className="size-4" />
            Turmas
          </Link>
        </Button>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div
          className="size-14 rounded-lg"
          style={{
            backgroundColor: category.color ?? "hsl(var(--brand))",
          }}
          aria-hidden
        />
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {category.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {category.ageMin === category.ageMax
              ? `${category.ageMin} anos`
              : `${category.ageMin} a ${category.ageMax} anos`}{" "}
            ·{" "}
            {category.headCoachName ? (
              <span>
                Prof.{" "}
                <span className="font-medium text-foreground">
                  {category.headCoachName}
                </span>
              </span>
            ) : (
              <span className="italic">Sem professor</span>
            )}
          </p>
        </div>
        <Badge variant="soft" className="text-sm">
          <Users className="mr-1 size-3.5" />
          {athletes.length}{" "}
          {athletes.length === 1 ? "atleta" : "atletas"}
        </Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="size-4 text-muted-foreground" />
              Atletas da turma
            </CardTitle>
          </CardHeader>
          <CardContent>
            {athletes.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Nenhum atleta nesta turma. Atribua atletas pela tela de
                cadastro.
              </p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {athletes.map((a) => (
                  <Link
                    key={a.id}
                    href={`/atletas/${a.id}`}
                    className="flex items-center gap-3 rounded-md border p-3 transition-colors hover:bg-muted/40"
                  >
                    <Avatar className="size-10">
                      {a.photoUrl ? (
                        <AvatarImage src={a.photoUrl} alt={a.fullName} />
                      ) : null}
                      <AvatarFallback className="bg-brand-soft text-brand-text text-xs">
                        {initials(a.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {a.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {ageFromDob(a.dob)} anos
                        {a.positionMain && ` · ${a.positionMain}`}
                      </p>
                    </div>
                    {a.jerseyNumber && (
                      <span className="font-mono text-sm font-semibold text-muted-foreground">
                        #{a.jerseyNumber}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <User2 className="size-4 text-muted-foreground" />
              Editar turma
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EditCategoryForm category={category} coaches={coaches} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
