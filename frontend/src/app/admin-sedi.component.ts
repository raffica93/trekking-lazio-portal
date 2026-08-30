import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SupabaseService } from './supabase.service';

type SedeRow = {
  id: string;
  organizer: string;
  url: string;
  kind: string;
  template?: string;
  enabled: boolean;
  status: string;
  excursions: number;
  error: string | null;
  updatedAt: string | null;
};

type SedeStatus = {
  generatedAt?: string;
  sources: SedeRow[];
};

@Component({
  selector: 'app-admin-sedi',
  standalone: true,
  imports: [NgFor, NgIf],
  template: `
    <section class="page-heading">
      <div>
        <p class="eyebrow">Registro sezioni</p>
        <h1>Sedi CAI</h1>
        <p>Ogni riga è lo script di una sezione. Lancialo da solo per vedere se il calendario risponde, o aggiorna tutte le abilitate.</p>
      </div>
      <button type="button" class="run-all" (click)="run('all')" [disabled]="busy !== ''">
        {{ busy === 'all' ? 'Aggiorno tutte…' : 'Aggiorna tutte' }}
      </button>
    </section>

    <p *ngIf="note" class="banner" [class.error]="error">{{ note }}</p>

    <section class="register" aria-label="Stato scrape per sede">
      <header class="register-head">
        <span>Sezione</span>
        <span>Template</span>
        <span>Eventi</span>
        <span>Esito</span>
        <span></span>
      </header>
      <article *ngFor="let sede of sources" class="sede-row" [attr.data-status]="sede.status">
        <div class="who">
          <strong>{{ sede.organizer }}</strong>
          <small>{{ sede.id }} · {{ sede.enabled ? 'in pipeline' : 'spenta' }}</small>
        </div>
        <span class="template">{{ templateLabel(sede) }}</span>
        <span class="count">{{ sede.excursions }}</span>
        <span class="blaze">{{ statusLabel(sede) }}</span>
        <button type="button" (click)="run(sede.id)" [disabled]="busy !== ''">
          {{ busy === sede.id ? 'Lancio…' : 'Lancia script' }}
        </button>
      </article>
    </section>
  `,
  styles: [`
    .page-heading { display: flex; align-items: end; justify-content: space-between; gap: 1.5rem; margin: 0 0 1.5rem; }
    .eyebrow { margin: 0 0 .5rem; color: #5b7f5f; font: 800 .67rem/1 'IBM Plex Mono', monospace; letter-spacing: .09em; text-transform: uppercase; }
    h1 { margin: 0; color: #163d2e; font-size: clamp(2rem, 5vw, 3.35rem); line-height: .95; letter-spacing: -.06em; }
    .page-heading p:not(.eyebrow) { max-width: 58ch; margin: .7rem 0 0; color: #597063; font-size: .9rem; }
    .run-all, .sede-row button { border: 0; cursor: pointer; font: 800 .82rem/1 Inter, sans-serif; }
    .run-all { flex: 0 0 auto; padding: .85rem 1rem; border-radius: .35rem; background: #1d5c46; color: #f1fad7; }
    .run-all:disabled, .sede-row button:disabled { opacity: .55; cursor: wait; }
    .banner { padding: .85rem 1rem; margin: 0 0 1rem; border: 1px solid #b6c9b6; background: #f3f8ee; color: #315a49; }
    .banner.error { border-color: #d7b0a8; background: #fbf1ee; color: #9a2519; }
    .register { overflow: hidden; border: 1px solid #b6c9b6; background: rgb(252 253 250 / .93); box-shadow: 8px 8px 0 rgb(114 147 111 / .18); }
    .register-head, .sede-row { display: grid; grid-template-columns: minmax(10rem, 1.4fr) .9fr 4.5rem minmax(7rem, .8fr) 8.5rem; gap: .75rem; align-items: center; }
    .register-head { padding: .7rem 1.15rem; border-bottom: 1px solid #cfdbcc; color: #5d7668; font: 700 .62rem/1 'IBM Plex Mono', monospace; letter-spacing: .04em; text-transform: uppercase; }
    .sede-row { min-height: 4.6rem; padding: 0 1.15rem; border-bottom: 1px solid #d9e2d5; }
    .sede-row:last-child { border-bottom: 0; }
    .who { display: grid; gap: .2rem; min-width: 0; }
    .who strong { color: #1b3b30; font-size: .93rem; }
    .who small { color: #687d70; font: 600 .68rem/1 'IBM Plex Mono', monospace; }
    .template, .count { color: #547262; font: 700 .72rem/1 'IBM Plex Mono', monospace; }
    .blaze { justify-self: start; padding: .3rem .45rem; border: 1px solid #c3cfbd; border-radius: 999px; font: 700 .62rem/1 'IBM Plex Mono', monospace; text-transform: uppercase; color: #718073; }
    .sede-row[data-status='ok'] .blaze, .sede-row[data-status='reused'] .blaze { border-color: #8fba7c; color: #216345; background: #eaf6dd; }
    .sede-row[data-status='failed'] .blaze { border-color: #d9a398; color: #9a2519; background: #fbeceb; }
    .sede-row[data-status='disabled'] .blaze { color: #8a9186; }
    .sede-row button { padding: .62rem .7rem; border: 1px solid #a8bfaa; border-radius: .35rem; background: #fff; color: #1d5c46; }
    @media (max-width: 720px) {
      .page-heading { align-items: flex-start; flex-direction: column; }
      .register-head { display: none; }
      .sede-row { grid-template-columns: 1fr auto; gap: .45rem .8rem; padding: .85rem .8rem; }
      .template, .count { display: none; }
    }
  `]
})
export class AdminSediComponent implements OnInit {
  sources: SedeRow[] = [];
  generatedAt = '';
  busy = '';
  note = '';
  error = false;

