import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import truncateText from "@/app/utils/truncateText";
import { formatDate } from "@/app/utils/formatDate";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function PostCard({ post, title, createdAt, description, slug, tags = [], className }) {
	// Use post object if provided, otherwise use individual props for backward compatibility
	const postData = post || {
		title,
		createdAt,
		description,
		id: slug,
		tags: "string" === typeof tags ? tags.split(",").map(tag => tag.trim()) : tags,
	};

	// Parse tags if they're stored as a string in the database
	const parsedTags =
		"string" === typeof postData.tags
			? postData.tags
					.split(",")
					.map(tag => tag.trim())
					.filter(tag => tag)
			: postData.tags || [];

	return (
		<Card
			className={cn(
				"bg-card border-border overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow-md",
				className
			)}
		>
			<CardHeader className="pb-2 text-left">
				<h3
					className="text-card-foreground hover:text-primary text-left text-xl font-semibold transition-colors"
					style={{ fontFamily: "var(--font-serif)" }}
				>
					<Link href={`/blog/${postData.slug}`} dangerouslySetInnerHTML={{ __html: postData.title }} />
				</h3>
				<p className="text-muted-foreground text-left text-sm italic" style={{ fontFamily: "var(--font-serif)" }}>
					{formatDate(postData.createdAt)}
				</p>
			</CardHeader>

			<CardContent className="text-left">
				<p className="text-card-foreground mb-3 text-left" style={{ fontFamily: "var(--font-sans)" }}>
					{truncateText(postData.description, 150)}
				</p>

				{parsedTags && 0 < parsedTags.length && (
					<div className="mt-2 flex flex-wrap gap-2">
						{parsedTags.map((tag, i) => (
							<Badge key={i} variant="secondary">
								{tag}
							</Badge>
						))}
					</div>
				)}
			</CardContent>

			<CardFooter className="text-left">
				<Link
					href={`/blog/${postData.slug}`}
					className="text-primary hover:text-primary/70 group flex items-center transition-colors"
					style={{ fontFamily: "var(--font-serif)" }}
				>
					Read article
					<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
				</Link>
			</CardFooter>
		</Card>
	);
}
