import HeroImage from "./components/HeroImage";
import Socials from "./components/Socials";
import ProjectCard from "./components/ProjectCard";
import { getDevposts } from "./utils/getDevposts";
import BlogCard from "./components/BlogCard";
import { getBlogs } from "./utils/getBlogs";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Home() {
  const devposts = getDevposts();
  const blogs = getBlogs();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Theme Toggle */}
        <div className="w-full flex justify-end mb-4">
          <ThemeToggle />
        </div>
        
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center">
          <HeroImage />
          <h1 className="mt-6 text-4xl font-bold text-foreground" style={{ fontFamily: "var(--font-serif)" }}>
            Yashraj Maher
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-2xl" style={{ fontFamily: "var(--font-serif)" }}>
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
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            About Me
          </Link>
          <Link
            href="/privacy"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Privacy Policy
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Contact Me!
          </Link>
        </div>

        {/* devposts Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold text-foreground mr-2 leading-none" style={{ fontFamily: "var(--font-serif)" }}>
                Devposts
              </h2>
              <Badge variant="secondary" className="translate-y-0">
                Projects
              </Badge>
            </div>
            
            {devposts.length > 0 && devposts.length <= 6 && (
              <Link
                href="/devposts"
                className="flex items-center text-primary hover:text-primary/80 transition-colors group leading-none"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                See More
                <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {devposts.slice(0, 6).map((project, index) => (
                <ProjectCard
                  key={index}
                  title={project.title}
                  date={project.date}
                  description={project.description}
                  slug={project.slug}
                  tags={project.tags || []}
                />
              ))}
            </div>
            {devposts.length > 6 && (
              <div className="mt-8 text-center">
                <Button variant="outline" asChild>
                  <Link href="/devposts" className="flex items-center gap-2">
                    See More Projects
                    <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Blogs Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold text-foreground mr-2 leading-none" style={{ fontFamily: "var(--font-serif)" }}>
                Blog Posts
              </h2>
              <Badge variant="secondary" className="translate-y-0">
                Writing
              </Badge>
            </div>
            
            {blogs.length > 0 && blogs.length <= 6 && (
              <Link
                href="/blog"
                className="flex items-center text-primary hover:text-primary/80 transition-colors group leading-none"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                See More
                <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
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
                />
              ))}
            </div>
            {blogs.length > 6 && (
              <div className="mt-8 text-center">
                <Button variant="outline" asChild>
                  <Link href="/blog" className="flex items-center gap-2">
                    See More Articles
                    <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
