"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

export default function NavName() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute -top-16 left-1/2 -translate-x-1/2 pointer-events-none"
            initial={{ opacity: 0, scale: 0.7, y: 6, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.7, y: 6, filter: "blur(4px)" }}
            transition={{ type: "spring", duration: 0.3, bounce: 0.1 }}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow-md">
              <Image
                src="/avatar.jpg"
                alt="Flo Lenormand"
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Link
        href="/"
        className="text-gray-900 font-medium hover:text-gray-600 transition-colors active:scale-[0.96] transition-transform duration-150 ease-out inline-block"
      >
        Flo Lenormand
      </Link>
    </div>
  );
}
