import type { DazziOgData } from "./types";

/** Rich fixture for local design review — `/api/og/dazzi/preview` */
export function mockDazziOgPreview(eventId = "preview"): DazziOgData {
  return {
    eventId,
    title: "Sunset drinks at The Peak",
    description: "Casual hang after work — bring a friend. We'll grab the terrace if it's open.",
    hostName: "Alex Chen",
    hostAvatarUrl: "https://i.pravatar.cc/150?img=12",
    poiName: "Sky Lounge Hong Kong",
    startIso: "2026-06-14T18:30:00+08:00",
    timezone: "Asia/Hong_Kong",
    goingCount: 12,
    participantAvatarUrls: [
      "https://i.pravatar.cc/150?img=1",
      "https://i.pravatar.cc/150?img=5",
      "https://i.pravatar.cc/150?img=9",
    ],
    found: true,
  };
}

export function mockDazziOgPreviewEmpty(eventId = "preview-empty"): DazziOgData {
  return {
    eventId,
    title: "New jazz night — be first",
    description: "Trying a new spot downtown. RSVP if you're in.",
    hostName: "Jordan Lee",
    hostAvatarUrl: "https://i.pravatar.cc/150?img=32",
    poiName: "Blue Note HK",
    startIso: "2026-07-02T20:00:00+08:00",
    timezone: "Asia/Hong_Kong",
    goingCount: 0,
    participantAvatarUrls: [],
    found: true,
  };
}
