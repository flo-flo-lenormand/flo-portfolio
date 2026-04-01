"use client";

import { useRef } from "react";
import Link from "next/link";

const SIZE = 64;

function getFaviconLink(): HTMLLinkElement | null {
  return document.querySelector<HTMLLinkElement>('link[rel*="icon"]');
}

// Ease out cubic — fast start, soft landing
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
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
  const currentScale = useRef(0);

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

  function animateTo(target: number, duration: number) {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const { canvas, ctx } = getCanvas();
    const img = imgRef.current!;
    const link = getFaviconLink();
    if (!link) return;

    const startScale = currentScale.current;
    const startTime = performance.now();

    function frame(now: number) {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = easeOutCubic(t);
      currentScale.current = startScale + (target - startScale) * eased;

      drawCircularFrame(ctx, img, currentScale.current);
      link!.href = canvas.toDataURL("image/png");

      if (t < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        currentScale.current = target;
        if (target === 0 && originalHref.current) {
          link!.href = originalHref.current;
        }
      }
    }

    rafRef.current = requestAnimationFrame(frame);
  }

  const handleMouseEnter = async () => {
    const link = getFaviconLink();
    if (!link) return;
    if (!originalHref.current) originalHref.current = link.href;
    await loadImage();
    animateTo(1, 320);
  };

  const handleMouseLeave = () => {
    if (!imgRef.current) return;
    animateTo(0, 220);
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
