import { truncate } from "../html";
import { getSupabaseAdmin } from "../supabaseAdmin";
import type { DazziOgData } from "./types";

const FALLBACK: Omit<DazziOgData, "eventId"> = {
  title: "Dazzi on Mapier",
  description: "Open Mapier to view this event.",
  hostName: "Mapier",
  hostAvatarUrl: null,
  poiName: null,
  startIso: null,
  timezone: "UTC",
  goingCount: 0,
  participantAvatarUrls: [],
  found: false,
};

type AuthorRow = { username: string | null; name: string | null; avatar_url: string | null };

export async function fetchDazziShareData(eventId: string): Promise<DazziOgData> {
  const supabase = getSupabaseAdmin();

  const { data: post } = await supabase
    .from("posts")
    .select(
      `
      id,
      title,
      content,
      category,
      event_start_time,
      event_timezone,
      rsvp_going_count,
      poi_id,
      author:profiles!author_id ( username, name, avatar_url )
    `
    )
    .eq("id", eventId)
    .eq("is_deleted", false)
    .eq("status", "published")
    .eq("category", "event")
    .maybeSingle();

  if (!post) {
    return { eventId, ...FALLBACK };
  }

  let poiName: string | null = null;
  const poiId = post.poi_id as string | null;
  if (poiId) {
    const { data: place } = await supabase
      .from("places")
      .select("name")
      .eq("id", poiId)
      .maybeSingle();
    poiName = (place?.name as string | null)?.trim() ?? null;
  }

  const authorRaw = post.author as AuthorRow | AuthorRow[] | null;
  const author = Array.isArray(authorRaw) ? (authorRaw[0] ?? null) : authorRaw;
  const hostName = author?.name ?? (author?.username ? `@${author.username}` : "Host");
  const title =
    (post.title as string | null)?.trim() ||
    truncate((post.content as string) ?? "Dazzi event", 80);
  const description = truncate((post.content as string) ?? "", 140);
  const goingCount = (post.rsvp_going_count as number | null) ?? 0;

  let participantAvatarUrls: string[] = [];
  if (goingCount > 0) {
    const { data: rsvps } = await supabase
      .from("event_rsvps")
      .select("profile:profiles!event_rsvps_user_id_fkey ( avatar_url )")
      .eq("event_id", eventId)
      .eq("status", "going")
      .eq("approval_status", "approved")
      .order("created_at", { ascending: true })
      .limit(3);

    participantAvatarUrls = (rsvps ?? [])
      .map((row) => {
        const profileRaw = row.profile as
          | { avatar_url: string | null }
          | { avatar_url: string | null }[]
          | null;
        const profile = Array.isArray(profileRaw) ? (profileRaw[0] ?? null) : profileRaw;
        return profile?.avatar_url?.trim() ?? "";
      })
      .filter(Boolean);
  }

  return {
    eventId,
    title,
    description,
    hostName,
    hostAvatarUrl: author?.avatar_url ?? null,
    poiName,
    startIso: (post.event_start_time as string | null) ?? null,
    timezone: (post.event_timezone as string | null) ?? "UTC",
    goingCount,
    participantAvatarUrls,
    found: true,
  };
}
