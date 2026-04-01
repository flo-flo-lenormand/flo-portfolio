import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import PageTransition from "@/components/page-transition";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-var",
});

export const metadata: Metadata = {
  title: "Flo Lenormand",
  description:
    "Product Designer at Meta. Designing AI agents at MSL. Writing about design, AI, and the things I get wrong.",
  openGraph: {
    title: "Flo Lenormand",
    description:
      "Product Designer at Meta. Designing AI agents at MSL. Writing about design, AI, and the things I get wrong.",
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
          <nav className="flex items-baseline justify-between">
            <Link
              href="/"
              className="text-gray-900 font-medium hover:text-gray-600 transition-colors active:scale-[0.96] transition-transform duration-150 ease-out inline-block"
            >
              Flo Lenormand
            </Link>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link href="/" className="hover:text-gray-800 transition-colors active:scale-[0.96] transition-transform duration-150 ease-out inline-block">
                Writing
              </Link>
              <Link
                href="/about"
                className="hover:text-gray-800 transition-colors active:scale-[0.96] transition-transform duration-150 ease-out inline-block"
              >
                About
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1 w-full max-w-2xl mx-auto px-6 pb-20">
          <PageTransition>{children}</PageTransition>
        </main>
        <footer className="w-full max-w-2xl mx-auto px-6 py-8 border-t border-gray-200">
          <div className="flex gap-6 text-sm text-gray-400">
            <a
              href="https://substack.com/@flolenormand"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition-colors"
            >
              Substack
            </a>
            <a
              href="https://www.threads.net/@flo_lenormand"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition-colors"
            >
              Threads
            </a>
            <a
              href="https://www.linkedin.com/in/florentlenormand"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="mailto:florent.lenormand@icloud.com"
              className="hover:text-gray-600 transition-colors"
            >
              Email
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
