import Link from "next/link";
import Socials from "../components/Socials";
import { Code, PenTool, BookOpen, Rocket, ArrowRight, ArrowLeft } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="max-w-6xl mx-auto px-6 py-10 relative">
        <Link
          href="/"
          className="absolute left-4 top-4 md:left-0 md:top-10 flex items-center gap-2 text-lg font-semibold text-gray-600 hover:text-gray-800 transition-transform duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </Link>
        <h1 className="text-5xl font-bold tracking-tight text-center">
          About Me
        </h1>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 space-y-16">
        {/* Introduction Section */}
        <section className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0 overflow-hidden rounded-full w-48 h-48 border-4 border-gray-300 transition-all duration-300 hover:w-50 hover:h-50">
            <img
              src="my.png"
              alt="Yashraj Maher"
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold">Welcome!</h2>
            <p className="text-lg leading-relaxed">
              I'm Yashraj Maher—a full-stack developer, dedicated student, and creative storyteller. On this website, I share my journey through occasional dev blogs, personal narratives, tech insights, and even musings on space exploration. Every piece reflects my passion for learning, building innovative projects, and exploring new ideas—whether it's a detailed technical post or a creative piece of fiction.
            </p>
            <Socials />
          </div>
        </section>

        {/* What You'll Find Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">What You Might Discover</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <Code className="w-6 h-6 text-blue-600" />
              <span className="text-lg text-gray-700">
                <strong>Dev Blogs</strong> – Occasional insights and stories behind the projects I build.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <PenTool className="w-6 h-6 text-purple-600" />
              <span className="text-lg text-gray-700">
                <strong>Fiction</strong> – Original stories that capture my creative side.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-green-600" />
              <span className="text-lg text-gray-700">
                <strong>Tech Insights</strong> – Occasional reflections and thoughtful perspectives on the ever-evolving tech world.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Rocket className="w-6 h-6 text-red-600" />
              <span className="text-lg text-gray-700">
                <strong>Space Exploration</strong> – Occasional musings and discoveries about the cosmos.
              </span>
            </div>
          </div>
        </section>

        {/* Let's Connect Section */}
        <section className="space-y-6 pb-10">
          <Link
            href="/contact"
            className="group inline-flex items-center text-2xl font-semibold transition-transform duration-300 hover:underline hover:text-blue-600 active:scale-95"
          >
            Let's Connect
            <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <p className="text-lg leading-relaxed">
            I love collaborating and exchanging ideas with fellow creatives, developers, and explorers. Even if I don't always publish a post, I'm always open to connecting and sharing thoughts.
          </p>
        </section>
      </main>
    </div>
  );
}
