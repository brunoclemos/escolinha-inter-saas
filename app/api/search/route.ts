import { NextRequest, NextResponse } from "next/server";
import { ilike, and, eq, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { athletes, categories } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import { getCurrentTenant } from "@/lib/queries/tenant";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json({ athletes: [], categories: [] });
  }

  const tenant = await getCurrentTenant();
  const pattern = `%${q}%`;

  const [foundAthletes, foundCategories] = await Promise.all([
    db
      .select({
        id: athletes.id,
        fullName: athletes.fullName,
        nickname: athletes.nickname,
        photoUrl: athletes.photoUrl,
        positionMain: athletes.positionMain,
        jerseyNumber: athletes.jerseyNumber,
      })
      .from(athletes)
      .where(
        and(
          eq(athletes.tenantId, tenant.id),
          or(
            ilike(athletes.fullName, pattern),
            ilike(athletes.nickname, pattern)
          )
        )
      )
      .limit(8),
    db
      .select({
        id: categories.id,
        name: categories.name,
        ageMin: categories.ageMin,
        ageMax: categories.ageMax,
      })
      .from(categories)
      .where(
        and(
          eq(categories.tenantId, tenant.id),
          ilike(categories.name, pattern)
        )
      )
      .limit(4),
  ]);

  return NextResponse.json({
    athletes: foundAthletes,
    categories: foundCategories,
  });
}
