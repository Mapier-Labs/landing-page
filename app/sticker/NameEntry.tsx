"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import {
  HomeButton,
  PastelBackdrop,
  PrimaryButton,
  Sparkle,
  StickyCTA,
  StickyCTASpacer,
} from "./_shared";

interface NameEntryProps {
  /** Slug of the claimed character — used only to render the sticker thumbnail. */
  characterSlug: string;
  /**
   * E.164 phone the user just verified. Mirrored to the waitlist row so the
   * captured name lands on the same record as the existing phone signup.
   */
  phone: string;
  /** Continue to ClaimSuccess once the name is recorded (or after skip). */
  onSubmitted: () => void;
}

export default function NameEntry({ characterSlug, phone, onSubmitted }: NameEntryProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmedFirst = firstName.trim();
  const trimmedLast = lastName.trim();
  const canSubmit = trimmedFirst.length > 0 && !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          first_name: trimmedFirst,
          last_name: trimmedLast || undefined,
        }),
      });
      if (!res.ok) {
        // Non-blocking: even if the waitlist mirror fails, we still let the
        // user reach success. Their character claim already succeeded; the
        // name is a bonus for our outreach list, not a gate.
        console.warn("Name capture failed (non-blocking):", res.status);
      }
    } catch (err) {
      console.warn("Name capture network error (non-blocking):", err);
    } finally {
      onSubmitted();
    }
  };

  return (
    <main className="relative min-h-[100dvh] overflow-x-hidden bg-white">
      <PastelBackdrop />
      <HomeButton />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[402px] flex-col px-5 pt-[140px]">
        {/* Header — sticker floats right, copy hugs the character (same pattern
            as PhoneEntry / OtpVerify so the screen feels continuous). */}
        <div className="pr-1 after:block after:clear-both after:content-['']">
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
                      className="h-auto w-[160px] select-none drop-shadow-[0_5px_12px_rgba(0,0,0,0.10)]"
                    />
                  ) : null}
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute -left-3 bottom-2 z-20 animate-[float-fast_3.4s_ease-in-out_infinite]">
              <span className="inline-block -rotate-12">
                <Sparkle size={42} />
              </span>
            </div>
            <div className="pointer-events-none absolute -right-2 top-1 z-20 animate-[float-slow_4.8s_ease-in-out_-1.2s_infinite]">
              <span className="inline-block rotate-[18deg]">
                <Sparkle size={42} />
              </span>
            </div>
          </div>

          <h1 className="sticker-text-lg font-display text-[30px] font-bold leading-[34px] tracking-[-1.4px] text-[#131311]">
            What should we call you?
          </h1>
          <p className="sticker-text-sm mt-3 font-nunito text-[14px] font-medium leading-[20px] text-[#797876]">
            We&apos;ll use this to reach out when the Mapier app is ready for you.
          </p>
        </div>

        <div className="flex-1" />

        <form onSubmit={handleSubmit} className="space-y-3 pb-2" id="name-form">
          <input
            type="text"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            aria-label="First name"
            maxLength={40}
            className="w-full rounded-full bg-white px-5 py-3 text-base font-bold tracking-tight text-[#131311] placeholder:text-[#b2b2b2] shadow-[0_0_20px_rgba(0,0,0,0.12)] outline-none focus:ring-2 focus:ring-[#131311]/10"
          />
          <input
            type="text"
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name (optional)"
            aria-label="Last name (optional)"
            maxLength={40}
            className="w-full rounded-full bg-white px-5 py-3 text-base font-bold tracking-tight text-[#131311] placeholder:text-[#b2b2b2] shadow-[0_0_20px_rgba(0,0,0,0.12)] outline-none focus:ring-2 focus:ring-[#131311]/10"
          />

          {error && (
            <div
              role="alert"
              className="rounded-2xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600"
            >
              {error}
            </div>
          )}
        </form>

        <StickyCTASpacer />
      </div>

      <StickyCTA>
        <PrimaryButton type="submit" form="name-form" disabled={!canSubmit}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              Continue
              <ChevronRight className="h-5 w-5" />
            </>
          )}
        </PrimaryButton>
      </StickyCTA>
    </main>
  );
}
