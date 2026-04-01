"use client";

import { useState } from "react";
import { motion } from "motion/react";

export default function SafeWord() {
  const [active, setActive] = useState(false);

  return (
    <motion.span
      className="inline-block cursor-default"
      animate={{ filter: active ? "blur(3px)" : "blur(0px)" }}
      transition={
        active
          ? { duration: 0.9, ease: [0.4, 0, 1, 1] }
          : { duration: 0.4, ease: [0, 0, 0.2, 1] }
      }
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onClick={() => setActive((v) => !v)}
    >
      safe
    </motion.span>
  );
}
