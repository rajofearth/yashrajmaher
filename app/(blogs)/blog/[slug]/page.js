import { generateMetadata as baseGenerateMetadata } from "@/lib/metadata";
import ArticleLayout from "@/components/ArticleLayout";
import ErrorPage from "@/components/ErrorPage";
import { format } from "date-fns";
import prisma from "@/prisma/db";
import { PostSchema } from "@/lib/types";

export async function generateMetadata({ params }) {
	const { slug } = await params;
	const post = await prisma.post.findUnique({ where: { slug } });

	if (!post) {
		return baseGenerateMetadata({ title: "Post Not Found" });
	}
	const validatedMeta = PostSchema.pick({ title: true, description: true }).parse(post);
	return baseGenerateMetadata({ title: validatedMeta.title, description: validatedMeta.description });
}

export default async function BlogPost({ params }) {
	const { slug } = await params;
	const post = await prisma.post.findUnique({ where: { slug } });

	if (!post) {
		return <ErrorPage title="Post Not Found" message="The requested article doesn't exist" backLink="/blog" />;
	}

	const validatedPost = PostSchema.parse(post);

	if ("published" !== validatedPost.status) {
		return <ErrorPage title="Post Not Available" message="This post is not currently available" backLink="/blog" />;
	}

	const formattedDate = validatedPost.createdAt ? format(validatedPost.createdAt, "MMMM d, yyyy") : "No publication date";

	return (
		<ArticleLayout
			title={validatedPost.title}
			description={validatedPost.description}
			createdAt={formattedDate}
			author={validatedPost.author}
			authorImage={validatedPost.authorImage}
			featuredImage={validatedPost.featuredImage}
			content={validatedPost.content}
			backLink="/blog"
			backText="Return to blog"
			tags={validatedPost.tags ? validatedPost.tags.split(",").map(tag => tag.trim()) : []}
			website={validatedPost.website}
		/>
	);
}
