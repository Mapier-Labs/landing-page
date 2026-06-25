"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ApiError, rollCharacter } from "@/lib/api";
import {
  ClaimOutcome,
  clearPendingClaim,
  getClaimOutcome,
  getPendingClaim,
  setClaimOutcome,
  setPendingClaim,
} from "@/lib/cookies";
import CharacterReveal, { RevealCharacter } from "./CharacterReveal";
import PhoneEntry from "./PhoneEntry";
import OtpVerify from "./OtpVerify";
import NameEntry from "./NameEntry";
import ClaimSuccess from "./ClaimSuccess";

type Step = "reveal" | "phone" | "otp" | "name" | "success";

// Dev-only step override: in development, ?step=phone|otp|name|success jumps
// the flow forward for visual QA. Production users always start at 'reveal'.
// We also accept ?step=welcome to force the returning-user reveal copy.
function useDevStepOverride(): Step | "welcome" | "loading" | null {
  const params = useSearchParams();
  if (process.env.NODE_ENV !== "development") return null;
  const requested = params.get("step");
  if (
    requested === "phone" ||
    requested === "otp" ||
    requested === "name" ||
    requested === "success" ||
    requested === "welcome" ||
    requested === "loading"
  ) {
    return requested;
  }
  return null;
}

// Dev-only character override — `?character=cat|alien|piece-of-shit|...` lets
// designers preview the reveal screen with a specific character without
// re-rolling. Slug → tier/rarity is hardcoded here for QA only; production
// values come from the backend roll.
const DEV_CHARACTER_TIERS: Record<string, { tier: string; rarity_label: string }> = {
  "piece-of-shit": { tier: "SSS", rarity_label: "Top 0.01%" },
  tardigrade: { tier: "SS", rarity_label: "Top 0.5%" },
  alien: { tier: "S", rarity_label: "Top 1%" },
  leopard: { tier: "S", rarity_label: "Top 1%" },
  nautilus: { tier: "A", rarity_label: "Top 5%" },
  seahorse: { tier: "A", rarity_label: "Top 5%" },
  raven: { tier: "A", rarity_label: "Top 8%" },
  seal: { tier: "B", rarity_label: "Top 12%" },
  "crested-gecko": { tier: "B", rarity_label: "Top 15%" },
  hedgehog: { tier: "B", rarity_label: "Top 15%" },
  deer: { tier: "B", rarity_label: "Top 25%" },
  raccoon: { tier: "C", rarity_label: "Top 30%" },
  cat: { tier: "C", rarity_label: "Top 40%" },
  pigeon: { tier: "C", rarity_label: "Top 50%" },
  "crushed-can": { tier: "D", rarity_label: "Top 60%" },
  mapi: { tier: "C", rarity_label: "Top 40%" },
};

function useDevCharacterOverride(): RevealCharacter | null {
  const params = useSearchParams();
  if (process.env.NODE_ENV !== "development") return null;
  const slug = params.get("character");
  if (!slug) return null;
  const meta = DEV_CHARACTER_TIERS[slug] ?? { tier: "C", rarity_label: "Top 40%" };
  return { character_slug: slug, ...meta };
}

// Stub data for dev-mode jump-forward QA — never seen in production because
// the override is gated on NODE_ENV.
const DEV_STUB: RevealCharacter = {
  character_slug: "cat",
  tier: "C",
  rarity_label: "Top 40%",
};

interface InitialState {
  step: Step;
  rolled: RevealCharacter | null;
  claimed: RevealCharacter | null;
  welcomeBack: boolean;
  needsRoll: boolean;
}

