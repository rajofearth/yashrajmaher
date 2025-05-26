import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { design } from '@/lib/design-system';
import { Badge } from "@/components/ui/badge";

export default function PageLayout({ 
  children,
  pageTitle,
  pageDescription,
  backLink = "/",
  backText = "Back Home",
  badge = null,
}) {
  return (
    <section className="min-h-screen pt-8 pb-16" style={{ backgroundColor: "#f0e9d2" }}>
      <div className="container mx-auto flex flex-col items-center gap-8 max-w-5xl">
        {/* Back Button */}
        <div className="w-full flex justify-start mb-2">
          <Link
            href={backLink}
            className="flex items-center gap-1 text-[#7c6e58] hover:text-[#493e35] transition-colors mb-2"
          >
            <ChevronLeft className="h-full w-4" />
            {backText}
          </Link>
        </div>
        
        {/* Page Header */}
        <div className="text-center w-full">
          {badge && (
            <Badge variant="secondary" className="mb-2 bg-[#e6dcc1] text-[#5c5546]">
              {badge}
            </Badge>
          )}
          
          <h1 
            className="mb-3 text-4xl md:text-5xl lg:text-6xl font-bold text-[#5c5546]" 
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {pageTitle}
          </h1>
          
          {pageDescription && (
            <p 
              className="mb-8 text-[#73695d] md:text-lg max-w-2xl mx-auto" 
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {pageDescription}
            </p>
          )}
        </div>
        
        {/* Page Content */}
        <div className="w-full">
          {children}
        </div>
      </div>
    </section>
  );
} 