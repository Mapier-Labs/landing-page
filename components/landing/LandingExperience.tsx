"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, type CSSProperties } from "react";
import { useDraggableLanding } from "@/hooks/useDraggableLanding";
import { Draggable } from "./Draggable";
import { LandingHero } from "./LandingHero";
import { WaitlistModal } from "./WaitlistModal";
import { STICKERS } from "./landingConfig";

const STICKER_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "/landing/stickers/Frame 3185590.png": { width: 240, height: 201 },
  "/landing/stickers/Frame 3185629.png": { width: 284, height: 396 },
  "/landing/stickers/Group 210.png": { width: 310, height: 348 },
  "/landing/stickers/Group 2619.png": { width: 119, height: 145 },
  "/landing/stickers/Group 2620.png": { width: 95, height: 132 },
  "/landing/stickers/Group 2627.png": { width: 237, height: 291 },
  "/landing/stickers/Group 2628.png": { width: 101, height: 113 },
  "/landing/stickers/Group 2626.png": { width: 411, height: 501 },
};

export function LandingExperience() {
  useDraggableLanding();

  const [waitlistOpen, setWaitlistOpen] = useState(false);

  const closeWaitlist = useCallback(() => setWaitlistOpen(false), []);

  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === "#waitlist") {
        setWaitlistOpen(true);
        history.replaceState(null, "", window.location.pathname);
      }
    };
    window.addEventListener("hashchange", onHash);
    onHash();

    // Also listen for direct clicks on waitlist links (more reliable on mobile + desktop draggable)
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a[href="#waitlist"]');
      if (link) {
        e.preventDefault();
        setWaitlistOpen(true);
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("hashchange", onHash);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <>
      <div className="bg" />

      <button className="reset-btn" type="button" title="Reset layout">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
      </button>

      <LandingHero />

      <Draggable
        className="draggable--phone"
        initRotate={3}
        style={{
          left: "64%",
          top: "12%",
          width: 260,
          zIndex: 18,
          transform: "rotate(3deg)",
        }}
      >
        <Image
          src="/landing/stickers/phone.png"
          alt="Mapier App"
          width={924}
          height={1868}
          draggable={false}
          unoptimized
        />
      </Draggable>

      {STICKERS.map((sticker, i) => {
        const size = STICKER_DIMENSIONS[sticker.src];

        return (
          <Draggable key={i} initRotate={sticker.initRotate} style={sticker.style as CSSProperties}>
            <Image
              src={sticker.src}
              alt=""
              width={size.width}
              height={size.height}
              draggable={false}
              unoptimized
            />
          </Draggable>
        );
      })}

      <footer className="footer-bar">
        <span>© {new Date().getFullYear()} Mapier. All rights reserved.</span>
        <span>Built by Mapier Labs with ❤️ in SF</span>
      </footer>

      <WaitlistModal open={waitlistOpen} onClose={closeWaitlist} />
    </>
  );
}