// Computes the mount-time state by reading cookies + the dev override. Runs
// once per mount via lazy useState initializers below — this avoids the
// `react-hooks/set-state-in-effect` cascade that would otherwise fire if we
// set the same state imperatively inside a `useEffect`.
function computeInitialState(
  devOverride: Step | "welcome" | "loading" | null,
  devCharacter: RevealCharacter | null
): InitialState {
  // useSearchParams() may not resolve synchronously on the first render inside
  // a Suspense boundary. Read window.location.search directly as the source of
  // truth so the lazy useState initializer always sees the correct step param.
  let effectiveOverride = devOverride;
  if (
    process.env.NODE_ENV === "development" &&
    !effectiveOverride &&
    typeof window !== "undefined"
  ) {
    const raw = new URLSearchParams(window.location.search).get("step");
    if (
      raw === "phone" ||
      raw === "otp" ||
      raw === "name" ||
      raw === "success" ||
      raw === "welcome" ||
      raw === "loading"
    ) {
      effectiveOverride = raw;
    }
  }

  // `?step=loading` forces the hat loading screen for visual QA.
  if (effectiveOverride === "loading") {
    return { step: "reveal", rolled: null, claimed: null, welcomeBack: false, needsRoll: false };
  }
  // `?character=` short-circuits the roll regardless of step. When combined
  // with `?step=success` it shows the success screen with that character.
  const stub = devCharacter ?? DEV_STUB;
  if (effectiveOverride) {
    return {
      step: effectiveOverride === "welcome" ? "reveal" : (effectiveOverride as Step),
      rolled: stub,
      claimed: stub,
      welcomeBack: effectiveOverride === "welcome",
      needsRoll: false,
    };
  }
  if (devCharacter) {
    return {
      step: "reveal",
      rolled: devCharacter,
      claimed: null,
      welcomeBack: false,
      needsRoll: false,
    };
  }
  // Cookies are browser-only; on the SSR pass we always defer to the roll
  // path and let the client effect short-circuit on rehydrate.
  if (typeof document === "undefined") {
    return { step: "reveal", rolled: null, claimed: null, welcomeBack: false, needsRoll: true };
  }
  // 1) Outcome cookie — user has already claimed in this browser. Skip the
  //    roll entirely; CTA jumps straight to success.
  const outcome = getClaimOutcome();
  if (outcome) {
    const restored: RevealCharacter = {
      character_slug: outcome.character_slug,
      tier: outcome.tier,
      rarity_label: outcome.rarity_label,
    };
    return {
      step: "reveal",
      rolled: restored,
      claimed: restored,
      welcomeBack: true,
      needsRoll: false,
    };
  }
  // 2) Pending payload — refresh-stickiness so a reload shows the same character
  //    without burning a second roll.
  const cached = readPendingPayload();
  if (cached) {
    return {
      step: "reveal",
      rolled: cached.character,
      claimed: null,
      welcomeBack: false,
      needsRoll: false,
    };
  }
  // 3) No cookies — need to roll.
  return { step: "reveal", rolled: null, claimed: null, welcomeBack: false, needsRoll: true };
}

interface ClaimFlowProps {
  onLoadingVisibleChange?: (visible: boolean) => void;
  onRollErrorChange?: (error: string | null, retry: () => void) => void;
}

