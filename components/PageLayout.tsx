"use client";

import { useEffect } from "react";
import Link from "next/link";

interface PageLayoutProps {
  children: React.ReactNode;
}

const NAV_LINKS = [
  { href: "/support", label: "Support" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function PageLayout({ children }: PageLayoutProps) {
  useEffect(() => {
    document.documentElement.classList.add("page-scrollable");
    return () => document.documentElement.classList.remove("page-scrollable");
  }, []);

  return (
    <div className="page-layout">
      <header className="page-header">
        <Link href="/" className="page-header__logo">
          Mapier
        </Link>
        <nav className="page-header__nav">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="page-header__link">
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="page-main">{children}</main>

      <footer className="page-footer">
        <div className="page-footer__inner">
          <div className="page-footer__brand">
            <Link href="/" className="page-footer__logo">
              Mapier
            </Link>
            <p className="page-footer__tagline">
              The AI-personalized live map of social and local life.
            </p>
          </div>
          <div className="page-footer__links">
            <div className="page-footer__col">
              <h4>Product</h4>
              <Link href="/#waitlist">Join Waitlist</Link>
              <a
                href="https://www.linkedin.com/company/mapier-labs/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Careers
              </a>
            </div>
            <div className="page-footer__col">
              <h4>Legal</h4>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
            </div>
            <div className="page-footer__col">
              <h4>Support</h4>
              <Link href="/support">Help Center</Link>
              <a href="mailto:hello@mapier.ai">hello@mapier.ai</a>
            </div>
          </div>
        </div>
        <div className="page-footer__bottom">
          <span>© {new Date().getFullYear()} Mapier Labs Inc. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
