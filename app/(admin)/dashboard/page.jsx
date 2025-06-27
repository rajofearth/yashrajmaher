import { ThemeToggle } from "@/components/ui/theme-toggle";
import truncateText from "@/app/utils/truncateText";
import PostsManagement from "./posts-management";
import { redirect } from "next/navigation";
import LogoutButton from "./logout-button";
import { headers } from "next/headers";
import { auth } from "@/app/auth";
import prisma from "@/prisma/db";
import { getDashboardMetrics } from "@/lib/metrics";
import DashboardStats from "./dashboard-stats";

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

	// Fetch real posts from database
	const posts = await prisma.post.findMany({
		orderBy: { updatedAt: "desc" },
		select: {
			id: true,
			title: true,
			slug: true,
			description: true,
			status: true,
			views: true,
			createdAt: true,
			updatedAt: true,
		},
	});

	// Transform posts for the component
	const transformedPosts = posts.map(post => ({
		...post,
		excerpt: truncateText(post.description, 100), // Use description as excerpt
		createdAt: post.createdAt.toISOString().split("T")[0], // Format date
		updatedAt: post.updatedAt.toISOString().split("T")[0], // Format date
	}));

	// Fetch initial metrics server-side
	const initialMetrics = await getDashboardMetrics();

	return (
		<div className="bg-background min-h-screen">
			<div className="border-b">
				<div className="flex h-16 items-center px-6">
					<div className="flex flex-1 items-center space-x-4">
						<h1 className="text-xl font-semibold">Blog Dashboard</h1>
					</div>
					<div className="flex items-center space-x-4">
						<span className="text-muted-foreground text-sm">Welcome, {user.name}</span>
						<ThemeToggle />
						<LogoutButton />
					</div>
				</div>
			</div>

			<div className="flex-1 space-y-6 p-6">
				{/* Live Stats Overview */}
				<DashboardStats initialStats={initialMetrics} />

				{/* Main Content - Client Component */}
				<PostsManagement posts={transformedPosts} />
			</div>
		</div>
	);
}
