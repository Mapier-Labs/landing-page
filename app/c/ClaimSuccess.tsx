"use client";

import Image from "next/image";
import { getCharacter } from "@/lib/characters";
import { HomeButton, PastelBackdrop, Sparkle } from "./_shared";
import type { RevealCharacter } from "./CharacterReveal";

interface ClaimSuccessProps {
  character: RevealCharacter;
  // Reserved for future use (e.g. deep-linking the app with a session). Kept
  // in props so we don't drop it from the flow contract.
  accessToken: string | null;
}

// Falls back to a humanized slug if the slug isn't in our local copy table.
function displayName(slug: string): string {
  const known = getCharacter(slug);
  if (known) return known.name;
  return slug
    .split("-")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : ""))
    .join(" ");
}

export default function ClaimSuccess({ character }: ClaimSuccessProps) {
  const name = displayName(character.character_slug);
  return (
    <main className="relative min-h-[100dvh] overflow-x-hidden bg-white">
      <PastelBackdrop />
      <HomeButton />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[402px] flex-col px-6 pb-10 pt-[140px]">
        {/* Header — display serif (Fraunces 900) + white sticker stroke, matching the reveal step */}
        <div className="flex flex-col items-center text-center">
          <p className="font-display text-[24px] font-black leading-[28px] tracking-[-1.2px] text-[#131311] [paint-order:stroke] [-webkit-text-stroke:3px_white] [text-shadow:0_0_24px_rgba(0,0,0,0.08)]">
            You&apos;ve claimed
          </p>
          <h1 className="mt-4 font-display text-[40px] font-black leading-[42px] tracking-[-2px] text-[#131311] -rotate-[5.75deg] whitespace-nowrap [paint-order:stroke] [-webkit-text-stroke:4px_white] [text-shadow:0_0_32px_rgba(0,0,0,0.10)]">
            {name}!
          </h1>

          {/* Tier + rarity pills */}
          <div className="mt-6 flex rotate-[2.99deg] items-center gap-3">
            <span className="rounded-full bg-[#a38605] px-3 py-2 font-nunito text-[14px] font-medium leading-4 text-white shadow-[0_0_20px_rgba(255,217,0,0.35)]">
              {character.tier}
            </span>
            <span className="rounded-full bg-white px-3 py-2 font-nunito text-[14px] font-medium leading-4 text-[#131311] shadow-[0_0_20px_rgba(0,0,0,0.12)]">
              {character.rarity_label}
            </span>
          </div>
        </div>

        {/* Sticker block — same as reveal step: hard tilt, slow float, sparkles drifting on/off */}
        <div className="relative mx-auto mt-10 h-[300px] w-[280px]">
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="animate-[float-slow_4.5s_ease-in-out_infinite]">
              <div className="rotate-[18.97deg]">
                <Image
                  src={`/characters/${character.character_slug}.png`}
                  alt={name}
                  width={280}
                  height={280}
                  priority
                  className="h-auto w-[280px] select-none drop-shadow-[0_14px_40px_rgba(0,0,0,0.22)]"
                />
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute bottom-[10px] left-[10px] z-20 animate-[float-fast_3.4s_ease-in-out_infinite]">
            <Sparkle className="h-[60px] w-[60px] -rotate-[12.72deg] drop-shadow-md" />
          </div>
          <div className="pointer-events-none absolute top-[20px] right-[10px] z-20 animate-[float-slow_4.8s_ease-in-out_-1.5s_infinite]">
            <Sparkle className="h-[60px] w-[60px] rotate-[13.24deg] drop-shadow-md" />
          </div>
        </div>

        {/* Waitlist copy — replaces the old App Store / Play Store CTAs while we
            wait for App Review approval. The character is already saved
            server-side; the user has nothing to do but wait. */}
        <div className="mx-auto mt-10 flex w-full max-w-[362px] flex-col items-center gap-3 text-center">
          <p className="font-display text-[24px] font-black leading-[28px] tracking-[-1.2px] text-[#131311] [paint-order:stroke] [-webkit-text-stroke:3px_white] [text-shadow:0_0_24px_rgba(0,0,0,0.08)]">
            You&apos;re on the waitlist.
          </p>
          <p className="max-w-[320px] font-nunito text-[14px] font-medium leading-5 text-[#131311]">
            We&apos;ll text you when you&apos;re off the waitlist. Your {name} is saved to your
            account.
          </p>
        </div>

        {/* Bottom spacer keeps the waitlist block centered between the sticker
            and the safe-area inset, matching the breathing room of the old
            two-button stack. */}
        <div className="mt-auto pb-6" />
      </div>
    </main>
  );
}
