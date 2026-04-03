"use client";

import Link from "next/link";
import { motion } from "motion/react";

const variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

interface Props {
  title: string;
  content: string;
}

export default function ArticleContent({ title, content }: Props) {
  return (
    <motion.article
      className="flex justify-center px-6 pt-[15vh] pb-[20vh]"
      initial="hidden"
      animate="visible"
      variants={container}
    >
      <div style={{ maxWidth: 670, width: "100%" }}>
        <motion.div
          variants={variants}
          transition={{
            y: { type: "spring", duration: 0.4, bounce: 0 },
            filter: { type: "spring", duration: 0.4, bounce: 0 },
            opacity: { duration: 0.7, ease: [0.25, 0, 0, 1] },
          }}
          className="mb-8"
        >
          <Link href="/" className="inline-block">
            <img
              src="/backarrow.png"
              alt="Back to home"
              style={{ width: 36, height: 36 }}
            />
          </Link>
        </motion.div>

        <motion.h1
          variants={variants}
          transition={{
            y: { type: "spring", duration: 0.5, bounce: 0 },
            filter: { type: "spring", duration: 0.5, bounce: 0 },
            opacity: { duration: 0.9, ease: [0.25, 0, 0, 1] },
          }}
          className="font-extrabold text-black leading-tight tracking-tight mb-10"
          style={{ fontSize: 32, textWrap: "balance" as const }}
        >
          {title}
        </motion.h1>

        <motion.div
          variants={variants}
          transition={{
            y: { type: "spring", duration: 0.6, bounce: 0 },
            filter: { type: "spring", duration: 0.6, bounce: 0 },
            opacity: { duration: 1.1, ease: [0.25, 0, 0, 1] },
          }}
          className="prose"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </motion.article>
  );
}
