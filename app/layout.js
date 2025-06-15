import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Inter, Playfair_Display, Roboto_Mono } from "next/font/google";
import { StagewiseToolbar } from '@stagewise/toolbar-next';
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from '@clerk/nextjs';
import ChatAgent from '@/app/components/ChatAgent';

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
  plugins: []
};

export const metadata = {
  title: {
    default: 'Yashraj Maher',
    template: '%s | Yashraj Maher',
  },
  description: 'A portfolio of projects and thoughts by Yashraj Maher',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable} ${robotoMono.variable}`}>
      <head />
      <body className="min-h-screen antialiased bg-background text-foreground">
        <ClerkProvider>
          <ThemeProvider defaultTheme="light" storageKey="yashraj-theme">
            {process.env.NODE_ENV === 'development' && (
              <StagewiseToolbar config={stagewiseConfig} />
            )}
            <Analytics />
            <main>
              {children}
            </main>
            <ChatAgent />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
