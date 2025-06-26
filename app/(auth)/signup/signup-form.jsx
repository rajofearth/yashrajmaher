"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock, Mail, User, Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

	const handleSubmit = async e => {
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
		} catch {
			setError("An unexpected error occurred. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleInputChange = e => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		// Clear error when user starts typing
		if (error) setError(null);
	};

	return (
		<div className="bg-background flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-foreground text-center text-2xl">Create an account</CardTitle>
					<CardDescription className="text-muted-foreground text-center">
						Enter your details to get started
					</CardDescription>
				</CardHeader>

				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-4">
						{error && (
							<Alert variant="destructive">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<div className="space-y-2">
							<Label htmlFor="name" className="text-foreground">
								Full Name
							</Label>
							<div className="relative">
								<User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
								<Input
									id="name"
									name="name"
									type="text"
									placeholder="John Doe"
									value={formData.name}
									onChange={handleInputChange}
									required
									disabled={isLoading}
									autoComplete="name"
									className="pl-10"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email" className="text-foreground">
								Email
							</Label>
							<div className="relative">
								<Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="your@email.com"
									value={formData.email}
									onChange={handleInputChange}
									required
									disabled={isLoading}
									autoComplete="email"
									className="pl-10"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password" className="text-foreground">
								Password
							</Label>
							<div className="relative">
								<Lock className="text-muted-foreground absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 transform" />
								<Input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									placeholder="Create a strong password"
									value={formData.password}
									onChange={handleInputChange}
									required
									disabled={isLoading}
									autoComplete="new-password"
									className="pr-10 pl-10"
								/>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
									onClick={() => setShowPassword(!showPassword)}
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

						<div className="space-y-2">
							<Label htmlFor="confirmPassword" className="text-foreground">
								Confirm Password
							</Label>
							<div className="relative">
								<Lock className="text-muted-foreground absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 transform" />
								<Input
									id="confirmPassword"
									name="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									placeholder="Confirm your password"
									value={formData.confirmPassword}
									onChange={handleInputChange}
									required
									disabled={isLoading}
									autoComplete="new-password"
									className="pr-10 pl-10"
								/>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									disabled={isLoading}
								>
									{showConfirmPassword ? (
										<EyeOff className="text-muted-foreground h-4 w-4" />
									) : (
										<Eye className="text-muted-foreground h-4 w-4" />
									)}
								</Button>
							</div>
						</div>
					</CardContent>

					<CardFooter className="flex flex-col space-y-4">
						<Button type="submit" size="default" variant="default" className="w-full" disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating account...
								</>
							) : (
								"Create Account"
							)}
						</Button>

						<div className="text-center text-sm">
							<span className="text-muted-foreground">Already have an account? </span>
							<Link href="/login" className="text-primary hover:text-primary/80 font-medium">
								Sign in
							</Link>
						</div>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
