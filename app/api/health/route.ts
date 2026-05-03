import { NextResponse } from "next/server";
import { sql as drizzleSql } from "drizzle-orm";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

function maskUrl(url: string | undefined) {
  if (!url) return null;
  // postgresql://user:PASS@host:port/db → postgresql://user:***@host:port/db
  return url.replace(/(:[^:@]+)@/, ":***@");
}

export async function GET() {
  const env = {
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    databaseHost:
      process.env.DATABASE_URL?.match(/@([^:/]+)/)?.[1] ?? null,
    hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    hasAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    hasServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    region: process.env.VERCEL_REGION ?? "local",
  };

  const result: {
    app: string;
    db: "ok" | "error" | "unknown";
    db_error?: string;
    db_hint?: string;
    env: typeof env;
    timestamp: string;
    version: string;
  } = {
    app: "ok",
    db: "unknown",
    env,
    timestamp: new Date().toISOString(),
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local",
  };

  try {
    await db.execute(drizzleSql`select 1`);
    result.db = "ok";
  } catch (e) {
    result.db = "error";
    const msg = e instanceof Error ? e.message : String(e);
    result.db_error = msg;
    if (msg.toLowerCase().includes("password")) {
      result.db_hint =
        "Senha invalida — verifique se DATABASE_URL no Vercel tem a senha URL-encoded (@ → %40, & → %26)";
    } else if (msg.toLowerCase().includes("enotfound")) {
      result.db_hint = "Host nao resolvido — verifique o subdominio do pooler";
    } else if (msg.toLowerCase().includes("timeout")) {
      result.db_hint = "Timeout — verifique firewall/IP allowlist no Supabase";
    } else if (msg.toLowerCase().includes("ssl")) {
      result.db_hint = "Erro SSL — Supabase requer SSL. Adicione ?sslmode=require na URL.";
    }
  }

  return NextResponse.json(result, {
    status: result.db === "ok" ? 200 : 503,
  });
}
