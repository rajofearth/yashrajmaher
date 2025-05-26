import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Inter, Playfair_Display, Roboto_Mono } from "next/font/google";
import { StagewiseToolbar } from '@stagewise/toolbar-next';

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
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${robotoMono.variable}`}>
      <Analytics />
      <body className="min-h-screen antialiased">
        {process.env.NODE_ENV === 'development' && (
          <StagewiseToolbar config={stagewiseConfig} />
        )}
        <main>
          {children}
        </main>
        {/* Add your footer here if needed */}
      </body>
    </html>
  );
}
