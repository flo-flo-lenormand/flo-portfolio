"use client";

import { chatBlocks, type ChatBlock } from "@/lib/chat-data";

function MumBubble({
  text,
  position,
}: {
  text: string;
  position: "single" | "top" | "bottom";
}) {
  // Single bubble: all 18px
  // Top of stack: bottom-left 4px
  // Bottom of stack: top-left 4px
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
          style={{ fontSize: 16, lineHeight: "normal" }}
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
        width: 550,
        backgroundImage: "url(/background-panel-mum.png)",
        backgroundSize: "cover",
        backgroundPosition: "right center",
      }}
    >
      {/* Close button */}
      <div className="flex justify-end p-4" style={{ paddingRight: 140 }}>
        <button
          onClick={onClose}
          className="cursor-pointer"
        >
          <img src="/close-mum.png" alt="Close" style={{ width: 24, height: 24 }} />
        </button>
      </div>

      {/* Conversation - scrollable */}
      <div
        className="flex-1 overflow-y-auto px-8"
        style={{ scrollbarWidth: "none", paddingTop: "30vh", paddingBottom: "30vh" }}
      >
        <div className="flex flex-col" style={{ gap: 90, maxWidth: 354 }}>
          {chatBlocks.map((block: ChatBlock, blockIndex: number) => (
            <div
              key={blockIndex}
              className="flex flex-col"
              style={{ gap: 20 }}
            >
              <MumBubbleGroup
                messages={block.mum}
                showLabel={blockIndex === 0}
              />
              {block.flo && <FloAnswer paragraphs={block.flo} />}
            </div>
          ))}
        </div>
      </div>

      {/* Top fade gradient - only covers content area, not close button or paper edge */}
      <div
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          height: 300,
          width: "70%",
          background: "linear-gradient(to bottom, white 20%, transparent 100%)",
        }}
      />

      {/* Bottom fade gradient - only covers content area, not paper edge */}
      <div
        className="absolute bottom-0 left-0 pointer-events-none"
        style={{
          height: 300,
          width: "70%",
          background: "linear-gradient(to top, white 20%, transparent 100%)",
        }}
      />
    </div>
  );
}
