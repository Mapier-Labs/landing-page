import { notFound } from 'next/navigation';
import { getCharacter } from '@/lib/characters';
import ClaimFlow from './ClaimFlow';

interface PageProps {
  params: Promise<{ character: string }>;
  searchParams: Promise<{ p?: string | string[] }>;
}

export default async function CharacterPage({ params, searchParams }: PageProps) {
  const { character: slug } = await params;
  const sp = await searchParams;

  const character = getCharacter(slug);
  if (!character) {
    notFound();
  }

  const rawPoster = sp.p;
  const posterId = Array.isArray(rawPoster) ? rawPoster[0] : rawPoster;

  return <ClaimFlow character={character} posterId={posterId} />;
}

export function generateStaticParams() {
  // Pre-render the character pages at build time for fast loads from QR scans.
  // Dynamic slugs (none expected) would still 404 via notFound() above.
  return [];
}
