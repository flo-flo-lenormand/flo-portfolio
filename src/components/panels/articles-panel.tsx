"use client";

import { motion } from "motion/react";

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.3, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const itemTransition = {
  y: { type: "spring" as const, duration: 0.4, bounce: 0 },
  filter: { type: "spring" as const, duration: 0.4, bounce: 0 },
  opacity: { duration: 0.6, ease: [0.25, 0, 0, 1] as [number, number, number, number] },
};

interface Article {
  slug: string;
  title: string;
  date: string;
  description?: string;
  external?: string;
}

interface ArticlesPanelProps {
  articles: Article[];
  onClose: () => void;
}

export default function ArticlesPanel({
  articles,
  onClose,
}: ArticlesPanelProps) {
  return (
    <div
      className="h-full flex flex-col relative"
      style={{
        width: 510,
        backgroundImage: "url(/background-panel-mum.png)",
        backgroundSize: "cover",
        backgroundPosition: "left center",
        transform: "scaleX(-1)",
      }}
    >
      {/* Inner wrapper flipped back so content reads normally */}
      <div className="h-full flex flex-col" style={{ transform: "scaleX(-1)" }}>
        {/* Close button - top left */}
        <div className="flex justify-start p-4 relative z-10" style={{ paddingLeft: 100 }}>
          <button
            onClick={onClose}
            className="cursor-pointer"
          >
            <img src="/close-article.png" alt="Close" style={{ width: 24, height: 24 }} />
          </button>
        </div>

        {/* Article list - snap scrollable */}
        <div
          className="flex-1 overflow-y-auto px-8"
          style={{
            scrollbarWidth: "none",
            scrollSnapType: "y proximity",
            scrollPaddingTop: "30vh",
            paddingTop: "30vh",
            paddingBottom: "30vh",
          }}
        >
          <motion.div
            className="flex flex-col gap-8 ml-auto"
            style={{ maxWidth: 354 }}
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {articles.map((article) => {
              const href = article.external || `/writing/${article.slug}`;
              const isExternal = !!article.external;

              return (
                <motion.a
                  key={article.slug}
                  href={href}
                  {...(isExternal
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="block group"
                  style={{
                    scrollSnapAlign: "start",
                  }}
                  variants={itemVariants}
                  transition={itemTransition}
                >
                  <h3
                    className="font-medium text-black leading-snug"
                    style={{ fontSize: 18, textWrap: "balance" }}
                  >
                    {article.title}
                    {isExternal && (
                      <span className="text-black/30 text-sm ml-1">↗</span>
                    )}
                  </h3>
                  {article.description && (
                    <p
                      className="text-black/50 mt-1 leading-relaxed overflow-hidden"
                      style={{
                        fontSize: 14,
                        textWrap: "pretty",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical" as const,
                      }}
                    >
                      {article.description}
                    </p>
                  )}
                </motion.a>
              );
            })}
          </motion.div>
        </div>

      </div>
    </div>
  );
}
