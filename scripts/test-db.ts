import postgres from "postgres";

async function main() {
  const url = process.env.DATABASE_URL_DIRECT;
  if (!url) {
    console.error("✗ DATABASE_URL_DIRECT não está setado");
    process.exit(1);
  }

  const sql = postgres(url, { max: 1, idle_timeout: 5 });

  try {
    const r = await sql`select version() as v, current_database() as db, now() as ts`;
    console.log("✓ Conectado ao Supabase!");
    console.log("  Database:", r[0].db);
    console.log("  Version:", String(r[0].v).slice(0, 70));
    console.log("  Server time:", r[0].ts);
  } catch (e) {
    console.error("✗ Falhou:", e instanceof Error ? e.message : e);
    process.exit(1);
  }

  await sql.end();
}

main();
