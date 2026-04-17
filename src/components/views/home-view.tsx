"use client";

import { useState, useEffect, useRef, useCallback, useImperativeHandle, useMemo, forwardRef } from "react";
import { motion, useAnimationControls } from "motion/react";
import { createPortal } from "react-dom";
import Matter from "matter-js";
import SafeWord from "@/components/magic-words/safe-word";
import ExpressiveWord from "@/components/magic-words/expressive-word";
import SmartWord from "@/components/magic-words/smart-word";

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
          opacity: hovered && !expanded ? 1 : 0,
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
};

// Default aspect for items that don't specify one (iPhone 9:19.5 screen)
const PHONE_ASPECT = 19.5 / 9;

const MESSENGER_MEDIA: MediaItem[] = [
  { src: "/mediapicker3.mp4", id: "picker", type: "video" },
  { src: "/reactions.mp4", id: "reactions", type: "video" },
  { src: "/videocontrols2.mp4", id: "controls", type: "video" },
  { src: "/favorite.mp4", id: "favorite", type: "video" },
  { src: "/loading.mp4", id: "loading", type: "video" },
  { src: "/messenger-screens/exploration01.mp4", id: "explore1", type: "video" },
  { src: "/messenger-screens/exploration02.mp4", id: "explore2", type: "video" },
  { src: "/messenger-screens/exploration03.mp4", id: "explore3", type: "video" },
  { src: "/messenger-screens/03.png", id: "screen03", type: "image" },
  { src: "/messenger-screens/04.png", id: "screen04", type: "image" },
  { src: "/messenger-screens/In-thread.png", id: "inthread", type: "image" },
  { src: "/messenger-screens/In-thread-1.png", id: "inthread1", type: "image" },
  { src: "/messenger-screens/image 403.png", id: "img403", type: "image" },
  { src: "/messenger-screens/image 405.png", id: "img405", type: "image" },
];

// MSL — confidential phone shell (transparent PNG with its own bezel).
// Actual image is 1536x2752 → aspect 1.792.
const MSL_MEDIA: MediaItem[] = [
  {
    src: "/confidential_phone_v3_transparent.png",
    id: "confidential",
    type: "image",
    raw: true,
    aspect: 2752 / 1536,
  },
];

const itemAspect = (item: MediaItem) => item.aspect ?? PHONE_ASPECT;

