import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import prisma from "@/prisma/db";

export const dynamic = "force-dynamic";

export async function GET(request) {
	try {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const posts = await prisma.post.findMany({
			orderBy: { updatedAt: "desc" },
			select: {
				id: true,
				title: true,
				slug: true,
				description: true,
				status: true,
				views: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		const serialized = posts.map(p => ({
			...p,
			createdAt: p.createdAt.toISOString(),
			updatedAt: p.updatedAt.toISOString(),
		}));

		return NextResponse.json(serialized);
	} catch {
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}

export async function POST(request) {
	try {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const {
			title,
			slug,
			description,
			content,
			featuredImage,
			status = "draft",
			tags,
			website,
			author,
			authorImage
		} = body;

		// Validate required fields
		if (!title || !description || !content) {
			return NextResponse.json(
				{ error: "Title, description, and content are required" },
				{ status: 400 }
			);
		}

		// Check if slug already exists
		const existingPost = await prisma.post.findUnique({
			where: { slug }
		});

		if (existingPost) {
			return NextResponse.json(
				{ error: "A post with this slug already exists" },
				{ status: 409 }
			);
		}

		// Create the post
		const post = await prisma.post.create({
			data: {
				title,
				slug,
				description,
				content,
				featuredImage: featuredImage || null,
				status,
				tags: tags || null,
				website: website || null,
				author: author || session.user.name || "Anonymous",
				authorImage: authorImage || session.user.image || null,
			},
		});

		return NextResponse.json(
			{
				message: "Post created successfully",
				post: {
					...post,
					createdAt: post.createdAt.toISOString(),
					updatedAt: post.updatedAt.toISOString(),
				}
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating post:", error);
		return NextResponse.json(
			{ error: "Failed to create post" },
			{ status: 500 }
		);
	}
}
