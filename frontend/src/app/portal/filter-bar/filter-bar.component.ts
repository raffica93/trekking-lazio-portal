import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Excursion } from '../../shared/excursion.model';
import { DIFFICULTIES } from '../../shared/difficulty';
import { CaiDirectoryEntry, CaiDirectoryService } from '../cai-directory.service';
import {
  FilterState,
  FilterTag,
  availableMonths,
  availableOrganizers,
  availableOrganizerRegions,
  availableRegions,
  currentYearMonth,
  dateBounds,
  extraFilterTags,
  hasActiveFilters,
  isNextWeekSelected,
  landingFilters,
  nextWeekRange
} from '../../shared/excursion-filters';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.css'
})
export class FilterBarComponent implements OnInit {
  private host = inject(ElementRef<HTMLElement>);
  private readonly directoryService = inject(CaiDirectoryService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  @Input() filters: FilterState = landingFilters();
  @Input() allExcursions: Excursion[] = [];
  @Input() resultCount = 0;
  @Output() filtersChange = new EventEmitter<FilterState>();

  megaOpen = false;
  sectionSearch = '';
  directoryEntries: CaiDirectoryEntry[] = [];
  readonly difficulties = DIFFICULTIES;

  ngOnInit() {
    this.directoryService.getDirectory().subscribe(entries => {
      this.directoryEntries = entries;
      this.changeDetector.markForCheck();
    });
  }

  get months() {
    return availableMonths(this.allExcursions);
  }

  get regions() {
    return availableRegions(this.allExcursions);
  }

  get organizers() {
    if (this.directoryEntries.length > 0) {
      return Array.from(new Set(this.directoryEntries
        .filter(entry => this.filters.organizerRegion === 'all' || entry.region === this.filters.organizerRegion)
        .map(entry => entry.organizer)
        .filter(Boolean)))
        .sort((a, b) => a.localeCompare(b, 'it'));
    }
    return availableOrganizers(this.allExcursions, this.filters.organizerRegion);
  }

  get organizerRegions() {
    if (this.directoryEntries.length > 0) {
      return Array.from(new Set(this.directoryEntries.map(entry => entry.region).filter(Boolean)))
        .sort((a, b) => a.localeCompare(b, 'it'));
    }
    return availableOrganizerRegions(this.allExcursions);
  }

  get sectionSuggestions() {
    const term = this.sectionSearch.trim().toLocaleLowerCase('it');
    return this.organizers
      .filter(organizer => !term || organizer.toLocaleLowerCase('it').includes(term))
      .slice(0, 80);
  }

  get bounds() {
    return dateBounds(this.allExcursions);
  }

  get active() {
    return hasActiveFilters(this.filters);
  }

  get nextWeekOn() {
    return isNextWeekSelected(this.filters);
  }

  get tags(): FilterTag[] {
    return extraFilterTags(this.filters);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement | null;
    if (!this.host.nativeElement.contains(target)) {
      this.megaOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.megaOpen = false;
  }

  toggleMega(event: Event) {
    event.stopPropagation();
    this.megaOpen = !this.megaOpen;
  }

  set<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    if (key === 'organizerRegion') {
      this.sectionSearch = '';
      this.filtersChange.emit({ ...this.filters, organizerRegion: value as string, organizer: 'all' });
      return;
    }
    if (key === 'month') {
      this.filtersChange.emit({ ...this.filters, month: value as string, dateFrom: '', dateTo: '' });
      return;
    }
    if (key === 'dateFrom' || key === 'dateTo') {
      const next: FilterState = { ...this.filters, [key]: value, month: 'all' };
      if (!next.dateFrom && !next.dateTo) next.month = currentYearMonth();
      this.filtersChange.emit(next);
      return;
    }
    this.filtersChange.emit({ ...this.filters, [key]: value });
  }

  toggle<K extends 'duration' | 'distance'>(key: K, value: FilterState[K]) {
    this.set(key, this.filters[key] === value ? 'all' as FilterState[K] : value);
  }

  toggleNextWeek() {
    if (isNextWeekSelected(this.filters)) {
      this.filtersChange.emit({ ...this.filters, dateFrom: '', dateTo: '', month: currentYearMonth() });
      return;
    }
    const range = nextWeekRange();
    this.filtersChange.emit({ ...this.filters, dateFrom: range.from, dateTo: range.to, month: 'all' });
  }

  toggleVediSito() {
    this.set('vediSito', !this.filters.vediSito);
  }

  clearTag(tag: FilterTag) {
    if (tag.id === 'organizer') this.sectionSearch = '';
    this.filtersChange.emit({ ...this.filters, ...tag.patch });
  }

  reset() {
    this.megaOpen = false;
    this.sectionSearch = '';
    this.filtersChange.emit(landingFilters());
  }

  setSectionSearch(event: Event) {
    const value = this.inputValue(event).trim();
    this.sectionSearch = value;
    if (!value) {
      this.set('organizer', 'all');
      return;
    }
    const match = this.organizers.find(organizer => organizer.localeCompare(value, 'it', { sensitivity: 'base' }) === 0);
    this.set('organizer', match ?? 'all');
  }

  inputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }
}
