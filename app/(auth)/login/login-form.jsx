"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { error as logError } from "@/lib/logger";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { SIGNUP_DISABLED } from "@/app/auth";

export default function LoginForm() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState(null);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const handleSubmit = useCallback(
		async e => {
			e.preventDefault();
			setIsLoading(true);
			setError(null);

			try {
				const { data, error: authError } = await authClient.signIn.email({
					email: formData.email,
					password: formData.password,
					callbackURL: "/dashboard",
				});

				if (authError) {
					setError(authError.message || "Invalid credentials. Please try again.");
					return;
				}

				if (data) {
					// Success - redirect to dashboard
					toast.success("Successfully signed in!");
					router.push("/dashboard");
					router.refresh(); // Refresh to update session state
				}
			} catch (error) {
				// Record the error for debugging while showing a generic message to users
				logError("Login error:", error);
				setError("An unexpected error occurred. Please try again.");
			} finally {
				setIsLoading(false);
			}
		},
		[formData.email, formData.password, router]
	);

	const handleInputChange = useCallback(
		e => {
			const { name, value } = e.target;
			setFormData(prev => ({ ...prev, [name]: value }));
			// Clear error when user starts typing
			if (error) setError(null);
		},
		[error]
	);

	const togglePasswordVisibility = useCallback(() => {
		setShowPassword(prev => !prev);
	}, []);

	return (
		<div className="mx-auto w-full max-w-md">
			<form onSubmit={handleSubmit} className="bg-card flex flex-col gap-8 rounded-lg border p-8 shadow-lg">
				<div className="flex flex-col items-center gap-3 text-center">
					<h1 className="text-foreground font-serif text-3xl font-bold">Welcome Back</h1>
					<p className="text-muted-foreground font-medium">Sign in to your account to continue</p>
				</div>

				{error && (
					<Alert variant="destructive">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<div className="grid gap-6">
					<div className="grid gap-3">
						<Label htmlFor="email" className="text-foreground text-sm font-medium">
							Email Address
						</Label>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="Enter your email"
							value={formData.email}
							onChange={handleInputChange}
							required
							disabled={isLoading}
							autoComplete="email"
							className="bg-input border-border h-12 px-4 shadow-sm transition-shadow duration-200 focus:shadow-md"
						/>
					</div>

					<div className="grid gap-3">
						<div className="flex items-center justify-between">
							<Label htmlFor="password" className="text-foreground text-sm font-medium">
								Password
							</Label>
							<a
								href="#"
								className="text-primary hover:text-primary/80 text-sm font-medium underline-offset-4 transition-colors hover:underline"
							>
								Forgot password?
							</a>
						</div>
						<div className="relative">
							<Input
								id="password"
								name="password"
								type={showPassword ? "text" : "password"}
								placeholder="Enter your password"
								value={formData.password}
								onChange={handleInputChange}
								required
								disabled={isLoading}
								autoComplete="current-password"
								className="bg-input border-border h-12 px-4 pr-12 shadow-sm transition-shadow duration-200 focus:shadow-md"
							/>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
								onClick={togglePasswordVisibility}
								disabled={isLoading}
							>
								{showPassword ? (
									<EyeOff className="text-muted-foreground h-4 w-4" />
								) : (
									<Eye className="text-muted-foreground h-4 w-4" />
								)}
							</Button>
						</div>
					</div>

					<Button
						type="submit"
						className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 w-full font-medium shadow-md transition-all duration-200 hover:shadow-lg"
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Signing in...
							</>
						) : (
							"Sign In"
						)}
					</Button>
				</div>

				{!SIGNUP_DISABLED && (
					<div className="text-muted-foreground text-center text-sm">
						Don&apos;t have an account?{" "}
						<Link
							href="/signup"
							className="text-primary hover:text-primary/80 font-medium underline-offset-4 transition-colors hover:underline"
						>
							Create one here
						</Link>
					</div>
				)}
			</form>
		</div>
	);
}
