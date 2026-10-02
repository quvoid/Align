/**
 * Signage fills for things that need a colour of their own (brief cards, brief
 * headers in admin). Full class names so Tailwind's scanner keeps them.
 */
export const FILLS = [
  "bg-fill-mint",
  "bg-fill-lilac",
  "bg-fill-sky",
  "bg-fill-butter",
  "bg-fill-rose",
] as const;

/**
 * FNV-1a over the key, so a brief keeps its colour on every page. The seed was
 * picked so today's six briefs get five different fills with no two
 * neighbours (or cards stacked in the 3-column grid) alike; later briefs land
 * wherever the hash puts them.
 */
const SEED = 216;

export function fillFor(key: string): (typeof FILLS)[number] {
  let hash = (2166136261 ^ SEED) >>> 0;
  for (let i = 0; i < key.length; i++) hash = Math.imul(hash ^ key.charCodeAt(i), 16777619) >>> 0;
  return FILLS[hash % FILLS.length]!;
}
