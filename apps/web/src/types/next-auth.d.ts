import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "CREATOR" | "ADMIN" | "SUPER_ADMIN";
      /** Has entered the emailed first-sign-in code (User.emailVerifiedAt set). */
      emailConfirmed: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    role?: "CREATOR" | "ADMIN" | "SUPER_ADMIN";
    emailConfirmed?: boolean;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: "CREATOR" | "ADMIN" | "SUPER_ADMIN";
    emailConfirmed?: boolean;
  }
}
