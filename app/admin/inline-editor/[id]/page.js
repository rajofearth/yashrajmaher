'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { InlineEditorLayout } from '../../components/inline-editor/InlineEditorLayout';
import matter from 'gray-matter';

export default function InlineEditorPage() {
  const router = useRouter();
  const params = useParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [isNewPost, setIsNewPost] = useState(false);
  
  // Check authentication on load
  useEffect(() => {
    const isAdminAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
    if (!isAdminAuthenticated) {
      router.push('/admin');
      return;
    }
    setIsAuthenticated(true);
    
    // Check if this is a new post or existing one
    if (params.id && params.id.startsWith('new-post-')) {
      setIsNewPost(true);
      createEmptyPost();
    } else {
      fetchPost();
    }
  }, [router, params.id]);
  
  // Create empty post for new posts
  const createEmptyPost = () => {
    const today = new Date().toISOString().split('T')[0];
    const newPost = {
      title: '',
      description: '',
      date: today,
      tags: [],
      status: 'draft',
      type: 'blog', // Default type
      markdown: '',
      name: `post-${Date.now()}.md`,
      isNew: true,
      path: `Bposts/post-${Date.now()}.md`, // Default path for blog posts
      slug: `post-${Date.now()}`
    };
    
    setPost(newPost);
    setIsLoading(false);
  };
  
  // Fetch post content
  const fetchPost = async () => {
    setIsLoading(true);
    try {
      const allPosts = await fetch('/api/listPosts').then(res => res.json());
      const currentPost = allPosts.find(p => p.name.replace('.md', '') === params.id || p.path.includes(`/${params.id}.md`));
      
      if (!currentPost) {
        setError('Post not found');
        setIsLoading(false);
        return;
      }
      
      const { data } = await fetch(`/api/getContent?path=${currentPost.path}`).then(res => res.json());
      const content = Buffer.from(data.content, 'base64').toString('utf8');
      const { data: frontmatter, content: markdown } = matter(content);
      
      setPost({
        ...currentPost,
        frontmatter,
        markdown,
        title: frontmatter.title || currentPost.name.replace('.md', ''),
        description: frontmatter.description || '',
        date: frontmatter.date || new Date().toISOString().split('T')[0],
        tags: frontmatter.tags || [],
        status: frontmatter.status || 'draft',
        type: currentPost.path.includes('Bposts') ? 'blog' : 'project',
        website: frontmatter.website || '',
        slug: currentPost.name.replace('.md', '')
      });
    } catch (err) {
      setError('Error loading post: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle save
  const handleSave = async (updatedPost) => {
    try {
      // Check required fields
      if (!updatedPost.title) {
        setError('Title is required');
        return false;
      }
      
      // Generate slug if not present
      const slug = updatedPost.slug || updatedPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      // Prepare frontmatter
      const frontmatter = {
        title: updatedPost.title,
        date: updatedPost.date,
        description: updatedPost.description,
        tags: updatedPost.tags,
        status: updatedPost.status
      };
      
      // Add website for projects
      if (updatedPost.type === 'project' && updatedPost.website) {
        frontmatter.website = updatedPost.website;
      }
      
      // Create content with frontmatter
      const content = matter.stringify(updatedPost.markdown, frontmatter);
      
      // Determine file path
      let filePath;
      if (updatedPost.isNew) {
        // For new posts, create path based on type and slug
        filePath = `${updatedPost.type === 'blog' ? 'Bposts' : 'devposts'}/${slug}.md`;
      } else {
        // For existing posts, use the original path
        filePath = updatedPost.path.replace('public/', '');
      }
      
      // Save post
      const response = await fetch('/api/savePost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath,
          content,
          postType: updatedPost.type,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to save post');
      }
      
      // For new posts, redirect to the proper URL after saving
      if (updatedPost.isNew) {
        router.push(`/admin/inline-editor/${slug}`);
      }
      
      return true;
    } catch (err) {
      setError('Error saving post: ' + err.message);
      return false;
    }
  };
  
  if (!isAuthenticated) {
    return null; // Redirecting to login
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-destructive/10 p-4 rounded-md text-destructive">
          {error}
        </div>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Post not found</div>
      </div>
    );
  }
  
  return <InlineEditorLayout post={post} onSave={handleSave} isNewPost={isNewPost} />;
} 