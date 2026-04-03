"use client";

import { useState, useCallback } from "react";

interface KeyProps {
  label: string;
  width?: number;
  alignLabel?: "center" | "bottom-left";
  onTrigger?: () => void;
}

function Key({ label, width = 56, alignLabel = "center", onTrigger }: KeyProps) {
  const [pressed, setPressed] = useState(false);

  const handlePointerDown = useCallback(() => setPressed(true), []);
  const handlePointerUp = useCallback(() => {
    setPressed(false);
    onTrigger?.();
  }, [onTrigger]);
  const handlePointerLeave = useCallback(() => setPressed(false), []);

  return (
    <button
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      className="relative flex items-center justify-center cursor-pointer select-none"
      style={{
        width,
        height: 50,
        borderRadius: 8.5,
        background: "white",
        border: pressed ? "none" : "0.2px solid #dcdcdc",
        boxShadow: pressed
          ? "inset 0px 1px 1px rgba(0,0,0,0.25)"
          : "0px 1px 1px rgba(0,0,0,0.25)",
        transitionProperty: "box-shadow, border",
        transitionDuration: "150ms",
        transitionTimingFunction: "ease-out",
      }}
    >
      {/* Realistic key overlays */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ borderRadius: 8.5 }}
      >
        <div
          className="absolute inset-0"
          style={{ borderRadius: 8.5, background: "rgba(255,255,255,0.3)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            borderRadius: 8.5,
            background: "#333",
            mixBlendMode: "plus-lighter",
          }}
        />
      </div>

      <span
        className="relative z-10"
        style={{
          fontFamily:
            alignLabel === "center"
              ? '-apple-system, "SF Pro", system-ui, sans-serif'
              : "var(--font-geist-var), sans-serif",
          fontSize: alignLabel === "center" ? 13.5 : 11.5,
          fontWeight: 400,
          color: "rgba(0,0,0,0.6)",
          letterSpacing: alignLabel === "center" ? -0.4 : 0,
          position: alignLabel === "bottom-left" ? "absolute" : "relative",
          bottom: alignLabel === "bottom-left" ? 8 : undefined,
          left: alignLabel === "bottom-left" ? 12 : undefined,
        }}
      >
        {label}
      </span>
    </button>
  );
}

interface ArrowKeysProps {
  onLeft?: () => void;
  onRight?: () => void;
}

export function ArrowKeys({ onLeft, onRight }: ArrowKeysProps) {
  return (
    <div className="flex gap-[6px]">
      <Key label="←" width={56} onTrigger={onLeft} />
      <Key label="→" width={56} onTrigger={onRight} />
    </div>
  );
}

interface EscKeyProps {
  onEsc?: () => void;
}

export function EscKey({ onEsc }: EscKeyProps) {
  return <Key label="esc" width={76} alignLabel="bottom-left" onTrigger={onEsc} />;
}
