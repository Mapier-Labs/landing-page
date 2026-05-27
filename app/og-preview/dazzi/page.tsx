import Link from "next/link";

const PREVIEWS = [
  {
    label: "With RSVPs (12 going, 3 avatars)",
    imageHref: "/api/og/dazzi/preview",
  },
  {
    label: "Zero RSVPs (CTA only)",
    imageHref: "/api/og/dazzi/preview-empty",
  },
] as const;

export default function DazziOgPreviewPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#1a1a1a",
        color: "#f5f5f5",
        padding: "32px 24px 48px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ margin: "0 0 8px", fontSize: 28 }}>Dazzi OG preview</h1>
      <p style={{ margin: "0 0 8px", color: "#aaa", maxWidth: 640 }}>
        Local review only. Production uses real event IDs from Supabase.
      </p>
      <p style={{ margin: "0 0 32px", color: "#aaa", maxWidth: 640 }}>
        Hand-off doc:{" "}
        <code style={{ background: "#222", padding: "2px 6px", borderRadius: 4 }}>
          landing-page/lib/og/dazzi/README.md
        </code>{" "}
        — pipeline, file map, Satori gotchas, status.
      </p>

      {PREVIEWS.map((item) => (
        <section key={item.imageHref} style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ margin: 0, fontSize: 18 }}>{item.label}</h2>
            <Link href={item.imageHref} style={{ color: "#8ab4ff" }}>
              Open raw →
            </Link>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imageHref}
            alt={item.label}
            style={{
              width: "100%",
              maxWidth: 1200,
              borderRadius: 8,
              border: "1px solid #333",
            }}
          />
        </section>
      ))}

      <p style={{ color: "#888", fontSize: 14 }}>
        Share HTML + deeplink:{" "}
        <Link href="/share/dazzi/preview" style={{ color: "#8ab4ff" }}>
          /share/dazzi/preview
        </Link>
      </p>
    </main>
  );
}
