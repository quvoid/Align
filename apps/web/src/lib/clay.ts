/**
 * Clay fills for things that need a colour of their own (brief cards, brief
 * headers in admin). Full class names so Tailwind's scanner keeps them.
 * Peach is left out on purpose: it melts into the peach page ground.
 */
export const CLAY_FILLS = [
  "bg-clay-mint",
  "bg-clay-lilac",
  "bg-clay-sky",
  "bg-clay-butter",
  "bg-clay-rose",
] as const;

/**
 * FNV-1a over the key, so a brief keeps its colour on every page. The seed was
 * picked so today's six briefs get five different fills with no two
 * neighbours (or cards stacked in the 3-column grid) alike; later briefs land
 * wherever the hash puts them.
 */
const SEED = 216;

export function clayFillFor(key: string): (typeof CLAY_FILLS)[number] {
  let hash = (2166136261 ^ SEED) >>> 0;
  for (let i = 0; i < key.length; i++) hash = Math.imul(hash ^ key.charCodeAt(i), 16777619) >>> 0;
  return CLAY_FILLS[hash % CLAY_FILLS.length]!;
}
