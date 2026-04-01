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
      // Full word shown — jump straight to first char of next word, no empty frame
      const timer = setTimeout(() => {
        const nextIndex = (wordIndex + 1) % WORDS.length;
        setWordIndex(nextIndex);
        setDisplayed(WORDS[nextIndex][0]);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [active, displayed, wordIndex]);

  return (
    <span
      className="inline-block cursor-default"
      style={{ color: "inherit" }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onClick={() => setActive((v) => !v)}
    >
      {active ? displayed || "smart" : "smart"}
    </span>
  );
}
