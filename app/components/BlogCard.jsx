import { format } from 'date-fns';
import Link from 'next/link';

export default function BlogCard({ title, date, description, slug }) {
  const formattedDate = date ? format(new Date(date), 'MMMM d, yyyy') : null;

  return (
    <Link href={`/blog/${slug || "#"}`} aria-label={`Read blog post: ${title || "Untitled Blog"}`}>
      <div className="w-full p-5 mb-6 border rounded-2xl hover:shadow-md hover:border-gray-500 bg-white transition-all cursor-pointer">
        <div className="space-y-3">
          {/* Title with proper dangerouslySetInnerHTML usage */}
          <h3 
            className="text-xl font-semibold text-gray-800 truncate"
            dangerouslySetInnerHTML={{ __html: title }}
          />

          {/* Date */}
          {formattedDate && (
            <time className="block text-sm text-gray-500" dateTime={date}>
              {formattedDate}
            </time>
          )}

          {/* Description with proper dangerouslySetInnerHTML usage */}
          <p 
            className="text-base text-gray-700 line-clamp-3"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      </div>
    </Link>
  );
}