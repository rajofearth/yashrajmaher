'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SearchBar } from "../components/admin/SearchBar";
import { PostsTable } from "../components/admin/PostsTable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Plus, Loader2, Edit, ExternalLink, Trash } from "lucide-react";
import matter from 'gray-matter';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ category: 'all', status: 'all' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Authentication
  const handleLogin = (e) => {
    e.preventDefault();
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    
    if (password === correctPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('isAdminAuthenticated', 'true');
      fetchPosts();
    } else {
      setError('Invalid password');
    }
  };

  // Check for existing authentication on load
  useEffect(() => {
    const isAdminAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
    if (isAdminAuthenticated) {
      setIsAuthenticated(true);
      fetchPosts();
    }
  }, []);

  // Fetch all posts
  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/listPosts');
      
      if (response.ok) {
        const data = await response.json();
        
        // Process the posts to include frontmatter data like status
        const postsWithStatus = data.map(post => {
          // If the post already has a status field, use it
          if (post.status) return post;
          
          // Otherwise, check if we have frontmatter data (date means we do)
          if (post.date) {
            return {
              ...post,
              status: post.status || 'published' // Default to published if we have frontmatter but no status
            };
          }
          
          // Default for posts without any frontmatter data
          return {
            ...post,
            status: 'draft'
          };
        });
        
        setPosts(postsWithStatus);
        setFilteredPosts(postsWithStatus);
      } else {
        setError('Failed to fetch posts');
      }
    } catch (error) {
      setError('Error fetching posts: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Update the filtering logic
  useEffect(() => {
    if (!posts.length) return;
    
    let filtered = [...posts];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(post => {
        const title = post.title ? post.title.toLowerCase() : '';
        const filename = post.name.toLowerCase();
        return title.includes(searchQuery.toLowerCase()) || 
               filename.includes(searchQuery.toLowerCase());
      });
    }
    
    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(post => {
        if (filters.category === 'blog') return post.type === 'blog';
        if (filters.category === 'project') return post.type === 'project';
        return true;
      });
    }
    
    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(post => post.status === filters.status);
    }
    
    setFilteredPosts(filtered);
  }, [searchQuery, filters, posts]);

  // Create new post
  const handleNewPost = () => {
    // Generate a temporary ID for a new post
    const tempId = `new-post-${Date.now()}`;
    router.push(`/admin/inline-editor/${tempId}`);
  };

  // Delete post
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch('/api/deletePost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: deleteTarget }),
      });
      
      if (response.ok) {
        setDeleteTarget(null);
        fetchPosts();
      } else {
        const data = await response.json();
        setError('Failed to delete post: ' + data.message);
      }
    } catch (error) {
      setError('Error deleting post: ' + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAdminAuthenticated');
    router.push('/');
  };

  // If not authenticated, show login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
              <p className="text-muted-foreground">Enter your password to continue</p>
            </div>
            
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleLogout} className="whitespace-nowrap">
              Logout
            </Button>
          </div>
        </header>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this post? This action cannot be undone.</p>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm} 
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
