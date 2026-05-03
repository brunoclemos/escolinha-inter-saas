import { notFound } from "next/navigation";
import { ageFromDob } from "@/lib/utils";
import { getCurrentTenant } from "@/lib/queries/tenant";
import { getAthleteById } from "@/lib/queries/athletes";
import { PhysicalForm } from "./physical-form";

export const dynamic = "force-dynamic";

export default async function NovoTesteFisicoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tenant = await getCurrentTenant();

  const data = await getAthleteById(tenant.id, id);
  if (!data) notFound();

  const age = ageFromDob(data.athlete.dob);

  return (
    <div className="mx-auto max-w-3xl px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Novo teste físico
        </h1>
        <p className="text-sm text-muted-foreground">
          Bateria adaptada à idade do atleta. Use o cronômetro do celular pra
          marcar tempo no campo.
        </p>
      </div>

      <PhysicalForm
        athleteId={id}
        athleteName={data.athlete.fullName}
        athleteAge={age}
      />
    </div>
  );
}
