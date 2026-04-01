"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

const WORDS = [
  "Thinking...",
  "Computing...",
  "Surfing...",
  "Hallucinating...",
  "Floing...",
  "Napping...",
  "Procrastinating...",
  "Forgetting...",
  "Remembering...",
];

export default function SmartWord() {
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) {
      setIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % WORDS.length);
    }, 800);
    return () => clearInterval(interval);
  }, [active]);

  const word = active ? WORDS[index] : "smart";

  return (
    <span
      className="inline-block relative cursor-default"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onClick={() => setActive((v) => !v)}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={word}
          initial={{ opacity: 0, y: 5, filter: "blur(3px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -5, filter: "blur(3px)" }}
          transition={{ duration: 0.15, ease: [0.25, 0, 0, 1] }}
          className="inline-block"
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
