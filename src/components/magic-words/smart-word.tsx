"use client";

import { useState, useRef, useEffect, useCallback } from "react";

/**
 * Shimmer effect on the word "smart" - a focused highlight band sweeps
 * across the text on hover using translateX (GPU-composited).
 */
export default function SmartWord() {
  const [active, setActive] = useState(false);
  const overlayRef = useRef<HTMLSpanElement>(null);
  const animRef = useRef<Animation | null>(null);

  const startShimmer = useCallback(() => {
    const el = overlayRef.current;
    if (!el) return;

    // Cancel any running fade-out
    animRef.current?.cancel();

    el.style.opacity = "1";
    animRef.current = el.animate(
      [
        { transform: "translateX(-180%)" },
        { transform: "translateX(100%)" },
      ],
      {
        duration: 2200,
        easing: "linear",
        iterations: Infinity,
      }
    );
  }, []);

  const stopShimmer = useCallback(() => {
    const el = overlayRef.current;
    if (!el) return;

    animRef.current?.cancel();
    animRef.current = el.animate(
      [{ opacity: "1" }, { opacity: "0" }],
      { duration: 300, easing: "cubic-bezier(0, 0, 0.2, 1)", fill: "forwards" }
    );
    animRef.current.onfinish = () => {
      el.style.opacity = "0";
      el.style.transform = "translateX(-100%)";
    };
  }, []);

  useEffect(() => {
    if (active) {
      startShimmer();
    } else {
      stopShimmer();
    }
    return () => {
      animRef.current?.cancel();
    };
  }, [active, startShimmer, stopShimmer]);

  return (
    <span
      className="relative inline-block cursor-default"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onClick={() => setActive((v) => !v)}
    >
      {/* Base text */}
      <span style={{ color: "inherit" }}>smart</span>
      <span style={{ color: "inherit", fontWeight: 600 }}>,</span>

      {/* Shimmer sweep overlay */}
      <span
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <span
          ref={overlayRef}
          className="absolute inset-0"
          style={{
            width: "180%",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 30%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.7) 70%, transparent 100%)",
            opacity: 0,
            transform: "translateX(-100%)",
          }}
        />
      </span>
    </span>
  );
}
