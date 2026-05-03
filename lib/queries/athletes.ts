import { and, eq, ilike, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { athletes, athleteCategories, categories, guardians, athleteGuardians } from "@/lib/db/schema";

export type AthleteListItem = Awaited<ReturnType<typeof listAthletes>>[number];

export async function listAthletes(
  tenantId: string,
  opts: { search?: string; status?: "active" | "inactive" } = {}
) {
  const conditions = [eq(athletes.tenantId, tenantId)];
  if (opts.status) conditions.push(eq(athletes.status, opts.status));
  if (opts.search) conditions.push(ilike(athletes.fullName, `%${opts.search}%`));

  const rows = await db
    .select({
      id: athletes.id,
      fullName: athletes.fullName,
      dob: athletes.dob,
      positionMain: athletes.positionMain,
      dominantFoot: athletes.dominantFoot,
      jerseyNumber: athletes.jerseyNumber,
      status: athletes.status,
      photoUrl: athletes.photoUrl,
      categoryName: categories.name,
      categoryColor: categories.color,
    })
    .from(athletes)
    .leftJoin(
      athleteCategories,
      eq(athleteCategories.athleteId, athletes.id)
    )
    .leftJoin(categories, eq(categories.id, athleteCategories.categoryId))
    .where(and(...conditions))
    .orderBy(asc(athletes.fullName));

  return rows;
}

export async function countAthletes(tenantId: string) {
  const result = await db
    .select({ id: athletes.id })
    .from(athletes)
    .where(
      and(eq(athletes.tenantId, tenantId), eq(athletes.status, "active"))
    );
  return result.length;
}

export async function getAthleteById(tenantId: string, athleteId: string) {
  const [athlete] = await db
    .select()
    .from(athletes)
    .where(and(eq(athletes.tenantId, tenantId), eq(athletes.id, athleteId)))
    .limit(1);

  if (!athlete) return null;

  const cats = await db
    .select({
      id: categories.id,
      name: categories.name,
      ageMin: categories.ageMin,
      ageMax: categories.ageMax,
      color: categories.color,
    })
    .from(athleteCategories)
    .innerJoin(categories, eq(categories.id, athleteCategories.categoryId))
    .where(eq(athleteCategories.athleteId, athleteId));

  const guards = await db
    .select({
      id: guardians.id,
      fullName: guardians.fullName,
      relationship: guardians.relationship,
      phone: guardians.phone,
      whatsapp: guardians.whatsapp,
      email: guardians.email,
      isPrimary: athleteGuardians.isPrimary,
      financialResponsible: athleteGuardians.financialResponsible,
    })
    .from(athleteGuardians)
    .innerJoin(guardians, eq(guardians.id, athleteGuardians.guardianId))
    .where(eq(athleteGuardians.athleteId, athleteId));

  return { athlete, categories: cats, guardians: guards };
}
