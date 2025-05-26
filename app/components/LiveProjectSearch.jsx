"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import ProjectCard from '../components/ProjectCard';

export default function LiveProjectSearch({ initialQuery = "", allDevposts = [] }) {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [filteredDevposts, setFilteredDevposts] = useState([]);

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

  // Filter projects based on debounced query
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setFilteredDevposts(allDevposts);
      return;
    }
    
    const queryLower = debouncedQuery.toLowerCase();
    const filtered = allDevposts.filter(devpost => 
      devpost.rawTitle?.toLowerCase().includes(queryLower) || 
      devpost.rawDescription?.toLowerCase().includes(queryLower)
    );
    
    // Highlight matches in title and description
    const highlighted = filtered.map(devpost => {
      const escapedQuery = debouncedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedQuery})`, 'gi');
      
      let title = devpost.rawTitle || "";
      let description = devpost.rawDescription || "";
      
      title = title.replace(regex, '<span class="bg-yellow-100 text-[#493e35] rounded px-0.5">$1</span>');
      description = description.replace(regex, '<span class="bg-yellow-100 text-[#493e35] rounded px-0.5">$1</span>');
      
      return {
        ...devpost,
        title,
        description,
      };
    });
    
    setFilteredDevposts(highlighted);
  }, [debouncedQuery, allDevposts]);

  return (
    <>
      <div className="max-w-md mx-auto mb-12">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-gray-500" />
          <input
            type="text"
            name="q"
            placeholder="Filter projects..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#dbd0b8] focus:border-[#c0b49b] bg-[#faf6ec] focus:ring-2 focus:ring-[#c0b49b] placeholder-gray-500 transition-all text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ fontFamily: "var(--font-sans)" }}
          />
        </div>
      </div>
      
      {filteredDevposts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevposts.map((devpost, index) => (
            <ProjectCard 
              key={index}
              title={devpost.title}
              description={devpost.description}
              date={devpost.date}
              slug={devpost.slug}
              tags={devpost.tags || []}
              className="text-left"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 w-full">
          <div className="text-[#b5a89a] mb-4 text-4xl">⨯</div>
          <p className="text-xl text-[#73695d] mb-2" style={{ fontFamily: "var(--font-serif)" }}>No projects found</p>
          <p className="text-[#84776a]" style={{ fontFamily: "var(--font-sans)" }}>Try different search terms</p>
        </div>
      )}
    </>
  );
} 