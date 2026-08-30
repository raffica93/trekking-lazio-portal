import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

type LegalPage = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: { title: string; body: string[] }[];
};

const PAGES: Record<string, LegalPage> = {
  servizi: {
    eyebrow: 'Trekking CAI',
    title: 'Servizi del portale',
    intro: 'Uno strumento indipendente per orientarsi tra le escursioni pubblicate dalle sezioni CAI del Lazio.',
    sections: [
      { title: 'Cosa trovi qui', body: ['La mappa e il calendario raccolgono le escursioni rese pubbliche dalle sezioni CAI del Lazio e, quando disponibile, mostrano luogo, data, difficoltà, durata e collegamento alla fonte.', 'Il servizio è informativo e gratuito: la pagina dell’organizzatore resta sempre il riferimento per programma, iscrizioni, costi, requisiti e modifiche.'] },
      { title: 'Fonti e aggiornamenti', body: ['I dati provengono da siti, calendari e programmi pubblicati dalle sezioni. Possono cambiare o contenere ritardi: prima di partire consulta sempre la pagina dell’uscita e contatta la sezione organizzatrice.'] },
      { title: 'Nessuna affiliazione', body: ['Trekking CAI non è il sito istituzionale del Club Alpino Italiano né di una sua sezione. I nomi e i collegamenti alle sezioni sono usati per rendere riconoscibile la fonte delle informazioni.'] }
    ]
  },
  termini: {
    eyebrow: 'Trekking CAI',
    title: 'Termini e condizioni d’uso',
    intro: 'Usando trekking-cai.it accetti queste condizioni.',
    sections: [
      { title: 'Uso del sito', body: ['Puoi consultare e condividere i contenuti del portale per uso personale e non commerciale, mantenendo l’indicazione della fonte quando presente. Non è consentito usare il sito per attività illecite, automatizzare richieste in modo da comprometterne il funzionamento o riutilizzare massivamente i dati senza autorizzazione.'] },
      { title: 'Escursioni e sicurezza', body: ['Le informazioni sono offerte senza garanzia di completezza o aggiornamento. Un’escursione in montagna richiede preparazione, equipaggiamento e valutazione autonoma delle condizioni. Trekking CAI non organizza le uscite e non risponde di variazioni, annullamenti, infortuni o danni connessi alla partecipazione.'] },
      { title: 'Collegamenti esterni', body: ['I link portano a pagine gestite da terzi. I relativi contenuti, condizioni e disponibilità restano sotto la responsabilità dei rispettivi gestori.'] },
      { title: 'Aggiornamenti', body: ['Queste condizioni possono essere aggiornate per riflettere l’evoluzione del servizio. La versione pubblicata su questa pagina è quella applicabile.'] }
    ]
  },
  privacy: {
    eyebrow: 'Trekking CAI',
    title: 'Privacy',
    intro: 'Il portale è progettato per farti consultare le escursioni senza creare un profilo pubblico.',
    sections: [
      { title: 'Dati trattati', body: ['La normale consultazione non richiede registrazione. Il server può trattare dati tecnici indispensabili al funzionamento e alla sicurezza, come indirizzo IP, tipo di browser e log di richiesta, secondo le impostazioni dell’hosting.'] },
      { title: 'Contenuti di terzi', body: ['Quando apri un collegamento esterno o una mappa, il relativo servizio può applicare la propria informativa privacy. Trekking CAI non controlla le politiche dei siti delle sezioni o dei fornitori esterni.'] },
      { title: 'Contatti', body: ['Per segnalare un dato non corretto o chiedere informazioni sul trattamento, usa il canale di contatto indicato nel repository o nei materiali di progetto del portale.'] }
    ]
  }
};

@Component({
  selector: 'app-legal-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <article class="legal-page" aria-labelledby="legal-title">
      <div class="legal-inner">
        <p class="eyebrow">{{ page().eyebrow }}</p>
        <h1 id="legal-title">{{ page().title }}</h1>
        <p class="lead">{{ page().intro }}</p>
        @for (section of page().sections; track section.title) {
          <section>
            <h2>{{ section.title }}</h2>
            @for (paragraph of section.body; track paragraph) { <p>{{ paragraph }}</p> }
          </section>
        }
        <a routerLink="/" class="back">← Torna alle escursioni</a>
      </div>
    </article>
  `,
  styles: [`
    :host { display: block; flex: 1; min-height: 0; overflow: auto; background: #f5f1e8; }
    .legal-page { color: #1c1917; }
    .legal-inner { width: min(46rem, calc(100% - 2rem)); margin: 0 auto; padding: clamp(2rem, 6vw, 5rem) 0; }
    .eyebrow { margin: 0 0 .45rem; color: #3f6212; font: 700 .72rem/1.2 'IBM Plex Mono', monospace; letter-spacing: .12em; text-transform: uppercase; }
    h1 { margin: 0; font-size: clamp(2rem, 5vw, 3.4rem); font-weight: 900; letter-spacing: -.055em; line-height: .98; }
    .lead { max-width: 37rem; margin: 1rem 0 2.5rem; color: #44403c; font-size: 1.1rem; line-height: 1.55; }
    section { padding: 1.35rem 0; border-top: 1px solid rgb(28 25 23 / .14); }
    h2 { margin: 0 0 .65rem; font-size: 1.2rem; letter-spacing: -.025em; }
    p { margin: 0 0 .75rem; color: #44403c; line-height: 1.6; }
    .back { display: inline-block; margin-top: 1rem; color: #14532d; font-weight: 800; text-decoration: none; }
    .back:hover { text-decoration: underline; }
  `]
})
export class LegalPageComponent {
  private readonly route = inject(ActivatedRoute);
  readonly page = computed(() => PAGES[this.route.snapshot.routeConfig?.path ?? 'termini'] ?? PAGES['termini']);
}
