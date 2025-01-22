import { format } from 'date-fns';
import Link from 'next/link';

export default function BlogCard({ title, date, description, slug }) {
  const formattedDate = date instanceof Date ? format(date, 'MMMM d, yyyy') : date;

  return (
    <Link href={`/blog/${slug}`}>
    <div className="w-full p-4 mb-4 border rounded-lg hover:border-gray-400 transition-colors">
      <h3 
        className="text-xl font-medium mb-2"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <p className="text-sm text-gray-600 mb-2">{formattedDate}</p>
      <p 
        className="text-sm text-gray-600"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
    </Link>
  );
}