import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, Filter } from "lucide-react";
import { ageFromDob, categoryFromAge, initials } from "@/lib/utils";
import { SEED_ATHLETES } from "@/lib/db/seed-data";

export default function AtletasPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Atletas</h1>
          <p className="text-sm text-muted-foreground">
            {SEED_ATHLETES.length} atletas ativos.
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

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 font-medium">Atleta</th>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3 font-medium">Posição</th>
                <th className="px-4 py-3 font-medium">Pé</th>
                <th className="px-4 py-3 font-medium text-right">#</th>
              </tr>
            </thead>
            <tbody>
              {SEED_ATHLETES.map((athlete) => {
                const age = ageFromDob(athlete.dob);
                const category = categoryFromAge(age);
                return (
                  <tr
                    key={athlete.fullName}
                    className="border-b transition-colors last:border-0 hover:bg-muted/40"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href="/atletas/1"
                        className="flex items-center gap-3 hover:underline"
                      >
                        <Avatar className="size-9">
                          <AvatarFallback className="bg-brand-soft text-brand-text">
                            {initials(athlete.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{athlete.fullName}</p>
                          <p className="text-xs text-muted-foreground">
                            {age} anos
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="soft">{category}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {athlete.positionMain}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {athlete.dominantFoot === "right"
                        ? "Direito"
                        : athlete.dominantFoot === "left"
                          ? "Esquerdo"
                          : "Ambidestro"}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm">
                      {athlete.jerseyNumber}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
