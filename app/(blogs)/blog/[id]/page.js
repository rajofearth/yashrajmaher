import { generateMetadata as baseGenerateMetadata } from "@/lib/metadata";
import { getFileFromSlug } from "@/utils/getFileFromSlug";
import ArticleLayout from "@/components/ArticleLayout";
import ErrorPage from "@/components/ErrorPage";
import { format } from "date-fns";
import matter from "gray-matter";
import path from "path";
import fs from "fs";

// Define BLOG_POSTS_DIR here
const BLOG_POSTS_DIR = path.join(process.cwd(), "public", "Bposts");

export async function generateMetadata({ params }) {
	try {
		const { id } = await params;
		if (!id) return baseGenerateMetadata({ title: "Post Not Found" });

		const filename = getFileFromSlug(id, BLOG_POSTS_DIR);
		if (!filename) return baseGenerateMetadata({ title: "Post Not Found" });

		const fileContent = fs.readFileSync(path.join(BLOG_POSTS_DIR, filename), "utf8");
		const { data: frontmatter } = matter(fileContent);
		return baseGenerateMetadata({
			title: frontmatter.title || "Untitled Post",
			description: frontmatter.description || "Explore this blog post",
		});
	} catch (error) {
		console.error("Error in generateMetadata:", error);
		return baseGenerateMetadata({ title: "Error", description: "Post loading failed" });
	}
}

export default async function BlogPost({ params }) {
	try {
		const { id } = await params;
		if (!id) {
			return <ErrorPage title="Invalid Request" message="Missing post identifier" backLink="/blog" />;
		}

		if (!fs.existsSync(BLOG_POSTS_DIR)) {
			return <ErrorPage title="Configuration Error" message="Blog directory not found" backLink="/blog" />;
		}

		const filename = getFileFromSlug(id, BLOG_POSTS_DIR);
		if (!filename) {
			return (
				<ErrorPage title="Post Not Found" message="The requested article doesn't exist" slug={id} backLink="/blog" />
			);
		}

		const fileContent = fs.readFileSync(path.join(BLOG_POSTS_DIR, filename), "utf8");
		const { data: frontmatter, content } = matter(fileContent);

		if (!frontmatter.title) {
			return <ErrorPage title="Invalid Format" message="Post frontmatter is incomplete" slug={id} backLink="/blog" />;
		}

		// Check if post is published
		const status = frontmatter.status || "published"; // Default to published for backward compatibility
		if (status !== "published") {
			return <ErrorPage title="Post Not Available" message="This post is not currently available" backLink="/blog" />;
		}

		const formattedDate = frontmatter.date ? format(new Date(frontmatter.date), "MMMM d, yyyy") : "No publication date";

		return (
			<ArticleLayout
				title={frontmatter.title}
				description={frontmatter.description}
				date={formattedDate}
				author={frontmatter.author || "Anonymous"}
				authorImage={frontmatter.authorImage || "https://shadcnblocks.com/images/block/avatar-1.webp"}
				featuredImage={frontmatter.featuredImage}
				content={content}
				backLink="/blog"
				backText="Return to blog"
				isProject={false}
			/>
		);
	} catch (error) {
		console.error("Blog post rendering error:", error);
		return <ErrorPage title="Loading Error" message="Failed to load post content" backLink="/blog" />;
	}
}
