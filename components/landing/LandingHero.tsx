"use client";

import Image from "next/image";
import { Draggable } from "./Draggable";
import { LINKEDIN_URL } from "./landingConfig";
import { LiquidGlassPill } from "@/app/sticker/_shared";

const PLACEHOLDER_IMG =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

// `LiquidGlassPill` was duplicated here previously — same 5-layer Figma
// build as PrimaryButton, only the outer element differed (<a> vs <button>).
// User caught the drift ("修好一个应该都有了吧") and we collapsed them: the
// canonical implementation now lives in `app/sticker/_shared.tsx` and both
// the form-submit button and this landing CTA share `<PillBody>`. Fix
// hover here, the sticker page picks it up — and vice versa.

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
