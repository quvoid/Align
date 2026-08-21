import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (credentials?.email === "admin@schbang.com") {
          return { id: "1", name: "Admin", email: "admin@schbang.com", role: "ADMIN" };
        }
        return { id: "2", name: "Creator", email: (credentials?.email as string) || "creator@schbang.com", role: "CREATOR" };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
