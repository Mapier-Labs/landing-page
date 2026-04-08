import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

const APP_STORE_ID = process.env.APP_STORE_ID ?? "";
const APP_STORE_URL = APP_STORE_ID ? `https://apps.apple.com/app/mapier/id${APP_STORE_ID}` : "";

function esc(str: string): string {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function truncate(str: string, max: number): string {
  return str.length <= max ? str : `${str.slice(0, max - 1)}\u2026`;
}

export async function GET(_req: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, name, bio, avatar_url, post_count")
    .eq("username", username)
    .single();

  const displayName = (profile?.name as string | null) ?? `@${username}`;
  const ogTitle = profile
    ? `${displayName} (@${profile.username as string}) on Mapier`
    : `@${username} on Mapier`;
  const ogDescription = profile?.bio
    ? truncate(profile.bio as string, 200)
    : `${(profile?.post_count as number | null) ?? 0} posts on Mapier`;
  const avatarUrl = (profile?.avatar_url as string | null) ?? null;
  const deepLink = `mapier://profile/${username}`;

  const imageTag = avatarUrl ? `<meta property="og:image" content="${esc(avatarUrl)}" />` : "";
  const twitterImage = avatarUrl ? `<meta name="twitter:image" content="${esc(avatarUrl)}" />` : "";

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(ogTitle)}</title>
  <meta property="og:type" content="profile" />
  <meta property="og:title" content="${esc(ogTitle)}" />
  <meta property="og:description" content="${esc(ogDescription)}" />
  <meta property="og:url" content="https://www.mapier.ai/share/profile/${username}" />
  ${imageTag}
  <meta property="og:site_name" content="Mapier" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${esc(ogTitle)}" />
  <meta name="twitter:description" content="${esc(ogDescription)}" />
  ${twitterImage}
  ${APP_STORE_ID ? `<meta name="apple-itunes-app" content="app-id=${APP_STORE_ID}" />` : ""}
  <script>
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = '${deepLink}';
    document.body.appendChild(iframe);
    setTimeout(function() {
      var ua = navigator.userAgent || '';
      if (/android/i.test(ua)) {
        window.location.href = 'https://play.google.com/store/apps/details?id=ai.mapier';
      }${APP_STORE_URL ? ` else { window.location.href = '${APP_STORE_URL}'; }` : ""}
    }, 1500);
  </script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f5f5f5; color: #333; text-align: center; padding: 1rem; }
    .container { max-width: 400px; }
    h1 { font-size: 1.25rem; margin-bottom: 0.5rem; }
    p { color: #666; font-size: 0.95rem; }
    a { display: inline-block; margin-top: 1rem; padding: 0.75rem 1.5rem; background: #000; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 500; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Mapier</h1>
    <p>Check out ${esc(displayName)} on Mapier</p>
    ${APP_STORE_URL ? `<a href="${APP_STORE_URL}">Get the App</a>` : '<p style="margin-top:1rem;font-weight:500;">Open in Mapier</p>'}
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=UTF-8" },
  });
}
