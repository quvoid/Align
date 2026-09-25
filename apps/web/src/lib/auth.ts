import NextAuth, { type NextAuthResult } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
// Native (Rust) bcrypt: hashing runs on libuv's thread pool instead of the JS
// thread. bcryptjs at cost 12 blocked the event loop ~250ms per login, which
// under a burst stalled every other request on the instance for seconds.
// Reads the existing $2a$ hashes written by bcryptjs.
import { verify } from "@node-rs/bcrypt";
import { prisma } from "@/server/db";
import { authConfig } from "./auth.config";
import { normalizeEmail, isSeededAdminEmail } from "./auth-shared";

const hasGoogleKeys = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);

/**
 * A real bcrypt hash of a random string, compared against on the
 * "no such user" path so that a miss costs the same time as a wrong password.
 * Without it, response latency reveals which emails are registered.
 */
const DUMMY_HASH = "$2a$12$C6UzMDM.H6dfI/f/IKcEeO1wF0KHvmQvLQYQZ.3AD0Zv1lSRpF9dq";

const nextAuth = NextAuth({
  ...authConfig,
  providers: [
    ...(hasGoogleKeys
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            allowDangerousEmailAccountLinking: true,
            // Always show Google's account chooser. Without this, a browser
            // already signed in to one Google account gets silently signed
            // into Align with it — no way to pick a different one (e.g. a
            // schbang.com admin account vs a personal Gmail).
            authorization: { params: { prompt: "select_account" } },
          }),
        ]
      : []),

    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = normalizeEmail(credentials?.email as string);
        const password = credentials?.password as string;

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });

        // Either no account, or an account that signs in with Google and has no
        // password set. Burn the same time as a real comparison, then refuse.
        if (!user?.passwordHash) {
          await verify(password, DUMMY_HASH);
          return null;
        }

        const valid = await verify(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.avatar ?? undefined,
          emailConfirmed: Boolean(user.emailVerifiedAt),
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,

    // Node-side override of the edge-safe jwt callback. `update` is fired by
    // `useSession().update()` after the OTP is accepted; re-read verification
    // from the database rather than trusting anything the client sends.
    async jwt(params) {
      const token = authConfig.callbacks.jwt(params);
      if (params.trigger === "update" && token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { emailVerifiedAt: true },
        });
        token.emailConfirmed = Boolean(dbUser?.emailVerifiedAt);
      }
      return token;
    },

    async signIn({ user, account, profile }) {
      // Credentials sign-ins already resolved against the database in
      // `authorize`, so there is nothing to reconcile here.
      if (account?.provider !== "google") return true;

      const email = normalizeEmail(user.email);
      if (!email) return false;

      // Only trust a Google identity whose address Google itself has verified.
      // This check is what makes linking a Google login to an existing
      // credentials account safe rather than an account-takeover vector.
      if (profile && profile.email_verified === false) return false;

      const dbUser = await prisma.user.upsert({
        where: { email },
        create: {
          email,
          name: user.name || email.split("@")[0] || "Creator",
          avatar: user.image ?? null,
          provider: "GOOGLE",
          providerId: profile?.sub ?? null,
          // Left unset: first sign-in is confirmed by the emailed OTP, the
          // same as a credentials signup.
          // Role is never taken from the email domain. A brand-new Google user
          // is a CREATOR unless they are on the seeded admin allowlist.
          role: isSeededAdminEmail(email) ? "ADMIN" : "CREATOR",
          creatorProfile: { create: {} },
        },
        update: {
          avatar: user.image ?? undefined,
          providerId: profile?.sub ?? undefined,
          // Deliberately NOT updating `role` or `name`: re-logging in must never
          // demote an admin or overwrite a name the creator has edited.
        },
      });

      // Hand the real database id and role to the `jwt` callback, which cannot
      // query the database itself because it also runs at the edge.
      user.id = dbUser.id;
      user.role = dbUser.role;
      user.emailConfirmed = Boolean(dbUser.emailVerifiedAt);

      return true;
    },
  },
});

// Explicit annotations: with pnpm's hoisting on Vercel the inferred types
// resolve through a path inside next-auth's package that TypeScript refuses
// to name (TS2742). Naming them via NextAuthResult is the documented fix.
export const handlers: NextAuthResult["handlers"] = nextAuth.handlers;
export const auth: NextAuthResult["auth"] = nextAuth.auth;
export const signIn: NextAuthResult["signIn"] = nextAuth.signIn;
export const signOut: NextAuthResult["signOut"] = nextAuth.signOut;
