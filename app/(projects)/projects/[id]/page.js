import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { generateMetadata as baseGenerateMetadata } from '../../../../lib/metadata';
import { getFileFromSlug } from '../../../utils/getFileFromSlug';
import ErrorPage from '../../../components/ErrorPage';

const devpost_POSTS_DIR = path.join(process.cwd(), 'public', 'devposts');

// Re-use the DESIGN_SYSTEM from the blog post page
const DESIGN_SYSTEM = {
  container: 'max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto px-4 py-12',
  prose: 'prose prose-gray max-w-none dark:prose-invert lg:prose-lg',
  header: 'pb-8 mb-8 border-b border-gray-200 dark:border-gray-700',
  title: 'text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4',
  cred_section: 'text-lg text-gray-500 block mb-3',
  date: 'text-lg text-gray-500 block mb-3',
  author: 'text-lg text-gray-500 block mb-3',
  website: 'text-lg underline text-gray-500 block mb-3',
  description: 'text-xl text-gray-600 leading-relaxed mt-6',
  backButton: 'group inline-flex items-center text-gray-500 hover:text-gray-800 transition-colors mb-8',
  imageWrapper: 'not-prose my-8', // Keep this for consistency if you add images later
};

// Custom image component (same as blog post page, for consistency)
const MarkdownImage = ({ src, alt }) => (
    <div className={DESIGN_SYSTEM.imageWrapper}>
        <img
            src={src}
            alt={alt}
            className="mx-auto rounded-lg shadow-lg"
            style={{
                maxWidth: 'min(90%, 1024px)',
                height: 'auto',
                width: 'auto',
            }}
        />
        {alt && <figcaption className="text-center text-sm text-gray-500 mt-2">{alt}</figcaption>}
    </div>
);

export async function generateMetadata({ params }) {
  const { id } = await params;
  const filename = getFileFromSlug(id, devpost_POSTS_DIR);

  let title = 'Default Title';
  let description = 'Default Description';

  if (filename) {
    const fileContent = fs.readFileSync(path.join(devpost_POSTS_DIR, filename), 'utf8');
    const { data: frontmatter } = matter(fileContent);
    title = frontmatter.title || title;
    description = frontmatter.description || description;
  }

  return baseGenerateMetadata({ title, description });
}

export default async function devpostPost({ params }) {
  const { id } = await params;

  if (!fs.existsSync(devpost_POSTS_DIR)) {
    return <ErrorPage title="devpost directory not found" message="devpost directory not found" backLink="/devposts" />;
  }

  const filename = getFileFromSlug(id, devpost_POSTS_DIR);
  if (!filename) {
    return <ErrorPage title="devpost not found" message="devpost not found" slug={id} backLink="/devposts" />;
  }

  const filePath = path.join(devpost_POSTS_DIR, filename);
  let fileContent;
  try {
    fileContent = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error('Error reading file:', error);
    return <ErrorPage title="Error loading devpost" message="Error loading devpost" slug={id} backLink="/devposts" />;
  }

  const { data: frontmatter = {}, content = '' } = matter(fileContent);
  if (!frontmatter.title) {
    return <ErrorPage title="Invalid devpost format" message="Invalid devpost format" slug={id} backLink="/devposts" />;
  }

  const formattedDate = frontmatter.date
    ? format(new Date(frontmatter.date), 'MMMM d, yyyy')
    : 'No date specified';

return (
  <div className={DESIGN_SYSTEM.container}>
    <Link href="/devposts" className={DESIGN_SYSTEM.backButton}>
      <ArrowLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
      All Devposts
    </Link>
    <header className={DESIGN_SYSTEM.header}>
      <h1 className={DESIGN_SYSTEM.title}>{frontmatter.title}</h1>
      <div className={DESIGN_SYSTEM.cred_section}>
        <div className="flex flex-wrap items-center gap-2 text-lg text-gray-500">
          {frontmatter.author && (
              <span>By: {frontmatter.author}</span>
          )}
          <span className="text-gray-300">•</span>
          <time dateTime={frontmatter.date} className="font-medium">
            {formattedDate}
          </time>
          {frontmatter.website && (
            <>
              <span className="text-gray-300">•</span>
              <a
                href={frontmatter.website}
                className="underline hover:text-gray-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {frontmatter.website}
              </a>
            </>
          )}
        </div>
      </div>
      {frontmatter.description && (
        <p className={DESIGN_SYSTEM.description}>
          {frontmatter.description}
        </p>
      )}
    </header>
    <article>
      <div className={DESIGN_SYSTEM.prose}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          rehypePlugins={[rehypeRaw]}
          components={{
          a: ({ node, ...props }) => (
            <a {...props} className="text-gray-600 hover:text-gray-800 underline transition-colors" />
          ),
          code: ({ node, inline, className, children, ...props }) => {
            if (inline) {
              return (
                <code
                  {...props}
                  className="px-1.5 py-0.5 bg-gray-50 text-gray-600 rounded-md"
                >
                  {children}
                </code>
              );
            } else {
              return (
                <code {...props} className={className}>
                  {children}
                </code>
              );
            }
          },
          pre: ({ node, children, ...props }) => (
            <pre {...props} className="bg-gray-200 p-4 text-gray-600 rounded overflow-x-auto">
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
        }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </article>
  </div>
);
}