import type { Metadata } from "next";
import { Geist, Caveat } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-var",
});

const caveat = Caveat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-caveat-var",
});

export const metadata: Metadata = {
  title: "Flo",
  description:
    "I made conversations safe on Instagram. Then expressive on Messenger. Now I'm making them smart, designing AI agents at Meta Superintelligence Labs.",
  openGraph: {
    title: "Flo",
    description:
      "I made conversations safe on Instagram. Then expressive on Messenger. Now I'm making them smart, designing AI agents at Meta Superintelligence Labs.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${caveat.variable} h-full`}>
      <body className="h-full bg-white text-black font-sans antialiased" style={{ textWrap: "pretty" } as React.CSSProperties}>
        {children}
      </body>
    </html>
  );
}
