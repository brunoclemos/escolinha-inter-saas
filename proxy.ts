import { NextRequest, NextResponse } from "next/server";
import { resolveTenantFromHost } from "@/lib/tenant";
import { updateSession } from "@/lib/supabase/proxy";

/**
 * Proxy multi-tenant + Supabase session refresh.
 *
 * 1. Resolve o tenant a partir do host (subdomínio ou custom domain)
 * 2. Refresca o token Supabase se necessário (cookies)
 * 3. Injeta x-onze-tenant-* em headers para server components consumirem
 */
export async function proxy(req: NextRequest) {
  const url = req.nextUrl;

  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api/health") ||
    url.pathname.startsWith("/favicon") ||
    url.pathname.startsWith("/robots") ||
    url.pathname.startsWith("/sitemap")
  ) {
    return NextResponse.next();
  }

  // 1. Refresh Supabase session (handles cookies)
  const response = await updateSession(req);

  // 2. Resolve tenant from host
  const host = req.headers.get("host") ?? "";
  const tenant = resolveTenantFromHost(host);

  response.headers.set("x-onze-tenant-slug", tenant.slug);
  response.headers.set("x-onze-tenant-host", host);
  response.headers.set("x-onze-tenant-source", tenant.source);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
