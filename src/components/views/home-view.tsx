"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
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
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      ref={logoRef}
      className={`relative inline-block overflow-visible ${onClick ? "cursor-pointer" : "cursor-default"}`}
      style={{ width: logoSize, height: logoSize, verticalAlign: "middle", position: "relative", top: logoTop }}
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
        style={{ verticalAlign: "middle" }}
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
// Media data
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

// Varied widths for visual hierarchy (compact by default, scaled to viewport below)
const ITEM_WIDTHS = MESSENGER_MEDIA.map((_, i) => {
  const seed = (i * 11 + 3) % 19;
  return 150 + (seed / 19) * 90; // 150–240px
});

// Radius at which items finish emerging from the logo (scale reaches 1.0)
const EMERGENCE_RADIUS = 140;

// ---------------------------------------------------------------------------
// MediaElement
// ---------------------------------------------------------------------------
function MediaElement({ item, width }: { item: MediaItem; width: number }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (item.type === "video" && ref.current) {
      ref.current.play().catch(() => {});
    }
    return () => {
      if (ref.current) ref.current.pause();
    };
  }, [item.type]);

  if (item.type === "image") {
    return <img src={item.src} alt="" className="rounded-lg pointer-events-none" draggable={false} style={{ width, height: "auto" }} />;
  }

  return (
    <video ref={ref} src={item.src} muted loop playsInline className="rounded-lg pointer-events-none" style={{ width, height: "auto" }} />
  );
}

// ---------------------------------------------------------------------------
// VideoBurst - explode from icon, physics, drag, suck back on close
// ---------------------------------------------------------------------------
type BurstPhase = "closed" | "exploding" | "open" | "imploding";

