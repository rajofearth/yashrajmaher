'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SearchBar } from "../components/admin/SearchBar";
import { PostsTable } from "../components/admin/PostsTable";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Plus } from "lucide-react";
import { UserButton } from '@clerk/nextjs';
import { useAdminPosts } from './hooks/useAdminPosts';
import { DeleteConfirmationDialog } from './components/DeleteConfirmationDialog';

export default function AdminPage() {
  const router = useRouter();
  const {
    filteredPosts,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    isLoading,
    error: postsError,
    isDeleting,
    deleteTarget,
    setDeleteTarget,
    fetchPosts,
    handleDeleteConfirm,
  } = useAdminPosts();

  // Fetch posts on mount
  useEffect(() => {
      fetchPosts();
  }, []);

  // Create new post
  const handleNewPost = () => {
    const tempId = `new-post-${Date.now()}`;
    router.push(`/admin/inline-editor/${tempId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeToggle />
            <UserButton />
          </div>
        </header>
        
        {postsError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{postsError}</AlertDescription>
          </Alert>
        )}

        <div className="bg-card border rounded-xl shadow-sm mb-8">
          <div className="p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <h2 className="text-lg sm:text-xl font-semibold text-card-foreground">Manage Content</h2>
            <Button onClick={handleNewPost} size="sm" className="flex items-center gap-2 whitespace-nowrap">
              <Plus className="size-4" />
              <span>New Post</span>
            </Button>
          </div>
          
          <SearchBar 
            placeholder="Search by title..." 
            onChange={setSearchQuery} 
          />
          
          <PostsTable 
            posts={filteredPosts} 
            onDelete={(path) => setDeleteTarget(path)} 
            isLoading={isLoading}
            onFilterChange={setFilters}
          />
        </div>
      </div>

      <DeleteConfirmationDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
