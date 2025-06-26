import { Inter, Playfair_Display, Roboto_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { StagewiseToolbar } from "@stagewise/toolbar-next";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// Load fonts
const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
});

const playfair = Playfair_Display({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-playfair",
});

const robotoMono = Roboto_Mono({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-roboto-mono",
});

const stagewiseConfig = {
	plugins: [],
};

export const metadata = {
	title: {
		default: "Yashraj Maher",
		template: "%s | Yashraj Maher",
	},
	description: "A portfolio of projects and thoughts by Yashraj Maher",
};

export default function RootLayout({ children }) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={`${inter.variable} ${playfair.variable} ${robotoMono.variable}`}
		>
			<head />
			<body className="bg-background text-foreground min-h-screen antialiased">
				<ThemeProvider defaultTheme="light" storageKey="yashraj-theme">
					{"development" === process.env.NODE_ENV && <StagewiseToolbar config={stagewiseConfig} />}
					<Analytics />
					<main>{children}</main>
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
