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

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-6 pb-10 pt-28">
        <div className="flex flex-col items-center text-center">
          <p className="font-serif text-2xl font-bold tracking-tight text-[#131311]">
            You&apos;ve claimed
          </p>
          <h1 className="mt-3 font-serif text-4xl font-bold leading-tight tracking-tight text-[#131311] [text-shadow:0_0_40px_rgba(0,0,0,0.12)] -rotate-[5deg]">
            {character.name}!
          </h1>

          <div className="mt-3 flex rotate-[3deg] items-center gap-3">
            <span className="rounded-full bg-[#a38605] px-3 py-2 text-sm font-medium text-white shadow-[0_0_20px_rgba(255,217,0,0.35)]">
              {character.tier}
            </span>
            <span className="rounded-full bg-white px-3 py-2 text-sm font-medium text-[#131311] shadow-[0_0_20px_rgba(0,0,0,0.12)]">
              {character.rarityLabel}
            </span>
          </div>
        </div>

        <div className="relative mx-auto mt-10 flex h-[220px] w-[220px] items-center justify-center">
          <Sparkle className="absolute -bottom-2 -left-3 h-12 w-12 -rotate-12 drop-shadow-md" />
          <Sparkle className="absolute -right-2 -top-2 h-12 w-12 rotate-[18deg] drop-shadow-md" />
          <div className="rotate-[8deg]">
            <Image
              src={`/characters/${character.slug}.png`}
              alt={character.name}
              width={200}
              height={200}
              priority
              className="h-auto w-[200px] select-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
            />
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-xs text-center text-base font-bold leading-relaxed text-[#797876]">
          Open Mapier to meet your character and start exploring.
        </p>

        <div className="flex-1" />

        <div className="mx-auto flex w-full max-w-sm flex-col gap-3 pb-2">
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center rounded-full bg-[#131311] px-[18px] py-3 text-base font-bold tracking-tight text-white transition-colors hover:bg-black"
          >
            Get Mapier on App Store
          </a>
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center rounded-full bg-white px-[18px] py-3 text-base font-bold tracking-tight text-[#131311] shadow-[0_0_20px_rgba(0,0,0,0.12)] transition-colors hover:bg-gray-50"
          >
            Get on Google Play
          </a>
        </div>
      </div>
    </main>
  );
}
