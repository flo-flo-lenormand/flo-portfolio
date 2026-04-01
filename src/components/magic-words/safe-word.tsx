"use client";

import { useState } from "react";
import { motion } from "motion/react";

export default function SafeWord() {
  const [active, setActive] = useState(false);

  return (
    <motion.span
      className="inline-block cursor-default"
      animate={{ filter: active ? "blur(6px)" : "blur(0px)" }}
      transition={{ type: "spring", duration: 0.4, bounce: 0 }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onClick={() => setActive((v) => !v)}
    >
      safe
    </motion.span>
  );
}
