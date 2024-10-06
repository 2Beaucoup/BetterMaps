import { Account, NextAuthOptions, Session, User } from "next-auth";

import GoogleProvider from "next-auth/providers/google";

import { JWT } from "next-auth/jwt";

// Providers
import CredentialsProvider from "next-auth/providers/credentials";

import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "@/types/jwt";
import { ErrorResponse } from "@/types/response";
import { AdapterUser } from "next-auth/adapters";
import { BACKEND_API_URL } from "@/lib/constants";

const handler: NextAuthOptions = {
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
    //error: "/auth/login",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        const res = await fetch(`${BACKEND_API_URL}/auth/login/`, {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          const errorResponse: ErrorResponse = data as ErrorResponse;
          throw new Error(errorResponse.code);
        }

        const user = data.user;

        if (res.ok && user) {
          user.access = data.access;
          user.refresh = data.refresh;
          return user;
        } else {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },

    async jwt({
      token,
      user,
      account,
    }: {
      token: JWT;
      account: Account | null;
      user: User | AdapterUser;
    }) {
      if (account) {
        // retrieve account from provider

        const provider_access_token = account.access_token;

        if (provider_access_token) {
          console.log(provider_access_token, account.id_token);
          const providerAuth = await fetch(
            `${BACKEND_API_URL}/auth/${account.provider}/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                access_token: provider_access_token,
                id_token: account.id_token,
              }),
            },
          );

          const providerData = await providerAuth.json();

          if (providerData.success && providerData.success === false) {
            return token;
          } else {
            user.access = providerData.access;
            user.refresh = providerData.refresh;

            const decoded_token = jwtDecode<JwtPayload>(user.access);

            user.id = Number(decoded_token.user_id);
            user.name =
              decoded_token.first_name + " " + decoded_token.last_name;
            user.email = decoded_token.email;
            token.user_implicit_id = decoded_token.user_implicit_id;

            token.access = providerData.access;
            token.refresh = providerData.refresh;

            token.jti = decoded_token.jti;
            token.exp = decoded_token.exp;
            token.token_type = decoded_token.token_type;
            token.user_id = decoded_token.user_id;
            token.first_name = decoded_token.first_name;
            token.last_name = decoded_token.last_name;

            token.email = decoded_token.email;

            return token;
          }
        }
      }

      if (user) {
        token.access = user.access;
        token.refresh = user.refresh;

        const decoded_token = jwtDecode<JwtPayload>(token.access);

        user.id = Number(decoded_token.user_id);
        user.name = decoded_token.first_name + " " + decoded_token.last_name;
        user.email = decoded_token.email;
        token.user_implicit_id = decoded_token.user_implicit_id;

        token.jti = decoded_token.jti;
        token.exp = decoded_token.exp;
        token.token_type = decoded_token.token_type;
        token.user_id = decoded_token.user_id;
        token.first_name = decoded_token.first_name;
        token.last_name = decoded_token.last_name;

        token.email = decoded_token.email;

        const expiresIn = decoded_token.exp - decoded_token.iat;

        if (expiresIn) {
          token.exp = Date.now() + expiresIn * 1000;
        } else {
          token.exp = Date.now() + 60 * 60;
        }

        return token;
      }

      // call verify token endpoint

      const verifyRes = await fetch(`${BACKEND_API_URL}/auth/token/verify/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token.access }),
      });

      const verifyData = await verifyRes.json();

      if (verifyData.success != null && verifyData.success === false) {
        // refresh token

        const refreshRes = await fetch(
          `${BACKEND_API_URL}/auth/token/refresh/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh: token.refresh }),
          },
        );

        const refreshData = await refreshRes.json();

        if (refreshData.success != null && refreshData.success === false) {
          // if refresh fails, sign out
          throw new Error("Refresh failed");
        }

        if (!refreshRes.ok) {
          throw new Error("Refresh failed");
        } else {
          token.access = refreshData.access;
          token.refresh = refreshData.refresh;

          return token;
        }
      }

      return token;
    },

    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
      user: AdapterUser;
    }) {
      if (!token || !token.access) {
        return {} as Session;
      }

      session.user = {
        id: token.user_id,
        email: token.email,
        name: token.first_name + " " + token.last_name,
      };

      return session;
    },
  },
};

export default handler;
