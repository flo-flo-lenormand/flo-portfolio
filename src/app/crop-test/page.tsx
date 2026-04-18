"use client";

// Visual comparison page for shelled-video crop values. Renders the same
// video inside 8 different (crop × cropOrigin) combinations so the right
// one can be picked by eye. Not linked from the main site — visit
// directly at /crop-test.

import { useRef, useEffect } from "react";

// Mirror of the shell constants in home-view.tsx (intentionally duplicated
// so this page stays self-contained).
const SHELL_SRC = "/phoneshell.png";
const SHELL_ASPECT = 2796 / 1419;
const SHELL_SCREEN_LEFT = 0.08457;
const SHELL_SCREEN_TOP = 0.09442;
const SHELL_SCREEN_WIDTH = 0.83087;
const SHELL_SCREEN_HEIGHT = 0.86266;

function ShelledVideo({
  src,
  width,
  crop,
  cropOrigin,
}: {
  src: string;
  width: number;
  crop: number;
  cropOrigin: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);
  return (
    <div
      style={{
        width,
        height: width * SHELL_ASPECT,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: `${SHELL_SCREEN_LEFT * 100}%`,
          top: `${SHELL_SCREEN_TOP * 100}%`,
          width: `${SHELL_SCREEN_WIDTH * 100}%`,
          height: `${SHELL_SCREEN_HEIGHT * 100}%`,
          overflow: "hidden",
          borderRadius: width * 0.065,
          backgroundColor: "#000",
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
            objectFit: "cover",
            transform: `scale(${crop})`,
            transformOrigin: cropOrigin,
            display: "block",
          }}
        />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
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
    </div>
  );
}

const TEST_SOURCES = [
  "/mediapicker3.mp4",
  "/reactions.mp4",
  "/messenger-screens/exploration01.mp4",
];

// Crop values × origins to compare.
const CONFIGS: { crop: number; cropOrigin: string; label: string }[] = [
  { crop: 1.12, cropOrigin: "center", label: "A · 1.12 · center" },
  { crop: 1.17, cropOrigin: "center", label: "B · 1.17 · center" },
  { crop: 1.22, cropOrigin: "center", label: "C · 1.22 · center" },
  { crop: 1.28, cropOrigin: "center", label: "D · 1.28 · center" },
  { crop: 1.12, cropOrigin: "50% 100%", label: "E · 1.12 · bottom" },
  { crop: 1.17, cropOrigin: "50% 100%", label: "F · 1.17 · bottom" },
  { crop: 1.22, cropOrigin: "50% 100%", label: "G · 1.22 · bottom" },
  { crop: 1.28, cropOrigin: "50% 100%", label: "H · 1.28 · bottom" },
];

export default function CropTest() {
  return (
    <div
      style={{
        padding: 24,
        minHeight: "100vh",
        backgroundColor: "#fafafa",
        fontFamily: "var(--font-geist-var), system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 860, marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
          Shelled video crop test
        </h1>
        <p style={{ color: "#525252", fontSize: 14, lineHeight: 1.5 }}>
          Same videos, eight (crop × origin) combinations. Labels are A–H.
          <br />
          <strong>center</strong> crops equally top & bottom.{" "}
          <strong>bottom</strong> anchors at the bottom so more of the top
          gets cropped (useful when source has a status bar / blank header).
          <br />
          Tell me which letter feels right and I&apos;ll pin those as the default.
        </p>
      </div>

      {TEST_SOURCES.map((src) => (
        <section key={src} style={{ marginBottom: 48 }}>
          <div
            style={{
              fontSize: 12,
              fontFamily: "monospace",
              color: "#737373",
              marginBottom: 12,
            }}
          >
            {src}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 24,
            }}
          >
            {CONFIGS.map((cfg) => (
              <div
                key={cfg.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <ShelledVideo
                  src={src}
                  width={200}
                  crop={cfg.crop}
                  cropOrigin={cfg.cropOrigin}
                />
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: 11,
                    color: "#404040",
                    textAlign: "center",
                  }}
                >
                  {cfg.label}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
