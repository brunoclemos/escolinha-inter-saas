import { NextRequest, NextResponse } from "next/server";
import { resolveTenantFromHost } from "@/lib/tenant";

/**
 * Middleware multi-tenant.
 *
 * Resolve o tenant a partir do host:
 *   - escola-inter.onzehq.com → slug "escola-inter"
 *   - app.escola-inter.com.br → custom domain "app.escola-inter.com.br"
 *   - localhost:3000           → tenant default em dev (env NEXT_PUBLIC_DEFAULT_TENANT)
 *
 * Injeta x-onze-tenant-slug e x-onze-tenant-host em headers para os layouts/server
 * components consumirem via headers().
 */
export async function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const host = req.headers.get("host") ?? "";

  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api/health") ||
    url.pathname.startsWith("/favicon") ||
    url.pathname.startsWith("/robots") ||
    url.pathname.startsWith("/sitemap")
  ) {
    return NextResponse.next();
  }

  const tenant = resolveTenantFromHost(host);

  const res = NextResponse.next();
  res.headers.set("x-onze-tenant-slug", tenant.slug);
  res.headers.set("x-onze-tenant-host", host);
  res.headers.set("x-onze-tenant-source", tenant.source);
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
