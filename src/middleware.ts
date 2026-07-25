import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

const ADMIN_ONLY = ["/admin"];
const AUTHENTICATED_ONLY = ["/dashboard", "/messages", "/favoris", "/parametres"];
const ROLE_PREFIXES: Record<string, string[]> = {
  "/dashboard/joueur": ["PLAYER", "ADMIN"],
  "/dashboard/club": ["CLUB", "ADMIN"],
  "/dashboard/recruteur": ["RECRUITER", "ADMIN", "AGENT"],
};

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const path = nextUrl.pathname;

  const needsAdmin = ADMIN_ONLY.some((p) => path.startsWith(p));
  const needsAuth =
    needsAdmin || AUTHENTICATED_ONLY.some((p) => path.startsWith(p));

  if (needsAuth && !isLoggedIn) {
    const signInUrl = new URL("/connexion", nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(signInUrl);
  }

  if (needsAdmin && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  }

  for (const [prefix, allowedRoles] of Object.entries(ROLE_PREFIXES)) {
    if (path.startsWith(prefix) && role && !allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl.origin));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/messages/:path*", "/favoris/:path*", "/parametres/:path*"],
};
