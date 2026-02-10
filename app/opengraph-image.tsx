import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mapier - AI-Powered Navigation App";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #7c3aed 100%)",
        color: "white",
        fontFamily: "sans-serif",
        padding: "60px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            fontSize: "72px",
            fontWeight: 800,
            letterSpacing: "-2px",
          }}
        >
          Mapier
        </div>
      </div>
      <div
        style={{
          fontSize: "36px",
          fontWeight: 600,
          textAlign: "center",
          marginBottom: "32px",
          opacity: 0.95,
        }}
      >
        Let AI Understand Your Every Navigation Need
      </div>
      <div
        style={{
          display: "flex",
          gap: "24px",
          fontSize: "20px",
          opacity: 0.85,
        }}
      >
        <span>AI Intent Understanding</span>
        <span style={{ opacity: 0.5 }}>|</span>
        <span>Personalized Routes</span>
        <span style={{ opacity: 0.5 }}>|</span>
        <span>Voice Control</span>
        <span style={{ opacity: 0.5 }}>|</span>
        <span>Smart Planning</span>
      </div>
    </div>,
    { ...size }
  );
}
