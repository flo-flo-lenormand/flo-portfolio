"use client";

import { useRef } from "react";
import Link from "next/link";

const SIZE = 64;

function getFaviconLink(): HTMLLinkElement | null {
  return document.querySelector<HTMLLinkElement>('link[rel*="icon"]');
}

// Spring physics — stiffness/damping produce natural acceleration
// dt is in seconds; returns updated position and velocity
function springStep(
  pos: number,
  vel: number,
  target: number,
  dt: number,
  stiffness = 260,
  damping = 28
) {
  const force = stiffness * (target - pos) - damping * vel;
  const newVel = vel + force * dt;
  const newPos = pos + newVel * dt;
  return { pos: newPos, vel: newVel };
}

function drawCircularFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  scale: number
) {
  ctx.clearRect(0, 0, SIZE, SIZE);
  const radius = (SIZE / 2) * scale;
  const offset = (SIZE - SIZE * scale) / 2;
  ctx.save();
  ctx.beginPath();
  ctx.arc(SIZE / 2, SIZE / 2, radius, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(img, offset, offset, SIZE * scale, SIZE * scale);
  ctx.restore();
}

export default function NavName() {
  const originalHref = useRef<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const rafRef = useRef<number | null>(null);
  const springPos = useRef(0);
  const springVel = useRef(0);
  const targetRef = useRef(0);

  function getCanvas() {
    if (!canvasRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = SIZE;
      canvas.height = SIZE;
      canvasRef.current = canvas;
      ctxRef.current = canvas.getContext("2d");
    }
    return { canvas: canvasRef.current, ctx: ctxRef.current! };
  }

  function loadImage(): Promise<HTMLImageElement> {
    if (imgRef.current) return Promise.resolve(imgRef.current);
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        imgRef.current = img;
        resolve(img);
      };
      img.src = "/avatar.jpg";
    });
  }

  function startSpring(target: number) {
    targetRef.current = target;
    if (rafRef.current) return; // already running

    const { canvas, ctx } = getCanvas();
    const img = imgRef.current!;
    const link = getFaviconLink();
    if (!link) return;

    let lastTime: number | null = null;

    function frame(now: number) {
      const dt = Math.min((now - (lastTime ?? now)) / 1000, 0.064); // cap at 64ms
      lastTime = now;

      const { pos, vel } = springStep(
        springPos.current,
        springVel.current,
        targetRef.current,
        dt
      );
      springPos.current = pos;
      springVel.current = vel;

      const settled =
        Math.abs(targetRef.current - pos) < 0.002 &&
        Math.abs(vel) < 0.002;

      const scale = Math.max(0, Math.min(1, pos));
      drawCircularFrame(ctx, img, scale);
      link!.href = canvas.toDataURL("image/png");

      if (settled) {
        rafRef.current = null;
        springPos.current = targetRef.current;
        springVel.current = 0;
        if (targetRef.current === 0 && originalHref.current) {
          link!.href = originalHref.current;
        }
      } else {
        rafRef.current = requestAnimationFrame(frame);
      }
    }

    rafRef.current = requestAnimationFrame(frame);
  }

  const handleMouseEnter = async () => {
    const link = getFaviconLink();
    if (!link) return;
    if (!originalHref.current) originalHref.current = link.href;
    await loadImage();
    startSpring(1);
  };

  const handleMouseLeave = () => {
    if (!imgRef.current) return;
    startSpring(0);
  };

  return (
    <Link
      href="/"
      className="text-gray-900 font-medium hover:text-gray-600 transition-colors active:scale-[0.96] transition-transform duration-150 ease-out inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      Flo Lenormand
    </Link>
  );
}
