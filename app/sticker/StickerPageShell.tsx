"use client";

import { Suspense, useState } from "react";
import ClaimFlow from "./ClaimFlow";
import { StickerLoadingContent } from "./LoadingScreen";

// Single persistent loading overlay for the entire roll phase. Keeping one
// MapiHat instance mounted from SSR through API resolution avoids the flash
// when Suspense hands off from its fallback to ClaimFlow's own loading branch.
export default function StickerPageShell() {
  const [loadingVisible, setLoadingVisible] = useState(true);

  return (
    <>
      {loadingVisible && (
        <div
          className="fixed inset-0 z-50 flex min-h-[100dvh] flex-col items-center justify-center bg-white"
          aria-busy="true"
          aria-label="Revealing your character"
        >
          <StickerLoadingContent />
        </div>
      )}
      <Suspense fallback={null}>
        <ClaimFlow onLoadingVisibleChange={setLoadingVisible} />
      </Suspense>
    </>
  );
}
