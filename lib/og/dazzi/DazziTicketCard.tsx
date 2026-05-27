import { ImageResponse } from "next/og";
import { loadOgFonts } from "../fonts";
import type { DazziOgData } from "./types";
import { formatDazziOgDateTime } from "./formatDazziOgDateTime";

/**
 * Canvas matches frame asset aspect (1024:511 = 2.004:1) so the ticket isn't
 * vertically stretched. 1200×600 is still valid for og:image (≥1.91:1).
 */
export const OG_SIZE = { width: 1200, height: 600 };

/**
 * Pixel-measured from the frame asset (native 1024×511, scaled ×1.172/×1.174 → 1200×600):
 *   - Main panel inner border: x 80→872, y 80→517  (in canvas px)
 *   - Perforation dotted line: x = 904
 *   - Stub inner border: x 933→1119, y 80→517
 * Layer & padding values derived from those so content sits inside the
 * blue inner borders and the barcode lives on the stub side of the perforation.
 */
const LAYOUT = {
  stubWidth: 296,
  mainPad: { top: 86, right: 32, bottom: 89, left: 80 },
  stubPad: { top: 86, right: 81, bottom: 89, left: 29 },
} as const;

const COLORS = {
  navy: "#2E4482",
  ink: "#111111",
  muted: "#4A4A4A",
};

/**
 * Right stub: text reads bottom-to-top, i.e. you tilt the ticket
 * counter-clockwise to read normally. rotate(-90deg) achieves that.
 */
const STUB_TEXT_ROTATION = "rotate(-90deg)";

function TicketBarcode({ height = 140 }: { height?: number }): React.ReactElement {
  const bars = [3, 2, 4, 2, 5, 2, 3, 4, 2, 6, 2, 3, 5, 2, 4, 2, 3];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        height,
        gap: 2,
        flexShrink: 0,
      }}
    >
      {bars.map((w, i) => (
        <div
          key={i}
          style={{
            width: w,
            backgroundColor: COLORS.ink,
            height: "100%",
            display: "flex",
          }}
        />
      ))}
    </div>
  );
}

function AvatarSticker({
  url,
  label,
  size = 72,
}: {
  url: string | null;
  label: string;
  size?: number;
}): React.ReactElement {
  const initial = label.trim().charAt(0).toUpperCase() || "?";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: `${size / 2}px`,
        border: "4px solid white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#D4C4A8",
        flexShrink: 0,
      }}
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element -- next/og ImageResponse requires img
        <img
          alt=""
          src={url}
          width={size}
          height={size}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
      ) : (
        <span
          style={{
            fontFamily: "Nunito",
            fontSize: size * 0.38,
            fontWeight: 700,
            color: COLORS.navy,
          }}
        >
          {initial}
        </span>
      )}
    </div>
  );
}

function ParticipantAvatars({ urls }: { urls: string[] }): React.ReactElement {
  const slice = urls.slice(0, 3);
  return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      {slice.map((url, index) => (
        <div
          key={`${url}-${index}`}
          style={{
            marginLeft: index === 0 ? 0 : -18,
            zIndex: index + 1,
            display: "flex",
          }}
        >
          <AvatarSticker url={url} label="" size={64} />
        </div>
      ))}
    </div>
  );
}

/**
 * Stub uses absolute positioning because rotated text in flex flow keeps its
 * unrotated width — a 200px-wide "Sunset drinks at The Peak" would blow out
 * the ~80px stub column and stack vertically instead of sitting beside the
 * barcode. With absolute positions, each rotated block is taken out of flow
 * and placed where the mock shows it.
 */
