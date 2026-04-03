"use client";

import { ArrowKeys, EscKey } from "./keyboard-key";

interface BottomGradientProps {
  variant: "arrows" | "esc";
  onLeft?: () => void;
  onRight?: () => void;
  onEsc?: () => void;
}

export default function BottomGradient({
  variant,
  onLeft,
  onRight,
  onEsc,
}: BottomGradientProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      {/* Gradient */}
      <div
        style={{
          height: 209,
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.64), white)",
        }}
      />

      {/* Keys */}
      <div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-auto"
        style={{ bottom: 80 }}
      >
        {variant === "arrows" ? (
          <ArrowKeys onLeft={onLeft} onRight={onRight} />
        ) : (
          <EscKey onEsc={onEsc} />
        )}
      </div>
    </div>
  );
}
