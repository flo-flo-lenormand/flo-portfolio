"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (!pathname.startsWith("/writing/")) return null;

  return (
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
  );
}
