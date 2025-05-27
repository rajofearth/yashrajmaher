import React from 'react';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import { ThemeToggle } from "@/components/ui/theme-toggle";
import BackButton from '@/app/components/BackButton';

// Custom image component for markdown rendering
const MarkdownImage = ({ src, alt }) => (
  <div className="my-8">
    <img
      src={src}
      alt={alt}
      className="w-full rounded-lg object-cover aspect-video mb-2"
    />
    {alt && <figcaption className="text-center text-sm text-muted-foreground">{alt}</figcaption>}
  </div>
);

export default function ArticleLayout({
  title,
  description,
  date,
  author = "Anonymous",
  authorImage = "https://shadcnblocks.com/images/block/avatar-1.webp",
  featuredImage = "https://shadcnblocks.com/images/block/placeholder-1.svg",
  content,
  backLink,
  backText,
  tags = [],
  isProject = false,
  website = null,
}) {
  return (
    <section className="min-h-screen pt-8 pb-16 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="relative flex flex-col justify-between gap-10 lg:flex-row">
          {/* Sidebar with post metadata */}
          <aside className="top-10 mx-auto h-fit w-full max-w-[65ch] lg:sticky lg:max-w-96">
            <div className="flex items-center justify-between mb-5">
              <BackButton />
              <ThemeToggle />
            </div>
            <div className="bg-card p-6 rounded-xl border mb-6">
              {/* Show tags if it's a project */}
              {isProject && tags && tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge variant="secondary">
                    Project
                  </Badge>
                  {tags.map((tag, i) => (
                    <Badge key={i} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              <h1 
                className="mb-5 text-3xl font-bold text-balance lg:text-4xl text-card-foreground"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {title}
              </h1>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div className="flex gap-3">
                  <Avatar className="size-10 rounded-full border">
                    <AvatarImage
                      src={authorImage}
                      alt={author} 
                    />
                  </Avatar>
                  <div>
                    <h2 className="font-semibold text-card-foreground" style={{ fontFamily: "var(--font-serif)" }}>{author}</h2>
                    <p className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-sans)" }}>{date}</p>
                  </div>
                </div>
                
                {isProject && website && (
                  <a
                    href={website.startsWith('http') ? website : `https://${website}`}
                    className="text-xs inline-flex items-center gap-1 px-3 py-1.5 bg-secondary hover:bg-border text-secondary-foreground rounded-md transition-colors whitespace-nowrap"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {website.includes('github.com') ? (
                      <>
                        <span>Visit Repo</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                      </>
                    ) : (
                      <>
                        <span>View Project</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                      </>
                    )}
                  </a>
                )}
              </div>
            </div>
          </aside>
          
          {/* Article content */}
          <article className="mx-auto prose max-w-[65ch] bg-card p-8 rounded-xl border shadow-sm">
            {/* Featured image */}
            {featuredImage && (
              <div>
                <img
                  src={featuredImage}
                  alt={title}
                  className="mt-0 mb-8 aspect-video w-full rounded-lg object-cover"
                />
              </div>
            )}
            
            {/* Description if available */}
            {description && (
              <p className="lead text-foreground text-xl" style={{ fontFamily: "var(--font-serif)" }}>
                {description}
              </p>
            )}
            
            {/* Markdown content */}
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              rehypePlugins={[rehypeRaw]}
              components={{
                a: ({ node, ...props }) => (
                  <a {...props} className="text-primary underline transition-colors hover:opacity-80" />
                ),
                strong: ({ node, ...props }) => (
                  <strong {...props} className="text-foreground font-bold" />
                ),
                li: ({ node, ...props }) => (
                  <li {...props} className="text-muted-foreground" />
                ),
                ol: ({ node, ...props }) => (
                  <ol {...props} className="text-muted-foreground list-decimal marker:text-foreground" />
                ),
                code: ({ node, inline, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  // Always render inline if already marked as inline
                  if (inline) {
                    return (
                      <code
                        {...props}
                        className="px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded-md text-sm font-mono inline"
                      >
                        {children}
                      </code>
                    );
                  }
                  
                  // Check if this is a simple code without language that should be inline
                  const codeStr = String(children).trim();
                  const isSingleLineSimpleCode = !match && 
                    codeStr.length < 30 && 
                    !codeStr.includes('\n') && 
                    !codeStr.includes('\r');
                  
                  // Check if inside a list item or is simple code
                  const parentIsLi = node?.parentNode?.type === 'element' && 
                    node.parentNode.tagName === 'li';
                  
                  if (parentIsLi || isSingleLineSimpleCode) {
                    return (
                      <code
                        {...props}
                        className="px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded-md text-sm font-mono inline"
                      >
                        {children}
                      </code>
                    );
                  }
                  
                  return (
                    <code
                      {...props}
                      className={`${match ? `language-${match[1]}` : ''} block p-4 bg-secondary rounded-md text-sm text-secondary-foreground font-mono whitespace-pre-wrap`}
                    >
                      {children}
                    </code>
                  );
                },
                pre: ({ node, children, ...props }) => (
                  <pre {...props} className="bg-secondary p-4 text-secondary-foreground rounded-md whitespace-pre-wrap">
                    {children}
                  </pre>
                ),
                img: MarkdownImage,
                div: ({ node, ...props }) => (
                  <div {...props} className="max-w-full" />
                ),
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto">
                    <table {...props} className="w-full" />
                  </div>
                ),
                blockquote: ({ node, children, ...props }) => (
                  <blockquote 
                    {...props} 
                    className="border-l-4 border-border pl-4 italic text-foreground"
                  >
                    {children}
                  </blockquote>
                ),
                h1: ({ node, ...props }) => (
                  <h1 {...props} className="text-foreground mb-4" style={{ fontFamily: "var(--font-serif)" }} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 {...props} className="text-foreground mt-8 mb-4" style={{ fontFamily: "var(--font-serif)" }} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 {...props} className="text-foreground mt-6 mb-3" style={{ fontFamily: "var(--font-serif)" }} />
                ),
                h4: ({ node, ...props }) => (
                  <h4 {...props} className="text-foreground mt-5 mb-2 font-semibold" style={{ fontFamily: "var(--font-serif)" }} />
                ),
                p: ({ node, ...props }) => (
                  <p {...props} className="text-muted-foreground mb-4" style={{ fontFamily: "var(--font-sans)" }} />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </section>
  );
} 