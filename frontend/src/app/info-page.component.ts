import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { CAI_PARTICIPATION, CAI_PARTICIPATION_POINTS, CAI_PHILOSOPHY } from './cai-info.data';
import { sectionColor } from './section-color';
import { AnalyticsService } from './analytics.service';

interface DirectorySection {
  id: string;
  organizer: string;
  region: string;
  municipality?: string;
  website?: string;
  directoryUrl?: string;
  calendarUrls: string[];
  sectionType?: string;
}


@Component({
  selector: 'app-info-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <article class="info-page" aria-labelledby="info-title">
      <div class="info-inner">
        <p class="kicker">Eventi CAI · Tutta Italia</p>
        <h1 id="info-title">Il CAI, le sezioni, il calendario</h1>
        <p class="lead">
          Trekking CAI raccoglie e organizza la consultazione degli eventi pubblicati dalle sezioni CAI in Italia.
          È un portale indipendente: le escursioni sono organizzate dalle singole sezioni, che gestiscono iscrizioni e aggiornamenti.
        </p>
        <p class="back-row">
          <a routerLink="/" class="back">← Torna alla mappa</a>
        </p>

        <section aria-labelledby="filosofia-title">
          <h2 id="filosofia-title">{{ philosophy.title }}</h2>
          <blockquote>
            <p>{{ philosophy.body }}</p>
          </blockquote>
          <p class="source">
            <a [href]="philosophy.sourceUrl" target="_blank" rel="noopener noreferrer">{{ philosophy.sourceLabel }}</a>
          </p>
          <ul class="pillars">
            <li>Alpinismo in ogni sua manifestazione</li>
            <li>Conoscenza e studio delle montagne, specialmente italiane</li>
            <li>Difesa del loro ambiente naturale</li>
          </ul>
        </section>

        <section aria-labelledby="partecipazione-title">
          <h2 id="partecipazione-title">{{ participation.title }}</h2>
          <p>{{ participation.body }}</p>
          <p class="source">
            <a [href]="participation.sourceUrl" target="_blank" rel="noopener noreferrer">{{ participation.sourceLabel }}</a>
          </p>
          <ul class="points">
            @for (point of participationPoints; track point.title) {
              <li>
                <strong>{{ point.title }}.</strong>
                {{ point.body }}
                <a [href]="point.sourceUrl" target="_blank" rel="noopener noreferrer">{{ point.sourceLabel }}</a>
              </li>
            }
          </ul>
        </section>

        <section aria-labelledby="sezioni-title">
          <h2 id="sezioni-title">Le sezioni CAI d’Italia</h2>
          <p>Consulta il repertorio delle sezioni e sottosezioni, con i collegamenti ai siti e ai programmi individuati. La presenza nel repertorio non garantisce che tutti gli eventi siano già nel calendario.</p>
          <p class="source"><a href="https://www.cai.it/organizzazione/sezioni/" target="_blank" rel="noopener noreferrer">Repertorio ufficiale CAI</a></p>
          <div class="directory-controls">
            <label>Cerca sezione o città<input type="search" [value]="query" (input)="search($event)" placeholder="Es. Milano, Aosta, Roma" aria-label="Cerca sezione nel repertorio"></label>
            <label>Regione<select [value]="region" (change)="chooseRegion($event)" aria-label="Regione del repertorio"><option value="all">Tutta Italia</option>@for (item of regions; track item) {<option [value]="item">{{ item }}</option>}</select></label>
          </div>
          @if (loading) { <p role="status">Caricamento delle sezioni…</p> }
          @if (loadError) { <p role="alert">Il repertorio non è disponibile. Puoi consultare l’elenco ufficiale CAI dal collegamento qui sopra.</p> }
          @if (!loading && !loadError) {
            <p class="directory-count" aria-live="polite">{{ filteredSections.length }} sezioni e sottosezioni · {{ calendarCount }} con collegamenti ai programmi</p>
            <div class="directory-list">
              @for (section of visibleSections; track section.id) {
                <article class="directory-row">
                  <div><h3><span class="section-dot" [style.background-color]="colorFor(section.organizer)"></span>{{ section.organizer }}</h3><p>{{ section.region }} · {{ section.municipality || 'Comune non indicato' }}@if (section.sectionType === 'subsection') { · Sottosezione }</p></div>
                  <nav [attr.aria-label]="'Collegamenti ' + section.organizer">
                    @if (section.website) { <a [href]="section.website" target="_blank" rel="noopener noreferrer" (click)="trackLink($event, section.website, section.organizer, 'sito')">Sito ↗</a> }
                    @if (section.calendarUrls.length) { <a [href]="section.calendarUrls[0]" target="_blank" rel="noopener noreferrer" (click)="trackLink($event, section.calendarUrls[0], section.organizer, 'agenda')">Programma ↗</a> }
                    @else { <span>Programma da verificare</span> }
                    @if (section.directoryUrl) { <a [href]="section.directoryUrl" target="_blank" rel="noopener noreferrer">Scheda CAI ↗</a> }
                  </nav>
                </article>
              } @empty { <p>Nessuna sezione con questi filtri. Prova un altro nome o scegli tutta Italia.</p> }
            </div>
            @if (filteredSections.length > pageSize) {
              <nav class="directory-pagination" aria-label="Pagine del repertorio"><button type="button" [disabled]="page === 1" (click)="page = page - 1">← Precedenti</button><span>{{ page }} / {{ pageCount }}</span><button type="button" [disabled]="page === pageCount" (click)="page = page + 1">Successive →</button></nav>
            }
          }
        </section>
      </div>
    </article>
  `,
  styles: [`
    .directory-controls { display: grid; grid-template-columns: 2fr 1fr; gap: .8rem; margin: 1rem 0; }
    .directory-controls label { display: grid; gap: .3rem; color: #065f46; font-size: .75rem; font-weight: 700; }
    .directory-controls input, .directory-controls select { width: 100%; min-width: 0; min-height: 2.7rem; border: 1px solid #bccdc3; border-radius: .4rem; padding: .5rem; background: #fff; color: #1c1917; }
    .directory-count { font-size: .78rem; }
    .directory-list { border-top: 1px solid #cdd7ce; }
    .directory-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .9rem 0; border-bottom: 1px solid #cdd7ce; }
    .directory-row h3 { display: flex; align-items: center; gap: .4rem; margin: 0; font-size: .88rem; }
    .directory-row p { margin: .3rem 0 0; font-size: .75rem; }
    .directory-row nav { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: .6rem; font-size: .75rem; }
    .directory-row nav a { color: #065f46; font-weight: 700; }
    .directory-row nav span { color: #57534e; }
    .directory-pagination { display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; font-size: .8rem; }
    .directory-pagination button { min-height: 2.5rem; border: 1px solid #bccdc3; border-radius: .4rem; background: #fff; padding: .5rem .8rem; color: #065f46; font-weight: 700; cursor: pointer; }
    .directory-pagination button:disabled { opacity: .4; }
    :is(button, input, select, a):focus-visible { outline: 2px solid #047857; outline-offset: 3px; }
    @media (max-width: 640px) { .directory-controls { grid-template-columns: 1fr; } .directory-row { align-items: flex-start; flex-direction: column; gap: .5rem; } .directory-row nav { justify-content: flex-start; } }

    :host {
      display: block;
      flex: 1;
      min-height: 0;
      margin: 0;
      overflow: auto;
      background:
        radial-gradient(1200px 400px at 10% -10%, rgb(236 253 208 / 0.55), transparent 55%),
        #f5f1e8;
    }

    .info-page {
      margin: 0;
      color: #1c1917;
    }

    .info-inner {
      width: min(72rem, calc(100% - 1.5rem));
      margin: 0 auto;
      padding: 0.75rem 0 3.5rem;
    }

    p.kicker {
      margin: 0 0 0.25rem;
      color: #3f6212;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      font-size: clamp(1.8rem, 4vw, 2.6rem);
      font-weight: 900;
      letter-spacing: -0.04em;
    }

    .lead {
      max-width: 40rem;
      margin: 0.7rem 0 0;
      color: #44403c;
      font-size: 1.02rem;
      line-height: 1.5;
    }

    .back-row { margin: 1rem 0 0; }

    .back {
      color: #14532d;
      font-size: 0.88rem;
      font-weight: 700;
      text-decoration: none;
    }

    .back:hover { text-decoration: underline; }

    section {
      margin-top: 2.2rem;
      padding-top: 1.4rem;
      border-top: 1px solid rgb(28 25 23 / 0.12);
    }

    h2 {
      margin: 0 0 0.75rem;
      font-size: 1.2rem;
      font-weight: 800;
      letter-spacing: -0.03em;
    }

    p { margin: 0 0 0.75rem; line-height: 1.55; color: #44403c; }

    blockquote {
      margin: 0 0 0.75rem;
      padding: 1rem 1.1rem;
      border-left: 4px solid #65a30d;
      background: rgb(255 255 255 / 0.72);
      box-shadow: 0 1px 0 rgb(28 25 23 / 0.04);
    }

    blockquote p {
      margin: 0;
      color: #1c1917;
      font-size: 1.05rem;
      font-style: italic;
      line-height: 1.55;
    }

    .source, .source a, .points a {
      color: #3f6212;
      font-size: 0.82rem;
      font-weight: 600;
    }

    .pillars {
      display: grid;
      gap: 0.45rem;
      margin: 0.9rem 0 0;
      padding: 0;
      list-style: none;
    }

    .pillars li {
      padding: 0.55rem 0.75rem;
      border-radius: 0.4rem;
      background: #14532d;
      color: #ecfccb;
      font-size: 0.92rem;
      font-weight: 700;
    }

    .points {
      display: grid;
      gap: 0.85rem;
      margin: 0.9rem 0 0;
      padding: 0;
      list-style: none;
    }

    .points li {
      padding: 0.85rem 0.95rem;
      border: 1px solid rgb(28 25 23 / 0.1);
      border-radius: 0.55rem;
      background: rgb(255 255 255 / 0.78);
      color: #44403c;
      font-size: 0.94rem;
      line-height: 1.5;
    }

    .points strong { color: #1c1917; }

    .section-dot {
      width: 0.5rem;
      height: 0.5rem;
      flex-shrink: 0;
      border-radius: 999px;
      box-shadow: 0 0 0 1.5px rgb(255 255 255 / 0.9);
    }

    @media (max-width: 640px) {
      .info-inner { width: min(72rem, calc(100% - 1.1rem)); }
      .pillars li { font-size: 0.85rem; }
    }
  `]
})
export class InfoPageComponent implements OnInit {
  private analytics = inject(AnalyticsService);
  private http = inject(HttpClient);
  private changeDetector = inject(ChangeDetectorRef);
  readonly philosophy = CAI_PHILOSOPHY;
  readonly participation = CAI_PARTICIPATION;
  readonly participationPoints = CAI_PARTICIPATION_POINTS;
  sections: DirectorySection[] = [];
  loading = true;
  loadError = false;
  query = '';
  region = 'all';
  page = 1;
  readonly pageSize = 30;

  ngOnInit(): void {
    this.http.get<{ sections: DirectorySection[] }>('cai-sections.json').subscribe({
      next: data => { this.sections = data.sections; this.loading = false; this.changeDetector.markForCheck(); },
      error: () => { this.loading = false; this.loadError = true; this.changeDetector.markForCheck(); }
    });
  }

  get regions(): string[] { return [...new Set(this.sections.map(section => section.region).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'it')); }
  get filteredSections(): DirectorySection[] {
    const query = this.query.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('it').trim();
    return this.sections.filter(section => (this.region === 'all' || section.region === this.region) &&
      [section.organizer, section.municipality].join(' ').normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('it').includes(query));
  }
  get visibleSections(): DirectorySection[] { return this.filteredSections.slice((this.page - 1) * this.pageSize, this.page * this.pageSize); }
  get pageCount(): number { return Math.max(1, Math.ceil(this.filteredSections.length / this.pageSize)); }
  get calendarCount(): number { return this.filteredSections.filter(section => section.calendarUrls.length).length; }
  search(event: Event): void { this.query = (event.target as HTMLInputElement).value; this.page = 1; }
  chooseRegion(event: Event): void { this.region = (event.target as HTMLSelectElement).value; this.page = 1; }
  colorFor(name: string): string { return sectionColor(name); }
  trackLink(event: Event, url: string, organizer: string, type: 'sito' | 'agenda'): void { this.analytics.trackCaiLink(event, url, organizer, type); }
}
