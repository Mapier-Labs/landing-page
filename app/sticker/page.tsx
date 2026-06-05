import StickerPageShell from "./StickerPageShell";

// QR landing page. The poster prints a single /c URL — we no longer route per
// character — so this is a static server component that just hands off to the
// client-side flow. The character is rolled (or restored from cookies) inside
// ClaimFlow on mount.
//
// StickerPageShell owns the persistent hat overlay; ClaimFlow uses
// `useSearchParams()` for the dev-only ?step= override, which requires a
// Suspense boundary so Next can pre-render the page without bailing out to
// fully client-side rendering.
export default function CharacterClaimPage() {
  return <StickerPageShell />;
}