export default function ClaimFlow({
  onLoadingVisibleChange,
  onRollErrorChange,
}: ClaimFlowProps = {}) {
  const devOverride = useDevStepOverride();
  const devCharacter = useDevCharacterOverride();

  // Computed once on first render via a lazy state initializer. We never call
  // `setInitial` — it's just a stable handle to the mount-time decision.
  const [initial] = useState<InitialState>(() => computeInitialState(devOverride, devCharacter));

  const [step, setStep] = useState<Step>(initial.step);

  // Rolled (or restored) character — drives the reveal screen. Null while we
  // wait on the initial /character/roll round-trip.
  const [rolled, setRolled] = useState<RevealCharacter | null>(initial.rolled);

  // Welcome-back mode flips the reveal copy + CTA when we restore from the
  // outcome cookie on a return visit.
  const [welcomeBack, setWelcomeBack] = useState(initial.welcomeBack);

  // Final claimed character. May differ from `rolled` in the rare case the
  // backend tells us the user already had a claim from another session.
  const [claimed, setClaimed] = useState<RevealCharacter | null>(initial.claimed);

  // True only during the brief reveal-replay animation that runs when claim
  // returns a different character than rolled. UI uses this to dim the rolled
  // sticker briefly before swapping in the actual one.
  const [isCorrecting, setIsCorrecting] = useState(false);

  // Claim flow state held between OTP verify and /character/claim. We cache the
  // session token so we can include it on the success screen for future deep
  // links.
  const [phone, setPhone] = useState("");
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Reveal-screen surface for the (rare) network-error case during the initial
  // roll. We show a tappable retry rather than crashing the page.
  const [rollError, setRollError] = useState<string | null>(null);

  const doRoll = useCallback(async () => {
    setRollError(null);
    // allSettled ensures the 700ms hat animation always plays, even if the API
    // fails immediately — Promise.all would reject early and skip the delay.
    const [rollResult] = await Promise.allSettled([rollCharacter(), sleep(700)]);
    if (rollResult.status === "rejected") {
      const err = rollResult.reason;
      setRollError(
        err instanceof ApiError
          ? err.code === "NETWORK_ERROR"
            ? "Network hiccup. Check your connection and try again."
            : err.message
          : "Couldn't reveal your character. Try again in a moment."
      );
      return;
    }
    const res = rollResult.value;
    const character: RevealCharacter = {
      character_slug: res.character_slug,
      tier: res.tier,
      rarity_label: res.rarity_label,
    };
    writePendingPayload(res.pending_token, character);
    setRolled(character);
  }, []);

  // Guard: don't double-fire `doRoll` on React 19 strict-mode-style remounts.
  const rollFiredRef = useRef(false);

  useEffect(() => {
    if (!initial.needsRoll || rollFiredRef.current) return;
    // Belt-and-suspenders: never fire the real roll when the dev loading preview
    // is active, regardless of how initial.needsRoll ended up being computed.
    if (
      process.env.NODE_ENV === "development" &&
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("step") === "loading"
    )
      return;
    rollFiredRef.current = true;
    // doRoll is the canonical "fetch on mount" path. The setState calls inside
    // happen *after* an async network round-trip, not synchronously, so the
    // cascading-renders concern the rule guards against doesn't apply here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void doRoll();
  }, [initial.needsRoll, doRoll]);

  // Opt this route into vertical scrolling. globals.css line 51 sets
  // `html, body { overflow: hidden }` so the home page's drag UX can lock
  // scroll, then releases it via the `page-scrollable` class on <html>
  // (line 720). The QR flow needs scroll on smaller phones where the CTA
  // sits below the iOS Safari toolbar; without this the user is stuck at
  // the reveal screen and can't reach "Claim Your character".
  useEffect(() => {
    document.documentElement.classList.add("page-scrollable");
    return () => {
      document.documentElement.classList.remove("page-scrollable");
    };
  }, []);

  // ---------- Step transitions ----------

  const goToPhone = useCallback(() => setStep("phone"), []);

  // Welcome-back path: outcome cookie present → jump straight to success.
  const goToSuccessFromWelcome = useCallback(() => {
    setStep("success");
  }, []);

  const goToOtp = useCallback((submittedPhone: string) => {
    setPhone(submittedPhone);
    setStep("otp");
  }, []);

  const goBackToPhone = useCallback(() => setStep("phone"), []);

  const handleClaimed = useCallback(
    async (token: string, claimedAs: RevealCharacter) => {
      setAccessToken(token);

      const claimedAtIso = new Date().toISOString();
      const outcome: ClaimOutcome = {
        character_slug: claimedAs.character_slug,
        tier: claimedAs.tier,
        rarity_label: claimedAs.rarity_label,
        claimed_at: claimedAtIso,
      };
      // Persist the outcome so a return visit short-circuits the flow.
      setClaimOutcome(outcome);
      // Pending cookie is single-use; clear it now that the claim succeeded.
      clearPendingClaim();

      // Mirror the phone into the public `waitlist` table so QR claimers show up
      // alongside home-page email signups. Fire-and-forget — the user already
      // has their character; a waitlist failure here shouldn't block them.
      if (phone) {
        void fetch("/api/waitlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone }),
        }).catch((err) => {
          console.warn("Waitlist mirror failed (non-blocking):", err);
        });
      }

      // Did the server hand us back a different character than we rolled?
      // That happens when this phone already had a prior claim on another
      // device/browser. Run the reveal-replay UX described in the spec before
      // dropping the user on the success screen.
      const rolledSlug = rolled?.character_slug;
      const isCorrection = rolledSlug && rolledSlug !== claimedAs.character_slug;

      if (isCorrection) {
        // Dim, swap, briefly hold "Welcome back", then advance.
        setIsCorrecting(true);
        // Brief beat to let the user notice the dim.
        await sleep(450);
        setRolled(claimedAs);
        setWelcomeBack(true);
        setClaimed(claimedAs);
        setStep("reveal");
        // Hold the corrected reveal for a moment, then advance to name capture.
        await sleep(1600);
        setIsCorrecting(false);
        setStep("name");
        return;
      }

      setClaimed(claimedAs);
      setStep("name");
    },
    [rolled, phone]
  );

  // Name page is purely advisory — it mirrors first/last name into the
  // waitlist row but doesn't gate success. NameEntry calls this both on
  // submit and on any non-blocking failure, so the user always reaches
  // their claimed character.
  const goToSuccessFromName = useCallback(() => setStep("success"), []);

  // Hat overlay is owned by StickerPageShell — sync before paint so cookie
  // restores skip the loader without a one-frame flash. Keep the overlay
  // visible during errors too so the hat stays on screen alongside the retry.
  const showRollLoading = step === "reveal" && !rolled;

  useLayoutEffect(() => {
    onLoadingVisibleChange?.(showRollLoading);
  }, [showRollLoading, onLoadingVisibleChange]);

  useLayoutEffect(() => {
    onRollErrorChange?.(rollError, doRoll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rollError, onRollErrorChange]);

  // ---------- Render ----------

  if (step === "reveal") {
    // Initial loading state — first roll hasn't returned yet. Overlay handles UI.
    if (!rolled) return null;

    return (
      <div className={isCorrecting ? "transition-opacity duration-300 opacity-40" : undefined}>
        <CharacterReveal
          character={rolled}
          welcomeBack={welcomeBack}
          onContinue={welcomeBack ? goToSuccessFromWelcome : goToPhone}
        />
      </div>
    );
  }

  if (step === "phone") {
    return (
      <PhoneEntry
        characterSlug={rolled?.character_slug ?? ""}
        initialPhone={phone}
        onSubmitted={goToOtp}
      />
    );
  }

  if (step === "otp") {
    return (
      <OtpVerify
        characterSlug={rolled?.character_slug ?? ""}
        phone={phone}
        onClaimed={handleClaimed}
        onChangePhone={goBackToPhone}
      />
    );
  }

  if (step === "name") {
    return (
      <NameEntry
        characterSlug={(claimed ?? rolled)?.character_slug ?? ""}
        phone={phone}
        onSubmitted={goToSuccessFromName}
      />
    );
  }

  // success
  return <ClaimSuccess character={claimed ?? rolled ?? DEV_STUB} accessToken={accessToken} />;
}

