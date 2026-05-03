import { notFound } from "next/navigation";
import { getCurrentTenant } from "@/lib/queries/tenant";
import { getAthleteById } from "@/lib/queries/athletes";
import { AnthropometryForm } from "./anthropometry-form";

export const dynamic = "force-dynamic";

export default async function NovaMedicaoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tenant = await getCurrentTenant();

  const data = await getAthleteById(tenant.id, id);
  if (!data) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Nova medição
        </h1>
        <p className="text-sm text-muted-foreground">
          Antropometria de {data.athlete.fullName}.
        </p>
      </div>

      <AnthropometryForm athleteId={id} athleteName={data.athlete.fullName} />
    </div>
  );
}
