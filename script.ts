import { PrismaClient } from "./generated/prisma";
import matter from "gray-matter";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

async function main() {
	const BPOSTS_DIR = path.join(process.cwd(), "public", "Bposts");
	const DEVPOSTS_DIR = path.join(process.cwd(), "public", "devposts");

	const files = [
		...fs
			.readdirSync(BPOSTS_DIR)
			.filter(file => file.endsWith(".md"))
			.map(file => ({ dir: BPOSTS_DIR, file })),
		...fs
			.readdirSync(DEVPOSTS_DIR)
			.filter(file => file.endsWith(".md"))
			.map(file => ({ dir: DEVPOSTS_DIR, file })),
	];

	for (const { dir, file } of files) {
		const slug = file.replace(/\.md$/, "");
		const fullPath = path.join(dir, file);
		const fileContents = fs.readFileSync(fullPath, "utf8");
		const { data: frontmatter, content } = matter(fileContents);

		const title = String(frontmatter.title || slug);
		const description = String(frontmatter.description || "");
		const featuredImage = frontmatter.featuredImage ? String(frontmatter.featuredImage) : undefined;
		const author = String(frontmatter.author || "Yashraj Maher");
		const authorImage = frontmatter.authorImage ? String(frontmatter.authorImage) : undefined;
		const status = String(frontmatter.status || "published");
		const website = frontmatter.website ? String(frontmatter.website) : undefined;
		const tagsField = frontmatter.tags;
		const tags = Array.isArray(tagsField)
			? tagsField.map(tag => String(tag)).join(",")
			: "string" === typeof tagsField
				? tagsField
				: undefined;
		const date = frontmatter.date ? new Date(String(frontmatter.date)) : new Date();
		await prisma.post.upsert({
			where: { slug },
			update: {
				title,
				description,
				featuredImage,
				content,
				author,
				authorImage,
				status,
				createdAt: date,
				updatedAt: date,
				website,
				tags,
			},
			create: {
				slug,
				title,
				description,
				featuredImage,
				content,
				author,
				authorImage,
				status,
				website,
				tags,
				createdAt: date,
				updatedAt: date,
			},
		});

		console.log(`Upserted post: ${slug}`);
	}
}

main()
	.then(async () => {
		await prisma.$disconnect();
		console.log("All posts upserted successfully.");
	})
	.catch(async error => {
		console.error(error);
		await prisma.$disconnect();
		process.exit(1);
	});
