import { cache } from "react";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { tenants } from "@/lib/db/schema";
import { getCurrentTenantSlug } from "@/lib/tenant";

/**
 * Resolve o tenant atual a partir do slug injetado pelo proxy.
 * `cache()` deduplica chamadas dentro da mesma render.
 */
export const getCurrentTenant = cache(async () => {
  const slug = await getCurrentTenantSlug();

  const [tenant] = await db
    .select()
    .from(tenants)
    .where(eq(tenants.slug, slug))
    .limit(1);

  if (!tenant) {
    throw new Error(`Tenant '${slug}' não encontrado no banco`);
  }

  return tenant;
});
