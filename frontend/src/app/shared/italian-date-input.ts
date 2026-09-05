const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Keeps the value sent to the API in ISO format while showing Italian dates. */
export function formatItalianDate(iso: string): string {
  const match = ISO_DATE_PATTERN.exec(iso);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : '';
}

/** Converts gg/mm/aaaa (also accepting . or -) to the ISO value used by the API. */
export function parseItalianDate(value: string): string {
  const match = /^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/.exec(value.trim());
  if (!match) return '';
  const day = match[1].padStart(2, '0');
  const month = match[2].padStart(2, '0');
  const iso = `${match[3]}-${month}-${day}`;
  const parsed = new Date(`${iso}T00:00:00Z`);
  return parsed.toISOString().slice(0, 10) === iso ? iso : '';
}
