"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";

export interface AuthProfile {
  _id?: string;
  name: string;
  email: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  profile: AuthProfile | null;
  isLoading: boolean;
}

export function useAuthState(): AuthState {
  const { data: session, status } = useSession();

  const profile = useMemo<AuthProfile | null>(() => {
    const id = session?.user?.id;
    const name = session?.user?.name?.trim() ?? "";
    const email = session?.user?.email?.trim() ?? "";

    if (!id && !name && !email) {
      return null;
    }

    return {
      _id: id,
      name,
      email,
    };
  }, [session?.user?.email, session?.user?.id, session?.user?.name]);

  return {
    isLoggedIn: status === "authenticated",
    profile,
    isLoading: status === "loading",
  };
}
