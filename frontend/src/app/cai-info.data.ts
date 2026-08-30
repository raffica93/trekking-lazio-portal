export const UNPUBLISHED_LABEL = 'non pubblicato';

export interface CitedText {
  title: string;
  body: string;
  sourceLabel: string;
  sourceUrl: string;
}

export interface QuoteCategory {
  /** Displayed euro amount, or null when the sezione has not published a figure. */
  amountEuro: number | null;
  note?: string;
}

export interface QuoteRow {
  id: string;
  name: string;
  year: number | null;
  isNationalFloor?: boolean;
  ordinario: QuoteCategory;
  familiare: QuoteCategory;
  juniores: QuoteCategory;
  giovane: QuoteCategory;
  tesseraNuova: QuoteCategory;
  sourceLabel: string;
  sourceUrl: string;
}

export interface SezioneLink {
  id: string;
  name: string;
  websiteUrl: string;
  hasAgenda: boolean;
  agendaUrl: string | null;
  agendaLabel: string | null;
}

export function formatEuro(amount: number): string {
  return `€ ${amount.toFixed(2).replace('.', ',')}`;
}

export function quoteDisplay(category: QuoteCategory): string {
  if (category.amountEuro == null) {
    return category.note ? `${UNPUBLISHED_LABEL} (${category.note})` : UNPUBLISHED_LABEL;
  }
  const base = formatEuro(category.amountEuro);
  return category.note ? `${base} (${category.note})` : base;
}

export const CAI_PHILOSOPHY: CitedText = {
  title: 'Filosofia del Club Alpino Italiano',
  body:
    'Il Club alpino italiano (C.A.I.), fondato in Torino nell’anno 1863 per iniziativa di Quintino Sella, libera associazione nazionale, ha per iscopo l’alpinismo in ogni sua manifestazione, la conoscenza e lo studio delle montagne, specialmente di quelle italiane, e la difesa del loro ambiente naturale.',
  sourceLabel: 'Statuto CAI, art. 1 — Costituzione e finalità',
  sourceUrl: 'https://www.cai.it/wp-content/uploads/2024/05/16-2022-Testo-Statuto-CAI-dopo-AD-Bormio-2022.pdf'
};

export const CAI_PARTICIPATION: CitedText = {
  title: 'Con l’iscrizione si partecipa a qualsiasi evento CAI',
  body:
    'La tessera CAI vale per tutto il sodalizio, non solo per la sezione in cui ci si iscrive. Un socio in regola con il bollino dell’anno può partecipare alle uscite e alle manifestazioni delle altre sezioni: basta presentarsi al direttore di escursione con nome, cognome e sezione di appartenenza, e seguire il regolamento di quella uscita.',
  sourceLabel: 'GR Lazio — sezioni del Lazio',
  sourceUrl: 'https://gr.cailazio.org/sezioni-del-lazio/'
};

export const CAI_PARTICIPATION_POINTS: CitedText[] = [
  {
    title: 'Una tessera, tutte le sezioni',
    body:
      'Per diventare socio ci si reca presso una qualsiasi sezione. Tra i vantaggi: libero ingresso nelle sedi di sezioni e sottosezioni, o partecipazione alle manifestazioni da esse organizzate.',
    sourceLabel: 'cai.it — Diventa socio',
    sourceUrl: 'https://www.cai.it/diventa-socio/'
  },
  {
    title: 'Uscite delle sezioni laziali',
    body:
      'Se sei un socio CAI puoi partecipare alle uscite delle sezioni consultando il direttore di escursione o l’accompagnatore, indicando nome, cognome e sezione di appartenenza e seguendo le regole di escursionismo di quella sezione.',
    sourceLabel: 'GR Lazio — sezioni del Lazio',
    sourceUrl: 'https://gr.cailazio.org/sezioni-del-lazio/'
  },
  {
    title: 'Anche fuori dalla propria sezione',
    body:
      'L’iscrizione dà diritto a partecipare a escursioni, trekking, corsi e altre iniziative promosse sia dalla propria sezione sia dalle altre sezioni d’Italia, e ai corsi formativi organizzati da qualsiasi altra sezione.',
    sourceLabel: 'CAI Rieti — tesseramento; CAI Frascati',
    sourceUrl: 'https://organizzazione.cai.it/sez-rieti/iscriviti/tesseramento-2/'
  }
];

