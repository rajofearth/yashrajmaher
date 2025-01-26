import { Delicious_Handrawn } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"
import AdSense from "./components/AdSense"

const deliciousHandrawn = Delicious_Handrawn({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-delicious-handrawn",
});

export const metadata = {
  title: "Yashraj Maher",
  description: "A Personal Website of Yashraj Maher",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <AdSense pId="ca-pub-7126360642599717"/>
        <meta name="google-adsense-account" content="ca-pub-7126360642599717"/>
      </head>
      <Analytics/>
      <body className={`${deliciousHandrawn.variable} font-delicious antialiased m-10`}>
        {children}
      </body>
    </html>
  );
}