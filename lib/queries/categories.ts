import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";

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
