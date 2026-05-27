import { NextResponse } from "next/server";
import { fetchDazziShareData } from "@/lib/og/dazzi/fetchDazziShareData";
import { formatDazziOgDateTime } from "@/lib/og/dazzi/formatDazziOgDateTime";
import { mockDazziOgPreview, mockDazziOgPreviewEmpty } from "@/lib/og/dazzi/mockDazziOgPreview";
import { esc, shareOgImageUrl, truncate } from "@/lib/og/html";

const APP_STORE_ID = process.env.APP_STORE_ID ?? "";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = await params;
  const data =
    eventId === "preview"
      ? mockDazziOgPreview()
      : eventId === "preview-empty"
        ? mockDazziOgPreviewEmpty()
        : await fetchDazziShareData(eventId);

  const ogTitle = data.found ? data.title : "Dazzi on Mapier";
  const ogDescription = data.found
    ? truncate(data.description, 200)
    : "Open Mapier to view this event.";
  const ogImage = shareOgImageUrl("dazzi", eventId);
  const deepLink = `mapier://dazzi/${eventId}`;
  const canonicalUrl = `https://www.mapier.ai/share/dazzi/${eventId}`;

  let metaDescription = ogDescription;
  if (data.found && data.startIso) {
    const { dateLine, timeLine } = formatDazziOgDateTime(data.startIso, data.timezone);
    const when = timeLine ? `${dateLine} · ${timeLine}` : dateLine;
    const where = data.poiName ? ` at ${data.poiName}` : "";
    metaDescription = truncate(`${when}${where}. ${ogDescription}`, 200);
  }

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(ogTitle)}</title>
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${esc(ogTitle)}" />
  <meta property="og:description" content="${esc(metaDescription)}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:image" content="${esc(ogImage)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="Mapier" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(ogTitle)}" />
  <meta name="twitter:description" content="${esc(metaDescription)}" />
  <meta name="twitter:image" content="${esc(ogImage)}" />
  ${APP_STORE_ID ? `<meta name="apple-itunes-app" content="app-id=${APP_STORE_ID}" />` : ""}
  <script>
    window.location.href = '${deepLink}';
  </script>
</head>
<body></body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=UTF-8" },
  });
}
