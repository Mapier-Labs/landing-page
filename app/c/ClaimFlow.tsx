"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import ClaimSuccess from "./ClaimSuccess";

type Step = "reveal" | "phone" | "otp" | "success";

// Dev-only step override: in development, ?step=phone|otp|success jumps the flow
// forward for visual QA. Production users always start at 'reveal'. We also
// accept ?step=welcome to force the returning-user reveal copy.
function useDevStepOverride(): Step | "welcome" | null {
  const params = useSearchParams();
  if (process.env.NODE_ENV !== "development") return null;
  const requested = params.get("step");
  if (
    requested === "phone" ||
    requested === "otp" ||
    requested === "success" ||
    requested === "welcome"
  ) {
    return requested;
  }
  return null;
}

// Stub data for dev-mode jump-forward QA — never seen in production because
// the override is gated on NODE_ENV.
const DEV_STUB: RevealCharacter = {
  character_slug: "cat",
  tier: "C",
  rarity_label: "Top 40%",
};

export default function ClaimFlow() {
  const devOverride = useDevStepOverride();

  const [step, setStep] = useState<Step>("reveal");

  // Rolled (or restored) character — drives the reveal screen. Null while we
  // wait on the initial /character/roll round-trip.
  const [rolled, setRolled] = useState<RevealCharacter | null>(null);

  // Welcome-back mode flips the reveal copy + CTA when we restore from the
  // outcome cookie on a return visit.
  const [welcomeBack, setWelcomeBack] = useState(false);

  // Final claimed character. May differ from `rolled` in the rare case the
  // backend tells us the user already had a claim from another session.
  const [claimed, setClaimed] = useState<RevealCharacter | null>(null);

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

  // Guards: roll/restoration runs once per mount, and we don't want double-fire
  // in React 19 dev strict-mode-style remounts. The rolledRef keeps this idempotent.
  const initRanRef = useRef(false);

  // ---------- Initial mount: cookies-first, then roll ----------
  useEffect(() => {
    if (initRanRef.current) return;
    initRanRef.current = true;

    if (devOverride) {
      // Dev jump-forward: pretend we have a rolled character + (optionally) a
      // claimed one. Uses static stub data so the screens have something to render.
      setRolled(DEV_STUB);
      setClaimed(DEV_STUB);
      if (devOverride === "welcome") {
        setWelcomeBack(true);
        setStep("reveal");
      } else {
        setStep(devOverride);
      }
      return;
    }

    // 1) Outcome cookie — user has already claimed in this browser. Skip the
    //    roll entirely and let them jump straight to the success screen via the
    //    "Welcome back" CTA.
    const outcome = getClaimOutcome();
    if (outcome) {
      const restored: RevealCharacter = {
        character_slug: outcome.character_slug,
        tier: outcome.tier,
        rarity_label: outcome.rarity_label,
      };
      setRolled(restored);
      setClaimed(restored);
      setWelcomeBack(true);
      setStep("reveal");
      return;
    }

    // 2) Pending-claim cookie alone is just the token — we can't render the
    //    reveal screen without a slug, so we still call /character/roll. The
    //    backend should treat the call as idempotent given the cookie is sent
    //    only on /claim, so a second roll just produces a new character. To
    //    avoid surprising the user with a different character on refresh, we
    //    ALSO store a small slug+tier+rarity blob in the pending cookie below.
    //
    //    Implementation note: we store the full reveal payload (not just the
    //    token) in the pending cookie so refresh-stickiness Just Works without
    //    needing a separate /character/roll-by-token endpoint.
    const cached = readPendingPayload();
    if (cached) {
      setRolled(cached.character);
      setStep("reveal");
      return;
    }

    // 3) No cookies — roll a fresh one.
    void doRoll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doRoll = useCallback(async () => {
    setRollError(null);
    try {
      const res = await rollCharacter();
      const character: RevealCharacter = {
        character_slug: res.character_slug,
        tier: res.tier,
        rarity_label: res.rarity_label,
      };
      // Persist both the token (for /claim) and the reveal payload (so refresh
      // shows the same character without burning another roll).
      writePendingPayload(res.pending_token, character);
      setRolled(character);
    } catch (err) {
      setRollError(
        err instanceof ApiError
          ? err.code === "NETWORK_ERROR"
            ? "Network hiccup. Check your connection and try again."
            : err.message
          : "Couldn't reveal your character. Try again in a moment."
      );
    }
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
        // Hold the corrected reveal for a moment, then advance to success.
        await sleep(1600);
        setIsCorrecting(false);
        setStep("success");
        return;
      }

      setClaimed(claimedAs);
      setStep("success");
    },
    [rolled]
  );

  // ---------- Render ----------

  if (step === "reveal") {
    // Initial loading state — first roll hasn't returned yet.
    if (!rolled) {
      return (
        <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-white">
          <div className="text-center">
            {rollError ? (
              <>
                <p className="mx-auto max-w-xs px-6 text-center font-nunito text-base font-bold text-[#131311]">
                  {rollError}
                </p>
                <button
                  type="button"
                  onClick={() => void doRoll()}
                  className="mt-6 rounded-full bg-[#131311] px-6 py-3 font-nunito text-base font-bold text-white transition-colors hover:bg-black"
                >
                  Try again
                </button>
              </>
            ) : (
              <p className="font-nunito text-base font-bold text-[#797876]">Revealing…</p>
            )}
          </div>
        </main>
      );
    }

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