// ---------------------------------------------------------------------------
// MediaElement — a phone-shaped card
// ---------------------------------------------------------------------------
function MediaElement({ item, width }: { item: MediaItem; width: number }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (item.type === "video" && el) {
      el.play().catch(() => {});
    }
    return () => {
      if (el) el.pause();
    };
  }, [item.type]);

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

  const media =
    item.type === "image" ? (
      <img
        src={item.src}
        alt=""
        className="pointer-events-none select-none"
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    ) : (
      <video
        ref={ref}
        src={item.src}
        muted
        loop
        playsInline
        className="pointer-events-none select-none"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    );

  return (
    <div
      className="pointer-events-none select-none"
      style={{
        width,
        height,
        borderRadius: Math.max(18, width * 0.12),
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
const MAX_ITEMS = 60; // total cap across all sources
const MIN_WIDTH = 110;
const MAX_WIDTH = 200;

type SandboxSource = {
  id: string;
  getOrigin: () => { x: number; y: number };
  media: MediaItem[];
};

type SpawnedItem = {
  key: number;
  sourceId: string;
  mediaIndex: number;
  width: number;
  aspect: number;
  body: Matter.Body;
  bornAt: number;
  emerged: boolean; // once the phone has grown to full size it stays full-size
};

export type PhoneSandboxHandle = {
  spawn: (sourceId: string) => void;
  clearAll: () => void;
  count: () => number;
};

const PhoneSandbox = forwardRef<PhoneSandboxHandle, { sources: SandboxSource[] }>(
  function PhoneSandbox({ sources }, ref) {
    type Frame = {
      x: number;
      y: number;
      angle: number;
      scale: number;
      vx: number;
      vy: number;
      opacity: number;
    };
    const [frames, setFrames] = useState<Record<number, Frame>>({});
    const itemsRef = useRef<SpawnedItem[]>([]);
    const keyRef = useRef(0);
    const countersRef = useRef<Record<string, number>>({});
    const engineRef = useRef<Matter.Engine | null>(null);
    const wallsRef = useRef<Matter.Body[]>([]);
    const rafRef = useRef(0);
    const draggingRef = useRef<Set<number>>(new Set());
    const implodingRef = useRef(false);
    const sourcesRef = useRef<SandboxSource[]>(sources);
    sourcesRef.current = sources;

    // ---- Engine + walls setup (one-time) ----
    useEffect(() => {
      if (typeof window === "undefined") return;

      const engine = Matter.Engine.create({
        gravity: { x: 0, y: 1, scale: 0.0011 },
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
        const ceiling = Matter.Bodies.rectangle(W / 2, -H, W * 2, t, opts);
        const wallL = Matter.Bodies.rectangle(-t / 2 + 8, H / 2, t, H * 4, opts);
        const wallR = Matter.Bodies.rectangle(W + t / 2 - 8, H / 2, t, H * 4, opts);
        wallsRef.current = [floor, ceiling, wallL, wallR];
        Matter.Composite.add(engine.world, wallsRef.current);
      };
      buildWalls();
      window.addEventListener("resize", buildWalls);

      // Find an item's source origin (for implode only)
      const originFor = (sid: string) => {
        const src = sourcesRef.current.find((s) => s.id === sid);
        return src ? src.getOrigin() : { x: 0, y: 0 };
      };

      let last = performance.now();
      const tick = (now: number) => {
        const dt = Math.min(now - last, 32);
        last = now;
        if (itemsRef.current.length > 0) {
          Matter.Engine.update(engine, dt);

          const next: Record<number, Frame> = {};
          for (const it of itemsRef.current) {
            const b = it.body;

            // Restoring torque — keeps phones in portrait orientation.
            // Minimal during fast motion, stronger as they settle.
            if (!b.isStatic) {
              let delta = b.angle;
              while (delta > Math.PI) delta -= Math.PI * 2;
              while (delta < -Math.PI) delta += Math.PI * 2;
              const speed = Math.sqrt(
                b.velocity.x * b.velocity.x + b.velocity.y * b.velocity.y
              );
              const settling = 1 - Math.min(1, speed / 8);
              const kTorque = 0.001 + 0.012 * settling;
              const aDamp = 0.994 - settling * 0.1;
              Matter.Body.setAngularVelocity(
                b,
                b.angularVelocity * aDamp - delta * kTorque
              );
            }

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

            next[it.key] = {
              x: b.position.x,
              y: b.position.y,
              angle: b.angle,
              scale,
              vx: b.velocity.x,
              vy: b.velocity.y,
              opacity,
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

      if (itemsRef.current.length >= MAX_ITEMS) {
        const oldest = itemsRef.current.shift();
        if (oldest) Matter.Composite.remove(engine.world, oldest.body);
      }

      const origin = source.getOrigin();
      const prevCount = countersRef.current[sourceId] ?? 0;
      countersRef.current[sourceId] = prevCount + 1;
      const n = prevCount;

      const mediaIndex = n % source.media.length;
      const mediaItem = source.media[mediaIndex];
      const aspect = itemAspect(mediaItem);
      const width = MIN_WIDTH + Math.random() * (MAX_WIDTH - MIN_WIDTH);
      const height = width * aspect;
      const cornerRadius = Math.max(18, width * 0.12);

      // Trajectory — walked through the golden ratio so every click is fresh.
      const PHI = (1 + Math.sqrt(5)) / 2;
      const baseAngle = ((n * (1 / PHI)) % 1) * Math.PI * 2;
      const theta = -Math.PI / 2 + Math.sin(baseAngle) * (Math.PI * 0.55);
      const speed = 16 + Math.random() * 10;
      const vx = Math.cos(theta) * speed + (Math.random() - 0.5) * 3;
      const vy = Math.sin(theta) * speed - 2;

      const body = Matter.Bodies.rectangle(origin.x, origin.y, width, height, {
        density: 0.0026,
        friction: 0.08,
        frictionStatic: 0.1,
        frictionAir: 0.014,
        restitution: 0.48,
        chamfer: { radius: cornerRadius },
        slop: 0.02,
        angle: (Math.random() - 0.5) * 0.25,
      });
      Matter.Body.setVelocity(body, { x: vx, y: vy });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.32);

      itemsRef.current.push({
        key: keyRef.current++,
        sourceId,
        mediaIndex,
        width,
        aspect,
        body,
        bornAt: performance.now(),
        emerged: false,
      });
      Matter.Composite.add(engine.world, body);
    }, []);

    const clearAll = useCallback(() => {
      if (itemsRef.current.length === 0) return;
      implodingRef.current = true;
    }, []);

    const count = useCallback(() => itemsRef.current.length, []);

    useImperativeHandle(ref, () => ({ spawn, clearAll, count }), [spawn, clearAll, count]);

    // ---- Escape to clear ----
    useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") clearAll();
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [clearAll]);

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

      const offsetX = e.clientX - body.position.x;
      const offsetY = e.clientY - body.position.y;

      type Sample = { x: number; y: number; t: number };
      const history: Sample[] = [{ x: e.clientX, y: e.clientY, t: performance.now() }];

      const onMove = (ev: PointerEvent) => {
        if (ev.pointerId !== e.pointerId) return;
        Matter.Body.setPosition(body, {
          x: ev.clientX - offsetX,
          y: ev.clientY - offsetY,
        });
        Matter.Body.setAngle(body, body.angle * 0.92);
        history.push({ x: ev.clientX, y: ev.clientY, t: performance.now() });
        const cutoff = performance.now() - 90;
        while (history.length > 2 && history[0].t < cutoff) history.shift();
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

        const first = history[0];
        const lastSample = history[history.length - 1];
        const dt = Math.max(16, lastSample.t - first.t);
        const vx = ((lastSample.x - first.x) / dt) * 16;
        const vy = ((lastSample.y - first.y) / dt) * 16;

        Matter.Body.setStatic(body, false);
        Matter.Body.setVelocity(body, {
          x: Math.max(-30, Math.min(30, vx)),
          y: Math.max(-30, Math.min(30, vy)),
        });
        Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.08);
        draggingRef.current.delete(key);
      };

      target.addEventListener("pointermove", onMove);
      target.addEventListener("pointerup", onUp);
      target.addEventListener("pointercancel", onUp);
    }, []);

    if (typeof document === "undefined") return null;
    if (Object.keys(frames).length === 0 && !implodingRef.current) return null;

    return createPortal(
      <>
        {itemsRef.current.map((it) => {
          const f = frames[it.key];
          if (!f || f.scale < 0.02) return null;
          const source = sources.find((s) => s.id === it.sourceId);
          if (!source) return null;
          const mediaItem = source.media[it.mediaIndex];
          const isDragging = draggingRef.current.has(it.key);
          return (
            <div
              key={it.key}
              className="fixed z-50 select-none"
              style={{
                left: f.x,
                top: f.y,
                transform: `translate(-50%, -50%) rotate(${f.angle}rad) scale(${f.scale * (isDragging ? 1.04 : 1)})`,
                transformOrigin: "center center",
                cursor: isDragging ? "grabbing" : "grab",
                willChange: "transform, opacity",
                opacity: f.opacity,
                touchAction: "none",
                transition: isDragging ? "transform 120ms cubic-bezier(.2,.9,.3,1.2)" : undefined,
              }}
              onPointerDown={(e) => startDrag(e, it.key)}
            >
              <MediaElement item={mediaItem} width={it.width} />
            </div>
          );
        })}
      </>,
      document.body
    );
  }
);

// Silent preloader — mounts hidden videos so they buffer before the first
// click. Without this, the first phone to spawn shows a black rectangle
// while the video element fetches its bytes.
function MediaPreloader({ media }: { media: MediaItem[] }) {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        width: 0,
        height: 0,
        overflow: "hidden",
        pointerEvents: "none",
        opacity: 0,
      }}
    >
      {media.map((m) =>
        m.type === "video" ? (
          <video key={m.id} src={m.src} preload="auto" muted playsInline />
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

// Reusable: wires click + long-press on a logo to the sandbox's spawn() with
// a satisfying scale "kick" on the logo each time.
function useLogoPressSpawner(params: {
  ready: boolean;
  logoRef: React.RefObject<HTMLElement | null>;
  onSpawn: () => void;
  kickControls: ReturnType<typeof useAnimationControls>;
}) {
  const { ready, logoRef, onSpawn, kickControls } = params;

  // Keep onSpawn fresh without re-attaching event listeners
  const onSpawnRef = useRef(onSpawn);
  useEffect(() => {
    onSpawnRef.current = onSpawn;
  }, [onSpawn]);

  useEffect(() => {
    if (!ready) return;
    const el = logoRef.current;
    if (!el) return;

    let pressTimer: ReturnType<typeof setTimeout> | null = null;
    let streamInterval: ReturnType<typeof setInterval> | null = null;
    let streamAccel: ReturnType<typeof setInterval> | null = null;
    let streamDelay = 110;
    let isLongPressing = false;
    let pointerDown = false;
    let pressPointerId: number | null = null;

    const kick = () => {
      kickControls.start(
        { scale: [1, 1.18, 1] },
        { duration: 0.32, ease: [0.2, 0.9, 0.3, 1.2] }
      );
    };

    const fire = () => {
      onSpawnRef.current();
      kick();
    };

    const startStream = () => {
      isLongPressing = true;
      fire();
      streamInterval = setInterval(fire, streamDelay);
      streamAccel = setInterval(() => {
        if (streamDelay > 55) {
          streamDelay -= 6;
          if (streamInterval) clearInterval(streamInterval);
          streamInterval = setInterval(fire, streamDelay);
        }
      }, 220);
    };

    const stopStream = () => {
      if (streamInterval) clearInterval(streamInterval);
      if (streamAccel) clearInterval(streamAccel);
      streamInterval = null;
      streamAccel = null;
      streamDelay = 110;
    };

    const onDown = (e: PointerEvent) => {
      if (pointerDown) return;
      pointerDown = true;
      pressPointerId = e.pointerId;
      isLongPressing = false;
      e.preventDefault();
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
      if (isLongPressing) {
        stopStream();
        isLongPressing = false;
      } else {
        fire();
      }
    };

    const onCancel = () => {
      if (pressTimer) clearTimeout(pressTimer);
      pressTimer = null;
      stopStream();
      isLongPressing = false;
      pointerDown = false;
      pressPointerId = null;
    };

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);

    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
      if (pressTimer) clearTimeout(pressTimer);
      stopStream();
    };
  }, [ready, logoRef, kickControls]);
}

export default function HomeView() {
  const [ready, setReady] = useState(false);

  const messengerRef = useRef<HTMLSpanElement>(null);
  const messengerKick = useAnimationControls();

  const mslRef = useRef<HTMLSpanElement>(null);
  const mslKick = useAnimationControls();

  const sandboxRef = useRef<PhoneSandboxHandle>(null);

  useEffect(() => {
    preloadImages(PRELOAD_IMAGES).then(() => setReady(true));
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

  const sources: SandboxSource[] = useMemo(
    () => [
      { id: "messenger", getOrigin: getMessengerOrigin, media: MESSENGER_MEDIA },
      { id: "msl", getOrigin: getMslOrigin, media: MSL_MEDIA },
    ],
    [getMessengerOrigin, getMslOrigin]
  );

  useLogoPressSpawner({
    ready,
    logoRef: messengerRef,
    kickControls: messengerKick,
    onSpawn: useCallback(() => sandboxRef.current?.spawn("messenger"), []),
  });
  useLogoPressSpawner({
    ready,
    logoRef: mslRef,
    kickControls: mslKick,
    onSpawn: useCallback(() => sandboxRef.current?.spawn("msl"), []),
  });

  if (!ready) return null;

  return (
    <>
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
        <motion.span
          style={{ display: "inline-block", verticalAlign: "middle" }}
          animate={messengerKick}
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
          style={{ display: "inline-block", verticalAlign: "middle" }}
          animate={mslKick}
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

      <MediaPreloader media={[...MESSENGER_MEDIA, ...MSL_MEDIA]} />
      <PhoneSandbox ref={sandboxRef} sources={sources} />
    </>
  );
}
