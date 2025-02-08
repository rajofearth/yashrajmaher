import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ErrorPage({ title, message, slug, backLink }) {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href={backLink} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-4xl font-bold">{title}</h1>
      </div>
      <p className="text-red-600">{message}</p>
      {slug && <p className="text-sm text-gray-600 mt-2">Slug: {slug}</p>}
    </div>
  );
}