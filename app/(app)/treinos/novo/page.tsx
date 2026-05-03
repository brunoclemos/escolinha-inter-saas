import { getCurrentTenant } from "@/lib/queries/tenant";
import { listCategories } from "@/lib/queries/categories";
import { TrainingForm } from "./training-form";

export const dynamic = "force-dynamic";

export default async function NovoTreinoPage() {
  const tenant = await getCurrentTenant();
  const categories = await listCategories(tenant.id);

  return (
    <div className="mx-auto max-w-3xl px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Novo treino</h1>
        <p className="text-sm text-muted-foreground">
          Agende um treino. Depois você marca as presenças na tela do treino.
        </p>
      </div>

      <TrainingForm categories={categories} />
    </div>
  );
}
