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
				<div className="flex items-center justify-between">
					<p className="text-muted-foreground text-left text-sm italic" style={{ fontFamily: "var(--font-serif)" }}>
						{formatDate(postData.createdAt)}
					</p>
					{postData.views !== undefined && (
						<div className="flex items-center gap-1 text-xs text-muted-foreground">
							<svg 
								className="h-3 w-3" 
								fill="none" 
								stroke="currentColor" 
								viewBox="0 0 24 24"
							>
								<path 
									strokeLinecap="round" 
									strokeLinejoin="round" 
									strokeWidth={2} 
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
								/>
								<path 
									strokeLinecap="round" 
									strokeLinejoin="round" 
									strokeWidth={2} 
									d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
								/>
							</svg>
							<span>{postData.views.toLocaleString()}</span>
						</div>
					)}
				</div>
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
