"use client";

import { Loader2, Share2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { getCharacter } from "@/lib/characters";
import { HomeButton, PastelBackdrop, Sparkle } from "./_shared";
import { StickyCTA, StickyCTASpacer } from "./_shared";
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
  // Prefetched share image. The Web Share API requires the call to navigator.share
  // happen *synchronously* with the user's click — any awaited fetch in the
  // click handler burns the transient user activation and the OS share sheet
  // either silently fails or (on Chrome) the fallback popup gets blocked.
  // So we prefetch the PNG on mount, cache the File object, and the click
  // handler hands it straight to navigator.share with zero awaits before it.
  const fileRef = useRef<File | null>(null);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({
      tier: character.tier,
      rarity: character.rarity_label,
    });
    const shareUrl = `/share/character/${character.character_slug}?${params.toString()}`;

    fetch(shareUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`status ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        fileRef.current = new File([blob], `mapier-${character.character_slug}.png`, {
          type: "image/png",
        });
        // If the user already clicked while the prefetch was in flight, drop
        // them back into the idle state so the button reads "Share to Story"
        // again — they need to click a second time to fire navigator.share
        // (the user activation from the first click is long gone).
        setShareState((s) => (s === "loading" ? "idle" : s));
      })
      .catch((err) => console.warn("prefetch share image failed", err));

    return () => {
      cancelled = true;
    };
  }, [character.character_slug, character.tier, character.rarity_label]);

  // Strategy:
  //   1. If the share image is ready and the platform supports file share,
  //      open the OS share sheet directly. No popup, no intermediate page.
  //   2. If the platform can't share files (desktop Chrome, etc.), trigger
  //      a download via a synthetic <a download> click — also no popup,
  //      no popup blocker, the user gets the PNG saved straight to disk.
  //   3. If the image isn't fetched yet (slow network), surface the loading
  //      state and let the prefetch catch up — we never await inside the
  //      click handler.
  // We don't bother with the `instagram-stories://` deep link — it requires
  // a registered Facebook App ID and is unreliable from mobile web.
  const handleShare = () => {
    const file = fileRef.current;
    if (!file) {
      // Prefetch hasn't landed yet. Show loading; the next click after the
      // file is ready will succeed.
      setShareState("loading");
      return;
    }
    setShareState("idle");

    const nav = navigator as Navigator & {
      canShare?: (data: { files?: File[] }) => boolean;
    };

    if (nav.canShare?.({ files: [file] }) && navigator.share) {
      // No await before share() — preserves the click's user activation.
      navigator
        .share({
          files: [file],
          title: `I got ${name}!`,
          text: `I rolled ${name} on Mapier — what's yours?`,
        })
        .catch((err) => {
          if (err instanceof Error && err.name === "AbortError") return;
          console.warn("share failed", err);
        });
      return;
    }

    // Desktop / unsupported browsers: trigger a download instead of opening
    // a popup. <a download> doesn't need a fresh user activation and isn't
    // subject to popup blockers.
    const objectUrl = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = `mapier-${character.character_slug}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
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
        <button
          type="button"
          onClick={handleShare}
          disabled={shareState === "loading"}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#131311] px-[18px] py-3 font-nunito text-[16px] font-bold tracking-[-0.24px] text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
        >
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
        </button>
      </StickyCTA>
    </main>
  );
}
