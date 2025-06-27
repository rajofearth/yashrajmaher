'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function PreviewPage() {
  const [post, setPost] = useState(null)

  useEffect(() => {
    const previewData = sessionStorage.getItem('preview-post')
    if (previewData) {
      setPost(JSON.parse(previewData))
    }
  }, [])

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">No Preview Available</h1>
          <p className="text-muted-foreground mb-4">
            No post data found for preview. Please go back and try again.
          </p>
          <Button onClick={() => window.close()}>
            Close Preview
          </Button>
        </div>
      </div>
    )
  }

  const tags = post.tags ? post.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []

  // Fallback slug generation if missing
  const slugToUse = post.slug || (post.title ? post.title.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim() : 'draft')

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Preview Mode
              </span>
              <Badge variant="outline" className="text-xs">
                {post.status}
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.close()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Close Preview
            </Button>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-8">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            {post.title}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-6">
            {post.description}
          </p>

          {/* Author Info */}
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-12 w-12">
              <AvatarImage 
                src={post.authorImage} 
                alt={post.author || 'Author'} 
              />
              <AvatarFallback>
                {(post.author || 'A').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">
                {post.author || 'Anonymous'}
              </div>
              {post.website && (
                <a 
                  href={post.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {post.website}
                </a>
              )}
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        {/* Article Content */}
        <Card>
          <CardContent className="p-8">
            <div 
              className="prose prose-neutral dark:prose-invert prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t">
          <div className="text-center text-muted-foreground">
            <p>This is a preview of your post.</p>
            <p className="text-sm mt-2">
              URL will be: <code className="bg-muted px-2 py-1 rounded text-xs">
                /blog/{slugToUse}
              </code>
            </p>
          </div>
        </footer>
      </article>
    </div>
  )
} 