import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mapier.ai"),
  title: "Mapier - Live Map of Social & Local Life",
  description:
    "Mapier is the AI personalized live map of social and local life. Discover what's happening around you, meet people you vibe with, explore local businesses, and leave creative doodles across the city.",
  applicationName: "Mapier",
  category: "social",
  keywords: [
    "live social map",
    "local discovery app",
    "meet people nearby",
    "AI social app",
    "neighborhood events",
    "spontaneous meetups",
    "local businesses",
    "geo-location social",
    "city live feed",
    "doodle posts",
    "social map app",
  ],
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Mapier - Live Map of Social & Local Life",
    description:
      "Explore what's happening around you, meet people you vibe with, and make the city pop with creative doodles.",
    type: "website",
    url: "/",
    siteName: "Mapier",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mapier - Live Map of Social & Local Life",
    description:
      "Explore what's happening around you, meet people you vibe with, and make the city pop with creative doodles.",
  },
  other: {
    "google-site-verification": "PLACEHOLDER",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Mapier",
      url: "https://mapier.ai",
      logo: "https://mapier.ai/icon.png",
      sameAs: ["https://www.linkedin.com/company/mapier-labs/"],
      description:
        "Mapier is the AI personalized live map of social and local life. A geo-location social app to discover what's happening around you and connect with people you vibe with.",
    },
    {
      "@type": "WebSite",
      name: "Mapier",
      url: "https://mapier.ai",
    },
    {
      "@type": "SoftwareApplication",
      name: "Mapier",
      applicationCategory: "SocialNetworkingApplication",
      operatingSystem: "iOS, Android",
      description:
        "AI personalized live map to explore your city, meet people nearby, discover local businesses, and leave creative doodles across the neighborhood.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${nunito.className} antialiased`}>{children}</body>
    </html>
  );
}
