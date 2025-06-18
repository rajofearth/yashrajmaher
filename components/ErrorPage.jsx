import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function ErrorPage({ title, message, slug, backLink = "/blog", backText = "Back" }) {
	// Determine appropriate back text based on backLink if not explicitly provided
	const getBackText = () => {
		if ("Back" !== backText) {
			return backText;
		}
		if ("/blog" === backLink) {
			return "Back to blog";
		}
		if ("/devposts" === backLink) {
			return "Back to projects";
		}
		return "Back";
	};

	return (
		<div className="bg-background min-h-screen pt-8 pb-16">
			<div className="container mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-6">
				<div className="bg-card border-border rounded-xl border p-8">
					<div className="mb-8 flex items-center justify-between">
						<Link
							href={backLink}
							className="text-primary hover:text-primary/70 flex items-center gap-1 transition-colors"
						>
							<ChevronLeft className="h-4 w-4" />
							{getBackText()}
						</Link>
						<ThemeToggle />
					</div>

					<h1 className="text-foreground mb-4 text-3xl font-bold" style={{ fontFamily: "var(--font-serif)" }}>
						{title}
					</h1>
					<p className="text-destructive mb-4">{message}</p>
					{slug && (
						<p className="text-muted-foreground mt-2 text-sm" style={{ fontFamily: "var(--font-sans)" }}>
							Slug: {slug}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
