import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import AdSense from "./components/AdSense";
import { Inter, Space_Grotesk } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata = {
  title: "Yashraj Maher",
  description: "A Personal Website of Yashraj Maher",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <AdSense pId="ca-pub-7126360642599717" />
        <meta name="google-adsense-account" content="ca-pub-7126360642599717" />
      </head>
      <Analytics />
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        {children}
      </body>
    </html>
  );
}
