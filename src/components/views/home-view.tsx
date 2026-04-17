"use client";

import { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from "react";
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
type MediaItem = { src: string; id: string; type: "video" | "image" };

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

// ---------------------------------------------------------------------------
// MediaElement
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

  if (item.type === "image") {
    return (
      <img
        src={item.src}
        alt=""
        className="rounded-xl pointer-events-none select-none"
        draggable={false}
        style={{ width, height: "auto", display: "block" }}
      />
    );
  }

  return (
    <video
      ref={ref}
      src={item.src}
      muted
      loop
      playsInline
      className="rounded-xl pointer-events-none select-none"
      style={{ width, height: "auto", display: "block" }}
    />
  );
}

// ---------------------------------------------------------------------------
// MessengerFountain
// Long-lived physics sandbox. Each spawnOne() call spits one random screen
// out of the logo with a fresh trajectory.
// ---------------------------------------------------------------------------
const MAX_ITEMS = 60; // cap so long-press doesn't explode forever
const MIN_WIDTH = 140;
const MAX_WIDTH = 260;

type SpawnedItem = {
  key: number;
  mediaIndex: number;
  width: number;
  body: Matter.Body;
  bornAt: number;
  dragOverride?: { angle: number } | null;
};

export type MessengerFountainHandle = {
  spawnOne: () => void;
  clearAll: () => void;
  count: () => number;
};

