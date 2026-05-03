import { eq, and, asc, sql, inArray } from "drizzle-orm";
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

export async function getCategoryById(tenantId: string, categoryId: string) {
  const [category] = await db
    .select({
      id: categories.id,
      name: categories.name,
      ageMin: categories.ageMin,
      ageMax: categories.ageMax,
      color: categories.color,
      headCoachId: categories.headCoachId,
      headCoachName: users.fullName,
      createdAt: categories.createdAt,
    })
    .from(categories)
    .leftJoin(users, eq(users.id, categories.headCoachId))
    .where(and(eq(categories.tenantId, tenantId), eq(categories.id, categoryId)))
    .limit(1);

  if (!category) return null;

  const enrolled = await db
    .select({
      id: athletes.id,
      fullName: athletes.fullName,
      photoUrl: athletes.photoUrl,
      positionMain: athletes.positionMain,
      jerseyNumber: athletes.jerseyNumber,
      dob: athletes.dob,
    })
    .from(athleteCategories)
    .innerJoin(athletes, eq(athletes.id, athleteCategories.athleteId))
    .where(eq(athleteCategories.categoryId, categoryId))
    .orderBy(asc(athletes.fullName));

  return { category, athletes: enrolled };
}

export async function listEligibleCoaches(tenantId: string) {
  return db
    .select({
      id: users.id,
      fullName: users.fullName,
      role: users.role,
    })
    .from(users)
    .where(
      and(
        eq(users.tenantId, tenantId),
        eq(users.status, "active"),
        inArray(users.role, ["coach", "coordinator", "school_owner"])
      )
    )
    .orderBy(asc(users.fullName));
}
