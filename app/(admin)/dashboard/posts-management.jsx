"use client";

import {
	PlusCircle,
	Search,
	MoreHorizontal,
	Edit,
	Trash2,
	Eye,
	Calendar as CalendarIcon,
	Filter,
	X,
	SortAsc,
	SortDesc,
	RotateCcw,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Calendar } from "@/components/ui/calendar";
import truncateText from "@/app/utils/truncateText";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const getStatusColor = status => {
	switch (status) {
		case "published":
			return "default";
		case "draft":
			return "secondary";
		case "scheduled":
			return "outline";
		default:
			return "secondary";
	}
};

const formatDate = dateString => {
	return new Date(dateString).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

// Client component for filters
function PostFilters({ posts, onFilteredPosts }) {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [sortBy, setSortBy] = useState("updatedAt");
	const [sortOrder, setSortOrder] = useState("desc");
	const [viewsRange, setViewsRange] = useState([0, 5000]);
	const [dateRange, setDateRange] = useState({
		from: null,
		to: null,
	});
	const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

	// Calculate max views for slider
	const maxViews = Math.max(...posts.map(post => post.views));

	// Initialize views range with actual max value
	React.useEffect(() => {
		setViewsRange([0, maxViews]);
	}, [maxViews]);

	// Filter and sort posts
	const filteredPosts = useMemo(() => {
		let filtered = [...posts];

		// Search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				post =>
					post.title.toLowerCase().includes(query) ||
					post.excerpt.toLowerCase().includes(query) ||
					post.slug.toLowerCase().includes(query)
			);
		}

		// Status filter
		if (statusFilter !== "all") {
			filtered = filtered.filter(post => post.status === statusFilter);
		}

		// Views range filter
		filtered = filtered.filter(post => post.views >= viewsRange[0] && post.views <= viewsRange[1]);

		// Date range filter
		if (dateRange.from && dateRange.to) {
			filtered = filtered.filter(post => {
				const postDate = new Date(post.createdAt);
				return postDate >= dateRange.from && postDate <= dateRange.to;
			});
		}

		// Sort posts
		filtered.sort((a, b) => {
			let aValue, bValue;

			switch (sortBy) {
				case "title":
					aValue = a.title.toLowerCase();
					bValue = b.title.toLowerCase();
					break;
				case "views":
					aValue = a.views;
					bValue = b.views;
					break;
				case "createdAt":
					aValue = new Date(a.createdAt);
					bValue = new Date(b.createdAt);
					break;
				case "updatedAt":
				default:
					aValue = new Date(a.updatedAt);
					bValue = new Date(b.updatedAt);
					break;
			}

			if (sortOrder === "asc") {
				return aValue > bValue ? 1 : -1;
			} else {
				return aValue < bValue ? 1 : -1;
			}
		});

		return filtered;
	}, [posts, searchQuery, statusFilter, sortBy, sortOrder, viewsRange, dateRange]);

	// Update parent component
	React.useEffect(() => {
		onFilteredPosts(filteredPosts);
	}, [filteredPosts, onFilteredPosts]);

	// Clear all filters
	const clearAllFilters = () => {
		setSearchQuery("");
		setStatusFilter("all");
		setSortBy("updatedAt");
		setSortOrder("desc");
		setViewsRange([0, maxViews]);
		setDateRange({ from: null, to: null });
		setShowAdvancedFilters(false);
	};

	// Count active filters
	const activeFiltersCount = [
		searchQuery.trim(),
		statusFilter !== "all",
		viewsRange[0] > 0 || viewsRange[1] < maxViews,
		dateRange.from || dateRange.to,
	].filter(Boolean).length;

	return (
		<div className="space-y-4">
			{/* Main Filters Row */}
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-2">
					{/* Search Input */}
					<div className="relative">
						<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
						<Input
							placeholder="Search posts by title, content, or slug..."
							className="w-[350px] pl-10"
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
						/>
						{searchQuery && (
							<Button
								variant="ghost"
								size="sm"
								className="absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2 transform p-0"
								onClick={() => setSearchQuery("")}
							>
								<X className="h-3 w-3" />
							</Button>
						)}
					</div>

					{/* Status Filter */}
					<Select value={statusFilter} onValueChange={setStatusFilter}>
						<SelectTrigger className="w-[140px]">
							<SelectValue placeholder="Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Status</SelectItem>
							<SelectItem value="published">Published</SelectItem>
							<SelectItem value="draft">Draft</SelectItem>
							<SelectItem value="scheduled">Scheduled</SelectItem>
						</SelectContent>
					</Select>

					{/* Sort By */}
					<Select value={sortBy} onValueChange={setSortBy}>
						<SelectTrigger className="w-[140px]">
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="updatedAt">Last Updated</SelectItem>
							<SelectItem value="createdAt">Created Date</SelectItem>
							<SelectItem value="title">Title</SelectItem>
							<SelectItem value="views">Views</SelectItem>
						</SelectContent>
					</Select>

					{/* Sort Order */}
					<Button
						variant="outline"
						size="sm"
						onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
						className="px-3"
					>
						{sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
					</Button>

					{/* More Filters */}
					<Popover open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
						<PopoverTrigger asChild>
							<Button variant="outline" size="sm" className="relative">
								<Filter className="mr-2 h-4 w-4" />
								More Filters
								{activeFiltersCount > 2 && (
									<Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
										{activeFiltersCount - 2}
									</Badge>
								)}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-80 p-4">
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<h3 className="font-medium">Advanced Filters</h3>
									<Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-8 px-2">
										<RotateCcw className="mr-1 h-3 w-3" />
										Reset
									</Button>
								</div>

								{/* Views Range */}
								<div className="space-y-2">
									<Label className="text-sm font-medium">Views Range</Label>
									<div className="px-2">
										<Slider
											value={viewsRange}
											onValueChange={setViewsRange}
											max={maxViews}
											step={50}
											className="w-full"
										/>
									</div>
									<div className="text-muted-foreground flex justify-between text-xs">
										<span>{viewsRange[0].toLocaleString()}</span>
										<span>{viewsRange[1].toLocaleString()}</span>
									</div>
								</div>

								{/* Date Range */}
								<div className="space-y-2">
									<Label className="text-sm font-medium">Created Date Range</Label>
									<div className="grid grid-cols-2 gap-2">
										<Popover>
											<PopoverTrigger asChild>
												<Button variant="outline" className="justify-start text-left font-normal">
													<CalendarIcon className="mr-2 h-4 w-4" />
													{dateRange.from ? formatDate(dateRange.from.toISOString()) : "From"}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={dateRange.from}
													onSelect={date => setDateRange(prev => ({ ...prev, from: date }))}
													initialFocus
												/>
											</PopoverContent>
										</Popover>

										<Popover>
											<PopoverTrigger asChild>
												<Button variant="outline" className="justify-start text-left font-normal">
													<CalendarIcon className="mr-2 h-4 w-4" />
													{dateRange.to ? formatDate(dateRange.to.toISOString()) : "To"}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={dateRange.to}
													onSelect={date => setDateRange(prev => ({ ...prev, to: date }))}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
									</div>
									{(dateRange.from || dateRange.to) && (
										<Button
											variant="ghost"
											size="sm"
											onClick={() => setDateRange({ from: null, to: null })}
											className="h-8 w-full"
										>
											Clear Date Range
										</Button>
									)}
								</div>
							</div>
						</PopoverContent>
					</Popover>

					{/* Clear Filters Button */}
					{activeFiltersCount > 0 && (
						<Button
							variant="ghost"
							size="sm"
							onClick={clearAllFilters}
							className="text-muted-foreground hover:text-foreground"
						>
							<X className="mr-1 h-3 w-3" />
							Clear All ({activeFiltersCount})
						</Button>
					)}
				</div>
			</div>

			{/* Active Filter Chips */}
			{activeFiltersCount > 0 && (
				<div className="flex flex-wrap gap-2">
					{searchQuery.trim() && (
						<Badge variant="secondary" className="gap-1">
							Search: "{searchQuery}"
							<Button
								variant="ghost"
								size="sm"
								className="h-4 w-4 p-0 hover:bg-transparent"
								onClick={() => setSearchQuery("")}
							>
								<X className="h-3 w-3" />
							</Button>
						</Badge>
					)}

					{statusFilter !== "all" && (
						<Badge variant="secondary" className="gap-1">
							Status: {statusFilter}
							<Button
								variant="ghost"
								size="sm"
								className="h-4 w-4 p-0 hover:bg-transparent"
								onClick={() => setStatusFilter("all")}
							>
								<X className="h-3 w-3" />
							</Button>
						</Badge>
					)}

					{(viewsRange[0] > 0 || viewsRange[1] < maxViews) && (
						<Badge variant="secondary" className="gap-1">
							Views: {viewsRange[0].toLocaleString()} - {viewsRange[1].toLocaleString()}
							<Button
								variant="ghost"
								size="sm"
								className="h-4 w-4 p-0 hover:bg-transparent"
								onClick={() => setViewsRange([0, maxViews])}
							>
								<X className="h-3 w-3" />
							</Button>
						</Badge>
					)}

					{(dateRange.from || dateRange.to) && (
						<Badge variant="secondary" className="gap-1">
							Date: {dateRange.from ? formatDate(dateRange.from.toISOString()) : "Start"} -{" "}
							{dateRange.to ? formatDate(dateRange.to.toISOString()) : "End"}
							<Button
								variant="ghost"
								size="sm"
								className="h-4 w-4 p-0 hover:bg-transparent"
								onClick={() => setDateRange({ from: null, to: null })}
							>
								<X className="h-3 w-3" />
							</Button>
						</Badge>
					)}
				</div>
			)}

			{/* Results Count */}
			<div className="text-muted-foreground text-sm">
				Showing {filteredPosts.length} of {posts.length} posts
				{searchQuery && ` for "${searchQuery}"`}
			</div>
		</div>
	);
}

