import { describe, expect, it } from 'vitest';
import { formatItalianDate, parseItalianDate } from './italian-date-input';

describe('Italian date inputs', () => {
  it('formats ISO dates as gg/mm/aaaa', () => {
    expect(formatItalianDate('2026-09-03')).toBe('03/09/2026');
  });

  it('parses valid Italian dates back to ISO', () => {
    expect(parseItalianDate('3/9/2026')).toBe('2026-09-03');
    expect(parseItalianDate('31/02/2026')).toBe('');
  });
});
