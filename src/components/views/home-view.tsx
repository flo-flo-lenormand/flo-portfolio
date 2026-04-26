"use client";

import { useState, useEffect, useRef, useCallback, useImperativeHandle, useMemo, useSyncExternalStore, forwardRef } from "react";
import { AnimatePresence, animate, motion, useMotionValue } from "motion/react";
import { createPortal } from "react-dom";
import Matter from "matter-js";
import SafeWord from "@/components/magic-words/safe-word";
import ExpressiveWord from "@/components/magic-words/expressive-word";
import SmartWord from "@/components/magic-words/smart-word";
import { sfx } from "@/lib/sfx";
import { useReducedMotion } from "@/lib/use-reduced-motion";

// Subtle haptic nudge on touch devices. No-ops on desktop.
function tinyHaptic(ms: number) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try { navigator.vibrate(ms); } catch { /* ignore */ }
  }
}

// ---------------------------------------------------------------------------
// Preload
// ---------------------------------------------------------------------------
const PRELOAD_IMAGES = [
  "/ig.png",
  "/messenger.png",
  "/metaai.png",
  "/instagram-written.png",
  "/messenger-written.png",
  "/msl-written.png",
  "/phoneshell.png", // composited on top of shelled videos — load up-front
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

// ---------------------------------------------------------------------------
// LogoWithLabel
// ---------------------------------------------------------------------------
function LogoWithLabel({
  logoSrc,
  labelSrc,
  logoAlt,
  labelAlt,
  logoSize = 24,
  logoTop = -8,
  labelWidth = 90,
  labelOffset = { top: -40, left: -20 },
  onClick,
  expanded,
  logoRef,
  interactive,
}: {
  logoSrc: string;
  labelSrc: string;
  logoAlt: string;
  labelAlt: string;
  logoSize?: number;
  logoTop?: number;
  labelWidth?: number;
  labelOffset?: { top: number; left: number };
  onClick?: () => void;
  expanded?: boolean;
  logoRef?: React.RefObject<HTMLSpanElement | null>;
  interactive?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  // Only show the written label on devices that actually hover. Touch
  // taps synthesize a brief mouseenter that would flash the label in,
  // which reads as noise on mobile.
  const canHover = useSyncExternalStore(
    (fn) => {
      if (typeof window === "undefined" || !window.matchMedia) return () => {};
      const mq = window.matchMedia("(hover: hover)");
      mq.addEventListener("change", fn);
      return () => mq.removeEventListener("change", fn);
    },
    () => (typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(hover: hover)").matches
      : true),
    () => true
  );
  const clickable = !!(onClick || interactive);

  return (
    <span
      ref={logoRef}
      className={`relative inline-block overflow-visible ${clickable ? "cursor-pointer" : "cursor-default"}`}
      style={{
        width: logoSize,
        height: logoSize,
        verticalAlign: "middle",
        position: "relative",
        top: logoTop,
        touchAction: interactive ? "none" : undefined,
        zIndex: interactive ? 60 : undefined,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
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
        style={{ verticalAlign: "middle", pointerEvents: "none", userSelect: "none" }}
        draggable={false}
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
          opacity: canHover && hovered && !expanded ? 1 : 0,
          transitionProperty: "opacity",
          transitionDuration: "200ms",
          transitionTimingFunction: "cubic-bezier(0.2, 0, 0, 1)",
        }}
      />
    </span>
  );
}

export { LogoWithLabel };

// ---------------------------------------------------------------------------
// Media data — the pool the logo spits out
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Media pools
// ---------------------------------------------------------------------------
type MediaItem = {
  src: string;
  id: string;
  type: "video" | "image";
  raw?: boolean;
  aspect?: number; // height / width, defaults to iPhone 9:19.5
  // Optional inner zoom (> 1) to crop away baked-in whitespace/halo around
  // the phone in a source asset. 1.00 = no change, 1.06 = 3% cropped on
  // each side. Only applied to non-raw items.
  crop?: number;
  // Where the crop "anchors" — CSS transform-origin value. Defaults to
  // "center" for most items; shelled videos default to "50% 100%" so that
  // any whitespace above the content gets cropped first.
  cropOrigin?: string;
  // When true, render the media inside the /phoneshell.png device frame.
  // The physics body is sized to the shell aspect (1.97), not the screen.
  shell?: boolean;
  // If set, single-click on a spawned phone opens this URL in a new tab
  // instead of opening the inspection panel.
  link?: string;
  // Optional size override (in px). Replaces the variant's width range
  // for this item — useful for content that needs extra space to read.
  widthRange?: [number, number];
  // Optional mobile-only width range. When set AND the viewport is below
  // MOBILE_BREAKPOINT, this is used instead of widthRange (and bypasses the
  // viewport scale factor). Lets content stay readable on small screens
  // without the pile dominating.
  mobileWidthRange?: [number, number];
  // Optional rounded-corner override (in px). Defaults to
  // max(18, width * 0.12) — tuned for iPhone-style screens. Article
  // cards or non-phone items can dial it down.
  cornerRadius?: number;
};

// Default aspect for items that don't specify one (iPhone 9:19.5 screen)
const PHONE_ASPECT = 19.5 / 9;

// Phone-shell (device frame) geometry, measured from /phoneshell.png
// (1419 × 2796) alpha channel.
const SHELL_SRC = "/phoneshell.png";
const SHELL_ASPECT = 2796 / 1419; // h / w, ≈ 1.9704
const SHELL_SCREEN_LEFT = 0.0845;
const SHELL_SCREEN_TOP = 0.0415;
const SHELL_SCREEN_WIDTH = 0.8315;
const SHELL_SCREEN_HEIGHT = 0.9315;

const MESSENGER_MEDIA: MediaItem[] = [
  // Videos render inside /phoneshell.png so their baked-in white
  // backgrounds are hidden behind the device bezel.
  { src: "/mediapicker3.mp4", id: "picker", type: "video", shell: true },
  { src: "/reactions.mp4", id: "reactions", type: "video", shell: true },
  { src: "/videocontrols2.mp4", id: "controls", type: "video", shell: true },
  { src: "/favorite.mp4", id: "favorite", type: "video", shell: true },
  { src: "/loading.mp4", id: "loading", type: "video", shell: true },
  { src: "/messenger-screens/exploration01.mp4", id: "explore1", type: "video", shell: true },
  { src: "/messenger-screens/exploration02.mp4", id: "explore2", type: "video", shell: true },
  { src: "/messenger-screens/exploration03.mp4", id: "explore3", type: "video", shell: true },
  // PNGs already look clean — leave them edge-to-edge. Their natural
  // aspect is 2.044 (1350x2760 / 1284x2624), slightly shorter than the
  // iPhone-screen default, so we pin it explicitly.
  { src: "/messenger-screens/03.png", id: "screen03", type: "image", aspect: 2760 / 1350 },
  { src: "/messenger-screens/04.png", id: "screen04", type: "image", aspect: 2760 / 1350 },
  { src: "/messenger-screens/In-thread.png", id: "inthread", type: "image", aspect: 2760 / 1350 },
  { src: "/messenger-screens/In-thread-1.png", id: "inthread1", type: "image", aspect: 2760 / 1350 },
  { src: "/messenger-screens/image 403.png", id: "img403", type: "image", aspect: 2760 / 1350 },
  { src: "/messenger-screens/image 405.png", id: "img405", type: "image", aspect: 2760 / 1350 },
];

// MSL — confidential phone shell (transparent PNG with its own bezel).
// Actual image is 1536x2752 → aspect 1.792.
const MSL_MEDIA: MediaItem[] = [
  {
    src: "/confidential_phone.png",
    id: "confidential",
    type: "image",
    raw: true,
    aspect: 5504 / 3072,
  },
];

// Instagram — mix of published safety-work articles (linked screenshots)
// and static design mocks. The screenshots have a `link` that opens the
// published article; the mocks open the inspection panel on click. Order
// is randomized per spawn (see sandbox source config below) so users get
// a shuffled read of the work rather than a fixed rotation.
//
// Excludes: /safety-screens/01_SENDER-EXPERIENCE-MOCK-AND-FORWARDING-FRICTION.webp
const IG_WIDTH: [number, number] = [280, 360];
const IG_WIDTH_MOBILE: [number, number] = [140, 180];
const IG_CORNER = 8; // article-card rounding, not phone rounding
const INSTAGRAM_MEDIA: MediaItem[] = [
  // Published-article screenshots. Click opens the article.
  {
    src: "/safety-screens/Screenshot 2026-04-13 at 16.31.02.png",
    id: "sextortion",
    type: "image",
    aspect: 1744 / 1562,
    widthRange: IG_WIDTH,
    mobileWidthRange: IG_WIDTH_MOBILE,
    cornerRadius: IG_CORNER,
    link: "https://about.fb.com/news/2024/04/new-tools-to-help-protect-against-sextortion-and-intimate-image-abuse/",
  },
  {
    src: "/safety-screens/Screenshot 2026-04-13 at 16.31.29.png",
    id: "parental",
    type: "image",
    aspect: 1780 / 1552,
    widthRange: IG_WIDTH,
    mobileWidthRange: IG_WIDTH_MOBILE,
    cornerRadius: IG_CORNER,
    link: "https://about.fb.com/news/2023/06/parental-supervision-and-teen-time-management-on-metas-apps/",
  },
  {
    src: "/safety-screens/Screenshot 2026-04-13 at 16.32.02.png",
    id: "dm-limit",
    type: "image",
    aspect: 1862 / 1538,
    widthRange: IG_WIDTH,
    mobileWidthRange: IG_WIDTH_MOBILE,
    cornerRadius: IG_CORNER,
    link: "https://www.theverge.com/2023/8/3/23818552/instagram-dm-request-spam-limit",
  },
  {
    src: "/safety-screens/Screenshot 2026-04-13 at 16.32.29.png",
    id: "abuse",
    type: "image",
    aspect: 1916 / 1554,
    widthRange: IG_WIDTH,
    mobileWidthRange: IG_WIDTH_MOBILE,
    cornerRadius: IG_CORNER,
    link: "https://about.fb.com/news/2022/10/protecting-people-on-instagram-from-abuse/",
  },
  // Static design mocks — phone-shaped (2.044 aspect), no link → click
  // opens inspection. Using default variant sizing so they appear as
  // phones alongside the article cards.
  { src: "/safety-screens/image 409.png", id: "ig-mock-409", type: "image", aspect: 2624 / 1284 },
  { src: "/safety-screens/image 410.png", id: "ig-mock-410", type: "image", aspect: 2624 / 1284 },
  { src: "/safety-screens/image 411.png", id: "ig-mock-411", type: "image", aspect: 2624 / 1284 },
];

// Social cards — surprise guests that occasionally spawn from any logo
// instead of the logo's usual media pool. Small circular-ish icons with
// click-through links.
const SOCIAL_CORNER = 16; // iOS-app-icon corner rounding
const SOCIAL_WIDTH: [number, number] = [82, 112];
const SOCIAL_WIDTH_MOBILE: [number, number] = [58, 76];
const SOCIAL_MEDIA: MediaItem[] = [
  {
    src: "/x.png",
    id: "social-x",
    type: "image",
    aspect: 1,
    widthRange: SOCIAL_WIDTH,
    mobileWidthRange: SOCIAL_WIDTH_MOBILE,
    cornerRadius: SOCIAL_CORNER,
    link: "https://x.com/Flo_lenormand",
  },
  {
    src: "/github.png",
    id: "social-github",
    type: "image",
    aspect: 1,
    widthRange: SOCIAL_WIDTH,
    mobileWidthRange: SOCIAL_WIDTH_MOBILE,
    cornerRadius: SOCIAL_CORNER,
    link: "https://github.com/flo-flo-lenormand",
  },
  {
    src: "/linkedin.png",
    id: "social-linkedin",
    type: "image",
    aspect: 1,
    widthRange: SOCIAL_WIDTH,
    mobileWidthRange: SOCIAL_WIDTH_MOBILE,
    cornerRadius: SOCIAL_CORNER,
    link: "https://www.linkedin.com/in/florent-lenormand/",
  },
  {
    src: "/ig.png",
    id: "social-instagram",
    type: "image",
    aspect: 1,
    widthRange: SOCIAL_WIDTH,
    mobileWidthRange: SOCIAL_WIDTH_MOBILE,
    cornerRadius: SOCIAL_CORNER,
    link: "https://www.instagram.com/flo_lenormand",
  },
  {
    src: "/substack.png",
    id: "social-substack",
    type: "image",
    aspect: 1,
    widthRange: SOCIAL_WIDTH,
    mobileWidthRange: SOCIAL_WIDTH_MOBILE,
    cornerRadius: SOCIAL_CORNER,
    link: "https://flolenormand.substack.com/",
  },
];

// Fisher–Yates shuffle producing [0, n) in random order. Used by sources
// with randomOrder: true to distribute items without repeats per cycle.
function shuffleIndices(n: number): number[] {
  const out = Array.from({ length: n }, (_, i) => i);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const itemAspect = (item: MediaItem) => {
  if (item.shell) return SHELL_ASPECT;
  return item.aspect ?? PHONE_ASPECT;
};

// ---------------------------------------------------------------------------
// MediaElement — a phone-shaped card
// ---------------------------------------------------------------------------
function MediaElement({
  item,
  width,
  audible = false,
}: {
  item: MediaItem;
  width: number;
  audible?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (item.type === "video" && el) {
      el.muted = !audible;
      if (audible) {
        // Inspection: restart from the top so the user sees the whole flow.
        try { el.currentTime = 0; } catch { /* ignore */ }
      }
      el.play().catch(() => {});
    }
    return () => {
      if (el) el.pause();
    };
  }, [item.type, audible]);

  const height = width * itemAspect(item);

  // Raw mode — transparent PNG that already includes its own phone bezel.
  // Render the image straight through, no clipping container, no dark fill.
  if (item.raw) {
    return (
      <img
        src={item.src}
        alt=""
        className="pointer-events-none select-none"
        draggable={false}
        style={{
          width,
          height,
          display: "block",
        }}
      />
    );
  }

  // Inner zoom to crop away source whitespace/halo. 1 = no change.
  // Shelled videos usually have a baked-in device frame in the recording,
  // so they need an aggressive default crop to hide that inner shell and
  // show just the screen content inside our shell's screen cutout.
  const crop = item.crop ?? (item.shell && item.type === "video" ? 1.04 : 1);
  // Shelled videos anchor the crop toward the bottom (69%) so the crop
  // trims more off the top than the bottom — matches the position where
  // the baked-in video status bar sits. Individual items can override.
  const cropOrigin =
    item.cropOrigin ??
    (item.shell && item.type === "video" ? "50% 69%" : "center");
  const innerStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transform: crop !== 1 ? `scale(${crop})` : undefined,
    transformOrigin: cropOrigin,
  };
  const media =
    item.type === "image" ? (
      <img
        src={item.src}
        alt=""
        className="pointer-events-none select-none"
        draggable={false}
        style={innerStyle}
      />
    ) : (
      <video
        ref={ref}
        src={item.src}
        muted={!audible}
        loop
        playsInline
        className="pointer-events-none select-none"
        style={innerStyle}
      />
    );

  // Shelled mode — media is cropped into the device-frame's screen cutout,
  // with the shell PNG layered on top so the bezel and Dynamic Island are
  // preserved. Kills any white halo in the source by hiding it behind the
  // bezel.
  if (item.shell) {
    return (
      <div
        className="pointer-events-none select-none"
        style={{ width, height, position: "relative" }}
      >
        <div
          style={{
            position: "absolute",
            left: `${SHELL_SCREEN_LEFT * 100}%`,
            top: `${SHELL_SCREEN_TOP * 100}%`,
            width: `${SHELL_SCREEN_WIDTH * 100}%`,
            height: `${SHELL_SCREEN_HEIGHT * 100}%`,
            overflow: "hidden",
            backgroundColor: "#000",
            // The screen area in the real iPhone is rounded; inline a
            // subtle rounding so the media doesn't poke out at corners.
            borderRadius: `${width * 0.076}px`,
          }}
        >
          {media}
        </div>
        <img
          src={SHELL_SRC}
          alt=""
          draggable={false}
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

  const corner = item.cornerRadius ?? Math.max(18, width * 0.12);
  return (
    <div
      className="pointer-events-none select-none"
      style={{
        width,
        height,
        borderRadius: corner,
        overflow: "hidden",
      }}
    >
      {media}
    </div>
  );
}

// ---------------------------------------------------------------------------
// PhoneSandbox
// One shared matter-js engine hosting phones from multiple sources (Messenger,
// MSL, …). All items live in the same world so they collide with each other
// regardless of which logo spawned them.
// ---------------------------------------------------------------------------
// Responsive caps — narrow viewports get fewer, smaller phones so the
// pile never dominates the text.
const MOBILE_BREAKPOINT = 640; // px — below this we scale down aggressively
function getViewportScale() {
  if (typeof window === "undefined") return 1;
  const w = window.innerWidth;
  if (w >= MOBILE_BREAKPOINT) return 1;
  if (w >= 420) return 0.78;
  return 0.48; // tighter on real phone viewports so the pile has room
}
function getItemCap() {
  if (typeof window === "undefined") return 60;
  return window.innerWidth >= MOBILE_BREAKPOINT ? 60 : 14;
}
// Mobile gets gentler impulses so phones don't traverse the whole viewport
// in a single spawn — it's a cramped canvas down there.
function getMobileImpulseScale() {
  if (typeof window === "undefined") return 1;
  return window.innerWidth < MOBILE_BREAKPOINT ? 0.75 : 1;
}

// Phone variants — different mass/size/bounciness so the pile develops rhythm.
type Variant = "light" | "standard" | "heavy";
type VariantProfile = {
  widthMin: number;
  widthMax: number;
  density: number;
  restitution: number;
  friction: number;
  frictionAir: number;
  // Sound pitch in [0,1]; higher = brighter.
  popPitch: number;
  thudPitch: number;
};
const VARIANTS: Record<Variant, VariantProfile> = {
  light: {
    widthMin: 120, widthMax: 150,
    density: 0.0018, restitution: 0.55,
    friction: 0.06, frictionAir: 0.015,
    popPitch: 0.80, thudPitch: 0.70,
  },
  standard: {
    widthMin: 150, widthMax: 200,
    density: 0.0026, restitution: 0.48,
    friction: 0.08, frictionAir: 0.014,
    popPitch: 0.50, thudPitch: 0.50,
  },
  heavy: {
    widthMin: 180, widthMax: 220,
    density: 0.0036, restitution: 0.32,
    friction: 0.10, frictionAir: 0.013,
    popPitch: 0.22, thudPitch: 0.28,
  },
};

// Pick a variant biased by media type so the pile has editorial rhythm
// without feeling random-generated.
function pickVariant(item: MediaItem, rng: number): Variant {
  if (item.raw) return "heavy"; // MSL confidential always carries weight
  if (item.type === "video") {
    // 50% standard, 30% heavy, 20% light
    if (rng < 0.2) return "light";
    if (rng < 0.7) return "standard";
    return "heavy";
  }
  // images: 60% light, 20% standard, 20% heavy
  if (rng < 0.6) return "light";
  if (rng < 0.8) return "standard";
  return "heavy";
}

type SandboxSource = {
  id: string;
  getOrigin: () => { x: number; y: number };
  media: MediaItem[];
  // When true, each spawn picks a random item from `media` using a
  // shuffled queue (no repeats until every item has been shown once).
  // Otherwise items cycle in array order.
  randomOrder?: boolean;
};

type SpawnedItem = {
  key: number;
  sourceId: string; // the logo that spawned this phone (for origin / implode)
  media: MediaItem; // what's rendered — may come from a shared pool (socials)
  width: number;
  aspect: number;
  variant: Variant;
  body: Matter.Body;
  bornAt: number;
  emerged: boolean; // once the phone has grown to full size it stays full-size
  // Idle micro-motion: how long the phone has been essentially still.
  idleMs: number;
  idlePhase: number;
  // Hit-jiggle: timestamp of last significant impact; 0 if none.
  hitAt: number;
  hitIntensity: number;
};

export type PhoneSandboxHandle = {
  spawn: (sourceId: string) => void;
  clearAll: () => void;
  count: () => number;
};

const PhoneSandbox = forwardRef<
  PhoneSandboxHandle,
  {
    sources: SandboxSource[];
    // Optional forbidden zone: phones can't be *dragged* onto this rect.
    // Physics (spill, bounce, pile) is unaffected.
    getDragForbiddenRect?: () => DOMRect | null;
  }
>(
  function PhoneSandbox({ sources, getDragForbiddenRect }, ref) {
    type Frame = {
      x: number;
      y: number;
      angle: number;
      scale: number;
      vx: number;
      vy: number;
      opacity: number;
      // Micro-motion additive offsets — zero unless the phone has settled.
      swayAngle: number;
      breatheScale: number;
      // Hit-jiggle — scaleY pulse in local (pre-rotation) frame. 1 unless
      // within 140ms of a significant impact.
      hitScaleY: number;
    };
    const [frames, setFrames] = useState<Record<number, Frame>>({});
    const itemsRef = useRef<SpawnedItem[]>([]);
    const keyRef = useRef(0);
    const countersRef = useRef<Record<string, number>>({});
    // Shuffled queue per randomOrder source: each spawn consumes from the
    // head; when empty the pool is reshuffled so every item is shown once
    // per cycle with no repeats.
    const shuffleQueuesRef = useRef<Record<string, number[]>>({});
    const engineRef = useRef<Matter.Engine | null>(null);
    const wallsRef = useRef<Matter.Body[]>([]);
    const rafRef = useRef(0);
    const draggingRef = useRef<Set<number>>(new Set());
    const implodingRef = useRef(false);
    // Inspection mode: which phone (by key) is currently shown enlarged,
    // or null. The phone's body is frozen in place while inspected so it
    // doesn't fall out of the pile during the animation.
    const [inspectedKey, setInspectedKey] = useState<number | null>(null);
    // Hover magnetism — tracked globally, applied per-frame.
    // -1,-1 means cursor has left the viewport (no force).
    const cursorRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });
    const sourcesRef = useRef<SandboxSource[]>(sources);
    sourcesRef.current = sources;
    // Keep the drag-forbidden callback in a ref so scroll/resize handlers
    // inside the one-time engine effect always see the latest version.
    const textRectRef = useRef(getDragForbiddenRect);
    textRectRef.current = getDragForbiddenRect;

    // ---- Engine + walls setup (one-time) ----
    useEffect(() => {
      if (typeof window === "undefined") return;

      // Gentler gravity on mobile so phones arc less far and take longer
      // to resettle — suits a cramped viewport.
      const gravityScale =
        window.innerWidth < MOBILE_BREAKPOINT ? 0.00083 : 0.0011;
      const engine = Matter.Engine.create({
        gravity: { x: 0, y: 1, scale: gravityScale },
        positionIterations: 8,
        velocityIterations: 8,
      });
      engineRef.current = engine;

      const buildWalls = () => {
        if (wallsRef.current.length) {
          Matter.Composite.remove(engine.world, wallsRef.current);
        }
        const W = window.innerWidth;
        const H = window.innerHeight;
        const t = 80;
        const opts = { isStatic: true, restitution: 0.35, friction: 0.9 };
        const floor = Matter.Bodies.rectangle(W / 2, H + t / 2 - 8, W * 2, t, opts);
        floor.label = "floor"; // tagged so collisionStart can distinguish thud from tick
        const ceiling = Matter.Bodies.rectangle(W / 2, -H, W * 2, t, opts);
        const wallL = Matter.Bodies.rectangle(-t / 2 + 8, H / 2, t, H * 4, opts);
        const wallR = Matter.Bodies.rectangle(W + t / 2 - 8, H / 2, t, H * 4, opts);
        wallsRef.current = [floor, ceiling, wallL, wallR];
        Matter.Composite.add(engine.world, wallsRef.current);
      };
      buildWalls();
      window.addEventListener("resize", buildWalls);

      // Track cursor for hover magnetism.
      const onPointerMove = (e: PointerEvent) => {
        cursorRef.current.x = e.clientX;
        cursorRef.current.y = e.clientY;
      };
      const onPointerLeave = () => {
        cursorRef.current.x = -9999;
        cursorRef.current.y = -9999;
      };
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerleave", onPointerLeave);

      // Text-as-wall — static Matter body at the paragraph's rect so
      // phones bounce off it. Kept in sync on scroll + resize. The body
      // is replaced (not moved-and-resized) whenever the text's size or
      // position changes meaningfully, because matter-js doesn't support
      // resizing static rectangles in place.
      let textBody: Matter.Body | null = null;
      let lastRect: { cx: number; cy: number; w: number; h: number } | null = null;
      const syncTextWall = () => {
        // No text wall on narrow viewports — the pile already has little
        // room and bouncing off the paragraph just crowds the experience.
        const onMobile = window.innerWidth < MOBILE_BREAKPOINT;
        const rect = onMobile ? null : textRectRef.current?.();
        if (!rect || rect.width < 2 || rect.height < 2) {
          if (textBody) {
            Matter.Composite.remove(engine.world, textBody);
            textBody = null;
            lastRect = null;
          }
          return;
        }
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const w = rect.width;
        const h = rect.height;
        // If size changed appreciably, rebuild the body.
        if (!textBody || !lastRect || Math.abs(lastRect.w - w) > 2 || Math.abs(lastRect.h - h) > 2) {
          if (textBody) Matter.Composite.remove(engine.world, textBody);
          textBody = Matter.Bodies.rectangle(cx, cy, w, h, {
            isStatic: true,
            restitution: 0.3,
            friction: 0.5,
          });
          textBody.label = "text";
          Matter.Composite.add(engine.world, textBody);
          lastRect = { cx, cy, w, h };
        } else if (Math.abs(lastRect.cx - cx) > 0.5 || Math.abs(lastRect.cy - cy) > 0.5) {
          Matter.Body.setPosition(textBody, { x: cx, y: cy });
          lastRect = { cx, cy, w, h };
        }
      };
      syncTextWall();
      window.addEventListener("scroll", syncTextWall, { passive: true });
      window.addEventListener("resize", syncTextWall);

      // Find an item's source origin (for implode only)
      const originFor = (sid: string) => {
        const src = sourcesRef.current.find((s) => s.id === sid);
        return src ? src.getOrigin() : { x: 0, y: 0 };
      };

      // Sound: tick on phone-phone, thud on phone-floor.
      // Gated by impulse/depth so we don't spam on grazing contacts.
      const onCollision = (evt: Matter.IEventCollision<Matter.Engine>) => {
        for (const pair of evt.pairs) {
          const a = pair.bodyA;
          const b = pair.bodyB;
          const aFloor = a.label === "floor";
          const bFloor = b.label === "floor";
          const aText = a.label === "text";
          const bText = b.label === "text";

          if (aFloor || bFloor) {
            const phone = aFloor ? b : a;
            if (phone.isStatic) continue;
            const vy = Math.abs(phone.velocity.y);
            if (vy < 3) continue; // ignore gentle contacts
            const item = itemsRef.current.find((it) => it.body === phone);
            const pitch = item ? VARIANTS[item.variant].thudPitch : 0.5;
            const intensity = Math.min(1, vy / 22);
            sfx.thud({ pitch, intensity });
            if (item) {
              item.hitAt = performance.now();
              item.hitIntensity = intensity;
            }
          } else if (aText || bText) {
            // Phone bouncing off the text block — tick, higher pitch
            // than inter-phone for a lighter "paper" feel.
            const phone = aText ? b : a;
            if (phone.isStatic) continue;
            const speed = Math.sqrt(
              phone.velocity.x * phone.velocity.x +
                phone.velocity.y * phone.velocity.y
            );
            if (speed < 2) continue;
            const intensity = Math.min(1, speed / 16);
            sfx.tick({ pitch: 0.7 + Math.random() * 0.15, intensity });
            const item = itemsRef.current.find((it) => it.body === phone);
            if (item) {
              item.hitAt = performance.now();
              item.hitIntensity = intensity;
            }
          } else if (!a.isStatic && !b.isStatic) {
            if (pair.collision.depth < 2) continue;
            const relVx = a.velocity.x - b.velocity.x;
            const relVy = a.velocity.y - b.velocity.y;
            const rel = Math.sqrt(relVx * relVx + relVy * relVy);
            const intensity = Math.min(1, rel / 18);
            if (intensity < 0.12) continue;
            sfx.tick({
              pitch: 0.5 + (Math.random() - 0.5) * 0.35,
              intensity,
            });
            // Hit-jiggle on both phones — quick local squash sells weight.
            const itA = itemsRef.current.find((it) => it.body === a);
            const itB = itemsRef.current.find((it) => it.body === b);
            const now = performance.now();
            if (itA) { itA.hitAt = now; itA.hitIntensity = intensity; }
            if (itB) { itB.hitAt = now; itB.hitIntensity = intensity; }
          }
        }
      };
      Matter.Events.on(engine, "collisionStart", onCollision);

      let last = performance.now();
      const tick = (now: number) => {
        const dt = Math.min(now - last, 32);
        last = now;
        if (itemsRef.current.length > 0) {
          Matter.Engine.update(engine, dt);

          const next: Record<number, Frame> = {};
          for (const it of itemsRef.current) {
            const b = it.body;
            const speedLin = Math.sqrt(
              b.velocity.x * b.velocity.x + b.velocity.y * b.velocity.y
            );

            // Restoring torque — keeps phones in portrait orientation.
            // Minimal during fast motion, stronger as they settle.
            if (!b.isStatic) {
              let delta = b.angle;
              while (delta > Math.PI) delta -= Math.PI * 2;
              while (delta < -Math.PI) delta += Math.PI * 2;
              const settling = 1 - Math.min(1, speedLin / 8);
              const kTorque = 0.001 + 0.012 * settling;
              const aDamp = 0.994 - settling * 0.1;
              Matter.Body.setAngularVelocity(
                b,
                b.angularVelocity * aDamp - delta * kTorque
              );
            }

            // Hover magnetism — cursor within 80 px of a non-dragged phone
            // applies a small upward buoyancy force, strongest at the
            // center of the phone, falling off quadratically at the edge.
            // The pile "notices" a passing cursor.
            if (!b.isStatic && !implodingRef.current) {
              const cx = cursorRef.current.x;
              const cy = cursorRef.current.y;
              const ddx = b.position.x - cx;
              const ddy = b.position.y - cy;
              const cDist = Math.sqrt(ddx * ddx + ddy * ddy);
              if (cDist < 80) {
                const proximity = 1 - cDist / 80;
                const lift = proximity * proximity * 0.0009 * b.mass;
                Matter.Body.applyForce(b, b.position, { x: 0, y: -lift });
              }
            }

            // Idle tracking — how long has this phone been essentially still?
            const atRest =
              speedLin < 0.25 && Math.abs(b.angularVelocity) < 0.01 && !b.isStatic;
            if (atRest) it.idleMs += dt;
            else it.idleMs = 0;

            // Scale: grows from 0 → 1 as the phone leaves the logo.
            // Once fully emerged, scale is permanently locked at 1 so it
            // doesn't shrink if the phone later drifts back over the logo.
            let scale: number;
            if (it.emerged) {
              scale = 1;
            } else {
              const origin = originFor(it.sourceId);
              const dx = b.position.x - origin.x;
              const dy = b.position.y - origin.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const timeAge = now - it.bornAt;
              const emergeT = Math.min(1, timeAge / 180);
              const emergeD = Math.min(1, dist / 120);
              scale = Math.min(emergeT, emergeD);
              if (scale >= 1) it.emerged = true;
            }

            let opacity = Math.min(1, scale * 1.4);
            if (implodingRef.current) {
              const origin = originFor(it.sourceId);
              const dx = b.position.x - origin.x;
              const dy = b.position.y - origin.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const implodeScale = Math.min(1, dist / 120);
              scale = Math.min(scale, implodeScale);
              opacity = scale;
            }

            // Micro-motion: after 500ms of rest, start breathing.
            // Ramp in over the next 400ms so it doesn't snap on.
            let swayAngle = 0;
            let breatheScale = 1;
            if (it.idleMs > 500) {
              const rampIn = Math.min(1, (it.idleMs - 500) / 400);
              const t = (now / 1000 + it.idlePhase) * 0.9; // ~slow breath
              swayAngle = Math.sin(t) * 0.015 * rampIn;
              breatheScale = 1 + Math.sin(t * 1.3 + 0.7) * 0.006 * rampIn;
            }

            // Hit-jiggle: scaleY pulse from 1 → 0.96 → 1 over 140ms,
            // scaled by impact intensity. Applied in local (pre-rotation)
            // frame so the phone squashes along its own height.
            let hitScaleY = 1;
            if (it.hitAt > 0) {
              const age = now - it.hitAt;
              if (age < 140) {
                hitScaleY = 1 - Math.sin((age / 140) * Math.PI) * 0.05 * it.hitIntensity;
              } else {
                it.hitAt = 0;
                it.hitIntensity = 0;
              }
            }

            next[it.key] = {
              x: b.position.x,
              y: b.position.y,
              angle: b.angle,
              scale,
              vx: b.velocity.x,
              vy: b.velocity.y,
              opacity,
              swayAngle,
              breatheScale,
              hitScaleY,
            };
          }
          setFrames(next);

          // Implosion: pull each item toward its own source origin
          if (implodingRef.current) {
            const remaining: SpawnedItem[] = [];
            for (const it of itemsRef.current) {
              const b = it.body;
              const origin = originFor(it.sourceId);
              const dx = origin.x - b.position.x;
              const dy = origin.y - b.position.y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              if (!b.isStatic) {
                Matter.Body.applyForce(b, b.position, {
                  x: (dx / dist) * 0.02 * b.mass,
                  y: (dy / dist) * 0.02 * b.mass,
                });
                Matter.Body.setVelocity(b, {
                  x: b.velocity.x * 0.9,
                  y: b.velocity.y * 0.9,
                });
                Matter.Body.setAngularVelocity(b, b.angularVelocity * 0.9);
              }
              if (dist < 28) {
                Matter.Composite.remove(engine.world, b);
              } else {
                remaining.push(it);
              }
            }
            itemsRef.current = remaining;
            if (itemsRef.current.length === 0) {
              implodingRef.current = false;
              setFrames({});
            }
          }
        } else if (Object.keys(frames).length > 0) {
          setFrames({});
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);

      return () => {
        cancelAnimationFrame(rafRef.current);
        window.removeEventListener("resize", buildWalls);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerleave", onPointerLeave);
        window.removeEventListener("scroll", syncTextWall);
        window.removeEventListener("resize", syncTextWall);
        if (textBody) Matter.Composite.remove(engine.world, textBody);
        Matter.Events.off(engine, "collisionStart", onCollision);
        Matter.Engine.clear(engine);
        engineRef.current = null;
        itemsRef.current = [];
        wallsRef.current = [];
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ---- Spawn one item from a given source ----
    const spawn = useCallback((sourceId: string) => {
      const engine = engineRef.current;
      if (!engine) return;
      const source = sourcesRef.current.find((s) => s.id === sourceId);
      if (!source) return;

      if (implodingRef.current) implodingRef.current = false;

      if (itemsRef.current.length >= getItemCap()) {
        const oldest = itemsRef.current.shift();
        if (oldest) Matter.Composite.remove(engine.world, oldest.body);
      }

      const origin = source.getOrigin();
      const prevCount = countersRef.current[sourceId] ?? 0;
      countersRef.current[sourceId] = prevCount + 1;
      const n = prevCount;

      // Social surprise: every so often a spawn from any logo produces a
      // social icon instead of the logo's usual media. Rules tuned so
      // socials feel rewarding, not spammy:
      //   - MIN_GAP     never within this many non-social spawns of the
      //                 previous social (no back-to-back surprises)
      //   - FORCE_AT    guaranteed social after this many non-social
      //                 spawns — so an engaged user always sees one
      //   - CHANCE      otherwise random probability per eligible spawn
      const SOCIAL_MIN_GAP = 1;
      const SOCIAL_FORCE_AT = 3;
      const SOCIAL_CHANCE = 0.5;
      const socialCooldown = countersRef.current._socialCooldown ?? 0;
      const spawnSocial =
        SOCIAL_MEDIA.length > 0 &&
        socialCooldown >= SOCIAL_MIN_GAP &&
        (socialCooldown >= SOCIAL_FORCE_AT || Math.random() < SOCIAL_CHANCE);

      let mediaItem: MediaItem;
      if (spawnSocial) {
        // Shuffled queue so every social appears once before any repeats.
        let socialQueue = shuffleQueuesRef.current.__social;
        if (!socialQueue || socialQueue.length === 0) {
          socialQueue = shuffleIndices(SOCIAL_MEDIA.length);
          shuffleQueuesRef.current.__social = socialQueue;
        }
        const idx = socialQueue.pop()!;
        mediaItem = SOCIAL_MEDIA[idx];
        countersRef.current._socialCooldown = 0;
      } else {
        let mediaIndex: number;
        if (source.randomOrder) {
          let queue = shuffleQueuesRef.current[sourceId];
          if (!queue || queue.length === 0) {
            queue = shuffleIndices(source.media.length);
            shuffleQueuesRef.current[sourceId] = queue;
          }
          mediaIndex = queue.pop()!;
        } else {
          mediaIndex = n % source.media.length;
        }
        mediaItem = source.media[mediaIndex];
        countersRef.current._socialCooldown = socialCooldown + 1;
      }
      const aspect = itemAspect(mediaItem);

      // Pick variant — gives the pile editorial rhythm.
      const variant = pickVariant(mediaItem, Math.random());
      const profile = VARIANTS[variant];
      // Per-item widthRange wins over the variant's range. Used when an
      // item has text that needs to be readable (e.g. article headlines).
      // Scale down on narrow viewports so phones don't dominate the screen.
      const vScale = getViewportScale();
      const onMobile =
        typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT;
      let wMin: number;
      let wMax: number;
      if (onMobile && mediaItem.mobileWidthRange) {
        // Mobile-specific range already tuned for small screens — skip vScale
        [wMin, wMax] = mediaItem.mobileWidthRange;
      } else {
        const [rawMin, rawMax] =
          mediaItem.widthRange ?? [profile.widthMin, profile.widthMax];
        wMin = rawMin * vScale;
        wMax = rawMax * vScale;
      }
      const width = wMin + Math.random() * (wMax - wMin);
      const height = width * aspect;
      const cornerRadius = Math.max(18, width * 0.12);

      // Trajectory — walked through the golden ratio so every click is fresh.
      // Heavy phones eject slightly slower (they thud sooner), light ones lift.
      // Mobile gets a 0.75x impulse scale so phones don't cover the screen
      // in a single arc.
      const impulseScale = getMobileImpulseScale();
      const PHI = (1 + Math.sqrt(5)) / 2;
      const baseAngle = ((n * (1 / PHI)) % 1) * Math.PI * 2;
      const theta = -Math.PI / 2 + Math.sin(baseAngle) * (Math.PI * 0.55);
      const speedBoost = variant === "light" ? 2.5 : variant === "heavy" ? -2.5 : 0;
      const speed = (16 + Math.random() * 10 + speedBoost) * impulseScale;
      const vx = Math.cos(theta) * speed + (Math.random() - 0.5) * 3 * impulseScale;
      const vy = Math.sin(theta) * speed - 2 * impulseScale;

      const body = Matter.Bodies.rectangle(origin.x, origin.y, width, height, {
        density: profile.density,
        friction: profile.friction,
        frictionStatic: profile.friction + 0.02,
        frictionAir: profile.frictionAir,
        restitution: profile.restitution,
        chamfer: { radius: cornerRadius },
        slop: 0.02,
        angle: (Math.random() - 0.5) * 0.25,
      });
      Matter.Body.setVelocity(body, { x: vx, y: vy });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.32);

      itemsRef.current.push({
        key: keyRef.current++,
        sourceId,
        media: mediaItem,
        width,
        aspect,
        variant,
        body,
        bornAt: performance.now(),
        emerged: false,
        idleMs: 0,
        idlePhase: Math.random() * Math.PI * 2, // phase offset per phone — no sync-breathing
        hitAt: 0,
        hitIntensity: 0,
      });
      Matter.Composite.add(engine.world, body);

      // Sensory feedback — pop (pitched by variant) + haptic nudge on mobile.
      sfx.pop({
        pitch: profile.popPitch + (Math.random() - 0.5) * 0.12,
        intensity: 0.85,
      });
      tinyHaptic(variant === "heavy" ? 9 : variant === "light" ? 4 : 6);
    }, []);

    const clearAll = useCallback(() => {
      if (itemsRef.current.length === 0) return;
      implodingRef.current = true;
    }, []);

    const count = useCallback(() => itemsRef.current.length, []);

    const openInspection = useCallback((key: number) => {
      const item = itemsRef.current.find((it) => it.key === key);
      if (!item) return;
      implodingRef.current = false;
      // Freeze the body so it doesn't drift out of the pile while enlarged.
      Matter.Body.setStatic(item.body, true);
      Matter.Body.setAngularVelocity(item.body, 0);
      Matter.Body.setVelocity(item.body, { x: 0, y: 0 });
      setInspectedKey(key);
    }, []);

    const closeInspection = useCallback(() => {
      setInspectedKey((key) => {
        if (key === null) return null;
        const item = itemsRef.current.find((it) => it.key === key);
        if (item) {
          Matter.Body.setStatic(item.body, false);
          // Gentle re-entry — small downward nudge so gravity resumes
          // cleanly without an abrupt pop.
          Matter.Body.setVelocity(item.body, { x: 0, y: 0.3 });
        }
        return null;
      });
    }, []);

    // Allow startDrag (defined below) to call openInspection without a
    // forward-reference dance — stable ref.
    const openInspectionRef = useRef(openInspection);
    useEffect(() => {
      openInspectionRef.current = openInspection;
    }, [openInspection]);

    useImperativeHandle(ref, () => ({ spawn, clearAll, count }), [spawn, clearAll, count]);

    // ---- Escape: close inspection first, then clear pile ----
    useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        if (e.key !== "Escape") return;
        if (inspectedKey !== null) closeInspection();
        else clearAll();
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [clearAll, closeInspection, inspectedKey]);

    // ---- Drag handlers (pointer events for touch + mouse + pen) ----
    const startDrag = useCallback((e: React.PointerEvent, key: number) => {
      const item = itemsRef.current.find((it) => it.key === key);
      if (!item) return;
      const body = item.body;
      e.stopPropagation();
      e.preventDefault();

      const target = e.currentTarget as HTMLElement;
      try {
        target.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }

      Matter.Body.setStatic(body, true);
      Matter.Body.setAngularVelocity(body, 0);
      Matter.Body.setVelocity(body, { x: 0, y: 0 });
      draggingRef.current.add(key);
      // Lock text-selection + set grabbing cursor site-wide while dragging
      // so the browser doesn't flip to a text caret over any stray element.
      document.body.style.userSelect = "none";
      document.body.style.cursor = "grabbing";

      const offsetX = e.clientX - body.position.x;
      const offsetY = e.clientY - body.position.y;

      type Sample = { x: number; y: number; t: number };
      // Fixed pointerdown position — used for click detection (total travel
      // from press to release). Never trimmed.
      const pressedAt = { x: e.clientX, y: e.clientY, t: performance.now() };
      // Tracks pointerup position so click-vs-drag uses the full travel.
      let releasedAt = { ...pressedAt };
      // Rolling sample buffer — only the last ~90ms is kept, used to compute
      // the throw velocity on release. Trimmed aggressively so a drag that
      // pauses before release doesn't get a stale first sample.
      const history: Sample[] = [{ ...pressedAt }];

      const onMove = (ev: PointerEvent) => {
        if (ev.pointerId !== e.pointerId) return;
        let px = ev.clientX - offsetX;
        let py = ev.clientY - offsetY;

        // Don't let a dragged phone cover the text paragraph. Collide-and-slide:
        // if the phone's center is inside the forbidden rect expanded by its
        // own half-size, snap it to the nearest edge.
        const forbidden = getDragForbiddenRect?.();
        if (forbidden) {
          const pad = 8;
          const halfW = item.width / 2 + pad;
          const halfH = (item.width * item.aspect) / 2 + pad;
          const ex1 = forbidden.left - halfW;
          const ex2 = forbidden.right + halfW;
          const ey1 = forbidden.top - halfH;
          const ey2 = forbidden.bottom + halfH;
          if (px > ex1 && px < ex2 && py > ey1 && py < ey2) {
            const dL = px - ex1;
            const dR = ex2 - px;
            const dT = py - ey1;
            const dB = ey2 - py;
            const m = Math.min(dL, dR, dT, dB);
            if (m === dL) px = ex1;
            else if (m === dR) px = ex2;
            else if (m === dT) py = ey1;
            else py = ey2;
          }
        }

        Matter.Body.setPosition(body, { x: px, y: py });
        const now = performance.now();
        releasedAt = { x: ev.clientX, y: ev.clientY, t: now };
        history.push({ x: ev.clientX, y: ev.clientY, t: now });
        const cutoff = now - 90;
        while (history.length > 2 && history[0].t < cutoff) history.shift();

        // Tilt the phone toward drag direction — like a card being carried.
        // Uses a short window of cursor samples for a smooth, velocity-scaled
        // lean that returns to zero when the cursor pauses.
        if (history.length >= 2) {
          const recent = history.slice(-4);
          const span = recent[recent.length - 1].t - recent[0].t || 1;
          const dvx = (recent[recent.length - 1].x - recent[0].x) / span; // px per ms
          const target = Math.max(-0.24, Math.min(0.24, dvx * 18));
          Matter.Body.setAngle(body, body.angle + (target - body.angle) * 0.28);
        }
      };

      const onUp = (ev: PointerEvent) => {
        if (ev.pointerId !== e.pointerId) return;
        target.removeEventListener("pointermove", onMove);
        target.removeEventListener("pointerup", onUp);
        target.removeEventListener("pointercancel", onUp);
        try {
          target.releasePointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
        // Restore page-wide selection + cursor regardless of exit path.
        document.body.style.userSelect = "";
        document.body.style.cursor = "";

        // Click detection uses FULL travel from pointerdown to pointerup
        // (not the trimmed velocity history — a drag that pauses before
        // release would otherwise have a first-and-last that are nearly
        // identical and get mis-classified as a click).
        const totalDist = Math.sqrt(
          (releasedAt.x - pressedAt.x) ** 2 + (releasedAt.y - pressedAt.y) ** 2
        );
        const pressDuration = releasedAt.t - pressedAt.t;
        const wasClick = totalDist < 3 && pressDuration < 220;

        if (wasClick) {
          Matter.Body.setStatic(body, false);
          draggingRef.current.delete(key);
          // If the clicked phone has a link, open it in a new tab instead
          // of opening the inspection panel. Safety-work screens are the
          // primary users of this: click reads the article.
          const clickedItem = itemsRef.current.find((it) => it.key === key);
          const clickedMedia = clickedItem ? clickedItem.media : null;
          if (clickedMedia?.link) {
            window.open(clickedMedia.link, "_blank", "noopener,noreferrer");
            return;
          }
          openInspectionRef.current(key);
          return;
        }

        // Throw velocity — uses the trimmed rolling window so the phone
        // leaves with the *recent* cursor motion, not the whole drag
        // averaged.
        const first = history[0];
        const lastSample = history[history.length - 1];
        const dt = Math.max(16, lastSample.t - first.t);
        const vx = ((lastSample.x - first.x) / dt) * 16;
        const vy = ((lastSample.y - first.y) / dt) * 16;

        // Flick-to-clear: a fast-downward release near the bottom of the
        // viewport sweeps every phone home. "I just brushed them all off."
        const viewportH =
          typeof window !== "undefined" ? window.innerHeight : 800;
        const releasedLow = lastSample.y > viewportH * 0.7;
        const flickedDown = vy > 20;
        const flickToClear = releasedLow && flickedDown;

        Matter.Body.setStatic(body, false);
        Matter.Body.setVelocity(body, {
          x: Math.max(-30, Math.min(30, vx)),
          y: Math.max(-30, Math.min(30, vy)),
        });
        Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.08);
        draggingRef.current.delete(key);

        if (flickToClear) clearAll();
      };

      target.addEventListener("pointermove", onMove);
      target.addEventListener("pointerup", onUp);
      target.addEventListener("pointercancel", onUp);
    }, [getDragForbiddenRect, clearAll]);

    if (typeof document === "undefined") return null;
    if (Object.keys(frames).length === 0 && !implodingRef.current) return null;

    // Find the inspected item's media (if any) for the panel below.
    const inspectedItem =
      inspectedKey !== null
        ? itemsRef.current.find((it) => it.key === inspectedKey)
        : null;
    const inspectedMedia = inspectedItem ? inspectedItem.media : null;

    return createPortal(
      <>
        {itemsRef.current.map((it) => {
          // The inspected phone is rendered by InspectionPanel instead.
          if (it.key === inspectedKey) return null;
          const f = frames[it.key];
          if (!f || f.scale < 0.02) return null;
          const mediaItem = it.media;
          const isDragging = draggingRef.current.has(it.key);

          // Shadow: velocity-driven normally, bumped while held so the
          // phone reads as "lifted off the surface".
          const vMag = Math.min(36, Math.abs(f.vy));
          const sy = isDragging ? 18 : 8 + vMag * 0.3;
          const sb = isDragging ? 34 : 14 + vMag * 0.6;
          const sa = isDragging ? 0.22 : 0.08 + vMag * 0.004;
          // Raw (MSL confidential) PNGs already have their own bezel + shadow
          // baked in — don't double-shadow them.
          const filter = mediaItem.raw
            ? undefined
            : `drop-shadow(0 ${sy}px ${sb}px rgba(15, 20, 45, ${sa.toFixed(3)}))`;

          const finalAngle = f.angle + f.swayAngle;
          const finalScale = f.scale * f.breatheScale * (isDragging ? 1.06 : 1);
          // scaleY applied last (innermost) so the hit-jiggle squashes the
          // phone in its own local frame, before rotation.
          const scaleYStr = f.hitScaleY !== 1 ? ` scaleY(${f.hitScaleY.toFixed(3)})` : "";

          return (
            <div
              key={it.key}
              className="fixed z-50 select-none"
              style={{
                left: f.x,
                top: f.y,
                transform: `translate(-50%, -50%) rotate(${finalAngle}rad) scale(${finalScale})${scaleYStr}`,
                transformOrigin: "center center",
                cursor: isDragging ? "grabbing" : "grab",
                willChange: "transform, opacity, filter",
                opacity: f.opacity,
                touchAction: "none",
                filter,
                transition: isDragging ? "transform 120ms cubic-bezier(.2,.9,.3,1.2), filter 140ms ease" : "filter 160ms ease",
              }}
              onPointerDown={(e) => startDrag(e, it.key)}
            >
              <MediaElement item={mediaItem} width={it.width} />
            </div>
          );
        })}
        <AnimatePresence>
          {inspectedKey !== null && inspectedItem && inspectedMedia && (
            <InspectionPanel
              key="inspect"
              item={inspectedMedia}
              onClose={closeInspection}
            />
          )}
        </AnimatePresence>
      </>,
      document.body
    );
  }
);

// Inspection panel — shown when a phone in the pile is single-tapped.
// No backdrop: the phone scales up in place on a transparent click-catching
// layer. Clicking anywhere (including the phone itself) dismisses.
function InspectionPanel({
  item,
  onClose,
}: {
  item: MediaItem;
  onClose: () => void;
}) {
  // Fit the phone to the viewport with generous padding.
  const aspect = itemAspect(item);
  const availH = typeof window !== "undefined" ? window.innerHeight - 120 : 720;
  const availW = typeof window !== "undefined" ? window.innerWidth - 80 : 400;
  const fromHeight = { w: availH / aspect, h: availH };
  const fromWidth = { w: availW, h: availW * aspect };
  const fit = fromWidth.h <= availH ? fromWidth : fromHeight;

  return (
    <motion.div
      className="fixed inset-0 z-[55] flex items-center justify-center cursor-pointer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
      onClick={onClose}
      style={{ touchAction: "none" }}
    >
      <motion.div
        className="select-none"
        initial={{ opacity: 0, scale: 0.85, y: 0 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        // Swipe-down-to-dismiss — drag the phone down and release; if it
        // traveled more than 80 px or was flicked fast, close. Otherwise
        // spring back to center. Works on touch and mouse.
        drag="y"
        dragElastic={0.35}
        dragMomentum={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 80 || info.velocity.y > 700) {
            onClose();
          }
        }}
        // Stop bubble so the wrapper's onClick doesn't fire during drag.
        onClick={(e) => e.stopPropagation()}
        style={{
          width: fit.w,
          filter: "drop-shadow(0 30px 60px rgba(15, 20, 45, 0.22))",
          touchAction: "none",
          cursor: "grab",
        }}
      >
        <MediaElement item={item} width={fit.w} audible />
      </motion.div>
    </motion.div>
  );
}

// Silent preloader — mounts hidden videos so they buffer before the first
// click. Without this, the first phone to spawn shows a black rectangle
// while the video element fetches its bytes.
// Reduced-motion showcase — no physics, no pile. Each logo click surfaces
// one card at the bottom of the viewport; subsequent clicks cycle through
// the media. Escape dismisses everything. Preserves the gag without motion.
function QuietShowcase({
  messengerItem,
  mslItem,
  onDismiss,
}: {
  messengerItem: MediaItem | null;
  mslItem: MediaItem | null;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onDismiss]);

  const hasAny = !!messengerItem || !!mslItem;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      aria-live="polite"
      className="fixed left-1/2 bottom-10 z-50 flex items-end gap-6 pointer-events-none"
      style={{ transform: "translateX(-50%)" }}
    >
      <AnimatePresence mode="popLayout">
        {messengerItem && (
          <motion.div
            key={`m-${messengerItem.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.24, ease: [0.2, 0, 0, 1] }}
          >
            <MediaElement item={messengerItem} width={140} />
          </motion.div>
        )}
        {mslItem && (
          <motion.div
            key={`ms-${mslItem.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.24, ease: [0.2, 0, 0, 1] }}
          >
            <MediaElement item={mslItem} width={140} />
          </motion.div>
        )}
      </AnimatePresence>
      {hasAny && (
        <button
          type="button"
          onClick={onDismiss}
          className="pointer-events-auto absolute -top-8 right-0 text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
          aria-label="Dismiss previews"
        >
          clear
        </button>
      )}
    </div>,
    document.body
  );
}

// Tiny speaker toggle — bottom-right, barely there. Persists mute to
// localStorage via the sfx module.
function SoundToggle() {
  const muted = useSyncExternalStore(
    (fn) => sfx.subscribe(fn),
    () => sfx.isMuted(),
    () => true // default muted on SSR
  );

  const toggle = () => {
    const next = !sfx.isMuted();
    sfx.setMuted(next);
    // Fire a tiny pop on un-mute so the user immediately hears that audio
    // is live (also works around autoplay policy — this is a user gesture).
    if (!next) sfx.pop({ pitch: 0.6, intensity: 0.6 });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={muted ? "Enable sound" : "Mute sound"}
      className="fixed bottom-5 right-5 z-[70] flex items-center justify-center rounded-full cursor-pointer w-11 h-11 sm:w-9 sm:h-9"
      style={{
        color: muted ? "#9ca3af" : "#111827",
        backgroundColor: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        border: "1px solid rgba(0,0,0,0.06)",
        transition: "color 180ms ease, transform 180ms cubic-bezier(.2,.9,.3,1.2)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 5 6 9H2v6h4l5 4V5z" />
        {muted ? (
          <>
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </>
        ) : (
          <>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </>
        )}
      </svg>
    </button>
  );
}

function MediaPreloader({ media }: { media: MediaItem[] }) {
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  // Mobile Safari / Android Chrome routinely ignore `preload="auto"` on
  // 0-size hidden videos — they wait for a user gesture or visibility.
  // We poke the videos in three ways to coax them into buffering:
  //   1. Call .load() explicitly at mount (some browsers respect this).
  //   2. Re-call .load() on the FIRST user pointerdown anywhere — this is
  //      the gesture most restrictive browsers wait for.
  //   3. Keep the container 2x2 px (not 0x0) and barely on-screen, which
  //      is enough for some browsers to consider the element "visible"
  //      and preload its media.
  useEffect(() => {
    const map = videoRefs.current;
    const loadAll = () => {
      map.forEach((v) => {
        try { v.load(); } catch { /* ignore */ }
      });
    };
    loadAll();
    const onFirstGesture = () => {
      loadAll();
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("touchstart", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
    };
    window.addEventListener("pointerdown", onFirstGesture, { once: true });
    window.addEventListener("touchstart", onFirstGesture, { once: true });
    window.addEventListener("keydown", onFirstGesture, { once: true });
    return () => {
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("touchstart", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
    };
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 2,
        height: 2,
        overflow: "hidden",
        pointerEvents: "none",
        opacity: 0,
      }}
    >
      {media.map((m) =>
        m.type === "video" ? (
          <video
            key={m.id}
            ref={(el) => {
              if (el) videoRefs.current.set(m.id, el);
              else videoRefs.current.delete(m.id);
            }}
            src={m.src}
            preload="auto"
            muted
            playsInline
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={m.id} src={m.src} alt="" />
        )
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main view
// ---------------------------------------------------------------------------
const itemVariants = {
  hidden: { opacity: 0, filter: "blur(4px)" },
  visible: { opacity: 1, filter: "blur(0px)" },
};

const itemTransition = {
  filter: { type: "spring" as const, duration: 0.4, bounce: 0 },
  opacity: { duration: 0.7, ease: [0.25, 0, 0, 1] as [number, number, number, number] },
};

// Nervous-system hook for a spawner logo. Owns four motion values (x, y,
// scale, rotate) that the caller applies to a motion.span wrapping the logo.
//
// States:
//   idle      — hover tracking: logo leans 0–3 px toward the cursor
//   pressed   — scale compresses to 0.92, lean resets to 0 (snappy)
//   streaming — scale stays compressed, continuous micro-shudder (±2 px,
//               ±0.04 rad), spawn interval runs and ramps 110 → 55 ms
//   releasing — scale springs back through 1.0 with an overshoot
//
// Rationale: anticipation (hover lean) and anticipation (press compress) fire
// *before* the payload arrives, so the logo feels like a button with weight
// instead of a passive target. The release spring's damping is deliberately
// low so the pop overshoots — the physical tell that something just happened.
function useLogoPressSpawner(params: {
  ready: boolean;
  logoRef: React.RefObject<HTMLElement | null>;
  onSpawn: () => void;
  reducedMotion?: boolean;
}) {
  const { ready, logoRef, onSpawn, reducedMotion } = params;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const rotate = useMotionValue(0);
  // Exposed so nudge() can bail out while the user is already interacting.
  const isIdleRef = useRef(true);

  // Keep onSpawn fresh without re-attaching listeners.
  const onSpawnRef = useRef(onSpawn);
  useEffect(() => {
    onSpawnRef.current = onSpawn;
  }, [onSpawn]);

  // Imperative nudge — a small shiver-and-pop animation to remind users the
  // logo is interactive. No-op during an active press/stream so we never
  // interrupt the user's own animation.
  const nudge = useCallback(() => {
    if (!isIdleRef.current) return;
    animate(scale, [1, 1.14, 1], {
      duration: 0.52,
      ease: [0.2, 0.9, 0.3, 1.2],
    });
    animate(rotate, [0, 0.06, -0.06, 0.03, 0], { duration: 0.52 });
  }, [scale, rotate]);

  useEffect(() => {
    if (!ready) return;
    const el = logoRef.current;
    if (!el) return;

    // Reduced-motion: a plain click fires the spawn. No animations, no
    // long-press streaming — the motion values stay at their defaults and
    // have no visible effect even though they're still wired to the span.
    if (reducedMotion) {
      const onClick = () => onSpawnRef.current();
      el.addEventListener("click", onClick);
      return () => el.removeEventListener("click", onClick);
    }

    type State = "idle" | "pressed" | "streaming";
    let state: State = "idle";
    let pressTimer: ReturnType<typeof setTimeout> | null = null;
    let streamInterval: ReturnType<typeof setInterval> | null = null;
    let streamAccel: ReturnType<typeof setInterval> | null = null;
    let jitterInterval: ReturnType<typeof setInterval> | null = null;
    let streamDelay = 110;
    let pointerDown = false;
    let pressPointerId: number | null = null;

    const softSpring = { type: "spring" as const, stiffness: 260, damping: 22 };
    const snappySpring = { type: "spring" as const, stiffness: 520, damping: 32 };
    const releaseSpring = { type: "spring" as const, stiffness: 340, damping: 13 };

    const animatePress = () => {
      animate(scale, 0.92, snappySpring);
      animate(x, 0, snappySpring);
      animate(y, 0, snappySpring);
      animate(rotate, 0, snappySpring);
    };

    const animateRelease = () => {
      animate(scale, 1, releaseSpring); // low damping → overshoot pop
      animate(x, 0, softSpring);
      animate(y, 0, softSpring);
      animate(rotate, 0, softSpring);
    };

    const startJitter = () => {
      if (jitterInterval) return;
      jitterInterval = setInterval(() => {
        animate(x, (Math.random() - 0.5) * 2.4, { duration: 0.06 });
        animate(y, (Math.random() - 0.5) * 2.4, { duration: 0.06 });
        animate(rotate, (Math.random() - 0.5) * 0.05, { duration: 0.06 });
      }, 60);
    };

    const stopJitter = () => {
      if (jitterInterval) clearInterval(jitterInterval);
      jitterInterval = null;
    };

    const startStream = () => {
      state = "streaming";
      isIdleRef.current = false;
      onSpawnRef.current();
      startJitter();
      streamInterval = setInterval(() => onSpawnRef.current(), streamDelay);
      streamAccel = setInterval(() => {
        if (streamDelay > 55) {
          streamDelay -= 6;
          if (streamInterval) clearInterval(streamInterval);
          streamInterval = setInterval(() => onSpawnRef.current(), streamDelay);
        }
      }, 220);
    };

    const stopStream = () => {
      if (streamInterval) clearInterval(streamInterval);
      if (streamAccel) clearInterval(streamAccel);
      streamInterval = null;
      streamAccel = null;
      streamDelay = 110;
      stopJitter();
    };

    const onDown = (e: PointerEvent) => {
      if (pointerDown) return;
      pointerDown = true;
      pressPointerId = e.pointerId;
      state = "pressed";
      isIdleRef.current = false;
      e.preventDefault();
      animatePress();
      pressTimer = setTimeout(() => {
        pressTimer = null;
        startStream();
      }, 240);
    };

    const onUp = (e: PointerEvent) => {
      if (!pointerDown) return;
      if (pressPointerId !== null && e.pointerId !== pressPointerId) return;
      pointerDown = false;
      pressPointerId = null;
      if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
      if (state === "streaming") {
        stopStream();
      } else {
        // Single tap — fire one spawn on release (already in pressed state).
        onSpawnRef.current();
      }
      state = "idle";
      isIdleRef.current = true;
      animateRelease();
    };

    const onCancel = () => {
      if (pressTimer) clearTimeout(pressTimer);
      pressTimer = null;
      stopStream();
      state = "idle";
      isIdleRef.current = true;
      pointerDown = false;
      pressPointerId = null;
      animateRelease();
    };

    // Hover lean — only when idle, so pressed/streaming states keep their pose.
    const onMove = (e: PointerEvent) => {
      if (state !== "idle") return;
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - rect.left - rect.width / 2;
      const dy = e.clientY - rect.top - rect.height / 2;
      const lean = 3;
      animate(x, Math.max(-lean, Math.min(lean, dx * 0.14)), softSpring);
      animate(y, Math.max(-lean, Math.min(lean, dy * 0.14)), softSpring);
    };

    const onLeave = () => {
      if (state !== "idle") return;
      animate(x, 0, softSpring);
      animate(y, 0, softSpring);
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);

    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
      if (pressTimer) clearTimeout(pressTimer);
      stopStream();
    };
  }, [ready, logoRef, reducedMotion, x, y, scale, rotate]);

  return { x, y, scale, rotate, nudge };
}

export default function HomeView() {
  const [ready, setReady] = useState(false);
  const reducedMotion = useReducedMotion();

  const messengerRef = useRef<HTMLSpanElement>(null);
  const mslRef = useRef<HTMLSpanElement>(null);
  const igRef = useRef<HTMLSpanElement>(null);

  const sandboxRef = useRef<PhoneSandboxHandle>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  // Instagram: in reduced motion we cycle through the articles without a
  // pile; each click just opens the next URL. Track the cursor here.
  const igCycleRef = useRef(0);

  // Reduced-motion showcase state: which media item is currently surfaced
  // for each source, or null if nothing. Cycles forward on each click.
  const [mShowIdx, setMShowIdx] = useState<number | null>(null);
  const [msShowIdx, setMsShowIdx] = useState<number | null>(null);

  const getDragForbiddenRect = useCallback(
    () => textRef.current?.getBoundingClientRect() ?? null,
    []
  );

  useEffect(() => {
    preloadImages(PRELOAD_IMAGES).then(() => setReady(true));
    // Pre-decode sfx buffers. AudioContext will stay suspended until the
    // first user gesture — the resume happens automatically on play().
    sfx.preload();
  }, []);

  const getMessengerOrigin = useCallback(() => {
    const el = messengerRef.current;
    if (!el) return { x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }, []);

  const getMslOrigin = useCallback(() => {
    const el = mslRef.current;
    if (!el) return { x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }, []);

  const getIgOrigin = useCallback(() => {
    const el = igRef.current;
    if (!el) return { x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }, []);

  const sources: SandboxSource[] = useMemo(
    () => [
      { id: "messenger", getOrigin: getMessengerOrigin, media: MESSENGER_MEDIA },
      { id: "msl", getOrigin: getMslOrigin, media: MSL_MEDIA },
      { id: "instagram", getOrigin: getIgOrigin, media: INSTAGRAM_MEDIA, randomOrder: true },
    ],
    [getMessengerOrigin, getMslOrigin, getIgOrigin]
  );

  const onMessengerSpawn = useCallback(() => {
    if (reducedMotion) {
      setMShowIdx((i) => (i === null ? 0 : (i + 1) % MESSENGER_MEDIA.length));
    } else {
      sandboxRef.current?.spawn("messenger");
    }
  }, [reducedMotion]);
  const onMslSpawn = useCallback(() => {
    if (reducedMotion) {
      setMsShowIdx(0);
    } else {
      sandboxRef.current?.spawn("msl");
    }
  }, [reducedMotion]);
  const onIgSpawn = useCallback(() => {
    if (reducedMotion) {
      // Reduced motion: open a random linked article. Skip static mocks
      // (no `link`) — reduced-motion users can't inspect those anyway.
      const articles = INSTAGRAM_MEDIA.filter((m) => m.link);
      if (articles.length === 0) return;
      const pick = articles[Math.floor(Math.random() * articles.length)];
      if (pick.link) window.open(pick.link, "_blank", "noopener,noreferrer");
      igCycleRef.current += 1;
    } else {
      sandboxRef.current?.spawn("instagram");
    }
  }, [reducedMotion]);

  const messengerLogo = useLogoPressSpawner({
    ready,
    logoRef: messengerRef,
    onSpawn: onMessengerSpawn,
    reducedMotion,
  });
  const mslLogo = useLogoPressSpawner({
    ready,
    logoRef: mslRef,
    onSpawn: onMslSpawn,
    reducedMotion,
  });
  const igLogo = useLogoPressSpawner({
    ready,
    logoRef: igRef,
    onSpawn: onIgSpawn,
    reducedMotion,
  });

  const dismissShowcase = useCallback(() => {
    setMShowIdx(null);
    setMsShowIdx(null);
  }, []);

  // Idle / off-logo nudge — if the user waits too long OR taps somewhere
  // that isn't a logo, the three logos shiver in sequence to hint "these
  // are the things to press." Skipped once the pile has items (the user
  // figured it out) and during reduced motion.
  useEffect(() => {
    if (!ready || reducedMotion) return;

    const nudgeInstagram = igLogo.nudge;
    const nudgeMessenger = messengerLogo.nudge;
    const nudgeMsl = mslLogo.nudge;

    let lastInteraction = performance.now();
    let lastNudgeAt = 0;
    let timeout1: ReturnType<typeof setTimeout> | null = null;
    let timeout2: ReturnType<typeof setTimeout> | null = null;

    const runNudge = () => {
      const now = performance.now();
      if (now - lastNudgeAt < 2000) return; // don't overlap nudges
      lastNudgeAt = now;
      nudgeInstagram();
      if (timeout1) clearTimeout(timeout1);
      timeout1 = setTimeout(() => nudgeMessenger(), 340);
      if (timeout2) clearTimeout(timeout2);
      timeout2 = setTimeout(() => nudgeMsl(), 680);
    };

    const onPointerDown = (e: PointerEvent) => {
      lastInteraction = performance.now();
      // Only nudge on off-logo taps if the pile is still empty — otherwise
      // the user has already figured it out and the hint becomes noise.
      const count = sandboxRef.current?.count() ?? 0;
      if (count > 0) return;
      const t = e.target as Element | null;
      const logoEls = [
        messengerRef.current,
        mslRef.current,
        igRef.current,
      ];
      const hitLogo = t && logoEls.some((el) => !!el && el.contains(t));
      if (!hitLogo) {
        // Slight delay so the click-catching pointer feedback (if any)
        // happens first, then the nudge draws the eye.
        setTimeout(runNudge, 140);
      }
    };
    const onPointerMove = () => {
      lastInteraction = performance.now();
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const interval = setInterval(() => {
      const count = sandboxRef.current?.count() ?? 0;
      if (count > 0) return;
      if (performance.now() - lastInteraction > 6500) {
        runNudge();
        lastInteraction = performance.now();
      }
    }, 1200);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      clearInterval(interval);
      if (timeout1) clearTimeout(timeout1);
      if (timeout2) clearTimeout(timeout2);
    };
  }, [ready, reducedMotion, igLogo.nudge, messengerLogo.nudge, mslLogo.nudge]);

  if (!ready) return null;

  return (
    <>
      <motion.p
        ref={textRef}
        className="text-[16px] sm:text-[22px] font-medium leading-normal text-black text-left"
        style={{
          // Fill the centered container so each line has the maximum
          // available runway to lay out on a single row. The block is
          // centered in the viewport via the parent flex.
          width: "100%",
        }}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        transition={itemTransition}
      >
        I made conversations <SafeWord /> on{" "}
        <motion.span
          style={{
            display: "inline-block",
            verticalAlign: "middle",
            x: igLogo.x,
            y: igLogo.y,
            scale: igLogo.scale,
            rotate: igLogo.rotate,
          }}
        >
          <LogoWithLabel
            logoSrc="/ig.png"
            labelSrc="/instagram-written.png"
            logoAlt="Instagram"
            labelAlt="Instagram"
            logoSize={24}
            labelWidth={108}
            labelOffset={{ top: -48, left: 7 }}
            logoRef={igRef}
            interactive
          />
        </motion.span>
        <br />
        Then <ExpressiveWord /> on{" "}
        <motion.span
          style={{
            display: "inline-block",
            verticalAlign: "middle",
            x: messengerLogo.x,
            y: messengerLogo.y,
            scale: messengerLogo.scale,
            rotate: messengerLogo.rotate,
          }}
        >
          <LogoWithLabel
            logoSrc="/messenger.png"
            labelSrc="/messenger-written.png"
            logoAlt="Messenger"
            labelAlt="Messenger"
            logoSize={24}
            labelWidth={108}
            labelOffset={{ top: -2, left: 30 }}
            logoRef={messengerRef}
            interactive
          />
        </motion.span>
        <br />
        Now I&apos;m making them <SmartWord /> on{" "}
        <motion.span
          style={{
            display: "inline-block",
            verticalAlign: "middle",
            x: mslLogo.x,
            y: mslLogo.y,
            scale: mslLogo.scale,
            rotate: mslLogo.rotate,
          }}
        >
          <LogoWithLabel
            logoSrc="/metaai.png"
            labelSrc="/msl-written.png"
            logoAlt="Meta Superintelligence Labs"
            labelAlt="MSL (Meta Superintelligence Labs)"
            logoSize={28}
            logoTop={-6}
            labelWidth={202}
            labelOffset={{ top: 36, left: -6 }}
            logoRef={mslRef}
            interactive
          />
        </motion.span>
      </motion.p>

      <MediaPreloader
        media={[
          ...MESSENGER_MEDIA,
          ...MSL_MEDIA,
          ...INSTAGRAM_MEDIA,
          ...SOCIAL_MEDIA,
        ]}
      />
      {reducedMotion ? (
        <QuietShowcase
          messengerItem={mShowIdx !== null ? MESSENGER_MEDIA[mShowIdx] : null}
          mslItem={msShowIdx !== null ? MSL_MEDIA[msShowIdx] : null}
          onDismiss={dismissShowcase}
        />
      ) : (
        <>
          <PhoneSandbox
            ref={sandboxRef}
            sources={sources}
            getDragForbiddenRect={getDragForbiddenRect}
          />
          <SoundToggle />
        </>
      )}
    </>
  );
}
