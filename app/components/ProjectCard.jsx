import { format } from 'date-fns';
import Link from 'next/link';

export default function ProjectCard({ title, description, date, slug }) {
  // Format the date only if it exists
  const formattedDate = date ? (
    typeof date === 'string' ? 
      format(new Date(date), 'MMMM d, yyyy') :
      format(date, 'MMMM d, yyyy')
  ) : null;

  return (
    <Link href={`/projects/${slug}`}>
      <div className="w-full p-4 mb-4 border rounded-lg hover:border-gray-400 transition-colors">
        <h3 
          className="text-xl font-medium mb-2"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        {formattedDate && (
          <p className="text-sm text-gray-600 mb-2">{formattedDate}</p>
        )}
        <p 
          className="text-sm text-gray-600"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
    </Link>      
  );
}