import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function listUsers(tenantId: string) {
  return db
    .select({
      id: users.id,
      authUserId: users.authUserId,
      email: users.email,
      fullName: users.fullName,
      phone: users.phone,
      avatarUrl: users.avatarUrl,
      role: users.role,
      status: users.status,
      twoFaEnabled: users.twoFaEnabled,
      lastLoginAt: users.lastLoginAt,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.tenantId, tenantId))
    .orderBy(asc(users.fullName));
}
