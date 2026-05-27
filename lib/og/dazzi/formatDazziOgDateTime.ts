export type DazziOgDateTime = {
  dateLine: string;
  timeLine: string;
};

/** Start date + time in the event timezone (no multi-day range). */
export function formatDazziOgDateTime(iso: string, timezone: string): DazziOgDateTime {
  const date = new Date(iso);
  const dateLine = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: timezone,
  }).format(date);
  const timeLine = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: timezone,
  }).format(date);
  return { dateLine, timeLine };
}
