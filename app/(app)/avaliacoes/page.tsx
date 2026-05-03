import { ClipboardCheck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ComingSoon } from "@/components/coming-soon";

export const dynamic = "force-dynamic";

export default function AvaliacoesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <PageHeader
        title="Avaliações"
        description="Avaliação técnica, tática, física e psicológica do atleta."
      />
      <ComingSoon
        icon={ClipboardCheck}
        phase="Fase 1"
        title="Coração do produto — em construção"
        description="O módulo de avaliações é o diferencial da Onze. Vai cobrir as 4 dimensões do atleta com bateria adaptada por categoria, do Sub-7 ao Sub-17."
        features={[
          "Avaliação técnica (1-10) por fundamento — passe, drible, finalização, cabeceio, etc",
          "Avaliação tática — leitura de jogo, posicionamento, movimentação",
          "Avaliação psicológica — concentração, liderança, resiliência",
          "Antropometria com PHV (maturação biológica) e somatotipo",
          "Bateria física adaptada por idade (sprint, salto, agilidade, Yo-Yo, RAST)",
          "Modo campo: tablet/celular com cronômetro integrado, funciona offline",
        ]}
      />
    </div>
  );
}
