import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuth = !!req.auth;

  const isPublic =
    pathname === "/login" ||
    pathname === "/login/error" ||
    pathname.startsWith("/api/auth");

  if (!isAuth && !isPublic) {
    const url = new URL("/login", req.url);
    return NextResponse.redirect(url);
  }

  if (isAuth && pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|monograma.png|logo-escola.png|.*\\..*).*)"],
};
