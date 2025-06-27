import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import prisma from "@/prisma/db";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Fetch post error", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    const {
      title,
      slug,
      description,
      content,
      featuredImage,
      status,
      tags,
      website,
      author,
      authorImage,
    } = body;

    // Validate required fields
    if (!title || !description || !content) {
      return NextResponse.json({ error: "Title, description, and content are required" }, { status: 400 });
    }

    // Check for slug conflict (excluding current post)
    if (slug) {
      const existing = await prisma.post.findFirst({ where: { slug, NOT: { id } } });
      if (existing) {
        return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
      }
    }

    const updated = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        content,
        featuredImage: featuredImage ?? null,
        status,
        tags: tags ?? null,
        website: website ?? null,
        author: author ?? session.user.name ?? "Anonymous",
        authorImage: authorImage ?? session.user.image ?? null,
      },
    });

    return NextResponse.json({
      message: "Post updated successfully",
      post: {
        ...updated,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Update post error", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    await prisma.post.delete({ where: { id } });

    return NextResponse.json({ message: "Post deleted" });
  } catch (error) {
    console.error("Delete post error", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 