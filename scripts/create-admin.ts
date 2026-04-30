/**
 * Cria um usuário admin (school_owner) no Supabase Auth + tabela users.
 *
 * Uso:
 *   npx tsx --env-file=.env.local scripts/create-admin.ts <email> <senha> "<Nome Completo>"
 *
 * Exemplo:
 *   npx tsx --env-file=.env.local scripts/create-admin.ts bruno@onzehq.com Senha123! "Bruno Lemos"
 */
import { createClient } from "@supabase/supabase-js";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import * as schema from "../lib/db/schema";

async function main() {
  const [, , email, password, ...nameParts] = process.argv;
  const fullName = nameParts.join(" ");

  if (!email || !password || !fullName) {
    console.error(
      "Uso: tsx scripts/create-admin.ts <email> <senha> '<Nome Completo>'"
    );
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("✗ Senha precisa ter pelo menos 8 caracteres.");
    process.exit(1);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const dbUrl = process.env.DATABASE_URL_DIRECT;

  if (!supabaseUrl || !serviceKey || !dbUrl) {
    console.error(
      "✗ Faltou env: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / DATABASE_URL_DIRECT"
    );
    process.exit(1);
  }

  // 1. Cria/encontra usuário no Supabase Auth (admin API, bypassa RLS).
  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log(`→ Procurando usuário existente: ${email}`);
  const { data: list } = await admin.auth.admin.listUsers();
  let authUser = list.users.find((u) => u.email === email);

  if (authUser) {
    console.log(`✓ Usuário Auth já existe (${authUser.id})`);
    const { error } = await admin.auth.admin.updateUserById(authUser.id, {
      password,
    });
    if (error) {
      console.error("✗ Falha ao atualizar senha:", error.message);
      process.exit(1);
    }
    console.log("  · Senha atualizada");
  } else {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });
    if (error) {
      console.error("✗ Falha ao criar Auth user:", error.message);
      process.exit(1);
    }
    authUser = data.user!;
    console.log(`✓ Usuário Auth criado (${authUser.id})`);
  }

  // 2. Vincula na tabela users com role school_owner do tenant escola-inter.
  const client = postgres(dbUrl, { max: 1, idle_timeout: 5 });
  const db = drizzle(client, { schema });

  try {
    const [tenant] = await db
      .select()
      .from(schema.tenants)
      .where(eq(schema.tenants.slug, "escola-inter"))
      .limit(1);

    if (!tenant) {
      console.error(
        "✗ Tenant 'escola-inter' não encontrado. Rode primeiro: npx tsx --env-file=.env.local lib/db/seed.ts"
      );
      process.exit(1);
    }

    const existing = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.authUserId, authUser.id))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(schema.users)
        .set({ fullName, email, role: "school_owner" })
        .where(eq(schema.users.id, existing[0].id));
      console.log(`✓ Perfil já existia, atualizado (${existing[0].id})`);
    } else {
      const [u] = await db
        .insert(schema.users)
        .values({
          tenantId: tenant.id,
          authUserId: authUser.id,
          email,
          fullName,
          role: "school_owner",
          status: "active",
        })
        .returning();
      console.log(`✓ Perfil criado (${u.id})`);
    }

    console.log("\n✅ Pronto! Você pode entrar em http://localhost:3000/login");
    console.log(`   E-mail: ${email}`);
    console.log(`   Senha:  ${password}`);
    console.log(`   Tenant: ${tenant.name} (${tenant.slug})`);
    console.log(`   Role:   school_owner`);
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error("✗ Falhou:", e);
  process.exit(1);
});
