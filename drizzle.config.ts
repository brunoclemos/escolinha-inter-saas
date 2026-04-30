import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Drizzle Kit precisa de session state (não funciona com transaction pooler 6543).
    // Usa DATABASE_URL_DIRECT (session pooler 5432) com fallback pro DATABASE_URL.
    url: process.env.DATABASE_URL_DIRECT ?? process.env.DATABASE_URL ?? "",
  },
  verbose: true,
  strict: true,
} satisfies Config;
