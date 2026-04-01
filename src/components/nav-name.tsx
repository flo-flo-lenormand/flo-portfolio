"use client";

import { useRef } from "react";
import Link from "next/link";

function getFaviconLink(): HTMLLinkElement | null {
  return document.querySelector<HTMLLinkElement>('link[rel*="icon"]');
}

function makeCircularFavicon(src: string, size = 64): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const img = new window.Image();
    img.onload = () => {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, 0, 0, size, size);
      resolve(canvas.toDataURL("image/png"));
    };
    img.src = src;
  });
}

export default function NavName() {
  const originalHref = useRef<string | null>(null);
  const circularHref = useRef<string | null>(null);

  const handleMouseEnter = async () => {
    const link = getFaviconLink();
    if (!link) return;
    if (!originalHref.current) originalHref.current = link.href;
    if (!circularHref.current) {
      circularHref.current = await makeCircularFavicon("/avatar.jpg");
    }
    link.href = circularHref.current;
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
