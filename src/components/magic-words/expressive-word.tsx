"use client";

import { useState, useRef, useEffect } from "react";
import { animate } from "motion/react";

export default function ExpressiveWord() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const controls = useRef<{ stop(): void } | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (active) {
      ref.current.style.color = "#e53935";
      controls.current = animate(
        ref.current,
        { filter: ["hue-rotate(0deg)", "hue-rotate(360deg)"] },
        { duration: 1.8, repeat: Infinity, ease: "linear" }
      );
    } else {
      controls.current?.stop();
      controls.current = null;
      ref.current.style.color = "";
      ref.current.style.filter = "";
    }
    return () => {
      controls.current?.stop();
    };
  }, [active]);

  return (
    <span
      ref={ref}
      className="inline-block cursor-default"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onClick={() => setActive((v) => !v)}
    >
      expressive
    </span>
  );
}
