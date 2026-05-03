// Resizes the backdrop snazzy-image to a small blurry-friendly webp.
// The on-screen image is filtered with `blur(40px)` so the source detail is
// destroyed anyway — 1500×1500 at quality 70 looks identical and is ~50× smaller.
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const src = resolve(root, "public/landing/snazzy-image.png");
const out = resolve(root, "public/landing/snazzy-image.webp");

const result = await sharp(src)
  .resize(1500, 1500, { fit: "cover" })
  .webp({ quality: 72 })
  .toFile(out);

console.log(`wrote ${out}`);
console.log(`size: ${result.size} bytes (${(result.size / 1024).toFixed(0)} KB)`);

// JPEG fallback for next/og's Satori — it can't decode webp. Used by
// /share/character/[slug] to render the backdrop into the story image.
const outJpg = resolve(root, "public/landing/snazzy-image.jpg");
const jpgResult = await sharp(src)
  .resize(1080, 1920, { fit: "cover" })
  .blur(40)
  .jpeg({ quality: 80 })
  .toFile(outJpg);

console.log(`wrote ${outJpg}`);
console.log(`size: ${jpgResult.size} bytes (${(jpgResult.size / 1024).toFixed(0)} KB)`);
