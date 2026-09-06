const { CAI_ROMA_URL } = require('./scraper');

const LAZIO_SOURCES = [
  {
    id: 'roma',
    organizer: 'CAI Roma',
    url: CAI_ROMA_URL,
    kind: 'html',
    template: 'html-table',
    extractor: 'cheerio',
    enabled: true
  },
  {
    id: 'viterbo',
    organizer: 'CAI Viterbo',
    url: 'https://www.caiviterbo.it/index.php/programma',
    kind: 'html',
    template: 'html-programma',
    extractor: 'gemini',
    enabled: true
  },
  {
    id: 'tivoli',
    organizer: 'CAI Tivoli',
    url: 'https://www.caitivoli.it/wp-content/uploads/2025/12/Programma_CAI_2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true
  },
  {
    id: 'rieti',
    organizer: 'CAI Rieti',
    url: 'https://organizzazione.cai.it/sez-rieti/wp-content/uploads/sites/45/2026/01/CAI_RI_programma_attivita_2026_completo.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true
  },
  {
    id: 'monterotondo',
    organizer: 'CAI Monterotondo',
    url: 'https://organizzazione.cai.it/sez-monterotondo/wp-content/uploads/sites/141/2026/01/Calendario-escursioni-2026-CAI-Monterotondo-estratto-PDF.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true
  },
  {
    id: 'frosinone',
    organizer: 'CAI Frosinone',
    url: 'https://drive.google.com/uc?export=download&id=1qh5YNLgJqtqOZoYIJMZe7HLapWuI3rNv',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true
  },
  {
    id: 'leonessa',
    organizer: 'CAI Leonessa',
    url: 'https://organizzazione.cai.it/sez-leonessa/wp-content/uploads/sites/26/2025/12/CAI-Pieghevole-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true
  },
  {
    id: 'sora',
    organizer: 'CAI Sora',
    url: 'https://www.caisora.it/sito/wp-content/uploads/2026/02/2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true
  },
  {
    id: 'amatrice',
    organizer: 'CAI Amatrice',
    url: 'https://www.caiamatrice.it/wp-content/uploads/2026/05/CAI-Programma2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true
  },
  {
    id: 'esperia',
    organizer: 'CAI Esperia',
    url: 'http://www.caiesperia.it/images/doc/calendario_2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true
  },
  {
    id: 'alatri',
    organizer: 'CAI Alatri',
    url: 'https://www.caialatri.it/calendario-escursioni/',
    kind: 'html',
    template: 'html-calendario',
    extractor: 'gemini',
    enabled: true
  },
  {
    id: 'aprilia',
    organizer: 'CAI Aprilia',
    url: 'https://www.caiaprilia.com/programma-2024/',
    kind: 'html',
    template: 'html-programma',
    extractor: 'gemini',
    enabled: true
  },
  {
    id: 'colleferro',
    organizer: 'CAI Colleferro',
    url: 'https://caicolleferro.it/wp-content/uploads/2025/12/CAI-Colleferro-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true
  },
  {
    id: 'frascati',
    organizer: 'CAI Frascati',
    url: 'https://www.caifrascati.it/calendario/',
    kind: 'html',
    template: 'html-calendario',
    extractor: 'gemini',
    enabled: true
  },
  {
    id: 'palestrina',
    organizer: 'CAI Palestrina',
    url: 'http://www.caipalestrina.it/calendario-attivita-2026.html',
    kind: 'html',
    template: 'html-calendario',
    extractor: 'gemini',
    enabled: true
  },
  {
    id: 'antrodoco',
    organizer: 'CAI Antrodoco',
    url: 'https://www.caiantrodoco.it/eventi/',
    kind: 'html',
    template: 'html-calendario',
    extractor: 'gemini',
    enabled: true
  },
  {
    id: 'latina',
    organizer: 'CAI Latina',
    url: 'https://www.cailatina.com/pagu_eventi.php?statoevento=pianificato',
    kind: 'html',
    template: 'html-calendario',
    extractor: 'gemini',
    enabled: true
  },
  {
    id: 'cassino',
    organizer: 'CAI Cassino',
    url: 'https://www.caicassino.it/index.php/eventi',
    kind: 'html',
    template: 'html-calendario',
    extractor: 'gemini',
    enabled: true
  },
  {
    id: 'gallinaro',
    organizer: 'CAI Gallinaro',
    url: 'https://www.facebook.com/p/CAI-Gallinaro-6157261685',
    kind: 'discover',
    template: 'facebook',
    extractor: 'gemini',
    enabled: true
  }
];

// The generated directory is the complete list, including sections without a
// usable public calendar. Each enabled row is its own configurable adapter.
let NATIONAL_REGISTRY = { sections: [] };
try { NATIONAL_REGISTRY = require('./data/cai-sections.json'); }
catch (error) { if (error.code !== 'MODULE_NOT_FOUND') throw error; }
const registryByLegacyId = new Map(NATIONAL_REGISTRY.sections.filter(s => s.legacyId).map(s => [s.legacyId, s]));
const legacyIds = new Set(LAZIO_SOURCES.map(s => s.id));
// LAZIO_SOURCES scrape fields (url/kind/template/extractor/enabled) must win over
// registry discovery metadata. Registry still contributes website/directoryUrl/etc.
const SOURCES = [
  ...LAZIO_SOURCES.map(source => {
    const registry = registryByLegacyId.get(source.id) || {};
    const calendarUrls = [source.url, ...(registry.calendarUrls || []).filter((u) => u !== source.url)];
    return {
      ...registry,
      ...source,
      region: 'Lazio',
      id: source.id,
      calendarUrls
    };
  }),
  ...NATIONAL_REGISTRY.sections.filter(source => !legacyIds.has(source.id))
];

function enabledSources(list = SOURCES) {
  return list.filter((source) => source.enabled);
}

function findSource(id, list = SOURCES) {
  return list.find((source) => source.id === id) || null;
}

function sourceMeta(source) {
  return {
    id: source.id,
    organizer: source.organizer,
    region: source.region || 'Lazio',
    website: source.website || null,
    directoryUrl: source.directoryUrl || null,
    calendarUrls: source.calendarUrls || [source.url],
    directoryId: source.directoryId || null,
    sectionType: source.sectionType || 'section',
    parentSectionId: source.parentSectionId || null,
    status: source.status || 'calendar-found',
    url: source.url,
    kind: source.kind,
    template: source.template || source.kind,
    extractor: source.extractor,
    enabled: Boolean(source.enabled)
  };
}

function isCheerioSource(source) {
  return source?.extractor === 'cheerio';
}

module.exports = {
  SOURCES,
  LAZIO_SOURCES,
  NATIONAL_REGISTRY,
  enabledSources,
  findSource,
  isCheerioSource,
  sourceMeta
};
