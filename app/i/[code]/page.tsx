import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InviteLanding from "@/components/InviteLanding";
import { getInvite } from "@/lib/invite";

// Friend-invite landing page. URL shape: /i/<code>. Mapier users invite friends
// via SMS that contains `https://mapier.ai/i/<code>`. When the recipient taps
// the link:
//   • If the Mapier iOS app is installed → the iOS Universal Link opens the
//     app and this page is never rendered. (The app then calls the same
//     /contacts/invite/<code> endpoint to record the click and link contacts.)
//   • Otherwise (no app installed, Android without app, desktop) → this page
//     renders, fires a click-tracking POST, and offers App Store / Play Store
//     buttons so the recipient can install the app. On first signup, the app
//     reads the pending code (install referrer / clipboard fallback) and the
//     backend bidirectionally connects the two contacts.
//
// Universal Links: `/i/*` must be added to the apple-app-site-association
// paths array and the assetlinks.json equivalent for Android before this can
// ship — currently only `/share/post/*` and `/share/profile/*` are listed.
// Filed as an open question in the PR; left out of this commit to avoid
// touching unrelated routes.

// iOS Safari's smart app banner reads `<meta name="apple-itunes-app">` from
// the document `<head>`. The component previously emitted it inside `<main>`,
// which Safari ignores. Routing it through `metadata.other` makes Next inline
// the tag into `<head>` server-side. Stays unset (no banner) when we don't
// have a real App Store ID yet — better than emitting `app-id=` with an
// empty value.
const APP_STORE_ID = process.env.NEXT_PUBLIC_APP_STORE_ID ?? "";

interface PageProps {
  // Next 16 App Router exposes route params as a Promise — must be awaited
  // before destructuring. See https://nextjs.org/docs/app/api-reference/file-conventions/page.
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  const inviter = await getInvite(code);

  if (!inviter) {
    // Let the page itself emit notFound() — but still return clean defaults so
    // a crawler hitting a bad code doesn't index a half-rendered title.
    return {
      title: "Invite not found · Mapier",
      description: "This invite link is no longer valid.",
      robots: { index: false, follow: false },
    };
  }

  const title = `${inviter.display_name} invited you to Mapier`;
  const description =
    "Mapier is the social map for what's actually happening around you — join your friends.";
  const url = `https://mapier.ai/i/${code}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: "Mapier",
      title,
      description,
      // The inviter avatar makes the SMS link preview personal (their face
      // shows up in iMessage/WhatsApp rich previews).
      images: inviter.avatar_url ? [{ url: inviter.avatar_url }] : undefined,
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: inviter.avatar_url ? [inviter.avatar_url] : undefined,
    },
    other: APP_STORE_ID ? { "apple-itunes-app": `app-id=${APP_STORE_ID}` } : undefined,
  };
}

export default async function InvitePage({ params }: PageProps) {
  const { code } = await params;
  const inviter = await getInvite(code);

  if (!inviter) {
    notFound();
  }

  return <InviteLanding code={code} inviter={inviter} />;
}
