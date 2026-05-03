/* next/og's ImageResponse only accepts native `<img>` elements (Satori
   does the rasterizing, not the Next image pipeline), so the
   `@next/next/no-img-element` lint doesn't apply in this file. */
/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { getCharacter } from "@/lib/characters";

export const runtime = "edge";

const WIDTH = 1080;
const HEIGHT = 1920;

const TIER_COLORS: Record<string, string> = {
  SSS: "#a38605",
  SS: "#a38605",
  S: "#a38605",
  A: "#0a8758",
  B: "#1f6fb0",
  C: "#5b6b7a",
  D: "#5b6b7a",
};

// Satori (next/og's renderer) does not support `-webkit-text-stroke`. Faux it
// by stamping the glyph in many directions at radius `n`. Using only the 8
// cardinal/diagonal directions produces visibly squarish corners — sampling
// 24 points around a circle gives smooth round caps that read like a real
// stroke at any scale.
function strokeShadows(n: number, color = "#ffffff", steps = 24): string {
  const out: string[] = [];
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const x = Math.cos(a) * n;
    const y = Math.sin(a) * n;
    out.push(`${x.toFixed(2)}px ${y.toFixed(2)}px 0 ${color}`);
  }
  return out.join(", ");
}

// Long character names (e.g. "Piece of Shit") would overflow 1080px at the
// default 184px size and get clipped. Scale the title font + stroke radius
// down as the name gets longer — kept aggressive (not too small) so longer
// names don't look dwarfed against shorter ones. `top` vertically centers
// the title between the "my character" header (~bottom 300) and the pill
// row (~top 515) so the gaps above and below the title stay consistent
// regardless of font size — otherwise long names left an awkward void.
function fitTitleSize(name: string): {
  fontSize: number;
  stroke: number;
  gap: number;
  top: number;
} {
  const len = name.length + 1;
  let dims: { fontSize: number; stroke: number; gap: number };
  if (len <= 5) dims = { fontSize: 184, stroke: 22, gap: 32 };
  else if (len <= 8) dims = { fontSize: 164, stroke: 20, gap: 28 };
  else if (len <= 11) dims = { fontSize: 144, stroke: 18, gap: 24 };
  else if (len <= 14) dims = { fontSize: 124, stroke: 16, gap: 20 };
  else dims = { fontSize: 104, stroke: 14, gap: 18 };
  // Vertical center of the title slot ≈ y=408 (midpoint of header bottom
  // and pill row top). top = 408 - fontSize/2 keeps that visual center
  // fixed across name lengths.
  return { ...dims, top: Math.round(408 - dims.fontSize / 2) };
}

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const url = new URL(req.url);
  const known = getCharacter(slug);
  const name =
    known?.name ??
    slug
      .split("-")
      .map((p) => (p ? p[0].toUpperCase() + p.slice(1) : ""))
      .join(" ");
  const tier = url.searchParams.get("tier") ?? known?.tier ?? "C";
  const rarity = url.searchParams.get("rarity") ?? known?.rarityLabel ?? "Top 40%";

  const baseUrl = `${url.protocol}//${url.host}`;

  // Load both fonts up front. Nunito covers the body/pill text where Hornbill
  // is missing glyphs (e.g. `%`); Hornbill is reserved for the sticker title
  // + wordmark. Satori falls back to the next available font glyph-by-glyph,
  // so this is the safe approach.
  const [hornbill, nunito] = await Promise.all([
    fetch(`${baseUrl}/landing/fonts/HornbillTrial-Bold.ttf`).then((r) => r.arrayBuffer()),
    fetch(`${baseUrl}/landing/fonts/Nunito-Bold.ttf`).then((r) => r.arrayBuffer()),
  ]);

  const characterUrl = `${baseUrl}/characters/${slug}.png`;
  const sparkleUrl = `${baseUrl}/landing/sparkles/sparkle.png`;
  const qrUrl = `${baseUrl}/landing/share-qr.png`;
  const bgUrl = `${baseUrl}/landing/snazzy-image.jpg`;

  const tierColor = TIER_COLORS[tier] ?? "#5b6b7a";
  const title = fitTitleSize(name);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: "#eaf3ec",
        fontFamily: "Hornbill",
      }}
    >
      {/* Backdrop — pre-blurred JPEG (Satori doesn't decode webp or apply
            CSS filters) so the map color story comes through clean. */}
      <img
        alt=""
        src={bgUrl}
        width={WIDTH}
        height={HEIGHT}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: WIDTH,
          height: HEIGHT,
          objectFit: "cover",
        }}
      />

      {/* Sparkles — absolutely positioned so they sit either side of the
            character without depending on its container's flow. */}
      <img
        alt=""
        src={sparkleUrl}
        width={260}
        height={260}
        style={{
          position: "absolute",
          top: 760,
          right: 140,
          transform: "rotate(13.24deg)",
        }}
      />
      <img
        alt=""
        src={sparkleUrl}
        width={260}
        height={260}
        style={{
          position: "absolute",
          top: 1260,
          left: 140,
          transform: "rotate(-12.72deg)",
        }}
      />

      {/* Character — large, rotated, centered. Drop shadow gives it the
            same lift as on the web reveal screen. */}
      <img
        alt={name}
        src={characterUrl}
        width={780}
        height={780}
        style={{
          position: "absolute",
          top: 700,
          left: (WIDTH - 780) / 2,
          transform: "rotate(18.97deg)",
          filter: "drop-shadow(0 14px 36px rgba(0,0,0,0.18))",
        }}
      />

      {/* Header — "I got" + "[Name]!" with the X-rebalance shifts. The
            stroke is a faux multi-shadow since Satori has no
            -webkit-text-stroke support. */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 220,
          left: 0,
          width: WIDTH,
          justifyContent: "center",
          fontSize: 80,
          fontWeight: 700,
          color: "#131311",
          letterSpacing: -2,
          textShadow: strokeShadows(11),
        }}
      >
        my character
      </div>

      {/* Pills sit just below the title baseline with a small (~20-30px)
            overlap into the title's descenders — enough to read as one
            sticker block, not enough to hide the pill text. */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 515,
          left: 0,
          width: WIDTH,
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 28,
            transform: "translateX(48px) rotate(2.99deg)",
            fontFamily: "Nunito",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: tierColor,
              color: "white",
              padding: "20px 44px",
              borderRadius: 999,
              fontSize: 48,
              fontWeight: 700,
            }}
          >
            {tier}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "white",
              color: "#131311",
              padding: "20px 44px",
              borderRadius: 999,
              fontSize: 48,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {rarity}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          position: "absolute",
          top: title.top,
          left: 0,
          width: WIDTH,
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            transform: "translateX(-32px) rotate(-5.75deg)",
            fontSize: title.fontSize,
            fontWeight: 700,
            color: "#131311",
            letterSpacing: Math.round(-title.fontSize * 0.054),
            gap: title.gap,
            textShadow: strokeShadows(title.stroke),
          }}
        >
          <span>{name}</span>
          <span>!</span>
        </div>
      </div>

      {/* Footer — wordmark left, QR right. */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          bottom: 100,
          left: 80,
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontFamily: "Hornbill",
            fontSize: 72,
            color: "#131311",
            fontWeight: 700,
            letterSpacing: -3,
            textShadow: strokeShadows(9),
          }}
        >
          mapier.ai
        </div>
        <div
          style={{
            fontFamily: "Nunito",
            fontSize: 32,
            color: "#131311",
            fontWeight: 700,
            marginTop: 8,
            textShadow: strokeShadows(4),
          }}
        >
          your place, told by locals
        </div>
      </div>

      {/* QR card — no drop shadow, minimal padding. Sits flush in the
            corner so the caption sticker can overlap it cleanly. */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          bottom: 80,
          right: 80,
          padding: 4,
          borderRadius: 14,
          background: "white",
        }}
      >
        <img alt="QR code" src={qrUrl} width={240} height={240} />
      </div>

      {/* QR caption — two lines, left-aligned, anchored just above the
            QR card's top-right corner. Tilts up-left from the bottom-right
            pivot for a hand-stuck sticker feel. Doesn't cover the QR. */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          bottom: 340,
          right: 180,
          flexDirection: "column",
          alignItems: "flex-start",
          transform: "rotate(-8deg)",
          transformOrigin: "100% 100%",
        }}
      >
        <div
          style={{
            fontFamily: "Hornbill",
            fontSize: 40,
            color: "#131311",
            fontWeight: 700,
            letterSpacing: -1.2,
            lineHeight: 1.05,
            textShadow: strokeShadows(8),
          }}
        >
          Roll yours ·
        </div>
        <div
          style={{
            fontFamily: "Hornbill",
            fontSize: 40,
            color: "#131311",
            fontWeight: 700,
            letterSpacing: -1.2,
            lineHeight: 1.05,
            marginTop: 6,
            textShadow: strokeShadows(8),
          }}
        >
          Limited drop
        </div>
      </div>
    </div>,
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        { name: "Hornbill", data: hornbill, weight: 700, style: "normal" },
        { name: "Nunito", data: nunito, weight: 700, style: "normal" },
      ],
    }
  );
}
