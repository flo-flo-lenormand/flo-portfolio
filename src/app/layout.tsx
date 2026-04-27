import type { Metadata, Viewport } from "next";
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

const description =
  "I made conversations safe on Instagram. Then expressive on Messenger. Now I'm making them smart, designing AI agents at Meta Superintelligence Labs.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.flolenormand.com"),
  title: "Flo Lenormand",
  description,
  openGraph: {
    title: "Flo Lenormand",
    description,
    type: "website",
    siteName: "Flo Lenormand",
    url: "https://www.flolenormand.com",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Flo Lenormand",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flo Lenormand",
    description,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Lock scaling so the physics sandbox's viewport-relative math isn't
  // thrown off by pinch-zoom mid-interaction. Art-piece tradeoff.
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
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
