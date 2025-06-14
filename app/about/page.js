import { Code, PenTool, BookOpen, Rocket, ArrowRight } from "lucide-react";
import { generateMetadata } from "@/lib/metadata";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import Socials from "@/components/Socials";
import Image from "next/image";
import Link from "next/link";

export const metadata = generateMetadata({
	title: "About Me",
	description: "Learn more about Yashraj Maher - developer, student, and creative storyteller",
});

export default function About() {
	return (
		<PageLayout pageTitle="About Me" backLink="/" backText="Back Home">
			{/* Introduction Section */}
			<section className="bg-card border-border mb-16 flex flex-col items-center gap-8 rounded-xl border p-6 md:flex-row">
				<div
					className="h-48 w-48 flex-shrink-0 overflow-hidden rounded-full transition-all duration-300 hover:h-50 hover:w-50"
					style={{
						background: "linear-gradient(to bottom right, hsl(var(--card)), hsl(var(--muted)))",
						padding: "4px",
						boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
					}}
				>
					<div className="overflow-hidden rounded-full">
						<Image
							src="/my.png"
							alt="Yashraj Maher"
							width={192}
							height={192}
							className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
							priority
						/>
					</div>
				</div>
				<div className="space-y-4">
					<h2 className="text-foreground text-3xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
						Welcome!
					</h2>
					<p className="text-muted-foreground text-lg leading-relaxed" style={{ fontFamily: "var(--font-sans)" }}>
						I&apos;m Yashraj Maher&mdash;a full-stack developer, dedicated student, and creative storyteller. On this
						website, I share my journey through occasional dev blogs, personal narratives, tech insights, and even
						musings on space exploration. Every piece reflects my passion for learning, building innovative projects,
						and exploring new ideas&mdash;whether it&apos;s a detailed technical post or a creative piece of fiction.
					</p>
					<Socials />
				</div>
			</section>

			{/* What You'll Find Section */}
			<section className="mb-16">
				<h2 className="text-foreground mb-6 text-2xl font-semibold" style={{ fontFamily: "var(--font-serif)" }}>
					What You Might Discover
				</h2>
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<div className="bg-card border-border flex items-start gap-3 rounded-lg border p-4">
						<Code className="text-primary mt-1 h-6 w-6" />
						<span className="text-foreground text-lg">
							<strong style={{ fontFamily: "var(--font-serif)" }}>Dev Blogs</strong> &ndash; Occasional insights and
							stories behind the projects I build.
						</span>
					</div>
					<div className="bg-card border-border flex items-start gap-3 rounded-lg border p-4">
						<PenTool className="text-primary mt-1 h-6 w-6" />
						<span className="text-foreground text-lg">
							<strong style={{ fontFamily: "var(--font-serif)" }}>Fiction</strong> &ndash; Original stories that capture
							my creative side.
						</span>
					</div>
					<div className="bg-card border-border flex items-start gap-3 rounded-lg border p-4">
						<BookOpen className="text-primary mt-1 h-6 w-6" />
						<span className="text-foreground text-lg">
							<strong style={{ fontFamily: "var(--font-serif)" }}>Tech Insights</strong> &ndash; Occasional reflections
							and thoughtful perspectives on the ever-evolving tech world.
						</span>
					</div>
					<div className="bg-card border-border flex items-start gap-3 rounded-lg border p-4">
						<Rocket className="text-primary mt-1 h-6 w-6" />
						<span className="text-foreground text-lg">
							<strong style={{ fontFamily: "var(--font-serif)" }}>Space Exploration</strong> &ndash; Occasional musings
							and discoveries about the cosmos.
						</span>
					</div>
				</div>
			</section>

			{/* Let's Connect Section */}
			<section className="space-y-6 pb-10 text-center">
				<Button variant="outline" asChild>
					<Link href="/contact" className="flex items-center gap-2 text-lg">
						Let&apos;s Connect
						<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
					</Link>
				</Button>
				<p
					className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed"
					style={{ fontFamily: "var(--font-sans)" }}
				>
					I love collaborating and exchanging ideas with fellow creatives, developers, and explorers. Even if I
					don&apos;t always publish a post, I&apos;m always open to connecting and sharing thoughts.
				</p>
			</section>
		</PageLayout>
	);
}
