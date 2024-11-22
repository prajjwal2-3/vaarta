import NextAuth from "next-auth";
import prisma from "./lib/db";
import type { Adapter } from 'next-auth/adapters';
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";


export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma) as Adapter,
    session: {
        strategy: "jwt",
    },
    ...authConfig
})