import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

type SignInApiResponse = {
  token?: string;
  message?: string;
  errors?: {
    msg?: string;
    message?: string;
  }[];
  user?: {
    _id?: string;
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
  decoded?: {
    id?: string;
    name?: string;
    role?: string;
  };
};

const SIGN_IN_API_URL = "https://ecommerce.routemisr.com/api/v1/auth/signin";

function decodeJwtUserId(accessToken?: string): string | undefined {
  if (!accessToken) {
    return undefined;
  }

  const parts = accessToken.split(".");
  if (parts.length < 2) {
    return undefined;
  }

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const decoded = JSON.parse(
      Buffer.from(padded, "base64").toString("utf-8"),
    ) as {
      id?: string;
      sub?: string;
    };

    return decoded.id ?? decoded.sub;
  } catch {
    return undefined;
  }
}

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim() ?? "";
        const password = credentials?.password ?? "";

        if (!email || !password) {
          return null;
        }

        const response = await fetch(SIGN_IN_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          cache: "no-store",
        });

        const payload = (await response.json()) as SignInApiResponse;

        if (!response.ok) {
          const apiMessage =
            payload.message ||
            payload.errors?.[0]?.msg ||
            payload.errors?.[0]?.message ||
            "Incorrect email or password";
          throw new Error(apiMessage);
        }

        const user = payload.user;
        const userId =
          payload.decoded?.id || payload.user?._id || payload.user?.id;

        console.log("API Response User:", user);

        if (!payload.token || !user) {
          return null;
        }

        return {
          id: userId,
          _id: user._id,
          decoded: payload.decoded,
          name: user.name ?? payload.decoded?.name ?? "",
          email: user.email ?? email,
          role: user.role ?? payload.decoded?.role ?? "user",
          accessToken: payload.token,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.id =
          user.id ||
          user._id ||
          token.sub ||
          decodeJwtUserId(token.accessToken);
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
