"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function BackButton({ text = "Back" }) {
	const router = useRouter();

	return (
		<button
			onClick={() => router.back()}
			className="text-foreground hover:text-primary mt-4 ml-4 flex items-center gap-1 px-4 py-2 transition-colors"
		>
			<ChevronLeft className="h-full w-4" />
			{text}
		</button>
	);
}
