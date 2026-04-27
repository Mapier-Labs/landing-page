'use client';

import Image from 'next/image';
import {
  ChangeEvent,
  ClipboardEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ChevronRight, Loader2 } from 'lucide-react';
import type { Character } from '@/lib/characters';
import { ApiError, claimCharacter, requestOtp, verifyOtp } from '@/lib/api';
import { HomeButton, PastelBackdrop, Sparkle } from './_shared';

interface OtpVerifyProps {
  character: Character;
  phone: string;
  posterId?: string;
  onClaimed: (accessToken: string) => void;
  onChangePhone: () => void;
}

const CODE_LENGTH = 6;

export default function OtpVerify({
  character,
  phone,
  posterId,
  onClaimed,
  onChangePhone,
}: OtpVerifyProps) {
  const [digits, setDigits] = useState<string[]>(() => Array(CODE_LENGTH).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendNotice, setResendNotice] = useState<string | null>(null);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Focus the first input on mount.
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const code = digits.join('');
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
    const digit = raw.replace(/\D/g, '').slice(-1);
    setDigitAt(idx, digit);
    if (digit && idx < CODE_LENGTH - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      e.preventDefault();
      setDigitAt(idx - 1, '');
      inputRefs.current[idx - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && idx > 0) {
      e.preventDefault();
      inputRefs.current[idx - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && idx < CODE_LENGTH - 1) {
      e.preventDefault();
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (idx: number, e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '');
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
      // Immediately claim the character with the fresh token.
      await claimCharacter({
        characterSlug: character.slug,
        posterId,
        source: 'qr_poster',
        accessToken: token,
      });
      onClaimed(token);
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
      setResendNotice('A fresh code is on the way.');
      setDigits(Array(CODE_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(messageForError(err));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-white">
      <PastelBackdrop />
      <HomeButton />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-5 pb-8 pt-24">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 pr-2">
          <div className="flex flex-col gap-3">
            <h1 className="font-serif text-4xl font-bold leading-[1.1] tracking-tight text-[#131311] [text-shadow:0_0_40px_rgba(0,0,0,0.12)] max-w-[200px]">
              Verify your number
            </h1>
            <p className="max-w-[200px] text-base font-bold tracking-tight text-[#797876]">
              Enter the code we sent to{' '}
              <button
                type="button"
                onClick={onChangePhone}
                className="underline decoration-dotted underline-offset-4 hover:text-[#131311]"
              >
                {phone}
              </button>
              .
            </p>
          </div>

          <div className="relative h-[120px] w-[120px] shrink-0">
            <Sparkle className="absolute -left-1 top-12 h-8 w-8 -rotate-12" />
            <Sparkle className="absolute -right-1 top-1 h-8 w-8 rotate-[18deg]" />
            <div className="rotate-[12deg]">
              <Image
                src={`/characters/${character.slug}.png`}
                alt=""
                width={110}
                height={110}
                className="h-auto w-[110px] select-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.18)]"
              />
            </div>
          </div>
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
                autoComplete={i === 0 ? 'one-time-code' : 'off'}
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
              {isResending ? 'Resending…' : 'Resend the code'}
            </button>
            {resendNotice && (
              <p className="text-sm text-[#797876]">{resendNotice}</p>
            )}
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
    if (err.code === 'INVALID_OTP') {
      return 'That code didn’t match. Double-check and try again.';
    }
    if (err.code === 'OTP_EXPIRED') {
      return 'This code expired. Tap "Resend the code" to get a fresh one.';
    }
    if (err.code === 'RATE_LIMITED') {
      return 'Too many attempts. Wait a minute, then try again.';
    }
    if (err.code === 'INVALID_SLUG') {
      return 'That character link looks broken. Try scanning the QR poster again.';
    }
    if (err.code === 'UNAUTHORIZED') {
      return 'Your session expired before we could claim. Try requesting a new code.';
    }
    if (err.code === 'NETWORK_ERROR') {
      return 'Network hiccup. Check your connection and try again.';
    }
    return err.message;
  }
  return 'Something went wrong. Try again in a moment.';
}
