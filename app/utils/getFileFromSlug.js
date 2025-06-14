import path from "path";
import fs from "fs";

export function getFileFromSlug(slug, directory) {
	try {
		const files = fs.readdirSync(directory);
		const cleanSlug = slug.toLowerCase().replace(/[^\w-]/g, "");
		return (
			files.find(file => {
				const base = path.basename(file, ".md");
				return base.toLowerCase().replace(/[^\w-]/g, "") === cleanSlug;
			}) || null
		);
	} catch (error) {
		console.error("Error reading directory:", error);
		return null;
	}
}
