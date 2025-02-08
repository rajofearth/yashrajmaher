import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-4">About Me</h1>
        <p className="mb-6">
          Hi, I’m <strong>Yashraj Maher</strong>, a creator who loves crafting ideas into projects and sharing stories. I build apps, explore innovative concepts, and document my journey of learning and creating. This blog is my personal space where I share my experiences, thoughts, and projects in the world of tech and creativity.
        </p>
        <p className="mb-6">
          Thanks for stopping by – let’s connect and explore the fascinating intersections of technology and storytelling together!
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 transition-all duration-150"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
