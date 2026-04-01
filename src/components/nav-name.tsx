"use client";

import { useRef } from "react";
import Link from "next/link";

function getFaviconLink(): HTMLLinkElement | null {
  return document.querySelector<HTMLLinkElement>('link[rel*="icon"]');
}

export default function NavName() {
  const originalHref = useRef<string | null>(null);

  const handleMouseEnter = () => {
    const link = getFaviconLink();
    if (link) {
      originalHref.current = link.href;
      link.href = "/avatar.jpg";
    }
  };

  const handleMouseLeave = () => {
    const link = getFaviconLink();
    if (link && originalHref.current) {
      link.href = originalHref.current;
    }
  };

  return (
    <Link
      href="/"
      className="text-gray-900 font-medium hover:text-gray-600 transition-colors active:scale-[0.96] transition-transform duration-150 ease-out inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      Flo Lenormand
    </Link>
  );
}
