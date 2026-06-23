import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: DefaultSession["user"] & {
      id?: string;
      role?: string;
    };
  }

  interface User {
    _id?: string;
    id?: string;
    decoded?: {
      id?: string;
    };
    role?: string;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    userId?: string;
    role?: string;
    accessToken?: string;
  }
}
