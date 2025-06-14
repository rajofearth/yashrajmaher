/**
 * Design system for the website
 * This file defines colors, spacing, and other design tokens used throughout the site
 */

export const colors = {
	background: "#f0e9d2", // Cream background
	backgroundAlt: "#faf6ec", // Lighter cream for cards
	backgroundDark: "#e6dcc1", // Darker cream for accents
	border: "#dbd0b8", // Border color
	borderFocus: "#c0b49b", // Border color when focused
	text: {
		primary: "#5c5546", // Primary text color
		secondary: "#73695d", // Secondary/lighter text
		muted: "#84776a", // Muted text color
		link: "#7c6e58", // Link color
		linkHover: "#493e35", // Link hover color
		highlight: "#5c5132", // Text highlight color
	},
	accent: {
		highlight: "rgba(244, 220, 149, 0.5)", // Yellow highlight
	},
};

export const fonts = {
	sans: "var(--font-sans)",
	serif: "var(--font-serif)",
	mono: "var(--font-mono)",
	display: "var(--font-display)",
	cursive: "var(--font-cursive)",
};

export const spacing = {
	section: "py-16",
	container: "max-w-5xl mx-auto px-4 md:px-6",
	cardGap: "gap-6",
};

export const shadows = {
	sm: "shadow-sm",
	md: "shadow-md",
	card: "shadow-sm hover:shadow-md transition-shadow duration-300",
};

export const transitions = {
	default: "transition-all duration-200",
	color: "transition-colors duration-150",
	transform: "transition-transform duration-200",
};

export const design = {
	colors,
	fonts,
	spacing,
	shadows,
	transitions,
};

export default design;
