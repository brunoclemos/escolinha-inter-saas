/**
 * Dados de seed para desenvolvimento — Escola do Inter (cliente-zero).
 * Não usar em produção. Rodado por `npm run db:seed` (a implementar).
 */

export const SEED_TENANT = {
  slug: "escola-inter",
  name: "Escolinha Sport Club Internacional",
  legalName: "Escolinha Inter Ltda.",
  plan: "pro" as const,
  theme: {
    brand: "357 78% 46%",
    brandSoft: "356 100% 97%",
    brandText: "357 78% 26%",
    logoUrl: "/legacy/assets/logo-inter.png",
  },
};

export const SEED_CATEGORIES = [
  { name: "Sub-7", ageMin: 5, ageMax: 7, color: "#FFD166" },
  { name: "Sub-9", ageMin: 8, ageMax: 9, color: "#06D6A0" },
  { name: "Sub-11", ageMin: 10, ageMax: 11, color: "#118AB2" },
  { name: "Sub-13", ageMin: 12, ageMax: 13, color: "#073B4C" },
  { name: "Sub-15", ageMin: 14, ageMax: 15, color: "#9B5DE5" },
  { name: "Sub-17", ageMin: 16, ageMax: 17, color: "#C8102E" },
];

export const SEED_ATHLETES = [
  {
    fullName: "Felipe Almeida Silva",
    dob: "2012-03-14",
    positionMain: "Atacante",
    dominantFoot: "right" as const,
    jerseyNumber: 9,
  },
  {
    fullName: "João Pedro Castro",
    dob: "2013-07-22",
    positionMain: "Meia",
    dominantFoot: "left" as const,
    jerseyNumber: 10,
  },
  {
    fullName: "Lucas Moreira",
    dob: "2014-01-08",
    positionMain: "Goleiro",
    dominantFoot: "right" as const,
    jerseyNumber: 1,
  },
  {
    fullName: "Gabriel Santos",
    dob: "2012-11-30",
    positionMain: "Lateral Direito",
    dominantFoot: "right" as const,
    jerseyNumber: 2,
  },
  {
    fullName: "Matheus Oliveira",
    dob: "2013-05-19",
    positionMain: "Zagueiro",
    dominantFoot: "right" as const,
    jerseyNumber: 4,
  },
];
