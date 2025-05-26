import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { design } from '@/lib/design-system';
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function ErrorPage({ title, message, slug, backLink = "/blog", backText = "Back" }) {
  // Determine appropriate back text based on backLink if not explicitly provided
  const getBackText = () => {
    if (backText !== "Back") return backText;
    if (backLink === "/blog") return "Back to blog";
    if (backLink === "/devposts") return "Back to projects";
    return "Back";
  };

  return (
    <div className="min-h-screen pt-8 pb-16 bg-background">
      <div className="container mx-auto px-6 flex flex-col items-center justify-center h-full max-w-3xl">
        <div className="bg-card p-8 rounded-xl border border-border">
          <div className="flex items-center justify-between mb-8">
            <Link 
              href={backLink} 
              className="flex items-center gap-1 text-primary hover:text-primary/70 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              {getBackText()}
            </Link>
            <ThemeToggle />
          </div>
          
          <h1 className="text-3xl font-bold mb-4 text-foreground" style={{ fontFamily: "var(--font-serif)" }}>
            {title}
          </h1>
          <p className="text-destructive mb-4">{message}</p>
          {slug && <p className="text-sm text-muted-foreground mt-2" style={{ fontFamily: "var(--font-sans)" }}>Slug: {slug}</p>}
        </div>
      </div>
    </div>
  );
}