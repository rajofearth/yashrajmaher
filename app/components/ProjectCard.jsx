// app/components/ProjectCard.jsx
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { formatDate } from "../utils/formatDate";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ProjectCard({ title, date, description, slug, tags = [], className }) {
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
					<Link href={`/devposts/${slug || "#"}`} dangerouslySetInnerHTML={{ __html: title }} />
				</h3>
				<p className="text-muted-foreground text-left text-sm italic" style={{ fontFamily: "var(--font-serif)" }}>
					{formatDate(date)}
				</p>
			</CardHeader>

			<CardContent className="text-left">
				<p
					className="text-card-foreground mb-3 text-left"
					style={{ fontFamily: "var(--font-sans)" }}
					dangerouslySetInnerHTML={{ __html: description }}
				/>

				{tags && tags.length > 0 && (
					<div className="mt-2 flex flex-wrap gap-2">
						{tags.map((tag, i) => (
							<Badge key={i} variant="secondary">
								{tag}
							</Badge>
						))}
					</div>
				)}
			</CardContent>

			<CardFooter className="text-left">
				<Link
					href={`/devposts/${slug || "#"}`}
					className="text-primary hover:text-primary/70 group flex items-center transition-colors"
					style={{ fontFamily: "var(--font-serif)" }}
				>
					See project
					<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
				</Link>
			</CardFooter>
		</Card>
	);
}
