import { vi } from 'vitest';
import {
  applyFilters,
  DEFAULT_FILTERS,
  extraFilterTags,
  currentYearMonth,
  hasActiveFilters,
  isNextWeekSelected,
  landingFilters,
  nextYearMonth,
  nextWeekRange,
  normalizeExcursion,
  availableMonths,
  availableOrganizers,
  availableOrganizerRegions,
  currentAndFutureExcursions,
  availableRegions
} from './excursion-filters';
import { Excursion } from './excursion.model';

function sample(overrides: Partial<Excursion> = {}): Excursion {
  return normalizeExcursion({
    id: '1',
    title: 'Monte Viglio',
    date: '2026-09-12',
    category: 'E',
    link: 'https://example.com',
    organizer: 'CAI Roma',
    location: 'Monti Ernici',
    lat: 41.8,
    lng: 13.4,
    cost: 'Vedi sito',
    time: '6 ore',
    ...overrides
  });
}

describe('excursion filters', () => {
  beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date(2026, 8, 5)); });
  afterEach(() => vi.useRealTimers());
  it('normalizes missing dateEnd, hours, days and region', () => {
    const excursion = normalizeExcursion(sample({
      dateEnd: undefined,
      durationHours: undefined,
      days: undefined,
      region: undefined,
      time: '7.30 ore (soste escluse)',
      location: 'Gran Sasso'
    }));

    expect(excursion.dateEnd).toBe('2026-09-12');
    expect(excursion.days).toBe(1);
    expect(excursion.durationHours).toBe(7.5);
    expect(excursion.region).toBe('Abruzzo');
    expect(excursion.costAmount).toBeNull();
  });

  it('combines month, region and date range', () => {
    const list = [
      sample({ id: 'lazio', date: '2026-09-12', location: 'Monti Ernici', region: 'Lazio' }),
      sample({ id: 'abruzzo', date: '2026-10-03', location: 'Gran Sasso', region: 'Abruzzo' }),
      sample({
        id: 'week',
        date: '2026-09-26',
        dateEnd: '2026-10-03',
        days: 8,
        location: 'Lussemburgo - Mullerthal',
        region: 'Estero'
      })
    ].map((item) => normalizeExcursion(item));

    expect(applyFilters(list, { ...DEFAULT_FILTERS, month: '2026-09' }).map((item) => item.id)).toEqual(['lazio', 'week']);
    expect(applyFilters(list, { ...DEFAULT_FILTERS, region: 'Abruzzo' }).map((item) => item.id)).toEqual(['abruzzo']);
    expect(applyFilters(list, {
      ...DEFAULT_FILTERS,
      dateFrom: '2026-09-20',
      dateTo: '2026-10-01'
    }).map((item) => item.id)).toEqual(['week']);
  });

  it('treats vedi sito and numeric cost as union when both are on', () => {
    const list = [
      sample({ id: 'unknown', cost: 'Vedi sito', costAmount: null }),
      sample({ id: 'cheap', cost: '20 euro', costAmount: 20 }),
      sample({ id: 'dear', cost: '80 euro', costAmount: 80 })
    ];

    expect(applyFilters(list, { ...DEFAULT_FILTERS, vediSito: true }).map((item) => item.id)).toEqual(['unknown']);
    expect(applyFilters(list, { ...DEFAULT_FILTERS, costMax: '30' }).map((item) => item.id)).toEqual(['cheap']);
    expect(applyFilters(list, {
      ...DEFAULT_FILTERS,
      vediSito: true,
      costMax: '30'
    }).map((item) => item.id)).toEqual(['unknown', 'cheap']);
  });

  it('filters trip length and distance buckets', () => {
    const list = [
      sample({ id: 'day', days: 1, distanceKm: 8, durationHours: 4 }),
      sample({ id: 'weekend', days: 2, distanceKm: 13, durationHours: 7 }),
      sample({ id: 'week', days: 8, distanceKm: 22, durationHours: 9 })
    ];

    expect(applyFilters(list, { ...DEFAULT_FILTERS, days: '2' }).map((item) => item.id)).toEqual(['weekend']);
    expect(applyFilters(list, { ...DEFAULT_FILTERS, days: '4-10' }).map((item) => item.id)).toEqual(['week']);
    expect(applyFilters(list, { ...DEFAULT_FILTERS, distance: '10-15' }).map((item) => item.id)).toEqual(['weekend']);
    expect(applyFilters(list, { ...DEFAULT_FILTERS, duration: '6-8' }).map((item) => item.id)).toEqual(['weekend']);
  });

  it('filters private car, organized travel and unknown transport', () => {
    const list = [
      sample({ id: 'car', transport: 'auto private', privateCar: true }),
      sample({ id: 'bus', transport: 'pullman', privateCar: false }),
      sample({ id: 'unknown', transport: undefined, privateCar: null })
    ];

    expect(applyFilters(list, { ...DEFAULT_FILTERS, privateCar: 'yes' }).map((item) => item.id)).toEqual(['car']);
    expect(applyFilters(list, { ...DEFAULT_FILTERS, privateCar: 'no' }).map((item) => item.id)).toEqual(['bus']);
    expect(applyFilters(list, { ...DEFAULT_FILTERS, privateCar: 'unknown' }).map((item) => item.id)).toEqual(['unknown']);
    expect(normalizeExcursion(sample({ transport: 'Mezzi Propri', privateCar: undefined })).privateCar).toBe(true);
  });

  it('treats next week as a date-range shortcut and lists extra tags', () => {
    const now = new Date(2026, 7, 29);
    const range = nextWeekRange(now);
    expect(range).toEqual({ from: '2026-08-29', to: '2026-09-04' });
    expect(isNextWeekSelected({ ...DEFAULT_FILTERS, dateFrom: range.from, dateTo: range.to }, now)).toBe(true);
    expect(extraFilterTags({ ...DEFAULT_FILTERS, category: 'EEA', region: 'Lazio' }).map((tag) => tag.label))
      .toEqual(['EEA', 'Lazio']);
  });

  it('lands on all current and future months and resets without a month cap', () => {
    const now = new Date(2026, 7, 30);
    expect(currentYearMonth(now)).toBe('2026-08');
    expect(nextYearMonth(now)).toBe('2026-09');
    expect(landingFilters(now).month).toBe('all');
    expect(hasActiveFilters(DEFAULT_FILTERS, now)).toBe(false);
    expect(hasActiveFilters(landingFilters(now), now)).toBe(false);
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, month: 'all' }, now)).toBe(false);
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, month: '2026-08' }, now)).toBe(true);
    expect(extraFilterTags(landingFilters(now)).map((tag) => tag.label)).toEqual([]);
  });

  it('lists months and regions from the dataset', () => {
    const list = [
      sample({ date: '2026-09-12', dateEnd: '2026-09-13', region: 'Lazio' }),
      sample({ date: '2026-10-03', region: 'Abruzzo' })
    ].map((item) => normalizeExcursion(item));

    expect(availableMonths(list).map((month) => month.label)).toEqual(['Set 2026', 'Ott 2026']);
    expect(availableRegions(list)).toEqual(['Abruzzo', 'Lazio']);
  });

  it('filters and lists CAI sections', () => {
    const list = [
      sample({ id: 'roma', organizer: 'CAI Roma' }),
      sample({ id: 'tivoli', organizer: 'CAI Tivoli', title: 'Monte Morra' })
    ];

    expect(availableOrganizers(list)).toEqual(['CAI Roma', 'CAI Tivoli']);
    expect(applyFilters(list, { ...DEFAULT_FILTERS, organizer: 'CAI Tivoli' }).map((item) => item.id))
      .toEqual(['tivoli']);
  });
  it('removes previous months dynamically while preserving overlapping trips', () => {
    const list = [sample({ id: 'past', date: '2026-08-30', dateEnd: '2026-08-31' }), sample({ id: 'overlap', date: '2026-08-30', dateEnd: '2026-09-02' }), sample({ id: 'later', date: '2026-12-20' })];
    expect(currentAndFutureExcursions(list, new Date(2026, 8, 1)).map(item => item.id)).toEqual(['overlap', 'later']);
    expect(availableMonths(list, new Date(2026, 8, 1)).map(item => item.id)).toEqual(['2026-09', '2026-12']);
    expect(applyFilters(list, DEFAULT_FILTERS, new Date(2026, 9, 1)).map(item => item.id)).toEqual(['later']);
  });

  it('handles December to January without showing last year’s months', () => {
    const list = [sample({ id: 'old', date: '2026-12-20', dateEnd: '2026-12-20' }), sample({ id: 'trip', date: '2026-12-30', dateEnd: '2027-01-02' })];
    expect(currentAndFutureExcursions(list, new Date(2027, 0, 1)).map(item => item.id)).toEqual(['trip']);
    expect(availableMonths(list, new Date(2027, 0, 1))).toEqual([{ id: '2027-01', label: 'Gen 2027' }]);
  });

  it('distinguishes the CAI region from the destination and searches without accents', () => {
    const list = [sample({ id: 'milano', organizer: 'CAI Milano', organizerRegion: 'Lombardia', region: 'Piemonte', title: 'Valle d’Aosta – Colle' }), sample({ id: 'roma', organizer: 'CAI Roma', organizerRegion: 'Lazio' })];
    expect(availableOrganizerRegions(list)).toEqual(['Lazio', 'Lombardia']);
    expect(availableOrganizers(list, 'Lombardia')).toEqual(['CAI Milano']);
    expect(applyFilters(list, { ...DEFAULT_FILTERS, organizerRegion: 'Lombardia', query: 'aosta colle' }).map(item => item.id)).toEqual(['milano']);
    expect(applyFilters(list, { ...DEFAULT_FILTERS, organizerRegion: 'Piemonte' })).toEqual([]);
  });

});
