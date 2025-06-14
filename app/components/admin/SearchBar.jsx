import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchBar({ placeholder = "Search posts", onChange }) {
	return (
		<div className="px-3 py-2 sm:px-4 sm:py-3">
			<div className="relative h-10 sm:h-12">
				<div className="text-muted-foreground absolute top-1/2 left-3.5 -translate-y-1/2">
					<Search className="h-4 w-4 sm:h-5 sm:w-5" />
				</div>
				<Input
					placeholder={placeholder}
					onChange={e => onChange?.(e.target.value)}
					className="bg-muted text-foreground placeholder:text-muted-foreground h-full w-full rounded-xl border-none pl-11 text-sm font-normal sm:pl-14 sm:text-base"
				/>
			</div>
		</div>
	);
}
