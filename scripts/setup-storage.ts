/**
 * Cria bucket "athlete-photos" no Supabase Storage com leitura pública.
 * Idempotente. Roda uma vez por projeto.
 *
 * Uso: npx tsx --env-file=.env.local scripts/setup-storage.ts
 */
import { createClient } from "@supabase/supabase-js";

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error("✗ Faltou NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const buckets = [
    {
      id: "athlete-photos",
      public: true,
      fileSizeLimit: 5 * 1024 * 1024, // 5 MB
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    },
  ];

  for (const cfg of buckets) {
    const { data: existing } = await admin.storage.getBucket(cfg.id);
    if (existing) {
      console.log(`✓ Bucket "${cfg.id}" já existe`);
      const { error: updateErr } = await admin.storage.updateBucket(cfg.id, {
        public: cfg.public,
        fileSizeLimit: cfg.fileSizeLimit,
        allowedMimeTypes: cfg.allowedMimeTypes,
      });
      if (updateErr) console.error(`  · update falhou: ${updateErr.message}`);
      else console.log(`  · config atualizada`);
    } else {
      const { error } = await admin.storage.createBucket(cfg.id, {
        public: cfg.public,
        fileSizeLimit: cfg.fileSizeLimit,
        allowedMimeTypes: cfg.allowedMimeTypes,
      });
      if (error) {
        console.error(`✗ Falha ao criar "${cfg.id}":`, error.message);
        process.exit(1);
      }
      console.log(`✓ Bucket "${cfg.id}" criado`);
    }
  }

  console.log("\n✓ Storage configurado.");
}

main().catch((e) => {
  console.error("✗", e);
  process.exit(1);
});
