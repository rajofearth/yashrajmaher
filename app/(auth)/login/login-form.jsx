"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginForm() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState(null);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const handleSubmit = async e => {
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
					<CardTitle className="text-foreground text-center text-2xl">Welcome back</CardTitle>
					<CardDescription className="text-muted-foreground text-center">
						Enter your credentials to access your account
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
							<Label htmlFor="email" className="text-foreground">
								Email
							</Label>
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
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password" className="text-foreground">
								Password
							</Label>
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
									className="pr-10"
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
					</CardContent>

					<CardFooter className="flex flex-col space-y-4">
						<Button type="submit" size="default" variant="default" className="w-full" disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Signing in...
								</>
							) : (
								"Sign In"
							)}
						</Button>

						<div className="text-center text-sm">
							<span className="text-muted-foreground">Don't have an account? </span>
							<Link href="/signup" className="text-primary hover:text-primary/80 font-medium">
								Sign up
							</Link>
						</div>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
