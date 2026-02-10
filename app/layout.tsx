import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mapier.ai"),
  title: "Mapier - AI-Powered Navigation App",
  description:
    "Mapier leverages advanced Large Language Model technology to understand complex user intents and deliver personalized, intelligent navigation experiences. Features include AI understanding, personalized recommendations, POI search, user uploads, and voice control.",
  applicationName: "Mapier",
  category: "navigation",
  keywords: [
    "AI navigation",
    "intelligent navigation",
    "map navigation",
    "LLM navigation",
    "voice navigation",
    "personalized navigation",
    "AI map app",
    "smart navigation",
    "LLM map",
    "AI route planner",
    "intelligent directions",
  ],
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Mapier - AI-Powered Navigation App",
    description: "Let AI Understand Your Every Navigation Need",
    type: "website",
    url: "/",
    siteName: "Mapier",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mapier - AI-Powered Navigation App",
    description: "Let AI Understand Your Every Navigation Need",
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
        "AI-powered navigation app that leverages Large Language Model technology for intelligent, personalized navigation experiences.",
    },
    {
      "@type": "WebSite",
      name: "Mapier",
      url: "https://mapier.ai",
    },
    {
      "@type": "SoftwareApplication",
      name: "Mapier",
      applicationCategory: "NavigationApplication",
      operatingSystem: "iOS, Android",
      description:
        "AI-powered navigation app that understands complex user intents and delivers personalized, intelligent navigation experiences.",
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
