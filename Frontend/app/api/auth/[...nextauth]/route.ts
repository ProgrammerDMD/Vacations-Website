import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import * as jose from "jose";
import { LoginSchema } from "@/app/types/types";
import { signOut } from "next-auth/react";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "johnsmith" },
                password: { label: "Password", type: "password"},
            },
            async authorize(credentials) {
                const parsedCredentials = LoginSchema.safeParse(credentials);
                if (!parsedCredentials.success) return null;

                try {
                    const res = await fetch("http://localhost:3001/users/login", {
                        method: 'POST',
                        body: JSON.stringify({
                            "username": parsedCredentials.data.username,
                            "password": parsedCredentials.data.password
                        }),
                        headers: {
                            "Content-Type": "application/json",
                        }
                    });
                    const response: { token: string } = await res.json();
                    if (res.ok && response && response.token) {
                        const payload = await jose.decodeJwt(response.token);
                        return { id: payload["id"] as string, username: payload["username"] as string, name: payload["name"] as string, accessToken: response.token, accessTokenExpire: payload["exp"] };
                    } else {
                        console.error('Authorization failed');
                        return null;
                    }
                } catch (error) {
                    console.error('Authorization error:', error);
                    return null;
                }
            }
        })
    ],
    pages: {
        signIn: "/login",
        newUser: "/register"
    },
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.username = user.username;
                token.accessTokenExpire = user.accessTokenExpire;
            }

            if (token.accessTokenExpire && Date.now() / 1000 < token.accessTokenExpire) {
                return token;
            }

            return {
                accessToken: undefined,
                username: undefined,
                accessTokenExpire: undefined
            };
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.accessTokenExpire = token.accessTokenExpire;
            return session;
        }
    }

};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };