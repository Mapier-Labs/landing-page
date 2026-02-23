"use client";

import { useState, useEffect, useCallback, type CSSProperties } from "react";
import { useDraggableLanding } from "@/hooks/useDraggableLanding";
import { Draggable } from "./Draggable";
import { LandingHero } from "./LandingHero";
import { WaitlistModal } from "./WaitlistModal";
import { STICKERS } from "./landingConfig";

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
        <img src="/landing/stickers/phone.png" alt="Mapier App" draggable={false} />
      </Draggable>

      {STICKERS.map((sticker, i) => (
        <Draggable key={i} initRotate={sticker.initRotate} style={sticker.style as CSSProperties}>
          <img src={sticker.src} alt="" draggable={false} />
        </Draggable>
      ))}

      <footer className="footer-bar">
        <span>© {new Date().getFullYear()} Mapier. All rights reserved.</span>
        <span>Built by Mapier Labs with ❤️ in SF</span>
      </footer>

      <WaitlistModal open={waitlistOpen} onClose={closeWaitlist} />
    </>
  );
}
