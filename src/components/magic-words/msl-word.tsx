"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export default function MslWord() {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      className="inline-block cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setHovered((v) => !v)}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={hovered ? "full" : "abbr"}
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.2, ease: [0.25, 0, 0, 1] }}
          className="inline-block"
        >
          {hovered ? "Meta Superintelligence Labs" : "MSL"}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
