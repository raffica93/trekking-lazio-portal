import { parseDifficultyCodes, type DifficultyCode } from './difficulty';
import { tripDays } from './excursion-dates';
import { Excursion } from './excursion.model';

export type DurationBucket = 'all' | 'le4' | '4-6' | '6-8' | 'gt8';
export type DaysBucket = 'all' | '1' | '2' | '3' | '4-10' | 'gt10';
export type DistanceBucket = 'all' | 'le10' | '10-15' | '15-20' | 'gt20';
export type PrivateCarBucket = 'all' | 'yes' | 'no' | 'unknown';

export interface FilterState {
  category: 'all' | DifficultyCode;
  duration: DurationBucket;
  days: DaysBucket;
  distance: DistanceBucket;
  month: string;
  region: string;
  organizer: string;
  dateFrom: string;
  dateTo: string;
  vediSito: boolean;
  costMin: string;
  costMax: string;
  privateCar: PrivateCarBucket;
}

export const DEFAULT_FILTERS: FilterState = {
  category: 'all',
  duration: 'all',
  days: 'all',
  distance: 'all',
  month: 'all',
  region: 'all',
  organizer: 'all',
  dateFrom: '',
  dateTo: '',
  vediSito: false,
  costMin: '',
  costMax: '',
  privateCar: 'all'
};

