import HeroImage from "./components/HeroImage";
import Socials from "./components/Socials";
import ProjectCard from "./components/ProjectCard";
import { getProjects } from "./utils/getProjects";
import BlogCard from "./components/BlogCard";
import { getBlogs } from "./utils/getBlogs";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const projects = getProjects();
  const blogs = getBlogs();

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center">
          <HeroImage />
          <h1 className="mt-6 text-4xl font-bold tracking-tight">
            Yashraj Maher
          </h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed max-w-2xl">
            A creator who loves crafting ideas into projects and sharing stories
            through blogs. From building apps to exploring thought-provoking
            concepts, this is where I document my journey of learning and creating.
          </p>
          <Socials className="mt-6" />
        </div>

        {/* Navigation Links */}
        <div className="mt-8 flex justify-center space-x-6">
          <Link
            href="/about"
            className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-all duration-150"
          >
            About Me
          </Link>
          <Link
            href="/privacy"
            className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-all duration-150"
          >
            Privacy Policy
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-all duration-150"
          >
            Contact Me!
          </Link>
        </div>

        {/* Projects Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Projects</h2>
            {projects.length > 0 && projects.length <= 6 && (
              <Link
                href="/projects"
                className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 transition-all duration-150 group"
              >
                See More
                <ArrowRight className="ml-1 w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
              </Link>
            )}
          </div>
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 6).map((project, index) => (
                <ProjectCard
                  key={index}
                  title={project.title}
                  date={project.date}
                  description={project.description}
                  slug={project.slug}
                  className="hover:scale-105 hover:shadow-lg transition-transform duration-200"
                />
              ))}
            </div>
            {projects.length > 6 && (
              <div className="mt-4 text-center">
                <Link
                  href="/projects"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300 transition-all duration-150 group"
                >
                  See More
                  <ArrowRight className="ml-1 w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Blogs Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Blog Posts</h2>
            {blogs.length > 0 && blogs.length <= 6 && (
              <Link
                href="/blog"
                className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 transition-all duration-150 group"
              >
                See More
                <ArrowRight className="ml-1 w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
              </Link>
            )}
          </div>
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.slice(0, 6).map((blog, index) => (
                <BlogCard
                  key={index}
                  title={blog.title}
                  date={blog.date}
                  description={blog.description}
                  slug={blog.slug}
                  className="hover:scale-105 hover:shadow-lg transition-transform duration-200"
                />
              ))}
            </div>
            {blogs.length > 6 && (
              <div className="mt-4 text-center">
                <Link
                  href="/blog"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300 transition-all duration-150 group"
                >
                  See More
                  <ArrowRight className="ml-1 w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
