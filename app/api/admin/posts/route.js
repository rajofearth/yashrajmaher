import { NextResponse } from "next/server";
import prisma from "@/prisma/db";
import { auth } from "@/app/auth";

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