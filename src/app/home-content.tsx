"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { messages } from "@/lib/chat-data";
import SafeWord from "@/components/magic-words/safe-word";
import ExpressiveWord from "@/components/magic-words/expressive-word";
import SmartWord from "@/components/magic-words/smart-word";

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

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const listItemVariant = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const listItemTransition = {
  y: spring,
  filter: spring,
  opacity: fade,
};

function Toggle({ label, open, onClick }: { label: string; open: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
    >
      <span>{label}</span>
      <motion.span
        animate={{ rotate: open ? 180 : 0 }}
        transition={spring}
        className="inline-block"
      >
        ↓
      </motion.span>
    </button>
  );
}

export default function HomeContent({ articles }: { articles: Article[] }) {
  const [open, setOpen] = useState<"writing" | "about" | null>(null);
  const writingOpen = open === "writing";
  const aboutOpen = open === "about";

  return (
    <div className="pt-20">
      {/* Title */}
      <section className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
          <motion.span className="block" initial="hidden" animate="visible" variants={lineVariant} transition={lineTransition(0.15)}>
            I spent my career making Messenger&apos;s message bubbles <SafeWord />,
          </motion.span>
          <motion.span className="block" initial="hidden" animate="visible" variants={lineVariant} transition={lineTransition(0.55)}>
            then <ExpressiveWord />.
          </motion.span>
          <motion.span className="block mt-6" initial="hidden" animate="visible" variants={lineVariant} transition={lineTransition(0.95)}>
            Now I&apos;m making them <SmartWord /><br />at Meta Superintelligence Labs.
          </motion.span>
        </h1>

        <motion.div
          className="prose"
          initial="hidden"
          animate="visible"
          variants={lineVariant}
          transition={lineTransition(1.3)}
        >
          <p>
            Flo, product designer focused on AI agents. Working hard to automate my design workflow so I can go surfing.
          </p>
        </motion.div>
      </section>

      {/* Toggles */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={lineVariant}
        transition={lineTransition(1.55)}
      >
        <div className="flex gap-6 mb-8">
          <Toggle label="About" open={aboutOpen} onClick={() => setOpen((v) => v === "about" ? null : "about")} />
          <Toggle label="Writing" open={writingOpen} onClick={() => setOpen((v) => v === "writing" ? null : "writing")} />
        </div>

        {/* About panel */}
        <AnimatePresence>
          {aboutOpen && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={spring}
              className="mb-8 space-y-5"
            >
              {messages.map((message, index) => {
                const prevMessage = messages[index - 1];
                const isNewGroup = !prevMessage || prevMessage.sender !== message.sender;
                const isFlo = message.sender === "flo";

                return (
                  <div
                    key={message.id}
                    className={`flex gap-6 items-baseline${isNewGroup && index !== 0 ? " mt-8" : ""}`}
                  >
                    <span className="text-xs text-gray-400 uppercase tracking-widest w-8 shrink-0 pt-px">
                      {isNewGroup ? (isFlo ? "Flo" : "Mum") : ""}
                    </span>
                    <p className="text-base md:text-lg text-gray-800 leading-relaxed">
                      {message.text}
                    </p>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Writing panel */}
        <AnimatePresence>
          {writingOpen && (
            <motion.div
              key="writing"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={listVariants}
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
                      variants={listItemVariant}
                      transition={listItemTransition}
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