// Client component for posts management
export default function PostsManagement({ posts: initialPosts }) {
	const [posts, setPosts] = useState(initialPosts);
	const [filteredPosts, setFilteredPosts] = useState(initialPosts);

	// Fetch latest posts periodically
	const fetchPosts = useCallback(async () => {
		try {
			const res = await fetch("/api/admin/posts", { cache: "no-store" });
			if (res.ok) {
				const data = await res.json();
				const transformed = data.map(post => ({
					...post,
					excerpt: truncateText(post.description, 100),
					createdAt: post.createdAt.split("T")[0],
					updatedAt: post.updatedAt.split("T")[0],
				}));
				setPosts(transformed);
			}
		} catch {}
	}, []);

	// Initial fetch and polling every second
	useEffect(() => {
		fetchPosts();
		const id = setInterval(fetchPosts, 1000);
		return () => clearInterval(id);
	}, [fetchPosts]);

	// Update filteredPosts when posts change
	useEffect(() => {
		setFilteredPosts(posts);
	}, [posts]);

	return (
		<Tabs defaultValue="posts" className="space-y-4">
			<div className="flex items-center justify-between">
				<TabsList>
					<TabsTrigger value="posts">All Posts</TabsTrigger>
					<TabsTrigger value="analytics">Analytics</TabsTrigger>
				</TabsList>
				<Button asChild>
					<Link href="/admin/posts/new">
						<PlusCircle className="mr-2 h-4 w-4" />
						New Post
					</Link>
				</Button>
			</div>

			<TabsContent value="posts" className="space-y-4">
				{/* Enhanced Filters */}
				<PostFilters posts={posts} onFilteredPosts={setFilteredPosts} />

				{/* Posts Table */}
				<Card>
					<CardHeader>
						<CardTitle>Blog Posts</CardTitle>
						<CardDescription>Manage your blog posts and content</CardDescription>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Title</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Views</TableHead>
									<TableHead>Created</TableHead>
									<TableHead>Updated</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredPosts.length > 0 ? (
									filteredPosts.map(post => (
										<TableRow key={post.id}>
											<TableCell>
												<div className="space-y-1">
													<div className="font-medium">{post.title}</div>
													<div className="text-muted-foreground text-sm">{post.excerpt}</div>
												</div>
											</TableCell>
											<TableCell>
												<Badge variant={getStatusColor(post.status)}>{post.status}</Badge>
											</TableCell>
											<TableCell>{post.views.toLocaleString()}</TableCell>
											<TableCell className="text-muted-foreground">{formatDate(post.createdAt)}</TableCell>
											<TableCell className="text-muted-foreground">{formatDate(post.updatedAt)}</TableCell>
											<TableCell className="text-right">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" className="h-8 w-8 p-0">
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem asChild>
															<Link href={`/blog/${post.slug}`}>
																<Eye className="mr-2 h-4 w-4" />
																View
															</Link>
														</DropdownMenuItem>
														<DropdownMenuItem asChild>
															<Link href={`/admin/posts/${post.id}/edit`}>
																<Edit className="mr-2 h-4 w-4" />
																Edit
															</Link>
														</DropdownMenuItem>
														<DropdownMenuItem className="text-destructive">
															<Trash2 className="mr-2 h-4 w-4" />
															Delete
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={6} className="py-8 text-center">
											<div className="text-muted-foreground">No posts found matching your filters.</div>
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</TabsContent>

			<TabsContent value="analytics" className="space-y-4">
				<div className="grid gap-4 md:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle>Popular Posts</CardTitle>
							<CardDescription>Your most viewed content</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{filteredPosts
									.sort((a, b) => b.views - a.views)
									.slice(0, 3)
									.map((post, index) => (
										<div key={post.id} className="flex items-center space-x-3">
											<div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
												<span className="text-sm font-medium">{index + 1}</span>
											</div>
											<div className="flex-1 space-y-1">
												<p className="text-sm leading-none font-medium">{post.title}</p>
												<p className="text-muted-foreground text-sm">{post.views.toLocaleString()} views</p>
											</div>
										</div>
									))}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Recent Activity</CardTitle>
							<CardDescription>Latest updates to your blog</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{filteredPosts
									.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
									.slice(0, 3)
									.map(post => (
										<div key={post.id} className="flex items-center space-x-3">
											<div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
												<CalendarIcon className="h-4 w-4" />
											</div>
											<div className="flex-1 space-y-1">
												<p className="text-sm leading-none font-medium">{post.title}</p>
												<p className="text-muted-foreground text-sm">Updated {formatDate(post.updatedAt)}</p>
											</div>
										</div>
									))}
							</div>
						</CardContent>
					</Card>
				</div>
			</TabsContent>
		</Tabs>
	);
}
