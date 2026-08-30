const WEEKDAYS_SHORT = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'];
const WEEKDAYS_LONG = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
const MONTHS_SHORT = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
const MONTHS_LONG = [
  'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
  'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'
];

export function parseIsoDate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
}

export function tripDays(date: string, dateEnd?: string | null): number {
  const end = dateEnd || date;
  const start = Date.parse(`${date}T00:00:00Z`);
  const finish = Date.parse(`${end}T00:00:00Z`);
  if (!Number.isFinite(start) || !Number.isFinite(finish) || finish < start) return 1;
  return Math.max(1, Math.round((finish - start) / 86_400_000) + 1);
}

export function nights(days: number | null | undefined): number {
  return Math.max(0, (days ?? 1) - 1);
}

export function durationLabel(days: number | null | undefined): string | null {
  const value = days ?? 1;
  if (value <= 1) return null;
  const nightCount = nights(value);
  return `${pluralize(value, 'giorno', 'giorni')} · ${pluralize(nightCount, 'notte', 'notti')}`;
}

export function formatDateRange(
  date: string,
  dateEnd?: string | null,
  style: 'short' | 'long' = 'short'
): string {
  const start = parseIsoDate(date);
  if (!start) return date;
  const endValue = dateEnd && dateEnd > date ? dateEnd : date;
  const end = parseIsoDate(endValue);
  if (!end || endValue === date) {
    return formatSingle(start, style);
  }
  return style === 'long' ? formatLongRange(start, end) : formatShortRange(start, end);
}

function pluralize(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`;
}

function formatSingle(date: Date, style: 'short' | 'long'): string {
  if (style === 'long') {
    return `${WEEKDAYS_LONG[date.getDay()]} ${date.getDate()} ${MONTHS_LONG[date.getMonth()]} ${date.getFullYear()}`;
  }
  return `${WEEKDAYS_SHORT[date.getDay()]} ${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`;
}

function formatShortRange(start: Date, end: Date): string {
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  if (sameMonth) {
    return `${WEEKDAYS_SHORT[start.getDay()]} ${start.getDate()}–${WEEKDAYS_SHORT[end.getDay()]} ${end.getDate()} ${MONTHS_SHORT[start.getMonth()]}`;
  }
  if (start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()} ${MONTHS_SHORT[start.getMonth()]}–${end.getDate()} ${MONTHS_SHORT[end.getMonth()]}`;
  }
  return `${start.getDate()} ${MONTHS_SHORT[start.getMonth()]} ${start.getFullYear()}–${end.getDate()} ${MONTHS_SHORT[end.getMonth()]} ${end.getFullYear()}`;
}

function formatLongRange(start: Date, end: Date): string {
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  if (sameMonth) {
    return `${WEEKDAYS_LONG[start.getDay()]} ${start.getDate()}–${WEEKDAYS_LONG[end.getDay()]} ${end.getDate()} ${MONTHS_LONG[start.getMonth()]} ${start.getFullYear()}`;
  }
  return `${WEEKDAYS_LONG[start.getDay()]} ${start.getDate()} ${MONTHS_LONG[start.getMonth()]} ${start.getFullYear()}–${WEEKDAYS_LONG[end.getDay()]} ${end.getDate()} ${MONTHS_LONG[end.getMonth()]} ${end.getFullYear()}`;
}
