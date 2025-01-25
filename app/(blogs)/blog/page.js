import BlogCard from '../../components/BlogCard';
import { getBlogs } from '../../utils/getBlogs';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { generateMetadata } from '../../../lib/metadata';

export const metadata = generateMetadata({
  title: "Blog",
  description: "Explore my thoughts, stories and ideas through my blog posts"
});

export default function Blog({ searchParams }) {
  const searchQuery = searchParams?.q?.trim() || '';
  const blogs = getBlogs(searchQuery);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-4xl font-bold">Blog</h1>
      </div>
      
      <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mb-4">
        Welcome to my little corner of thoughts and stories! <br/>
        Here, I share ideas, experiences, and everything that sparks curiosity. 
        Dive into the posts below and let's explore together!
      </p>

      <form className="mb-4" action="/blog" method="GET">
        <input
          type="text"
          name="q"
          placeholder="Search blog posts..."
          className="w-full p-2 border-2 rounded-md focus:ring-1 focus:ring-foreground/80 focus:border-foreground/50 placeholder:text-foreground/50"
          defaultValue={searchQuery}
        />
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-4">
        {blogs.length > 0 ? (
          blogs.map((blog, index) => (
            <BlogCard 
              key={index}
              title={blog.title}
              date={blog.date}
              description={blog.description}
	           rawTitle = {blog.rawTitle}
	           slug={blog.slug}
            /> 
        ))
      ) : (
       <p className="text-gray-500 text-center col-span-full">No posts found matching your search.</p>
        )}
      </div>
    </div>
  );
}