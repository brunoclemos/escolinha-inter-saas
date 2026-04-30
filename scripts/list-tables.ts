import postgres from "postgres";

async function main() {
  const sql = postgres(process.env.DATABASE_URL_DIRECT!, {
    max: 1,
    idle_timeout: 5,
  });

  try {
    const tables = await sql`
      select table_name
      from information_schema.tables
      where table_schema = 'public'
      order by table_name
    `;
    console.log("Tabelas no schema public:");
    for (const t of tables) console.log("  •", t.table_name);

    const enums = await sql`
      select t.typname as name, count(e.enumlabel)::int as values
      from pg_type t
      left join pg_enum e on e.enumtypid = t.oid
      where t.typtype = 'e'
      group by t.typname
      order by t.typname
    `;
    console.log("\nEnums:");
    for (const e of enums) console.log("  •", e.name, `(${e.values} valores)`);
  } catch (e) {
    console.error("✗", e instanceof Error ? e.message : e);
    process.exit(1);
  }

  await sql.end();
}

main();
