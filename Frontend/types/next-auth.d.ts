import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            name: string
            username: string
        } & DefaultSession["user"]
        accessToken?: string
        accessTokenExpire?: number
    }

    interface User {
        accessToken?: string
        username?: string
        name?: string
        accessTokenExpire?: number
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string
        accessTokenExpire?: number
    }
}