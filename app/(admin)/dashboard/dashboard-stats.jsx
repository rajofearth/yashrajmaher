"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Eye, Edit, TrendingUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function StatsCard({ title, value, icon }) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				{icon}
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
			</CardContent>
		</Card>
	);
}

export default function DashboardStats({ initialStats = null, refreshInterval = 1000 }) {
	const [stats, setStats] = useState(initialStats);

	const fetchStats = useCallback(async () => {
		try {
			const res = await fetch("/api/admin/stats", { cache: "no-store" });
			if (res.ok) {
				const data = await res.json();
				setStats(data);
			}
		} catch {}
	}, []);

	useEffect(() => {
		fetchStats();
		const id = setInterval(fetchStats, refreshInterval);
		return () => clearInterval(id);
	}, [fetchStats, refreshInterval]);

	if (!stats) {
		return (
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<Skeleton key={i} className="h-24 w-full" />
				))}
			</div>
		);
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<StatsCard
				title="Total Posts"
				value={stats.totalPosts}
				icon={<FileText className="text-muted-foreground h-4 w-4" />}
			/>
			<StatsCard
				title="Published"
				value={stats.publishedPosts}
				icon={<Eye className="text-muted-foreground h-4 w-4" />}
			/>
			<StatsCard title="Drafts" value={stats.draftPosts} icon={<Edit className="text-muted-foreground h-4 w-4" />} />
			<StatsCard
				title="Total Views"
				value={stats.totalViews.toLocaleString()}
				icon={<TrendingUp className="text-muted-foreground h-4 w-4" />}
			/>
		</div>
	);
}