function VideoBurst({
  open,
  onClose,
  originX,
  originY,
}: {
  open: boolean;
  onClose: () => void;
  originX: number;
  originY: number;
}) {
  const [positions, setPositions] = useState<{ x: number; y: number; angle: number; scale: number }[]>(
    () => MESSENGER_MEDIA.map(() => ({ x: 0, y: 0, angle: 0, scale: 0 }))
  );
  const [phase, setPhase] = useState<BurstPhase>("closed");
  const engineRef = useRef<Matter.Engine | null>(null);
  const bodiesRef = useRef<Matter.Body[]>([]);
  const rafRef = useRef<number>(0);
  const dragRef = useRef<{
    body: Matter.Body;
    offset: { x: number; y: number };
    lastMouse: { x: number; y: number };
    velocity: { x: number; y: number };
  } | null>(null);
  const isDraggingRef = useRef(false);
  const hoveredRef = useRef<number | null>(null);
  // Once an item has fully emerged, lock its scale so wall-bounces near the origin
  // don't make it shrink mid-flight.
  const emergedRef = useRef<boolean[]>([]);

  // ---- Drag handlers ----
  const startDrag = useCallback((clientX: number, clientY: number, bodyIndex: number) => {
    const body = bodiesRef.current[bodyIndex];
    if (!body) return;

    isDraggingRef.current = true;
    Matter.Body.setStatic(body, true);
    Matter.Body.setAngularVelocity(body, 0);
    Matter.Body.setVelocity(body, { x: 0, y: 0 });

    const offsetX = clientX - body.position.x;
    const offsetY = clientY - body.position.y;
    let lastX = clientX;
    let lastY = clientY;
    let velX = 0;
    let velY = 0;

    function onMove(ev: MouseEvent) {
      velX = ev.clientX - lastX;
      velY = ev.clientY - lastY;
      lastX = ev.clientX;
      lastY = ev.clientY;
      Matter.Body.setPosition(body, {
        x: ev.clientX - offsetX,
        y: ev.clientY - offsetY,
      });
      Matter.Body.setAngle(body, body.angle * 0.95);
    }

    function onUp() {
      Matter.Body.setStatic(body, false);
      // Gentle throw — cap speed so it never launches off-screen
      const throwX = Math.max(-22, Math.min(22, velX * 1.4));
      const throwY = Math.max(-22, Math.min(22, velY * 1.4));
      Matter.Body.setVelocity(body, { x: throwX, y: throwY });
      dragRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      setTimeout(() => { isDraggingRef.current = false; }, 100);
    }

    dragRef.current = { body, offset: { x: offsetX, y: offsetY }, lastMouse: { x: lastX, y: lastY }, velocity: { x: 0, y: 0 } };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, []);

  // ---- OPEN: Explode from icon ----
  useEffect(() => {
    if (open && phase === "closed") {
      // Initialize all positions at the icon
      setPositions(MESSENGER_MEDIA.map(() => ({ x: originX, y: originY, angle: 0, scale: 0 })));
      setPhase("exploding");
    }
  }, [open, phase, originX, originY]);

  useEffect(() => {
    if (phase !== "exploding") return;

    const w = window.innerWidth;
    const h = window.innerHeight;

    // Widest item caps how close walls can sit to the viewport edge
    const maxItemW = Math.max(...ITEM_WIDTHS);
    const maxItemH = maxItemW * 1.8;
    const padX = 24 + maxItemW / 2;
    const padY = 24 + maxItemH / 2;

    // Zero gravity: items float, feel weightless and deliberate
    const engine = Matter.Engine.create({ gravity: { x: 0, y: 0 } });
    engineRef.current = engine;

    // Padding-aware walls so no item ever clips the viewport edge
    const wallOpts = { isStatic: true, restitution: 0.4 };
    const floor = Matter.Bodies.rectangle(w / 2, h - padY + 25, w * 2, 50, wallOpts);
    const ceiling = Matter.Bodies.rectangle(w / 2, padY - 25, w * 2, 50, wallOpts);
    const wallL = Matter.Bodies.rectangle(padX - 25, h / 2, 50, h * 2, wallOpts);
    const wallR = Matter.Bodies.rectangle(w - padX + 25, h / 2, 50, h * 2, wallOpts);
    Matter.Composite.add(engine.world, [floor, ceiling, wallL, wallR]);

    // Spawn bodies one by one from the icon, staggered
    const bodies: (Matter.Body | null)[] = new Array(MESSENGER_MEDIA.length).fill(null);
    const spawnTimes: number[] = new Array(MESSENGER_MEDIA.length).fill(0);
    const spawnTimers: ReturnType<typeof setTimeout>[] = [];
    bodiesRef.current = bodies as Matter.Body[];
    emergedRef.current = new Array(MESSENGER_MEDIA.length).fill(false);

    // Golden-angle radial distribution — organic, evenly spread, no clumping
    const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
    const STAGGER_MS = 70;

    MESSENGER_MEDIA.forEach((_, i) => {
      const timer = setTimeout(() => {
        const itemW = ITEM_WIDTHS[i];
        const itemH = itemW * 1.8;
        const seed = (i * 7 + 13) % 17;

        const body = Matter.Bodies.rectangle(originX, originY, itemW, itemH, {
          restitution: 0.4,
          friction: 0.2,
          frictionAir: 0.035, // high drag — settles naturally, feels premium
          angle: ((seed - 8) / 8) * 0.12,
          chamfer: { radius: 12 },
          // Negative group = these bodies pass through each other but collide with walls (group 0)
          collisionFilter: { group: -1 },
        });

        // Radial burst in all directions, with a slight upward lift for character
        const angle = i * GOLDEN_ANGLE - Math.PI / 2;
        const speed = 9 + (seed / 17) * 3; // 9–12 px/frame, gentle
        Matter.Body.setVelocity(body, {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed - 1.2,
        });
        Matter.Body.setAngularVelocity(body, ((seed - 8) / 17) * 0.025);

        bodies[i] = body;
        spawnTimes[i] = performance.now();
        Matter.Composite.add(engine.world, body);
      }, i * STAGGER_MS);

      spawnTimers.push(timer);
    });

    // Animation loop
    let lastTime = performance.now();

    function step(time: number) {
      const delta = Math.min(time - lastTime, 16.667);
      lastTime = time;
      if (delta > 0) Matter.Engine.update(engine, delta);

      // Hover: gently settle the hovered item (straighten, dampen)
      const hIdx = hoveredRef.current;
      if (hIdx !== null && bodies[hIdx] && !dragRef.current) {
        const b = bodies[hIdx]!;
        if (!b.isStatic) {
          Matter.Body.setVelocity(b, { x: b.velocity.x * 0.85, y: b.velocity.y * 0.85 });
          Matter.Body.setAngle(b, b.angle * 0.88);
          Matter.Body.setAngularVelocity(b, b.angularVelocity * 0.85);
        }
      }

      setPositions(
        MESSENGER_MEDIA.map((_, idx) => {
          const b = bodies[idx];
          if (!b || !spawnTimes[idx]) {
            return { x: originX, y: originY, angle: 0, scale: 0 };
          }
          // Scale driven by distance from origin — items literally grow from the logo.
          let scale: number;
          if (emergedRef.current[idx]) {
            scale = 1;
          } else {
            const dx = b.position.x - originX;
            const dy = b.position.y - originY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const distScale = Math.min(1, dist / EMERGENCE_RADIUS);
            // Small time floor so newly spawned items aren't invisible frame-1
            const age = time - spawnTimes[idx];
            const timeScale = Math.min(1, age / 180);
            scale = Math.min(distScale, timeScale);
            if (scale >= 1) emergedRef.current[idx] = true;
          }
          return { x: b.position.x, y: b.position.y, angle: b.angle, scale };
        })
      );

      rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);

    const openTimer = setTimeout(() => {
      setPhase("open");
    }, MESSENGER_MEDIA.length * STAGGER_MS + 400);

    return () => {
      spawnTimers.forEach(clearTimeout);
      clearTimeout(openTimer);
      cancelAnimationFrame(rafRef.current);
    };
  }, [phase, originX, originY]);

  // ---- CLOSE: Implode back to icon ----
  const startClose = useCallback(() => {
    if (isDraggingRef.current || phase === "imploding" || phase === "closed") return;
    setPhase("imploding");

    const bodies = bodiesRef.current;
    const engine = engineRef.current;
    if (!engine || !bodies.length) {
      setPhase("closed");

      onClose();
      return;
    }

    engine.gravity.y = 0;
    engine.gravity.x = 0;

    let frame = 0;
    const totalFrames = 46;

    function implodeStep() {
      if (!engine) return;
      frame++;
      // easeInCubic — slow start, accelerates into the logo
      const t = frame / totalFrames;
      const progress = t * t * t;

      bodies.forEach((b) => {
        if (!b || b.isStatic) return;
        const dx = originX - b.position.x;
        const dy = originY - b.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        // Accelerating pull toward the logo
        const strength = 0.0018 + progress * 0.020;
        Matter.Body.applyForce(b, b.position, {
          x: (dx / dist) * strength * b.mass,
          y: (dy / dist) * strength * b.mass,
        });

        // Damping climbs with progress so items funnel cleanly into the origin
        const damp = 0.94 - progress * 0.22;
        Matter.Body.setVelocity(b, { x: b.velocity.x * damp, y: b.velocity.y * damp });
        Matter.Body.setAngularVelocity(b, b.angularVelocity * 0.88);
      });

      setPositions(
        bodies.map((b) => {
          if (!b) return { x: originX, y: originY, angle: 0, scale: 0 };
          const dx = originX - b.position.x;
          const dy = originY - b.position.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          // Mirror of entry: items shrink as they approach the logo
          const scale = Math.max(0, Math.min(1, dist / EMERGENCE_RADIUS));
          return { x: b.position.x, y: b.position.y, angle: b.angle, scale };
        })
      );

      Matter.Engine.update(engine!, 16);

      if (frame < totalFrames) {
        rafRef.current = requestAnimationFrame(implodeStep);
      } else {
        // Cleanup
        cancelAnimationFrame(rafRef.current);
        Matter.Engine.clear(engine);
        engineRef.current = null;
        bodiesRef.current = [];
        setPositions([]);
        setPhase("closed");

        onClose();
      }
    }

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(implodeStep);
  }, [phase, originX, originY, onClose]);

  // Escape key
  useEffect(() => {
    if (phase === "closed") return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") startClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [phase, startClose]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current);
      }
    };
  }, []);

  if (phase === "closed" || typeof document === "undefined") return null;

  const closing = phase === "imploding";

  return createPortal(
    <>
      {/* Soft backdrop — fades the page so prototypes feel intentional */}
      <div
        className="fixed inset-0 z-40"
        onClick={() => { if (!isDraggingRef.current) startClose(); }}
        style={{
          backgroundColor: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          opacity: closing ? 0 : 1,
          transition: "opacity 420ms cubic-bezier(0.2, 0, 0, 1)",
        }}
      />

      {/* Physics items */}
      {MESSENGER_MEDIA.map((item, i) => {
        const pos = positions[i];
        if (!pos || pos.scale < 0.02) return null;
        const w = ITEM_WIDTHS[i];
        // Opacity matches scale for an ultra-clean emerge/recede
        const opacity = Math.min(1, pos.scale * 1.15);
        return (
          <div
            key={item.id}
            className="fixed z-50 select-none"
            style={{
              left: pos.x,
              top: pos.y,
              transform: `translate(-50%, -50%) rotate(${pos.angle}rad) scale(${pos.scale})`,
              transformOrigin: "center center",
              cursor: "grab",
              willChange: "transform, opacity",
              opacity,
              filter: "drop-shadow(0 12px 28px rgba(15, 20, 45, 0.14)) drop-shadow(0 2px 6px rgba(15, 20, 45, 0.08))",
            }}
            onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); startDrag(e.clientX, e.clientY, i); }}
            onMouseEnter={() => { hoveredRef.current = i; }}
            onMouseLeave={() => { if (hoveredRef.current === i) hoveredRef.current = null; }}
          >
            <MediaElement item={item} width={w} />
          </div>
        );
      })}
    </>,
    document.body
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

