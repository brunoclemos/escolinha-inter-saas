import { eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  guardians,
  athleteGuardians,
  athletes,
  athleteCategories,
  categories,
} from "@/lib/db/schema";

/**
 * Resolve os atletas que um usuário (com role=parent) tem acesso.
 * Lookup: users.id -> guardians.userId -> athleteGuardians -> athletes
 */
export async function listChildrenByGuardianUser(
  tenantId: string,
  appUserId: string
) {
  // Encontra todos os guardians vinculados a este user
  const linkedGuardians = await db
    .select({ id: guardians.id })
    .from(guardians)
    .where(eq(guardians.userId, appUserId));

  if (linkedGuardians.length === 0) return [];

  const guardianIds = linkedGuardians.map((g) => g.id);

  // Atletas vinculados a esses guardians
  return db
    .select({
      id: athletes.id,
      fullName: athletes.fullName,
      nickname: athletes.nickname,
      dob: athletes.dob,
      photoUrl: athletes.photoUrl,
      positionMain: athletes.positionMain,
      jerseyNumber: athletes.jerseyNumber,
      categoryName: categories.name,
      categoryColor: categories.color,
    })
    .from(athleteGuardians)
    .innerJoin(athletes, eq(athletes.id, athleteGuardians.athleteId))
    .leftJoin(
      athleteCategories,
      eq(athleteCategories.athleteId, athletes.id)
    )
    .leftJoin(categories, eq(categories.id, athleteCategories.categoryId))
    .where(inArray(athleteGuardians.guardianId, guardianIds));
}
