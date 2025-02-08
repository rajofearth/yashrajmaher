
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


// Define BLOG_POSTS_DIR here
const BLOG_POSTS_DIR = path.join(process.cwd(), 'public', 'Bposts');

const DESIGN_SYSTEM = {  //Keep this if you use, otherwise remove
    container: 'max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto px-4 py-12',
    prose: 'prose prose-gray max-w-none dark:prose-invert lg:prose-lg',
    header: 'pb-8 mb-8 border-b border-gray-200 dark:border-gray-700',
    title: 'text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4',
    date: 'text-lg text-gray-500 block mb-3',
    description: 'text-xl text-gray-600 leading-relaxed mt-6',
    backButton: 'group inline-flex items-center text-gray-500 hover:text-gray-800 transition-colors mb-8',
    imageWrapper: 'not-prose my-8',
};

// Custom image component (remains the same and correct)
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
        return baseGenerateMetadata({ title: 'Error', description: 'Post loading failed' });
    }
}

export default async function BlogPost({ params }) {
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

        return (
            <div className={DESIGN_SYSTEM.container}>
                {}
                <Link href="/blog" className={DESIGN_SYSTEM.backButton}>
                    <ArrowLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
                    All Articles
                </Link>
                {}
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
                {}
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
                                        className={`${className || ''} ${inline ? 'px-1.5 py-0.5' : 'p-4 block overflow-x-auto'
                                            } bg-gray-50 rounded-md text-sm`}
                                    >
                                        {children}
                                    </code>
                                ),
                                img: MarkdownImage, // Use the custom image component
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
        return <ErrorPage title="Loading Error" message="Failed to load post content" slug={params.id} backLink="/blog" />;
    }
}