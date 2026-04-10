"use client";

import { useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import { Mail, MessageCircle, Shield, HelpCircle } from "lucide-react";

const FAQS = [
  {
    q: "What is Mapier?",
    a: "Mapier is an AI-personalized live map of social and local life. It helps you discover what's happening around you, meet people you vibe with, explore local businesses, and leave creative doodles across the city.",
  },
  {
    q: "When will Mapier be available?",
    a: "Mapier is currently in development. Join our waitlist on the homepage to be notified when we launch. Early waitlist members will get priority access.",
  },
  {
    q: "Which platforms will Mapier support?",
    a: "Mapier will be available on both iOS and Android at launch.",
  },
  {
    q: "Is Mapier free to use?",
    a: "Yes, Mapier will be free to download and use. We may offer optional premium features in the future.",
  },
  {
    q: "How does Mapier protect my privacy?",
    a: "We take privacy seriously. Location data is used only to power your personalized experience and is never sold to third parties. You can review our full privacy policy for more details.",
  },
  {
    q: "How can I delete my account or data?",
    a: "Once the app launches, you'll be able to delete your account and all associated data directly from the app settings. You can also contact us at hello@mapier.ai to request data deletion.",
  },
];

export function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  return (
    <PageLayout>
      <section className="page-section">
        <h1 className="page-title">Support</h1>
        <p className="page-subtitle">
          We&apos;re here to help. Browse our FAQ or contact our team directly.
        </p>
      </section>

      <section className="page-section">
        <h2 className="page-section-title">
          <HelpCircle size={24} />
          Frequently Asked Questions
        </h2>
        <div className="faq-list">
          {FAQS.map((faq, i) => (
            <div key={i} className={`faq-item ${openFaq === i ? "faq-item--open" : ""}`}>
              <button
                type="button"
                className="faq-item__q"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
              >
                <span>{faq.q}</span>
                <svg
                  className="faq-item__chevron"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {openFaq === i && <p className="faq-item__a">{faq.a}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="page-section">
        <h2 className="page-section-title">
          <Mail size={24} />
          Contact Us
        </h2>
        <div className="support-contact-grid">
          <div className="support-contact-card">
            <Mail size={28} />
            <h3>Email Support</h3>
            <p>For general inquiries and support requests.</p>
            <a href="mailto:hello@mapier.ai" className="support-contact-link">
              hello@mapier.ai
            </a>
          </div>
          <div className="support-contact-card">
            <MessageCircle size={28} />
            <h3>Response Time</h3>
            <p>We aim to respond to all inquiries within 24 hours during business days.</p>
          </div>
          <div className="support-contact-card">
            <Shield size={28} />
            <h3>Privacy &amp; Data</h3>
            <p>For data deletion or privacy-related requests, reach out to the same email or read our policy.</p>
            <a href="/privacy" className="support-contact-link">
              Privacy Policy
            </a>
          </div>
        </div>
      </section>

    </PageLayout>
  );
}
