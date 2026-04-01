"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="sync">
      <motion.div
        key={pathname}
        exit={{
          opacity: 0,
          y: -8,
          filter: "blur(4px)",
          transition: { duration: 0.15, ease: "easeIn" },
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
