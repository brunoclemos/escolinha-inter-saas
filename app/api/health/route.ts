import { NextResponse } from "next/server";
import { sql as drizzleSql } from "drizzle-orm";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks = {
    app: "ok",
    db: "unknown" as "ok" | "unknown" | "error",
    timestamp: new Date().toISOString(),
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local",
  };

  try {
    await db.execute(drizzleSql`select 1`);
    checks.db = "ok";
  } catch {
    checks.db = "error";
  }

  return NextResponse.json(checks, {
    status: checks.db === "ok" ? 200 : 503,
  });
}
