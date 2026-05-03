import { getCurrentTenant } from "@/lib/queries/tenant";
import { listCategories } from "@/lib/queries/categories";
import { MatchForm } from "./match-form";

export const dynamic = "force-dynamic";

export default async function NovoJogoPage() {
  const tenant = await getCurrentTenant();
  const categories = await listCategories(tenant.id);

  return (
    <div className="mx-auto max-w-3xl px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Novo jogo</h1>
        <p className="text-sm text-muted-foreground">
          Cadastre amistoso, oficial ou treino-jogo. Estatísticas individuais
          são lançadas na tela do jogo após salvar.
        </p>
      </div>
      <MatchForm categories={categories} />
    </div>
  );
}
