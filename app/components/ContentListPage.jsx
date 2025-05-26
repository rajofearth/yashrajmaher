"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import LiveSearch from "./LiveSearch";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function ContentListPage({
  title,
  subtitle,
  badgeText,
  backLink = "/",
  backText = "Back Home",
  searchQuery = "",
  contentItems = [],
  contentType = "blog", // "blog" or "project"
}) {
  return (
    <section className="min-h-screen pt-8 pb-16 bg-background">
      <div className="container mx-auto flex flex-col items-center gap-8 max-w-5xl">
        {/* Back Button and Theme Toggle */}
        <div className="w-full flex justify-between items-center mb-2">
          <Link
            href={backLink}
            className="flex items-center gap-1 text-primary hover:text-primary/70 transition-colors mb-2"
          >
            <ChevronLeft className="h-full w-4" />
            {backText}
          </Link>
          
          <ThemeToggle />
        </div>
        
        {/* Page Header */}
        <div className="text-center">
          {badgeText && (
            <Badge variant="secondary" className="mb-2">
              {badgeText}
            </Badge>
          )}
          
          <h1 className="mb-3 text-4xl md:text-5xl lg:text-6xl font-bold text-foreground" 
               style={{ fontFamily: "var(--font-serif)" }}>
            {title}
          </h1>
          
          {subtitle && (
            <p className="mb-8 text-muted-foreground md:text-lg max-w-2xl mx-auto" 
               style={{ fontFamily: "var(--font-serif)" }}>
              {subtitle}
            </p>
          )}
          
          {/* Live Search Component */}
          <LiveSearch 
            initialQuery={searchQuery} 
            allItems={contentItems} 
            contentType={contentType}
          />
        </div>
      </div>
    </section>
  );
} 