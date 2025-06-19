"use client";

import { useRouter, useSearchParams } from "next/navigation";
import PostCard from "@/components/PostCard";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

export default function LiveSearch({ initialQuery = "", allItems = [] }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [searchQuery, setSearchQuery] = useState(initialQuery);
	const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
	const [filteredItems, setFilteredItems] = useState([]);

	// Update URL when search changes
	useEffect(() => {
		try {
			const params = new URLSearchParams(searchParams?.toString() || "");

			if (debouncedQuery) {
				params.set("q", debouncedQuery);
			} else {
				params.delete("q");
			}

			// Update URL without reloading the page
			const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
			window.history.replaceState({ path: newUrl }, "", newUrl);
		} catch (error) {
			console.error("Error updating URL:", error);
		}
	}, [debouncedQuery, searchParams]);

	// Debounce search input
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedQuery(searchQuery);
		}, 300); // 300ms debounce delay

		return () => clearTimeout(timer);
	}, [searchQuery]);

	// Filter items based on debounced query
	useEffect(() => {
		try {
			if (!Array.isArray(allItems)) {
				console.error("allItems is not an array:", allItems);
				setFilteredItems([]);
				return;
			}

			if (!debouncedQuery || !debouncedQuery.trim()) {
				const sortedItems = [...allItems].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
				setFilteredItems(sortedItems);
				return;
			}

			const queryLower = debouncedQuery.toLowerCase();
			const filtered = allItems.filter(item => {
				const title = item.title;
				const description = item.description;
				return title.toLowerCase().includes(queryLower) || description.toLowerCase().includes(queryLower);
			});

			// Highlight matches in title and description
			const highlighted = filtered.map(item => {
				try {
					const title = item.title;
					const description = item.description;
					const escapedQuery = debouncedQuery.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
					const regex = new RegExp(`(${escapedQuery})`, "gi");

					const highlightedTitle = title.replace(
						regex,
						'<span class="bg-accent/30 text-accent-foreground rounded px-0.5">$1</span>'
					);
					const highlightedDescription = description.replace(
						regex,
						'<span class="bg-accent/30 text-accent-foreground rounded px-0.5">$1</span>'
					);

					return {
						...item,
						title: highlightedTitle,
						description: highlightedDescription,
					};
				} catch (error) {
					console.error("Error highlighting item:", error);
					return {
						...item,
						title: item.title,
						description: item.description,
					};
				}
			});

			const sortedHighlighted = highlighted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
			setFilteredItems(sortedHighlighted);
		} catch (error) {
			console.error("Error filtering items:", error);
			setFilteredItems([]);
		}
	}, [debouncedQuery, allItems]);

	return (
		<>
			<div className="mx-auto mb-12 max-w-md">
				<div className="relative">
					<Search className="text-muted-foreground absolute top-3.5 left-4 h-5 w-5" />
					<input
						type="text"
						name="q"
						placeholder="Search posts..."
						className="border-border focus:border-primary/70 bg-card focus:ring-primary/30 placeholder-muted-foreground w-full rounded-xl border py-3 pr-4 pl-12 text-lg transition-all focus:ring-2"
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
						style={{ fontFamily: "var(--font-sans)" }}
					/>
				</div>
			</div>

			{0 < filteredItems.length ? (
				<div className="grid w-full gap-6 md:grid-cols-2 lg:grid-cols-3">
					{filteredItems.map((item, index) => (
						<PostCard
							key={index}
							post={{
								slug: item.slug,
								title: item.title,
								createdAt: item.createdAt,
								description: item.description,
								tags: item.tags,
							}}
						/>
					))}
				</div>
			) : (
				<div className="w-full py-12 text-center">
					<div className="text-muted-foreground/70 mb-4 text-4xl">⨯</div>
					<p className="text-muted-foreground mb-2 text-xl" style={{ fontFamily: "var(--font-serif)" }}>
						No matching posts found
					</p>
					<p className="text-muted-foreground/80" style={{ fontFamily: "var(--font-sans)" }}>
						Try different search terms
					</p>
				</div>
			)}
		</>
	);
}
