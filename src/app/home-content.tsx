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
  opacity: { duration: 0.7, ease: [0.25, 0, 0, 1] as [number, number, number, number] },
};

export default function HomeContent({ articles }: { articles: Article[] }) {
  return (
    <motion.div
      className="pt-8"
      initial="hidden"
      animate="visible"
      variants={container}
    >
      {/* Intro */}
      <motion.section className="mb-16" variants={item} transition={itemTransition}>
        <h1 className="text-[32px] md:text-[48px] font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
          <span className="block">I made message bubbles safe,</span>
          <span className="block">then expressive,</span>
          <span className="block">now smart.</span>
        </h1>
        <div className="prose">
          <p>
            Product designer at Meta, working on AI agents at Meta Superintelligence Labs.
            <br />
            Working hard to automate my design workflow so I can go surfing.
          </p>
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
