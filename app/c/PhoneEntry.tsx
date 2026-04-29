"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import { ApiError, requestOtp } from "@/lib/api";
import { HomeButton, PastelBackdrop, Sparkle } from "./_shared";

interface PhoneEntryProps {
  /** Slug of the rolled character — used only to render the sticker thumbnail. */
  characterSlug: string;
  initialPhone: string;
  onSubmitted: (phoneE164: string) => void;
}

type Country = { code: "US" | "CN"; dial: "+1" | "+86"; label: string };

const COUNTRIES: readonly Country[] = [
  { code: "US", dial: "+1", label: "United States" },
  { code: "CN", dial: "+86", label: "China" },
];

export default function PhoneEntry({ characterSlug, initialPhone, onSubmitted }: PhoneEntryProps) {
  // Pre-fill from already-entered phone if user navigated back.
  const initialDial: "+1" | "+86" = initialPhone.startsWith("+86") ? "+86" : "+1";
  const initialLocal = initialPhone.startsWith(initialDial)
    ? initialPhone.slice(initialDial.length)
    : "";

  const [dial, setDial] = useState<"+1" | "+86">(initialDial);
  const [localNumber, setLocalNumber] = useState(initialLocal);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sanitizedDigits = localNumber.replace(/\D/g, "");
  const isPotentiallyValid =
    (dial === "+1" && sanitizedDigits.length === 10) ||
    (dial === "+86" && sanitizedDigits.length === 11);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPotentiallyValid || isSubmitting) return;

    const phoneE164 = `${dial}${sanitizedDigits}`;
    setError(null);
    setIsSubmitting(true);

    try {
      await requestOtp(phoneE164);
      onSubmitted(phoneE164);
    } catch (err) {
      setError(messageForError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-white">
      <PastelBackdrop />
      <HomeButton />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[402px] flex-col px-5 pb-8 pt-[140px]">
        {/* Header — sticker floats to the right and the title + subtitle flow around it,
            matching the Figma layout where copy hugs the character. The container clears the
            float at the end so the form below isn't affected. */}
        <div className="pr-1 after:block after:clear-both after:content-['']">
          {/* Floating sticker block — float-right pulls it to the right edge so text flows around */}
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
                      priority
                      className="h-auto w-[160px] select-none drop-shadow-[0_10px_24px_rgba(0,0,0,0.2)]"
                    />
                  ) : null}
                </div>
              </div>
            </div>
            {/* Sparkles drift on/off the sticker */}
            <div className="pointer-events-none absolute -left-2 bottom-3 z-20 animate-[float-fast_3.4s_ease-in-out_infinite]">
              <Sparkle className="h-9 w-9 -rotate-12 drop-shadow-md" />
            </div>
            <div className="pointer-events-none absolute -right-1 top-2 z-20 animate-[float-slow_4.8s_ease-in-out_-1.2s_infinite]">
              <Sparkle className="h-9 w-9 rotate-[18deg] drop-shadow-md" />
            </div>
          </div>

          {/* Title + subtitle wrap naturally around the floated sticker. */}
          <h1 className="font-display text-[30px] font-black leading-[34px] tracking-[-1.4px] text-[#131311] [paint-order:stroke] [-webkit-text-stroke:3px_white] [text-shadow:0_0_28px_rgba(0,0,0,0.08)]">
            Register to Mapier
          </h1>
          <p className="mt-3 font-nunito text-[14px] font-medium leading-[20px] text-[#797876]">
            Enter your phone number to get started.
          </p>
        </div>

        <div className="flex-1" />

        {/* Phone input + CTA at bottom */}
        <form onSubmit={handleSubmit} className="space-y-5 pb-2">
          <div className="flex items-center gap-2 px-1">
            {/* Country selector — fixed-width round pill so it visually matches the Figma "+1" chip */}
            <div className="relative shrink-0">
              <select
                value={dial}
                onChange={(e) => setDial(e.target.value as "+1" | "+86")}
                aria-label="Country code"
                className="w-[68px] appearance-none rounded-full bg-white px-3 py-3 text-center font-nunito text-[16px] font-bold tracking-tight text-[#131311] shadow-[0_0_20px_rgba(0,0,0,0.12)] outline-none focus:ring-2 focus:ring-[#131311]/10"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.dial}>
                    {c.dial}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              value={localNumber}
              onChange={(e) => setLocalNumber(e.target.value)}
              placeholder={dial === "+1" ? "123-456-7890" : "13800138000"}
              className="flex-1 rounded-full bg-white px-5 py-3 text-base font-bold tracking-tight text-[#131311] placeholder:text-[#b2b2b2] shadow-[0_0_20px_rgba(0,0,0,0.12)] outline-none focus:ring-2 focus:ring-[#131311]/10"
            />
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
            disabled={!isPotentiallyValid || isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#131311] px-[18px] py-3 text-base font-bold tracking-tight text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Sending code…
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
    if (err.code === "INVALID_PHONE") {
      return "That phone number doesn’t look right. Double-check and try again.";
    }
    if (err.code === "RATE_LIMITED") {
      return "Too many attempts. Wait a minute, then try again.";
    }
    if (err.code === "NETWORK_ERROR") {
      return "Network hiccup. Check your connection and try again.";
    }
    return err.message;
  }
  return "Something went wrong. Try again in a moment.";
}
