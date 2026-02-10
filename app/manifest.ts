import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mapier - AI-Powered Navigation",
    short_name: "Mapier",
    description:
      "AI-powered navigation app that understands complex user intents and delivers personalized, intelligent navigation experiences.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a1a",
    theme_color: "#3b82f6",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
