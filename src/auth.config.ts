import type { NextAuthConfig } from "next-auth";
import type { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      clubId: string | null;
      playerId: string | null;
    } & import("next-auth").DefaultSession["user"];
  }

  interface User {
    role: UserRole;
    clubId?: string | null;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    clubId: string | null;
    playerId: string | null;
  }
}

// Edge-safe config: no Prisma adapter, no bcrypt. Used directly by middleware
// so the Edge bundle never pulls in Node-only dependencies. The full config
// (src/auth.ts) spreads this and adds the adapter + credentials provider.
export const authConfig = {
  pages: {
    signIn: "/connexion",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as UserRole;
      session.user.clubId = (token.clubId as string | null) ?? null;
      session.user.playerId = (token.playerId as string | null) ?? null;
      return session;
    },
  },
} satisfies NextAuthConfig;
