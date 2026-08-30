import { CAI_SEZIONE_LINKS } from './cai-info.data';

/**
 * High-chroma categorical swatches (Kelly contrast + primary crayon hues).
 * Adjacent list items stay far apart on the hue wheel.
 */
const SECTION_COLOR_BY_ID: Record<string, string> = {
  alatri: '#F3C300',
  amatrice: '#875692',
  antrodoco: '#F38400',
  aprilia: '#3D9BFF',
  cassino: '#E25822',
  colleferro: '#008856',
  esperia: '#FF2E93',
  frascati: '#0067A5',
  frosinone: '#FF6B4A',
  gallinaro: '#604E97',
  latina: '#F6A600',
  leonessa: '#B3446C',
  monterotondo: '#D4CC00',
  palestrina: '#882D17',
  rieti: '#8DB600',
  roma: '#BE0032',
  sora: '#2B3D26',
  tivoli: '#00B8D4',
  viterbo: '#111111'
};

const FALLBACK_PALETTE = Object.values(SECTION_COLOR_BY_ID);

function foldName(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function hashPalette(value: string): string {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return FALLBACK_PALETTE[hash % FALLBACK_PALETTE.length];
}

const COLOR_BY_NAME = new Map<string, string>(
  CAI_SEZIONE_LINKS.map((section) => [
    foldName(section.name),
    SECTION_COLOR_BY_ID[section.id] ?? hashPalette(section.name)
  ])
);

export function sectionColor(organizer: string | null | undefined): string {
  if (!organizer) return '#57534e';
  const folded = foldName(organizer);
  return COLOR_BY_NAME.get(folded) ?? hashPalette(folded);
}
