import type { Metadata } from "next";
import { TermsPage } from "./TermsPage";

export const metadata: Metadata = {
  title: "Terms of Service - Mapier",
  description:
    "Mapier's terms of service. Read the terms and conditions for using the Mapier app and website.",
  alternates: { canonical: "/terms" },
};

export default function Terms() {
  return <TermsPage />;
}
