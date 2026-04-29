import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn(
    "[onze] DATABASE_URL not set — database queries will fail at runtime"
  );
}

const client = connectionString
  ? postgres(connectionString, {
      max: 10,
      idle_timeout: 20,
      prepare: false,
    })
  : (undefined as unknown as ReturnType<typeof postgres>);

export const db = drizzle(client, { schema });
export { schema };