const unpublished: QuoteCategory = { amountEuro: null };

function unpublishedSezione(
  id: string,
  name: string,
  sourceUrl: string,
  sourceLabel: string
): QuoteRow {
  return {
    id,
    name,
    year: null,
    ordinario: unpublished,
    familiare: unpublished,
    juniores: unpublished,
    giovane: unpublished,
    tesseraNuova: unpublished,
    sourceLabel,
    sourceUrl
  };
}

export const CAI_QUOTE_ROWS: QuoteRow[] = [
  {
    id: 'minimi-nazionali',
    name: 'Minimi nazionali CAI',
    year: 2026,
    isNationalFloor: true,
    ordinario: { amountEuro: 45 },
    familiare: { amountEuro: 24 },
    juniores: { amountEuro: 24, note: 'come familiare' },
    giovane: { amountEuro: 16 },
    tesseraNuova: { amountEuro: 3.81, note: 'ammissione ord./fam.; giovani esenti' },
    sourceLabel: 'Circolare tesseramento 13/2025',
    sourceUrl: 'https://www.cai.it/wp-content/uploads/2025/10/13-2025-Circolare-Campagna-Tesseramento-2026_signed.pdf'
  },
  {
    id: 'amatrice',
    name: 'CAI Amatrice',
    year: 2026,
    ordinario: { amountEuro: 45 },
    familiare: { amountEuro: 24 },
    juniores: { amountEuro: 24 },
    giovane: { amountEuro: 16, note: '2° giovane € 9,00' },
    tesseraNuova: { amountEuro: 5, note: 'nuovi soci' },
    sourceLabel: 'caiamatrice.it/tesseramento',
    sourceUrl: 'https://www.caiamatrice.it/tesseramento/'
  },
  {
    id: 'frascati',
    name: 'CAI Frascati',
    year: 2026,
    ordinario: { amountEuro: 45 },
    familiare: { amountEuro: 27 },
    juniores: { amountEuro: 27 },
    giovane: { amountEuro: 13, note: '2° figlio € 9,00' },
    tesseraNuova: { amountEuro: 8 },
    sourceLabel: 'caifrascati.it/iscrizioni',
    sourceUrl: 'https://www.caifrascati.it/iscrizioni/'
  },
  {
    id: 'viterbo',
    name: 'CAI Viterbo',
    year: 2026,
    ordinario: { amountEuro: 50 },
    familiare: { amountEuro: 30 },
    juniores: { amountEuro: 22 },
    giovane: { amountEuro: 16, note: 'dal 2° figlio € 9,00' },
    tesseraNuova: { amountEuro: 5, note: 'gratuita per i giovani' },
    sourceLabel: 'caiviterbo.it — Come iscriversi',
    sourceUrl: 'https://www.caiviterbo.it/index.php/51-come-iscriversi'
  },
  {
    id: 'leonessa',
    name: 'CAI Leonessa',
    year: 2026,
    ordinario: { amountEuro: 47, note: 'rinnovo; nuova € 50,00' },
    familiare: { amountEuro: 26, note: 'rinnovo; nuova € 30,00' },
    juniores: { amountEuro: 26, note: 'come familiare; nuova € 30,00' },
    giovane: { amountEuro: 17, note: 'rinnovo; nuova € 21,00' },
    tesseraNuova: unpublished,
    sourceLabel: 'organizzazione.cai.it/sez-leonessa/iscriviti',
    sourceUrl: 'https://organizzazione.cai.it/sez-leonessa/iscriviti/'
  },
  {
    id: 'rieti',
    name: 'CAI Rieti',
    year: 2025,
    ordinario: { amountEuro: 50, note: 'rinnovo; 1ª iscrizione € 55,00' },
    familiare: { amountEuro: 25, note: '1ª iscrizione € 30,00' },
    juniores: { amountEuro: 25, note: '1ª iscrizione € 30,00' },
    giovane: { amountEuro: 16, note: '1ª iscrizione € 21,00' },
    tesseraNuova: { amountEuro: 5, note: 'sulla 1ª iscrizione' },
    sourceLabel: 'Tesseramento Rieti (tabella 2025)',
    sourceUrl: 'https://organizzazione.cai.it/sez-rieti/iscriviti/tesseramento-2/'
  },
  unpublishedSezione('roma', 'CAI Roma', 'http://www.cairoma.it', 'cairoma.it (nessun tariffario pubblico)'),
  unpublishedSezione('tivoli', 'CAI Tivoli', 'http://www.caitivoli.it', 'caitivoli.it'),
  unpublishedSezione('monterotondo', 'CAI Monterotondo', 'http://www.caimonterotondo.it/', 'caimonterotondo.it'),
  unpublishedSezione('frosinone', 'CAI Frosinone', 'http://www.caifrosinone.it', 'caifrosinone.it'),
  unpublishedSezione('latina', 'CAI Latina', 'http://www.cailatina.com/', 'cailatina.com'),
  unpublishedSezione('alatri', 'CAI Alatri', 'http://www.caialatri.it', 'caialatri.it'),
  unpublishedSezione('antrodoco', 'CAI Antrodoco', 'http://www.caiantrodoco.it', 'caiantrodoco.it'),
  unpublishedSezione('aprilia', 'CAI Aprilia', 'http://www.caiaprilia.com', 'caiaprilia.com'),
  unpublishedSezione('cassino', 'CAI Cassino', 'http://www.caicassino.com', 'caicassino.com'),
  unpublishedSezione('colleferro', 'CAI Colleferro', 'http://caicolleferro.it', 'caicolleferro.it'),
  unpublishedSezione('esperia', 'CAI Esperia', 'http://www.caiesperia.it', 'caiesperia.it'),
  unpublishedSezione('gallinaro', 'CAI Gallinaro', 'https://caisezionedigallinaro.wordpress.com/', 'caisezionedigallinaro.wordpress.com'),
  unpublishedSezione('palestrina', 'CAI Palestrina', 'http://www.caipalestrina.it', 'caipalestrina.it'),
  unpublishedSezione('sora', 'CAI Sora', 'http://www.caisora.it', 'caisora.it')
];

