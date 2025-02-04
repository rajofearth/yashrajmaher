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

function getFileNameFromSlug(slug, projectsDirectory) {
    try {
        const files = fs.readdirSync(projectsDirectory);
        const cleanSlug = slug.toLowerCase().replace(/[^\w-]/g, '');
        return files.find(file => {
            const base = path.basename(file, '.md');
            return base.toLowerCase().replace(/[^\w-]/g, '') === cleanSlug;
        }) || null;
    } catch (error) {
        console.error('Error reading directory:', error);
        return null;
    }
}

export async function generateMetadata({ params }) {
    const { id } = await params;
    const projectsDirectory = path.join(process.cwd(), 'public', 'projects');
    const filename = getFileNameFromSlug(id, projectsDirectory);

    let title = 'Default Title';
    let description = 'Default Description';

    if (filename) {
        const fileContent = fs.readFileSync(path.join(projectsDirectory, filename), 'utf8');
        const { data: frontmatter } = matter(fileContent);
        title = frontmatter.title || title;
        description = frontmatter.description || description;
    }

    return baseGenerateMetadata({ title, description });
}

export default async function ProjectPost({ params }) {
    const { id } = await params;
    const projectsDirectory = path.join(process.cwd(), 'public', 'projects');

    if (!fs.existsSync(projectsDirectory)) {
        return renderError('Project directory not found');
    }

    const filename = getFileNameFromSlug(id, projectsDirectory);
    if (!filename) {
        return renderError('Project not found', id);
    }

    const filePath = path.join(projectsDirectory, filename);
    let fileContent;
    try {
        fileContent = fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error('Error reading file:', error);
        return renderError('Error loading project', id);
    }

    const { data: frontmatter = {}, content = '' } = matter(fileContent);

    if (!frontmatter.title) {
        return renderError('Invalid project format', id);
    }
    // 6. Format date safely
    const formattedDate = frontmatter.date ? 
        format(new Date(frontmatter.date), 'MMMM d, yyyy') : 
        'No date specified';

return (
    <div className="max-w-3xl mx-auto py-8">
        {/* Title and Description Section */}
        <div className="mb-8 bg-gray-100 p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-4">
                <Link href="/projects" className="p-2 hover:bg-gray-200 rounded-full">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-5xl font-bold text-gray-900">{frontmatter.title}</h1>
            </div>
            <p className="text-sm text-gray-600 mb-4">{formattedDate}</p>
            {frontmatter.description && (
                <p className="text-lg text-gray-700 mt-4">{frontmatter.description}</p>
            )}
        </div>
        {/* Content Section */}
        <div className="prose prose-lg prose-slate max-w-none dark:prose-invert">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                rehypePlugins={[rehypeRaw]}
            >
                {content}
            </ReactMarkdown>
        </div>
    </div>
);

}

function renderError(message, slug = '') {
    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/projects" className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-4xl font-bold">Error</h1>
            </div>
            <p className="text-red-600">{message}</p>
            {slug && <p className="text-sm text-gray-600 mt-2">Slug: {slug}</p>}
        </div>
    );
}
