"use client";

import Image from "next/image";
import { getCharacter } from "@/lib/characters";
import {
  HomeButton,
  PastelBackdrop,
  PrimaryButton,
  Sparkle,
  StickyCTA,
  StickyCTASpacer,
} from "./_shared";

export interface RevealCharacter {
  /** Server-issued slug. May be unknown to lib/characters if posters predate a deploy. */
  character_slug: string;
  tier: string;
  rarity_label: string;
}

interface CharacterRevealProps {
  character: RevealCharacter;
  /**
   * `welcomeBack` swaps the heading copy + CTA so a returning user (with a
   * `mapier_claim_outcome` cookie) sees "Welcome back" instead of the
   * first-visit reveal language. The visual design is otherwise identical.
   */
  welcomeBack?: boolean;
  /** CTA label. Defaults differ per `welcomeBack` mode. */
  ctaLabel?: string;
  onContinue: () => void;
}

// ---------- Display helpers ----------

// Falls back to the slug-as-name (humanized) if the slug isn't in our local
// lib/characters table. Posters are server-side static; the slug list is the
// source of truth on the server.
function displayName(slug: string): string {
  const known = getCharacter(slug);
  if (known) return known.name;
  return slug
    .split("-")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : ""))
    .join(" ");
}

function displayTagline(slug: string): string | null {
  const known = getCharacter(slug);
  return known ? known.tagline : null;
}

export default function CharacterReveal({
  character,
  welcomeBack = false,
  ctaLabel,
  onContinue,
}: CharacterRevealProps) {
  const name = displayName(character.character_slug);
  const tagline = displayTagline(character.character_slug);

  const heading = welcomeBack ? "Welcome back!" : "Your Character is...";
  const button = ctaLabel ?? (welcomeBack ? "View Your Status" : "Claim Your character");

  return (
    <main className="relative min-h-[100dvh] overflow-x-hidden bg-white">
      <PastelBackdrop />
      <HomeButton />

      {/* Even-spacing layout — three content blocks (header, sticker, tagline)
          sit between four flex-grow rails. On tall viewports the rails grow
          to distribute content evenly; on short viewports they collapse to
          their min-heights so nothing gets pushed off-screen. The tagline is
          always above StickyCTASpacer, never under the CTA. */}
      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[402px] flex-col px-6">
        {/* Top rail — clears the absolute-positioned HomeButton (top: max(56px, safe-area), 44px tall).
            Larger shrink so on short viewports it gives up more room than the inter-block rails. */}
        <div className="min-h-[88px] flex-1 shrink-[3]" />

        <div className="flex flex-col items-center text-center">
          <p className="sticker-text-md font-display text-[24px] font-bold leading-[28px] tracking-[-1.2px] text-[#131311]">
            {heading}
          </p>
          {/* Horizontal auto-layout — name and "!" sit in separate spans with a
              small gap so each glyph cluster gets its own white stroke instead
              of the strokes merging across the trailing punctuation. The gap
              must be ≥ 2× stroke outset (here ~12px ≥ 12px) to guarantee no
              visual overlap. */}
          {/* Visual rebalance — name tilts left (-5.75°), pills tilt right
              (+2.99°). To make the two compositions feel like they meet in
              the middle (instead of stacking dead-center), the name pushes
              clearly LEFT and the pills push clearly RIGHT. Title sits on
              `z-10` so when it overlaps the pill row it stays on top — the
              sticker should always feel like it's the front layer. */}
          <h1 className="sticker-text-lg relative z-10 -translate-x-[22px] mt-4 -rotate-[5.75deg] flex items-baseline justify-center gap-[10px] whitespace-nowrap font-display text-[36px] font-bold leading-[42px] tracking-[-1.8px] text-[#131311]">
            <span>{name}</span>
            <span>!</span>
          </h1>

          <div className="relative z-0 -mt-1 flex translate-x-[24px] rotate-[2.99deg] items-center gap-3">
            <TierBadge tier={character.tier} />
            <span className="rounded-full bg-white px-3 py-2 font-nunito text-[14px] font-medium leading-4 text-[#131311] shadow-[0_0_20px_rgba(0,0,0,0.12)]">
              {character.rarity_label}
            </span>
          </div>
        </div>

        {/* Auto gap between the header block and the sticker — flex-1 means it
            grows to fill space on tall viewports while still respecting a
            min-height floor on short ones. */}
        <div className="min-h-[16px] flex-1" />

        {/* Sticker stage scales with viewport height so the layout remains
            evenly distributed on short phones (iPhone SE 568h) without
            requiring scroll. The image inside scales relative to the stage. */}
        <div
          className="relative mx-auto shrink-0"
          style={{
            width: "clamp(200px, 36vh, 280px)",
            height: "clamp(200px, 36vh, 280px)",
          }}
        >
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div
              key={character.character_slug}
              className="animate-[float-slow_4.5s_ease-in-out_infinite]"
            >
              <div className="rotate-[18.97deg]">
                <Image
                  src={`/characters/${character.character_slug}.png`}
                  alt={name}
                  width={240}
                  height={240}
                  priority
                  className="h-auto select-none drop-shadow-[0_6px_16px_rgba(0,0,0,0.10)]"
                  style={{ width: "clamp(170px, 31vh, 240px)" }}
                />
              </div>
            </div>
          </div>

          {/* Sparkle size scales with the sticker stage — Figma keeps a ~29%
              ratio between sparkle and sticker. clamp matches the sticker's
              `clamp(200px, 36vh, 280px)` at 0.29×. */}
          <div className="pointer-events-none absolute bottom-[6%] left-[4%] z-20 animate-[float-fast_3.4s_ease-in-out_infinite]">
            <span className="inline-block -rotate-[12.72deg]">
              <Sparkle size="clamp(58px, 10vh, 80px)" />
            </span>
          </div>
          <div className="pointer-events-none absolute right-[2%] top-[4%] z-20 animate-[float-slow_4.8s_ease-in-out_-1.5s_infinite]">
            <span className="inline-block rotate-[13.24deg]">
              <Sparkle size="clamp(58px, 10vh, 80px)" />
            </span>
          </div>
        </div>

        <div className="min-h-[24px] flex-1" />

        <p className="sticker-text-sm mx-auto max-w-xs text-center font-nunito text-[14px] font-medium leading-5 text-[#131311]">
          {tagline ?? (welcomeBack ? "Your character is saved to your account." : "")}
        </p>

        {/* Bottom rail — small fixed gap between tagline and the CTA spacer
            so the tagline doesn't sit pinned to the top of the CTA. */}
        <div className="min-h-[20px] flex-[0.4]" />

        <StickyCTASpacer />
      </div>

      <StickyCTA>
        <PrimaryButton onClick={onContinue}>{button}</PrimaryButton>
      </StickyCTA>
    </main>
  );
}

function TierBadge({ tier }: { tier: string }) {
  // Matches Figma: SSS uses gold (#a38605 with yellow glow), other tiers
  // share the same dark amber treatment for v1 — easy to extend later.
  return (
    <span className="rounded-full bg-[#a38605] px-3 py-2 font-nunito text-[14px] font-medium leading-4 text-white shadow-[0_0_20px_rgba(255,217,0,0.35)]">
      {tier}
    </span>
  );
}
