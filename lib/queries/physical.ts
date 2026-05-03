import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { physicalTests, users } from "@/lib/db/schema";

export async function listPhysicalTestsByAthlete(
  tenantId: string,
  athleteId: string
) {
  return db
    .select({
      id: physicalTests.id,
      recordedAt: physicalTests.recordedAt,
      testCode: physicalTests.testCode,
      valueX1000: physicalTests.valueX1000,
      unit: physicalTests.unit,
      condition: physicalTests.condition,
      observation: physicalTests.observation,
      recordedByName: users.fullName,
    })
    .from(physicalTests)
    .leftJoin(users, eq(users.id, physicalTests.recordedById))
    .where(
      and(
        eq(physicalTests.tenantId, tenantId),
        eq(physicalTests.athleteId, athleteId)
      )
    )
    .orderBy(desc(physicalTests.recordedAt));
}
