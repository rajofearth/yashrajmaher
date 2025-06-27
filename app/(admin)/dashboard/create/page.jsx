import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/app/auth";
import CreatePostForm from "./create-post-form";

export default async function CreatePostPage() {
	// Get session from better-auth
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	// Redirect to login if not authenticated
	if (!session) {
		redirect("/login");
	}

	return (
		<div className="bg-background min-h-screen">
			<div className="border-b">
				<div className="flex h-16 items-center px-6">
					<div className="flex flex-1 items-center space-x-4">
						<h1 className="text-xl font-semibold">Create New Post</h1>
					</div>
				</div>
			</div>

			<div className="flex-1 p-6">
				<CreatePostForm />
			</div>
		</div>
	);
} 