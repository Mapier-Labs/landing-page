"use client";

import { PageLayout } from "@/components/PageLayout";

export function TermsPage() {
  return (
    <PageLayout>
      <section className="page-section">
        <h1 className="page-title">Terms of Service</h1>
        <p className="page-subtitle">Last updated: April 10, 2025</p>
      </section>

      <section className="page-section legal-content">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using the Mapier mobile application, website, and related services
          (collectively, the &quot;Service&quot;) provided by Mapier Labs Inc. (&quot;Mapier,&quot;
          &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), you agree to be bound by these Terms
          of Service (&quot;Terms&quot;). If you do not agree to these Terms, do not use the
          Service.
        </p>

        <h2>2. Eligibility</h2>
        <p>
          You must be at least 13 years of age to use the Service. By using the Service, you
          represent and warrant that you meet this age requirement. If you are under 18, you must
          have your parent or guardian&apos;s permission.
        </p>

        <h2>3. Account Registration</h2>
        <p>
          To access certain features, you may need to create an account. You agree to provide
          accurate, current, and complete information and to keep your account credentials secure.
          You are responsible for all activity under your account.
        </p>

        <h2>4. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service for any unlawful purpose</li>
          <li>Harass, abuse, or harm other users</li>
          <li>Post content that is defamatory, obscene, or infringes intellectual property rights</li>
          <li>Impersonate another person or entity</li>
          <li>Attempt to gain unauthorized access to any part of the Service</li>
          <li>Use automated means to scrape or collect data from the Service</li>
          <li>Interfere with the proper operation of the Service</li>
          <li>Upload malicious code or attempt to compromise system security</li>
        </ul>

        <h2>5. User Content</h2>
        <p>
          You retain ownership of content you create on the Service. By posting content, you grant
          Mapier a non-exclusive, worldwide, royalty-free license to use, display, and distribute
          your content in connection with operating and promoting the Service. You are solely
          responsible for the content you post.
        </p>

        <h2>6. Intellectual Property</h2>
        <p>
          The Service, including its design, features, code, and branding, is owned by Mapier Labs
          Inc. and protected by copyright, trademark, and other intellectual property laws. You may
          not copy, modify, distribute, or create derivative works based on the Service without our
          written permission.
        </p>

        <h2>7. Location Services</h2>
        <p>
          Mapier uses location data to provide its core features. By enabling location services,
          you consent to the collection and use of your location information as described in our{" "}
          <a href="/privacy">Privacy Policy</a>. You can disable location access at any time
          through your device settings, though this may limit the functionality of the Service.
        </p>

        <h2>8. Third-Party Services</h2>
        <p>
          The Service may contain links to or integrations with third-party services. We are not
          responsible for the content, privacy practices, or terms of any third-party services.
          Your use of third-party services is at your own risk.
        </p>

        <h2>9. Disclaimers</h2>
        <p>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES
          OF ANY KIND, WHETHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE
          UNINTERRUPTED, ERROR-FREE, OR SECURE. WE DO NOT GUARANTEE THE ACCURACY OF ANY CONTENT OR
          RECOMMENDATIONS PROVIDED THROUGH THE SERVICE.
        </p>

        <h2>10. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, MAPIER LABS INC. SHALL NOT BE LIABLE FOR ANY
          INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE
          OF THE SERVICE. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID TO US, IF ANY,
          IN THE TWELVE MONTHS PRECEDING THE CLAIM.
        </p>

        <h2>11. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless Mapier Labs Inc., its officers, directors,
          employees, and agents from any claims, damages, or expenses arising from your use of the
          Service or violation of these Terms.
        </p>

        <h2>12. Termination</h2>
        <p>
          We may suspend or terminate your access to the Service at any time for any reason,
          including violation of these Terms. You may delete your account at any time through the
          app settings or by contacting <a href="mailto:support@mapier.ai">support@mapier.ai</a>.
          Upon termination, your right to use the Service ceases immediately.
        </p>

        <h2>13. Changes to Terms</h2>
        <p>
          We may update these Terms from time to time. We will notify you of material changes by
          posting the updated Terms on this page. Your continued use of the Service after changes
          constitutes acceptance of the updated Terms.
        </p>

        <h2>14. Governing Law</h2>
        <p>
          These Terms are governed by the laws of the State of California, without regard to
          conflict of law principles. Any disputes shall be resolved in the courts located in
          San Francisco County, California.
        </p>

        <h2>15. Contact</h2>
        <p>For questions about these Terms, please contact us:</p>
        <ul>
          <li>
            Email: <a href="mailto:legal@mapier.ai">legal@mapier.ai</a>
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
