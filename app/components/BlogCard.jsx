import { format } from 'date-fns';

export default function BlogCard({ title, date, description }) {
  const formattedDate = date instanceof Date ? format(date, 'MMMM d, yyyy') : date;
    return (
      <div className="w-full p-4 mb-4 border rounded-lg hover:border-gray-400 transition-colors">
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-2">{formattedDate}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    );
  }