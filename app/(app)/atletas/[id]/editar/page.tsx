import { notFound } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { athleteCategories } from "@/lib/db/schema";
import { getCurrentTenant } from "@/lib/queries/tenant";
import { getAthleteById } from "@/lib/queries/athletes";
import { listCategories } from "@/lib/queries/categories";
import { EditAthleteForm } from "./edit-athlete-form";

export const dynamic = "force-dynamic";

export default async function EditarAtletaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tenant = await getCurrentTenant();

  const data = await getAthleteById(tenant.id, id);
  if (!data) notFound();

  const categories = await listCategories(tenant.id);

  // Pega a categoria atual (1ª)
  const [link] = await db
    .select({ categoryId: athleteCategories.categoryId })
    .from(athleteCategories)
    .where(eq(athleteCategories.athleteId, id))
    .limit(1);

  return (
    <div className="mx-auto max-w-3xl px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Editar atleta
        </h1>
        <p className="text-sm text-muted-foreground">
          Atualize os dados do atleta.
        </p>
      </div>

      <EditAthleteForm
        athlete={{
          id: data.athlete.id,
          fullName: data.athlete.fullName,
          nickname: data.athlete.nickname,
          dob: data.athlete.dob,
          positionMain: data.athlete.positionMain,
          dominantFoot: data.athlete.dominantFoot,
          jerseyNumber: data.athlete.jerseyNumber,
          categoryId: link?.categoryId ?? null,
        }}
        categories={categories}
      />
    </div>
  );
}
