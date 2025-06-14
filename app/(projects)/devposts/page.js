import ContentListPage from "../../components/ContentListPage";
import { generateMetadata } from "../../../lib/metadata";
import { getDevposts } from "../../utils/getdevposts";

export const metadata = generateMetadata({
	title: "Projects",
	description: "Browse my portfolio of development projects and technical explorations",
});

export default async function Page({ searchParams }) {
	try {
		const { q: searchQuery = "" } = (await searchParams) || {};
		let allProjects = [];

		try {
			allProjects = getDevposts("") || []; // Get all projects

			// Ensure all project entries have the necessary properties
			allProjects = allProjects.map(project => ({
				...project,
				rawTitle: project.rawTitle || project.title || "",
				rawDescription: project.rawDescription || project.description || "",
				slug: project.slug || "",
				date: project.date || null,
				tags: project.tags || [],
			}));
		} catch (error) {
			console.error("Error fetching projects:", error);
			allProjects = [];
		}

		return (
			<ContentListPage
				title="My Projects"
				subtitle="A collection of development projects, experiments, and technical explorations"
				badgeText="Portfolio"
				backLink="/"
				backText="Back Home"
				searchQuery={searchQuery}
				contentItems={allProjects}
				contentType="project"
			/>
		);
	} catch (error) {
		console.error("Error rendering projects page:", error);
		return (
			<div className="bg-background min-h-screen pt-8 pb-16">
				<div className="container mx-auto flex max-w-5xl flex-col items-center gap-8">
					<div className="text-center">
						<h1 className="text-foreground mb-3 text-4xl font-bold">Error Loading Projects</h1>
						<p className="text-muted-foreground mx-auto mb-8 max-w-2xl md:text-lg">
							There was a problem loading the projects content. Please try again later.
						</p>
					</div>
				</div>
			</div>
		);
	}
}
