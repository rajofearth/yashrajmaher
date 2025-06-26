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

// Mock data for blog posts - Replace with actual database queries
const mockPosts = [
	{
		id: 1,
		title: "Getting Started with Next.js 14",
		slug: "getting-started-nextjs-14",
		status: "published",
		createdAt: "2024-01-15",
		updatedAt: "2024-01-20",
		views: 1250,
		excerpt: "Learn the fundamentals of Next.js 14 and its new features..."
	},
	{
		id: 2,
		title: "Building Modern UIs with Shadcn/UI",
		slug: "building-modern-uis-shadcn",
		status: "draft",
		createdAt: "2024-01-10",
		updatedAt: "2024-01-18",
		views: 850,
		excerpt: "A comprehensive guide to using Shadcn/UI components..."
	},
	{
		id: 3,
		title: "TypeScript Best Practices for 2024",
		slug: "typescript-best-practices-2024",
		status: "published",
		createdAt: "2024-01-05",
		updatedAt: "2024-01-15",
		views: 2100,
		excerpt: "Essential TypeScript patterns and practices for modern development..."
	},
	{
		id: 4,
		title: "Deployment Strategies with Vercel",
		slug: "deployment-strategies-vercel",
		status: "scheduled",
		createdAt: "2024-01-20",
		updatedAt: "2024-01-22",
		views: 0,
		excerpt: "Master deployment workflows with Vercel and CI/CD..."
	},
	{
		id: 5,
		title: "React Server Components Deep Dive",
		slug: "react-server-components-deep-dive",
		status: "published",
		createdAt: "2023-12-15",
		updatedAt: "2023-12-20",
		views: 3200,
		excerpt: "Understanding the power of React Server Components..."
	},
	{
		id: 6,
		title: "Authentication with Better Auth",
		slug: "authentication-better-auth",
		status: "draft",
		createdAt: "2024-01-25",
		updatedAt: "2024-01-25",
		views: 120,
		excerpt: "Implementing secure authentication in modern web apps..."
	},
];

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

	// Calculate stats
	const totalPosts = mockPosts.length;
	const publishedPosts = mockPosts.filter(post => post.status === "published").length;
	const draftPosts = mockPosts.filter(post => post.status === "draft").length;
	const totalViews = mockPosts.reduce((sum, post) => sum + post.views, 0);

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
				<PostsManagement posts={mockPosts} />
			</div>
		</div>
	);
}
