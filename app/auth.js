import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { PrismaClient } from "@/generated/prisma";
import { betterAuth } from "better-auth";

const prisma = new PrismaClient();

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
		disableSignUp: true,
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24, // 1 day
	},
	secret: process.env.BETTER_AUTH_SECRET,
	baseURL: process.env.BETTER_AUTH_URL,
	trustedOrigins: [
		process.env.BETTER_AUTH_URL,
		process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
		"http://localhost:3000",
		"http://127.0.0.1:3000",
		// Add your production domain here when deploying
		"https://yashrajmaher.vercel.app",
	].filter(Boolean), // Remove any undefined values
	plugins: [nextCookies()],
});

export const SIGNUP_DISABLED = true; // keep in sync with emailAndPassword.disableSignUp
