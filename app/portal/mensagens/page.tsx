import { MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ComingSoon } from "@/components/coming-soon";

export const dynamic = "force-dynamic";

export default function PortalMensagensPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-6">
      <PageHeader
        title="Mensagens"
        description="Canal direto com a coordenação."
      />
      <ComingSoon
        icon={MessageCircle}
        phase="Fase 2"
        title="Mensagens em construção"
        description="Em breve um canal seguro para tirar dúvidas, pedir atestados, autorizar viagens — tudo direto com a coordenação da escolinha."
      />
    </div>
  );
}
