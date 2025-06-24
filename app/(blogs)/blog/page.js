import ContentListPage from "@/components/ContentListPage";
import { generateMetadata } from "@/lib/metadata";
import prisma from "@/prisma/db";
import { PostSchema } from "@/lib/types";

export const metadata = generateMetadata({
	title: "Blog",
	description: "Explore my thoughts, stories and ideas through my blog posts",
});

export default async function Page({ searchParams }) {
	try {
		const { q: searchQuery = "" } = (await searchParams) || {};
		let allBlogs = [];

		try {
			allBlogs = await prisma.post.findMany({
				where: {
					status: "published",
				},
				orderBy: { createdAt: "desc" },
			});

			allBlogs = allBlogs.map(blog => ({
				...blog,
				createdAt: blog.createdAt ? new Date(blog.createdAt) : undefined,
			}));

			allBlogs = PostSchema.array().parse(allBlogs);
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
			/>
		);
	} catch (error) {
		console.error("Error rendering blog page:", error);
		return (
			<div className="bg-background min-h-screen pt-8 pb-16">
				<div className="container mx-auto flex max-w-5xl flex-col items-center gap-8">
					<div className="text-center">
						<h1 className="text-foreground mb-3 text-4xl font-bold">Error Loading Blog</h1>
						<p className="text-muted-foreground mx-auto mb-8 max-w-2xl md:text-lg">
							There was a problem loading the blog content. Please try again later.
						</p>
					</div>
				</div>
			</div>
		);
	}
}
