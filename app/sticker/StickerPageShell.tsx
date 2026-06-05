"use client";

import { Suspense, useCallback, useState } from "react";
import ClaimFlow from "./ClaimFlow";
import { StickerLoadingContent } from "./LoadingScreen";

// Single persistent loading overlay for the entire roll phase. Keeping one
// MapiHat instance mounted from SSR through API resolution avoids the flash
// when Suspense hands off from its fallback to ClaimFlow's own loading branch.
// The overlay also owns the error state so the hat stays on screen during retries.
export default function StickerPageShell() {
  const [loadingVisible, setLoadingVisible] = useState(true);
  const [rollError, setRollError] = useState<string | null>(null);
  const [retryFn, setRetryFn] = useState<(() => void) | null>(null);

  const handleRollErrorChange = useCallback((error: string | null, retry: () => void) => {
    setRollError(error);
    setRetryFn(error ? () => retry : null);
  }, []);

  return (
    <>
      {loadingVisible && (
        <div
          className="fixed inset-0 z-50 flex min-h-[100dvh] flex-col items-center justify-center bg-white"
          role="status"
          aria-label={rollError ? "Something went wrong" : "Revealing your character"}
        >
          <StickerLoadingContent
            error={rollError}
            onRetry={retryFn ?? undefined}
          />
        </div>
      )}
      <Suspense fallback={null}>
        <ClaimFlow
          onLoadingVisibleChange={setLoadingVisible}
          onRollErrorChange={handleRollErrorChange}
        />
      </Suspense>
    </>
  );
}
