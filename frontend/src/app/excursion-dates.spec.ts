import { durationLabel, formatDateRange, nights, tripDays } from './excursion-dates';

describe('excursion dates', () => {
  it('counts inclusive calendar days and derived nights', () => {
    expect(tripDays('2026-09-12')).toBe(1);
    expect(tripDays('2026-09-12', '2026-09-12')).toBe(1);
    expect(tripDays('2026-09-12', '2026-09-13')).toBe(2);
    expect(tripDays('2026-12-30', '2027-01-02')).toBe(4);
    expect(nights(1)).toBe(0);
    expect(nights(2)).toBe(1);
    expect(nights(8)).toBe(7);
    expect(durationLabel(1)).toBeNull();
    expect(durationLabel(2)).toBe('2 giorni · 1 notte');
    expect(durationLabel(8)).toBe('8 giorni · 7 notti');
  });

  it('formats single days and ranges in Italian', () => {
    expect(formatDateRange('2026-09-12')).toBe('sab 12 set');
    expect(formatDateRange('2026-09-12', '2026-09-12')).toBe('sab 12 set');
    expect(formatDateRange('2026-09-12', '2026-09-13')).toBe('sab 12–dom 13 set');
    expect(formatDateRange('2026-12-30', '2027-01-02')).toBe('30 dic 2026–2 gen 2027');
    expect(formatDateRange('2026-08-31', '2026-09-01')).toBe('31 ago–1 set');
    expect(formatDateRange('2026-09-12', '2026-09-13', 'long'))
      .toBe('sabato 12–domenica 13 settembre 2026');
    expect(formatDateRange('2026-09-12', undefined, 'long'))
      .toBe('sabato 12 settembre 2026');
    expect(formatDateRange('2026-12-30', '2027-01-02', 'long'))
      .toBe('mercoledì 30 dicembre 2026–sabato 2 gennaio 2027');
  });
});
