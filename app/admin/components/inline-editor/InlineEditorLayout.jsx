'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { InlineEditableText } from './InlineEditableText';
import { InlineEditableDate } from './InlineEditableDate';
import { InlineEditableTags } from './InlineEditableTags';
import { InlineEditableSelect } from './InlineEditableSelect';
import { InlineEditableMarkdown } from './InlineEditableMarkdown';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '../../../components/admin/StatusBadge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ArrowLeft, Save, Check, Upload, Link as LinkIcon } from 'lucide-react';
import { Toaster, toast } from 'sonner';

export function InlineEditorLayout({ post, onSave, isNewPost = false }) {
  const router = useRouter();
  const [editedPost, setEditedPost] = useState(post);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [authorOptions, setAuthorOptions] = useState([]);
  const [isUsingUrl, setIsUsingUrl] = useState({
    authorImage: editedPost.authorImage?.startsWith('http'),
    featuredImage: editedPost.featuredImage?.startsWith('http')
  });
  const [availableImages, setAvailableImages] = useState([]);
  
  // Fetch author names from existing posts
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch('/api/listPosts');
        if (response.ok) {
          const posts = await response.json();
          const authors = [...new Set(posts
            .filter(p => p.frontmatter?.author)
            .map(p => p.frontmatter.author))];
          
          setAuthorOptions(authors);
        }
      } catch (error) {
        console.error("Failed to load authors:", error);
      }
    };
    
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/listImages');
        if (response.ok) {
          const data = await response.json();
          setAvailableImages(data.images || []);
        }
      } catch (error) {
        console.error("Failed to load images:", error);
      }
    };
    
    fetchAuthors();
    fetchImages();
  }, []);
  
  const handleUpdate = (field, value) => {
    setEditedPost(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };
  
  const toggleUrlMode = (field) => {
    setIsUsingUrl(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
    
    // Clear the field when switching modes
    handleUpdate(field, '');
  };
  
  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // Replace with your actual image upload endpoint
      const response = await fetch('/api/uploadImage', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        handleUpdate(field, data.path.replace('/public/images/', ''));
        toast.success(`Image uploaded successfully`);
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      toast.error("Error uploading image: " + error.message);
    }
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await onSave(editedPost);
      if (success) {
        toast.success('Post saved successfully');
        setHasChanges(false);
      }
    } catch (error) {
      toast.error('Failed to save post: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => router.push('/admin')} className="text-muted-foreground">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <StatusBadge status={editedPost.status} />
                <InlineEditableSelect
                  value={editedPost.status}
                  onChange={(value) => handleUpdate('status', value)}
                  options={[
                    { value: 'draft', label: 'Draft' },
                    { value: 'published', label: 'Published' },
                    { value: 'unpublished', label: 'Unpublished' }
                  ]}
                  className="text-xs"
                />
              </div>
            </div>
            <div className="flex sm:hidden items-center gap-3">
              <ThemeToggle />
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <Button 
              onClick={handleSave} 
              disabled={isSaving || !hasChanges}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              {isSaving ? (
                <div className="animate-spin h-4 w-4 border-2 border-foreground border-t-transparent rounded-full" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save
            </Button>
          </div>
        </div>
      </header>
      
      {/* Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="mb-4 sm:mb-6">
            <InlineEditableText
              value={editedPost.title}
              onChange={(value) => handleUpdate('title', value)}
              className="text-2xl sm:text-3xl md:text-4xl font-bold"
              placeholder="Post title"
            />
          </div>
          
          {/* Metadata */}
          <div className="grid grid-cols-1 gap-4 mb-6 sm:mb-8">
            <div className="space-y-6">
              {isNewPost && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-2">Post Type</label>
                  <InlineEditableSelect
                    value={editedPost.type}
                    onChange={(value) => handleUpdate('type', value)}
                    options={[
                      { value: 'blog', label: 'Blog Post' },
                      { value: 'project', label: 'Project' }
                    ]}
                    className="w-full"
                  />
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-2">Date</label>
                <InlineEditableDate
                  value={editedPost.date}
                  onChange={(value) => handleUpdate('date', value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-2">Slug</label>
                <InlineEditableText
                  value={editedPost.slug}
                  onChange={(value) => handleUpdate('slug', value)}
                  placeholder="post-slug"
                  className="text-sm w-full"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-2">Author Name</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <InlineEditableText
                    value={editedPost.author || ""}
                    onChange={(value) => handleUpdate('author', value)}
                    placeholder="Your Name"
                    className="text-sm flex-grow"
                  />
                  {authorOptions.length > 0 && (
                    <select 
                      className="text-sm bg-card border rounded px-2 py-2 text-foreground"
                      onChange={(e) => {
                        if (e.target.value) handleUpdate('author', e.target.value);
                      }}
                      value=""
                    >
                      <option value="">Select author</option>
                      {authorOptions.map(author => (
                        <option key={author} value={author}>{author}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              
              <div>
                <div className="flex flex-wrap justify-between items-center mb-2">
                  <label className="text-sm font-medium text-muted-foreground">Author Image</label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleUrlMode('authorImage')}
                    className="h-8 text-xs"
                  >
                    {isUsingUrl.authorImage ? <Upload size={14} /> : <LinkIcon size={14} />}
                    {isUsingUrl.authorImage ? ' Use file' : ' Use URL'}
                  </Button>
                </div>
                
                {isUsingUrl.authorImage ? (
                  <InlineEditableText
                    value={editedPost.authorImage || ""}
                    onChange={(value) => handleUpdate('authorImage', value)}
                    placeholder="https://example.com/image.jpg"
                    className="text-sm w-full"
                  />
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="file"
                      id="authorImageFile"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'authorImage')}
                    />
                    <InlineEditableText
                      value={editedPost.authorImage || ""}
                      onChange={(value) => handleUpdate('authorImage', value)}
                      placeholder="profile.jpg"
                      className="text-sm flex-grow"
                    />
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => document.getElementById('authorImageFile').click()}
                        className="whitespace-nowrap h-9"
                      >
                        <Upload size={14} className="mr-1" /> Upload
                      </Button>
                      
                      {availableImages.length > 0 && (
                        <select 
                          className="text-sm bg-card border rounded px-2 py-2 text-foreground min-w-[120px]"
                          onChange={(e) => {
                            if (e.target.value) handleUpdate('authorImage', e.target.value);
                          }}
                          value=""
                        >
                          <option value="">Select image</option>
                          {availableImages.map(img => (
                            <option key={img.name} value={img.name}>{img.name}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {editedPost.type === 'project' && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-2">Website/GitHub URL</label>
                  <InlineEditableText
                    value={editedPost.website}
                    onChange={(value) => handleUpdate('website', value)}
                    placeholder="https://github.com/username/repo"
                    className="text-sm w-full"
                  />
                </div>
              )}
            
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-2">Description</label>
                <InlineEditableText
                  value={editedPost.description}
                  onChange={(value) => handleUpdate('description', value)}
                  placeholder="Short description of your post"
                  className="text-sm w-full"
                  multiline
                />
              </div>
              
              <div>
                <div className="flex flex-wrap justify-between items-center mb-2">
                  <label className="text-sm font-medium text-muted-foreground">Featured Image</label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleUrlMode('featuredImage')}
                    className="h-8 text-xs"
                  >
                    {isUsingUrl.featuredImage ? <Upload size={14} /> : <LinkIcon size={14} />}
                    {isUsingUrl.featuredImage ? ' Use file' : ' Use URL'}
                  </Button>
                </div>
                
                {isUsingUrl.featuredImage ? (
                  <InlineEditableText
                    value={editedPost.featuredImage || ""}
                    onChange={(value) => handleUpdate('featuredImage', value)}
                    placeholder="https://example.com/image.jpg"
                    className="text-sm w-full"
                  />
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="file"
                      id="featuredImageFile"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'featuredImage')}
                    />
                    <InlineEditableText
                      value={editedPost.featuredImage || ""}
                      onChange={(value) => handleUpdate('featuredImage', value)}
                      placeholder="featured.jpg"
                      className="text-sm flex-grow"
                    />
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => document.getElementById('featuredImageFile').click()}
                        className="whitespace-nowrap h-9"
                      >
                        <Upload size={14} className="mr-1" /> Upload
                      </Button>
                      
                      {availableImages.length > 0 && (
                        <select 
                          className="text-sm bg-card border rounded px-2 py-2 text-foreground min-w-[120px]"
                          onChange={(e) => {
                            if (e.target.value) handleUpdate('featuredImage', e.target.value);
                          }}
                          value=""
                        >
                          <option value="">Select image</option>
                          {availableImages.map(img => (
                            <option key={img.name} value={img.name}>{img.name}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-2">Tags</label>
                <InlineEditableTags
                  value={editedPost.tags}
                  onChange={(value) => handleUpdate('tags', value)}
                />
              </div>
            </div>
          </div>
          
          {/* Markdown Content */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted p-3 border-b">
              <h2 className="text-sm font-medium">Content</h2>
            </div>
            <InlineEditableMarkdown
              value={editedPost.markdown}
              onChange={(value) => handleUpdate('markdown', value)}
              className="min-h-[300px] sm:min-h-[400px]"
            />
          </div>
          
          {/* Preview Link */}
          {!isNewPost && (
            <div className="mt-6 text-center">
              <Link
                href={`/${editedPost.type === 'blog' ? 'blog' : 'devposts'}/${editedPost.slug}`}
                target="_blank"
                className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
              >
                <span>Preview</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </main>
      
      {/* Floating save indicator */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground shadow-lg rounded-full py-2 px-4 flex items-center gap-2 text-sm animate-in fade-in slide-in-from-bottom-5">
          <span>Unsaved changes</span>
          <Button size="sm" onClick={handleSave} className="h-6 rounded-full bg-primary-foreground text-primary">
            Save
          </Button>
        </div>
      )}
    </div>
  );
} 