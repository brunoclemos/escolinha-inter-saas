/**
 * Aplica policies RLS no Supabase. Idempotente.
 * Uso: npx tsx --env-file=.env.local scripts/apply-rls.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import postgres from "postgres";

async function main() {
  const url = process.env.DATABASE_URL_DIRECT;
  if (!url) {
    console.error("✗ DATABASE_URL_DIRECT não setado");
    process.exit(1);
  }

  const sqlPath = resolve(process.cwd(), "drizzle/rls_setup.sql");
  const sqlContent = readFileSync(sqlPath, "utf-8");

  console.log(`→ Aplicando RLS de ${sqlPath}`);
  const sql = postgres(url, { max: 1, idle_timeout: 5 });

  try {
    await sql.unsafe(sqlContent);
    console.log("✓ RLS aplicado com sucesso");
  } catch (e) {
    console.error("✗ Falhou:", e instanceof Error ? e.message : e);
    process.exit(1);
  }

  // Verifica
  const result = await sql<{ tablename: string; rowsecurity: boolean }[]>`
    select tablename, rowsecurity
    from pg_tables
    where schemaname = 'public'
      and tablename in (
        'tenants', 'users', 'categories', 'athletes', 'guardians',
        'audit_log', 'evaluations', 'anthropometry_records',
        'physical_tests', 'training_sessions', 'matches', 'injuries',
        'athlete_guardians', 'athlete_categories', 'eval_technical',
        'eval_tactical', 'eval_psych', 'attendance', 'match_stats'
      )
    order by tablename
  `;

  console.log("\nStatus RLS por tabela:");
  for (const r of result) {
    console.log(`  ${r.rowsecurity ? "✓" : "✗"} ${r.tablename}`);
  }

  const enabled = result.filter((r) => r.rowsecurity).length;
  console.log(`\n${enabled}/${result.length} tabelas com RLS habilitado.`);

  await sql.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
