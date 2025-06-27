import { error as logError } from "@/lib/logger";
import { NextResponse } from "next/server";
import { auth } from "@/app/auth";

export async function GET(request) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		});

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		return NextResponse.json({
			user: {
				id: session.user.id,
				name: session.user.name,
				email: session.user.email,
				emailVerified: session.user.emailVerified,
				image: session.user.image,
			},
		});
	} catch (error) {
		logError("Session check error:", error);
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
}
