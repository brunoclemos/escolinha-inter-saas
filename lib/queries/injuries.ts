import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { injuries, users } from "@/lib/db/schema";

export async function listInjuriesByAthlete(
  tenantId: string,
  athleteId: string
) {
  return db
    .select({
      id: injuries.id,
      type: injuries.type,
      bodyPart: injuries.bodyPart,
      severity: injuries.severity,
      occurredAt: injuries.occurredAt,
      daysOut: injuries.daysOut,
      returnedAt: injuries.returnedAt,
      description: injuries.description,
      treatment: injuries.treatment,
      recordedByName: users.fullName,
    })
    .from(injuries)
    .leftJoin(users, eq(users.id, injuries.recordedById))
    .where(
      and(eq(injuries.tenantId, tenantId), eq(injuries.athleteId, athleteId))
    )
    .orderBy(desc(injuries.occurredAt));
}
