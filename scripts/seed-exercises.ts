/**
 * Popula a tabela exercises com o catálogo CBF Academy + clássicos.
 * Idempotente: usa slug + source=platform pra deduplicar.
 *
 * Uso: npx tsx --env-file=.env.local scripts/seed-exercises.ts
 */
import { drizzle } from "drizzle-orm/postgres-js";
import { and, eq, isNull } from "drizzle-orm";
import postgres from "postgres";
import * as schema from "../lib/db/schema";
import { EXERCISE_CATALOG } from "../lib/exercises/seed-catalog";

async function main() {
  const url = process.env.DATABASE_URL_DIRECT;
  if (!url) {
    console.error("✗ DATABASE_URL_DIRECT não setado");
    process.exit(1);
  }

  const client = postgres(url, { max: 1, idle_timeout: 5 });
  const db = drizzle(client, { schema });

  console.log(
    `→ Seed catálogo de exercícios (${EXERCISE_CATALOG.length} entradas)\n`
  );

  let created = 0;
  let updated = 0;

  for (const ex of EXERCISE_CATALOG) {
    const [existing] = await db
      .select({ id: schema.exercises.id })
      .from(schema.exercises)
      .where(
        and(
          eq(schema.exercises.slug, ex.slug as string),
          eq(schema.exercises.source, "platform"),
          isNull(schema.exercises.tenantId)
        )
      )
      .limit(1);

    if (existing) {
      await db
        .update(schema.exercises)
        .set({ ...ex, updatedAt: new Date() })
        .where(eq(schema.exercises.id, existing.id));
      console.log(`  · ${ex.name} (atualizado)`);
      updated++;
    } else {
      await db.insert(schema.exercises).values({
        ...ex,
        tenantId: null,
      });
      console.log(`  · ${ex.name} (criado)`);
      created++;
    }
  }

  console.log(`\n✓ Seed concluído. ${created} criados, ${updated} atualizados.`);
  await client.end();
}

main().catch((e) => {
  console.error("✗", e);
  process.exit(1);
});
