import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { auditLog, users } from "@/lib/db/schema";

export async function listAuditLog(tenantId: string, limit = 100) {
  return db
    .select({
      id: auditLog.id,
      action: auditLog.action,
      targetTable: auditLog.targetTable,
      targetId: auditLog.targetId,
      diff: auditLog.diff,
      ip: auditLog.ip,
      userAgent: auditLog.userAgent,
      occurredAt: auditLog.occurredAt,
      actorEmail: users.email,
      actorName: users.fullName,
    })
    .from(auditLog)
    .leftJoin(users, eq(users.id, auditLog.actorUserId))
    .where(eq(auditLog.tenantId, tenantId))
    .orderBy(desc(auditLog.occurredAt))
    .limit(limit);
}
