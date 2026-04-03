"use client";

import { useState } from "react";
import SafeWord from "@/components/magic-words/safe-word";
import ExpressiveWord from "@/components/magic-words/expressive-word";
import SmartWord from "@/components/magic-words/smart-word";

interface HomeViewProps {
  onMumClick: () => void;
  onWriteClick: () => void;
  onBackgroundClick: () => void;
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

  return (
    <span
      className="relative inline-block cursor-default overflow-visible"
      style={{ width: logoSize, height: logoSize, verticalAlign: "middle", position: "relative", top: logoTop }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={logoSrc}
        alt={logoAlt}
        width={logoSize}
        height={logoSize}
        className="inline-block"
        style={{ verticalAlign: "middle" }}
      />
      {/* Handwritten label on hover */}
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
}

export default function HomeView({ onMumClick, onWriteClick, onBackgroundClick }: HomeViewProps) {
  return (
    <div className="flex items-center justify-center min-h-screen px-6" onClick={onBackgroundClick}>
      <div className="flex flex-col gap-[28px]" style={{ width: 460 }}>
        <p className="text-[22px] font-medium leading-normal text-black">
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
          />{" "}
          Now I&apos;m making them{" "}
          <SmartWord /> designing AI agents at{" "}
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
        </p>

        <p className="text-[22px] font-medium leading-normal text-black">
          <span
            onClick={(e) => { e.stopPropagation(); onMumClick(); }}
            className="cursor-pointer relative inline-block overflow-visible"
          >
            {/* Stabilo highlight behind text */}
            <img
              src="/stabilo.png"
              alt=""
              className="pointer-events-none"
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(calc(-50% - 2px), -50%) scale(1.2)",
                width: "calc(100% + 16px)",
                height: "auto",
              }}
            />
            <span className="relative">My mum</span>
          </span>{" "}
          says I design message bubbles and honestly she&apos;s not wrong
        </p>

        <p className="text-[22px] font-medium leading-normal text-black">
          <span
            onClick={(e) => { e.stopPropagation(); onWriteClick(); }}
            className="cursor-pointer inline-block"
          >
            <img
              src="/i-write.png"
              alt="I write"
              style={{ height: 28, display: "inline-block", verticalAlign: "baseline", position: "relative", top: 5 }}
            />
          </span>{" "}
          about design on flat days
        </p>
      </div>
    </div>
  );
}
