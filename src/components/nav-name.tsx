"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

export default function NavName() {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href="/"
      className="text-gray-900 font-medium hover:text-gray-600 transition-colors active:scale-[0.96] transition-transform duration-150 ease-out inline-flex items-center gap-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="overflow-hidden rounded-full flex-shrink-0"
            initial={{ width: 0, opacity: 0, marginRight: 0 }}
            animate={{ width: 18, opacity: 1, marginRight: 6 }}
            exit={{ width: 0, opacity: 0, marginRight: 0 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
          >
            <Image
              src="/avatar.jpg"
              alt="Flo Lenormand"
              width={18}
              height={18}
              className="object-cover rounded-full"
              style={{ minWidth: 18 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      Flo Lenormand
    </Link>
  );
}
