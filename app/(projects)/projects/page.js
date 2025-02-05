import ProjectCard from '../../components/ProjectCard';
import { getProjects } from '../../utils/getProjects';
import { ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';
import { generateMetadata } from '../../../lib/metadata';

export const metadata = generateMetadata({
  title: "Projects",
  description: "Explore my portfolio of projects and technical work"
});

// Mark the component as async to await searchParams
export default async function Project({ searchParams }) {
  const params = await searchParams;
  const searchQuery = params?.q?.trim() || '';
  const projects = getProjects(searchQuery);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <Link 
                href="/" 
                className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors mb-4 md:mb-0 group"
              >
                <ArrowLeft className="w-5 h-5 mr-1 transition-transform duration-150 group-hover:-translate-x-1" />
                Back Home
              </Link>
              <h1 className="text-4xl font-bold mb-2 tracking-tight">
                Crafted Projects
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl">
                An architectural approach to problem-solving through code. Explore case studies ranging from experimental prototypes to production-grade applications.
              </p>
            </div>
            <div className="w-full md:w-64">
              {/* Search Bar */}
              <form action="/projects" method="GET">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-4 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    name="q"
                    placeholder="Filter projects..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-400 focus:bg-white placeholder-gray-500 transition-all text-lg"
                    defaultValue={searchQuery}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className={`grid gap-8 pb-8
            grid-cols-1 md:grid-cols-2 lg:grid-cols-3
            ${projects.length === 0 ? 'md:grid-cols-1' : ''}`}>
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <ProjectCard 
                key={index}
                title={project.title}
                description={project.description}
                date={project.date}
                rawTitle={project.rawTitle}
                slug={project.slug}
                className="hover:scale-105 hover:shadow-lg transition-transform duration-200"
              />
            ))
          ) : (
            <div className="text-center py-12 col-span-full">
              <div className="text-gray-400 mb-4 text-4xl">⤫</div>
              <p className="text-xl text-gray-500 mb-2">No matches found</p>
              <p className="text-gray-400">Try different search terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}