export function currentYearMonth(now = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function nextYearMonth(now = new Date()): string {
  return currentYearMonth(new Date(now.getFullYear(), now.getMonth() + 1, 1));
}

export function landingFilters(now = new Date()): FilterState {
  return { ...DEFAULT_FILTERS, month: nextYearMonth(now) };
}

const MONTH_SHORT = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

const REGION_ORDER = [
  'Lazio',
  'Abruzzo',
  'Umbria',
  'Toscana',
  'Piemonte',
  'Trentino-Alto Adige',
  'Sicilia',
  'Sardegna',
  'Estero',
  'Altro'
];

const REGION_RULES: { region: string; tests: RegExp[] }[] = [
  { region: 'Estero', tests: [/turchia/, /lussemburgo/, /mullerthal/, /moselsteig/] },
  { region: 'Sicilia', tests: [/pantelleria/, /sicilia/] },
  { region: 'Sardegna', tests: [/supramonte/, /sardegna/, /baunei/] },
  { region: 'Trentino-Alto Adige', tests: [/trentino/, /dolomiti/, /fiemme/, /fassa/] },
  { region: 'Piemonte', tests: [/cozie/, /maira/, /piemonte/] },
  { region: 'Toscana', tests: [/toscana/, /apuane/, /orcia/] },
  { region: 'Umbria', tests: [/umbria/, /amerini/, /subasio/, /narni/, /gemini/] },
  {
    region: 'Abruzzo',
    tests: [
      /gran sasso/, /maiella/, /majella/, /marsicani/, /velino/, /sirente/,
      /pnalm/, /mainarde/, /\bmeta\b/, /aterno/, /barrea/, /trabocchi/,
      /sulmona/, /abruzzo/
    ]
  },
  {
    region: 'Lazio',
    tests: [
      /lucretili/, /ernici/, /aurunci/, /ausoni/, /lepini/, /sabini/, /reatini/,
      /cicolano/, /simbruini/, /albani/, /tuscia/, /sabatini/, /duchessa/,
      /nazzano/, /farfa/, /\blazio\b/
    ]
  }
];

function foldText(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

function resolveRegion(...parts: Array<string | undefined>): string {
  const haystack = foldText(parts.filter(Boolean).join(' '));
  return REGION_RULES.find((rule) => rule.tests.some((test) => test.test(haystack)))?.region ?? 'Altro';
}

function hoursFromToken(token: string): number | null {
  const clock = token.trim().match(/^(\d+)[.,](\d{2})$/);
  if (clock) {
    const minutes = Number(clock[2]);
    if (minutes < 60) return Number(clock[1]) + minutes / 60;
  }
  const parsed = Number(token.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

export function parseDurationHours(value: string | undefined): number | null {
  if (!value || !/\bore\b|\d\s*h\b/i.test(value)) return null;

  const withMinutes = value.match(/(\d+)\s*h\s*(\d+)/i);
  if (withMinutes) return Number(withMinutes[1]) + Number(withMinutes[2]) / 60;

  const range = value.match(/(\d+(?:[.,]\d+)?)\s*[/\u2013-]\s*(\d+(?:[.,]\d+)?)/);
  if (range) {
    const high = hoursFromToken(range[2]);
    if (high != null && high > 0) return high;
  }

  const clock = value.match(/(\d+[.,]\d{2})/);
  if (clock) {
    const hours = hoursFromToken(clock[1]);
    if (hours != null && hours > 0) return hours;
  }

  const simple = value.match(/(\d+(?:[.,]\d+)?)/);
  if (!simple) return null;
  const hours = hoursFromToken(simple[1]);
  return hours != null && hours > 0 ? hours : null;
}

export function classifyPrivateCar(transport: string | undefined | null): boolean | null {
  if (!transport) return null;
  const folded = foldText(transport);
  if (/auto\s*privat|auto\s*propr|mezzi\s*propr|\bmacchina\b|\bautomobile\b|\bauto\b/.test(folded)) {
    return true;
  }
  if (/pullman|\bbus\b|autobus|pulmino|treno|\baereo\b|nave|traghetto|mezzi\s+pubblic/.test(folded)) {
    return false;
  }
  return null;
}

export function parseCostAmount(cost: string | undefined): number | null {
  if (!cost || /vedi sito/i.test(cost)) return null;
  const match = cost.match(/(\d+(?:[.,]\d+)?)/);
  if (!match) return null;
  const amount = Number(match[1].replace(',', '.'));
  return Number.isFinite(amount) ? amount : null;
}

function addMonths(yearMonth: string, count: number): string {
  const [year, month] = yearMonth.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1 + count, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

function monthsInRange(start: string, end: string): string[] {
  const months: string[] = [];
  let cursor = start.slice(0, 7);
  const last = end.slice(0, 7);
  while (cursor <= last) {
    months.push(cursor);
    cursor = addMonths(cursor, 1);
  }
  return months;
}

export function normalizeExcursion(excursion: Excursion): Excursion {
  const dateEnd = excursion.dateEnd || excursion.date;
  const durationHours = excursion.durationHours ?? parseDurationHours(excursion.time);
  const costAmount = excursion.costAmount ?? parseCostAmount(excursion.cost);
  const privateCar = excursion.privateCar === true || excursion.privateCar === false
    ? excursion.privateCar
    : classifyPrivateCar(excursion.transport);
  return {
    ...excursion,
    dateEnd,
    days: excursion.days ?? tripDays(excursion.date, dateEnd),
    durationHours: durationHours ?? null,
    costAmount: costAmount ?? null,
    region: excursion.region || resolveRegion(excursion.location, excursion.title),
    privateCar
  };
}

export function monthLabel(yearMonth: string): string {
  const [, month] = yearMonth.split('-');
  return MONTH_SHORT[Number(month) - 1] ?? yearMonth;
}

export function availableMonths(excursions: Excursion[]): { id: string; label: string }[] {
  const ids = new Set<string>();
  for (const excursion of excursions) {
    for (const month of monthsInRange(excursion.date, excursion.dateEnd || excursion.date)) {
      ids.add(month);
    }
  }
  return [...ids].sort().map((id) => ({ id, label: monthLabel(id) }));
}

export function availableRegions(excursions: Excursion[]): string[] {
  const ids = [...new Set(excursions.map((excursion) => excursion.region).filter((region): region is string => Boolean(region)))];
  return ids.sort((a, b) => {
    const orderA = REGION_ORDER.indexOf(a);
    const orderB = REGION_ORDER.indexOf(b);
    const rankA = orderA === -1 ? REGION_ORDER.length : orderA;
    const rankB = orderB === -1 ? REGION_ORDER.length : orderB;
    return rankA - rankB || a.localeCompare(b, 'it');
  });
}

export function availableOrganizers(excursions: Excursion[]): string[] {
  const ids = [...new Set(
    excursions
      .map((excursion) => excursion.organizer)
      .filter((organizer): organizer is string => Boolean(organizer))
  )];
  return ids.sort((a, b) => a.localeCompare(b, 'it'));
}

export function dateBounds(excursions: Excursion[]): { min: string; max: string } {
  if (excursions.length === 0) {
    return { min: '', max: '' };
  }
  let min = excursions[0].date;
  let max = excursions[0].dateEnd || excursions[0].date;
  for (const excursion of excursions) {
    if (excursion.date < min) min = excursion.date;
    const end = excursion.dateEnd || excursion.date;
    if (end > max) max = end;
  }
  return { min, max };
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function shiftIsoDate(iso: string, days: number): string {
  const [year, month, day] = iso.split('-').map(Number);
  return toIsoDate(new Date(year, month - 1, day + days));
}

export function nextWeekRange(now = new Date()): { from: string; to: string } {
  const from = toIsoDate(now);
  return { from, to: shiftIsoDate(from, 6) };
}

export function isNextWeekSelected(filters: FilterState, now = new Date()): boolean {
  const range = nextWeekRange(now);
  return filters.dateFrom === range.from && filters.dateTo === range.to;
}

export interface FilterTag {
  id: string;
  label: string;
  patch: Partial<FilterState>;
}

const DAY_LABELS: Record<string, string> = {
  '1': '1 giorno',
  '2': '2 giorni',
  '3': '3 giorni',
  '4-10': '4–10 giorni',
  'gt10': '10+ giorni'
};

export function extraFilterTags(filters: FilterState): FilterTag[] {
  const tags: FilterTag[] = [];
  if (filters.category !== 'all') {
    tags.push({ id: 'category', label: filters.category, patch: { category: 'all' } });
  }
  if (filters.region !== 'all') {
    tags.push({ id: 'region', label: filters.region, patch: { region: 'all' } });
  }
  if (filters.days !== 'all') {
    tags.push({ id: 'days', label: DAY_LABELS[filters.days] ?? filters.days, patch: { days: 'all' } });
  }
  if (filters.privateCar === 'yes') {
    tags.push({ id: 'privateCar', label: 'Auto sì', patch: { privateCar: 'all' } });
  } else if (filters.privateCar === 'no') {
    tags.push({ id: 'privateCar', label: 'Auto no', patch: { privateCar: 'all' } });
  } else if (filters.privateCar === 'unknown') {
    tags.push({ id: 'privateCar', label: 'Auto n/d', patch: { privateCar: 'all' } });
  }
  if (filters.vediSito) {
    tags.push({ id: 'vediSito', label: 'Vedi sito', patch: { vediSito: false } });
  }
  if (filters.costMin !== '' || filters.costMax !== '') {
    tags.push({
      id: 'cost',
      label: `€${filters.costMin || '0'}–${filters.costMax || '…'}`,
      patch: { costMin: '', costMax: '' }
    });
  }
  return tags;
}

export function hasActiveFilters(filters: FilterState, _now = new Date()): boolean {
  return (Object.keys(DEFAULT_FILTERS) as (keyof FilterState)[])
    .some((key) => filters[key] !== DEFAULT_FILTERS[key]);
}

function matchesDuration(hours: number | null | undefined, bucket: DurationBucket): boolean {
  if (bucket === 'all') return true;
  if (hours == null) return false;
  if (bucket === 'le4') return hours <= 4;
  if (bucket === '4-6') return hours > 4 && hours <= 6;
  if (bucket === '6-8') return hours > 6 && hours <= 8;
  return hours > 8;
}

function matchesDays(days: number | null | undefined, bucket: DaysBucket): boolean {
  if (bucket === 'all') return true;
  const value = days ?? 1;
  if (bucket === '1') return value === 1;
  if (bucket === '2') return value === 2;
  if (bucket === '3') return value === 3;
  if (bucket === '4-10') return value >= 4 && value <= 10;
  return value > 10;
}

function matchesDistance(km: number | null | undefined, bucket: DistanceBucket): boolean {
  if (bucket === 'all') return true;
  if (km == null) return false;
  if (bucket === 'le10') return km <= 10;
  if (bucket === '10-15') return km > 10 && km <= 15;
  if (bucket === '15-20') return km > 15 && km <= 20;
  return km > 20;
}

function matchesMonth(excursion: Excursion, month: string): boolean {
  if (month === 'all') return true;
  return monthsInRange(excursion.date, excursion.dateEnd || excursion.date).includes(month);
}

function matchesPeriod(excursion: Excursion, dateFrom: string, dateTo: string): boolean {
  const start = excursion.date;
  const end = excursion.dateEnd || excursion.date;
  if (dateFrom && end < dateFrom) return false;
  if (dateTo && start > dateTo) return false;
  return true;
}

function matchesPrivateCar(value: boolean | null | undefined, bucket: PrivateCarBucket): boolean {
  if (bucket === 'all') return true;
  if (bucket === 'yes') return value === true;
  if (bucket === 'no') return value === false;
  return value !== true && value !== false;
}

function matchesCost(excursion: Excursion, filters: FilterState): boolean {
  const min = filters.costMin === '' ? null : Number(filters.costMin);
  const max = filters.costMax === '' ? null : Number(filters.costMax);
  const hasRange = (min != null && Number.isFinite(min)) || (max != null && Number.isFinite(max));
  if (!hasRange && !filters.vediSito) return true;

  const unknown = excursion.costAmount == null;
  const inRange = !unknown
    && (min == null || !Number.isFinite(min) || excursion.costAmount! >= min)
    && (max == null || !Number.isFinite(max) || excursion.costAmount! <= max);

  if (hasRange && filters.vediSito) return inRange || unknown;
  if (filters.vediSito) return unknown;
  return inRange;
}

export function applyFilters(excursions: Excursion[], filters: FilterState): Excursion[] {
  return excursions.filter((excursion) => {
    if (filters.category !== 'all' && !parseDifficultyCodes(excursion.category).includes(filters.category)) {
      return false;
    }
    if (!matchesDuration(excursion.durationHours, filters.duration)) return false;
    if (!matchesDays(excursion.days, filters.days)) return false;
    if (!matchesDistance(excursion.distanceKm, filters.distance)) return false;
    if (!matchesMonth(excursion, filters.month)) return false;
    if (filters.region !== 'all' && excursion.region !== filters.region) return false;
    if (filters.organizer !== 'all' && excursion.organizer !== filters.organizer) return false;
    if (!matchesPrivateCar(excursion.privateCar, filters.privateCar)) return false;
    if (!matchesPeriod(excursion, filters.dateFrom, filters.dateTo)) return false;
    return matchesCost(excursion, filters);
  });
}
