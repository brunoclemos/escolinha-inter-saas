import { FileText } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ComingSoon } from "@/components/coming-soon";

export const dynamic = "force-dynamic";

export default function RelatoriosPaisPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <PageHeader
        title="Relatórios para pais"
        description="Geração e disparo automático do PDF mensal/trimestral."
      />
      <ComingSoon
        icon={FileText}
        phase="Fase 2"
        title="Relatórios automáticos no WhatsApp dos pais"
        description="O hero feature da Onze. Todo mês ou trimestre, um PDF profissional do filho cai automaticamente no WhatsApp e e-mail dos responsáveis. Nenhum concorrente brasileiro entrega isso."
        features={[
          "Template visual com capa, foto do atleta e logo da escolinha",
          "Evolução física com gráfico antes/depois",
          "Radar de habilidades técnicas/táticas",
          "Vídeo destaque com QR code",
          "Disparo automático mensal via WhatsApp + e-mail",
          "Tom positivo, formativo, nunca comparativo entre crianças",
        ]}
      />
    </div>
  );
}