export default function HomeView() {
  const [ready, setReady] = useState(false);
  const [messengerBurst, setMessengerBurst] = useState(false);
  const [textDim, setTextDim] = useState(false);
  const messengerRef = useRef<HTMLSpanElement>(null);
  const iconPosRef = useRef({ x: 0, y: 0 });
  const [iconPos, setIconPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    preloadImages(PRELOAD_IMAGES).then(() => setReady(true));
  }, []);

  const toggleMessengerBurst = useCallback(() => {
    if (messengerRef.current) {
      const rect = messengerRef.current.getBoundingClientRect();
      iconPosRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      setIconPos(iconPosRef.current);
    }
    setMessengerBurst((v) => {
      setTextDim(!v);
      return !v;
    });
  }, []);

  const closeMessengerBurst = useCallback(() => {
    setMessengerBurst(false);
    setTextDim(false);
  }, []);

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
        <motion.span
          animate={{ opacity: textDim ? 0.15 : 1 }}
          transition={{ duration: 0.4, ease: [0.25, 0, 0, 1] }}
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
        </motion.span>
        <LogoWithLabel
          logoSrc="/messenger.png"
          labelSrc="/messenger-written.png"
          logoAlt="Messenger"
          labelAlt="Messenger"
          logoSize={24}
          labelWidth={108}
          labelOffset={{ top: -2, left: 30 }}
          onClick={toggleMessengerBurst}
          expanded={messengerBurst}
          logoRef={messengerRef}
        />
        <motion.span
          animate={{ opacity: textDim ? 0.15 : 1 }}
          transition={{ duration: 0.4, ease: [0.25, 0, 0, 1] }}
        >
          <br />
          Now I&apos;m making them{" "}
          <SmartWord /> on{" "}
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
        </motion.span>
      </motion.p>

      <VideoBurst
        open={messengerBurst}
        onClose={closeMessengerBurst}
        originX={iconPos.x}
        originY={iconPos.y}
      />
    </>
  );
}
