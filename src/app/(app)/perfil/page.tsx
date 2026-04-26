import { AthleteHeader } from "@/components/AthleteHeader";
import { FELIPE } from "@/data/felipe";
import { Check } from "lucide-react";

export default function PerfilPage() {
  return (
    <div className="space-y-6">
      <AthleteHeader />

      <div className="grid lg:grid-cols-2 gap-5">
        <Section title="Identificação">
          <KV k="Nome completo" v={FELIPE.nome} />
          <KV k="Matrícula" v={FELIPE.matricula} mono />
          <KV k="Data de nascimento" v={FELIPE.dataNascimento} mono />
          <KV k="Idade" v={`${FELIPE.idade} anos`} />
          <KV k="Sexo" v={FELIPE.sexo} />
          <KV k="CPF" v={FELIPE.cpf} mono />
          <KV k="RG" v={FELIPE.rg} mono />
          <KV k="Última alteração" v={FELIPE.ultimaAlteracao} mono />
        </Section>

        <Section title="Contato">
          <KV k="Celular" v={FELIPE.celular} mono />
          <KV k="Email" v={FELIPE.email || "—"} />
        </Section>

        <Section title="Endereço">
          <KV k="Logradouro" v={FELIPE.endereco} />
          <KV k="Bairro" v={FELIPE.bairro} />
          <KV k="Cidade / UF" v={`${FELIPE.cidade} / ${FELIPE.uf}`} />
          <KV k="CEP" v={FELIPE.cep} mono />
          <KV k="Complemento" v={FELIPE.complemento} />
        </Section>

        <Section title="Escola regular">
          <KV k="Instituição" v={FELIPE.escola} />
          <KV k="Tipo" v={FELIPE.tipoEscola} />
        </Section>

        <Section title="Escolinha do Inter">
          <KV k="Categoria" v={FELIPE.categoria} />
          <KV k="Turma" v={FELIPE.turma} />
          <KV k="Professor responsável" v={FELIPE.professor} />
          <KV
            k="Data de entrada"
            v={new Date(FELIPE.desde).toLocaleDateString("pt-BR")}
            mono
          />
          <KV k="Como conheceu" v={FELIPE.comoConheceu} />
        </Section>

        <Section title="Perfil esportivo">
          <KV k="Time favorito" v={FELIPE.timeFavorito} />
          <KV
            k="Jogador atual preferido"
            v={FELIPE.jogadorAtualPreferido}
          />
          <KV k="Ídolo" v={FELIPE.idolo} />
          <KV k="Posição principal" v={FELIPE.posicaoPrincipal} />
          <KV
            k="Posições secundárias"
            v={FELIPE.posicoesSecundarias.join(", ")}
          />
          <KV k="Pé dominante" v={FELIPE.peDominante} />
          <KV k="Nível técnico" v={FELIPE.nivelTecnico} />
        </Section>

        <Section title="Antropometria atual">
          <KV k="Altura" v={`${FELIPE.altura} cm`} mono />
          <KV k="Peso" v={`${FELIPE.peso} kg`} mono />
          <KV
            k="IMC"
            v={(FELIPE.peso / (FELIPE.altura / 100) ** 2).toFixed(1)}
            mono
          />
          <KV k="% gordura corporal" v={`${FELIPE.bf}%`} mono />
          <KV
            k="PHV (anos do pico)"
            v={`${FELIPE.phv > 0 ? "+" : ""}${FELIPE.phv} anos`}
            mono
          />
        </Section>

        <Section title="Atributos técnicos">
          <div className="space-y-3">
            {FELIPE.atributos.map((a) => (
              <div key={a.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{a.label}</span>
                  <Plus level={a.level} />
                </div>
                {a.note && (
                  <div className="text-[11px] text-inter-mute">{a.note}</div>
                )}
              </div>
            ))}
          </div>
        </Section>

        <Section title="Consentimentos LGPD" full>
          <div className="grid sm:grid-cols-2 gap-2">
            <Consent
              label="Uso de imagem (interno e relatórios)"
              ok={FELIPE.consentimentos.usoImagem}
            />
            <Consent
              label="Publicação em redes sociais oficiais"
              ok={FELIPE.consentimentos.redesSociais}
            />
            <Consent
              label="Compartilhamento c/ fisio parceira"
              ok={FELIPE.consentimentos.saudeFisio}
            />
            <Consent
              label="Exportação de dossiê (Inter)"
              ok={FELIPE.consentimentos.dossieClubes}
            />
            <Consent
              label="Envio de relatórios via WhatsApp"
              ok={FELIPE.consentimentos.relatoriosWhatsApp}
            />
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  full,
  children,
}: {
  title: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={"ui-card " + (full ? "lg:col-span-2" : "")}>
      <div className="ui-card-head">
        <div className="font-semibold text-sm">{title}</div>
      </div>
      <div className="ui-card-body">
        <div className="space-y-2.5 text-sm">{children}</div>
      </div>
    </div>
  );
}

function KV({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="grid grid-cols-[140px_1fr] sm:grid-cols-[160px_1fr] gap-3 items-start">
      <span className="text-[11px] uppercase tracking-wider text-inter-mute pt-0.5">
        {k}
      </span>
      <span
        className={
          "text-inter-graphite font-medium " + (mono ? "mono text-[13px]" : "")
        }
      >
        {v}
      </span>
    </div>
  );
}

function Plus({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={
            "h-1.5 w-3 rounded-full " +
            (i <= level ? "bg-inter-red" : "bg-inter-line")
          }
        />
      ))}
      <span className="ml-1.5 text-[10px] mono text-inter-mute font-semibold">
        {"+".repeat(level)}
      </span>
    </span>
  );
}

function Consent({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-inter-bg border border-inter-line">
      <span
        className={
          "h-5 w-5 rounded-full flex items-center justify-center text-white shrink-0 " +
          (ok ? "bg-ok" : "bg-inter-line")
        }
      >
        {ok ? <Check size={12} strokeWidth={3} /> : null}
      </span>
      <span className="text-xs">{label}</span>
    </div>
  );
}
