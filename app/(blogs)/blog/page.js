import { ArrowRight, ChevronLeft, Search } from "lucide-react";
import Link from "next/link";
import { getBlogs } from "../../utils/getBlogs";
import { generateMetadata } from "../../../lib/metadata";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { formatDate } from "../../utils/formatDate";
import LiveSearch from "../../components/LiveSearch";

export const metadata = generateMetadata({
  title: "Blog",
  description: "Explore my thoughts, stories and ideas through my blog posts"
});

export default async function Page({ searchParams }) {
  const params = await searchParams;
  const searchQuery = params?.q?.trim() || '';
  const allBlogs = getBlogs(''); // Get all blogs
  
  return (
    <section className="min-h-screen pt-8 pb-16" style={{ backgroundColor: "#f0e9d2" }}>
      <div className="container mx-auto flex flex-col items-center gap-8 max-w-5xl">
        {/* Back Button - styled and positioned like the [id] page */}
        <div className="w-full flex justify-start mb-2">
          <Link
            href="/"
            className="flex items-center gap-1 text-[#7c6e58] hover:text-[#493e35] transition-colors mb-2"
          >
            <ChevronLeft className="h-full w-4" />
            Back Home
          </Link>
        </div>
        <div className="text-center">
          <Badge variant="secondary" className="mb-2 bg-[#e6dcc1] text-[#5c5546]">
            Personal Blog
          </Badge>
          <h1 className="mb-3 text-4xl md:text-5xl lg:text-6xl font-bold text-[#5c5546]" style={{ fontFamily: "var(--font-serif)" }}>
            Collected Thoughts
          </h1>
          <p className="mb-8 text-[#73695d] md:text-lg max-w-2xl mx-auto" style={{ fontFamily: "var(--font-serif)" }}>
            Exploring the intersection of technology, creativity, and human experience. Dive into essays, tutorials, and personal reflections on modern development.
          </p>
          
          {/* Live Search Component */}
          <LiveSearch 
            initialQuery={searchQuery} 
            allBlogs={allBlogs} 
          />
        </div>
      </div>
    </section>
  );
}
