import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
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

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    ...(hasGoogleKeys
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            allowDangerousEmailAccountLinking: true,
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
          await bcrypt.compare(password, DUMMY_HASH);
          return null;
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.avatar ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,

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
          emailVerifiedAt: new Date(),
          // Role is never taken from the email domain. A brand-new Google user
          // is a CREATOR unless they are on the seeded admin allowlist.
          role: isSeededAdminEmail(email) ? "ADMIN" : "CREATOR",
          creatorProfile: { create: {} },
        },
        update: {
          avatar: user.image ?? undefined,
          providerId: profile?.sub ?? undefined,
          emailVerifiedAt: new Date(),
          // Deliberately NOT updating `role` or `name`: re-logging in must never
          // demote an admin or overwrite a name the creator has edited.
        },
      });

      // Hand the real database id and role to the `jwt` callback, which cannot
      // query the database itself because it also runs at the edge.
      user.id = dbUser.id;
      user.role = dbUser.role;

      return true;
    },
  },
});
