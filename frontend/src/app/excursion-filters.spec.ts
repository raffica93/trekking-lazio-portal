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

  it('lands on the next month without treating it as an extra filter', () => {
    const now = new Date(2026, 7, 30);
    expect(currentYearMonth(now)).toBe('2026-08');
    expect(nextYearMonth(now)).toBe('2026-09');
    expect(landingFilters(now).month).toBe('2026-09');
    expect(hasActiveFilters(landingFilters(now), now)).toBe(false);
    expect(hasActiveFilters({ ...landingFilters(now), month: 'all' }, now)).toBe(true);
    expect(hasActiveFilters({ ...landingFilters(now), month: '2026-08' }, now)).toBe(true);
    expect(hasActiveFilters({ ...landingFilters(now), month: '2026-10' }, now)).toBe(true);
    expect(extraFilterTags(landingFilters(now)).map((tag) => tag.label)).toEqual([]);
  });

  it('lists months and regions from the dataset', () => {
    const list = [
      sample({ date: '2026-09-12', dateEnd: '2026-09-13', region: 'Lazio' }),
      sample({ date: '2026-10-03', region: 'Abruzzo' })
    ].map((item) => normalizeExcursion(item));

    expect(availableMonths(list).map((month) => month.label)).toEqual(['Set', 'Ott']);
    expect(availableRegions(list)).toEqual(['Lazio', 'Abruzzo']);
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
});
