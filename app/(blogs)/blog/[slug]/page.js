import { generateMetadata as baseGenerateMetadata } from "@/lib/metadata";
import ArticleLayout from "@/components/ArticleLayout";
import ErrorPage from "@/components/ErrorPage";
import { format } from "date-fns";
import prisma from "@/prisma/db";

export async function generateMetadata({ params }) {
	const { slug } = params;
	const post = await prisma.post.findUnique({ where: { slug } });

	if (!post) {
		return baseGenerateMetadata({ title: "Post Not Found" });
	}
	return baseGenerateMetadata({ title: post.title, description: post.description });
}

export default async function BlogPost({ params }) {
	const { slug } = params;
	const post = await prisma.post.findUnique({ where: { slug } });

	if (!post) {
		return <ErrorPage title="Post Not Found" message="The requested article doesn't exist" backLink="/blog" />;
	}

	if ("published" !== post.status) {
		return <ErrorPage title="Post Not Available" message="This post is not currently available" backLink="/blog" />;
	}

	const formattedDate = post.date ? format(new Date(post.date), "MMMM d, yyyy") : "No publication date";

	return (
		<ArticleLayout
			title={post.title}
			description={post.description}
			date={formattedDate}
			author={post.author}
			authorImage={post.authorImage}
			content={post.content}
			backLink="/blog"
			backText="Return to blog"
			tags={post.tags ? post.tags.split(",").map(tag => tag.trim()) : []}
			website={post.website}
		/>
	);
}
