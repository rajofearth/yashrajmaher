// app/components/ProjectCard.jsx
import { formatDate } from "../utils/formatDate";
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function ProjectCard({ title, date, description, slug, tags = [], className }) {
  return (
    <Card className={cn("bg-card border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300", className)}>
      <CardHeader className="pb-2 text-left">
        <h3 className="text-xl font-semibold text-card-foreground hover:text-primary transition-colors text-left" 
            style={{ fontFamily: "var(--font-serif)" }}>
          <Link href={`/devposts/${slug || "#"}`}
                dangerouslySetInnerHTML={{ __html: title }} />
        </h3>
        <p className="text-sm text-muted-foreground italic text-left" style={{ fontFamily: "var(--font-serif)" }}>
          {formatDate(date)}
        </p>
      </CardHeader>
      
      <CardContent className="text-left">
        <p className="text-card-foreground mb-3 text-left" 
           style={{ fontFamily: "var(--font-sans)" }}
           dangerouslySetInnerHTML={{ __html: description }} />
        
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, i) => (
              <Badge key={i} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="text-left">
        <Link
          href={`/devposts/${slug || "#"}`}
          className="flex items-center text-primary hover:text-primary/70 transition-colors group"
          style={{ fontFamily: "var(--font-serif)" }}>
          See project
          <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </CardFooter>
    </Card>
  );
}