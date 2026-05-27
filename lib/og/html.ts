export function esc(str: string): string {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function truncate(str: string, max: number): string {
  return str.length <= max ? str : `${str.slice(0, max - 1)}\u2026`;
}

export const SHARE_BASE_URL = "https://www.mapier.ai";

export function shareOgImageUrl(type: string, id: string): string {
  return `${SHARE_BASE_URL}/api/og/${type}/${encodeURIComponent(id)}`;
}
