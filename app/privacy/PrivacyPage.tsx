"use client";

import { PageLayout } from "@/components/PageLayout";

export function PrivacyPage() {
  return (
    <PageLayout>
      <section className="page-section">
        <h1 className="page-title">Privacy Policy</h1>
        <p className="page-subtitle">Last updated: April 10, 2025</p>
      </section>

      <section className="page-section legal-content">
        <h2>1. Introduction</h2>
        <p>
          Mapier Labs Inc. (&quot;Mapier,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;)
          is committed to protecting your privacy. This Privacy Policy explains how we collect, use,
          disclose, and safeguard your information when you use the Mapier mobile application and
          website (collectively, the &quot;Service&quot;).
        </p>
        <p>
          By using the Service, you agree to the collection and use of information in accordance
          with this policy. If you do not agree, please do not use the Service.
        </p>

        <h2>2. Information We Collect</h2>
        <h3>2.1 Information You Provide</h3>
        <ul>
          <li>
            <strong>Account Information:</strong> When you create an account, we collect your name,
            email address, and profile information you choose to provide.
          </li>
          <li>
            <strong>User Content:</strong> Posts, doodles, comments, and other content you create
            within the app.
          </li>
          <li>
            <strong>Communications:</strong> Messages you send to us via support channels or
            in-app feedback.
          </li>
        </ul>

        <h3>2.2 Information Collected Automatically</h3>
        <ul>
          <li>
            <strong>Location Data:</strong> With your permission, we collect precise geolocation
            data to power map-based features. You can disable location access at any time through
            your device settings.
          </li>
          <li>
            <strong>Device Information:</strong> Device type, operating system, unique device
            identifiers, and mobile network information.
          </li>
          <li>
            <strong>Usage Data:</strong> How you interact with the Service, including features used,
            pages visited, and time spent.
          </li>
          <li>
            <strong>Log Data:</strong> IP address, browser type, access times, and referring URLs.
          </li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve the Service</li>
          <li>Personalize your experience with AI-powered recommendations</li>
          <li>Show you relevant events, places, and people nearby</li>
          <li>Process and respond to your support requests</li>
          <li>Send important service updates and notifications</li>
          <li>Detect, prevent, and address technical issues and abuse</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>4. How We Share Your Information</h2>
        <p>We do not sell your personal information. We may share information in these limited circumstances:</p>
        <ul>
          <li>
            <strong>With Other Users:</strong> Your public profile and content you post are visible
            to other Mapier users based on your privacy settings.
          </li>
          <li>
            <strong>Service Providers:</strong> Trusted third-party companies that help us operate
            the Service (e.g., hosting, analytics), bound by confidentiality obligations.
          </li>
          <li>
            <strong>Legal Requirements:</strong> When required by law, court order, or governmental
            authority.
          </li>
          <li>
            <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale
            of assets, your information may be transferred.
          </li>
        </ul>

        <h2>5. Data Retention</h2>
        <p>
          We retain your personal information only for as long as necessary to fulfill the purposes
          outlined in this policy, unless a longer retention period is required by law. When you
          delete your account, we will delete or anonymize your personal data within 30 days,
          except where retention is required for legal compliance.
        </p>

        <h2>6. Data Security</h2>
        <p>
          We implement industry-standard security measures to protect your information, including
          encryption in transit and at rest, access controls, and regular security audits. However,
          no method of transmission over the internet is 100% secure, and we cannot guarantee
          absolute security.
        </p>

        <h2>7. Your Rights and Choices</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your account and data</li>
          <li>Opt out of marketing communications</li>
          <li>Disable location tracking through your device settings</li>
          <li>Export your data in a portable format</li>
        </ul>
        <p>
          To exercise any of these rights, contact us at{" "}
          <a href="mailto:hello@mapier.ai">hello@mapier.ai</a>.
        </p>

        <h2>8. Children&apos;s Privacy</h2>
        <p>
          The Service is not intended for children under 13 years of age. We do not knowingly
          collect personal information from children under 13. If we learn we have collected such
          information, we will take steps to delete it promptly.
        </p>

        <h2>9. International Data Transfers</h2>
        <p>
          Your information may be transferred to and processed in countries other than your own.
          We ensure appropriate safeguards are in place for such transfers in compliance with
          applicable data protection laws.
        </p>

        <h2>10. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any material
          changes by posting the updated policy on this page and updating the &quot;Last
          updated&quot; date. Your continued use of the Service after changes constitutes acceptance
          of the updated policy.
        </p>

        <h2>11. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy or our data practices, please contact us:
        </p>
        <ul>
          <li>
            Email: <a href="mailto:hello@mapier.ai">hello@mapier.ai</a>
          </li>
          <li>
            Support: <a href="/support">mapier.ai/support</a>
          </li>
        </ul>
        <p>Mapier Labs Inc.<br />San Francisco, CA</p>
      </section>
    </PageLayout>
  );
}
