import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import prisma from "@/app/lib/prisma";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
        maxAge: 60 * 60 * 24 * 30
    },
    pages: {
        signIn: '/login',
    },
    // Configure authentication providers
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: {},
                password: {},
                rememberMe: {}
            },
            async authorize(credentials, req) {
                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials?.email
                    }
                })

                const passwordHash = user?.passwordHash
                const passwordToCheck = credentials?.password

                if (!passwordHash || !passwordToCheck) return null

                const isPasswordCorrect = await compare(passwordToCheck, passwordHash);
                console.log("Remember Me:", credentials.rememberMe)
                if (isPasswordCorrect) {
                    return {
                        id: user.id.toString(),
                        email: user.email,
                        fullName: user.fullName,
                        rememberMe: credentials.rememberMe === "on"
                    }
                }

                return null
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.fullName = user.fullName;
                token.rememberMe = user.rememberMe;
                token.expires = user.rememberMe ? Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 : Math.floor(Date.now() / 1000) + 60 * 60 * 24;
            }
            delete token.name;
            // console.log("JWT token after modification:", token);
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.fullName = token.fullName;
            }
            delete session.user.name
            return session;
        },

    }

}
