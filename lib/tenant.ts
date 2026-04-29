import { headers } from "next/headers";

export type ResolvedTenant = {
  slug: string;
  source: "subdomain" | "custom-domain" | "default";
  host: string;
};

const PLATFORM_DOMAINS = new Set([
  "onzehq.com",
  "www.onzehq.com",
  "onze.vercel.app",
  "escolinha-inter-saas.vercel.app",
  "localhost:3000",
  "localhost",
]);

const RESERVED_SUBDOMAINS = new Set([
  "www",
  "app",
  "api",
  "admin",
  "marketing",
  "docs",
  "status",
  "static",
  "cdn",
]);

/**
 * Resolve o tenant slug a partir do host. Não consulta DB ainda — apenas extrai
 * o candidato a slug. A validação contra DB acontece no layout do app.
 */
export function resolveTenantFromHost(host: string): ResolvedTenant {
  const cleanHost = host.toLowerCase().split(":")[0];
  const port = host.includes(":") ? `:${host.split(":")[1]}` : "";
  const fullHost = `${cleanHost}${port}`;

  const fallbackSlug =
    process.env.NEXT_PUBLIC_DEFAULT_TENANT ?? "escola-inter";

  if (PLATFORM_DOMAINS.has(fullHost) || PLATFORM_DOMAINS.has(cleanHost)) {
    return { slug: fallbackSlug, source: "default", host: fullHost };
  }

  if (cleanHost.endsWith(".onzehq.com")) {
    const sub = cleanHost.replace(".onzehq.com", "");
    if (RESERVED_SUBDOMAINS.has(sub)) {
      return { slug: fallbackSlug, source: "default", host: fullHost };
    }
    return { slug: sub, source: "subdomain", host: fullHost };
  }

  if (cleanHost.endsWith(".vercel.app")) {
    return { slug: fallbackSlug, source: "default", host: fullHost };
  }

  return { slug: cleanHost, source: "custom-domain", host: fullHost };
}

export async function getCurrentTenantSlug(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-onze-tenant-slug") ??
    process.env.NEXT_PUBLIC_DEFAULT_TENANT ??
    "escola-inter"
  );
}

export async function getCurrentTenantContext(): Promise<ResolvedTenant> {
  const h = await headers();
  return {
    slug:
      h.get("x-onze-tenant-slug") ??
      process.env.NEXT_PUBLIC_DEFAULT_TENANT ??
      "escola-inter",
    source:
      (h.get("x-onze-tenant-source") as ResolvedTenant["source"]) ?? "default",
    host: h.get("x-onze-tenant-host") ?? "localhost:3000",
  };
}
