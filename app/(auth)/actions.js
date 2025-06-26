"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/app/auth";
import { z } from "zod";

// Validation schemas
const LoginSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

const SignupSchema = z
	.object({
		name: z.string().min(2, "Name must be at least 2 characters"),
		email: z.string().email("Invalid email address"),
		password: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z.string(),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export async function loginAction(prevState, formData) {
	// Validate form data
	const validatedFields = LoginSchema.safeParse({
		email: formData.get("email"),
		password: formData.get("password"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const { email, password } = validatedFields.data;

	try {
		const session = await auth.api.signInEmail({
			body: {
				email,
				password,
			},
		});

		if (session) {
			redirect("/dashboard");
		}

		return {
			errors: {
				general: "Invalid credentials",
			},
		};
	} catch (error) {
		// Don't log redirect exceptions as errors - they're expected behavior
		if (
			error &&
			typeof error === "object" &&
			"digest" in error &&
			typeof error.digest === "string" &&
			error.digest.includes("NEXT_REDIRECT")
		) {
			throw error; // Re-throw redirect exceptions
		}

		return {
			errors: {
				general: "An error occurred during login. Please try again.",
			},
		};
	}
}

export async function signupAction(prevState, formData) {
	// Validate form data
	const validatedFields = SignupSchema.safeParse({
		name: formData.get("name"),
		email: formData.get("email"),
		password: formData.get("password"),
		confirmPassword: formData.get("confirmPassword"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const { name, email, password } = validatedFields.data;

	try {
		const user = await auth.api.signUpEmail({
			body: {
				name,
				email,
				password,
			},
		});

		if (user) {
			redirect("/dashboard");
		}

		return {
			errors: {
				general: "Failed to create account",
			},
		};
	} catch (error) {
		// Don't log redirect exceptions as errors - they're expected behavior
		if (
			error &&
			typeof error === "object" &&
			"digest" in error &&
			typeof error.digest === "string" &&
			error.digest.includes("NEXT_REDIRECT")
		) {
			throw error; // Re-throw redirect exceptions
		}

		// Handle specific errors
		if (
			error &&
			typeof error === "object" &&
			"message" in error &&
			typeof error.message === "string" &&
			error.message.includes("email")
		) {
			return {
				errors: {
					email: ["Email already exists"],
				},
			};
		}

		return {
			errors: {
				general: "An error occurred during signup. Please try again.",
			},
		};
	}
}

export async function logoutAction() {
	try {
		await auth.api.signOut({
			headers: await headers(),
		});
		redirect("/");
	} catch (error) {
		// Don't log redirect exceptions as errors - they're expected behavior
		if (
			error &&
			typeof error === "object" &&
			"digest" in error &&
			typeof error.digest === "string" &&
			error.digest.includes("NEXT_REDIRECT")
		) {
			throw error; // Re-throw redirect exceptions
		}

		redirect("/");
	}
}
