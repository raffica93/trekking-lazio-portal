import { NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { durationLabel, tripDays } from './excursion-dates';
import { AdminPlacesService } from './admin-places.service';
import type { PlaceRow, PlaceStatus, PlaceWrite } from './place.model';

@Component({
  selector: 'app-admin-place-editor',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, RouterLink],
  template: `
    <a routerLink="/admin" class="back">← Archivio luoghi</a>
    <section class="editor-heading">
      <div><p class="eyebrow">{{ editing ? 'Scheda esistente' : 'Nuova scheda' }}</p><h1>{{ editing ? 'Modifica luogo' : 'Aggiungi un luogo' }}</h1></div>
      <span class="coordinate-mark">DATI · MAPPA · PUBBLICAZIONE</span>
    </section>

    <p *ngIf="loading" class="state">Carico la scheda…</p>
    <p *ngIf="error" class="error" role="alert">{{ error }}</p>

    <form *ngIf="!loading" [formGroup]="form" (ngSubmit)="save()" class="editor" novalidate>
      <fieldset>
        <legend>Identità</legend>
        <div class="grid two">
          <label class="wide">Titolo<input formControlName="title" (input)="suggestSlug()" placeholder="es. Monte Terminillo · Cresta Sassetelli"></label>
          <label>Slug<input formControlName="slug" (input)="lockSlug()" placeholder="monte-terminillo-cresta"></label>
          <label>Stato<select formControlName="status"><option value="draft">Bozza</option><option value="published">Pubblicato</option></select></label>
          <label>Data<input type="date" formControlName="date"></label>
          <label>Categoria<input formControlName="category" placeholder="E, EE, EEA…"></label>
          <label>Organizzatore<input formControlName="organizer" placeholder="CAI Roma"></label>
          <label class="wide">Link di riferimento<input type="url" formControlName="external_url" placeholder="https://…"></label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Posizione</legend>
        <div class="grid two">
          <label class="wide">Località<input formControlName="location" placeholder="Monti Reatini"></label>
          <label>Comune<input formControlName="municipality"></label>
          <label>Provincia<input formControlName="province"></label>
          <label>Regione<input formControlName="region" placeholder="Lazio"></label>
          <label>Latitudine<input type="number" step="any" formControlName="latitude" placeholder="42.473"></label>
          <label>Longitudine<input type="number" step="any" formControlName="longitude" placeholder="12.987"></label>
          <label class="wide">Punto di partenza<input formControlName="start_place" placeholder="Parcheggio di Pian de' Valli"></label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Dettagli utili</legend>
        <div class="grid two">
          <label>Data finale
            <input type="date" formControlName="date_end" [attr.min]="form.controls.date.value || null">
            <span class="hint">{{ staySummary }}</span>
          </label>
          <label>Distanza (km)<input type="number" min="0" step="0.1" formControlName="distance_km"></label>
          <label>Dislivello (m)<input type="number" min="0" step="1" formControlName="elevation_m"></label>
          <label>Durata (ore)<input type="number" min="0" step="0.25" formControlName="duration_hours"></label>
          <label>Costo<input formControlName="cost" placeholder="es. 15 euro"></label>
          <label class="wide">Trasporto<input formControlName="transport" placeholder="es. auto privata, pullman"></label>
          <label class="wide">Descrizione<textarea rows="4" formControlName="summary" placeholder="Cosa rende interessante questo itinerario?"></textarea></label>
          <label class="wide">Note difficoltà<textarea rows="2" formControlName="difficulty_note"></textarea></label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Immagine di copertina</legend>
        <div class="cover-row">
          <img *ngIf="imageUrl" [src]="imageUrl" alt="Anteprima copertina">
          <div>
            <label class="file-input">Carica immagine<input type="file" accept="image/jpeg,image/png,image/webp" (change)="onFileChange($event)"></label>
            <p>JPG, PNG o WebP · massimo 5 MB.</p>
            <button *ngIf="form.controls.cover_image_path.value" type="button" class="text-button" (click)="removeCover()">Rimuovi immagine</button>
          </div>
        </div>
      </fieldset>

      <div class="actions">
        <button type="submit" class="save" [disabled]="saving || uploading">{{ saving ? 'Salvataggio…' : (editing ? 'Salva modifiche' : 'Crea luogo') }}</button>
        <button *ngIf="editing" type="button" class="delete" [disabled]="saving || uploading" (click)="delete()">Elimina</button>
      </div>
    </form>
  `,
  styles: [`
    .back { display: inline-block; margin-bottom: 1.35rem; color: #3d6c53; font: 800 .73rem/1 'IBM Plex Mono', monospace; text-decoration: none; }
    .editor-heading { display: flex; align-items: end; justify-content: space-between; gap: 1rem; margin-bottom: 1.5rem; }
    .eyebrow { margin: 0 0 .5rem; color: #5b7f5f; font: 800 .67rem/1 'IBM Plex Mono', monospace; letter-spacing: .09em; text-transform: uppercase; }
    h1 { margin: 0; color: #163d2e; font-size: clamp(2rem, 5vw, 3.25rem); line-height: .95; letter-spacing: -.06em; }
    .coordinate-mark { color: #638168; font: 700 .6rem/1.25 'IBM Plex Mono', monospace; letter-spacing: .08em; text-align: right; }
    .editor { display: grid; gap: 1rem; }
    fieldset { min-width: 0; margin: 0; padding: 1.25rem; border: 1px solid #b6c9b6; background: rgb(252 253 250 / .94); box-shadow: 5px 5px 0 rgb(114 147 111 / .13); }
    legend { padding: 0 .38rem; color: #2e6049; font: 800 .68rem/1 'IBM Plex Mono', monospace; letter-spacing: .08em; text-transform: uppercase; }
    .grid { display: grid; gap: .9rem; } .two { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    label { display: grid; gap: .4rem; min-width: 0; color: #466253; font-size: .74rem; font-weight: 800; } .wide { grid-column: 1 / -1; }
    .hint { color: #5d7466; font-size: .72rem; font-weight: 600; }
    input, select, textarea { width: 100%; box-sizing: border-box; padding: .7rem .75rem; border: 1px solid #b7c9b8; border-radius: .22rem; background: white; color: #183229; font: 500 .88rem/1.3 Inter, sans-serif; }
    textarea { resize: vertical; } input:focus, select:focus, textarea:focus { outline: 3px solid rgb(166 202 109 / .55); outline-offset: 1px; }
    .cover-row { display: flex; align-items: center; gap: 1rem; color: #62776a; font-size: .77rem; } .cover-row img { width: 9rem; height: 6rem; object-fit: cover; border: 1px solid #b4c9b6; }
    .cover-row p { margin: .45rem 0; } .file-input { color: #1d5c46; text-decoration: underline; cursor: pointer; } .file-input input { display: none; }
    .text-button { padding: 0; border: 0; background: none; color: #9a2519; font: 700 .74rem/1 Inter, sans-serif; text-decoration: underline; cursor: pointer; }
    .actions { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding-bottom: 2rem; } .save, .delete { padding: .85rem 1rem; border-radius: .28rem; font: 800 .82rem/1 Inter, sans-serif; cursor: pointer; }
    .save { border: 0; background: #1d5c46; color: #f1fad7; } .delete { margin-left: auto; border: 1px solid #d7afaa; background: #fff7f6; color: #9a2519; } button:disabled { cursor: not-allowed; opacity: .58; }
    .error, .state { padding: 1rem; margin: 0 0 1rem; border: 1px solid #d9aaa5; background: #fff7f6; color: #9a2519; font-size: .82rem; } .state { border-color: #b8cbb8; background: #f7fbf3; color: #506b58; }
    @media (max-width: 640px) { .editor-heading { align-items: flex-start; flex-direction: column; } .coordinate-mark { text-align: left; } .two { grid-template-columns: 1fr; } .wide { grid-column: auto; } .cover-row { align-items: flex-start; flex-direction: column; } }
  `]
})
export class AdminPlaceEditorComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  readonly form = this.formBuilder.nonNullable.group({
    title: ['', Validators.required], slug: ['', Validators.required], status: ['draft' as PlaceStatus, Validators.required],
    date: ['', Validators.required], date_end: [''], category: ['', Validators.required],
    external_url: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/i)]], organizer: ['Trekking CAI', Validators.required],
    location: ['', Validators.required], municipality: [''], province: [''], region: [''], latitude: ['', Validators.required], longitude: ['', Validators.required],
    cost: [''], distance_km: [''], elevation_m: [''], duration_hours: [''], time: [''], mountain_group: [''], transport: [''],
    start_place: [''], coordinates_quality: [''], summary: [''], activity_type: [''], terrain: [''], difficulty_note: [''], cover_image_path: ['']
  });
  editing = false;
  loading = false;
  saving = false;
  uploading = false;
  error = '';
  imageUrl: string | null = null;
  private id: string | null = null;
  private slugLocked = false;
  private originalCoverPath: string | null = null;

  constructor(
    private readonly places: AdminPlacesService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.id = this.route.snapshot.paramMap.get('id');
    if (!this.id) return;
    this.editing = true;
    this.loading = true;
    try {
      this.fill(await this.places.get(this.id));
    } catch (error: unknown) {
      this.error = error instanceof Error ? error.message : 'Impossibile caricare questo luogo.';
    } finally {
      this.loading = false;
    }
  }

  suggestSlug(): void {
    if (this.slugLocked) return;
    this.form.controls.slug.setValue(this.slugify(this.form.controls.title.value));
  }

  lockSlug(): void {
    this.slugLocked = true;
  }

  get staySummary(): string {
    const start = this.form.controls.date.value;
    if (!start) return 'Giorni e notti si calcolano dalle date.';
    const end = this.form.controls.date_end.value.trim() || start;
    if (end < start) return 'La data finale precede l’inizio.';
    return durationLabel(tripDays(start, end)) ?? '1 giorno';
  }

  async onFileChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0);
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      this.error = 'L’immagine supera il limite di 5 MB.';
      return;
    }
    this.uploading = true;
    this.error = '';
    try {
      const path = await this.places.uploadCover(file);
      this.form.controls.cover_image_path.setValue(path);
      this.imageUrl = this.places.imageUrl(path);
    } catch (error: unknown) {
      this.error = error instanceof Error ? error.message : 'Impossibile caricare l’immagine.';
    } finally {
      this.uploading = false;
      input.value = '';
    }
  }

  removeCover(): void {
    this.form.controls.cover_image_path.setValue('');
    this.imageUrl = null;
  }

  async save(): Promise<void> {
    if (this.form.invalid || this.saving || this.uploading) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.error = '';
    try {
      const saved = this.id
        ? await this.places.update(this.id, this.payload())
        : await this.places.create(this.payload());
      const oldCover = this.originalCoverPath;
      if (oldCover && oldCover !== saved.cover_image_path) {
        await this.places.deleteCover(oldCover);
      }
      await this.router.navigate(['/admin/places', saved.id]);
      this.id = saved.id;
      this.editing = true;
      this.fill(saved);
    } catch (error: unknown) {
      this.error = error instanceof Error ? error.message : 'Impossibile salvare il luogo.';
    } finally {
      this.saving = false;
    }
  }

  async delete(): Promise<void> {
    if (!this.id || !window.confirm('Eliminare definitivamente questo luogo?')) return;
    this.saving = true;
    this.error = '';
    try {
      await this.places.delete(this.id);
      if (this.originalCoverPath) await this.places.deleteCover(this.originalCoverPath);
      await this.router.navigateByUrl('/admin');
    } catch (error: unknown) {
      this.error = error instanceof Error ? error.message : 'Impossibile eliminare il luogo.';
    } finally {
      this.saving = false;
    }
  }

  private fill(place: PlaceRow): void {
    this.form.patchValue({
      title: place.title, slug: place.slug, status: place.status, date: place.date, date_end: place.date_end ?? '',
      category: place.category, external_url: place.external_url, organizer: place.organizer, location: place.location, municipality: place.municipality ?? '',
      province: place.province ?? '', region: place.region ?? '', latitude: this.stringValue(place.latitude), longitude: this.stringValue(place.longitude),
      cost: place.cost ?? '', distance_km: this.stringValue(place.distance_km), elevation_m: this.stringValue(place.elevation_m), duration_hours: this.stringValue(place.duration_hours),
      time: place.time ?? '', mountain_group: place.mountain_group ?? '', transport: place.transport ?? '', start_place: place.start_place ?? '',
      coordinates_quality: place.coordinates_quality ?? '', summary: place.summary ?? '', activity_type: place.activity_type ?? '', terrain: place.terrain ?? '',
      difficulty_note: place.difficulty_note ?? '', cover_image_path: place.cover_image_path ?? ''
    });
    this.slugLocked = true;
    this.originalCoverPath = place.cover_image_path;
    this.imageUrl = this.places.imageUrl(place.cover_image_path);
  }

  private payload(): PlaceWrite {
    const value = this.form.getRawValue();
    return {
      slug: this.slugify(value.slug), title: value.title.trim(), date: value.date, date_end: this.textOrNull(value.date_end), days: this.computedDays(),
      category: value.category.trim(), external_url: value.external_url.trim(), organizer: value.organizer.trim(), location: value.location.trim(),
      municipality: this.textOrNull(value.municipality), province: this.textOrNull(value.province), region: this.textOrNull(value.region),
      latitude: this.numberOrZero(value.latitude), longitude: this.numberOrZero(value.longitude), cost: this.textOrNull(value.cost), cost_amount: null,
      time: this.textOrNull(value.time), distance_km: this.numberOrNull(value.distance_km), elevation_m: this.numberOrNull(value.elevation_m),
      duration_hours: this.numberOrNull(value.duration_hours), mountain_group: this.textOrNull(value.mountain_group), transport: this.textOrNull(value.transport),
      private_car: null, start_place: this.textOrNull(value.start_place), coordinates_quality: this.textOrNull(value.coordinates_quality), summary: this.textOrNull(value.summary),
      activity_type: this.textOrNull(value.activity_type), terrain: this.textOrNull(value.terrain), difficulty_note: this.textOrNull(value.difficulty_note),
      cover_image_path: this.textOrNull(value.cover_image_path), status: value.status
    };
  }

  private computedDays(): number {
    const start = this.form.controls.date.value;
    const end = this.form.controls.date_end.value.trim() || start;
    return tripDays(start, end);
  }

  private slugify(value: string): string {
    return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  private textOrNull(value: string): string | null { const text = value.trim(); return text || null; }
  private numberOrNull(value: string): number | null { const number = Number(value); return value === '' || !Number.isFinite(number) ? null : number; }
  private numberOrZero(value: string): number { const number = Number(value); return Number.isFinite(number) ? number : 0; }
  private stringValue(value: number | null): string { return value == null ? '' : String(value); }
}
