"use client";

import { motion } from "motion/react";
import Link from "next/link";

interface Article {
  slug: string;
  title: string;
  date: string;
  description?: string;
  external?: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const itemTransition = {
  y: { type: "spring" as const, duration: 0.4, bounce: 0 },
  filter: { type: "spring" as const, duration: 0.4, bounce: 0 },
  opacity: { duration: 0.7, ease: [0.25, 0, 0, 1] as number[] },
};

export default function HomeContent({ articles }: { articles: Article[] }) {
  return (
    <motion.div
      className="pt-8"
      initial="hidden"
      animate="visible"
      variants={container}
    >
      {/* Intro — pinned bubble */}
      <motion.section className="mb-16" variants={item} transition={itemTransition}>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-gray-400">pinned</span>
          <div className="bg-bubble-blue text-white rounded-[18px] rounded-tr-[4px] px-4 py-3 max-w-[75%] text-base leading-snug">
            I made message bubbles safe, then expressive, now smart.
          </div>
        </div>
      </motion.section>

      {/* Articles */}
      <section>
        <div className="space-y-6">
          {articles.map((article) => {
            const isExternal = !!article.external;
            const props = isExternal
              ? { href: article.external!, target: "_blank" as const, rel: "noopener noreferrer" }
              : { href: `/writing/${article.slug}` };

            return (
              <motion.article
                key={article.slug}
                className="group"
                variants={item}
                transition={itemTransition}
              >
                <a
                  {...props}
                  className="block active:scale-[0.98] transition-transform duration-150 ease-out"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="text-base text-gray-900 group-hover:text-gray-600 group-hover:translate-x-1 transition-[color,transform] duration-200 ease-out leading-snug">
                      {article.title}
                      {isExternal && (
                        <span className="text-gray-400 text-sm ml-1">↗</span>
                      )}
                    </h2>
                    <time className="text-sm text-gray-400 whitespace-nowrap shrink-0">
                      {formatDate(article.date)}
                    </time>
                  </div>
                  {article.description && (
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                      {article.description}
                    </p>
                  )}
                </a>
              </motion.article>
            );
          })}
        </div>
      </section>
    </motion.div>
  );
}
