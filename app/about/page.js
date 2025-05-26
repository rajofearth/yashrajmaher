import Socials from "../components/Socials";
import { Code, PenTool, BookOpen, Rocket, ArrowRight } from "lucide-react";
import PageLayout from "../components/PageLayout";
import { generateMetadata } from "../../lib/metadata";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = generateMetadata({
  title: "About Me",
  description: "Learn more about Yashraj Maher - developer, student, and creative storyteller"
});

export default function About() {
  return (
    <PageLayout
      pageTitle="About Me"
      backLink="/"
      backText="Back Home"
    >
      {/* Introduction Section */}
      <section className="flex flex-col md:flex-row items-center gap-8 mb-16 bg-[#faf6ec] p-6 rounded-xl border border-[#dbd0b8]">
        <div className="flex-shrink-0 overflow-hidden rounded-full w-48 h-48 transition-all duration-300 hover:w-50 hover:h-50"
             style={{
               background: "linear-gradient(to bottom right, #faf6ec, #e6dcc1)",
               padding: "4px",
               boxShadow: "0 4px 12px rgba(151, 138, 110, 0.2)",
             }}>
          <div className="overflow-hidden rounded-full">
            <img
              src="/my.png"
              alt="Yashraj Maher"
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-[#5c5546]" style={{ fontFamily: "var(--font-serif)" }}>
            Welcome!
          </h2>
          <p className="text-lg leading-relaxed text-[#73695d]" style={{ fontFamily: "var(--font-sans)" }}>
            I'm Yashraj Maher—a full-stack developer, dedicated student, and creative storyteller. On this website, I share my journey through occasional dev blogs, personal narratives, tech insights, and even musings on space exploration. Every piece reflects my passion for learning, building innovative projects, and exploring new ideas—whether it's a detailed technical post or a creative piece of fiction.
          </p>
          <Socials />
        </div>
      </section>

      {/* What You'll Find Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-[#5c5546]" style={{ fontFamily: "var(--font-serif)" }}>
          What You Might Discover
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-start gap-3 p-4 bg-[#faf6ec] rounded-lg border border-[#dbd0b8]">
            <Code className="w-6 h-6 text-[#7c6e58] mt-1" />
            <span className="text-lg text-[#5c5546]">
              <strong style={{ fontFamily: "var(--font-serif)" }}>Dev Blogs</strong> – Occasional insights and stories behind the projects I build.
            </span>
          </div>
          <div className="flex items-start gap-3 p-4 bg-[#faf6ec] rounded-lg border border-[#dbd0b8]">
            <PenTool className="w-6 h-6 text-[#7c6e58] mt-1" />
            <span className="text-lg text-[#5c5546]">
              <strong style={{ fontFamily: "var(--font-serif)" }}>Fiction</strong> – Original stories that capture my creative side.
            </span>
          </div>
          <div className="flex items-start gap-3 p-4 bg-[#faf6ec] rounded-lg border border-[#dbd0b8]">
            <BookOpen className="w-6 h-6 text-[#7c6e58] mt-1" />
            <span className="text-lg text-[#5c5546]">
              <strong style={{ fontFamily: "var(--font-serif)" }}>Tech Insights</strong> – Occasional reflections and thoughtful perspectives on the ever-evolving tech world.
            </span>
          </div>
          <div className="flex items-start gap-3 p-4 bg-[#faf6ec] rounded-lg border border-[#dbd0b8]">
            <Rocket className="w-6 h-6 text-[#7c6e58] mt-1" />
            <span className="text-lg text-[#5c5546]">
              <strong style={{ fontFamily: "var(--font-serif)" }}>Space Exploration</strong> – Occasional musings and discoveries about the cosmos.
            </span>
          </div>
        </div>
      </section>

      {/* Let's Connect Section */}
      <section className="space-y-6 pb-10 text-center">
        <Button variant="outline" asChild className="bg-[#faf6ec] border-[#dbd0b8] hover:bg-[#e6dcc1] text-[#5c5546]">
          <Link href="/contact" className="flex items-center gap-2 text-lg">
            Let's Connect
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
        <p className="text-lg leading-relaxed text-[#73695d] max-w-2xl mx-auto" style={{ fontFamily: "var(--font-sans)" }}>
          I love collaborating and exchanging ideas with fellow creatives, developers, and explorers. Even if I don't always publish a post, I'm always open to connecting and sharing thoughts.
        </p>
      </section>
    </PageLayout>
  );
}
