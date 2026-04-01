import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import PageTransition from "@/components/page-transition";
import NavName from "@/components/nav-name";
import Footer from "@/components/footer";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-var",
});

export const metadata: Metadata = {
  title: "Flo Lenormand",
  description:
    "Flo Lenormand - Product Designer. I made message bubbles safe, then expressive, now smart. Writing about craft, AI, and what I learn along the way.",
  openGraph: {
    title: "Flo Lenormand",
    description:
      "Flo Lenormand - Product Designer. I made message bubbles safe, then expressive, now smart. Writing about craft, AI, and what I learn along the way.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <header className="w-full max-w-2xl mx-auto px-6 pt-12 pb-6">
          <nav className="flex items-center justify-between">
            <NavName />
          </nav>
        </header>
        <main className="flex-1 w-full max-w-2xl mx-auto px-6 pb-20">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