  constructor(private readonly supabase: SupabaseService) {}

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  templateLabel(sede: SedeRow): string {
    const labels: Record<string, string> = {
      'html-table': 'tabella HTML',
      'html-programma': 'programma HTML',
      'html-calendario': 'calendario HTML',
      'pdf-programma': 'PDF programma',
      homepage: 'homepage'
    };
    return labels[sede.template || ''] || sede.kind;
  }

  statusLabel(sede: SedeRow): string {
    if (!sede.enabled && sede.status === 'disabled') return 'spenta';
    const labels: Record<string, string> = {
      ok: 'ok',
      reused: 'invariata',
      failed: 'ko',
      skipped: 'saltata',
      idle: 'mai lanciata',
      disabled: 'spenta'
    };
    return labels[sede.status] || sede.status;
  }

  async load(): Promise<void> {
    try {
      const live = await fetch('/api/sedi');
      if (live.ok) {
        this.apply(await live.json());
        return;
      }
    } catch {
      // GitHub Pages has no API: fall back to the committed status file.
    }

    const file = await fetch('scrape-status.json');
    if (!file.ok) {
      this.error = true;
      this.note = 'Stato sedi non trovato. Lancia uno script in locale o dalla pipeline.';
      return;
    }
    this.apply(await file.json());
  }

  private apply(payload: SedeStatus): void {
    this.sources = payload.sources || [];
    this.generatedAt = payload.generatedAt || '';
  }

  async run(source: string): Promise<void> {
    this.busy = source;
    this.error = false;
    this.note = '';
    try {
      const session = await this.supabase.requireClient().auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) throw new Error('Sessione assente. Torna al login.');

      const response = await fetch('/api/admin/scrape', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ source })
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 404 || response.status === 504) {
          throw new Error('In produzione lo scrape gira su GitHub Actions. In locale avvia il backend e riprova.');
        }
        throw new Error(body.error || `HTTP ${response.status}`);
      }
      if (body.status) this.apply(body.status);
      this.note = source === 'all'
        ? 'Pipeline locale terminata per tutte le sedi abilitate.'
        : `Script ${source} terminato.`;
      if (body.hardFail) {
        this.error = true;
        this.note = `${this.note} Una sede è fallita senza cache.`;
      }
    } catch (error) {
      this.error = true;
      this.note = error instanceof Error ? error.message : 'Aggiornamento non riuscito.';
    } finally {
      this.busy = '';
    }
  }
}
