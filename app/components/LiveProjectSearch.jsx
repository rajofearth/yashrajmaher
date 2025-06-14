"use client";

import ProjectCard from "../components/ProjectCard";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";

export default function LiveProjectSearch({ initialQuery = "", allDevposts = [] }) {
	const searchParams = useSearchParams();
	const [searchQuery, setSearchQuery] = useState(initialQuery);
	const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
	const [filteredDevposts, setFilteredDevposts] = useState([]);

	// Update URL when search changes
	useEffect(() => {
		const params = new URLSearchParams(searchParams.toString());

		if (debouncedQuery) {
			params.set("q", debouncedQuery);
		} else {
			params.delete("q");
		}

		// Update URL without reloading the page
		const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
		window.history.replaceState({ path: newUrl }, "", newUrl);
	}, [debouncedQuery, searchParams]);

	// Debounce search input
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedQuery(searchQuery);
		}, 300); // 300ms debounce delay

		return () => clearTimeout(timer);
	}, [searchQuery]);

	// Filter projects based on debounced query
	useEffect(() => {
		if (!debouncedQuery.trim()) {
			setFilteredDevposts(allDevposts);
			return;
		}

		const queryLower = debouncedQuery.toLowerCase();
		const filtered = allDevposts.filter(
			devpost =>
				devpost.rawTitle?.toLowerCase().includes(queryLower) ||
				devpost.rawDescription?.toLowerCase().includes(queryLower)
		);

		// Highlight matches in title and description
		const highlighted = filtered.map(devpost => {
			const escapedQuery = debouncedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
			const regex = new RegExp(`(${escapedQuery})`, "gi");

			let title = devpost.rawTitle || "";
			let description = devpost.rawDescription || "";

			title = title.replace(regex, '<span class="bg-yellow-100 text-[#493e35] rounded px-0.5">$1</span>');
			description = description.replace(regex, '<span class="bg-yellow-100 text-[#493e35] rounded px-0.5">$1</span>');

			return {
				...devpost,
				title,
				description,
			};
		});

		setFilteredDevposts(highlighted);
	}, [debouncedQuery, allDevposts]);

	return (
		<>
			<div className="mx-auto mb-12 max-w-md">
				<div className="relative">
					<Search className="absolute top-3.5 left-4 h-5 w-5 text-gray-500" />
					<input
						type="text"
						name="q"
						placeholder="Filter projects..."
						className="w-full rounded-xl border border-[#dbd0b8] bg-[#faf6ec] py-3 pr-4 pl-12 text-lg placeholder-gray-500 transition-all focus:border-[#c0b49b] focus:ring-2 focus:ring-[#c0b49b]"
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
						style={{ fontFamily: "var(--font-sans)" }}
					/>
				</div>
			</div>

			{filteredDevposts.length > 0 ? (
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{filteredDevposts.map((devpost, index) => (
						<ProjectCard
							key={index}
							title={devpost.title}
							description={devpost.description}
							date={devpost.date}
							slug={devpost.slug}
							tags={devpost.tags || []}
							className="text-left"
						/>
					))}
				</div>
			) : (
				<div className="w-full py-12 text-center">
					<div className="mb-4 text-4xl text-[#b5a89a]">⨯</div>
					<p className="mb-2 text-xl text-[#73695d]" style={{ fontFamily: "var(--font-serif)" }}>
						No projects found
					</p>
					<p className="text-[#84776a]" style={{ fontFamily: "var(--font-sans)" }}>
						Try different search terms
					</p>
				</div>
			)}
		</>
	);
}
