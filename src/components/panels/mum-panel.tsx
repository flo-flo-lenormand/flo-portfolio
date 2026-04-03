"use client";

import { motion } from "motion/react";
import { chatBlocks, type ChatBlock } from "@/lib/chat-data";

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.35, delayChildren: 0.3 },
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

function MumBubble({
  text,
  position,
}: {
  text: string;
  position: "single" | "top" | "bottom";
}) {
  // border-radius: top-left top-right bottom-right bottom-left
  const radius =
    position === "top"
      ? "18px 18px 18px 4px"
      : position === "bottom"
      ? "4px 18px 18px 18px"
      : "18px";

  return (
    <div
      style={{
        background: "#f2f2f7",
        borderRadius: radius,
        padding: "7px 18px",
        maxWidth: 258,
        fontSize: 14,
        fontWeight: 400,
        lineHeight: "normal",
        color: "#080809",
        width: "fit-content",
      }}
    >
      {text}
    </div>
  );
}

function MumBubbleGroup({
  messages,
  showLabel,
}: {
  messages: string[];
  showLabel: boolean;
}) {
  return (
    <div className="flex flex-col" style={{ gap: messages.length > 1 ? 2 : 0 }}>
      {showLabel && (
        <div
          style={{
            fontSize: 12,
            fontWeight: 400,
            color: "rgba(0,0,0,0.42)",
            paddingLeft: 18,
            lineHeight: "22px",
          }}
        >
          Mum
        </div>
      )}
      {messages.map((text, i) => {
        const position =
          messages.length === 1
            ? "single"
            : i === 0
            ? "top"
            : "bottom";
        return <MumBubble key={i} text={text} position={position as "single" | "top" | "bottom"} />;
      })}
    </div>
  );
}

function FloAnswer({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="flex flex-col" style={{ gap: 28, width: "100%", paddingLeft: 18 }}>
      {paragraphs.map((text, i) => (
        <p
          key={i}
          className="font-normal text-black"
          style={{ fontSize: 16, lineHeight: "normal", textWrap: "pretty" }}
        >
          {text}
        </p>
      ))}
    </div>
  );
}

interface MumPanelProps {
  onClose: () => void;
}

export default function MumPanel({ onClose }: MumPanelProps) {
  return (
    <div
      className="h-full flex flex-col relative"
      style={{
        width: 510,
        backgroundImage: "url(/background-panel-mum.png)",
        backgroundSize: "cover",
        backgroundPosition: "right center",
      }}
    >
      {/* Close button */}
      <div className="flex justify-end p-4 relative z-10" style={{ paddingRight: 100 }}>
        <button
          onClick={onClose}
          className="cursor-pointer"
        >
          <img src="/close-mum.png" alt="Close" style={{ width: 24, height: 24 }} />
        </button>
      </div>

      {/* Conversation - snap scrollable */}
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
          className="flex flex-col"
          style={{ gap: 90, maxWidth: 354 }}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {chatBlocks.map((block: ChatBlock, blockIndex: number) => (
            <motion.div
              key={blockIndex}
              className="flex flex-col"
              style={{
                gap: 20,
                scrollSnapAlign: "start",
              }}
              variants={itemVariants}
              transition={itemTransition}
            >
              <MumBubbleGroup
                messages={block.mum}
                showLabel={blockIndex === 0}
              />
              {block.flo && <FloAnswer paragraphs={block.flo} />}
            </motion.div>
          ))}
        </motion.div>
      </div>

    </div>
  );
}
