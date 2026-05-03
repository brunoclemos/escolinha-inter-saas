import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Edit, Phone, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ageFromDob, formatDate, initials } from "@/lib/utils";
import { getCurrentTenant } from "@/lib/queries/tenant";
import { getAthleteById } from "@/lib/queries/athletes";

export const dynamic = "force-dynamic";

const FOOT: Record<string, string> = {
  right: "Direito",
  left: "Esquerdo",
  both: "Ambidestro",
};

const RELATIONSHIP: Record<string, string> = {
  father: "Pai",
  mother: "Mãe",
  stepfather: "Padrasto",
  stepmother: "Madrasta",
  tutor: "Tutor(a)",
  grandfather: "Avô",
  grandmother: "Avó",
  uncle: "Tio",
  aunt: "Tia",
  sibling: "Irmão/Irmã",
  other: "Outro",
};

export default async function AthletePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tenant = await getCurrentTenant();
  const data = await getAthleteById(tenant.id, id);

  if (!data) notFound();
  const { athlete, categories, guardians } = data;
  const age = ageFromDob(athlete.dob);

  return (
    <div className="mx-auto max-w-5xl px-6 py-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/atletas">
            <ArrowLeft className="size-4" />
            Atletas
          </Link>
        </Button>
        <Button variant="outline" size="sm" disabled title="Em breve">
          <Edit className="size-4" />
          Editar
        </Button>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Avatar className="size-20">
          {athlete.photoUrl ? (
            <AvatarImage src={athlete.photoUrl} alt={athlete.fullName} />
          ) : null}
          <AvatarFallback className="bg-brand-soft text-brand-text text-xl">
            {initials(athlete.fullName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {athlete.fullName}
          </h1>
          {athlete.nickname && (
            <p className="text-sm text-muted-foreground">
              "{athlete.nickname}"
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">{age} anos</span>
            <span className="text-sm text-muted-foreground">·</span>
            <span className="text-sm text-muted-foreground">
              {formatDate(athlete.dob)}
            </span>
            {categories.length > 0 && (
              <>
                <span className="text-sm text-muted-foreground">·</span>
                {categories.map((c) => (
                  <Badge key={c.id} variant="soft">
                    {c.name}
                  </Badge>
                ))}
              </>
            )}
          </div>
        </div>
        {athlete.jerseyNumber && (
          <div className="rounded-lg bg-brand px-4 py-2 text-center text-brand-fg">
            <p className="font-mono text-3xl font-semibold leading-none">
              {athlete.jerseyNumber}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-wider opacity-90">
              Camisa
            </p>
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Visão geral</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Field label="Posição">{athlete.positionMain ?? "-"}</Field>
              <Field label="Pé dominante">
                {athlete.dominantFoot ? FOOT[athlete.dominantFoot] : "-"}
              </Field>
              <Field label="Status">
                <Badge variant={athlete.status === "active" ? "ok" : "outline"}>
                  {athlete.status === "active" ? "Ativo" : athlete.status}
                </Badge>
              </Field>
              <Field label="Altura">
                {athlete.heightCm ? `${athlete.heightCm} cm` : "-"}
              </Field>
              <Field label="Peso">
                {athlete.weightKg ? `${athlete.weightKg} kg` : "-"}
              </Field>
              <Field label="Tipo sanguíneo">{athlete.bloodType ?? "-"}</Field>
            </div>

            <Separator />

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Escola
              </p>
              <p className="text-sm">
                {athlete.schoolName ?? (
                  <span className="text-muted-foreground">Não informada</span>
                )}
                {athlete.schoolGrade && ` · ${athlete.schoolGrade}`}
                {athlete.schoolShift && ` · ${athlete.schoolShift}`}
              </p>
            </div>

            {athlete.dream && (
              <>
                <Separator />
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Sonho
                  </p>
                  <p className="text-sm italic">"{athlete.dream}"</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Responsáveis ({guardians.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {guardians.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum responsável cadastrado.
              </p>
            ) : (
              guardians.map((g) => (
                <div key={g.id} className="rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{g.fullName}</p>
                    {g.isPrimary && <Badge variant="soft">Principal</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {RELATIONSHIP[g.relationship]}
                  </p>
                  {g.phone && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Phone className="size-3" />
                      {g.phone}
                    </p>
                  )}
                  {g.email && (
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Mail className="size-3" />
                      {g.email}
                    </p>
                  )}
                </div>
              ))
            )}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              disabled
              title="Em breve"
            >
              Adicionar responsável
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="mt-1 text-sm">{children}</div>
    </div>
  );
}
