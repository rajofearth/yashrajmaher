import { useState, useEffect } from "react";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Check, Edit, Trash, Filter } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export function PostsTable({ 
  posts, 
  onEdit, 
  onDelete, 
  isLoading = false,
  onFilterChange = () => {}
}) {
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
      status: statusFilter
    });
  }, [categoryFilter, statusFilter, onFilterChange]);

  // Save sizes to localStorage when they change
  const handleSizeChange = (newSizes) => {
    setSizes(newSizes);
    localStorage.setItem("admin-table-sizes", JSON.stringify(newSizes));
  };
  
  // Get unique categories and statuses for filters
  const categories = ["all", "blog", "project"];
  const statuses = ["all", "draft", "published", "unpublished"];

  if (isLoading) {
    return (
      <div className="px-4 py-3">
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <div className="w-full min-w-[650px]">
            <div className="grid grid-cols-4 bg-muted">
              <div className="p-3 font-medium text-foreground">Title</div>
              <div className="p-3 font-medium text-foreground">Category</div>
              <div className="p-3 font-medium text-foreground">Status</div>
              <div className="p-3 font-medium text-foreground text-right">Actions</div>
            </div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="grid grid-cols-4 border-t border-t-border">
                <div className="p-3 h-[72px]">
                  <div className="h-4 w-4/5 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="p-3 h-[72px]">
                  <div className="h-4 w-2/3 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="p-3 h-[72px]">
                  <div className="h-8 w-3/4 bg-muted rounded-full animate-pulse"></div>
                </div>
                <div className="p-3 h-[72px] text-right">
                  <div className="h-4 w-1/2 ml-auto bg-muted rounded animate-pulse"></div>
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
    <div className="flex w-full border-b border-border">
      {/* Title Header */}
      <div style={{width: `${sizes[0]}%`}} className="p-3 font-medium text-muted-foreground bg-muted flex items-center">
        Title
      </div>
      
      {/* Category Header */}
      <div style={{width: `${sizes[1]}%`}} className="p-3 font-medium text-muted-foreground bg-muted hidden md:flex items-center justify-between">
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
      <div style={{width: `${sizes[2]}%`}} className="p-3 font-medium text-muted-foreground bg-muted flex items-center justify-between">
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
      <div style={{width: `${sizes[3]}%`}} className="p-3 font-medium text-muted-foreground bg-muted text-right">
        Actions
      </div>
    </div>
  );

  // Empty state message when there are no posts at all
  if (posts.length === 0) {
    return (
      <div className="px-4 py-3">
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <div className="w-full min-w-[650px]">
            <TableHeaders />
            <div className="p-12 text-center text-muted-foreground">
              No posts found. Create your first post!
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3">
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <div className="w-full min-w-[650px]">
          <TableHeaders />
          
          {/* Show message if filtered results are empty */}
          {posts.length > 0 ? (
            <ResizablePanelGroup 
              direction="horizontal" 
              onLayout={(sizes) => handleSizeChange(sizes)}
              className="w-full"
            >
              {/* Title Column */}
              <ResizablePanel defaultSize={sizes[0]} minSize={15}>
                <div className="h-full">
                  {posts.map((post) => (
                    <div key={`title-${post.path}`} className="p-3 border-b border-border h-[72px] flex flex-col justify-center">
                      <div className="truncate text-foreground" title={post.title || post.name.replace('.md', '')}>
                        {post.title || post.name.replace('.md', '')}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 md:hidden truncate">
                        {post.path.includes('Bposts') ? 'Blog' : 'Project'}
                      </div>
                    </div>
                  ))}
                </div>
              </ResizablePanel>

              <ResizableHandle className="bg-border hover:bg-primary/20 transition-colors" />

              {/* Category Column */}
              <ResizablePanel defaultSize={sizes[1]} minSize={10} className="hidden md:block">
                <div className="h-full">
                  {posts.map((post) => (
                    <div key={`cat-${post.path}`} className="p-3 text-muted-foreground border-b border-border h-[72px] flex items-center">
                      <div className="truncate">
                        {post.path.includes('Bposts') ? 'Blog' : 'Project'}
                      </div>
                    </div>
                  ))}
                </div>
              </ResizablePanel>

              <ResizableHandle className="bg-border hover:bg-primary/20 transition-colors hidden md:flex" />

              {/* Status Column */}
              <ResizablePanel defaultSize={sizes[2]} minSize={15}>
                <div className="h-full">
                  {posts.map((post) => (
                    <div key={`status-${post.path}`} className="p-3 border-b border-border h-[72px] flex items-center">
                      <StatusBadge status={post.status || "draft"} />
                    </div>
                  ))}
                </div>
              </ResizablePanel>

              <ResizableHandle className="bg-border hover:bg-primary/20 transition-colors" />

              {/* Actions Column */}
              <ResizablePanel defaultSize={sizes[3]} minSize={15}>
                <div className="h-full">
                  {posts.map((post) => (
                    <div key={`actions-${post.path}`} className="p-3 border-b border-border h-[72px] flex items-center justify-end">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => onEdit(post)} className="text-muted-foreground hover:text-foreground">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onDelete(post.path)} className="text-muted-foreground hover:text-foreground">
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
            <div className="p-12 text-center text-muted-foreground">
              No data for this filter. Try adjusting your filter settings.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 