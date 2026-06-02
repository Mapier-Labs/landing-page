"use client";

import Image from "next/image";
import { Draggable } from "./Draggable";
import { LINKEDIN_URL } from "./landingConfig";

const PLACEHOLDER_IMG =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

/**
 * Liquid-glass CTA pill — pixel-exact reconstruction of Figma node 7490:56364
 * (Send-button variant) and its dark / important counterparts. 5-layer nested
 * structure so the two inner shadows render on different bounds (bottom dark
 * spans the full pill, side highlights stay on the narrower padded inner row).
 *
 *   1. <a>                Frame A — 1px stroke, rounded full
 *   2. <span Frame B>     fill + drop-shadow 1/2/1 rgba(0,0,0,0.1)
 *   3.   <span Frame C>   padded inner, fill, px-[18px] py-[12px], gap-2
 *   4.     <span side>    inset ±8/0/8 white-alpha — Frame C bounds
 *   5.   <span bottom>    inset 0/-13/13.5 bottomInset — Frame B bounds
 *
 * Variants mirror the RN GLASS palette in mobile-frontend's FloatingPlusButton:
 *   normal-light  | white glass    (Figma 7490:56364)
 *   normal-dark   | dark glass     (mirror, dark Figma palette)
 *   important-light | gold glass   (Figma 7575:26797)
 *   important-dark  | navy glass   (Figma — important dark)
 *
 * The text gets `text-shadow: 0.5px 0.5px 0 white` (Figma `text-shadow-
 * [0.5px_0.5px_0px_white]`) — no blur — and icon SVGs get the matching
 * `drop-shadow: 0.5px 0.5px 0 white` filter. Both create the tiny embossed
 * "punched-out" cue under each glyph that the larger surface shadows alone
 * don't supply. All values 1:1 Figma — do not amplify.
 */
type GlassVariant = "normal-light" | "normal-dark" | "important-light" | "important-dark";

const GLASS_PALETTES: Record<
  GlassVariant,
  {
    fill: string;
    border: string;
    bottomInset: string;
    sideLight: string;
    text: string;
    textShadow: string;
  }
> = {
  "normal-light": {
    fill: "#f3f2f1",
    border: "#c9c7c4",
    bottomInset: "#dfdfdf",
    sideLight: "rgba(255, 255, 255, 0.4)",
    text: "#131311",
    textShadow: "0.5px 0.5px 0 #ffffff",
  },
  "normal-dark": {
    fill: "#424242",
    border: "#2b2b2b",
    bottomInset: "#2b2b2b",
    sideLight: "rgba(255, 255, 255, 0.1)",
    text: "#ffffff",
    textShadow: "0.5px 0.5px 0 rgba(0, 0, 0, 0.6)",
  },
  "important-light": {
    fill: "#fff6e2",
    border: "#e3c291",
    bottomInset: "#eddeb4",
    sideLight: "rgba(255, 255, 255, 0.4)",
    text: "#835300",
    textShadow: "0.5px 0.5px 0 #ffffff",
  },
  "important-dark": {
    fill: "#2c3a5e",
    border: "#1d2742",
    bottomInset: "#1d2742",
    sideLight: "rgba(255, 255, 255, 0.1)",
    text: "#c8d6f5",
    textShadow: "0.5px 0.5px 0 rgba(0, 0, 0, 0.6)",
  },
};

function LiquidGlassPill({
  href,
  children,
  ariaLabel,
  external,
  variant = "normal-light",
}: {
  href: string;
  children: React.ReactNode;
  ariaLabel?: string;
  external?: boolean;
  variant?: GlassVariant;
}) {
  const p = GLASS_PALETTES[variant];
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="btn--link inline-block rounded-full border bg-transparent p-0 no-underline [&_svg]:[filter:drop-shadow(0.5px_0.5px_0_rgba(255,255,255,0.9))]"
      style={{ borderColor: p.border }}
    >
      <span
        className="relative block rounded-full"
        style={{
          backgroundColor: p.fill,
          filter: "drop-shadow(1px 2px 1px rgba(0, 0, 0, 0.1))",
        }}
      >
        <span
          className="relative flex items-center justify-center gap-2 rounded-full px-[18px] py-[12px] font-nunito text-[16px] font-bold tracking-[-0.24px]"
          style={{
            backgroundColor: p.fill,
            color: p.text,
            textShadow: p.textShadow,
          }}
        >
          <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              boxShadow: `inset -8px 0px 8px 0px ${p.sideLight}, inset 8px 0px 8px 0px ${p.sideLight}`,
            }}
          />
        </span>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{ boxShadow: `inset 0px -13px 13.5px 0px ${p.bottomInset}` }}
        />
      </span>
    </a>
  );
}

export function LandingHero() {
  return (
    <>
      <Draggable
        className="draggable--icon"
        initRotate={2}
        style={{
          left: "14%",
          top: "30%",
          width: 88,
          height: 88,
          zIndex: 22,
          transform: "rotate(2deg)",
        }}
      >
        <Image
          id="app-icon-img"
          src={PLACEHOLDER_IMG}
          alt="Mapier"
          draggable={false}
          width={88}
          height={88}
          unoptimized
        />
      </Draggable>

      <Draggable
        className="draggable--title"
        initRotate={-1}
        style={{
          left: "calc(14% + 102px)",
          top: "31%",
          zIndex: 21,
          transform: "rotate(-1deg)",
        }}
      >
        <h1>Mapier</h1>
      </Draggable>

      <Draggable
        className="draggable--desc"
        initRotate={0}
        style={{
          left: "14%",
          top: "48%",
          zIndex: 20,
          transform: "rotate(0deg)",
        }}
      >
        <h2 className="sr-only">AI-Powered Smart Navigation</h2>
        <p>Unlock the hidden layer in your city.</p>
      </Draggable>

      <Draggable
        className="draggable--btn"
        initRotate={0}
        style={{
          left: "14%",
          top: "58%",
          zIndex: 20,
          transform: "rotate(0deg)",
        }}
      >
        <LiquidGlassPill
          href="https://mapier.ai/sticker"
          ariaLabel="Join the Mapier waitlist"
          variant="normal-dark"
        >
          Join waitlist
        </LiquidGlassPill>
      </Draggable>

      <Draggable
        className="draggable--btn"
        initRotate={0}
        style={{
          left: "calc(14% + 150px)",
          top: "58%",
          zIndex: 19,
          transform: "rotate(0deg)",
        }}
      >
        <LiquidGlassPill href={LINKEDIN_URL} external variant="normal-light">
          Work with us
        </LiquidGlassPill>
      </Draggable>
    </>
  );
}
