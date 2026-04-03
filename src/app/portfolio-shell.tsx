"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import HomeView from "@/components/views/home-view";
import MumPanel from "@/components/panels/mum-panel";
import ArticlesPanel from "@/components/panels/articles-panel";

type Panel = "mum" | "articles" | null;

interface Article {
  slug: string;
  title: string;
  date: string;
  description?: string;
  external?: string;
}

export default function PortfolioShell({
  articles,
}: {
  articles: Article[];
}) {
  const [openPanel, setOpenPanel] = useState<Panel>(null);
  const [, forceRender] = useState(0);

  // Fix bfcache: when browser restores page via back/forward, force re-render
  // to re-attach React event handlers
  useEffect(() => {
    function handlePageShow(e: PageTransitionEvent) {
      if (e.persisted) {
        forceRender((n) => n + 1);
      }
    }
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const togglePanel = useCallback(
    (panel: "mum" | "articles") => {
      setOpenPanel((current) => (current === panel ? null : panel));
    },
    []
  );

  const closePanel = useCallback(() => {
    setOpenPanel(null);
  }, []);

  return (
    <div className="relative h-full">
      {/* Home text - always visible */}
      <HomeView
        onMumClick={() => togglePanel("mum")}
        onWriteClick={() => togglePanel("articles")}
        onBackgroundClick={closePanel}
      />

      {/* Left panel: Mum conversation */}
      <AnimatePresence initial={false} mode="wait">
        {openPanel === "mum" && (
          <motion.div
            key="mum-panel"
            className="fixed top-0 left-0 bottom-0 z-40"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{
              type: "spring",
              duration: 0.8,
              bounce: 0,
            }}
          >
            <MumPanel onClose={closePanel} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right panel: Articles */}
      <AnimatePresence initial={false} mode="wait">
        {openPanel === "articles" && (
          <motion.div
            key="articles-panel"
            className="fixed top-0 right-0 bottom-0 z-40"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              duration: 0.8,
              bounce: 0,
            }}
          >
            <ArticlesPanel articles={articles} onClose={closePanel} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