export const CAI_SEZIONE_LINKS: SezioneLink[] = [
  { id: 'alatri', name: 'CAI Alatri', websiteUrl: 'http://www.caialatri.it', hasAgenda: false, agendaUrl: null, agendaLabel: null },
  {
    id: 'amatrice',
    name: 'CAI Amatrice',
    websiteUrl: 'http://www.caiamatrice.it/',
    hasAgenda: true,
    agendaUrl: 'https://www.caiamatrice.it/sfogliabili/programma2026/programma_2026_singola_WEB.html',
    agendaLabel: 'Programma 2026'
  },
  { id: 'antrodoco', name: 'CAI Antrodoco', websiteUrl: 'http://www.caiantrodoco.it', hasAgenda: false, agendaUrl: null, agendaLabel: null },
  { id: 'aprilia', name: 'CAI Aprilia', websiteUrl: 'http://www.caiaprilia.com', hasAgenda: false, agendaUrl: null, agendaLabel: null },
  { id: 'cassino', name: 'CAI Cassino', websiteUrl: 'http://www.caicassino.com', hasAgenda: false, agendaUrl: null, agendaLabel: null },
  { id: 'colleferro', name: 'CAI Colleferro', websiteUrl: 'http://caicolleferro.it', hasAgenda: false, agendaUrl: null, agendaLabel: null },
  { id: 'esperia', name: 'CAI Esperia', websiteUrl: 'http://www.caiesperia.it', hasAgenda: false, agendaUrl: null, agendaLabel: null },
  {
    id: 'frascati',
    name: 'CAI Frascati',
    websiteUrl: 'http://www.caifrascati.it',
    hasAgenda: true,
    agendaUrl: 'https://www.caifrascati.it/wp-content/uploads/2025/12/Brochure-2026-Pagina-2.jpg',
    agendaLabel: 'Calendario escursioni 2026'
  },
  { id: 'frosinone', name: 'CAI Frosinone', websiteUrl: 'http://www.caifrosinone.it', hasAgenda: false, agendaUrl: null, agendaLabel: null },
  {
    id: 'gallinaro',
    name: 'CAI Gallinaro',
    websiteUrl: 'https://caisezionedigallinaro.wordpress.com/',
    hasAgenda: false,
    agendaUrl: null,
    agendaLabel: null
  },
  { id: 'latina', name: 'CAI Latina', websiteUrl: 'http://www.cailatina.com/', hasAgenda: false, agendaUrl: null, agendaLabel: null },
  {
    id: 'leonessa',
    name: 'CAI Leonessa',
    websiteUrl: 'http://www.caileonessa.org',
    hasAgenda: true,
    agendaUrl: 'https://organizzazione.cai.it/sez-leonessa/wp-content/uploads/sites/26/2025/12/CAI-Pieghevole-2026.pdf',
    agendaLabel: 'Pieghevole 2026 (PDF)'
  },
  {
    id: 'monterotondo',
    name: 'CAI Monterotondo',
    websiteUrl: 'http://www.caimonterotondo.it/',
    hasAgenda: true,
    agendaUrl:
      'https://organizzazione.cai.it/sez-monterotondo/wp-content/uploads/sites/141/2026/01/Calendario-escursioni-2026-CAI-Monterotondo-estratto-PDF.pdf',
    agendaLabel: 'Calendario escursioni 2026 (PDF)'
  },
  { id: 'palestrina', name: 'CAI Palestrina', websiteUrl: 'http://www.caipalestrina.it', hasAgenda: false, agendaUrl: null, agendaLabel: null },
  {
    id: 'rieti',
    name: 'CAI Rieti',
    websiteUrl: 'http://www.cairieti.it',
    hasAgenda: true,
    agendaUrl:
      'https://organizzazione.cai.it/sez-rieti/wp-content/uploads/sites/45/2026/01/CAI_RI_programma_attivita_2026_completo.pdf',
    agendaLabel: 'Programma attività 2026 (PDF)'
  },
  {
    id: 'roma',
    name: 'CAI Roma',
    websiteUrl: 'http://www.cairoma.it',
    hasAgenda: true,
    agendaUrl: 'https://www.cairoma.it/?page_id=582',
    agendaLabel: 'Programma escursioni sociali'
  },
  { id: 'sora', name: 'CAI Sora', websiteUrl: 'http://www.caisora.it', hasAgenda: false, agendaUrl: null, agendaLabel: null },
  {
    id: 'tivoli',
    name: 'CAI Tivoli',
    websiteUrl: 'http://www.caitivoli.it',
    hasAgenda: true,
    agendaUrl: 'https://www.caitivoli.it/wp-content/uploads/2025/12/Programma_CAI_2026.pdf',
    agendaLabel: 'Programma CAI 2026 (PDF)'
  },
  {
    id: 'viterbo',
    name: 'CAI Viterbo',
    websiteUrl: 'http://www.caiviterbo.it',
    hasAgenda: true,
    agendaUrl: 'https://www.caiviterbo.it/index.php/programma',
    agendaLabel: 'Programma'
  }
];

export const AGENDA_YES_LABEL = 'sì';
export const AGENDA_NO_LABEL = 'no';
