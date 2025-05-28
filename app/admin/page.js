'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SearchBar } from "../components/admin/SearchBar";
import { TabNavigation } from "../components/admin/TabNavigation";
import { PostsTable } from "../components/admin/PostsTable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Plus, Loader2 } from "lucide-react";
import TiptapEditor from "../components/TiptapEditor";
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
  const [activeTab, setActiveTab] = useState('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // New post form state
  const [postTitle, setPostTitle] = useState('');
  const [postType, setPostType] = useState('blog');
  const [postContent, setPostContent] = useState('');
  const [postDate, setPostDate] = useState(new Date().toISOString().split('T')[0]);
  const [postTags, setPostTags] = useState('');
  const [postSlug, setPostSlug] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [postWebsite, setPostWebsite] = useState('');
  const [postStatus, setPostStatus] = useState('draft');

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

  // Handle search and filtering
  useEffect(() => {
    if (!posts.length) return;
    
    let filtered = [...posts];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by tab
    if (activeTab === 'blog') {
      filtered = filtered.filter(post => post.type === 'blog');
    } else if (activeTab === 'project') {
      filtered = filtered.filter(post => post.type === 'project');
    }
    
    setFilteredPosts(filtered);
  }, [searchQuery, activeTab, posts]);

  // Handle post editing
  const handleEditPost = async (post) => {
    setIsLoading(true);
    try {
      const { data } = await fetch(`/api/getContent?path=${post.path}`).then(res => res.json());
      const content = Buffer.from(data.content, 'base64').toString('utf8');
      const { data: frontmatter, content: markdown } = matter(content);
      
      setCurrentPost(post);
      setPostTitle(frontmatter.title || '');
      setPostType(post.type);
      setPostDate(frontmatter.date || new Date().toISOString().split('T')[0]);
      setPostTags(frontmatter.tags ? frontmatter.tags.join(', ') : '');
      setPostContent(markdown || '');
      setPostSlug(post.name.replace('.md', ''));
      setPostDescription(frontmatter.description || '');
      setPostWebsite(frontmatter.website || '');
      setPostStatus(frontmatter.status || post.status || 'draft');
      setIsEditorOpen(true);
    } catch (error) {
      setError('Error fetching post content: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new post
  const handleNewPost = () => {
    setCurrentPost(null);
    setPostTitle('');
    setPostType('blog');
    setPostDate(new Date().toISOString().split('T')[0]);
    setPostTags('');
    setPostContent('');
    setPostSlug('');
    setPostDescription('');
    setPostWebsite('');
    setPostStatus('draft');
    setIsEditorOpen(true);
  };

  // Save post
  const handleSavePost = async () => {
    if (!postTitle || !postContent) {
      setError('Title and content are required');
      return;
    }

    setIsSaving(true);
    try {
      // Create frontmatter
      const frontmatter = {
        title: postTitle,
        date: postDate,
        description: postDescription,
        tags: postTags ? postTags.split(',').map(tag => tag.trim()) : [],
        status: postStatus,
      };
      
      // Add website for projects
      if (postType === 'project' && postWebsite) {
        frontmatter.website = postWebsite;
      }
      
      // Create slug if not editing
      const slug = postSlug || postTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      // Create content with frontmatter
      const content = matter.stringify(postContent, frontmatter);
      
      // Determine file path
      const filePath = currentPost 
        ? currentPost.path.replace('public/', '') 
        : `${postType === 'blog' ? 'Bposts' : 'devposts'}/${slug}.md`;
      
      // Save post
      const response = await fetch('/api/savePost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath,
          content,
          postType,
        }),
      });
      
      if (response.ok) {
        setIsEditorOpen(false);
        fetchPosts();
      } else {
        const data = await response.json();
        setError('Failed to save post: ' + data.message);
      }
    } catch (error) {
      setError('Error saving post: ' + error.message);
    } finally {
      setIsSaving(false);
    }
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
      <div className="container mx-auto py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" onClick={handleLogout}>
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
          <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-semibold text-card-foreground">Manage Content</h2>
            <Button onClick={handleNewPost} className="flex items-center gap-2">
              <Plus className="size-4" />
              New Post
            </Button>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabNavigation 
              activeTab={activeTab} 
              tabs={[
                { id: 'all', label: 'All Content' },
                { id: 'blog', label: 'Blog Posts' },
                { id: 'project', label: 'Projects' }
              ]} 
              onTabChange={setActiveTab} 
            />
            
            <SearchBar 
              placeholder="Search by title..." 
              onChange={setSearchQuery} 
            />
            
            <TabsContent value="all">
              <PostsTable 
                posts={filteredPosts} 
                onEdit={handleEditPost} 
                onDelete={(path) => setDeleteTarget(path)} 
                isLoading={isLoading} 
              />
            </TabsContent>
            
            <TabsContent value="blog">
              <PostsTable 
                posts={filteredPosts} 
                onEdit={handleEditPost} 
                onDelete={(path) => setDeleteTarget(path)} 
                isLoading={isLoading} 
              />
            </TabsContent>
            
            <TabsContent value="project">
              <PostsTable 
                posts={filteredPosts} 
                onEdit={handleEditPost} 
                onDelete={(path) => setDeleteTarget(path)} 
                isLoading={isLoading} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentPost ? 'Edit Post' : 'Create New Post'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="title">Title</label>
                <Input
                  id="title"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="Post title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="type">Post Type</label>
                <select 
                  id="type"
                  value={postType}
                  onChange={(e) => setPostType(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                >
                  <option value="blog">Blog Post</option>
                  <option value="project">Project</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="date">Date</label>
                <Input
                  id="date"
                  type="date"
                  value={postDate}
                  onChange={(e) => setPostDate(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="slug">Slug</label>
                <Input
                  id="slug"
                  value={postSlug}
                  onChange={(e) => setPostSlug(e.target.value)}
                  placeholder="post-slug (leave empty to auto-generate)"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1" htmlFor="description">Description</label>
                <Input
                  id="description"
                  value={postDescription}
                  onChange={(e) => setPostDescription(e.target.value)}
                  placeholder="Short description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="tags">Tags (comma separated)</label>
                <Input
                  id="tags"
                  value={postTags}
                  onChange={(e) => setPostTags(e.target.value)}
                  placeholder="tag1, tag2, tag3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="status">Status</label>
                <select 
                  id="status"
                  value={postStatus}
                  onChange={(e) => setPostStatus(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="unpublished">Unpublished</option>
                </select>
              </div>
              
              {postType === 'project' && (
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="website">Website/GitHub URL</label>
                  <Input
                    id="website"
                    value={postWebsite}
                    onChange={(e) => setPostWebsite(e.target.value)}
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="content">Content (Markdown)</label>
              <div className="min-h-64 border rounded-md p-4 bg-background">
                <TiptapEditor 
                  content={postContent} 
                  setContent={setPostContent} 
                  placeholder="Write your content in Markdown..."
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditorOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePost} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Post'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this post? This action cannot be undone.</p>
          <DialogFooter>
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
