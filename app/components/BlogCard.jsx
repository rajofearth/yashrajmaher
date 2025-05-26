import { formatDate } from "../utils/formatDate";
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function BlogCard({ title, date, description, slug, className }) {
  return (
    <Card className={cn("bg-[#faf6ec] border-[#dbd0b8] shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300", className)}>
      <CardHeader className="pb-2 text-left">
        <h3 className="text-xl font-semibold text-[#493e35] hover:text-[#7c6e58] transition-colors text-left" 
            style={{ fontFamily: "var(--font-serif)" }}>
          <Link href={`/blog/${slug || "#"}`}
                dangerouslySetInnerHTML={{ __html: title }} />
        </h3>
        <p className="text-sm text-[#84776a] italic text-left" style={{ fontFamily: "var(--font-serif)" }}>
          {formatDate(date)}
        </p>
      </CardHeader>
      
      <CardContent className="text-left">
        <p className="text-[#5c5546] text-left" 
           style={{ fontFamily: "var(--font-sans)" }}
           dangerouslySetInnerHTML={{ __html: description }} />
      </CardContent>
      
      <CardFooter className="text-left">
        <Link
          href={`/blog/${slug || "#"}`}
          className="flex items-center text-[#7c6e58] hover:text-[#493e35] transition-colors group"
          style={{ fontFamily: "var(--font-serif)" }}>
          Read more
          <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </CardFooter>
    </Card>
  );
}