import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mapier - Unlock the hidden layer in your city";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#0a0a0a",
          position: "relative",
          overflow: "hidden",
          fontFamily: "sans-serif",
        }}
      >
        {/* Background map image */}
        <img
          alt=""
          src={`${process.env.NEXT_PUBLIC_BASE_URL || ""}/landing/bg-map.png`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.4,
          }}
        />

        {/* Gradient overlay for readability */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(135deg, rgba(37, 99, 235, 0.7) 0%, rgba(124, 58, 237, 0.6) 50%, rgba(236, 72, 153, 0.5) 100%)",
          }}
        />

        {/* Sticker decorations - top left */}
        <img
          alt=""
          src={`${
            process.env.NEXT_PUBLIC_BASE_URL || ""
          }/landing/stickers/Frame 3185590.png`}
          style={{
            position: "absolute",
            top: "40px",
            left: "60px",
            width: "120px",
            height: "auto",
            transform: "rotate(-12deg)",
          }}
        />

        {/* Sticker decorations - top right */}
        <img
          alt=""
          src={`${
            process.env.NEXT_PUBLIC_BASE_URL || ""
          }/landing/stickers/Group 2628.png`}
          style={{
            position: "absolute",
            top: "80px",
            right: "80px",
            width: "80px",
            height: "auto",
            transform: "rotate(15deg)",
          }}
        />

        {/* Sticker decorations - bottom left */}
        <img
          alt=""
          src={`${
            process.env.NEXT_PUBLIC_BASE_URL || ""
          }/landing/stickers/Group 2619.png`}
          style={{
            position: "absolute",
            bottom: "60px",
            left: "100px",
            width: "90px",
            height: "auto",
            transform: "rotate(-8deg)",
          }}
        />

        {/* Sticker decorations - bottom right */}
        <img
          alt=""
          src={`${
            process.env.NEXT_PUBLIC_BASE_URL || ""
          }/landing/stickers/Group 2620.png`}
          style={{
            position: "absolute",
            bottom: "80px",
            right: "60px",
            width: "70px",
            height: "auto",
            transform: "rotate(20deg)",
          }}
        />

        {/* Main content */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          {/* App icon and title */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
            }}
          >
            <img
              alt="Mapier app icon"
              src={`${
                process.env.NEXT_PUBLIC_BASE_URL || ""
              }/landing/app icon/Property 1=Default.png`}
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "22px",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
              }}
            />
            <div
              style={{
                fontSize: "72px",
                fontWeight: 800,
                letterSpacing: "-2px",
                color: "white",
                textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
              }}
            >
              Mapier
            </div>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: "42px",
              fontWeight: 700,
              textAlign: "center",
              color: "white",
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
              maxWidth: "900px",
              lineHeight: 1.2,
            }}
          >
            Unlock the hidden layer in your city.
          </div>

          {/* Feature badges */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "16px",
            }}
          >
            <span
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "white",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                padding: "10px 20px",
                borderRadius: "20px",
                backdropFilter: "blur(10px)",
              }}
            >
              AI Navigation
            </span>
            <span
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "white",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                padding: "10px 20px",
                borderRadius: "20px",
                backdropFilter: "blur(10px)",
              }}
            >
              Social Discovery
            </span>
            <span
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "white",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                padding: "10px 20px",
                borderRadius: "20px",
                backdropFilter: "blur(10px)",
              }}
            >
              Trip Planning
            </span>
          </div>
        </div>

        {/* Additional scattered sticker */}
        <img
          alt=""
          src={`${
            process.env.NEXT_PUBLIC_BASE_URL || ""
          }/landing/stickers/Group 2627.png`}
          style={{
            position: "absolute",
            top: "50%",
            left: "40px",
            width: "60px",
            height: "auto",
            transform: "rotate(-25deg)",
          }}
        />

        {/* Additional scattered sticker */}
        <img
          alt=""
          src={`${
            process.env.NEXT_PUBLIC_BASE_URL || ""
          }/landing/stickers/Group 2626.png`}
          style={{
            position: "absolute",
            bottom: "40%",
            right: "50px",
            width: "85px",
            height: "auto",
            transform: "rotate(10deg)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
