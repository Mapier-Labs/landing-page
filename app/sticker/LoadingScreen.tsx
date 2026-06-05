"use client";

import { MapiHat } from "@/components/landing/MapiHat";

interface StickerLoadingContentProps {
  error?: string | null;
  onRetry?: () => void;
}

export function StickerLoadingContent({ error, onRetry }: StickerLoadingContentProps = {}) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-3 overflow-visible">
      <MapiHat size={180} />
      {error ? (
        <>
          <p className="mx-auto max-w-xs px-6 text-center font-nunito text-sm font-bold text-[#797876]">
            {error}
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full bg-[#131311] px-6 py-3 font-nunito text-base font-bold text-white transition-colors hover:bg-black"
          >
            Try again
          </button>
        </>
      ) : (
        <p className="font-nunito text-sm font-bold text-[#797876]">Revealing…</p>
      )}
    </div>
  );
}

