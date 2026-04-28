import type { Metadata } from "next";
import { SupportPage } from "./SupportPage";

export const metadata: Metadata = {
  title: "Support - Mapier",
  description:
    "Get help with Mapier. Contact our support team, browse FAQs, and find answers to common questions about the Mapier app.",
  alternates: { canonical: "/support" },
};

export default function Support() {
  return <SupportPage />;
}
