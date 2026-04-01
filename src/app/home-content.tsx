"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

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

const spring = { type: "spring" as const, duration: 0.4, bounce: 0 };
const fade = { duration: 0.7, ease: [0.25, 0, 0, 1] as [number, number, number, number] };

const lineVariant = {
  hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const lineTransition = (delay: number) => ({
  y: { ...spring, delay },
  filter: { ...spring, delay },
  opacity: { ...fade, delay },
});

const articleListVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const articleVariant = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const articleTransition = {
  y: spring,
  filter: spring,
  opacity: fade,
};

export default function HomeContent({ articles }: { articles: Article[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="pt-20">
      {/* Intro */}
      <section className="mb-16">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
          {[
            { text: "I made message bubbles safe", delay: 0.15 },
            { text: "then expressive", delay: 0.55 },
            { text: "now smart", delay: 0.95 },
          ].map(({ text, delay }) => (
            <motion.span
              key={text}
              className="block"
              initial="hidden"
              animate="visible"
              variants={lineVariant}
              transition={lineTransition(delay)}
            >
              {text}
            </motion.span>
          ))}
        </h1>

        <motion.div
          className="prose"
          initial="hidden"
          animate="visible"
          variants={lineVariant}
          transition={lineTransition(1.3)}
        >
          <p>
            Product designer at Meta, working on AI agents at Meta Superintelligence Labs (MSL). Working hard to automate my design workflow so I can go surfing.
          </p>
        </motion.div>
      </section>

      {/* Writing toggle */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={lineVariant}
        transition={lineTransition(1.55)}
      >
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-8 cursor-pointer"
        >
          <span>Writing</span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0 }}
            className="inline-block"
          >
            ↓
          </motion.span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              key="articles"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={articleListVariants}
            >
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
                      variants={articleVariant}
                      transition={articleTransition}
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
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
