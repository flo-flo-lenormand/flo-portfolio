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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://flolenormand.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Flo",
  description:
    "I made conversations safe on Instagram. Then expressive on Messenger. Now I'm making them smart, designing AI agents at Meta Superintelligence Labs.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Flo",
    description:
      "I made conversations safe on Instagram. Then expressive on Messenger. Now I'm making them smart, designing AI agents at Meta Superintelligence Labs.",
    type: "website",
    url: siteUrl,
    images: [{ url: "/avatar.jpg", width: 1200, height: 630, alt: "Flo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flo",
    description:
      "I made conversations safe on Instagram. Then expressive on Messenger. Now I'm making them smart, designing AI agents at Meta Superintelligence Labs.",
    images: ["/avatar.jpg"],
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
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('pageshow', function(e) {
                if (e.persisted) {
                  window.location.reload();
                }
              });
            `,
          }}
        />
      </head>
      <body className="h-full bg-white text-black font-sans">
        {children}
      </body>
    </html>
  );
}
