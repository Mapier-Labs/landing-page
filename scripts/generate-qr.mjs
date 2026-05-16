#!/usr/bin/env node
// Regenerate the printable QR for the QR poster campaign.
//
//   node scripts/generate-qr.mjs
//
// Output: public/qr/poster.png  →  served at /qr/poster.png on the deployed site.
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const url = "https://www.mapier.ai/sticker";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = resolve(root, "public/qr/poster.png");

mkdirSync(dirname(outPath), { recursive: true });

execSync(`npx --yes qrcode "${url}" -o "${outPath}" -t png -w 1024 -m 4`, {
  stdio: "inherit",
  cwd: root,
});

console.log(`\nQR saved → ${outPath}`);
console.log(`Encoded URL: ${url}`);
