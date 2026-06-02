"use client";

import { Loader2, Share2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { getCharacter } from "@/lib/characters";
import {
  HomeButton,
  PastelBackdrop,
  PrimaryButton,
  Sparkle,
  StickyCTA,
  StickyCTASpacer,
} from "./_shared";
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
  const [shareState, setShareState] = useState<"idle" | "loading" | "error">("idle");

  // Share to Instagram Story (or whichever app the OS share sheet routes to).
  // Strategy:
  //   1. Fetch /share/character/[slug] PNG (1080×1920 with QR in the corner).
  //   2. Hand the file to navigator.share — Instagram surfaces "Add to Story"
  //      from the iOS/Android share sheet.
  //   3. Fallback: open the PNG in a new tab so the user can save + post manually.
  // We don't bother with the `instagram-stories://` deep link — it requires a
  // registered Facebook App ID and is unreliable from mobile web.
  const handleShare = async () => {
    if (shareState === "loading") return;
    setShareState("loading");

    const params = new URLSearchParams({
      tier: character.tier,
      rarity: character.rarity_label,
    });
    const shareUrl = `/share/character/${character.character_slug}?${params.toString()}`;

    try {
      const res = await fetch(shareUrl);
      if (!res.ok) throw new Error(`status ${res.status}`);
      const blob = await res.blob();
      const file = new File([blob], `mapier-${character.character_slug}.png`, {
        type: "image/png",
      });

      // navigator.canShare with files isn't on TS lib.dom, hence the assert.
      const nav = navigator as Navigator & {
        canShare?: (data: { files?: File[] }) => boolean;
      };

      if (nav.canShare?.({ files: [file] }) && navigator.share) {
        await navigator.share({
          files: [file],
          title: `I got ${name}!`,
          text: `I rolled ${name} on Mapier — what's yours?`,
        });
        setShareState("idle");
        return;
      }

      // Fallback: open the image in a new tab so the user can long-press + save.
      window.open(shareUrl, "_blank", "noopener,noreferrer");
      setShareState("idle");
    } catch (err) {
      // User-cancellation throws AbortError, which we silently swallow.
      if (err instanceof Error && err.name === "AbortError") {
        setShareState("idle");
        return;
      }
      console.warn("share failed", err);
      setShareState("error");
      // Last-resort fallback so the button still does *something*.
      window.open(shareUrl, "_blank", "noopener,noreferrer");
      setTimeout(() => setShareState("idle"), 2000);
    }
  };

  return (
    <main className="relative min-h-[100dvh] overflow-x-hidden bg-white">
      <PastelBackdrop />
      <HomeButton />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[402px] flex-col px-6 pt-[140px]">
        {/* Header — display serif (Fraunces 900) + white sticker stroke, matching the reveal step */}
        <div className="flex flex-col items-center text-center">
          <p className="sticker-text-md font-display text-[24px] font-bold leading-[28px] tracking-[-1.2px] text-[#131311]">
            You&apos;ve claimed
          </p>
          <h1 className="sticker-text-lg relative z-10 -translate-x-[22px] mt-4 -rotate-[5.75deg] flex items-baseline justify-center gap-[10px] whitespace-nowrap font-display text-[36px] font-bold leading-[42px] tracking-[-1.8px] text-[#131311]">
            <span>{name}</span>
            <span>!</span>
          </h1>

          {/* Pills shifted right + tucked up under the name; z-0 so the title
              overlays the pill row when they cross in the middle. */}
          <div className="relative z-0 -mt-1 flex translate-x-[24px] rotate-[2.99deg] items-center gap-3">
            <span className="rounded-full bg-[#a38605] px-3 py-2 font-nunito text-[14px] font-medium leading-4 text-white shadow-[0_0_20px_rgba(255,217,0,0.35)]">
              {character.tier}
            </span>
            <span className="rounded-full bg-white px-3 py-2 font-nunito text-[14px] font-medium leading-4 text-[#131311] shadow-[0_0_20px_rgba(0,0,0,0.12)]">
              {character.rarity_label}
            </span>
          </div>
        </div>

        {/* Sticker block — same proportions as the reveal step: 320×280 stage
            holds the rotated sticker plus the two Figma sparkles. */}
        <div className="relative mx-auto mt-10 h-[280px] w-[320px]">
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="animate-[float-slow_4.5s_ease-in-out_infinite]">
              <div className="rotate-[18.97deg]">
                <Image
                  src={`/characters/${character.character_slug}.png`}
                  alt={name}
                  width={240}
                  height={240}
                  priority
                  className="h-auto w-[240px] select-none drop-shadow-[0_6px_16px_rgba(0,0,0,0.10)]"
                />
              </div>
            </div>
          </div>
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

        {/* Waitlist copy — character is already saved server-side; the user has
            nothing to do but wait for the eventual SMS invite. */}
        <div className="mx-auto mt-10 flex w-full max-w-[362px] flex-col items-center gap-3 text-center">
          <p className="sticker-text-md font-display text-[24px] font-bold leading-[28px] tracking-[-1.2px] text-[#131311]">
            You&apos;re on the waitlist.
          </p>
          <p className="sticker-text-sm max-w-[320px] font-nunito text-[14px] font-medium leading-5 text-[#131311]">
            We&apos;ll text you when you&apos;re off the waitlist. Your {name} is saved to your
            account.
          </p>
        </div>

        <StickyCTASpacer />
      </div>

      <StickyCTA>
        <PrimaryButton onClick={handleShare} disabled={shareState === "loading"}>
          {shareState === "loading" ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Preparing image…
            </>
          ) : (
            <>
              <Share2 size={20} strokeWidth={2.25} />
              Share to Story
            </>
          )}
        </PrimaryButton>
      </StickyCTA>
    </main>
  );
}
