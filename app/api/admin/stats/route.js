import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { getDashboardMetrics } from "@/lib/metrics";

export const dynamic = "force-dynamic"; // always compute fresh data

export async function GET(request) {
	try {
		// Validate session (basic check − could be extended to verify admin role)
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const metrics = await getDashboardMetrics();

		return NextResponse.json(metrics);
	} catch {
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
} 