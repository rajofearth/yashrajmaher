import { ThemeToggle } from "@/components/ui/theme-toggle";
import ProjectCard from "@/components/ProjectCard";
import { getDevposts } from "@/utils/getdevposts";
import { Button } from "@/components/ui/button";
import HeroImage from "@/components/HeroImage";
import { Badge } from "@/components/ui/badge";
import BlogCard from "@/components/BlogCard";
import { getBlogs } from "@/utils/getBlogs";
import Socials from "@/components/Socials";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
	const devposts = getDevposts();
	const blogs = getBlogs();

	return (
		<div className="bg-background min-h-screen">
			<div className="mx-auto max-w-5xl px-6 py-12">
				{/* Theme Toggle */}
				<div className="mb-4 flex w-full justify-end">
					<ThemeToggle />
				</div>

				{/* Hero Section */}
				<div className="flex flex-col items-center text-center">
					<HeroImage />
					<h1 className="text-foreground mt-6 text-4xl font-bold" style={{ fontFamily: "var(--font-serif)" }}>
						Yashraj Maher
					</h1>
					<p
						className="text-muted-foreground mt-4 max-w-2xl text-lg leading-relaxed"
						style={{ fontFamily: "var(--font-serif)" }}
					>
						A creator who loves crafting ideas into projects and sharing stories through blogs. From building apps to
						exploring thought-provoking concepts, this is where I document my journey of learning and creating.
					</p>
					<Socials className="mt-6" />
				</div>

				{/* Navigation Links */}
				<div className="mt-8 flex justify-center space-x-6">
					<Link
						href="/about"
						className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
						style={{ fontFamily: "var(--font-sans)" }}
					>
						About Me
					</Link>
					<Link
						href="/privacy"
						className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
						style={{ fontFamily: "var(--font-sans)" }}
					>
						Privacy Policy
					</Link>
					<Link
						href="/contact"
						className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
						style={{ fontFamily: "var(--font-sans)" }}
					>
						Contact Me!
					</Link>
				</div>

				{/* Devposts Section */}
				<div className="mt-16">
					<div className="mb-6 flex items-center justify-between">
						<div className="flex items-center">
							<h2
								className="text-foreground mr-2 text-2xl leading-none font-bold"
								style={{ fontFamily: "var(--font-serif)" }}
							>
								Devposts
							</h2>
							<Badge variant="secondary" className="translate-y-0">
								Projects
							</Badge>
						</div>
						{0 < devposts.length && 6 >= devposts.length && (
							<Link
								href="/devposts"
								className="text-primary hover:text-primary/80 group flex items-center leading-none transition-colors"
								style={{ fontFamily: "var(--font-serif)" }}
							>
								See More <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
							</Link>
						)}
					</div>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
					{6 < devposts.length && (
						<div className="mt-8 text-center">
							<Button variant="outline" asChild>
								<Link href="/devposts" className="flex items-center gap-2">
									See More Projects
									<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
								</Link>
							</Button>
						</div>
					)}
				</div>

				{/* Blogs Section */}
				<div className="mt-16">
					<div className="mb-6 flex items-center justify-between">
						<div className="flex items-center">
							<h2
								className="text-foreground mr-2 text-2xl leading-none font-bold"
								style={{ fontFamily: "var(--font-serif)" }}
							>
								Blog Posts
							</h2>
							<Badge variant="secondary" className="translate-y-0">
								Writing
							</Badge>
						</div>
						{0 < blogs.length && 6 >= blogs.length && (
							<Link
								href="/blog"
								className="text-primary hover:text-primary/80 group flex items-center leading-none transition-colors"
								style={{ fontFamily: "var(--font-serif)" }}
							>
								See More <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
							</Link>
						)}
					</div>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
					{6 < blogs.length && (
						<div className="mt-8 text-center">
							<Button variant="outline" asChild>
								<Link href="/blog" className="flex items-center gap-2">
									See More Articles
									<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
								</Link>
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
