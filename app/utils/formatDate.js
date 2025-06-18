// Utility to format a date object or date string into a readable string
export function formatDate(dateObj) {
	if (!dateObj) {
		return "";
	}
	// Handle both Date objects and date strings
	const date = dateObj instanceof Date ? dateObj : new Date(dateObj);
	// Check if date is valid before formatting
	if (isNaN(date.getTime())) {
		return "";
	}
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}
