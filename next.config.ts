import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      // Legacy QR-claim URL. /c was the original sticker QR target; the
      // campaign now points QRs at /sticker for a more meaningful URL.
      // 308 (permanent) so the redirect doesn't change the request method
      // and downstream link previews / search engines update.
      {
        source: "/c",
        destination: "/sticker",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
