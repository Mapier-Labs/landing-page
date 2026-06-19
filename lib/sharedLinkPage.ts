import { NextResponse } from "next/server";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mapier.ai").replace(/\/+$/, "");
const APP_STORE_ID = process.env.APP_STORE_ID ?? "";
const DEFAULT_PREVIEW_IMAGE = `${SITE_URL}/characters/mapi.png`;

export interface LinkPreview {
  title: string;
  description: string;
  canonicalPath: string;
  deepLink: string;
  imageUrl?: string | null;
  ogType?: "website" | "profile";
  ctaLabel?: string;
}

function esc(str: string): string {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function canonicalUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function renderSharedLinkPage(preview: LinkPreview): NextResponse {
  const absoluteUrl = canonicalUrl(preview.canonicalPath);
  const imageUrl = preview.imageUrl ?? DEFAULT_PREVIEW_IMAGE;
  const bodyImage = preview.imageUrl
    ? `<img class="preview-image" src="${esc(preview.imageUrl)}" alt="" />`
    : `<img class="preview-mascot" src="/characters/mapi.png" alt="" />`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(preview.title)}</title>
  <link rel="canonical" href="${esc(absoluteUrl)}" />
  <meta property="og:type" content="${preview.ogType ?? "website"}" />
  <meta property="og:title" content="${esc(preview.title)}" />
  <meta property="og:description" content="${esc(preview.description)}" />
  <meta property="og:url" content="${esc(absoluteUrl)}" />
  <meta property="og:image" content="${esc(imageUrl)}" />
  <meta property="og:site_name" content="Mapier" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(preview.title)}" />
  <meta name="twitter:description" content="${esc(preview.description)}" />
  <meta name="twitter:image" content="${esc(imageUrl)}" />
  ${APP_STORE_ID ? `<meta name="apple-itunes-app" content="app-id=${APP_STORE_ID}, app-argument=${esc(preview.deepLink)}" />` : ""}
  <style>
    :root { color-scheme: dark; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #050505;
      color: white;
      font-family: ui-rounded, "SF Pro Rounded", "Nunito", system-ui, sans-serif;
    }
    main {
      width: min(440px, calc(100vw - 40px));
      text-align: center;
      padding: 48px 0;
    }
    .preview-image {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      border-radius: 28px;
      margin-bottom: 24px;
      background: #242426;
    }
    .preview-mascot {
      width: 164px;
      margin: 0 auto 24px;
      display: block;
    }
    h1 {
      margin: 0 0 10px;
      font-size: clamp(28px, 7vw, 42px);
      line-height: 1.04;
      letter-spacing: 0;
    }
    p {
      margin: 0 auto 24px;
      color: rgba(255,255,255,0.72);
      font-size: 17px;
      line-height: 1.45;
    }
    a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 50px;
      padding: 0 22px;
      border-radius: 999px;
      color: #080808;
      background: white;
      font-weight: 800;
      text-decoration: none;
    }
    .secondary {
      margin-left: 10px;
      color: white;
      background: rgba(255,255,255,0.12);
    }
  </style>
  <script>
    window.setTimeout(function () {
      window.location.href = ${JSON.stringify(preview.deepLink)};
    }, 250);
  </script>
</head>
<body>
  <main>
    ${bodyImage}
    <h1>${esc(preview.title)}</h1>
    <p>${esc(preview.description)}</p>
    <a href="${esc(preview.deepLink)}">${esc(preview.ctaLabel ?? "Open in Mapier")}</a>
    <a class="secondary" href="/">Get Mapier</a>
  </main>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=UTF-8" },
  });
}
