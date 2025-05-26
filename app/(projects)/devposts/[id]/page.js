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
import { design } from '@/lib/design-system';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const devpost_POSTS_DIR = path.join(process.cwd(), 'public', 'devposts');

// Custom image component for markdown rendering
const MarkdownImage = ({ src, alt }) => (
    <div className="my-8">
        <img
            src={src}
            alt={alt}
            className="w-full rounded-lg object-cover aspect-video mb-2"
        />
        {alt && <figcaption className="text-center text-sm text-[#84776a]">{alt}</figcaption>}
    </div>
);

export async function generateMetadata({ params }) {
  const { id } = await params;
  const filename = getFileFromSlug(id, devpost_POSTS_DIR);

  let title = 'Project';
  let description = 'Project details';

  if (filename) {
    const fileContent = fs.readFileSync(path.join(devpost_POSTS_DIR, filename), 'utf8');
    const { data: frontmatter } = matter(fileContent);
    title = frontmatter.title || title;
    description = frontmatter.description || description;
  }

  return baseGenerateMetadata({ title, description });
}

export default async function DevpostPost({ params }) {
  const { id } = await params;

  if (!fs.existsSync(devpost_POSTS_DIR)) {
    return <ErrorPage title="Project directory not found" message="Project directory not found" backLink="/devposts" />;
  }

  const filename = getFileFromSlug(id, devpost_POSTS_DIR);
  if (!filename) {
    return <ErrorPage title="Project not found" message="The requested project doesn't exist" slug={id} backLink="/devposts" />;
  }

  const filePath = path.join(devpost_POSTS_DIR, filename);
  let fileContent;
  try {
    fileContent = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error('Error reading file:', error);
    return <ErrorPage title="Error loading project" message="Failed to load project content" slug={id} backLink="/devposts" />;
  }

  const { data: frontmatter = {}, content = '' } = matter(fileContent);
  if (!frontmatter.title) {
    return <ErrorPage title="Invalid project format" message="Project data is incomplete" slug={id} backLink="/devposts" />;
  }

  const formattedDate = frontmatter.date
    ? format(new Date(frontmatter.date), 'MMMM d, yyyy')
    : 'No date specified';
    
  // Determine author info (use defaults if not available)
  const author = frontmatter.author || "Yashraj Maher";
  const authorImage = frontmatter.authorImage || "https://shadcnblocks.com/images/block/avatar-1.webp";
  
  // Get featured image if available
  const featuredImage = frontmatter.featuredImage || "https://shadcnblocks.com/images/block/placeholder-1.svg";

  return (
    <section className="min-h-screen pt-8 pb-16" style={{ backgroundColor: "#f0e9d2" }}>
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="relative flex flex-col justify-between gap-10 lg:flex-row">
          {/* Sidebar with project metadata */}
          <aside className="top-10 mx-auto h-fit w-full max-w-[65ch] lg:sticky lg:max-w-96">
            <Link
              href="/devposts"
              className="mb-5 flex items-center gap-1 text-[#7c6e58] hover:text-[#493e35] transition-colors"
            >
              <ChevronLeft className="h-full w-4" />
              All Projects
            </Link>
            <div className="bg-[#faf6ec] p-6 rounded-xl border border-[#dbd0b8] mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-[#e6dcc1] text-[#5c5546]">
                  Project
                </Badge>
                {frontmatter.tags && frontmatter.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="bg-[#e6dcc1] text-[#5c5546]">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <h1 
                className="mb-5 text-3xl font-bold text-balance lg:text-4xl text-[#5c5546]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {frontmatter.title}
              </h1>
              
              <div className="flex items-center justify-between mb-4">
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
                
                {frontmatter.website && (
                  <a
                    href={frontmatter.website.startsWith('http') ? frontmatter.website : `https://${frontmatter.website}`}
                    className="text-xs inline-flex items-center gap-1 px-2 py-1 bg-[#e6dcc1] hover:bg-[#dbd0b8] text-[#493e35] rounded-md transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {frontmatter.website.includes('github.com') ? (
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
          
          {/* Project Content */}
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
                pre: ({ node, children, ...props }) => (
                  <pre {...props} className="bg-[#e6dcc1] p-4 text-[#493e35] rounded-md whitespace-pre-wrap">
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
                    className="border-l-4 border-[#c0b49b] pl-4 italic text-[#5c5546]"
                  >
                    {children}
                  </blockquote>
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