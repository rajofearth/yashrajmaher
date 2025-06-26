import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
	fetchOptions: {
		onError: ctx => {
			// Handle global auth errors
			if (ctx.response?.status === 401) {
				// Unauthorized - could redirect to login
				window.location.href = "/login";
			}
		},
	},
});

export const { signIn, signUp, signOut, useSession } = authClient;
