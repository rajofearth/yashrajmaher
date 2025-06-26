"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function SignupForm() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [error, setError] = useState(null);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const handleSubmit = useCallback(async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		// Client-side validation
		if (formData.password !== formData.confirmPassword) {
			setError("Passwords don't match");
			setIsLoading(false);
			return;
		}

		if (formData.password.length < 6) {
			setError("Password must be at least 6 characters");
			setIsLoading(false);
			return;
		}

		try {
			const { data, error: authError } = await authClient.signUp.email({
				email: formData.email,
				password: formData.password,
				name: formData.name,
				callbackURL: "/dashboard",
			});

			if (authError) {
				if (authError.message.toLowerCase().includes("email")) {
					setError("Email already exists. Please use a different email or sign in.");
				} else {
					setError(authError.message || "Failed to create account. Please try again.");
				}
				return;
			}

			if (data) {
				// Success - redirect to dashboard
				toast.success("Account created successfully! Welcome!");
				router.push("/dashboard");
				router.refresh(); // Refresh to update session state
			}
		} catch (err) {
			console.error("Signup error:", err);
			setError("An unexpected error occurred. Please try again.");
		} finally {
			setIsLoading(false);
		}
	}, [formData.email, formData.password, formData.name, formData.confirmPassword, router]);

	const handleInputChange = useCallback((e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		// Clear error when user starts typing
		if (error) setError(null);
	}, [error]);

	const togglePasswordVisibility = useCallback(() => {
		setShowPassword(prev => !prev);
	}, []);

	const toggleConfirmPasswordVisibility = useCallback(() => {
		setShowConfirmPassword(prev => !prev);
	}, []);

	return (
		<div className="w-full max-w-md mx-auto">
			<form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 bg-card rounded-lg shadow-lg border">
				<div className="flex flex-col items-center gap-2 text-center">
					<h1 className="text-2xl font-serif font-bold text-foreground">Create Account</h1>
					<p className="text-sm text-muted-foreground">Enter your details to get started</p>
				</div>

				{error && (
					<Alert variant="destructive" className="py-2">
						<AlertDescription className="text-sm">{error}</AlertDescription>
					</Alert>
				)}

				<div className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="name" className="text-sm font-medium text-foreground">
							Full Name
						</Label>
						<Input
							id="name"
							name="name"
							type="text"
							placeholder="Enter your full name"
							value={formData.name}
							onChange={handleInputChange}
							required
							disabled={isLoading}
							autoComplete="name"
							className="h-10 px-3 bg-input border-border focus:shadow-sm transition-shadow duration-200"
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="email" className="text-sm font-medium text-foreground">
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
							className="h-10 px-3 bg-input border-border focus:shadow-sm transition-shadow duration-200"
						/>
					</div>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div className="grid gap-2">
							<Label htmlFor="password" className="text-sm font-medium text-foreground">
								Password
							</Label>
							<div className="relative">
								<Input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									placeholder="Create password"
									value={formData.password}
									onChange={handleInputChange}
									required
									disabled={isLoading}
									autoComplete="new-password"
									className="h-10 px-3 pr-10 bg-input border-border focus:shadow-sm transition-shadow duration-200"
								/>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="absolute top-0 right-0 h-full px-2 py-1 hover:bg-transparent"
									onClick={togglePasswordVisibility}
									disabled={isLoading}
								>
									{showPassword ? (
										<EyeOff className="text-muted-foreground h-3 w-3" />
									) : (
										<Eye className="text-muted-foreground h-3 w-3" />
									)}
								</Button>
							</div>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
								Confirm
							</Label>
							<div className="relative">
								<Input
									id="confirmPassword"
									name="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									placeholder="Confirm password"
									value={formData.confirmPassword}
									onChange={handleInputChange}
									required
									disabled={isLoading}
									autoComplete="new-password"
									className="h-10 px-3 pr-10 bg-input border-border focus:shadow-sm transition-shadow duration-200"
								/>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="absolute top-0 right-0 h-full px-2 py-1 hover:bg-transparent"
									onClick={toggleConfirmPasswordVisibility}
									disabled={isLoading}
								>
									{showConfirmPassword ? (
										<EyeOff className="text-muted-foreground h-3 w-3" />
									) : (
										<Eye className="text-muted-foreground h-3 w-3" />
									)}
								</Button>
							</div>
						</div>
					</div>

					<Button
						type="submit"
						className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-md hover:shadow-lg transition-all duration-200 mt-2"
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Creating account...
							</>
						) : (
							"Create Account"
						)}
					</Button>
				</div>

				<div className="text-center text-xs text-muted-foreground">
					Already have an account?{" "}
					<Link
						href="/login"
						className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline transition-colors"
					>
						Sign in here
					</Link>
				</div>
			</form>
		</div>
	);
}
