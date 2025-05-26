import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { design } from '@/lib/design-system';

export default function ErrorPage({ title, message, slug, backLink = "/blog", backText = "Back" }) {
  // Determine appropriate back text based on backLink if not explicitly provided
  const getBackText = () => {
    if (backText !== "Back") return backText;
    if (backLink === "/blog") return "Back to blog";
    if (backLink === "/devposts") return "Back to projects";
    return "Back";
  };

  return (
    <div className="min-h-screen pt-8 pb-16" style={{ backgroundColor: "#f0e9d2" }}>
      <div className="container mx-auto px-6 flex flex-col items-center justify-center h-full max-w-3xl">
        <div className="bg-[#faf6ec] p-8 rounded-xl border border-[#dbd0b8]">
          <div className="flex items-center gap-2 mb-8">
            <Link 
              href={backLink} 
              className="flex items-center gap-1 text-[#7c6e58] hover:text-[#493e35] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              {getBackText()}
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold mb-4 text-[#5c5546]" style={{ fontFamily: "var(--font-serif)" }}>
            {title}
          </h1>
          <p className="text-[#b56565] mb-4">{message}</p>
          {slug && <p className="text-sm text-[#84776a] mt-2" style={{ fontFamily: "var(--font-sans)" }}>Slug: {slug}</p>}
        </div>
      </div>
    </div>
  );
}