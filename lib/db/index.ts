import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let _client: ReturnType<typeof postgres> | null = null;

function getClient() {
  if (_client) return _client;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "[onze] DATABASE_URL não está setada. Configure no .env.local (dev) ou nas env vars do Vercel (produção)."
    );
  }
  _client = postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    prepare: false,
  });
  return _client;
}

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop) {
    const realDb = drizzle(getClient(), { schema });
    return Reflect.get(realDb, prop);
  },
});

export { schema };
