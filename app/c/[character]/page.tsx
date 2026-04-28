import { notFound } from "next/navigation";
import { getCharacter } from "@/lib/characters";
import ClaimFlow from "./ClaimFlow";

interface PageProps {
  params: Promise<{ character: string }>;
  searchParams: Promise<{ p?: string | string[]; t?: string | string[] }>;
}

export default async function CharacterPage({ params, searchParams }: PageProps) {
  const { character: slug } = await params;
  const sp = await searchParams;

  const character = getCharacter(slug);
  if (!character) {
    notFound();
  }

  const posterId = Array.isArray(sp.p) ? sp.p[0] : sp.p;
  const posterToken = Array.isArray(sp.t) ? sp.t[0] : sp.t;

  return <ClaimFlow character={character} posterId={posterId} posterToken={posterToken} />;
}
