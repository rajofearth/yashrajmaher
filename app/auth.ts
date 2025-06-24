import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/generated/prisma";
import { nextCookies } from "better-auth/next-js";

const prisma = new PrismaClient();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false, // Set to true in production
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
    },
    secret: process.env.BETTER_AUTH_SECRET || "your-secret-key-change-this-in-production",
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    trustedOrigins: [
        process.env.BETTER_AUTH_URL || "http://localhost:3000",
        process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000", 
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://192.168.1.8:3000", // Your network address
        // Add your production domain here when deploying
        // "https://yourdomain.com"
    ].filter(Boolean), // Remove any undefined values
    plugins: [nextCookies()],
});