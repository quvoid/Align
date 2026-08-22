import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "CREATOR" | "ADMIN" | "SUPER_ADMIN";
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    role?: "CREATOR" | "ADMIN" | "SUPER_ADMIN";
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: "CREATOR" | "ADMIN" | "SUPER_ADMIN";
  }
}
