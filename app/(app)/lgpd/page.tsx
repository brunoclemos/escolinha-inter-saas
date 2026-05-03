import { ScrollText } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ComingSoon } from "@/components/coming-soon";

export const dynamic = "force-dynamic";

export default function LgpdPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <PageHeader
        title="LGPD"
        description="Termos de consentimento, exportação e exclusão de dados."
      />
      <ComingSoon
        icon={ScrollText}
        phase="Fase 1"
        title="Compliance LGPD para dados de menores"
        description="Como a escolinha lida com dados de crianças, a LGPD é especialmente rigorosa. A Onze já cobre os pontos críticos por padrão — esta página vai centralizar o controle e auditoria."
        features={[
          "Termo de consentimento de imagem assinado por atleta",
          "Direito ao esquecimento: exportar e excluir dados sob demanda",
          "Auditoria de quem acessou qual perfil",
          "Backups diários + criptografia em repouso de dados de saúde",
          "Política de privacidade e DPA pública",
        ]}
      />
    </div>
  );
}
