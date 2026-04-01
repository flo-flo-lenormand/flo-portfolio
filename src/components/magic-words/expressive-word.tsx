"use client";

import { useState, useRef, useEffect } from "react";
import { animate } from "motion/react";

const COLORS = [
  "#E9405A",
  "#EF8EEE",
  "#7419F5",
  "#91F89B",
  "#FFFF6E",
  "#8EF9FD",
  "#8978F7",
  "#E9405A",
  "#EF8EEE",
  "#FF6B35",
  "#C0F541",
  "#FF3DFF",
  "#00FFAB",
  "#FFB347",
  "#3DFFEC",
  "#FF69B4",
  "#B8FF3D",
  "#7419F5",
  "#FFFF6E",
  "#E9405A",
];

export default function ExpressiveWord() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const controls = useRef<{ stop(): void } | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (active) {
      controls.current = animate(ref.current, { color: COLORS }, {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      });
    } else {
      controls.current?.stop();
      controls.current = animate(
        ref.current,
        { color: "#18181b" },
        { duration: 0.4, ease: [0, 0, 0.2, 1], onComplete: () => {
          if (ref.current) ref.current.style.color = "";
        }}
      );
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
