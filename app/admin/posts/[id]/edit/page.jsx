import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/app/auth";
import prisma from "@/prisma/db";
import EditPostForm from "./edit-post-form";

export default async function EditPostPage({ params }) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) {
    redirect("/login");
  }

  const { id } = params;
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    redirect("/dashboard");
  }

  // Serialize dates for client component
  const serialized = {
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="border-b">
        <div className="flex h-16 items-center px-6">
          <div className="flex flex-1 items-center space-x-4">
            <h1 className="text-xl font-semibold">Edit Post</h1>
          </div>
        </div>
      </div>
      <div className="flex-1 p-6">
        <EditPostForm initialData={serialized} />
      </div>
    </div>
  );
}