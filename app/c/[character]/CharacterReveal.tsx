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

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-6 pb-10 pt-28">
        {/* Header text */}
        <div className="flex flex-col items-center text-center">
          <p className="font-serif text-2xl font-bold tracking-tight text-[#131311]">
            Your Character is...
          </p>
          <h1
            className="mt-4 font-serif text-4xl font-bold leading-tight tracking-tight text-[#131311] [text-shadow:0_0_40px_rgba(0,0,0,0.12)] -rotate-[5deg]"
          >
            {character.name}!
          </h1>

          {/* Tier + rarity pills, slight tilt to match design */}
          <div className="mt-3 flex rotate-[3deg] items-center gap-3">
            <TierBadge tier={character.tier} />
            <span className="rounded-full bg-white px-3 py-2 text-sm font-medium text-[#131311] shadow-[0_0_20px_rgba(0,0,0,0.12)]">
              {character.rarityLabel}
            </span>
          </div>
        </div>

        {/* Sticker with sparkles */}
        <div className="relative mx-auto mt-14 flex h-[260px] w-[260px] items-center justify-center">
          <Sparkle className="absolute -bottom-2 -left-3 h-14 w-14 -rotate-12 drop-shadow-md" />
          <Sparkle className="absolute -right-2 -top-2 h-14 w-14 rotate-[18deg] drop-shadow-md" />
          <div className="rotate-[8deg]">
            <Image
              src={`/characters/${character.slug}.png`}
              alt={character.name}
              width={240}
              height={240}
              priority
              className="h-auto w-[240px] select-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
            />
          </div>
        </div>

        {/* Tagline */}
        <p className="mx-auto mt-10 max-w-xs text-center text-sm font-medium leading-relaxed text-[#131311]">
          {character.tagline}
        </p>

        {/* Spacer pushes CTA to bottom */}
        <div className="flex-1" />

        {/* CTA */}
        <div className="mx-auto w-full max-w-sm pb-6">
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
    <span className="rounded-full bg-[#a38605] px-3 py-2 text-sm font-medium text-white shadow-[0_0_20px_rgba(255,217,0,0.35)]">
      {tier}
    </span>
  );
}
