"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { motion } from "motion/react";

const PARTS = [
  { abbr: "M", full: "Meta\u00a0" },
  { abbr: "S", full: "Superintelligence\u00a0" },
  { abbr: "L", full: "Labs" },
];

export default function MslWord() {
  const [hovered, setHovered] = useState(false);
  const sizerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [abbrWidths, setAbbrWidths] = useState<number[]>([]);

  // Measure each letter's natural width before first paint
  useLayoutEffect(() => {
    setAbbrWidths(sizerRefs.current.map((el) => el?.offsetWidth ?? 0));
  }, []);

  return (
    <span
      className="inline-flex cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setHovered((v) => !v)}
    >
      {PARTS.map(({ abbr, full }, i) => (
        <span key={abbr} className="relative inline-block">
          {/* Invisible sizer — measures the collapsed letter width */}
          <span
            ref={(el) => { sizerRefs.current[i] = el; }}
            className="absolute invisible pointer-events-none select-none whitespace-nowrap"
            aria-hidden="true"
          >
            {abbr}
          </span>
          {/* Width animates between measured letter px and auto — no scale, no distortion */}
          <motion.span
            className="inline-block overflow-hidden whitespace-nowrap"
            animate={{ width: hovered || !abbrWidths[i] ? "auto" : abbrWidths[i] }}
            initial={false}
            transition={{
              type: "spring",
              duration: 0.5,
              bounce: 0.05,
              delay: hovered ? i * 0.08 : (PARTS.length - 1 - i) * 0.05,
            }}
          >
            {full}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
