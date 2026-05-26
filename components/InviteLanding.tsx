"use client";

import { useEffect, useRef, useState } from "react";
import { Apple, Play } from "lucide-react";
import { PastelBackdrop } from "@/app/sticker/_shared";

interface Inviter {
  username: string;
  display_name: string;
  avatar_url: string | null;
}

interface InviteLandingProps {
  code: string;
  inviter: Inviter;
}

// Reuse the same env precedence as `lib/invite.ts` but resolved at module load
// for the client side. NEXT_PUBLIC_ vars are inlined at build time so this is
// stable across renders.
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://dev.api.mapier.ai";

// Store-URL strategy:
//   • iOS — the existing share routes already pass `APP_STORE_ID` env into an
//     `<meta name="apple-itunes-app">` tag, so we use the same convention for
//     the install button. The `apple-itunes-app` meta tag is also emitted
//     below so iOS Safari shows its native "Open in App Store" smart banner.
//   • Android — `assetlinks.json` declares the package `ai.mapier`. The Play
//     Store URL follows the standard `details?id=<package>` shape.
//
// Both can be overridden via env without a code change. When `APP_STORE_ID`
// isn't set in the deployment env (current state at the time of writing),
// `IOS_INSTALL_URL` falls back to a search for "Mapier" so the button still
// goes somewhere reasonable — the lead can swap this once the iOS app
// is approved and we have a real numeric App Store ID.
const APP_STORE_ID = process.env.NEXT_PUBLIC_APP_STORE_ID ?? "";
const ANDROID_PACKAGE = process.env.NEXT_PUBLIC_ANDROID_PACKAGE ?? "ai.mapier";

const IOS_INSTALL_URL = APP_STORE_ID
  ? `https://apps.apple.com/app/id${APP_STORE_ID}`
  : "https://apps.apple.com/search?term=mapier";
const ANDROID_INSTALL_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;

type Platform = "ios" | "android" | "other";

// Detect via UA *after* hydration. Initial render leaves `platform = null` so
// SSR and first client render match (both show both buttons); the effect then
// narrows to a single button on phones.
function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent || "";
  // iPadOS 13+ reports as Macintosh + has touch. The MaxTouchPoints check is
  // the documented WebKit workaround.
  const isIPadDesktopUA =
    /Macintosh/.test(ua) &&
    typeof navigator.maxTouchPoints === "number" &&
    navigator.maxTouchPoints > 1;
  if (/iPhone|iPad|iPod/i.test(ua) || isIPadDesktopUA) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "other";
}

