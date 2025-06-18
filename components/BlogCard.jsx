import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatDate } from "@/utils/formatDate";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function BlogCard({ title, date, description, slug, className }) {
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
					<Link href={`/blog/${slug || "#"}`} dangerouslySetInnerHTML={{ __html: title }} />
				</h3>
				<p className="text-muted-foreground text-left text-sm italic" style={{ fontFamily: "var(--font-serif)" }}>
					{formatDate(date)}
				</p>
			</CardHeader>

			<CardContent className="text-left">
				<p
					className="text-card-foreground text-left"
					style={{ fontFamily: "var(--font-sans)" }}
					dangerouslySetInnerHTML={{ __html: description }}
				/>
			</CardContent>

			<CardFooter className="text-left">
				<Link
					href={`/blog/${slug || "#"}`}
					className="text-primary hover:text-primary/70 group flex items-center transition-colors"
					style={{ fontFamily: "var(--font-serif)" }}
				>
					Read more
					<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
				</Link>
			</CardFooter>
		</Card>
	);
}
