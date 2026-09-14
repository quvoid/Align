import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe half of the auth configuration.
 *
 * `middleware.ts` runs in the edge runtime and needs `auth()` to read the JWT.
 * Anything reachable from this module gets bundled for the edge, so it must NOT
 * import Prisma (native query engine) or bcrypt (Node crypto). Providers live in
 * `auth.ts` instead — they are only needed to *issue* a token, never to verify
 * one.
 *
 * Consequence worth knowing: because `jwt` cannot reach the database, `role` is
 * stamped into the token at sign-in and never refreshed. Promoting someone to
 * ADMIN requires them to sign out and back in. Middleware is therefore a UX
 * guard only — every admin route handler and server action must re-check the
 * role against the database itself.
 */

const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

// Compiling does not require the real secret — serving does. Next evaluates
// route modules during `next build` with NODE_ENV=production, so without this
// phase check a build machine would need the production secret just to compile.
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

if (!authSecret && process.env.NODE_ENV === "production" && !isBuildPhase) {
  throw new Error(
    "AUTH_SECRET is not set. Generate one with `openssl rand -hex 32` and set it in the deployment environment."
  );
}

export const authConfig = {
  trustHost: true,
  secret: authSecret,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      // Runs at the edge as well as in Node — no database access here.
      // `user` is only present on the first call (sign-in); afterwards the
      // values persist on the token.
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "CREATOR";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || "";
        session.user.role =
          (token.role as "CREATOR" | "ADMIN" | "SUPER_ADMIN") || "CREATOR";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
