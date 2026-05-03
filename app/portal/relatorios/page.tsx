import { FileText } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ComingSoon } from "@/components/coming-soon";

export const dynamic = "force-dynamic";

export default function PortalRelatoriosPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-6">
      <PageHeader
        title="Relatórios"
        description="Relatórios trimestrais de evolução dos seus filhos."
      />
      <ComingSoon
        icon={FileText}
        phase="Fase 2"
        title="Relatórios em construção"
        description="Em breve você vai receber automaticamente, todo trimestre, um relatório completo com a evolução do seu filho — direto no e-mail e WhatsApp."
        features={[
          "PDF com foto, evolução técnica/tática/psicológica",
          "Gráfico de evolução física",
          "Comparativo entre trimestres",
          "Tom positivo, formativo, sem comparações com outros atletas",
        ]}
      />
    </div>
  );
}
