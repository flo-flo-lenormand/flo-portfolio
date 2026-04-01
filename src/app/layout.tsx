import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
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
  twitter: {
    card: "summary",
    title: "Flo Lenormand",
    description:
      "Product Designer at Meta. Designing AI agents at MSL. Writing about design, AI, and the things I get wrong.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} h-full`}>
      <body className="min-h-full flex flex-col">
        <header className="w-full max-w-2xl mx-auto px-6 pt-12 pb-6">
          <nav className="flex items-baseline justify-between">
            <Link
              href="/"
              className="text-sand-900 font-medium hover:text-sand-600 transition-colors"
            >
              Flo Lenormand
            </Link>
            <div className="flex gap-6 text-sm text-sand-500">
              <Link href="/" className="hover:text-sand-800 transition-colors">
                Writing
              </Link>
              <Link
                href="/about"
                className="hover:text-sand-800 transition-colors"
              >
                About
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1 w-full max-w-2xl mx-auto px-6 pb-20">
          {children}
        </main>
        <Analytics />
        <footer className="w-full max-w-2xl mx-auto px-6 py-8 border-t border-sand-200">
          <div className="flex gap-6 text-sm text-sand-400">
            <a
              href="https://substack.com/@flolenormand"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sand-600 transition-colors"
            >
              Substack
            </a>
            <a
              href="https://www.threads.net/@flo_lenormand"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sand-600 transition-colors"
            >
              Threads
            </a>
            <a
              href="https://www.linkedin.com/in/florentlenormand"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sand-600 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="mailto:florent.lenormand@icloud.com"
              className="hover:text-sand-600 transition-colors"
            >
              Email
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
