import { StatusBadge } from "./StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

export function PostsTable({ posts, onEdit, onDelete, isLoading = false }) {
  if (isLoading) {
    return (
      <div className="px-4 py-3">
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="text-foreground w-[400px]">Title</TableHead>
                <TableHead className="text-foreground w-[400px]">Category</TableHead>
                <TableHead className="text-foreground w-60">Status</TableHead>
                <TableHead className="text-muted-foreground w-60">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <TableRow key={i} className="border-t border-t-border">
                  <TableCell className="h-[72px] w-[400px]">
                    <div className="h-4 w-4/5 bg-muted rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className="h-[72px] w-[400px]">
                    <div className="h-4 w-2/3 bg-muted rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className="h-[72px] w-60">
                    <div className="h-8 w-3/4 bg-muted rounded-full animate-pulse"></div>
                  </TableCell>
                  <TableCell className="h-[72px] w-60">
                    <div className="h-4 w-1/2 bg-muted rounded animate-pulse"></div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="p-12 text-center text-muted-foreground">
        No posts found. Create your first post!
      </div>
    );
  }

  return (
    <div className="px-4 py-3">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="text-muted-foreground w-[400px]">Title</TableHead>
              <TableHead className="text-muted-foreground w-[400px]">Category</TableHead>
              <TableHead className="text-muted-foreground w-60">Status</TableHead>
              <TableHead className="text-muted-foreground w-60">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.path} className="border-t border-t-border">
                <TableCell className="h-[72px] w-[400px] text-foreground">
                  <div className="truncate" title={post.title || post.name.replace('.md', '')}>
                    {post.title || post.name.replace('.md', '')}
                  </div>
                </TableCell>
                <TableCell className="h-[72px] w-[400px] text-muted-foreground">
                  {post.path.includes('Bposts') ? 'Blog' : 'Project'}
                </TableCell>
                <TableCell className="h-[72px] w-60">
                  <StatusBadge status={post.status || "draft"} />
                </TableCell>
                <TableCell className="h-[72px] w-60">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(post)} className="text-muted-foreground hover:text-foreground">
                      <Edit className="h-4 w-4 mr-1" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(post.path)} className="text-muted-foreground hover:text-foreground">
                      <Trash className="h-4 w-4 mr-1" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 