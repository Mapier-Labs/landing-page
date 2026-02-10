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
  keywords: [
    "AI navigation",
    "intelligent navigation",
    "map navigation",
    "LLM navigation",
    "voice navigation",
    "personalized navigation",
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
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Mapier",
      url: "https://mapier.ai",
      description:
        "AI-powered navigation app that leverages Large Language Model technology for intelligent, personalized navigation experiences.",
    },
    {
      "@type": "WebSite",
      name: "Mapier",
      url: "https://mapier.ai",
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
