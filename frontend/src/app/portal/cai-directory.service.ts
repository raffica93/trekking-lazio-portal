import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, defer, map, of, shareReplay, tap } from 'rxjs';
import { isSupabaseConfigured } from '../core/supabase.config';
import { SupabaseService } from '../core/supabase.service';

export interface CaiDirectoryEntry {
  id: string;
  organizer: string;
  region: string;
  municipality?: string;
  website?: string;
  directoryUrl?: string;
  calendarUrls: string[];
  sectionType?: string;
}

interface CaiDirectoryRow {
  id: string | null;
  name: string | null;
  organizer_region: string | null;
  website_url: string | null;
  directory_url: string | null;
  calendar_urls: unknown;
  section_type: string | null;
}

interface CaiDirectoryCache {
  savedAt: number;
  entries: CaiDirectoryEntry[];
}

const CACHE_KEY = 'trekking-cai.directory.v1';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class CaiDirectoryService {
  private readonly http = inject(HttpClient);
  private readonly supabase = inject(SupabaseService);
  private request$?: Observable<CaiDirectoryEntry[]>;
  private cachedEntries: CaiDirectoryEntry[] | null = this.readCache()?.entries ?? null;

  getDirectory(): Observable<CaiDirectoryEntry[]> {
    const cached = this.readCache();
    if (cached && cached.entries.length > 0) {
      this.cachedEntries = cached.entries;
      this.refresh();
      return of(cached.entries);
    }
    return this.refresh();
  }

  private refresh(): Observable<CaiDirectoryEntry[]> {
    if (this.request$) return this.request$;

    // The static snapshot remains the offline fallback. In production the
    // configured Supabase registry is the source of truth for filter names.
    const source$ = isSupabaseConfigured()
      ? defer(() => this.loadFromSupabase()).pipe(
          catchError(() => this.loadSnapshot())
        )
      : of([] as CaiDirectoryEntry[]);

    this.request$ = source$.pipe(
      tap(entries => {
        if (entries.length > 0) {
          this.cachedEntries = entries;
          this.writeCache(entries);
        }
      }),
      map(entries => entries.length > 0 ? entries : this.cachedEntries ?? []),
      shareReplay({ bufferSize: 1, refCount: false })
    );
    return this.request$;
  }

  private async loadFromSupabase(): Promise<CaiDirectoryEntry[]> {
    const client = this.supabase.requireClient();
    const { data, error } = await client
      .from('cai_sections')
      .select('id,name,organizer_region,website_url,directory_url,calendar_urls,section_type')
      .order('organizer_region', { ascending: true, nullsFirst: false })
      .order('name', { ascending: true });
    if (error) throw error;
    return (data as CaiDirectoryRow[] | null ?? [])
      .map(row => this.mapRow(row))
      .filter(entry => entry.organizer.length > 0);
  }

  private loadSnapshot(): Observable<CaiDirectoryEntry[]> {
    return this.http.get<{ sections?: unknown[] }>('cai-sections.json').pipe(
      map(payload => (payload.sections ?? [])
        .map(section => this.mapSnapshot(section))
        .filter((entry): entry is CaiDirectoryEntry => Boolean(entry)))
    );
  }

  private mapRow(row: CaiDirectoryRow): CaiDirectoryEntry {
    return {
      id: row.id?.trim() || row.name?.trim() || '',
      organizer: row.name?.trim() ?? '',
      region: row.organizer_region?.trim() ?? '',
      website: row.website_url?.trim() || undefined,
      directoryUrl: row.directory_url?.trim() || undefined,
      calendarUrls: this.calendarUrls(row.calendar_urls),
      sectionType: row.section_type?.trim() || undefined
    };
  }

  private mapSnapshot(value: unknown): CaiDirectoryEntry | null {
    if (!value || typeof value !== 'object') return null;
    const section = value as Record<string, unknown>;
    const organizer = String(section['organizer'] ?? section['name'] ?? '').trim();
    if (!organizer) return null;
    return {
      id: String(section['id'] ?? organizer).trim(),
      organizer,
      region: String(section['region'] ?? section['organizerRegion'] ?? '').trim(),
      municipality: String(section['municipality'] ?? '').trim() || undefined,
      website: String(section['website'] ?? '').trim() || undefined,
      directoryUrl: String(section['directoryUrl'] ?? '').trim() || undefined,
      calendarUrls: this.calendarUrls(section['calendarUrls']),
      sectionType: String(section['sectionType'] ?? '').trim() || undefined
    };
  }

  private calendarUrls(value: unknown): string[] {
    if (!Array.isArray(value)) return [];
    return value.filter(item => typeof item === 'string').map(item => item.trim()).filter(Boolean);
  }

  private readCache(): CaiDirectoryCache | null {
    try {
      const raw = globalThis.localStorage?.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<CaiDirectoryCache>;
      if (!Array.isArray(parsed.entries) || typeof parsed.savedAt !== 'number') return null;
      if (Date.now() - parsed.savedAt > CACHE_TTL_MS) return null;
      const entries = parsed.entries.filter(entry => entry && typeof entry.organizer === 'string' && typeof entry.region === 'string');
      return entries.length > 0 ? { savedAt: parsed.savedAt, entries } : null;
    } catch {
      return null;
    }
  }

  private writeCache(entries: CaiDirectoryEntry[]) {
    try {
      globalThis.localStorage?.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), entries } satisfies CaiDirectoryCache));
    } catch {
      // Storage can be unavailable in private browsing or during SSR.
    }
  }
}
