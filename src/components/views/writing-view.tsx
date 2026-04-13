"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

/** "waves are flat" with hover video */
function WavesAreFlat() {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (hovered) {
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [hovered]);

  return (
    <span
      className="relative inline cursor-default overflow-visible"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      waves are flat
      <AnimatePresence>
        {hovered && (
          <motion.span
            className="absolute z-50 overflow-visible"
            style={{
              top: "calc(100% + 16px)",
              left: 0,
              width: 300,
              minWidth: 300,
            }}
            initial={{ opacity: 0, scale: 0.97, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.97, filter: "blur(4px)" }}
            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
          >
            <video
              ref={videoRef}
              src="/flatday.mp4"
              muted
              loop
              playsInline
              style={{
                width: 300,
                minWidth: 300,
                height: "auto",
                borderRadius: 8,
              }}
            />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

/** Inline social icon */
function InlineSocialIcon({ name, url, path }: { name: string; url: string; path: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center text-black hover:text-zinc-400 transition-[color]"
      aria-label={name}
      style={{ width: 40, height: 40 }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d={path} />
      </svg>
    </a>
  );
}

/** "Flo" signature with favicon swap on hover */
function FloSignature() {
  const originalFavicon = useRef<string>("");

  const handleEnter = useCallback(() => {
    const link = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
    if (link) {
      originalFavicon.current = link.href;
      const canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.font = "28px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("\u{1F30A}", 16, 18);
        link.href = canvas.toDataURL();
      }
    }
  }, []);

  const handleLeave = useCallback(() => {
    const link = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
    if (link && originalFavicon.current) {
      link.href = originalFavicon.current;
    }
  }, []);

  return (
    <span
      className="cursor-default"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <img
        src="/flo-signature.png"
        alt="Flo"
        style={{ height: 40, display: "inline-block" }}
      />
    </span>
  );
}

const SOCIAL_ICONS = {
  linkedin: {
    name: "LinkedIn",
    url: "https://linkedin.com/in/florentlenormand",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  github: {
    name: "GitHub",
    url: "https://github.com/flo-flo-lenormand",
    path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  },
  x: {
    name: "X",
    url: "https://x.com/flolenormand",
    path: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  },
  instagram: {
    name: "Instagram",
    url: "https://instagram.com/flo.lenormand",
    path: "M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z",
  },
  messenger: {
    name: "Messenger",
    url: "https://m.me/florentlenormand",
    path: "M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.974 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8.2l3.131 3.26 5.887-3.26-6.559 6.763z",
  },
};

export default function WritingView() {
  return (
    <div className="flex flex-col gap-[48px]" style={{ width: 460 }}>
      {/* Writing paragraph */}
      <p className="text-[22px] font-medium leading-normal text-black">
        When <WavesAreFlat />,{" "}
        <span className="inline-block">
          <img
            src="/i-write.png"
            alt="I write"
            style={{ height: 28, display: "inline-block", verticalAlign: "baseline", position: "relative", top: 5 }}
          />
        </span>
        . About how I{" "}
        <a
          href="https://medium.com/@florentlenormand/i-asked-the-president-for-an-internship-in-design-tried-to-get-hired-at-apple-and-landed-a-job-at-85e2aedb2a2b"
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline transition-colors"
        >
          asked the President for an internship
        </a>
        , or{" "}
        <a
          href="https://flolenormand.substack.com/p/how-i-made-240-in-one-week-with-openclaw"
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline transition-colors"
        >
          how I made money with OpenClaw
        </a>
        , among{" "}
        <a
          href="https://flolenormand.substack.com"
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline transition-colors"
        >
          many other articles
        </a>
        .
      </p>

      {/* Socials */}
      <div className="flex -ml-[10px] items-center">
        <a href="https://instagram.com/flo.lenormand" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center hover:opacity-60 transition-[opacity]" style={{ width: 40, height: 40 }} aria-label="Instagram">
          <img src="/ig.png" alt="Instagram" width={24} height={24} />
        </a>
        <a href="https://m.me/florentlenormand" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center hover:opacity-60 transition-[opacity]" style={{ width: 40, height: 40 }} aria-label="Messenger">
          <img src="/messenger.png" alt="Messenger" width={24} height={24} />
        </a>
        <a href="https://www.meta.ai" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center hover:opacity-60 transition-[opacity]" style={{ width: 40, height: 40 }} aria-label="Meta Superintelligence Labs">
          <img src="/metaai.png" alt="MSL" width={28} height={28} />
        </a>
        <a href="https://linkedin.com/in/florentlenormand" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center hover:opacity-60 transition-[opacity]" style={{ width: 40, height: 40 }} aria-label="LinkedIn">
          <img src="/linkedin.png" alt="LinkedIn" width={24} height={24} />
        </a>
        <a href="https://x.com/flolenormand" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center hover:opacity-60 transition-[opacity]" style={{ width: 40, height: 40 }} aria-label="X">
          <img src="/x.png" alt="X" width={24} height={24} />
        </a>
        <a href="https://github.com/flo-flo-lenormand" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center hover:opacity-60 transition-[opacity]" style={{ width: 40, height: 40 }} aria-label="GitHub">
          <img src="/github.png" alt="GitHub" width={24} height={24} />
        </a>
      </div>

      {/* Flo signature */}
      <p>
        <FloSignature />
      </p>
    </div>
  );
}