const MessengerFountain = forwardRef<MessengerFountainHandle, { getOrigin: () => { x: number; y: number } }>(
  function MessengerFountain({ getOrigin }, ref) {
    // Frame-synced positions for every live item
    type Frame = { x: number; y: number; angle: number; scale: number; vy: number; vx: number; opacity: number };
    const [frames, setFrames] = useState<Record<number, Frame>>({});
    const itemsRef = useRef<SpawnedItem[]>([]);
    const keyRef = useRef(0);
    const spawnCountRef = useRef(0);
    const engineRef = useRef<Matter.Engine | null>(null);
    const wallsRef = useRef<Matter.Body[]>([]);
    const rafRef = useRef(0);
    const draggingRef = useRef<Set<number>>(new Set());
    const implodingRef = useRef(false);

    // ---- Engine + walls setup (one-time) ----
    useEffect(() => {
      if (typeof window === "undefined") return;

      const engine = Matter.Engine.create({
        gravity: { x: 0, y: 1, scale: 0.0011 },
        positionIterations: 8,
        velocityIterations: 8,
      });
      engineRef.current = engine;

      const w = () => window.innerWidth;
      const h = () => window.innerHeight;

      const buildWalls = () => {
        if (wallsRef.current.length) {
          Matter.Composite.remove(engine.world, wallsRef.current);
        }
        const W = w();
        const H = h();
        const t = 80;
        const opts = { isStatic: true, restitution: 0.35, friction: 0.9 };
        const floor = Matter.Bodies.rectangle(W / 2, H + t / 2 - 8, W * 2, t, opts);
        const ceiling = Matter.Bodies.rectangle(W / 2, -H, W * 2, t, opts); // far above — lets items arc high without bonking
        const wallL = Matter.Bodies.rectangle(-t / 2 + 8, H / 2, t, H * 4, opts);
        const wallR = Matter.Bodies.rectangle(W + t / 2 - 8, H / 2, t, H * 4, opts);
        wallsRef.current = [floor, ceiling, wallL, wallR];
        Matter.Composite.add(engine.world, wallsRef.current);
      };
      buildWalls();
      window.addEventListener("resize", buildWalls);

      let last = performance.now();
      const tick = (now: number) => {
        const dt = Math.min(now - last, 32);
        last = now;
        if (itemsRef.current.length > 0) {
          Matter.Engine.update(engine, dt);

          const next: Record<number, Frame> = {};
          const origin = getOrigin();
          for (const it of itemsRef.current) {
            const b = it.body;

            // Keep the phone portrait: apply a restoring torque toward the
            // nearest upright orientation. Minimal during fast motion so the
            // burst still tumbles, stronger as the phone slows and settles.
            if (!b.isStatic) {
              let delta = b.angle;
              while (delta > Math.PI) delta -= Math.PI * 2;
              while (delta < -Math.PI) delta += Math.PI * 2;
              const speed = Math.sqrt(b.velocity.x * b.velocity.x + b.velocity.y * b.velocity.y);
              const settling = 1 - Math.min(1, speed / 8);
              const kTorque = 0.0010 + 0.012 * settling;
              const aDamp = 0.994 - settling * 0.10;
              Matter.Body.setAngularVelocity(b, b.angularVelocity * aDamp - delta * kTorque);
            }

            // Emerge scale — items literally grow out of the logo during the first ~140px
            const dx = b.position.x - origin.x;
            const dy = b.position.y - origin.y;
            const emergeDist = Math.sqrt(dx * dx + dy * dy);
            const timeAge = now - it.bornAt;
            const emergeT = Math.min(1, timeAge / 180);
            const emergeD = Math.min(1, emergeDist / 120);
            const emergeScale = Math.min(emergeT, emergeD);

            // Implode scale — when clearAll triggered, items get sucked back in
            let scale = emergeScale;
            let opacity = Math.min(1, emergeScale * 1.4);
            if (implodingRef.current) {
              scale = Math.max(0, Math.min(scale, emergeDist / 120));
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

          // Implosion: apply strong pull toward origin
          if (implodingRef.current) {
            const origin2 = getOrigin();
            for (const it of itemsRef.current) {
              const b = it.body;
              if (b.isStatic) continue;
              const dx = origin2.x - b.position.x;
              const dy = origin2.y - b.position.y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              Matter.Body.applyForce(b, b.position, {
                x: (dx / dist) * 0.02 * b.mass,
                y: (dy / dist) * 0.02 * b.mass,
              });
              Matter.Body.setVelocity(b, { x: b.velocity.x * 0.9, y: b.velocity.y * 0.9 });
              Matter.Body.setAngularVelocity(b, b.angularVelocity * 0.9);
              // Fully consumed — remove
              if (dist < 28) {
                Matter.Composite.remove(engine.world, b);
              }
            }
            itemsRef.current = itemsRef.current.filter((it) => {
              const dx = origin2.x - it.body.position.x;
              const dy = origin2.y - it.body.position.y;
              return Math.sqrt(dx * dx + dy * dy) >= 28;
            });
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

    // ---- Spawn one item ----
    const spawnOne = useCallback(() => {
      const engine = engineRef.current;
      if (!engine) return;
      if (implodingRef.current) {
        // Cancel implode if user starts spawning again
        implodingRef.current = false;
      }

      // Cull oldest if we've hit the cap
      if (itemsRef.current.length >= MAX_ITEMS) {
        const oldest = itemsRef.current.shift();
        if (oldest) Matter.Composite.remove(engine.world, oldest.body);
      }

      const origin = getOrigin();
      const n = spawnCountRef.current++;

      // Pick a random asset, varied size
      const mediaIndex = Math.floor(Math.random() * MESSENGER_MEDIA.length);
      const width = MIN_WIDTH + Math.random() * (MAX_WIDTH - MIN_WIDTH);
      const height = width * 1.75;

      // Trajectory: varied upward cone. Alternate sides; each click gets a fresh curve.
      // Base angle walks around via golden ratio for visual variety.
      const PHI = (1 + Math.sqrt(5)) / 2;
      const baseAngle = ((n * (1 / PHI)) % 1) * Math.PI * 2;
      // Restrict to an upward 220° arc (-20° to -200° in screen coords)
      const theta = -Math.PI / 2 + Math.sin(baseAngle) * (Math.PI * 0.55);
      const speed = 16 + Math.random() * 10; // 16–26 px/frame
      const vx = Math.cos(theta) * speed + (Math.random() - 0.5) * 3;
      const vy = Math.sin(theta) * speed - 2; // small extra lift

      const body = Matter.Bodies.rectangle(origin.x, origin.y, width, height, {
        density: 0.0024,
        friction: 0.32,
        frictionAir: 0.012,
        restitution: 0.36,
        chamfer: { radius: 14 },
        slop: 0.02,
        angle: (Math.random() - 0.5) * 0.25,
      });
      Matter.Body.setVelocity(body, { x: vx, y: vy });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.32);

      const item: SpawnedItem = {
        key: keyRef.current++,
        mediaIndex,
        width,
        body,
        bornAt: performance.now(),
      };
      itemsRef.current.push(item);
      Matter.Composite.add(engine.world, body);
    }, [getOrigin]);

    const clearAll = useCallback(() => {
      if (itemsRef.current.length === 0) return;
      implodingRef.current = true;
    }, []);

    const count = useCallback(() => itemsRef.current.length, []);

    useImperativeHandle(ref, () => ({ spawnOne, clearAll, count }), [spawnOne, clearAll, count]);

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

      // Rolling velocity buffer for a natural throw
      type Sample = { x: number; y: number; t: number };
      const history: Sample[] = [{ x: e.clientX, y: e.clientY, t: performance.now() }];

      const onMove = (ev: PointerEvent) => {
        if (ev.pointerId !== e.pointerId) return;
        Matter.Body.setPosition(body, {
          x: ev.clientX - offsetX,
          y: ev.clientY - offsetY,
        });
        // Relax angle toward zero as user drags — reads as "picking up"
        Matter.Body.setAngle(body, body.angle * 0.92);
        history.push({ x: ev.clientX, y: ev.clientY, t: performance.now() });
        // Keep only last ~80ms
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

        // Average velocity over the sample window
        const first = history[0];
        const last = history[history.length - 1];
        const dt = Math.max(16, last.t - first.t);
        const vx = ((last.x - first.x) / dt) * 16; // px per frame at 60fps
        const vy = ((last.y - first.y) / dt) * 16;

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
          const media = MESSENGER_MEDIA[it.mediaIndex];
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
              <MediaElement item={media} width={it.width} />
            </div>
          );
        })}
      </>,
      document.body
    );
  }
);

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

export default function HomeView() {
  const [ready, setReady] = useState(false);
  const messengerRef = useRef<HTMLSpanElement>(null);
  const fountainRef = useRef<MessengerFountainHandle>(null);
  const kickControls = useAnimationControls();

  useEffect(() => {
    preloadImages(PRELOAD_IMAGES).then(() => setReady(true));
  }, []);

  // Live origin — always reads the logo's current screen position
  const getOrigin = useCallback(() => {
    const el = messengerRef.current;
    if (!el) return { x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }, []);

  // Click + long-press handling on the messenger logo
  useEffect(() => {
    if (!ready) return;
    const el = messengerRef.current;
    if (!el) return;

    let pressTimer: ReturnType<typeof setTimeout> | null = null;
    let streamInterval: ReturnType<typeof setInterval> | null = null;
    let streamAccel: ReturnType<typeof setInterval> | null = null;
    let streamDelay = 110; // ms between spawns during long press, speeds up over time
    let isLongPressing = false;
    let pointerDown = false;
    let pressPointerId: number | null = null;

    const kick = () => {
      kickControls.start(
        { scale: [1, 1.18, 1] },
        { duration: 0.32, ease: [0.2, 0.9, 0.3, 1.2] }
      );
    };

    const startStream = () => {
      isLongPressing = true;
      // Immediate kick
      fountainRef.current?.spawnOne();
      kick();
      const run = () => {
        fountainRef.current?.spawnOne();
        kick();
      };
      streamInterval = setInterval(run, streamDelay);
      // Gentle ramp: interval shortens over ~2s from 110ms → 55ms
      streamAccel = setInterval(() => {
        if (streamDelay > 55) {
          streamDelay -= 6;
          if (streamInterval) clearInterval(streamInterval);
          streamInterval = setInterval(run, streamDelay);
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
        // Plain click — one single spit
        fountainRef.current?.spawnOne();
        kick();
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
  }, [ready, kickControls]);

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
          animate={kickControls}
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
        <LogoWithLabel
          logoSrc="/metaai.png"
          labelSrc="/msl-written.png"
          logoAlt="Meta Superintelligence Labs"
          labelAlt="MSL (Meta Superintelligence Labs)"
          logoSize={28}
          logoTop={-6}
          labelWidth={202}
          labelOffset={{ top: 36, left: -6 }}
        />
      </motion.p>

      <MessengerFountain ref={fountainRef} getOrigin={getOrigin} />
    </>
  );
}
