import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="not-found__bg" />
      <div className="not-found__content">
        <h1 className="not-found__title">404</h1>
        <p className="not-found__desc">Looks like you wandered off the map.</p>
        <Link href="/" className="not-found__btn">
          Back to Home
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </main>
  );
}
