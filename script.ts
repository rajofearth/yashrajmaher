import { PrismaClient } from "./generated/prisma";

const prisma = new PrismaClient();

async function main() {
	const post = await prisma.post.create({
		data: {
			title: "Hello World",
			content: "This is my first post",
			description: "A brief introduction to my first post",
			status: "published",
			author: "John Doe",
		},
	});
	console.log("Created post:", post);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async error => {
		console.error(error);
		await prisma.$disconnect();
		process.exit(1);
	});
