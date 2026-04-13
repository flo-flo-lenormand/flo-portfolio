"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import HomeView from "@/components/views/home-view";
import StoryView from "@/components/views/story-view";
import WritingView from "@/components/views/writing-view";

export default function PortfolioShell() {
  const [activeAct, setActiveAct] = useState(0);
  const [, forceRender] = useState(0);
  const isAnimating = useRef(false);
  const lastWheelTime = useRef(0);

  // Fix bfcache
  useEffect(() => {
    function handlePageShow(e: PageTransitionEvent) {
      if (e.persisted) {
        forceRender((n) => n + 1);
      }
    }
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  // Navigate between acts based on scroll direction
  const navigate = useCallback((direction: "up" | "down") => {
    if (isAnimating.current) return;

    setActiveAct((current) => {
      const next = direction === "down"
        ? Math.min(current + 1, 2)
        : Math.max(current - 1, 0);

      if (next !== current) {
        isAnimating.current = true;
        // Allow next navigation after animation completes
        setTimeout(() => { isAnimating.current = false; }, 700);
      }
      return next;
    });
  }, []);

  // Handle wheel/scroll events
  useEffect(() => {
    function handleWheel(e: WheelEvent) {
      e.preventDefault();

      // Debounce rapid wheel events (trackpad momentum)
      const now = Date.now();
      if (now - lastWheelTime.current < 100) return;
      lastWheelTime.current = now;

      // Need a minimum delta to trigger navigation
      if (Math.abs(e.deltaY) < 30) return;

      navigate(e.deltaY > 0 ? "down" : "up");
    }

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [navigate]);

  // Handle keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        navigate("down");
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        navigate("up");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  // Handle touch swipe
  useEffect(() => {
    let touchStartY = 0;

    function handleTouchStart(e: TouchEvent) {
      touchStartY = e.touches[0].clientY;
    }

    function handleTouchEnd(e: TouchEvent) {
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) < 50) return; // minimum swipe distance
      navigate(deltaY > 0 ? "down" : "up");
    }

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center px-6 overflow-hidden">
      <div style={{ width: 460 }}>
        <AnimatePresence mode="wait">
          {activeAct === 0 && (
            <motion.div
              key="act1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0, 0, 1] }}
            >
              <HomeView />
            </motion.div>
          )}
          {activeAct === 1 && (
            <motion.div
              key="act2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0, 0, 1] }}
            >
              <StoryView />
            </motion.div>
          )}
          {activeAct === 2 && (
            <motion.div
              key="act3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0, 0, 1] }}
            >
              <WritingView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