export default function InviteLanding({ code, inviter }: InviteLandingProps) {
  const [platform, setPlatform] = useState<Platform | null>(null);

  // Click-tracking guard: don't fire twice on React 19 strict-mode style
  // remounts (same pattern as `ClaimFlow.doRoll`). The backend POST is
  // idempotent per the contract, so a double-fire wouldn't be incorrect —
  // but it would inflate our click metrics, which is worse than missing one.
  const clickFiredRef = useRef(false);

  // Opt this route into vertical scrolling. globals.css `html, body { overflow:
  // hidden }` locks the home page's drag UX — without this class the invite
  // page can't scroll on short screens.
  useEffect(() => {
    document.documentElement.classList.add("page-scrollable");
    return () => {
      document.documentElement.classList.remove("page-scrollable");
    };
  }, []);

  // Platform detection — runs once after mount, never on the server. Keeping
  // it in a separate effect (rather than as a `useState` initializer) avoids
  // a hydration mismatch when the SSR HTML and the first client render disagree
  // on which platform buttons to show. The setState here is the *whole point*
  // of the effect — we need post-hydration access to `navigator` — and there's
  // nothing to cascade because it runs exactly once.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlatform(detectPlatform());
  }, []);

  // Click attribution — fire-and-forget, errors swallowed so a tracking blip
  // never breaks the user-facing flow.
  useEffect(() => {
    if (clickFiredRef.current) return;
    clickFiredRef.current = true;

    const url = `${BACKEND_URL}/contacts/invite/${encodeURIComponent(code)}/click`;
    // `keepalive: true` lets the request finish even if the user immediately
    // taps a store button and navigates away.
    void fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
      keepalive: true,
    }).catch(() => {
      // Intentionally silent — click failures shouldn't surface to users.
    });
  }, [code]);

  // Which install buttons to show. Pre-detection: show both (mobile-safe
  // default). Post-detection: narrow to the platform's store on phones; show
  // both on desktop.
  const showIos = platform === null || platform === "ios" || platform === "other";
  const showAndroid = platform === null || platform === "android" || platform === "other";

  return (
    <main className="invite-page relative min-h-[100dvh] overflow-x-hidden bg-white">
      <PastelBackdrop />

      {/* iOS Safari smart banner. Only useful while the App Store ID env var
          is wired up — falls back to nothing so we never emit a bogus
          `app-id=` attribute. */}
      {APP_STORE_ID ? <meta name="apple-itunes-app" content={`app-id=${APP_STORE_ID}`} /> : null}

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[402px] flex-col items-center px-6 pt-[88px] pb-[max(40px,env(safe-area-inset-bottom))]">
        {/* Avatar — circular, ~96px. Falls back to a name initial when the
            inviter has no avatar so the layout doesn't collapse. */}
        <div className="invite-avatar">
          {inviter.avatar_url ? (
            // We can't use next/image here without configuring image domains
            // for whatever CDN the backend points avatars at (Supabase
            // storage, S3, etc.). A plain <img> is simpler and the asset is
            // already 96-200px so optimization doesn't move the needle.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={inviter.avatar_url}
              alt={inviter.display_name}
              width={96}
              height={96}
              referrerPolicy="no-referrer"
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <span className="invite-avatar__fallback font-display">
              {inviter.display_name.charAt(0).toUpperCase() || "M"}
            </span>
          )}
        </div>

        {/* Headline — two lines: invite + brand. Sticker-text-md for the
            sticker stroke that matches the rest of the user-facing flow. */}
        <h1 className="sticker-text-md mt-7 font-display text-center text-[28px] font-bold leading-[32px] tracking-[-1.2px] text-[#131311]">
          {inviter.display_name}
          <br />
          invited you to Mapier
        </h1>

        <p className="sticker-text-sm mt-5 max-w-[320px] text-center font-nunito text-[15px] font-medium leading-[22px] text-[#131311]">
          The social map for what&apos;s actually happening around you.
        </p>

        <div className="flex-1" />

        {/* Store buttons — stacked, full-width. Both rendered initially to
            avoid the hydration-mismatch problem; platform effect narrows
            after mount. */}
        <div className="mt-10 flex w-full max-w-[320px] flex-col gap-3">
          {showIos ? (
            <a
              href={IOS_INSTALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="invite-store-btn invite-store-btn--ios"
            >
              <Apple className="h-5 w-5" strokeWidth={2} aria-hidden />
              <span className="invite-store-btn__label">
                <span className="invite-store-btn__top">Download on the</span>
                <span className="invite-store-btn__bottom">App Store</span>
              </span>
            </a>
          ) : null}
          {showAndroid ? (
            <a
              href={ANDROID_INSTALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="invite-store-btn invite-store-btn--android"
            >
              <Play className="h-5 w-5" strokeWidth={2} fill="currentColor" aria-hidden />
              <span className="invite-store-btn__label">
                <span className="invite-store-btn__top">Get it on</span>
                <span className="invite-store-btn__bottom">Google Play</span>
              </span>
            </a>
          ) : null}
        </div>

        <p className="mt-6 font-nunito text-center text-[12px] font-medium leading-[18px] text-[#797876]">
          Open the app and your invite from {inviter.display_name} will be applied automatically.
        </p>
      </div>
    </main>
  );
}
