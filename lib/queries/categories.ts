import { eq, asc, count, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories, athleteCategories, athletes, users } from "@/lib/db/schema";

export async function listCategories(tenantId: string) {
  return db
    .select({
      id: categories.id,
      name: categories.name,
      ageMin: categories.ageMin,
      ageMax: categories.ageMax,
      color: categories.color,
    })
    .from(categories)
    .where(eq(categories.tenantId, tenantId))
    .orderBy(asc(categories.ageMin));
}

export async function listCategoriesWithStats(tenantId: string) {
  const rows = await db
    .select({
      id: categories.id,
      name: categories.name,
      ageMin: categories.ageMin,
      ageMax: categories.ageMax,
      color: categories.color,
      headCoachId: categories.headCoachId,
      coachName: users.fullName,
      athleteCount: sql<number>`count(distinct ${athleteCategories.athleteId})`.as(
        "athlete_count"
      ),
    })
    .from(categories)
    .leftJoin(
      athleteCategories,
      eq(athleteCategories.categoryId, categories.id)
    )
    .leftJoin(athletes, eq(athletes.id, athleteCategories.athleteId))
    .leftJoin(users, eq(users.id, categories.headCoachId))
    .where(eq(categories.tenantId, tenantId))
    .groupBy(categories.id, users.fullName)
    .orderBy(asc(categories.ageMin));

  return rows.map((r) => ({
    ...r,
    athleteCount: Number(r.athleteCount),
  }));
}
