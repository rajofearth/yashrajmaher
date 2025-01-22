import ProjectCard from '../../components/ProjectCard';
import { getProjects } from '../../utils/getProjects';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Project({ searchParams }) {
  const searchQuery = searchParams?.q?.trim() || '';
  const projects = getProjects(searchQuery);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-4xl font-bold">Projects</h1>
      </div>
      
      <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mb-4">
        Here's a peek at the projects I've been working on—turning ideas into reality with code, creativity, and curiosity. <br/>
        Each one tells a story, and I'd love for you to explore them. Check them out below!
      </p>

      <form className="mb-4" action="/projects" method="GET">
        <input
          type="text"
          name="q"
          placeholder="Search projects..."
          className="w-full p-2 border-2 rounded-md focus:ring-1 focus:ring-foreground/80 focus:border-foreground/50 placeholder:text-foreground/50"
          defaultValue={searchQuery}
        />
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-4">
        {projects.map((project, index) => (
          <div key={index} className="flex-auto">
            <ProjectCard 
              title={project.title}
              description={project.description}
              rawTitle={project.rawTitle}
              slug={project.slug}
            />
          </div>
        ))}
      </div>
    </div>
  );
}