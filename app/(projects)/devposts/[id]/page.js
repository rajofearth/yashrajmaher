import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { format } from 'date-fns';
import { generateMetadata as baseGenerateMetadata } from '../../../../lib/metadata';
import { getFileFromSlug } from '../../../utils/getFileFromSlug';
import ErrorPage from '../../../components/ErrorPage';
import ArticleLayout from '../../../components/ArticleLayout';

const DEVPOSTS_DIR = path.join(process.cwd(), 'public', 'devposts');

export async function generateMetadata({ params }) {
  try {
  const { id } = await params;
    if (!id) return baseGenerateMetadata({ title: 'Project Not Found' });

    const filename = getFileFromSlug(id, DEVPOSTS_DIR);
    if (!filename) return baseGenerateMetadata({ title: 'Project Not Found' });

    const fileContent = fs.readFileSync(path.join(DEVPOSTS_DIR, filename), 'utf8');
    const { data: frontmatter } = matter(fileContent);
    
    const title = frontmatter?.title || 'Project';
    const description = frontmatter?.description || 'Project details';

    return baseGenerateMetadata({ title, description });
  } catch (error) {
    console.error('Error in generateMetadata:', error);
    return baseGenerateMetadata({ title: 'Error', description: 'Project loading failed' });
  }
}

export default async function DevpostPost({ params }) {
  try {
  const { id } = await params;
    if (!id) {
      return <ErrorPage title="Invalid Request" message="Missing project identifier" backLink="/devposts" />;
    }

    if (!fs.existsSync(DEVPOSTS_DIR)) {
    return <ErrorPage title="Project directory not found" message="Project directory not found" backLink="/devposts" />;
  }

    const filename = getFileFromSlug(id, DEVPOSTS_DIR);
  if (!filename) {
    return <ErrorPage title="Project not found" message="The requested project doesn't exist" slug={id} backLink="/devposts" />;
  }

    const filePath = path.join(DEVPOSTS_DIR, filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');

  const { data: frontmatter = {}, content = '' } = matter(fileContent);
  if (!frontmatter.title) {
    return <ErrorPage title="Invalid project format" message="Project data is incomplete" slug={id} backLink="/devposts" />;
  }
  
  // Check if project is published
  const status = frontmatter.status || 'published'; // Default to published for backward compatibility
  if (status !== 'published') {
    return <ErrorPage title="Project Not Available" message="This project is not currently available" backLink="/devposts" />;
  }

  const formattedDate = frontmatter.date
    ? format(new Date(frontmatter.date), 'MMMM d, yyyy')
    : 'No date specified';

  return (
      <ArticleLayout
        title={frontmatter.title}
        description={frontmatter.description}
        date={formattedDate}
        author={frontmatter.author || "Yashraj Maher"}
        authorImage={frontmatter.authorImage || "https://shadcnblocks.com/images/block/avatar-1.webp"}
        featuredImage={frontmatter.featuredImage}
        content={content}
        backLink="/devposts"
        backText="All Projects"
        tags={frontmatter.tags || []}
        isProject={true}
        website={frontmatter.website}
      />
    );
  } catch (error) {
    console.error('Error in DevpostPost:', error);
    return <ErrorPage title="Error loading project" message="Failed to load project content" backLink="/devposts" />;
  }
}