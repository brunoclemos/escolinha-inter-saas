import { getCurrentTenant } from "@/lib/queries/tenant";
import { listCategories } from "@/lib/queries/categories";
import { AthleteForm } from "./athlete-form";

export const dynamic = "force-dynamic";

export default async function NovoAtletaPage() {
  const tenant = await getCurrentTenant();
  const categories = await listCategories(tenant.id);

  return (
    <div className="mx-auto max-w-3xl px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Novo atleta</h1>
        <p className="text-sm text-muted-foreground">
          Cadastro inicial. Você completa o restante depois.
        </p>
      </div>

      <AthleteForm categories={categories} />
    </div>
  );
}
