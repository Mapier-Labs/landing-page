import Link from "next/link";

export default function CharacterNotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      <PastelBackdrop />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
        <p className="font-mono text-sm tracking-widest text-[#797876] uppercase">404</p>
        <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight text-[#131311] sm:text-5xl">
          Character not found
        </h1>
        <p className="mt-4 max-w-sm text-base font-bold text-[#797876]">
          This character doesn&apos;t exist (yet). Check the QR poster again, or head back to the
          homepage.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center justify-center rounded-full bg-[#131311] px-8 py-4 text-base font-bold text-white shadow-lg transition-colors hover:bg-black"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}

function PastelBackdrop() {
  // Static decorative pastel blobs — visual fallback for the cloud bg used on
  // the claim flow pages. Kept here so the 404 still feels on-brand.
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
      <div className="absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-[#bfe0f4] opacity-60 blur-3xl" />
      <div className="absolute -right-32 top-40 h-[360px] w-[360px] rounded-full bg-[#fde7c2] opacity-50 blur-3xl" />
      <div className="absolute -bottom-20 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#e3eecd] opacity-50 blur-3xl" />
    </div>
  );
}