function TicketStub({
  poiLine,
  title,
  dateLine,
}: {
  poiLine: string;
  title: string;
  dateLine: string;
}): React.ReactElement {
  const innerWidth = LAYOUT.stubWidth - LAYOUT.stubPad.left - LAYOUT.stubPad.right;
  const innerHeight = OG_SIZE.height - LAYOUT.stubPad.top - LAYOUT.stubPad.bottom;
  const titleSize = title.length > 28 ? 20 : 24;
  const middleHeight = innerHeight - 80 - 80;
  const barcodeHeight = Math.min(middleHeight - 60, 200);

  return (
    <div
      style={{
        width: LAYOUT.stubWidth,
        height: "100%",
        display: "flex",
        position: "relative",
        padding: `${LAYOUT.stubPad.top}px ${LAYOUT.stubPad.right}px ${LAYOUT.stubPad.bottom}px ${LAYOUT.stubPad.left}px`,
        boxSizing: "border-box",
      }}
    >
      {/* Top: location, rotated upward (reads bottom-to-top on right stub). */}
      <div
        style={{
          position: "absolute",
          top: LAYOUT.stubPad.top,
          left: 0,
          width: LAYOUT.stubWidth,
          height: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            transform: STUB_TEXT_ROTATION,
            fontSize: 14,
            color: COLORS.muted,
            whiteSpace: "nowrap",
          }}
        >
          {poiLine}
        </div>
      </div>

      {/* Middle: barcode on the perforation side, rotated title on outer side. */}
      <div
        style={{
          position: "absolute",
          top: LAYOUT.stubPad.top + 80,
          left: LAYOUT.stubPad.left,
          width: innerWidth,
          height: middleHeight,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TicketBarcode height={barcodeHeight} />
        <div
          style={{
            display: "flex",
            width: 40,
            height: barcodeHeight,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              transform: STUB_TEXT_ROTATION,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "Hornbill",
                fontSize: titleSize,
                fontWeight: 700,
                color: COLORS.ink,
                whiteSpace: "nowrap",
                textAlign: "center",
              }}
            >
              {title}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom: date, rotated. */}
      <div
        style={{
          position: "absolute",
          bottom: LAYOUT.stubPad.bottom,
          left: 0,
          width: LAYOUT.stubWidth,
          height: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            transform: STUB_TEXT_ROTATION,
            fontSize: 14,
            color: COLORS.muted,
            whiteSpace: "nowrap",
          }}
        >
          {dateLine}
        </div>
      </div>
    </div>
  );
}

function DazziTicketCard({
  data,
  frameUrl,
}: {
  data: DazziOgData;
  frameUrl: string;
}): React.ReactElement {
  const dateTime =
    data.startIso != null
      ? formatDazziOgDateTime(data.startIso, data.timezone)
      : { dateLine: "Date TBD", timeLine: "" };
  const poiLine = data.poiName ?? "Location on Mapier";
  const showParticipants = data.goingCount > 0;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        position: "relative",
        fontFamily: "Nunito",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- ticket chrome from Figma export */}
      <img
        alt=""
        src={frameUrl}
        width={OG_SIZE.width}
        height={OG_SIZE.height}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "fill",
        }}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: `${LAYOUT.mainPad.top}px ${LAYOUT.mainPad.right}px ${LAYOUT.mainPad.bottom}px ${LAYOUT.mainPad.left}px`,
          boxSizing: "border-box",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Main inner-border content width = 1200 - stubWidth(296) - left(80) - right(32) = 792. Split 510 + 240 (gap 20) so right column never overflows. */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", width: 510 }}>
            <span style={{ fontSize: 22, color: COLORS.ink, marginBottom: 8 }}>
              You are invited to
            </span>
            <span
              style={{
                fontFamily: "Hornbill",
                fontSize: 52,
                fontWeight: 700,
                color: COLORS.ink,
                lineHeight: 1.05,
                marginBottom: 16,
              }}
            >
              {data.title}
            </span>
            <span
              style={{
                fontSize: 24,
                color: COLORS.muted,
                lineHeight: 1.35,
                maxWidth: 510,
              }}
            >
              {data.description}
            </span>
          </div>

          {/* Fixed width keeps Satori from wrapping multi-word POI names like "Sky Lounge Hong Kong". */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              width: 240,
            }}
          >
            <span style={{ fontSize: 16, color: COLORS.muted, marginBottom: 8 }}>
              Time &amp; Location
            </span>
            <span
              style={{
                fontFamily: "Hornbill",
                fontSize: 26,
                fontWeight: 700,
                color: COLORS.ink,
                textAlign: "right",
                whiteSpace: "nowrap",
              }}
            >
              {dateTime.dateLine}
            </span>
            {dateTime.timeLine ? (
              <span
                style={{
                  fontFamily: "Hornbill",
                  fontSize: 22,
                  fontWeight: 700,
                  color: COLORS.ink,
                  textAlign: "right",
                  marginTop: 2,
                  whiteSpace: "nowrap",
                }}
              >
                {dateTime.timeLine}
              </span>
            ) : null}
            <span
              style={{
                fontFamily: "Hornbill",
                fontSize: 22,
                fontWeight: 700,
                color: COLORS.ink,
                textAlign: "right",
                marginTop: 8,
                whiteSpace: "nowrap",
              }}
            >
              {poiLine}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-end", gap: 48 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontSize: 18, color: COLORS.muted }}>Host by</span>
              <span style={{ fontSize: 26, fontWeight: 700, color: COLORS.ink }}>
                {data.hostName}
              </span>
              <div style={{ marginTop: 4, display: "flex" }}>
                <AvatarSticker url={data.hostAvatarUrl} label={data.hostName} size={64} />
              </div>
            </div>

            {showParticipants ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ fontSize: 18, color: COLORS.muted }}>{data.goingCount} going</span>
                <ParticipantAvatars urls={data.participantAvatarUrls} />
              </div>
            ) : null}
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}
          >
            {!showParticipants ? (
              <span style={{ fontSize: 20, color: COLORS.muted, textAlign: "right" }}>
                Be the first to RSVP on Mapier
              </span>
            ) : null}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                backgroundColor: COLORS.navy,
                color: "white",
                borderRadius: 999,
                padding: "16px 32px",
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              Accept Invite →
            </div>
          </div>
        </div>
      </div>

      <TicketStub poiLine={poiLine} title={data.title} dateLine={dateTime.dateLine} />
    </div>
  );
}

export async function renderDazziOgImage(
  data: DazziOgData,
  baseUrl?: string
): Promise<ImageResponse> {
  const fonts = await loadOgFonts();
  const origin = baseUrl ?? "http://127.0.0.1:3000";
  const frameUrl = `${origin}/og/dazzi-ticket-frame.png`;

  return new ImageResponse(<DazziTicketCard data={data} frameUrl={frameUrl} />, {
    ...OG_SIZE,
    fonts,
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
