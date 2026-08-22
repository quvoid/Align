import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const authConfig: NextAuthConfig = {
  providers: [
    // Real Google OAuth Provider
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    // Credentials & Demo Profiles Provider
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = (credentials?.email as string)?.toLowerCase().trim();

        if (!email) return null;

        // 1. Schbang Admin Demo Account
        if (email === "admin@schbang.com") {
          return {
            id: "admin_1",
            name: "Harshil Karia (Admin)",
            email: "admin@schbang.com",
            role: "ADMIN",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop",
          };
        }

        // 2. Rohan Joshi Creator Demo Account
        if (email === "rohan@schbang.com" || email === "rohan.creates@gmail.com") {
          return {
            id: "c1",
            name: "Rohan Joshi",
            email: "rohan.creates@gmail.com",
            role: "CREATOR",
            image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop",
          };
        }

        // 3. Aanya Sen Beauty Creator Demo Account
        if (email === "aanya@schbang.com" || email === "aanya.beauty@gmail.com") {
          return {
            id: "c2",
            name: "Aanya Sen",
            email: "aanya.beauty@gmail.com",
            role: "CREATOR",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop",
          };
        }

        // 4. Default dynamic creator login
        const displayName = email.split("@")[0] || "creator";
        return {
          id: `user_${Date.now()}`,
          name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
          email: email,
          role: "CREATOR",
          image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role || "CREATOR";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role || "CREATOR";
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
