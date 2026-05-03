import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { anthropometryRecords, users } from "@/lib/db/schema";

export async function listAnthropometryByAthlete(
  tenantId: string,
  athleteId: string
) {
  return db
    .select({
      id: anthropometryRecords.id,
      recordedAt: anthropometryRecords.recordedAt,
      heightCm: anthropometryRecords.heightCm,
      weightDg: anthropometryRecords.weightDg,
      wingspanCm: anthropometryRecords.wingspanCm,
      bodyFatPctX10: anthropometryRecords.bodyFatPctX10,
      bmiX10: anthropometryRecords.bmiX10,
      biologicalAgeX10: anthropometryRecords.biologicalAgeX10,
      notes: anthropometryRecords.notes,
      recordedByName: users.fullName,
    })
    .from(anthropometryRecords)
    .leftJoin(users, eq(users.id, anthropometryRecords.recordedById))
    .where(
      and(
        eq(anthropometryRecords.tenantId, tenantId),
        eq(anthropometryRecords.athleteId, athleteId)
      )
    )
    .orderBy(desc(anthropometryRecords.recordedAt));
}

/**
 * Calcula IMC (kg/m²). Retorna * 10 (240 = 24.0).
 */
export function calculateBmiX10(
  heightCm: number | null,
  weightDg: number | null
): number | null {
  if (!heightCm || !weightDg || heightCm <= 0) return null;
  const heightM = heightCm / 100;
  const weightKg = weightDg / 10;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10);
}
