import ProjectCard from '../../components/ProjectCard';
import { getdevposts } from '../../utils/getdevposts';
import { Search } from 'lucide-react';
import { generateMetadata } from '../../../lib/metadata';
import PageLayout from '../../components/PageLayout';
import LiveProjectSearch from '../../components/LiveProjectSearch';

export const metadata = generateMetadata({
  title: "Devposts",
  description: "Explore my portfolio of projects and technical work"
});

// Mark the component as async to await searchParams
export default async function DevPostsPage({ searchParams }) {
  const params = await searchParams;
  const searchQuery = params?.q?.trim() || '';
  const allDevposts = getdevposts(''); // Get all devposts for client-side filtering

  return (
    <PageLayout
      pageTitle="Crafted Projects"
      pageDescription="An architectural approach to problem-solving through code. Explore case studies ranging from experimental prototypes to production-grade applications."
      badge="Projects"
      backLink="/"
      backText="Back Home"
    >
      {/* Live Project Search Component */}
      <LiveProjectSearch initialQuery={searchQuery} allDevposts={allDevposts} />
    </PageLayout>
  );
}