// ---------- Pending-claim cookie payload ----------
//
// The cookie value is JSON-encoded so we can store the token + the reveal
// blob together — same cookie name, same TTL. We only fall back to a bare
// token if a previous version of the app wrote one before this code shipped.
//
// The token is the only field the backend cares about on /claim; the
// character payload is purely for the UI to render a sticky reveal across
// refreshes without burning another roll.

interface PendingPayload {
  token: string;
  character: RevealCharacter;
}

function readPendingPayload(): PendingPayload | null {
  const raw = getPendingClaim();
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<PendingPayload>;
    if (
      parsed &&
      typeof parsed.token === "string" &&
      parsed.character &&
      typeof parsed.character === "object"
    ) {
      const c = parsed.character as Partial<RevealCharacter>;
      if (
        typeof c.character_slug === "string" &&
        typeof c.tier === "string" &&
        typeof c.rarity_label === "string"
      ) {
        return {
          token: parsed.token,
          character: {
            character_slug: c.character_slug,
            tier: c.tier,
            rarity_label: c.rarity_label,
          },
        };
      }
    }
  } catch {
    // Legacy format — pre-JSON token. Drop it; we'll re-roll cleanly.
  }
  return null;
}

function writePendingPayload(token: string, character: RevealCharacter): void {
  const payload: PendingPayload = { token, character };
  setPendingClaim(JSON.stringify(payload));
}

// Token-only accessor for the claim call. Reads the same cookie used for
// the reveal so we keep the source-of-truth in one place.
export function getPendingClaimToken(): string | null {
  const cached = readPendingPayload();
  return cached?.token ?? null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
