import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

/**
 * Atualiza a sessão Supabase no proxy. Refresca tokens, propaga cookies
 * de volta na resposta. Roda em toda request (exceto rotas estáticas).
 */
export async function updateSession(req: NextRequest) {
  let response = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            req.cookies.set(name, value)
          );
          response = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Importante: chamar getUser() para refrescar o token expirado.
  await supabase.auth.getUser();

  return response;
}
