import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function PageLayout({
	children,
	pageTitle,
	pageDescription,
	backLink = "/",
	backText = "Back Home",
	badge = null,
}) {
	return (
		<section className="bg-background min-h-screen pt-8 pb-16">
			<div className="container mx-auto flex max-w-5xl flex-col items-center gap-8">
				{/* Back Button and Theme Toggle */}
				<div className="mb-2 flex w-full items-center justify-between">
					<Link
						href={backLink}
						className="text-primary hover:text-primary/70 mb-2 flex items-center gap-1 transition-colors"
					>
						<ChevronLeft className="h-full w-4" />
						{backText}
					</Link>

					<ThemeToggle />
				</div>

				{/* Page Header */}
				<div className="w-full text-center">
					{badge && (
						<Badge variant="secondary" className="mb-2">
							{badge}
						</Badge>
					)}

					<h1
						className="text-foreground mb-3 text-4xl font-bold md:text-5xl lg:text-6xl"
						style={{ fontFamily: "var(--font-serif)" }}
					>
						{pageTitle}
					</h1>

					{pageDescription && (
						<p
							className="text-muted-foreground mx-auto mb-8 max-w-2xl md:text-lg"
							style={{ fontFamily: "var(--font-serif)" }}
						>
							{pageDescription}
						</p>
					)}
				</div>

				{/* Page Content */}
				<div className="w-full">{children}</div>
			</div>
		</section>
	);
}
