"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import SafeWord from "@/components/magic-words/safe-word";
import ExpressiveWord from "@/components/magic-words/expressive-word";
import SmartWord from "@/components/magic-words/smart-word";

// All images that need to load before revealing content
const PRELOAD_IMAGES = [
  "/ig.png",
  "/messenger.png",
  "/metaai.png",
  "/instagram-written.png",
  "/messenger-written.png",
  "/msl-written.png",
];

function preloadImages(srcs: string[]): Promise<void[]> {
  return Promise.all(
    srcs.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = src;
        })
    )
  );
}

function LogoWithLabel({
  logoSrc,
  labelSrc,
  logoAlt,
  labelAlt,
  logoSize = 24,
  logoTop = -8,
  labelWidth = 90,
  labelOffset = { top: -40, left: -20 },
}: {
  logoSrc: string;
  labelSrc: string;
  logoAlt: string;
  labelAlt: string;
  logoSize?: number;
  logoTop?: number;
  labelWidth?: number;
  labelOffset?: { top: number; left: number };
}) {
  const [hovered, setHovered] = useState(false);

  const inner = (
    <span
      className="relative inline-block cursor-default overflow-visible"
      style={{ width: logoSize, height: logoSize, verticalAlign: "middle", position: "relative", top: logoTop }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        className="absolute"
        style={{
          top: -(40 - logoSize) / 2,
          left: -(40 - logoSize) / 2,
          width: 40,
          height: 40,
        }}
      />
      <img
        src={logoSrc}
        alt={logoAlt}
        width={logoSize}
        height={logoSize}
        className="inline-block"
        style={{ verticalAlign: "middle" }}
      />
      <img
        src={labelSrc}
        alt={labelAlt}
        className="pointer-events-none"
        style={{
          position: "absolute",
          width: labelWidth,
          minWidth: labelWidth,
          height: "auto",
          top: labelOffset.top,
          left: labelOffset.left,
          opacity: hovered ? 1 : 0,
          transitionProperty: "opacity",
          transitionDuration: "200ms",
          transitionTimingFunction: "cubic-bezier(0.2, 0, 0, 1)",
        }}
      />
    </span>
  );

  return inner;
}

// Re-export LogoWithLabel for use in story-view
export { LogoWithLabel };

const itemVariants = {
  hidden: { opacity: 0, filter: "blur(4px)" },
  visible: { opacity: 1, filter: "blur(0px)" },
};

const itemTransition = {
  filter: { type: "spring" as const, duration: 0.4, bounce: 0 },
  opacity: { duration: 0.7, ease: [0.25, 0, 0, 1] as [number, number, number, number] },
};

export default function HomeView() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    preloadImages(PRELOAD_IMAGES).then(() => {
      setReady(true);
    });
  }, []);

  if (!ready) return null;

  return (
    <motion.p
      className="text-[22px] font-medium leading-normal text-black"
      style={{ width: 460 }}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={itemTransition}
    >
      I made conversations <SafeWord /> on{" "}
      <LogoWithLabel
        logoSrc="/ig.png"
        labelSrc="/instagram-written.png"
        logoAlt="Instagram"
        labelAlt="Instagram"
        logoSize={24}
        labelWidth={108}
        labelOffset={{ top: -48, left: 7 }}

      />
      <br />
      Then <ExpressiveWord /> on{" "}
      <LogoWithLabel
        logoSrc="/messenger.png"
        labelSrc="/messenger-written.png"
        logoAlt="Messenger"
        labelAlt="Messenger"
        logoSize={24}
        labelWidth={108}
        labelOffset={{ top: -86, left: -40 }}

      />
      <br />
      Now I&apos;m making them{" "}
      <SmartWord /> on{" "}
      <LogoWithLabel
        logoSrc="/metaai.png"
        labelSrc="/msl-written.png"
        logoAlt="Meta Superintelligence Labs"
        labelAlt="MSL (Meta Superintelligence Labs)"
        logoSize={28}
        logoTop={-6}
        labelWidth={202}
        labelOffset={{ top: 2, left: 32 }}

      />
    </motion.p>
  );
}
