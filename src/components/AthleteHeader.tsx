import Image from "next/image";
import { FELIPE } from "@/data/felipe";
import { Star } from "lucide-react";

export function AthleteHeader({ compact = false }: { compact?: boolean }) {
  return (
    <div className="ui-card p-5 lg:p-6 mb-6">
      <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
        <div className="h-20 w-20 lg:h-24 lg:w-24 rounded-xl bg-inter-red-soft border border-inter-red/15 flex items-center justify-center text-inter-red font-bold text-2xl shrink-0 overflow-hidden">
          {FELIPE.foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={FELIPE.foto} alt={FELIPE.nome} className="w-full h-full object-cover" />
          ) : (
            FELIPE.iniciais
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-semibold leading-tight">
              {FELIPE.nome}
            </h1>
            <span className="ui-badge ui-badge-brand">{FELIPE.categoria}</span>
            <span className="ui-badge">{FELIPE.posicaoPrincipal}</span>
            <span className="ui-badge">{FELIPE.peDominante}</span>
            <span className="ui-badge ui-badge-brand">
              <Star size={12} /> destaque
            </span>
          </div>
          <div className="mt-1.5 mono text-xs text-inter-mute">
            {FELIPE.idade} anos · nasc. {FELIPE.dataNascimento} · matrícula{" "}
            {FELIPE.matricula}
          </div>
          <div className="mt-1 mono text-xs text-inter-mute">
            {FELIPE.professor} · {FELIPE.escola} ({FELIPE.tipoEscola}) ·{" "}
            {FELIPE.cidade}/{FELIPE.uf}
          </div>
        </div>
        {!compact && (
          <div className="hidden lg:flex items-center gap-2 self-stretch">
            <div className="h-12 w-12 rounded-lg bg-inter-bg border border-inter-line flex items-center justify-center p-1">
              <Image
                src="/monograma.png"
                alt="Internacional"
                width={42}
                height={42}
                className="object-contain"
              />
            </div>
            <div className="text-[10px] uppercase tracking-wider text-inter-mute font-semibold leading-tight">
              Credenciada<br />Sport Club<br />Internacional
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
