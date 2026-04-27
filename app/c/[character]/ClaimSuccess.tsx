'use client';

import Image from 'next/image';
import type { Character } from '@/lib/characters';
import { HomeButton, PastelBackdrop, Sparkle } from './_shared';

interface ClaimSuccessProps {
  character: Character;
  // Reserved for future use (e.g. deep-linking the app with a session). Kept
  // in props so we don't drop it from the flow contract.
  accessToken: string | null;
}

// TODO: replace with real App Store / Play Store URLs once the app is live.
const APP_STORE_URL = 'https://apps.apple.com/app/idPLACEHOLDER';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=ai.mapier.PLACEHOLDER';

export default function ClaimSuccess({ character }: ClaimSuccessProps) {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-white">
      <PastelBackdrop />
      <HomeButton />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[402px] flex-col px-6 pb-10 pt-[140px]">
        {/* Header — display serif (Fraunces 900) + white sticker stroke, matching the reveal step */}
        <div className="flex flex-col items-center text-center">
          <p className="font-display text-[24px] font-black leading-[28px] tracking-[-1.2px] text-[#131311] [paint-order:stroke] [-webkit-text-stroke:3px_white] [text-shadow:0_0_24px_rgba(0,0,0,0.08)]">
            You&apos;ve claimed
          </p>
          <h1 className="mt-4 font-display text-[40px] font-black leading-[42px] tracking-[-2px] text-[#131311] -rotate-[5.75deg] whitespace-nowrap [paint-order:stroke] [-webkit-text-stroke:4px_white] [text-shadow:0_0_32px_rgba(0,0,0,0.10)]">
            {character.name}!
          </h1>

          {/* Tier + rarity pills */}
          <div className="mt-6 flex rotate-[2.99deg] items-center gap-3">
            <span className="rounded-full bg-[#a38605] px-3 py-2 font-nunito text-[14px] font-medium leading-4 text-white shadow-[0_0_20px_rgba(255,217,0,0.35)]">
              {character.tier}
            </span>
            <span className="rounded-full bg-white px-3 py-2 font-nunito text-[14px] font-medium leading-4 text-[#131311] shadow-[0_0_20px_rgba(0,0,0,0.12)]">
              {character.rarityLabel}
            </span>
          </div>
        </div>

        {/* Sticker block — same as reveal step: hard tilt, slow float, sparkles drifting on/off */}
        <div className="relative mx-auto mt-10 h-[300px] w-[280px]">
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
          <div className="pointer-events-none absolute bottom-[10px] left-[10px] z-20 animate-[float-fast_3.4s_ease-in-out_infinite]">
            <Sparkle className="h-[60px] w-[60px] -rotate-[12.72deg] drop-shadow-md" />
          </div>
          <div className="pointer-events-none absolute top-[20px] right-[10px] z-20 animate-[float-slow_4.8s_ease-in-out_-1.5s_infinite]">
            <Sparkle className="h-[60px] w-[60px] rotate-[13.24deg] drop-shadow-md" />
          </div>
        </div>

        {/* Tagline — Nunito Medium 14, matches reveal step */}
        <p className="mx-auto mt-8 max-w-xs text-center font-nunito text-[14px] font-medium leading-5 text-[#131311]">
          Open Mapier to meet your character and start exploring.
        </p>

        {/* Two CTAs at bottom (App Store + Play Store) */}
        <div className="mx-auto mt-auto flex w-full max-w-[362px] flex-col gap-3 pt-12 pb-6">
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center rounded-full bg-[#131311] px-[18px] py-3 font-nunito text-[16px] font-bold tracking-[-0.24px] text-white transition-colors hover:bg-black"
          >
            Get Mapier on App Store
          </a>
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center rounded-full bg-white px-[18px] py-3 font-nunito text-[16px] font-bold tracking-[-0.24px] text-[#131311] shadow-[0_0_20px_rgba(0,0,0,0.12)] transition-colors hover:bg-gray-50"
          >
            Get on Google Play
          </a>
        </div>
      </div>
    </main>
  );
}
