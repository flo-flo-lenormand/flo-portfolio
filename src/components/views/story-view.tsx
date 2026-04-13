"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LogoWithLabel } from "@/components/views/home-view";

const linkClass = "underline decoration-zinc-300 underline-offset-3 hover:decoration-zinc-500 transition-colors";

/** Expandable "more" - initially shows sextortion + teen protection, expands to full list */
function MoreProjects() {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {!expanded ? (
        <>
          like{" "}
          <a href="https://about.fb.com/news/2024/04/new-tools-to-help-protect-against-sextortion-and-intimate-image-abuse/" target="_blank" rel="noopener noreferrer" className={linkClass}>
            sextortion
          </a>
          ,{" "}
          <a href="https://about.fb.com/news/2023/06/parental-supervision-and-teen-time-management-on-metas-apps/" target="_blank" rel="noopener noreferrer" className={linkClass}>
            teen protection
          </a>
          {" "}and{" "}
          <span
            onClick={(e) => { e.stopPropagation(); setExpanded(true); }}
            className={"cursor-pointer " + linkClass}
          >
            more
          </span>
          .
        </>
      ) : (
        <>
          like{" "}
          <a href="https://about.fb.com/news/2024/04/new-tools-to-help-protect-against-sextortion-and-intimate-image-abuse/" target="_blank" rel="noopener noreferrer" className={linkClass}>
            sextortion
          </a>
          ,{" "}
          <a href="https://about.fb.com/news/2023/06/parental-supervision-and-teen-time-management-on-metas-apps/" target="_blank" rel="noopener noreferrer" className={linkClass}>
            teen protection
          </a>
          ,{" "}
          <a href="https://www.theverge.com/2023/8/3/23818552/instagram-dm-request-spam-limit" target="_blank" rel="noopener noreferrer" className={linkClass}>
            spams
          </a>
          {" "}and{" "}
          <a href="https://about.fb.com/news/2022/10/protecting-people-on-instagram-from-abuse/" target="_blank" rel="noopener noreferrer" className={linkClass}>
            scams
          </a>
          {" "}and{" "}
          <a href="https://design.facebook.com/blog/designing-for-safety-and-integrity-in-social-technologies/" target="_blank" rel="noopener noreferrer" className={linkClass}>
            more
          </a>
          .
        </>
      )}
    </>
  );
}

/** Sizzle reel video shown on "craft and care" hover - large overlay */
function CraftAndCare() {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (hovered && videoRef.current) {
      videoRef.current.play();
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [hovered]);

  return (
    <>
      <span
        className="cursor-default"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        craft and care
      </span>
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0, 0, 1] }}
          >
            <video
              ref={videoRef}
              src="/sizzle.mov"
              muted
              loop
              playsInline
              className="rounded-xl shadow-2xl"
              style={{ width: "80vw", maxWidth: 1000, height: "auto" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function StoryView() {
  return (
    <div className="flex flex-col gap-[48px]" style={{ width: 460 }}>
      {/* Paragraph 1 - Instagram / Safety */}
      <div className="text-[22px] font-medium leading-normal text-black">
        <span>
          I made conversations safe on{" "}
          <LogoWithLabel
            logoSrc="/ig.png"
            labelSrc="/instagram-written.png"
            logoAlt="Instagram"
            labelAlt="Instagram"
            logoSize={24}
            labelWidth={108}
            labelOffset={{ top: -48, left: 7 }}
          />

          {" "}where I worked on social issues{" "}
          <MoreProjects />
        </span>
      </div>

      {/* Paragraph 2 - Messenger / Craft */}
      <div className="text-[22px] font-medium leading-normal text-black">
        <span>
          Then I made them expressive on{" "}
          <LogoWithLabel
            logoSrc="/messenger.png"
            labelSrc="/messenger-written.png"
            logoAlt="Messenger"
            labelAlt="Messenger"
            logoSize={24}
            labelWidth={108}
            labelOffset={{ top: -86, left: -40 }}
          />
          . With{" "}
          <CraftAndCare />
          , I designed how media live in people&apos;s threads.
        </span>
      </div>

      {/* Paragraph 3 - MSL / AI */}
      <div className="text-[22px] font-medium leading-normal text-black">
        <span>
          Now I&apos;m making them smart on{" "}
          <LogoWithLabel
            logoSrc="/metaai.png"
            labelSrc="/msl-written.png"
            logoAlt="Meta Superintelligence Labs"
            labelAlt="MSL (Meta Superintelligence Labs)"
            logoSize={28}
            logoTop={-6}
            labelWidth={202}
            labelOffset={{ top: 2, left: 32 }}
          />
          , currently designing AI agents.
        </span>
      </div>
    </div>
  );
}
