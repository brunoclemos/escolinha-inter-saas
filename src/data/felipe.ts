/**
 * Dados do Felipe De David Fonseca — atleta da Escola do Inter Rio Grande/RS.
 * Este é o atleta único do prototipo. Todos os dados pessoais foram fornecidos
 * pelo cliente; valores de séries históricas (avaliações anteriores) são
 * estimativas plausíveis para demonstração visual da evolução.
 */

export type AthleteAttribute = {
  label: string;
  level: 1 | 2 | 3; // ++, ++, +++
  note?: string;
};

export type AssessmentScore = {
  fundamento: string;
  nota: number; // 0–10
};

export type EvolutionPoint = {
  date: string; // ISO yyyy-mm-dd
  label: string; // "Out/25"
  altura?: number;
  peso?: number;
  sprint20?: number;
  cmj?: number;
  bf?: number;
};

export const FELIPE = {
  // Identificação
  nome: "Felipe De David Fonseca",
  apelido: "Felipe",
  iniciais: "FD",
  matricula: "171273",
  cpf: "050.249.390-93",
  rg: "—",
  dataNascimento: "20/01/2016",
  idade: 10,
  sexo: "Masculino",
  ultimaAlteracao: "01/04/2026 14:07",

  // Contato
  celular: "(53) 9 9969-6774",
  email: "—",

  // Endereço
  endereco: "Ana Pernigotti, nº 1061",
  bairro: "Cassino",
  cidade: "Rio Grande",
  uf: "RS",
  cep: "96207-010",
  complemento: "Rua H88 Bolaxa",

  // Escolar
  escola: "Bom Jesus",
  tipoEscola: "Particular",

  // Mídia / origem
  comoConheceu: "Mídias sociais",

  // Categoria (Sub-11 — turma de 10 anos completos vão para Sub-11)
  categoria: "Sub-11",
  professor: "Prof. Camila Reis",
  turma: "Sub-11 · ter/qui · Campo B",
  desde: "2024-08-15",

  // Frequência
  frequencia30d: 91,
  frequenciaAno: 88,

  // Time / preferências
  timeFavorito: "Internacional",
  jogadorAtualPreferido: "D'Alessandro",
  idolo: "Cristiano Ronaldo",

  // Físico
  altura: 149, // cm
  peso: 40, // kg
  peDominante: "Ambidestro",
  posicaoPrincipal: "Atacante",
  posicoesSecundarias: ["Ponta direita", "Meia ofensivo"],
  nivelTecnico: "Intermediário II",

  // Atributos (dados do brief: Velocidade +++, Drible ++, Cabeceio ++, Passe ++)
  atributos: [
    { label: "Velocidade", level: 3, note: "Acelera bem em curta distância" },
    { label: "Drible", level: 2, note: "Bom no 1x1, evolui no 1x2" },
    { label: "Cabeceio", level: 2, note: "Bom timing, falta potência" },
    { label: "Passe", level: 2, note: "Curto preciso, longo em desenvolvimento" },
    { label: "Finalização", level: 2, note: "Acerto bom dentro da área" },
    { label: "Posicionamento", level: 2, note: "Lê bem o último passe" },
  ] as AthleteAttribute[],

  // Avaliação técnica/tática/psicológica (notas 1-10)
  avaliacaoTecnica: [
    { fundamento: "Condução de bola", nota: 7.5 },
    { fundamento: "Passe curto", nota: 7.0 },
    { fundamento: "Passe longo", nota: 5.5 },
    { fundamento: "Recepção / domínio", nota: 7.0 },
    { fundamento: "Finalização (pé dom.)", nota: 7.5 },
    { fundamento: "Finalização (pé não-dom.)", nota: 6.5 },
    { fundamento: "Cabeceio", nota: 6.0 },
    { fundamento: "Drible / 1x1", nota: 7.5 },
    { fundamento: "Desarme / marcação", nota: 5.0 },
    { fundamento: "Bola parada", nota: 5.5 },
  ] as AssessmentScore[],

  avaliacaoTatica: [
    { fundamento: "Leitura de jogo", nota: 7.0 },
    { fundamento: "Posicionamento", nota: 6.5 },
    { fundamento: "Movimentação sem bola", nota: 7.5 },
    { fundamento: "Cobertura / transições", nota: 5.5 },
    { fundamento: "Compreensão da função", nota: 6.5 },
  ] as AssessmentScore[],

  avaliacaoFisica: [
    { fundamento: "Velocidade (sprint 20m)", nota: 8.0 },
    { fundamento: "Aceleração (sprint 10m)", nota: 8.5 },
    { fundamento: "Agilidade (Illinois)", nota: 7.0 },
    { fundamento: "Potência (CMJ)", nota: 6.5 },
    { fundamento: "Resistência (Yo-Yo)", nota: 6.0 },
    { fundamento: "Flexibilidade", nota: 6.5 },
  ] as AssessmentScore[],

  avaliacaoPsicologica: [
    { fundamento: "Concentração / foco", nota: 7.0 },
    { fundamento: "Liderança", nota: 6.0 },
    { fundamento: "Competitividade", nota: 8.5 },
    { fundamento: "Resiliência (reação ao erro)", nota: 7.5 },
    { fundamento: "Disciplina", nota: 8.0 },
    { fundamento: "Trabalho em equipe", nota: 7.5 },
  ] as AssessmentScore[],

  // Métricas físicas atuais
  sprint10m: 2.18, // s
  sprint20m: 3.62, // s
  cmj: 24.6, // cm
  yoYoIR1: 880, // m
  bf: 13.8, // % gordura corporal
  phv: -1.6, // anos do pico de crescimento (negativo = ainda vai crescer)

  // Linha do tempo / evolução (6 pontos trimestrais)
  evolucao: [
    { date: "2024-10-01", label: "Out/24", altura: 142, peso: 35, sprint20: 3.95, cmj: 20.1, bf: 15.2 },
    { date: "2025-01-15", label: "Jan/25", altura: 144, peso: 36.5, sprint20: 3.86, cmj: 21.0, bf: 14.8 },
    { date: "2025-04-12", label: "Abr/25", altura: 145.5, peso: 37.4, sprint20: 3.80, cmj: 22.0, bf: 14.5 },
    { date: "2025-07-20", label: "Jul/25", altura: 146.8, peso: 38.2, sprint20: 3.74, cmj: 22.8, bf: 14.2 },
    { date: "2025-10-18", label: "Out/25", altura: 148, peso: 39.1, sprint20: 3.69, cmj: 23.6, bf: 14.0 },
    { date: "2026-04-08", label: "Abr/26", altura: 149, peso: 40, sprint20: 3.62, cmj: 24.6, bf: 13.8 },
  ] as EvolutionPoint[],

  // Linha do tempo de eventos
  timeline: [
    { when: "há 18 dias", title: "Avaliação técnica", detail: "Nota média 6,8 · destaque em finalização", tag: "destaque" },
    { when: "há 28 dias", title: "Antropometria", detail: "+1,0 cm · BF 14,0 → 13,8%", tag: "info" },
    { when: "há 41 dias", title: "Avaliação física", detail: "Sprint 20m 3,62s (recorde pessoal)", tag: "destaque" },
    { when: "há 62 dias", title: "Jogo amistoso · Sub-11", detail: "1 gol e 1 assistência vs. ER Cassino", tag: "destaque" },
    { when: "há 78 dias", title: "Avaliação tática", detail: "Movimentação sem bola 7,5", tag: "info" },
    { when: "há 95 dias", title: "Antropometria", detail: "+1,2 cm · BF 14,2 → 14,0%", tag: "info" },
  ],

  // Próximos compromissos
  proximos: [
    { title: "Treino · Sub-11", date: "ter 28/abr · 18h00", local: "Campo B" },
    { title: "Treino · Sub-11", date: "qui 30/abr · 18h00", local: "Campo B" },
    { title: "Avaliação trimestral", date: "08/mai/2026", local: "Centro de avaliação" },
    { title: "Festival escolinhas Inter", date: "23/mai/2026", local: "Beira-Rio · POA" },
  ],

  // Responsável (placeholder — pai vai logar com o Google dele)
  responsavel: {
    nome: "Pai do Felipe",
    parentesco: "Pai",
    portal: true,
  },

  // LGPD
  consentimentos: {
    usoImagem: true,
    redesSociais: false,
    saudeFisio: true,
    dossieClubes: true,
    relatoriosWhatsApp: true,
  },

  // Foto (placeholder até subir uma real)
  foto: null as string | null,
};

export type Felipe = typeof FELIPE;
