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
  title: "Mapier - AI驱动的智能导航应用",
  description: "Mapier利用先进的大型语言模型技术，理解复杂的用户意图，提供个性化、智能化的导航体验。支持AI理解、个性化推荐、POI搜索、用户上传和语音控制等功能。",
  keywords: ["AI导航", "智能导航", "地图导航", "LLM导航", "语音导航", "个性化导航"],
  openGraph: {
    title: "Mapier - AI驱动的智能导航应用",
    description: "让AI理解你的每一个导航需求",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
