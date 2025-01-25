import HeroImage from "./components/HeroImage";
import Socials from "./components/Socials";
import ProjectCard from "./components/ProjectCard";
import { getProjects } from "./utils/getProjects";
import BlogCard from './components/BlogCard';
import { getBlogs } from './utils/getBlogs';
import Link from 'next/link'

export default function Home() {
  const projects = getProjects();
  const blogs = getBlogs();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col items-center text-center">
        <HeroImage />
        <h1 className="mt-4 text-4xl">Yashraj Maher</h1>
        <p className="mt-2">
          A creator who loves crafting ideas into projects and sharing stories through blogs.<br/>
          From building apps to exploring thought-provoking concepts, this is where I document my journey of learning and creating.
        </p>
        <Socials />
      </div>
      <div className="w-full mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl">Projects</h2>
          <Link href="/projects" className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">
            Show More
          </Link>
        </div>
        <div className="flex overflow-x-auto space-x-4 pb-4">
          {projects.map((project, index) => (
            <div key={index} className="flex-none w-64">
              <ProjectCard 
                title={project.title}
                date={project.date}
                description={project.description}
                rawTitle={project.rawTitle}
                slug={project.slug}
              />
            </div>
          ))}
        </div>
      </div>
    {/* Blogs Section */}
    <div className="w-full mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl">Blog Posts</h2>
          <Link href="/blog" className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">
            Show More
          </Link>
        </div>
	<div className="flex overflow-x-auto space-x-4 pb-4">
          {blogs.map((blog, index) => (
            <div key={index} className="flex-none w-64">
              <BlogCard 
                title={blog.title}
                date={blog.date}
                description={blog.description}
                rawTitle = {blog.rawTitle}
	              slug={blog.slug}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}