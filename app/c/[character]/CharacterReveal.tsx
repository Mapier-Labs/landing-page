'use client';

import Image from 'next/image';
import type { Character } from '@/lib/characters';
import { HomeButton, PastelBackdrop, PrimaryButton, Sparkle } from './_shared';

interface CharacterRevealProps {
  character: Character;
  onContinue: () => void;
}

export default function CharacterReveal({ character, onContinue }: CharacterRevealProps) {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-white">
      <PastelBackdrop />
      <HomeButton />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[402px] flex-col px-6 pb-10 pt-[140px]">
        {/* Header text — display serif (Fraunces 900) at heavy weight to mimic Hornbill,
            white sticker-stroke around glyphs, soft drop shadow, tight tracking, per Figma
            6138:88481 / 6138:88487. Each row sits below the previous with explicit gap so
            the rotated name never overlaps the pills. */}
        <div className="flex flex-col items-center text-center">
          <p className="font-display text-[24px] font-black leading-[28px] tracking-[-1.2px] text-[#131311] [paint-order:stroke] [-webkit-text-stroke:3px_white] [text-shadow:0_0_24px_rgba(0,0,0,0.08)]">
            Your Character is...
          </p>
          <h1 className="mt-4 font-display text-[40px] font-black leading-[42px] tracking-[-2px] text-[#131311] -rotate-[5.75deg] whitespace-nowrap [paint-order:stroke] [-webkit-text-stroke:4px_white] [text-shadow:0_0_32px_rgba(0,0,0,0.10)]">
            {character.name}!
          </h1>

          {/* Tier + rarity pills, slight tilt to match design (rotate 2.99°), well below name */}
          <div className="mt-6 flex rotate-[2.99deg] items-center gap-3">
            <TierBadge tier={character.tier} />
            <span className="rounded-full bg-white px-3 py-2 font-nunito text-[14px] font-medium leading-4 text-[#131311] shadow-[0_0_20px_rgba(0,0,0,0.12)]">
              {character.rarityLabel}
            </span>
          </div>
        </div>

        {/* Sticker block — sparkles positioned at sticker corners with a slow drift that
            occasionally crosses onto the sticker (z-20 keeps them on top when they do).
            Outer wrappers handle the float animation; inner wrappers hold the static
            rotation so the two transforms compose without fighting. */}
        <div className="relative mx-auto mt-10 h-[300px] w-[280px]">
          {/* Sticker first so sparkles render above it via z-index */}
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="animate-[float-slow_4.5s_ease-in-out_infinite]">
              <div className="rotate-[18.97deg]">
                <Image
                  src={`/characters/${character.slug}.png`}
                  alt={character.name}
                  width={280}
                  height={280}
                  priority
                  className="h-auto w-[280px] select-none drop-shadow-[0_14px_40px_rgba(0,0,0,0.22)]"
                />
              </div>
            </div>
          </div>

          {/* Lower-left sparkle — sits at sticker's lower-left, drifts down/around */}
          <div className="pointer-events-none absolute bottom-[10px] left-[10px] z-20 animate-[float-fast_3.4s_ease-in-out_infinite]">
            <Sparkle className="h-[60px] w-[60px] -rotate-[12.72deg] drop-shadow-md" />
          </div>
          {/* Upper-right sparkle — sits at sticker's upper-right, drifts up/around with offset start */}
          <div className="pointer-events-none absolute top-[20px] right-[10px] z-20 animate-[float-slow_4.8s_ease-in-out_-1.5s_infinite]">
            <Sparkle className="h-[60px] w-[60px] rotate-[13.24deg] drop-shadow-md" />
          </div>
        </div>

        {/* Tagline — Nunito Medium 14, sits ~32px below the sticker per Figma */}
        <p className="mx-auto mt-8 max-w-xs text-center font-nunito text-[14px] font-medium leading-4 text-[#131311]">
          {character.tagline}
        </p>

        {/* CTA — Nunito Bold 16, tracking -0.24px, rounded-full. mt-auto pushes the
            CTA to the bottom of the flex column regardless of viewport height. */}
        <div className="mx-auto mt-auto w-full max-w-[362px] pt-12 pb-6">
          <PrimaryButton onClick={onContinue}>Claim Your character</PrimaryButton>
        </div>
      </div>
    </main>
  );
}

function TierBadge({ tier }: { tier: Character['tier'] }) {
  // Matches Figma: SSS uses gold (#a38605 with yellow glow), other tiers
  // share the same dark amber treatment for v1 — easy to extend later.
  return (
    <span className="rounded-full bg-[#a38605] px-3 py-2 font-nunito text-[14px] font-medium leading-4 text-white shadow-[0_0_20px_rgba(255,217,0,0.35)]">
      {tier}
    </span>
  );
}
