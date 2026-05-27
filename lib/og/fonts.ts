import { readFile } from "node:fs/promises";
import path from "node:path";

export type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 700;
  style: "normal" | "italic";
};

const fontCache = new Map<string, OgFont[]>();

function toArrayBuffer(buf: Buffer): ArrayBuffer {
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

async function loadPublicFont(relativePath: string): Promise<ArrayBuffer> {
  const filePath = path.join(process.cwd(), "public", relativePath.replace(/^\//, ""));
  return toArrayBuffer(await readFile(filePath));
}

/**
 * Fonts for ticket OG cards — Hornbill (display) + Nunito (labels/body).
 * Reads from `public/fonts/` directly (Node runtime). Don't switch to fetch:
 * the OG route runs server-side and can't reliably fetch its own localhost.
 */
export async function loadOgFonts(): Promise<OgFont[]> {
  const cacheKey = "local";
  const cached = fontCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const [hornbillBold, hornbillRegular, nunitoRegular, nunitoBold] = await Promise.all([
    loadPublicFont("/fonts/HornbillTrial-Bold.ttf"),
    loadPublicFont("/fonts/HornbillTrial-Regular.ttf"),
    loadPublicFont("/fonts/Nunito-Regular.ttf"),
    loadPublicFont("/fonts/Nunito-Bold.ttf"),
  ]);

  const fonts: OgFont[] = [
    { name: "Hornbill", data: hornbillBold, weight: 700, style: "normal" },
    { name: "Hornbill", data: hornbillRegular, weight: 400, style: "normal" },
    { name: "Nunito", data: nunitoRegular, weight: 400, style: "normal" },
    { name: "Nunito", data: nunitoBold, weight: 700, style: "normal" },
  ];

  fontCache.set(cacheKey, fonts);
  return fonts;
}
