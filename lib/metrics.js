import prisma from "@/prisma/db";

export async function getDashboardMetrics() {
	// Aggregate totals and views in one query
	const overall = await prisma.post.aggregate({
		_count: { _all: true },
		_sum: { views: true },
	});

	// Count per status (published, draft, etc.) in a second query
	const statusRows = await prisma.post.groupBy({
		by: ["status"],
		_count: { _all: true },
	});

	const statusCount = Object.fromEntries(statusRows.map(r => [r.status, r._count._all]));

	return {
		totalPosts: overall._count._all,
		totalViews: overall._sum.views || 0,
		publishedPosts: statusCount.published || 0,
		draftPosts: statusCount.draft || 0,
	};
}
