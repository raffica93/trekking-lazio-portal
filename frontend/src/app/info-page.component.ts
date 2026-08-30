import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  AGENDA_NO_LABEL,
  AGENDA_YES_LABEL,
  CAI_PARTICIPATION,
  CAI_PARTICIPATION_POINTS,
  CAI_PHILOSOPHY,
  CAI_QUOTE_ROWS,
  CAI_SEZIONE_LINKS,
  quoteDisplay,
  UNPUBLISHED_LABEL,
  type QuoteRow,
  type SezioneLink
} from './cai-info.data';
import { sectionColor } from './section-color';

@Component({
  selector: 'app-info-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <article class="info-page" aria-labelledby="info-title">
      <div class="info-inner">
        <p class="kicker">Club Alpino Italiano · Lazio</p>
        <h1 id="info-title">Info</h1>
        <p class="lead">
          Perché esiste il CAI, come una sola iscrizione apre tutte le uscite, quanto costa davvero tesserarsi
          nelle sezioni del Lazio — con le fonti, senza cifre inventate.
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

        <section aria-labelledby="costi-title">
          <h2 id="costi-title">Costi di iscrizione alle sezioni CAI del Lazio</h2>
          <p>
            Prima riga: <strong>quote minime nazionali 2026</strong> (pavimento fissato dall’Assemblea dei Delegati).
            Sotto: i tariffari <strong>pubblicati</strong> dalle sezioni. Dove il sito non mostra gli importi,
            la cella resta «{{ unpublished }}» — non stimiamo dal minimo nazionale.
          </p>
          <div class="table-wrap">
            <table aria-label="Costi di iscrizione alle sezioni CAI del Lazio">
              <thead>
                <tr>
                  <th>Sezione</th>
                  <th>Anno</th>
                  <th>Ordinario</th>
                  <th>Familiare</th>
                  <th>Juniores 18–25</th>
                  <th>Giovane</th>
                  <th>Tessera / prima iscrizione</th>
                  <th>Fonte</th>
                </tr>
              </thead>
              <tbody>
                @for (row of quotes; track row.id) {
                  <tr [class.floor]="row.isNationalFloor">
                    <th scope="row">
                      @if (row.isNationalFloor) {
                        {{ row.name }}
                      } @else {
                        <span class="section-tag">
                          <span
                            class="section-dot"
                            [style.background-color]="colorFor(row.name)"
                            aria-hidden="true"
                          ></span>
                          {{ row.name }}
                        </span>
                      }
                    </th>
                    <td>{{ row.year ?? '—' }}</td>
                    <td>{{ display(row.ordinario) }}</td>
                    <td>{{ display(row.familiare) }}</td>
                    <td>{{ display(row.juniores) }}</td>
                    <td>{{ display(row.giovane) }}</td>
                    <td>{{ display(row.tesseraNuova) }}</td>
                    <td>
                      <a [href]="row.sourceUrl" target="_blank" rel="noopener noreferrer">{{ row.sourceLabel }}</a>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="sezioni-title">
          <h2 id="sezioni-title">Sezioni del Lazio: sito e agenda</h2>
          <p>
            Le 19 sezioni del Gruppo Regionale Lazio. «{{ agendaYes }}» se pubblicano un programma, calendario
            o pieghevole di uscite; «{{ agendaNo }}» se al momento della ricerca non risulta un’agenda pubblica.
          </p>
          <div class="table-wrap">
            <table aria-label="Siti e agende delle sezioni CAI del Lazio">
              <thead>
                <tr>
                  <th>Sezione</th>
                  <th>Sito</th>
                  <th>Agenda</th>
                  <th>Calendario / programma</th>
                </tr>
              </thead>
              <tbody>
                @for (sezione of sezioni; track sezione.id) {
                  <tr>
                    <th scope="row">
                      <span class="section-tag">
                        <span
                          class="section-dot"
                          [style.background-color]="colorFor(sezione.name)"
                          aria-hidden="true"
                        ></span>
                        {{ sezione.name }}
                      </span>
                    </th>
                    <td>
                      <a [href]="sezione.websiteUrl" target="_blank" rel="noopener noreferrer">{{ hostOf(sezione.websiteUrl) }}</a>
                    </td>
                    <td>{{ sezione.hasAgenda ? agendaYes : agendaNo }}</td>
                    <td>
                      @if (sezione.agendaUrl) {
                        <a [href]="sezione.agendaUrl" target="_blank" rel="noopener noreferrer">{{ sezione.agendaLabel }}</a>
                      } @else {
                        —
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </article>
  `,
  styles: [`
    :host {
      display: block;
      flex: 1;
      min-height: 0;
      overflow: auto;
      background:
        radial-gradient(1200px 400px at 10% -10%, rgb(236 253 208 / 0.55), transparent 55%),
        #f5f1e8;
    }

    .info-page {
      color: #1c1917;
    }

    .info-inner {
      width: min(72rem, calc(100% - 1.5rem));
      margin: 0 auto;
      padding: 1.5rem 0 3.5rem;
    }

    .kicker {
      margin: 0 0 0.35rem;
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

    .table-wrap {
      overflow: auto;
      border: 1px solid rgb(28 25 23 / 0.12);
      border-radius: 0.55rem;
      background: #fff;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.82rem;
    }

    th, td {
      padding: 0.55rem 0.7rem;
      border-bottom: 1px solid rgb(28 25 23 / 0.08);
      text-align: left;
      vertical-align: top;
    }

    thead th {
      position: sticky;
      top: 0;
      background: #14532d;
      color: #ecfccb;
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    tbody th { font-weight: 700; color: #1c1917; white-space: nowrap; }

    .section-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      min-height: 1.45rem;
      padding: 0.12rem 0.55rem 0.12rem 0.35rem;
      border: 1px solid rgb(28 25 23 / 0.08);
      border-radius: 999px;
      background: #f6f8f6;
      color: #1c1917;
      font-size: 0.78rem;
      font-weight: 700;
      line-height: 1;
    }

    .section-dot {
      width: 0.5rem;
      height: 0.5rem;
      flex-shrink: 0;
      border-radius: 999px;
      box-shadow: 0 0 0 1.5px rgb(255 255 255 / 0.9);
    }

    tbody tr.floor { background: #ecfccb; }

    tbody tr:last-child th, tbody tr:last-child td { border-bottom: 0; }

    td a { color: #3f6212; font-weight: 600; }

    @media (max-width: 640px) {
      .info-inner { width: min(72rem, calc(100% - 1.1rem)); }
      .pillars li { font-size: 0.85rem; }
    }
  `]
})
export class InfoPageComponent {
  readonly philosophy = CAI_PHILOSOPHY;
  readonly participation = CAI_PARTICIPATION;
  readonly participationPoints = CAI_PARTICIPATION_POINTS;
  readonly quotes: QuoteRow[] = CAI_QUOTE_ROWS;
  readonly sezioni: SezioneLink[] = CAI_SEZIONE_LINKS;
  readonly unpublished = UNPUBLISHED_LABEL;
  readonly agendaYes = AGENDA_YES_LABEL;
  readonly agendaNo = AGENDA_NO_LABEL;
  readonly display = quoteDisplay;

  colorFor(name: string): string {
    return sectionColor(name);
  }

  hostOf(url: string): string {
    try {
      return new URL(url).host.replace(/^www\./, '');
    } catch {
      return url;
    }
  }
}
