import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status = "draft" }) {
	// Normalize status to lowercase for consistency
	const normalizedStatus = status.toLowerCase();

	// Define variant and additional classes based on status
	let variant = "secondary";
	let additionalClasses = "";

	switch (normalizedStatus) {
		case "published":
			variant = "default";
			additionalClasses = "bg-green-500/20 text-green-700 dark:bg-green-500/30 dark:text-green-400";
			break;
		case "draft":
			variant = "secondary";
			additionalClasses = "bg-amber-500/20 text-amber-700 dark:bg-amber-500/30 dark:text-amber-400";
			break;
		case "unpublished":
			variant = "outline";
			additionalClasses = "bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-400";
			break;
		default:
			// Use default secondary styling
			break;
	}

	// First letter uppercase for display
	const displayStatus = normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);

	return (
		<Badge
			variant={variant}
			className={`h-8 w-full max-w-[480px] min-w-[84px] rounded-full border-none px-4 text-sm font-medium ${additionalClasses}`}
		>
			<span className="truncate">{displayStatus}</span>
		</Badge>
	);
}
