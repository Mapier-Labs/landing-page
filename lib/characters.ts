export type CharacterTier = 'SSS' | 'SS' | 'S' | 'A' | 'B' | 'C';

export interface Character {
  slug: string;
  name: string;
  tier: CharacterTier;
  rarityLabel: string;
  tagline: string;
}

export const CHARACTERS: readonly Character[] = [
  { slug: 'mapi',          name: 'MAPI',           tier: 'SSS', rarityLabel: 'Top 0.01%', tagline: 'hi' },
  { slug: 'piece-of-shit', name: 'Piece of Shit',  tier: 'SS',  rarityLabel: 'Top 0.1%',  tagline: "someone's gotta do it" },
  { slug: 'tardigrade',    name: 'Tardigrade',     tier: 'S',   rarityLabel: 'Top 1%',    tagline: "i'll outlive you" },
  { slug: 'nautilus',      name: 'Nautilus',       tier: 'S',   rarityLabel: 'Top 1%',    tagline: 'older than trees. look it up.' },
  { slug: 'alien',         name: 'Alien',          tier: 'A',   rarityLabel: 'Top 5%',    tagline: 'wrong planet. oh well.' },
  { slug: 'crested-gecko', name: 'Crested Gecko',  tier: 'A',   rarityLabel: 'Top 5%',    tagline: 'licks own eyeballs to clean them' },
  { slug: 'leopard',       name: 'Leopard',        tier: 'A',   rarityLabel: 'Top 5%',    tagline: 'runs faster than your wifi' },
  { slug: 'seahorse',      name: 'Seahorse',       tier: 'B',   rarityLabel: 'Top 15%',   tagline: 'dad gives birth. yeah.' },
  { slug: 'seal',          name: 'Seal',           tier: 'B',   rarityLabel: 'Top 15%',   tagline: 'basically a wet dog' },
  { slug: 'raven',         name: 'Raven',          tier: 'B',   rarityLabel: 'Top 15%',   tagline: 'smarter than your intern' },
  { slug: 'raccoon',       name: 'Raccoon',        tier: 'C',   rarityLabel: 'Top 40%',   tagline: 'what was in the trash is now in me' },
  { slug: 'hedgehog',      name: 'Hedgehog',       tier: 'C',   rarityLabel: 'Top 40%',   tagline: "don't touch. i warned you." },
  { slug: 'deer',          name: 'Deer',           tier: 'C',   rarityLabel: 'Top 40%',   tagline: 'why is it in my yard' },
  { slug: 'cat',           name: 'Cat',            tier: 'C',   rarityLabel: 'Top 40%',   tagline: 'yeah i pushed it off the table' },
  { slug: 'pigeon',        name: 'Pigeon',         tier: 'C',   rarityLabel: 'Top 40%',   tagline: 'city chicken' },
  { slug: 'crushed-can',   name: 'Crushed Can',    tier: 'C',   rarityLabel: 'Top 40%',   tagline: 'had a rough week this is the doc' },
] as const;

export function getCharacter(slug: string): Character | undefined {
  return CHARACTERS.find((c) => c.slug === slug);
}
