import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
// import { Session } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: User,
    }

    interface User {
        id: string;
        email: string;
        fullName: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        email: string;
        fullName: string;
    }
}
