import { getBlogs } from "../../utils/getBlogs";
import { generateMetadata } from "../../../lib/metadata";
import ContentListPage from "../../components/ContentListPage";

export const metadata = generateMetadata({
  title: "Blog",
  description: "Explore my thoughts, stories and ideas through my blog posts"
});

export default async function Page({ searchParams }) {
  try {
    const { q: searchQuery = "" } = await searchParams || {};
    let allBlogs = [];
    
    try {
      allBlogs = getBlogs('') || []; // Get all blogs
      
      // Ensure all blog entries have the necessary properties
      allBlogs = allBlogs.map(blog => ({
        ...blog,
        rawTitle: blog.rawTitle || blog.title || "",
        rawDescription: blog.rawDescription || blog.description || "",
        slug: blog.slug || "",
        date: blog.date || null
      }));
    } catch (error) {
      console.error("Error fetching blogs:", error);
      allBlogs = [];
    }

    return (
      <ContentListPage
        title="Collected Thoughts"
        subtitle="Exploring the intersection of technology, creativity, and human experience. Dive into essays, tutorials, and personal reflections on modern development."
        badgeText="Personal Blog"
        backLink="/"
        backText="Back Home"
        searchQuery={searchQuery}
        contentItems={allBlogs}
        contentType="blog"
      />
    );
  } catch (error) {
    console.error("Error rendering blog page:", error);
    return (
      <div className="min-h-screen pt-8 pb-16 bg-background">
        <div className="container mx-auto flex flex-col items-center gap-8 max-w-5xl">
          <div className="text-center">
            <h1 className="mb-3 text-4xl font-bold text-foreground">
              Error Loading Blog
            </h1>
            <p className="mb-8 text-muted-foreground md:text-lg max-w-2xl mx-auto">
              There was a problem loading the blog content. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
