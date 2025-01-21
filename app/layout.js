import { Delicious_Handrawn } from "next/font/google";
import "./globals.css";

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
      <body className={`${deliciousHandrawn.variable} font-delicious antialiased m-10`}>
        {children}
      </body>
    </html>
  );
}