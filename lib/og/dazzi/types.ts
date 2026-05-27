export type DazziOgData = {
  eventId: string;
  title: string;
  description: string;
  hostName: string;
  hostAvatarUrl: string | null;
  poiName: string | null;
  startIso: string | null;
  timezone: string;
  goingCount: number;
  participantAvatarUrls: string[];
  found: boolean;
};
