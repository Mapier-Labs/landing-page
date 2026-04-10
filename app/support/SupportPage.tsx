"use client";

import { useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import { Mail, MessageCircle, Shield, MapPin, User, HelpCircle } from "lucide-react";

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
    a: "Once the app launches, you'll be able to delete your account and all associated data directly from the app settings. You can also contact us at support@mapier.ai to request data deletion.",
  },
];

export function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");
    // Simulate send — replace with real endpoint when available
    await new Promise((r) => setTimeout(r, 800));
    setFormStatus("sent");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

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
            <a href="mailto:support@mapier.ai" className="support-contact-link">
              support@mapier.ai
            </a>
          </div>
          <div className="support-contact-card">
            <MessageCircle size={28} />
            <h3>Response Time</h3>
            <p>We aim to respond to all inquiries within 24 hours during business days.</p>
          </div>
          <div className="support-contact-card">
            <Shield size={28} />
            <h3>Privacy Requests</h3>
            <p>For data deletion or privacy-related requests.</p>
            <a href="mailto:privacy@mapier.ai" className="support-contact-link">
              privacy@mapier.ai
            </a>
          </div>
        </div>
      </section>

      <section className="page-section">
        <h2 className="page-section-title">
          <MessageCircle size={24} />
          Send Us a Message
        </h2>
        {formStatus === "sent" ? (
          <div className="support-form-success">
            <p>Thank you! We&apos;ve received your message and will get back to you shortly.</p>
            <button
              type="button"
              className="page-btn"
              onClick={() => setFormStatus("idle")}
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="support-form">
            <div className="support-form__row">
              <div className="support-form__field">
                <label htmlFor="support-name">Name</label>
                <input
                  id="support-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                />
              </div>
              <div className="support-form__field">
                <label htmlFor="support-email">Email</label>
                <input
                  id="support-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div className="support-form__field">
              <label htmlFor="support-subject">Subject</label>
              <input
                id="support-subject"
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="How can we help?"
              />
            </div>
            <div className="support-form__field">
              <label htmlFor="support-message">Message</label>
              <textarea
                id="support-message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your issue or question..."
              />
            </div>
            <button type="submit" className="page-btn" disabled={formStatus === "sending"}>
              {formStatus === "sending" ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </section>

      <section className="page-section page-section--highlight">
        <h2 className="page-section-title">
          <MapPin size={24} />
          About Mapier
        </h2>
        <div className="about-cards">
          <div className="about-card">
            <MapPin size={32} />
            <h3>Live Social Map</h3>
            <p>See what&apos;s happening around you in real time — events, meetups, local buzz.</p>
          </div>
          <div className="about-card">
            <User size={32} />
            <h3>Meet Your People</h3>
            <p>AI-powered matching connects you with people who share your interests nearby.</p>
          </div>
          <div className="about-card">
            <Shield size={32} />
            <h3>Privacy First</h3>
            <p>Your location and data stay under your control. We never sell your information.</p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
