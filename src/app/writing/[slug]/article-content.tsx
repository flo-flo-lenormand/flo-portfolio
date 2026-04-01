"use client";

import { motion } from "motion/react";
import Link from "next/link";

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
  date: string;
  content: string;
}

export default function ArticleContent({ title, date, content }: Props) {
  return (
    <motion.article
      className="pt-8"
      initial="hidden"
      animate="visible"
      variants={container}
    >
      <motion.div
        variants={variants}
        transition={{ type: "spring", duration: 0.4, bounce: 0 }}
      >
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-8 inline-block"
        >
          ← Back
        </Link>
      </motion.div>

      <header className="mb-10">
        <motion.h1
          variants={variants}
          transition={{ type: "spring", duration: 0.5, bounce: 0 }}
          className="text-[32px] md:text-[48px] font-extrabold text-gray-900 leading-tight tracking-tight mb-3"
        >
          {title}
        </motion.h1>

        <motion.time
          variants={variants}
          transition={{ type: "spring", duration: 0.5, bounce: 0 }}
          className="text-sm text-gray-400 block"
        >
          {date}
        </motion.time>
      </header>

      <motion.div
        variants={variants}
        transition={{ type: "spring", duration: 0.6, bounce: 0 }}
        className="prose"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </motion.article>
  );
}
