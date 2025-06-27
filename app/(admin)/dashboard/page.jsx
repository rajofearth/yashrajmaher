import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { PlusCircle, Edit, Eye, FileText, TrendingUp } from "lucide-react";
import { redirect } from "next/navigation";
import LogoutButton from "./logout-button";
import { headers } from "next/headers";
import { auth } from "@/app/auth";
import PostsManagement from "./posts-management";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import prisma from "@/prisma/db";
import truncateText from "@/app/utils/truncateText";

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
		}
	});

	// Transform posts for the component
	const transformedPosts = posts.map(post => ({
		...post,
		excerpt: truncateText(post.description, 100), // Use description as excerpt
		createdAt: post.createdAt.toISOString().split('T')[0], // Format date
		updatedAt: post.updatedAt.toISOString().split('T')[0], // Format date
	}));

	// Calculate stats
	const totalPosts = transformedPosts.length;
	const publishedPosts = transformedPosts.filter(post => post.status === "published").length;
	const draftPosts = transformedPosts.filter(post => post.status === "draft").length;
	const totalViews = transformedPosts.reduce((sum, post) => sum + post.views, 0);

	return (
		<div className="bg-background min-h-screen">
			<div className="border-b">
				<div className="flex h-16 items-center px-6">
					<div className="flex items-center space-x-4 flex-1">
						<h1 className="text-xl font-semibold">Blog Dashboard</h1>
					</div>
					<div className="flex items-center space-x-4">
						<span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
						<ThemeToggle />
						<LogoutButton />
					</div>
				</div>
			</div>

			<div className="flex-1 space-y-6 p-6">
				{/* Stats Overview */}
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Total Posts</CardTitle>
							<FileText className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{totalPosts}</div>
							<p className="text-xs text-muted-foreground">All blog posts</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Published</CardTitle>
							<Eye className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{publishedPosts}</div>
							<p className="text-xs text-muted-foreground">Live posts</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Drafts</CardTitle>
							<Edit className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{draftPosts}</div>
							<p className="text-xs text-muted-foreground">Work in progress</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Total Views</CardTitle>
							<TrendingUp className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
							<p className="text-xs text-muted-foreground">All time views</p>
						</CardContent>
					</Card>
				</div>

				{/* Main Content - Client Component */}
				<PostsManagement posts={transformedPosts} />
			</div>
		</div>
	);
}
