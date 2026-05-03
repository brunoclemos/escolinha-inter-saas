import { Calendar } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ComingSoon } from "@/components/coming-soon";

export const dynamic = "force-dynamic";

export default function TreinosPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <PageHeader
        title="Treinos"
        description="Calendário de treinos e jogos com presença."
      />
      <ComingSoon
        icon={Calendar}
        phase="Fase 1"
        title="Módulo de treinos em construção"
        description="Aqui ficará o calendário semanal de treinos, lista de presença lançada pelo professor no campo e estatísticas dos jogos amistosos e oficiais."
        features={[
          "Calendário semanal por turma com horário e local",
          "Lista de presença em tablet/celular (offline-first)",
          "Estatísticas por jogo: minutos, gols, assistências, nota",
          "Histórico de presença por atleta com alerta de faltas",
        ]}
      />
    </div>
  );
}
