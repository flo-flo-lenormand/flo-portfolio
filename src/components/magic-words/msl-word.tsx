"use client";

import { useState } from "react";
import { motion } from "motion/react";

const PARTS = [
  { abbr: "M", full: "Meta\u00a0" },
  { abbr: "S", full: "Superintelligence\u00a0" },
  { abbr: "L", full: "Labs" },
];

export default function MslWord() {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      className="inline-flex cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setHovered((v) => !v)}
    >
      {PARTS.map(({ abbr, full }, i) => (
        <motion.span
          key={abbr}
          layout
          className="inline-block overflow-hidden whitespace-nowrap"
          transition={{
            layout: {
              type: "spring",
              duration: 0.5,
              bounce: 0.05,
              delay: hovered ? i * 0.08 : (PARTS.length - 1 - i) * 0.05,
            },
          }}
        >
          {hovered ? full : abbr}
        </motion.span>
      ))}
    </span>
  );
}
