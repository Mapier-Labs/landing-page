import Link from "next/link";
import { Home } from "lucide-react";

/**
 * Pastel cloud backdrop used across the claim flow steps. Approximates the
 * blurred snazzy-image used in the Figma design without shipping a 1MB png.
 */
export function PastelBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
      <div className="absolute -left-24 -top-32 h-[460px] w-[460px] rounded-full bg-[#bfe0f4] opacity-70 blur-3xl" />
      <div className="absolute -right-28 top-24 h-[380px] w-[380px] rounded-full bg-[#fde7c2] opacity-60 blur-3xl" />
      <div className="absolute left-1/3 top-1/3 h-[420px] w-[420px] rounded-full bg-[#e3eecd] opacity-55 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 h-[480px] w-[480px] rounded-full bg-[#f4cfe0] opacity-45 blur-3xl" />
    </div>
  );
}

/**
 * Floating round home button matching the Figma "Icon Button" pattern in the
 * top-left of every step.
 */
export function HomeButton() {
  return (
    <Link
      href="/"
      aria-label="Back to homepage"
      className="absolute left-5 top-14 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#131311] shadow-[0_0_20px_rgba(0,0,0,0.12)] transition-transform hover:scale-105"
    >
      <Home className="h-5 w-5" />
    </Link>
  );
}

/**
 * Decorative four-pointed sparkle, used in pairs around the sticker. Drawn as
 * SVG so we don't have to ship more PNG assets.
 */
export function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" fill="none" aria-hidden className={className}>
      <path
        d="M30 2 L34 26 L58 30 L34 34 L30 58 L26 34 L2 30 L26 26 Z"
        fill="#ffd900"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Standard pill button used for the primary CTA on every step. */
export function PrimaryButton({
  children,
  type = "button",
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-[#131311] px-[18px] py-3 font-nunito text-[16px] font-bold tracking-[-0.24px] text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}
