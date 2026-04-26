"use client";

import Image from "next/image";
import { Printer } from "lucide-react";
import { FELIPE, AssessmentScore } from "@/data/felipe";
import { RadarCard } from "@/components/RadarCard";
import { EvolutionChart } from "@/components/EvolutionChart";

export default function RelatorioPage() {
  const consolidated = [
    { fundamento: "Técnica", nota: avg(FELIPE.avaliacaoTecnica) },
    { fundamento: "Tática", nota: avg(FELIPE.avaliacaoTatica) },
    { fundamento: "Física", nota: avg(FELIPE.avaliacaoFisica) },
    { fundamento: "Psicossocial", nota: avg(FELIPE.avaliacaoPsicologica) },
  ];

  const last = FELIPE.evolucao[FELIPE.evolucao.length - 1]!;
  const first = FELIPE.evolucao[0]!;

  return (
    <div className="space-y-6">
      {/* Toolbar — não imprime */}
      <div className="no-print flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Relatório trimestral</h1>
          <p className="text-sm text-inter-mute">
            Período: {first.label} — {last.label} · pronto para imprimir ou
            salvar em PDF.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="ui-btn ui-btn-primary"
        >
          <Printer size={16} />
          Imprimir / Salvar PDF
        </button>
      </div>

      {/* Folha A4 */}
      <article className="bg-white border border-inter-line shadow-card mx-auto print:shadow-none print:border-0 max-w-[800px] print:max-w-none print:mx-0">
        {/* CABEÇALHO */}
        <header className="flex items-center gap-4 p-6 lg:p-10 border-b-2 border-inter-red">
          <div className="h-16 w-16 lg:h-20 lg:w-20 rounded-lg bg-inter-red p-1.5 shrink-0">
            <Image
              src="/logo-escola.png"
              alt="Escola do Inter"
              width={80}
              height={80}
              className="object-contain w-full h-full"
            />
          </div>
          <div className="flex-1">
            <div className="text-[11px] uppercase tracking-widest text-inter-mute font-semibold">
              Relatório trimestral de evolução
            </div>
            <h1 className="text-xl lg:text-2xl font-semibold mt-0.5">
              Escola do Inter · Rio Grande/RS
            </h1>
            <div className="text-xs text-inter-mute mt-1 mono">
              Credenciada Sport Club Internacional · período: {first.label}—
              {last.label}
            </div>
          </div>
          <div className="hidden sm:block h-16 w-16">
            <Image
              src="/monograma.png"
              alt="Internacional"
              width={64}
              height={64}
              className="object-contain w-full h-full"
            />
          </div>
        </header>

        {/* PÁGINA 1 — Resumo executivo */}
        <section className="p-6 lg:p-10 print-page">
          <SectionTitle n={1} title="Resumo executivo" />
          <div className="grid sm:grid-cols-[120px_1fr] gap-4 lg:gap-6 mb-6">
            <div className="h-28 w-28 rounded-lg bg-inter-red-soft border border-inter-red/15 flex items-center justify-center text-inter-red font-bold text-3xl shrink-0">
              {FELIPE.iniciais}
            </div>
            <div>
              <div className="text-2xl font-semibold leading-tight">
                {FELIPE.nome}
              </div>
              <div className="mono text-xs text-inter-mute mt-1">
                {FELIPE.idade} anos · {FELIPE.categoria} · {FELIPE.posicaoPrincipal} ·{" "}
                {FELIPE.peDominante}
              </div>
              <div className="mono text-xs text-inter-mute mt-0.5">
                Matrícula {FELIPE.matricula} · {FELIPE.professor} ·{" "}
                {FELIPE.turma}
              </div>
              <p className="text-sm leading-relaxed mt-3 text-inter-graphite">
                Trimestre marcado por <strong>evolução física consistente</strong>
                {" "}(altura +{(last.altura! - first.altura!).toFixed(0)} cm,
                sprint 20m −{(first.sprint20! - last.sprint20!).toFixed(2)}s) e
                bom desenvolvimento técnico no 1×1. Destaque para
                competitividade e disciplina nos treinos. Próximo ciclo deve
                focar em <strong>passe longo</strong>, <strong>cobertura defensiva</strong> e
                ganho de <strong>potência muscular</strong>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <SummaryStat label="Frequência" value={FELIPE.frequencia30d + "%"} sub="últ. 30 dias" />
            <SummaryStat label="Altura atual" value={FELIPE.altura + " cm"} sub={`+${(last.altura! - first.altura!).toFixed(0)} cm no período`} />
            <SummaryStat label="Sprint 20m" value={FELIPE.sprint20m + " s"} sub="recorde pessoal" />
            <SummaryStat label="Média geral" value={avgAll().toFixed(1)} sub="0–10 · 4 dimensões" />
          </div>
        </section>

        {/* PÁGINA 2 — Evolução física */}
        <section className="p-6 lg:p-10 border-t border-inter-line print-page">
          <SectionTitle n={2} title="Evolução física" />
          <div className="grid sm:grid-cols-2 gap-5">
            <SmallChart>
              <div className="text-xs uppercase tracking-wider text-inter-mute font-semibold mb-2">
                Altura (cm)
              </div>
              <EvolutionChart
                data={FELIPE.evolucao}
                metric={{
                  key: "altura",
                  label: "Altura",
                  unit: "cm",
                  color: "#C8102E",
                }}
              />
            </SmallChart>
            <SmallChart>
              <div className="text-xs uppercase tracking-wider text-inter-mute font-semibold mb-2">
                Sprint 20m (s · menor é melhor)
              </div>
              <EvolutionChart
                data={FELIPE.evolucao}
                metric={{
                  key: "sprint20",
                  label: "Sprint 20m",
                  unit: "s",
                  color: "#1B5A37",
                  inverted: true,
                }}
              />
            </SmallChart>
            <SmallChart>
              <div className="text-xs uppercase tracking-wider text-inter-mute font-semibold mb-2">
                Salto vertical (cm)
              </div>
              <EvolutionChart
                data={FELIPE.evolucao}
                metric={{
                  key: "cmj",
                  label: "CMJ",
                  unit: "cm",
                  color: "#7a4d0a",
                }}
              />
            </SmallChart>
            <SmallChart>
              <div className="text-xs uppercase tracking-wider text-inter-mute font-semibold mb-2">
                % gordura corporal
              </div>
              <EvolutionChart
                data={FELIPE.evolucao}
                metric={{
                  key: "bf",
                  label: "% gordura",
                  unit: "%",
                  color: "#4c2f7a",
                }}
              />
            </SmallChart>
          </div>
        </section>

        {/* PÁGINA 3 — Habilidades */}
        <section className="p-6 lg:p-10 border-t border-inter-line print-page">
          <SectionTitle n={3} title="Habilidades · radar consolidado" />
          <div className="grid sm:grid-cols-[1fr_240px] gap-5 items-center">
            <RadarCard data={consolidated} />
            <div className="space-y-3">
              {consolidated.map((d) => (
                <div key={d.fundamento}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium">{d.fundamento}</span>
                    <span className="mono font-semibold">
                      {d.nota.toFixed(1)}
                    </span>
                  </div>
                  <div className="ui-bar">
                    <i style={{ width: (d.nota / 10) * 100 + "%" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-5">
            <DimensionList
              title="Pontos fortes"
              items={topN(
                [
                  ...FELIPE.avaliacaoTecnica,
                  ...FELIPE.avaliacaoFisica,
                  ...FELIPE.avaliacaoTatica,
                  ...FELIPE.avaliacaoPsicologica,
                ],
                5,
                true
              )}
              color="#1B5A37"
            />
            <DimensionList
              title="Próximos focos de desenvolvimento"
              items={topN(
                [
                  ...FELIPE.avaliacaoTecnica,
                  ...FELIPE.avaliacaoFisica,
                  ...FELIPE.avaliacaoTatica,
                  ...FELIPE.avaliacaoPsicologica,
                ],
                5,
                false
              )}
              color="#7a4d0a"
            />
          </div>
        </section>

        {/* PÁGINA 4 — Metas */}
        <section className="p-6 lg:p-10 border-t border-inter-line">
          <SectionTitle n={4} title="Metas para o próximo trimestre" />
          <ul className="space-y-2 text-sm">
            {[
              "Reduzir o sprint 20m para abaixo de 3,55s (atual: 3,62s)",
              "Aumentar acertos de passe longo de 5,5 → 7,0",
              "Melhorar cobertura defensiva e transição (5,5 → 6,5)",
              "Ganhar 2 cm de salto vertical (CMJ: 24,6 → 26,6 cm)",
              "Manter frequência ≥ 90% nos treinos",
            ].map((t, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 px-3 py-2 rounded-md bg-inter-bg border border-inter-line"
              >
                <span className="mt-0.5 h-5 w-5 rounded-full bg-inter-red text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 p-4 rounded-md bg-inter-red-soft border border-inter-red/15">
            <div className="text-xs uppercase tracking-wider text-inter-red font-semibold mb-1">
              Mensagem do professor
            </div>
            <p className="text-sm text-inter-graphite leading-relaxed">
              O Felipe vem demonstrando muita vontade de aprender e se destaca
              pela competitividade saudável dentro do grupo. O fato de ser
              ambidestro é uma vantagem que vamos explorar mais nos próximos
              meses, especialmente na finalização. Sigamos assim. — {FELIPE.professor}
            </p>
          </div>

          {/* Rodapé */}
          <div className="mt-8 pt-4 border-t border-inter-line flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[11px] text-inter-mute mono">
            <span>
              Relatório gerado em{" "}
              {new Date().toLocaleDateString("pt-BR")} · prototipo v0.1
            </span>
            <span>Escola do Inter · Rio Grande/RS · LGPD-compliant</span>
          </div>
        </section>
      </article>
    </div>
  );
}

function avg(arr: AssessmentScore[]) {
  return arr.reduce((s, a) => s + a.nota, 0) / arr.length;
}

function avgAll() {
  return (
    avg([
      ...FELIPE.avaliacaoTecnica,
      ...FELIPE.avaliacaoFisica,
      ...FELIPE.avaliacaoTatica,
      ...FELIPE.avaliacaoPsicologica,
    ])
  );
}

function topN(arr: AssessmentScore[], n: number, top: boolean) {
  const sorted = [...arr].sort((a, b) =>
    top ? b.nota - a.nota : a.nota - b.nota
  );
  return sorted.slice(0, n);
}

function SectionTitle({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="h-7 w-7 rounded bg-inter-red text-white text-xs font-bold flex items-center justify-center mono">
        {n}
      </span>
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
  );
}

function SummaryStat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="border border-inter-line rounded-md p-3">
      <div className="text-[10px] uppercase tracking-wider text-inter-mute font-semibold">
        {label}
      </div>
      <div className="mt-1 text-xl font-semibold mono">{value}</div>
      <div className="text-[10px] text-inter-mute mt-0.5">{sub}</div>
    </div>
  );
}

function SmallChart({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-inter-line rounded-md p-4 bg-white">
      {children}
    </div>
  );
}

function DimensionList({
  title,
  items,
  color,
}: {
  title: string;
  items: AssessmentScore[];
  color: string;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color }}>
        {title}
      </div>
      <ul className="space-y-1.5">
        {items.map((it) => (
          <li
            key={it.fundamento}
            className="flex items-center justify-between text-sm border-b border-inter-line py-1.5"
          >
            <span>{it.fundamento}</span>
            <span className="mono font-semibold text-xs">
              {it.nota.toFixed(1)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
