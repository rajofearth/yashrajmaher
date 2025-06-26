import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import LogoutButton from "./logout-button";
import { headers } from "next/headers";
import { auth } from "@/app/auth";
import Link from "next/link";

export default async function DashboardPage() {
	// Get session from better-auth
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	// Redirect to login if not authenticated
	if (!session) {
		redirect("/login");
	}

	const { user } = session;

	return (
		<div className="bg-background min-h-screen py-8">
			<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-foreground text-3xl font-bold">Dashboard</h1>
							<p className="text-muted-foreground mt-1">Welcome back, {user.name}!</p>
						</div>
						<LogoutButton />
					</div>
				</div>

				{/* User Profile Card */}
				<Card className="mb-6">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<User className="h-5 w-5" />
							Profile Information
						</CardTitle>
						<CardDescription>Your account details and information</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-start space-x-4">
							<Avatar className="h-16 w-16">
								<AvatarImage src={user.image || undefined} alt={user.name} />
								<AvatarFallback className="text-lg">
									{user.name
										.split(" ")
										.map(n => n[0])
										.join("")
										.toUpperCase()}
								</AvatarFallback>
							</Avatar>

							<div className="flex-1 space-y-3">
								<div>
									<h3 className="text-foreground text-lg font-semibold">{user.name}</h3>
									<div className="text-muted-foreground flex items-center gap-2">
										<Mail className="h-4 w-4" />
										<span>{user.email}</span>
										{user.emailVerified && (
											<Badge variant="secondary" className="text-xs">
												Verified
											</Badge>
										)}
									</div>
								</div>

								<div className="text-muted-foreground flex items-center gap-2 text-sm">
									<Calendar className="h-4 w-4" />
									<span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Dashboard Content */}
				<div className="grid gap-6 md:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle>Quick Actions</CardTitle>
							<CardDescription>Common tasks and shortcuts</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							<Button asChild className="w-full justify-start">
								<Link href="/blog">View Blog Posts</Link>
							</Button>
							<Button asChild variant="outline" className="w-full justify-start">
								<Link href="/about">About Page</Link>
							</Button>
							<Button asChild variant="outline" className="w-full justify-start">
								<Link href="/contact">Contact Page</Link>
							</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Account Stats</CardTitle>
							<CardDescription>Your account overview</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground text-sm">Account Status</span>
								<Badge variant="default">Active</Badge>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground text-sm">Email Status</span>
								<Badge variant={user.emailVerified ? "default" : "secondary"}>
									{user.emailVerified ? "Verified" : "Unverified"}
								</Badge>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground text-sm">Last Updated</span>
								<span className="text-foreground text-sm font-medium">
									{new Date(user.updatedAt).toLocaleDateString()}
								</span>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
