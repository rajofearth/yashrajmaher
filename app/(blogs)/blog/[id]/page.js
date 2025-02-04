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

// Constants
const POSTS_DIR = path.join(process.cwd(), 'public', 'Bposts');
const DESIGN_SYSTEM = {
  container: 'max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto px-4 py-12',
  prose: 'prose prose-gray max-w-none dark:prose-invert lg:prose-lg',
  header: 'pb-8 mb-8 border-b border-gray-200 dark:border-gray-700',
  title: 'text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4',
  date: 'text-lg text-gray-500 block mb-3',
  description: 'text-xl text-gray-600 leading-relaxed mt-6',
  backButton: 'group inline-flex items-center text-gray-500 hover:text-gray-800 transition-colors mb-8',
  imageWrapper: 'not-prose my-8',
};

// Helper functions
const getFileNameFromSlug = (slug, postsDirectory) => {
  const cleanSlug = slug.toLowerCase().replace(/[^\w-]/g, '');
  const files = fs.readdirSync(postsDirectory);
  return files.find(file =>
    path.basename(file, '.md').toLowerCase().replace(/[^\w-]/g, '') === cleanSlug
  );
};

const ErrorMessage = ({ title, message, slug }) => (
  <div className={DESIGN_SYSTEM.container}>
    <Link href="/blog" className={DESIGN_SYSTEM.backButton}>
      <ArrowLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
      Back to Blog
    </Link>
    <h1 className={DESIGN_SYSTEM.title}>{title}</h1>
    <p className="text-red-600 mt-4">{message}</p>
    {slug && <p className="text-sm text-gray-500 mt-2">Requested slug: {slug}</p>}
  </div>
);

// Custom image component
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

// Metadata generation
export async function generateMetadata({ params }) {
  try {
    const filename = getFileNameFromSlug(params.id, POSTS_DIR);
    if (!filename) return baseGenerateMetadata({ title: 'Post Not Found' });

    const fileContent = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf8');
    const { data: frontmatter } = matter(fileContent);

    return baseGenerateMetadata({
      title: frontmatter.title || 'Untitled Post',
      description: frontmatter.description || 'Explore this blog post'
    });
  } catch (error) {
    return baseGenerateMetadata({ title: 'Error', description: 'Post loading failed' });
  }
}

// Main component
export default async function BlogPost({ params }) {
  try {
    if (!fs.existsSync(POSTS_DIR)) {
      return <ErrorMessage title="Configuration Error" message="Blog directory not found" />;
    }

    const filename = getFileNameFromSlug(params.id, POSTS_DIR);
    if (!filename) {
      return <ErrorMessage title="Post Not Found" message="The requested article doesn't exist" slug={params.id} />;
    }

    const fileContent = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf8');
    const { data: frontmatter, content } = matter(fileContent);

    if (!frontmatter.title) {
      return <ErrorMessage title="Invalid Format" message="Post frontmatter is incomplete" slug={params.id} />;
    }

    const formattedDate = frontmatter.date
      ? format(new Date(frontmatter.date), 'MMMM d, yyyy')
      : 'No publication date';

    return (
      <div className={DESIGN_SYSTEM.container}>
        {/* Back button */}
        <Link href="/blog" className={DESIGN_SYSTEM.backButton}>
          <ArrowLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          All Articles
        </Link>

        {/* Metadata Section */}
        <header className={DESIGN_SYSTEM.header}>
          <h1 className={DESIGN_SYSTEM.title}>{frontmatter.title}</h1>
          <time className={DESIGN_SYSTEM.date} dateTime={frontmatter.date}>
            {formattedDate}
          </time>
          {frontmatter.description && (
            <p className={DESIGN_SYSTEM.description}>
              {frontmatter.description}
            </p>
          )}
        </header>

        {/* Content Section */}
        <article>
          <div className={DESIGN_SYSTEM.prose}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              rehypePlugins={[rehypeRaw]}
              components={{
                a: ({ node, ...props }) => (
                  <a {...props} className="text-gray-600 hover:text-gray-800 underline transition-colors" />
                ),
                code: ({ node, inline, className, children, ...props }) => (
                  <code
                    {...props}
                    className={`${className || ''} ${
                      inline ? 'px-1.5 py-0.5' : 'p-4 block overflow-x-auto'
                    } bg-gray-50 rounded-md text-sm`}
                  >
                    {children}
                  </code>
                ),
                img: MarkdownImage,
                div: ({ node, ...props }) => (
                  <div {...props} className="max-w-full" />
                ),
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto">
                    <table {...props} className="w-full" />
                  </div>
                )
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    );
  } catch (error) {
    console.error('Blog post rendering error:', error);
    return <ErrorMessage title="Loading Error" message="Failed to load post content" slug={params.id} />;
  }
}