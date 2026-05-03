"use client";

import Image from "next/image";
import { ChangeEvent, ClipboardEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import { ApiError, claimCharacter, extractExistingClaim, requestOtp, verifyOtp } from "@/lib/api";
import { HomeButton, PastelBackdrop, Sparkle } from "./_shared";
import { getPendingClaimToken } from "./ClaimFlow";
import type { RevealCharacter } from "./CharacterReveal";

interface OtpVerifyProps {
  /** Slug of the rolled character — used only to render the sticker thumbnail. */
  characterSlug: string;
  phone: string;
  /**
   * Called once the OTP is verified AND the character claim has resolved. The
   * `claimedAs` payload is what the backend bound — may differ from the rolled
   * character if the user already had a prior claim on another device.
   */
  onClaimed: (accessToken: string, claimedAs: RevealCharacter) => void;
  onChangePhone: () => void;
}

const CODE_LENGTH = 6;

export default function OtpVerify({
  characterSlug,
  phone,
  onClaimed,
  onChangePhone,
}: OtpVerifyProps) {
  const [digits, setDigits] = useState<string[]>(() => Array(CODE_LENGTH).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendNotice, setResendNotice] = useState<string | null>(null);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Focus the first input on mount.
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const code = digits.join("");
  const codeComplete = code.length === CODE_LENGTH && /^\d{6}$/.test(code);

  const setDigitAt = (idx: number, value: string) => {
    setDigits((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  };

  const handleChange = (idx: number, e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // strip everything but digits, take last char (handles autofill that fills 1 char at a time)
    const digit = raw.replace(/\D/g, "").slice(-1);
    setDigitAt(idx, digit);
    if (digit && idx < CODE_LENGTH - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      e.preventDefault();
      setDigitAt(idx - 1, "");
      inputRefs.current[idx - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && idx > 0) {
      e.preventDefault();
      inputRefs.current[idx - 1]?.focus();
    }
    if (e.key === "ArrowRight" && idx < CODE_LENGTH - 1) {
      e.preventDefault();
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (idx: number, e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    e.preventDefault();
    const next = [...digits];
    for (let i = 0; i < CODE_LENGTH; i += 1) {
      const sourceIdx = i - idx;
      if (sourceIdx >= 0 && sourceIdx < pasted.length) {
        next[i] = pasted[sourceIdx];
      }
    }
    setDigits(next);
    const lastFilled = Math.min(idx + pasted.length, CODE_LENGTH) - 1;
    inputRefs.current[Math.min(lastFilled + 1, CODE_LENGTH - 1)]?.focus();
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!codeComplete || isSubmitting) return;

    setError(null);
    setResendNotice(null);
    setIsSubmitting(true);

    try {
      const verifyRes = await verifyOtp(phone, code);
      const token = verifyRes.session.access_token;
      // Send the pending claim token from the cookie so the backend binds the
      // pre-rolled character to the now-authenticated user. Falls back to no
      // token if the cookie was wiped — backend will return NO_PENDING_CLAIM
      // unless the user already has a prior claim, in which case it surfaces
      // it via ALREADY_CLAIMED.
      const pendingToken = getPendingClaimToken() ?? undefined;
      try {
        const claim = await claimCharacter({
          pendingToken,
          accessToken: token,
        });
        onClaimed(token, {
          character_slug: claim.character_slug,
          tier: claim.tier,
          rarity_label: claim.rarity_label,
        });
      } catch (claimErr) {
        // ALREADY_CLAIMED: user has a prior character on this phone. Surface
        // it so the success screen shows their actual character.
        if (claimErr instanceof ApiError && claimErr.code === "ALREADY_CLAIMED") {
          const existing = extractExistingClaim(claimErr);
          if (existing) {
            onClaimed(token, {
              character_slug: existing.character_slug,
              tier: existing.tier,
              rarity_label: existing.rarity_label,
            });
            return;
          }
        }
        throw claimErr;
      }
    } catch (err) {
      setError(messageForError(err));
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (isResending) return;
    setError(null);
    setResendNotice(null);
    setIsResending(true);
    try {
      await requestOtp(phone);
      setResendNotice("A fresh code is on the way.");
      setDigits(Array(CODE_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(messageForError(err));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className="relative min-h-[100dvh] overflow-x-hidden bg-white">
      <PastelBackdrop />
      <HomeButton />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[402px] flex-col px-5 pb-8 pt-[140px]">
        {/* Header — sticker floats to the right and copy flows around it. */}
        <div className="pr-1 after:block after:clear-both after:content-['']">
          {/* Floating sticker block — float-right so text flows around */}
          <div className="relative ml-3 -mr-1 mt-2 float-right h-[170px] w-[170px]">
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <div className="animate-[float-slow_4.5s_ease-in-out_infinite]">
                <div className="rotate-[12deg]">
                  {characterSlug ? (
                    <Image
                      src={`/characters/${characterSlug}.png`}
                      alt=""
                      width={160}
                      height={160}
                      className="h-auto w-[160px] select-none drop-shadow-[0_10px_24px_rgba(0,0,0,0.2)]"
                    />
                  ) : null}
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute -left-2 bottom-3 z-20 animate-[float-fast_3.4s_ease-in-out_infinite]">
              <Sparkle className="h-9 w-9 -rotate-12 drop-shadow-md" />
            </div>
            <div className="pointer-events-none absolute -right-1 top-2 z-20 animate-[float-slow_4.8s_ease-in-out_-1.2s_infinite]">
              <Sparkle className="h-9 w-9 rotate-[18deg] drop-shadow-md" />
            </div>
          </div>

          <h1 className="font-display text-[30px] font-black leading-[34px] tracking-[-1.4px] text-[#131311] [paint-order:stroke] [-webkit-text-stroke:3px_white] [text-shadow:0_0_28px_rgba(0,0,0,0.08)]">
            Verify your number
          </h1>
          <p className="mt-3 font-nunito text-[14px] font-medium leading-[20px] text-[#797876]">
            Enter the code we sent to{" "}
            <button
              type="button"
              onClick={onChangePhone}
              className="font-bold text-[#131311] underline decoration-dotted underline-offset-4 hover:opacity-80"
            >
              {phone}
            </button>
            .
          </p>
        </div>

        <div className="flex-1" />

        <form onSubmit={handleSubmit} className="space-y-5 pb-2">
          {/* Six round inputs */}
          <div className="flex items-center justify-between gap-2 px-1">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                inputMode="numeric"
                autoComplete={i === 0 ? "one-time-code" : "off"}
                pattern="[0-9]*"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(i, e)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={(e) => handlePaste(i, e)}
                aria-label={`Digit ${i + 1} of code`}
                className="h-11 w-full min-w-0 flex-1 rounded-full bg-white text-center text-base font-bold tracking-tight text-[#131311] shadow-[0_0_20px_rgba(0,0,0,0.12)] outline-none focus:ring-2 focus:ring-[#131311]/15"
              />
            ))}
          </div>

          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-base font-bold tracking-tight text-[#797876] underline-offset-4 hover:text-[#131311] hover:underline disabled:opacity-50"
            >
              {isResending ? "Resending…" : "Resend the code"}
            </button>
            {resendNotice && <p className="text-sm text-[#797876]">{resendNotice}</p>}
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-2xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!codeComplete || isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#131311] px-[18px] py-3 text-base font-bold tracking-tight text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Verifying…
              </>
            ) : (
              <>
                Register
                <ChevronRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}

function messageForError(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.code === "INVALID_OTP") {
      return "That code didn’t match. Double-check and try again.";
    }
    if (err.code === "OTP_EXPIRED") {
      return 'This code expired. Tap "Resend the code" to get a fresh one.';
    }
    if (err.code === "RATE_LIMITED") {
      return "Too many attempts. Wait a minute, then try again.";
    }
    if (err.code === "INVALID_SLUG" || err.code === "INVALID_TOKEN") {
      return "That QR link looks broken. Try scanning the poster again.";
    }
    if (err.code === "NO_PENDING_CLAIM") {
      return "Your reveal expired. Tap home and rescan the poster to roll again.";
    }
    if (err.code === "INVALID_POSTER_TOKEN") {
      return "This QR poster link looks invalid. Scan the poster again or download Mapier directly.";
    }
    if (err.code === "UNAUTHORIZED") {
      return "Your session expired before we could claim. Try requesting a new code.";
    }
    if (err.code === "NETWORK_ERROR") {
      return "Network hiccup. Check your connection and try again.";
    }
    return err.message;
  }
  return "Something went wrong. Try again in a moment.";
}
