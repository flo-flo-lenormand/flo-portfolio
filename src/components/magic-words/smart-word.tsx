"use client";

import { useState } from "react";

export default function SmartWord() {
  const [active, setActive] = useState(false);

  return (
    <span
      className="relative inline-block cursor-default"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onClick={() => setActive((v) => !v)}
    >
      {/* Base text - always visible */}
      <span style={{ color: "inherit" }}>smart</span><span style={{ color: "inherit", fontWeight: 600 }}>,</span>

      {/* Shimmer overlay - sweeps left to right across text */}
      <span
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.45) 50%, transparent 70%)",
          backgroundSize: "250% 100%",
          backgroundPosition: "-250% center",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          animation: active ? "shimmer-ltr 3.5s ease-in-out infinite" : "none",
          opacity: active ? 1 : 0,
          transitionProperty: "opacity",
          transitionDuration: "200ms",
          transitionTimingFunction: "cubic-bezier(0.2, 0, 0, 1)",
        }}
      >
        smart<span style={{ fontWeight: 600 }}>,</span>
      </span>
    </span>
  );
}
