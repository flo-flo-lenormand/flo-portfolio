"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { LogoWithLabel } from "@/components/views/home-view";

const linkClass = "no-underline transition-[color]";

/** Video hover - floats a video near the text block, alternating left/right or centered */
function VideoHover({ label, src, position = "right" }: { label: string; src: string; position?: "left" | "right" | "center" }) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const [spanY, setSpanY] = useState(0);

  useEffect(() => {
    if (hovered && spanRef.current) {
      setSpanY(spanRef.current.getBoundingClientRect().top);
    }
  }, [hovered]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (hovered) {
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [hovered]);

  const positionStyle: React.CSSProperties = position === "center"
    ? { left: "50%", transform: "translateX(-50%)", bottom: `calc(100vh - ${spanY - 16}px)`, top: "auto" }
    : position === "left"
      ? { right: "calc(50% + 260px)", top: spanY - 200 }
      : { left: "calc(50% + 260px)", top: spanY - 200 };

  return (
    <>
      <span
        ref={spanRef}
        className="cursor-default"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {label}
      </span>
      {createPortal(
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="fixed z-50 pointer-events-none"
              style={positionStyle}
              initial={{ opacity: 0, scale: 0.97, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.97, filter: "blur(4px)" }}
              transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            >
              <video
                ref={videoRef}
                src={src}
                muted
                loop
                playsInline
                className="rounded-xl"
                style={position === "center"
                  ? { width: "80vw", maxWidth: 1000, height: "auto" }
                  : { height: "50vh", maxHeight: 500, width: "auto" }
                }
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

export default function StoryView() {
  return (
    <div className="flex flex-col gap-[48px]" style={{ width: 460 }}>
      {/* Paragraph 1 - Instagram / Safety */}
      <div className="text-[22px] font-medium leading-normal text-black">
        <span>
          On{" "}
          <LogoWithLabel
            logoSrc="/ig.png"
            labelSrc="/instagram-written.png"
            logoAlt="Instagram"
            labelAlt="Instagram"
            logoSize={24}
            labelWidth={108}
            labelOffset={{ top: -48, left: 7 }}
          />
          {" "}I worked on DM safety<br />I built{" "}
          <a href="https://about.fb.com/news/2024/04/new-tools-to-help-protect-against-sextortion-and-intimate-image-abuse/" target="_blank" rel="noopener noreferrer" className={linkClass}>
            nudity protections
          </a>
          ,{" "}
          <a href="https://about.fb.com/news/2023/06/parental-supervision-and-teen-time-management-on-metas-apps/" target="_blank" rel="noopener noreferrer" className="relative inline-block overflow-visible no-underline">
            <img
              src="/stabilo.png"
              alt=""
              className="pointer-events-none"
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(calc(-50% - 2px), -50%) scaleX(1.2) scaleY(2.4)",
                width: "calc(100% + 16px)",
                height: "auto",
              }}
            />
            <span className="relative">tools</span>
          </a>
          {" "}for teens and{"\u00A0"}parents, and{"\u00A0"}friction against{" "}
          <a href="https://www.theverge.com/2023/8/3/23818552/instagram-dm-request-spam-limit" target="_blank" rel="noopener noreferrer" className={linkClass}>
            spam
          </a>
          {" "}and{"\u00A0"}
          <a href="https://about.fb.com/news/2022/10/protecting-people-on-instagram-from-abuse/" target="_blank" rel="noopener noreferrer" className={linkClass}>
            scams
          </a>
          , among{" "}
          <a href="https://design.facebook.com/blog/designing-for-safety-and-integrity-in-social-technologies/" target="_blank" rel="noopener noreferrer" className={linkClass}>
            other projects
          </a>
        </span>
      </div>

      {/* Paragraph 2 - Messenger / Craft */}
      <div className="text-[22px] font-medium leading-normal text-black">
        <span>
          On{" "}
          <LogoWithLabel
            logoSrc="/messenger.png"
            labelSrc="/messenger-written.png"
            logoAlt="Messenger"
            labelAlt="Messenger"
            logoSize={24}
            labelWidth={108}
            labelOffset={{ top: -2, left: 30 }}
          />
          {" "}I owned the media experience<br />I redesigned the{" "}
          <VideoHover label="media picker" src="/mediapicker3.mp4" position="right" />
          , added{" "}
          <VideoHover label="reactions on media" src="/reactions.mp4" position="left" />
          , simplified{" "}
          <VideoHover label="video controls" src="/videocontrols2.mp4" position="right" />
          , and{"\u00A0"}
          <VideoHover label="more" src="/sizzle.mp4" position="center" />
        </span>
      </div>

      {/* Paragraph 3 - MSL / AI */}
      <div className="text-[22px] font-medium leading-normal text-black">
        <span>
          On{" "}
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
          {" "}I&apos;m designing AI agents
        </span>
      </div>
    </div>
  );
}
