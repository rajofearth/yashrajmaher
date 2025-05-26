"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

// Local formatDate function to avoid passing server functions to client
function formatDate(dateObj) {
  if (!dateObj) return '';
  // Handle both Date objects and date strings
  const date = dateObj instanceof Date ? dateObj : new Date(dateObj);
  // Check if date is valid before formatting
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function LiveSearch({ initialQuery = "", allBlogs = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [filteredBlogs, setFilteredBlogs] = useState([]);

  // Update URL when search changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (debouncedQuery) {
      params.set("q", debouncedQuery);
    } else {
      params.delete("q");
    }
    
    // Update URL without reloading the page
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    window.history.replaceState({ path: newUrl }, "", newUrl);
  }, [debouncedQuery, searchParams]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // 300ms debounce delay
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter blogs based on debounced query
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setFilteredBlogs(allBlogs);
      return;
    }
    
    const queryLower = debouncedQuery.toLowerCase();
    const filtered = allBlogs.filter(blog => 
      blog.rawTitle.toLowerCase().includes(queryLower) || 
      blog.rawDescription.toLowerCase().includes(queryLower)
    );
    
    // Highlight matches in title and description
    const highlighted = filtered.map(blog => {
      const escapedQuery = debouncedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedQuery})`, 'gi');
      const title = blog.rawTitle.replace(regex, '<span class="bg-yellow-100 text-[#493e35] rounded px-0.5">$1</span>');
      const description = blog.rawDescription.replace(regex, '<span class="bg-yellow-100 text-[#493e35] rounded px-0.5">$1</span>');
      
      return {
        ...blog,
        title,
        description,
      };
    });
    
    setFilteredBlogs(highlighted);
  }, [debouncedQuery, allBlogs]);

  return (
    <>
      <div className="max-w-md mx-auto mb-12">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-gray-500" />
          <input
            type="text"
            name="q"
            placeholder="Search posts..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#dbd0b8] focus:border-[#c0b49b] bg-[#faf6ec] focus:ring-2 focus:ring-[#c0b49b] placeholder-gray-500 transition-all text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ fontFamily: "var(--font-sans)" }}
          />
        </div>
      </div>
      
      {filteredBlogs.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full">
          {filteredBlogs.map((blog, index) => (
            <Card key={index} className="bg-[#faf6ec] border-[#dbd0b8] shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-2 text-left">
                <h3 className="text-xl font-semibold text-[#493e35] hover:text-[#7c6e58] transition-colors text-left" style={{ fontFamily: "var(--font-serif)" }}>
                  <Link href={`/blog/${blog.slug}`} 
                        dangerouslySetInnerHTML={{ __html: blog.title }} />
                </h3>
                <p className="text-sm text-[#84776a] italic text-left" style={{ fontFamily: "var(--font-serif)" }}>
                  {formatDate(blog.date)}
                </p>
              </CardHeader>
              <CardContent className="text-left">
                <p className="text-[#5c5546] text-left" style={{ fontFamily: "var(--font-sans)" }}
                   dangerouslySetInnerHTML={{ __html: blog.description }} />
              </CardContent>
              <CardFooter className="text-left">
                <Link
                  href={`/blog/${blog.slug}`}
                  className="flex items-center text-[#7c6e58] hover:text-[#493e35] transition-colors group"
                  style={{ fontFamily: "var(--font-serif)" }}>
                  Read more
                  <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 w-full">
          <div className="text-[#b5a89a] mb-4 text-4xl">⨯</div>
          <p className="text-xl text-[#73695d] mb-2" style={{ fontFamily: "var(--font-serif)" }}>No matching posts found</p>
          <p className="text-[#84776a]" style={{ fontFamily: "var(--font-sans)" }}>Try different search terms</p>
        </div>
      )}
    </>
  );
} 