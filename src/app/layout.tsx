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

const SITE_URL = "https://www.flolenormand.com";
const TITLE = "Flo Lenormand - Product Designer, AI Agents at Meta";
const DESCRIPTION =
  "Product Designer at Meta Superintelligence Labs in San Francisco. Designing AI agents. Previously: safety and expressiveness on Instagram and Messenger.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s - Flo Lenormand",
  },
  description: DESCRIPTION,
  applicationName: "Flo Lenormand",
  authors: [{ name: "Florent Lenormand", url: SITE_URL }],
  creator: "Florent Lenormand",
  publisher: "Florent Lenormand",
  keywords: [
    "Flo Lenormand",
    "Florent Lenormand",
    "Product Designer",
    "Meta",
    "Meta Superintelligence Labs",
    "MSL",
    "AI Agents",
    "Messenger",
    "Instagram",
    "Portfolio",
    "San Francisco",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    siteName: "Flo Lenormand",
    url: SITE_URL,
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Flo Lenormand - Product Designer at Meta",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "PqUEi3nwP3LUv9dCM8ZuXhrUMywpWYYy8igbjNtjDkg",
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

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Florent Lenormand",
  alternateName: "Flo Lenormand",
  jobTitle: "Product Designer",
  worksFor: {
    "@type": "Organization",
    name: "Meta",
  },
  url: SITE_URL,
  sameAs: [
    "https://www.linkedin.com/in/florent-lenormand",
    "https://github.com/flo-flo-lenormand",
    "https://substack.com/@flolenormand",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "San Francisco",
    addressRegion: "CA",
    addressCountry: "US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${caveat.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="h-full bg-white text-black font-sans antialiased" style={{ textWrap: "pretty" } as React.CSSProperties}>
        {children}
      </body>
    </html>
  );
}
