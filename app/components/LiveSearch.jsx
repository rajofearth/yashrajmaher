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
import { Badge } from "@/components/ui/badge";

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

export default function LiveSearch({ 
  initialQuery = "", 
  allItems = [],
  contentType = "blog" // "blog" or "project" 
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [filteredItems, setFilteredItems] = useState([]);

  // Determine the base route based on content type
  const baseRoute = contentType === "project" ? "/devposts" : "/blog";

  // Update URL when search changes
  useEffect(() => {
    try {
      const params = new URLSearchParams(searchParams?.toString() || "");
      
      if (debouncedQuery) {
        params.set("q", debouncedQuery);
      } else {
        params.delete("q");
      }
      
      // Update URL without reloading the page
      const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
      window.history.replaceState({ path: newUrl }, "", newUrl);
    } catch (error) {
      console.error("Error updating URL:", error);
    }
  }, [debouncedQuery, searchParams]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // 300ms debounce delay
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter items based on debounced query
  useEffect(() => {
    try {
      if (!Array.isArray(allItems)) {
        console.error("allItems is not an array:", allItems);
        setFilteredItems([]);
        return;
      }
      
      if (!debouncedQuery || !debouncedQuery.trim()) {
        setFilteredItems(allItems);
        return;
      }
      
      const queryLower = debouncedQuery.toLowerCase();
      const filtered = allItems.filter(item => {
        const title = item?.rawTitle || "";
        const description = item?.rawDescription || "";
        return title.toLowerCase().includes(queryLower) || 
               description.toLowerCase().includes(queryLower);
      });
      
      // Highlight matches in title and description
      const highlighted = filtered.map(item => {
        try {
          const title = item?.rawTitle || "";
          const description = item?.rawDescription || "";
          const escapedQuery = debouncedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`(${escapedQuery})`, 'gi');
          
          const highlightedTitle = title.replace(regex, '<span class="bg-accent/30 text-accent-foreground rounded px-0.5">$1</span>');
          const highlightedDescription = description.replace(regex, '<span class="bg-accent/30 text-accent-foreground rounded px-0.5">$1</span>');
          
          return {
            ...item,
            title: highlightedTitle,
            description: highlightedDescription,
          };
        } catch (error) {
          console.error("Error highlighting item:", error);
          return {
            ...item,
            title: item?.rawTitle || "",
            description: item?.rawDescription || ""
          };
        }
      });
      
      setFilteredItems(highlighted);
    } catch (error) {
      console.error("Error filtering items:", error);
      setFilteredItems([]);
    }
  }, [debouncedQuery, allItems]);

  return (
    <>
      <div className="max-w-md mx-auto mb-12">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-muted-foreground" />
          <input
            type="text"
            name="q"
            placeholder={`Search ${contentType === "project" ? "projects" : "posts"}...`}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-border focus:border-primary/70 bg-card focus:ring-2 focus:ring-primary/30 placeholder-muted-foreground transition-all text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ fontFamily: "var(--font-sans)" }}
          />
        </div>
      </div>
      
      {filteredItems.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full">
          {filteredItems.map((item, index) => (
            <Card key={index} className="bg-card border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-2 text-left">
                {/* Show tags for projects */}
                {contentType === "project" && item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.tags.slice(0, 2).map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {item.tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{item.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
                
                <h3 className="text-xl font-semibold text-card-foreground hover:text-primary transition-colors text-left" style={{ fontFamily: "var(--font-serif)" }}>
                  <Link href={`${baseRoute}/${item.slug || ""}`} 
                        dangerouslySetInnerHTML={{ __html: item.title || "" }} />
                </h3>
                <p className="text-sm text-muted-foreground italic text-left" style={{ fontFamily: "var(--font-serif)" }}>
                  {formatDate(item.date)}
                </p>
              </CardHeader>
              <CardContent className="text-left">
                <p className="text-card-foreground text-left" style={{ fontFamily: "var(--font-sans)" }}
                   dangerouslySetInnerHTML={{ __html: item.description || "" }} />
              </CardContent>
              <CardFooter className="text-left">
                <Link
                  href={`${baseRoute}/${item.slug || ""}`}
                  className="flex items-center text-primary hover:text-primary/70 transition-colors group"
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
          <div className="text-muted-foreground/70 mb-4 text-4xl">⨯</div>
          <p className="text-xl text-muted-foreground mb-2" style={{ fontFamily: "var(--font-serif)" }}>
            No matching {contentType === "project" ? "projects" : "posts"} found
          </p>
          <p className="text-muted-foreground/80" style={{ fontFamily: "var(--font-sans)" }}>Try different search terms</p>
        </div>
      )}
    </>
  );
} 