"use server";

import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { z } from "zod";

// Validation schemas
const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginFormState = {
  errors?: {
    email?: string[];
    password?: string[];
    general?: string;
  };
  success?: boolean;
};

export type SignupFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    general?: string;
  };
  success?: boolean;
};

export async function loginAction(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
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
    console.error("Login error:", error);
    return {
      errors: {
        general: "An error occurred during login. Please try again.",
      },
    };
  }
}

export async function signupAction(
  prevState: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
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
  } catch (error: any) {
    console.error("Signup error:", error);
    
    // Handle specific errors
    if (error.message?.includes("email")) {
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
    await auth.api.signOut();
    redirect("/");
  } catch (error) {
    console.error("Logout error:", error);
    redirect("/");
  }
}
