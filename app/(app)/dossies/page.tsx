import { Award } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ComingSoon } from "@/components/coming-soon";

export const dynamic = "force-dynamic";

export default function DossiesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <PageHeader
        title="Dossiês para clube"
        description="Exportação completa do atleta para o departamento de base."
      />
      <ComingSoon
        icon={Award}
        phase="Fase 3"
        title="Dossiê técnico para o clube parceiro"
        description="Quando um atleta promissor surge, o coordenador exporta o dossiê completo em PDF e link web protegido. Inspirado em Wyscout/InStat, adaptado pra realidade da escolinha."
        features={[
          "PDF denso com foto, dados e histórico",
          "Evolução antropométrica e física com gráficos",
          "Resultados de testes vs. referência por idade",
          "3-5 vídeos destaque embutidos",
          "Link web com token expirável e QR code",
          "Parecer técnico final do coordenador",
        ]}
      />
    </div>
  );
}
