"use client";

import { MapiHat } from "@/components/landing/MapiHat";

export function StickerLoadingContent() {
  return (
    <div className="flex shrink-0 flex-col items-center gap-2 overflow-visible">
      <MapiHat size={180} skipIntro />
      <p className="font-nunito text-sm font-bold text-[#797876]">Revealing…</p>
    </div>
  );
}

export function StickerLoadingScreen() {
  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center bg-white">
      <StickerLoadingContent />
    </main>
  );
}
