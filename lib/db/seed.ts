import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import * as schema from "./schema";
import { SEED_TENANT, SEED_CATEGORIES, SEED_ATHLETES } from "./seed-data";
import { ageFromDob } from "../utils";

async function main() {
  const url = process.env.DATABASE_URL_DIRECT;
  if (!url) {
    console.error("✗ DATABASE_URL_DIRECT não setado");
    process.exit(1);
  }

  const client = postgres(url, { max: 1, idle_timeout: 5 });
  const db = drizzle(client, { schema });

  console.log("→ Iniciando seed do tenant escola-inter\n");

  // 1. Tenant
  const existing = await db
    .select()
    .from(schema.tenants)
    .where(eq(schema.tenants.slug, SEED_TENANT.slug))
    .limit(1);

  let tenantId: string;
  if (existing.length > 0) {
    tenantId = existing[0].id;
    console.log(`✓ Tenant já existe (${tenantId})`);
  } else {
    const [t] = await db
      .insert(schema.tenants)
      .values({
        slug: SEED_TENANT.slug,
        name: SEED_TENANT.name,
        legalName: SEED_TENANT.legalName,
        plan: SEED_TENANT.plan,
        theme: SEED_TENANT.theme,
      })
      .returning();
    tenantId = t.id;
    console.log(`✓ Tenant criado (${tenantId})`);
  }

  // 2. Categorias
  console.log("\n→ Categorias");
  const categoryByName = new Map<string, string>();
  for (const cat of SEED_CATEGORIES) {
    const found = await db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.name, cat.name))
      .limit(1);

    if (found.length > 0 && found[0].tenantId === tenantId) {
      categoryByName.set(cat.name, found[0].id);
      console.log(`  • ${cat.name} (existente)`);
      continue;
    }

    const [created] = await db
      .insert(schema.categories)
      .values({
        tenantId,
        name: cat.name,
        ageMin: cat.ageMin,
        ageMax: cat.ageMax,
        color: cat.color,
      })
      .returning();
    categoryByName.set(cat.name, created.id);
    console.log(`  • ${cat.name} (criada)`);
  }

  // 3. Atletas
  console.log("\n→ Atletas");
  for (const a of SEED_ATHLETES) {
    const age = ageFromDob(a.dob);
    const catName =
      age <= 7
        ? "Sub-7"
        : age <= 9
          ? "Sub-9"
          : age <= 11
            ? "Sub-11"
            : age <= 13
              ? "Sub-13"
              : age <= 15
                ? "Sub-15"
                : "Sub-17";

    const existing = await db
      .select()
      .from(schema.athletes)
      .where(eq(schema.athletes.fullName, a.fullName))
      .limit(1);

    let athleteId: string;
    if (existing.length > 0 && existing[0].tenantId === tenantId) {
      athleteId = existing[0].id;
      console.log(`  • ${a.fullName} (existente)`);
    } else {
      const [created] = await db
        .insert(schema.athletes)
        .values({
          tenantId,
          fullName: a.fullName,
          dob: a.dob,
          positionMain: a.positionMain,
          dominantFoot: a.dominantFoot,
          jerseyNumber: a.jerseyNumber,
        })
        .returning();
      athleteId = created.id;
      console.log(`  • ${a.fullName} (criado, ${age} anos, ${catName})`);
    }

    const catId = categoryByName.get(catName);
    if (catId) {
      await db
        .insert(schema.athleteCategories)
        .values({ athleteId, categoryId: catId })
        .onConflictDoNothing();
    }
  }

  console.log("\n✓ Seed concluído.");
  await client.end();
}

main().catch((e) => {
  console.error("✗ Seed falhou:", e);
  process.exit(1);
});
