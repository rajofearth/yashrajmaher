import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { generateMetadata as baseGenerateMetadata } from '../../../../lib/metadata';
import { getFileFromSlug } from '../../../utils/getFileFromSlug';
import ErrorPage from '../../../components/ErrorPage';
import { Avatar, AvatarImage } from "@/components/ui/avatar";

// Define BLOG_POSTS_DIR here
const BLOG_POSTS_DIR = path.join(process.cwd(), 'public', 'Bposts');

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

export async function generateMetadata({ params }) {
    params = await params;
    try {
        const filename = getFileFromSlug(params.id, BLOG_POSTS_DIR);
        if (!filename) return baseGenerateMetadata({ title: 'Post Not Found' });
        const fileContent = fs.readFileSync(path.join(BLOG_POSTS_DIR, filename), 'utf8');
        const { data: frontmatter } = matter(fileContent);
        return baseGenerateMetadata({
            title: frontmatter.title || 'Untitled Post',
            description: frontmatter.description || 'Explore this blog post'
        });
    } catch (error) {
        console.error('Error in generateMetadata:', error && error.stack ? error.stack : error);
        return baseGenerateMetadata({ title: 'Error', description: 'Post loading failed' });
    }
}

export default async function BlogPost({ params }) {
    params = await params;
    try {
        if (!fs.existsSync(BLOG_POSTS_DIR)) {
            return <ErrorPage title="Configuration Error" message="Blog directory not found" backLink="/blog" />;
        }
        
        const filename = getFileFromSlug(params.id, BLOG_POSTS_DIR);
        if (!filename) {
            return <ErrorPage title="Post Not Found" message="The requested article doesn't exist" slug={params.id} backLink="/blog" />;
        }
        
        const fileContent = fs.readFileSync(path.join(BLOG_POSTS_DIR, filename), 'utf8');
        const { data: frontmatter, content } = matter(fileContent);
        
        if (!frontmatter.title) {
            return <ErrorPage title="Invalid Format" message="Post frontmatter is incomplete" slug={params.id} backLink="/blog" />;
        }
        
        const formattedDate = frontmatter.date
            ? format(new Date(frontmatter.date), 'MMMM d, yyyy')
            : 'No publication date';
        
        // Determine author info (use defaults if not available)
        const author = frontmatter.author || "Anonymous";
        const authorImage = frontmatter.authorImage || "https://shadcnblocks.com/images/block/avatar-1.webp";
        
        // Get featured image if available
        const featuredImage = frontmatter.featuredImage || "https://shadcnblocks.com/images/block/placeholder-1.svg";

        return (
            <section className="min-h-screen pt-8 pb-16" style={{ backgroundColor: "#f0e9d2" }}>
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="relative flex flex-col justify-between gap-10 lg:flex-row">
                        {/* Sidebar with post metadata */}
                        <aside className="top-10 mx-auto h-fit w-full max-w-[65ch] lg:sticky lg:max-w-96">
                            <Link
                                href="/blog"
                                className="mb-5 flex items-center gap-1 text-[#7c6e58] hover:text-[#493e35] transition-colors"
                            >
                                <ChevronLeft className="h-full w-4" />
                                Return to blog
                            </Link>
                            <div className="bg-[#faf6ec] p-6 rounded-xl border border-[#dbd0b8] mb-6">
                              <h1 
                                  className="mb-5 text-3xl font-bold text-balance lg:text-4xl text-[#5c5546]"
                                  style={{ fontFamily: "var(--font-serif)" }}
                              >
                                  {frontmatter.title}
                              </h1>
                              <div className="flex gap-3">
                                  <Avatar className="size-7 rounded-full border border-[#dbd0b8]">
                                      <AvatarImage
                                          src={authorImage}
                                          alt={author} 
                                      />
                                  </Avatar>
                                  <div>
                                      <h2 className="font-semibold text-[#5c5546]" style={{ fontFamily: "var(--font-serif)" }}>{author}</h2>
                                      <p className="text-xs text-[#84776a]" style={{ fontFamily: "var(--font-sans)" }}>{formattedDate}</p>
                                  </div>
                              </div>
                            </div>
                        </aside>

                        {/* Article content */}
                        <article className="mx-auto prose max-w-[65ch] bg-[#faf6ec] p-8 rounded-xl border border-[#dbd0b8] shadow-sm">
                            {/* Featured image */}
                            <div>
                                <img
                                    src={featuredImage}
                                    alt={frontmatter.title}
                                    className="mt-0 mb-8 aspect-video w-full rounded-lg object-cover"
                                />
                            </div>
                            
                            {/* Description if available */}
                            {frontmatter.description && (
                                <p className="lead text-[#5c5546] text-xl" style={{ fontFamily: "var(--font-serif)" }}>
                                    {frontmatter.description}
                                </p>
                            )}
                            
                            {/* Markdown content */}
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkBreaks]}
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    a: ({ node, ...props }) => (
                                        <a {...props} className="text-[#7c6e58] hover:text-[#493e35] underline transition-colors" />
                                    ),
                                    code: ({ node, inline, className, children, ...props }) => {
                                        const match = /language-(\w+)/.exec(className || '');
                                        // Always render inline if already marked as inline
                                        if (inline) {
                                            return (
                                                <code
                                                    {...props}
                                                    className="px-1.5 py-0.5 bg-[#e6dcc1] text-[#493e35] rounded-md text-sm font-mono inline"
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
                                                    className="px-1.5 py-0.5 bg-[#e6dcc1] text-[#493e35] rounded-md text-sm font-mono inline"
                                                >
                                                    {children}
                                                </code>
                                            );
                                        }
                                        
                                        return (
                                            <code
                                                {...props}
                                                className={`${match ? `language-${match[1]}` : ''} block p-4 bg-[#e6dcc1] rounded-md text-sm text-[#493e35] font-mono whitespace-pre-wrap`}
                                            >
                                                {children}
                                            </code>
                                        );
                                    },
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
                                            className="border-l-4 border-[#c0b49b] pl-4 italic text-[#5c5546]"
                                        >
                                            {children}
                                        </blockquote>
                                    ),
                                    h1: ({ node, ...props }) => (
                                        <h1 {...props} className="text-[#5c5546] mb-4" style={{ fontFamily: "var(--font-serif)" }} />
                                    ),
                                    h2: ({ node, ...props }) => (
                                        <h2 {...props} className="text-[#5c5546] mt-8 mb-4" style={{ fontFamily: "var(--font-serif)" }} />
                                    ),
                                    h3: ({ node, ...props }) => (
                                        <h3 {...props} className="text-[#5c5546] mt-6 mb-3" style={{ fontFamily: "var(--font-serif)" }} />
                                    ),
                                    p: ({ node, ...props }) => (
                                        <p {...props} className="text-[#73695d] mb-4" style={{ fontFamily: "var(--font-sans)" }} />
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
    } catch (error) {
        console.error('Blog post rendering error:', error && error.stack ? error.stack : error);
        return <ErrorPage title="Loading Error" message="Failed to load post content" slug={params.id} backLink="/blog" />;
    }
}