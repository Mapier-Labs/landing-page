import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { renderSharedLinkPage } from "./sharedLinkPage";

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL ?? "").replace(/\/+$/, "");
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

interface PostPreviewData {
  title: string;
  description: string;
  imageUrl: string | null;
}

interface ProfilePreviewData {
  title: string;
  description: string;
  imageUrl: string | null;
}

function getSupabase(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_KEY);
}

function truncate(str: string, max: number): string {
  return str.length <= max ? str : `${str.slice(0, max - 1)}...`;
}

export async function getPostPreviewData(postId: string): Promise<PostPreviewData | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data: post } = await supabase
    .from("posts")
    .select("id, content, title, author:profiles!author_id ( username, name )")
    .eq("id", postId)
    .eq("is_deleted", false)
    .eq("status", "published")
    .eq("visibility", "public")
    .single();

  const { data: media } = await supabase
    .from("media")
    .select("url")
    .eq("post_id", postId)
    .eq("status", "confirmed")
    .order("created_at", { ascending: true })
    .limit(1);

  if (!post) return null;

  const author = (post as Record<string, unknown>).author as {
    username: string | null;
    name: string | null;
  } | null;
  const authorDisplay = author?.name ?? author?.username ?? "someone";
  const title = (post.title as string | null) ?? `Post by ${authorDisplay}`;
  const description = truncate(
    (post.content as string | null) ?? "Check out this post on Mapier",
    200
  );
  const imageUrl = (media as Array<{ url: string }> | null)?.[0]?.url ?? null;

  return { title, description, imageUrl };
}

export async function getProfilePreviewData(username: string): Promise<ProfilePreviewData | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, name, bio, avatar_url, post_count")
    .eq("username", username)
    .single();

  if (!profile) return null;

  const displayName = (profile.name as string | null) ?? `@${username}`;
  const title = `${displayName} (@${profile.username as string}) on Mapier`;
  const description = profile.bio
    ? truncate(profile.bio as string, 200)
    : `${(profile.post_count as number | null) ?? 0} posts on Mapier`;

  return {
    title,
    description,
    imageUrl: (profile.avatar_url as string | null) ?? null,
  };
}

export async function getGroupInvitePreviewData(token: string): Promise<{
  title: string;
  description: string;
  imageUrl: string | null;
} | null> {
  if (!BACKEND_URL) return null;

  const response = await fetch(`${BACKEND_URL}/chat/invites/${encodeURIComponent(token)}`, {
    next: { revalidate: 60 },
  });
  if (!response.ok) return null;

  const body = (await response.json()) as {
    data?: {
      channel?: {
        name?: string | null;
        image?: string | null;
        memberCount?: number;
        joinMode?: string | null;
      };
    };
  };
  const channel = body.data?.channel;
  if (!channel) return null;

  return {
    title: channel.name ? `Join ${channel.name} on Mapier` : "Join this group on Mapier",
    description: `${channel.memberCount ?? 0} people are in this group. Open Mapier to join the conversation.`,
    imageUrl: channel.image ?? null,
  };
}

export async function renderPostSharePage(postId: string): Promise<NextResponse> {
  const data = await getPostPreviewData(postId);
  return renderSharedLinkPage({
    title: data?.title ?? "Post on Mapier",
    description: data?.description ?? "Check out this post on Mapier",
    imageUrl: data?.imageUrl,
    canonicalPath: `/post/${encodeURIComponent(postId)}`,
    deepLink: `mapier://post/${encodeURIComponent(postId)}`,
  });
}

export async function renderProfileSharePage(username: string): Promise<NextResponse> {
  const data = await getProfilePreviewData(username);
  return renderSharedLinkPage({
    title: data?.title ?? `@${username} on Mapier`,
    description: data?.description ?? "View this Mapier profile.",
    imageUrl: data?.imageUrl,
    canonicalPath: `/profile/${encodeURIComponent(username)}`,
    deepLink: `mapier://profile/${encodeURIComponent(username)}`,
    ogType: "profile",
  });
}

export async function renderDazziSharePage(eventId: string): Promise<NextResponse> {
  const data = await getPostPreviewData(eventId);
  return renderSharedLinkPage({
    title: data?.title ?? "Dazzi on Mapier",
    description: data?.description ?? "Open this Dazzi event on Mapier.",
    imageUrl: data?.imageUrl,
    canonicalPath: `/dazzi/${encodeURIComponent(eventId)}`,
    deepLink: `mapier://dazzi/${encodeURIComponent(eventId)}`,
  });
}

export function renderReferralInvitePage(code: string): NextResponse {
  return renderSharedLinkPage({
    title: "You are invited to Mapier",
    description: "Join Mapier and start discovering what is happening around you.",
    canonicalPath: `/invite/${encodeURIComponent(code)}`,
    deepLink: `mapier://invite/${encodeURIComponent(code)}`,
    ctaLabel: "Accept invite",
  });
}

export async function renderGroupInvitePage(token: string): Promise<NextResponse> {
  const data = await getGroupInvitePreviewData(token);
  return renderSharedLinkPage({
    title: data?.title ?? "Join this group on Mapier",
    description:
      data?.description ?? "Open Mapier to preview the group and request to join the conversation.",
    imageUrl: data?.imageUrl,
    canonicalPath: `/group/invite/${encodeURIComponent(token)}`,
    deepLink: `mapier://group/invite/${encodeURIComponent(token)}`,
    ctaLabel: "Open group",
  });
}
