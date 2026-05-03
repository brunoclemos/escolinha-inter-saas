import { Video } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ComingSoon } from "@/components/coming-soon";

export const dynamic = "force-dynamic";

export default function VideosPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <PageHeader
        title="Vídeos"
        description="Biblioteca de vídeos de treinos e jogos por atleta."
      />
      <ComingSoon
        icon={Video}
        phase="Fase 2"
        title="Vídeos individuais do filho"
        description="Upload comprimido no navegador (ffmpeg-wasm), armazenamento Cloudflare R2 e player white-label. Cada vídeo pode ser tagueado por atleta — o pai recebe os melhores momentos do filho no WhatsApp."
        features={[
          "Compressão automática no celular antes do upload",
          "Tagueamento de momentos por atleta + tipo de ação",
          "Playlist 'os destaques do João no trimestre'",
          "Player white-label com a marca da escolinha",
          "Cota por plano: Starter 5GB / Pro 20GB / Premium 100GB",
        ]}
      />
    </div>
  );
}
