// app/components/ProjectCard.jsx
import { format } from 'date-fns';
import Link from 'next/link';

export default function ProjectCard({ title, description, date, slug }) {
  const formattedDate = date ? format(new Date(date), 'MMMM d, yyyy') : null;

  return (
    <Link href={`/devposts/${slug || "#"}`} aria-label={`View details of devpost: ${title || "Untitled devpost"}`}>
      <div className="w-full p-4 mb-4 border rounded-2xl hover:border-gray-500 hover:shadow-lg bg-white transition-all cursor-pointer">
        <div className="space-y-3">
          {}
          <h3
            className="text-2xl font-semibold text-gray-800 truncate"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          {/* Corrected date display */}
          {formattedDate && (
            <time className="block text-sm text-gray-500" dateTime={date}>
              {formattedDate}
            </time>
          )}
          {}
          <p
            className="text-base text-gray-700 line-clamp-2"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      </div>
    </Link>
  );
}