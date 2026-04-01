"use client";

import { useState, useEffect } from "react";

const WORDS = [
  "thinking",
  "computing",
  "surfing",
  "hallucinating",
  "floing",
  "napping",
  "procrastinating",
  "forgetting",
  "remembering",
];

export default function SmartWord() {
  const [active, setActive] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!active) {
      setDisplayed("");
      setWordIndex(0);
      return;
    }

    const word = WORDS[wordIndex];
    const full = word + "...";

    if (displayed.length < full.length) {
      const isTypingDots = displayed.length >= word.length;
      const delay = isTypingDots ? 220 : 45;
      const timer = setTimeout(() => {
        setDisplayed(full.slice(0, displayed.length + 1));
      }, delay);
      return () => clearTimeout(timer);
    } else {
      // Full word shown — pause then move to next
      const timer = setTimeout(() => {
        setDisplayed("");
        setWordIndex((i) => (i + 1) % WORDS.length);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [active, displayed, wordIndex]);

  return (
    <span
      className="inline-block cursor-default"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onClick={() => setActive((v) => !v)}
    >
      {active ? displayed : "smart"}
    </span>
  );
}
