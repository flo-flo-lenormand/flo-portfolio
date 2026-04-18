"use client";

// Interactive shell-alignment tool. Drag sliders until the video's own
// baked-in device frame aligns perfectly with the shell's bezel.
// Live preview + copy-paste-ready output at the bottom.

import { useState, useRef, useEffect, useCallback } from "react";

const SHELL_SRC = "/phoneshell.png";
const SHELL_ASPECT = 2796 / 1419;

const SAMPLE_VIDEOS = [
  "/mediapicker3.mp4",
  "/reactions.mp4",
  "/videocontrols2.mp4",
  "/favorite.mp4",
  "/loading.mp4",
  "/messenger-screens/exploration01.mp4",
  "/messenger-screens/exploration02.mp4",
  "/messenger-screens/exploration03.mp4",
];

// Starting values = what home-view currently uses.
const INITIAL = {
  screenLeft: 8.457,
  screenTop: 9.442,
  screenWidth: 83.087,
  screenHeight: 86.266,
  crop: 1.22,
  originY: 50,
  radiusPct: 6.5,
};

export default function ShellAdjust() {
  const [src, setSrc] = useState(SAMPLE_VIDEOS[0]);
  const [v, setV] = useState(INITIAL);

  const [showShell, setShowShell] = useState(true);
  const [showOutline, setShowOutline] = useState(false);
  const [objectFit, setObjectFit] = useState<"cover" | "contain" | "fill">("cover");

  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, [src]);

  const reset = useCallback(() => setV(INITIAL), []);

  const width = 380;
  const height = width * SHELL_ASPECT;

  return (
    <div
      style={{
        padding: 24,
        fontFamily: "var(--font-geist-var), system-ui, sans-serif",
        minHeight: "100vh",
        background: "#fafafa",
        color: "#171717",
      }}
    >
      <div style={{ maxWidth: 860, marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
          Shell alignment tool
        </h1>
        <p style={{ fontSize: 14, color: "#525252", lineHeight: 1.5 }}>
          Drag sliders until the video&apos;s own device frame lines up with
          the shell&apos;s bezel. Toggle <strong>Show shell</strong> off to see
          the raw video position. Toggle <strong>Show outline</strong> to see
          the screen cutout rectangle.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 32,
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* Preview */}
        <div style={{ flexShrink: 0 }}>
          <div
            style={{
              width,
              height,
              position: "relative",
              background:
                "repeating-conic-gradient(#eee 0% 25%, #fff 0% 50%) 0 / 20px 20px",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: `${v.screenLeft}%`,
                top: `${v.screenTop}%`,
                width: `${v.screenWidth}%`,
                height: `${v.screenHeight}%`,
                overflow: "hidden",
                backgroundColor: "#000",
                borderRadius: `${v.radiusPct}%`,
                boxShadow: showOutline
                  ? "0 0 0 2px rgba(220, 38, 38, 0.85) inset, 0 0 0 2px rgba(220, 38, 38, 0.85)"
                  : undefined,
              }}
            >
              <video
                ref={videoRef}
                src={src}
                muted
                loop
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit,
                  transform: `scale(${v.crop})`,
                  transformOrigin: `50% ${v.originY}%`,
                  display: "block",
                }}
              />
            </div>
            {showShell && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={SHELL_SRC}
                alt=""
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "block",
                  pointerEvents: "none",
                }}
              />
            )}
          </div>
          <div style={{ fontSize: 11, color: "#737373", marginTop: 8, fontFamily: "monospace" }}>
            {width} × {Math.round(height)} px · shell aspect {SHELL_ASPECT.toFixed(4)}
          </div>
        </div>

        {/* Controls */}
        <div style={{ flex: 1, minWidth: 320, maxWidth: 440 }}>
          <Row>
            <label style={{ fontSize: 12, fontWeight: 500 }}>Video source</label>
            <select
              value={src}
              onChange={(e) => setSrc(e.target.value)}
              style={{
                width: "100%",
                padding: "6px 8px",
                fontSize: 12,
                fontFamily: "monospace",
                border: "1px solid #e5e5e5",
                borderRadius: 4,
              }}
            >
              {SAMPLE_VIDEOS.map((vv) => (
                <option key={vv} value={vv}>{vv}</option>
              ))}
            </select>
          </Row>

          <Section title="Screen cutout (% of shell)">
            <Slider
              label="Left"
              value={v.screenLeft}
              set={(n) => setV((s) => ({ ...s, screenLeft: n }))}
              min={0} max={20} step={0.05}
            />
            <Slider
              label="Top"
              value={v.screenTop}
              set={(n) => setV((s) => ({ ...s, screenTop: n }))}
              min={0} max={20} step={0.05}
            />
            <Slider
              label="Width"
              value={v.screenWidth}
              set={(n) => setV((s) => ({ ...s, screenWidth: n }))}
              min={60} max={100} step={0.05}
            />
            <Slider
              label="Height"
              value={v.screenHeight}
              set={(n) => setV((s) => ({ ...s, screenHeight: n }))}
              min={60} max={100} step={0.05}
            />
            <Slider
              label="Radius (% width)"
              value={v.radiusPct}
              set={(n) => setV((s) => ({ ...s, radiusPct: n }))}
              min={0} max={15} step={0.1}
            />
          </Section>

          <Section title="Video crop">
            <Slider
              label="Scale"
              value={v.crop}
              set={(n) => setV((s) => ({ ...s, crop: n }))}
              min={1} max={1.5} step={0.01}
            />
            <Slider
              label="Origin Y (0=top, 100=bottom)"
              value={v.originY}
              set={(n) => setV((s) => ({ ...s, originY: n }))}
              min={0} max={100} step={1}
            />
            <Row>
              <label style={{ fontSize: 12, fontWeight: 500 }}>object-fit</label>
              <div style={{ display: "flex", gap: 8 }}>
                {(["cover", "contain", "fill"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setObjectFit(f)}
                    style={{
                      padding: "4px 10px",
                      fontSize: 12,
                      fontFamily: "monospace",
                      border: "1px solid #e5e5e5",
                      borderRadius: 4,
                      background: objectFit === f ? "#171717" : "#fff",
                      color: objectFit === f ? "#fff" : "#171717",
                      cursor: "pointer",
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </Row>
          </Section>

          <Section title="Debug">
            <Row inline>
              <label style={{ fontSize: 12 }}>
                <input
                  type="checkbox"
                  checked={showShell}
                  onChange={(e) => setShowShell(e.target.checked)}
                  style={{ marginRight: 6 }}
                />
                Show shell overlay
              </label>
            </Row>
            <Row inline>
              <label style={{ fontSize: 12 }}>
                <input
                  type="checkbox"
                  checked={showOutline}
                  onChange={(e) => setShowOutline(e.target.checked)}
                  style={{ marginRight: 6 }}
                />
                Show cutout outline (red)
              </label>
            </Row>
            <button
              type="button"
              onClick={reset}
              style={{
                padding: "6px 12px",
                fontSize: 12,
                border: "1px solid #d4d4d4",
                borderRadius: 4,
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Reset to current defaults
            </button>
          </Section>

          <Section title="Copy-paste into home-view.tsx">
            <pre
              style={{
                fontSize: 11,
                fontFamily: "monospace",
                background: "#fff",
                border: "1px solid #e5e5e5",
                padding: 10,
                borderRadius: 4,
                whiteSpace: "pre-wrap",
                lineHeight: 1.5,
                color: "#171717",
              }}
            >{`const SHELL_SCREEN_LEFT = ${(v.screenLeft / 100).toFixed(5)};
const SHELL_SCREEN_TOP = ${(v.screenTop / 100).toFixed(5)};
const SHELL_SCREEN_WIDTH = ${(v.screenWidth / 100).toFixed(5)};
const SHELL_SCREEN_HEIGHT = ${(v.screenHeight / 100).toFixed(5)};

// In MediaElement render:
//   borderRadius: \`\${width * ${(v.radiusPct / 100).toFixed(4)}}px\`,
// Default shelled-video crop:
//   crop ?? ${v.crop.toFixed(2)}
//   cropOrigin ?? "50% ${v.originY}%"`}</pre>
          </Section>
        </div>
      </div>

      <div
        style={{
          marginTop: 32,
          padding: 12,
          background: "#fffbeb",
          border: "1px solid #fde68a",
          borderRadius: 6,
          fontSize: 12,
          color: "#78350f",
          maxWidth: 860,
          lineHeight: 1.5,
        }}
      >
        <strong>How to use this tool</strong>
        <br />
        1. Pick a video and turn off <em>Show shell overlay</em>. You&apos;ll see
        the raw video inside the cutout rectangle.
        <br />
        2. Adjust the cutout (Left/Top/Width/Height) until the rectangle exactly
        covers the video&apos;s own screen area (not its device frame).
        <br />
        3. Turn <em>Show shell overlay</em> back on. If the video&apos;s own
        bezel is still peeking through, bump <em>Scale</em> slightly or tune
        <em> Origin Y</em> (lower = crop from top, higher = crop from bottom).
        <br />
        4. Paste the values at the bottom into me and I&apos;ll wire them in.
      </div>
    </div>
  );
}

// ---- sub-components ----

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          color: "#737373",
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function Row({ children, inline }: { children: React.ReactNode; inline?: boolean }) {
  return (
    <div
      style={{
        marginBottom: 10,
        display: inline ? "block" : "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      {children}
    </div>
  );
}

function Slider({
  label,
  value,
  set,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  set: (n: number) => void;
  min: number;
  max: number;
  step: number;
}) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
        <span>{label}</span>
        <span style={{ fontFamily: "monospace", color: "#525252" }}>{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => set(parseFloat(e.target.value))}
        style={{ width: "100%" }}
      />
    </div>
  );
}
