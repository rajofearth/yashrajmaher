import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ChevronDown, Check, Edit, Trash, Filter, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { StatusBadge } from "./StatusBadge";
import { useState, useEffect } from "react";

export function PostsTable({ posts, onEdit, onDelete, isLoading = false, onFilterChange = () => {} }) {
	const router = useRouter();
	// Initialize column sizes from localStorage or use defaults
	const defaultSizes = [40, 25, 15, 20]; // Default sizes for 4 columns
	const [sizes, setSizes] = useState(
		typeof window !== "undefined"
			? JSON.parse(localStorage.getItem("admin-table-sizes") || JSON.stringify(defaultSizes))
			: defaultSizes
	);

	// Track selected filters
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [statusFilter, setStatusFilter] = useState("all");

	// Update filters in parent component
	useEffect(() => {
		onFilterChange({
			category: categoryFilter,
			status: statusFilter,
		});
	}, [categoryFilter, statusFilter, onFilterChange]);

	// Save sizes to localStorage when they change
	const handleSizeChange = newSizes => {
		setSizes(newSizes);
		localStorage.setItem("admin-table-sizes", JSON.stringify(newSizes));
	};

	// Get unique categories and statuses for filters
	const categories = ["all", "blog", "project"];
	const statuses = ["all", "draft", "published", "unpublished"];

	const handleInlineEdit = post => {
		const slug = post.name.replace(".md", "");
		router.push(`/admin/inline-editor/${slug}`);
	};

	if (isLoading) {
		return (
			<div className="px-4 py-3">
				{/* Mobile loading skeleton */}
				<div className="space-y-4 md:hidden">
					{[...Array(3)].map((_, i) => (
						<div key={i} className="bg-muted h-24 animate-pulse rounded-xl"></div>
					))}
				</div>
				{/* Desktop loading table */}
				<div className="border-border bg-card hidden overflow-x-auto rounded-xl border md:block">
					<div className="w-full min-w-[650px]">
						<div className="bg-muted grid grid-cols-4">
							<div className="text-foreground p-3 font-medium">Title</div>
							<div className="text-foreground p-3 font-medium">Category</div>
							<div className="text-foreground p-3 font-medium">Status</div>
							<div className="text-foreground p-3 text-right font-medium">Actions</div>
						</div>
						{[...Array(3)].map((_, i) => (
							<div key={i} className="border-t-border grid grid-cols-4 border-t">
								<div className="h-[72px] p-3">
									<div className="bg-muted h-4 w-4/5 animate-pulse rounded"></div>
								</div>
								<div className="h-[72px] p-3">
									<div className="bg-muted h-4 w-2/3 animate-pulse rounded"></div>
								</div>
								<div className="h-[72px] p-3">
									<div className="bg-muted h-8 w-3/4 animate-pulse rounded-full"></div>
								</div>
								<div className="h-[72px] p-3 text-right">
									<div className="bg-muted ml-auto h-4 w-1/2 animate-pulse rounded"></div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	// Create table headers separately to ensure alignment
	const TableHeaders = () => (
		<div className="border-border flex w-full border-b">
			{/* Title Header */}
			<div
				style={{ width: `${sizes[0]}%` }}
				className="text-muted-foreground bg-muted flex items-center p-3 font-medium"
			>
				Title
			</div>

			{/* Category Header */}
			<div
				style={{ width: `${sizes[1]}%` }}
				className="text-muted-foreground bg-muted hidden items-center justify-between p-3 font-medium md:flex"
			>
				<span>Category</span>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
							<Filter className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{categories.map(category => (
							<DropdownMenuItem
								key={category}
								onClick={() => setCategoryFilter(category)}
								className="flex items-center gap-2"
							>
								{categoryFilter === category && <Check className="h-4 w-4" />}
								<span className={categoryFilter === category ? "font-medium" : ""}>
									{category === "all" ? "All" : category === "blog" ? "Blog" : "Project"}
								</span>
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Status Header */}
			<div
				style={{ width: `${sizes[2]}%` }}
				className="text-muted-foreground bg-muted flex items-center justify-between p-3 font-medium"
			>
				<span>Status</span>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
							<Filter className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{statuses.map(status => (
							<DropdownMenuItem
								key={status}
								onClick={() => setStatusFilter(status)}
								className="flex items-center gap-2"
							>
								{statusFilter === status && <Check className="h-4 w-4" />}
								<span className={statusFilter === status ? "font-medium" : ""}>
									{status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
								</span>
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Actions Header */}
			<div style={{ width: `${sizes[3]}%` }} className="text-muted-foreground bg-muted p-3 text-right font-medium">
				Actions
			</div>
		</div>
	);

	// Empty state message when there are no posts at all
	if (posts.length === 0) {
		return (
			<div className="px-4 py-3">
				{/* Mobile empty state */}
				<div className="text-muted-foreground text-center md:hidden">No posts found. Create your first post!</div>
				<div className="border-border bg-card hidden overflow-x-auto rounded-xl border md:block">
					<div className="w-full min-w-[650px]">
						<TableHeaders />
						<div className="text-muted-foreground p-12 text-center">No posts found. Create your first post!</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="px-4 py-3">
			{/* Mobile card view */}
			<div className="space-y-4 md:hidden">
				{posts.map(post => {
					const title = post.title || post.name.replace(".md", "");
					const type = post.path.includes("Bposts") ? "Blog" : "Project";
					return (
						<div key={post.path} className="bg-card border-border rounded-xl border p-4">
							<h3 className="text-foreground truncate font-semibold">{title}</h3>
							<p className="text-muted-foreground mt-1 text-sm">{type}</p>
							<p className="mt-1 text-sm">
								<StatusBadge status={post.status || "draft"} />
							</p>
							<div className="mt-3 flex gap-2">
								<Button variant="secondary" size="sm" onClick={() => handleInlineEdit(post)}>
									Edit
								</Button>
								<Button variant="destructive" size="sm" onClick={() => onDelete(post.path)}>
									Delete
								</Button>
							</div>
						</div>
					);
				})}
			</div>
			{/* Desktop table view */}
			<div className="border-border bg-card hidden overflow-x-auto rounded-xl border md:block">
				<div className="w-full min-w-[650px]">
					<TableHeaders />
					{/* Show message if filtered results are empty */}
					{posts.length > 0 ? (
						<ResizablePanelGroup direction="horizontal" onLayout={sizes => handleSizeChange(sizes)} className="w-full">
							{/* Title Column */}
							<ResizablePanel defaultSize={sizes[0]} minSize={15}>
								<div className="h-full">
									{posts.map(post => (
										<div
											key={`title-${post.path}`}
											className="border-border flex h-[72px] flex-col justify-center border-b p-3"
										>
											<div className="text-foreground truncate" title={post.title || post.name.replace(".md", "")}>
												{post.title || post.name.replace(".md", "")}
											</div>
											<div className="text-muted-foreground mt-1 truncate text-xs md:hidden">
												{post.path.includes("Bposts") ? "Blog" : "Project"}
											</div>
										</div>
									))}
								</div>
							</ResizablePanel>

							<ResizableHandle className="bg-border hover:bg-primary/20 transition-colors" />

							{/* Category Column */}
							<ResizablePanel defaultSize={sizes[1]} minSize={10} className="hidden md:block">
								<div className="h-full">
									{posts.map(post => (
										<div
											key={`cat-${post.path}`}
											className="text-muted-foreground border-border flex h-[72px] items-center border-b p-3"
										>
											<div className="truncate">{post.path.includes("Bposts") ? "Blog" : "Project"}</div>
										</div>
									))}
								</div>
							</ResizablePanel>

							<ResizableHandle className="bg-border hover:bg-primary/20 hidden transition-colors md:flex" />

							{/* Status Column */}
							<ResizablePanel defaultSize={sizes[2]} minSize={15}>
								<div className="h-full">
									{posts.map(post => (
										<div key={`status-${post.path}`} className="border-border flex h-[72px] items-center border-b p-3">
											<StatusBadge status={post.status || "draft"} />
										</div>
									))}
								</div>
							</ResizablePanel>

							<ResizableHandle className="bg-border hover:bg-primary/20 transition-colors" />

							{/* Actions Column */}
							<ResizablePanel defaultSize={sizes[3]} minSize={15}>
								<div className="h-full">
									{posts.map(post => (
										<div
											key={`actions-${post.path}`}
											className="border-border flex h-[72px] items-center justify-end border-b p-3"
										>
											<div className="flex gap-2">
												<Button
													variant="ghost"
													size="sm"
													onClick={() => handleInlineEdit(post)}
													className="text-muted-foreground hover:text-foreground"
													title="Edit post"
												>
													<Edit className="h-4 w-4" />
													<span className="sr-only">Edit</span>
												</Button>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => onDelete(post.path)}
													className="text-muted-foreground hover:text-foreground"
												>
													<Trash className="h-4 w-4" />
													<span className="sr-only">Delete</span>
												</Button>
											</div>
										</div>
									))}
								</div>
							</ResizablePanel>
						</ResizablePanelGroup>
					) : (
						<div className="text-muted-foreground p-12 text-center">
							No data for this filter. Try adjusting your filter settings.
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
