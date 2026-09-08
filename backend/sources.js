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

// Abruzzo overrides win over registry discover stubs (same precedence as LAZIO).
// Batch 1: gemini pdf-programma. Torre De' Passeri shares the Popoli PDF.
// Batch 2: more pdf-programma + Chieti ICS/deterministic (avoids Gemini quota).
const ABRUZZO_SOURCES = [
  {
    id: 'cai-pescara-9234005',
    organizer: 'CAI Pescara',
    url: 'https://www.caipescara.it/wp-content/uploads/2026/02/programma_2026_cai_pescara_compressione_forte.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-sulmona-9234004',
    organizer: 'CAI Sulmona',
    url: 'https://caisulmona.it/wp-content/uploads/2026/01/Programma-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-popoli-9234016',
    organizer: 'CAI Popoli',
    url: 'https://www.sezionecaipopoli.it/wp-content/uploads/2026/01/Programma-CAI-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-vasto-9234022',
    organizer: 'CAI Vasto',
    url: 'https://www.caivasto.it/wp-content/uploads/2026/02/Calendario-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-guardiagrele-9234007',
    organizer: 'CAI Guardiagrele',
    url: 'https://www.caiguardiagrele.it/pag/programma/programma2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-torre-de-passeri-9134014',
    organizer: "CAI Torre De' Passeri",
    url: 'https://www.sezionecaipopoli.it/wp-content/uploads/2026/01/Programma-CAI-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-carsoli-9234024',
    organizer: 'CAI Carsoli',
    url: 'https://www.caicarsoli.it/allegati/upload/calendario-sociale-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-arsita-9234026',
    organizer: 'CAI Arsita',
    url: 'https://www.caiabruzzo.it/wp-content/uploads/2026/01/PROGRAMMA-CAI-Arsita-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-val-vibrata-monti-gemelli-9234027',
    organizer: 'CAI Val Vibrata (monti Gemelli)',
    url: 'https://www.caiabruzzo.it/wp-content/uploads/2026/01/VAL-VIBRATA-PIeghevole-calendario-26SITO.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-chieti-9234001',
    organizer: 'CAI Chieti',
    url: 'https://www.caichieti.it/wp-content/uploads/2026/03/Calendario_Sezionale_CAI_Chieti_2026.ics',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-atessa-9234011',
    organizer: 'CAI Atessa',
    url: 'https://organizzazione.cai.it/sez-atessa/wp-content/uploads/sites/4/2026/01/CALENDARIO-CAI-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  }
];


// Calabria overrides win over registry discover stubs (same precedence as ABRUZZO).
// Mendicino shares the Cosenza PDF (subsection of Cosenza).
const CALABRIA_SOURCES = [
  {
    id: 'cai-castrovillari-9244005',
    organizer: 'CAI Castrovillari',
    url: 'https://www.caicastrovillari.it/images/programma2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-cerchiara-di-calabria-9144003',
    organizer: 'CAI Cerchiara Di Calabria',
    url: 'https://www.caicastrovillari.it/images/programmacerchiara26.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-cosenza-9244002',
    organizer: 'CAI Cosenza',
    url: 'https://brunopino.it/wp-content/uploads/2026/01/programma-cai-cosenza-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-mendicino-9144004',
    organizer: 'CAI Mendicino',
    url: 'https://brunopino.it/wp-content/uploads/2026/01/programma-cai-cosenza-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-reggio-calabria-9244001',
    organizer: 'CAI Reggio Calabria',
    url: 'https://drive.google.com/uc?export=download&id=10kXORYlyXLWHHRmG7ZB11iCXdeeEPoUh',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  }
];

// Sardegna overrides win over registry discover stubs (same precedence as ABRUZZO).
const SARDEGNA_SOURCES = [
  {
    id: 'cai-cagliari-9248001',
    organizer: 'CAI Cagliari',
    url: 'https://www.caicagliari.it/escursionismo/wp-content/uploads/sites/2/2026/08/PAE2026s.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-nuoro-9248002',
    organizer: 'CAI Nuoro',
    url: 'https://organizzazione.cai.it/sez-nuoro/wp-content/uploads/sites/40/2026/02/Calendario-Escursionistico-Cai-Nuoro-2026-3.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-oristano-9248004',
    organizer: 'CAI Oristano',
    url: 'https://organizzazione.cai.it/sez-oristano/wp-content/uploads/sites/41/2025/10/2026-calendario-completo.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  }
];

// The generated directory is the complete list, including sections without a
// usable public calendar. Each enabled row is its own configurable adapter.
let NATIONAL_REGISTRY = { sections: [] };
try { NATIONAL_REGISTRY = require('./data/cai-sections.json'); }
catch (error) { if (error.code !== 'MODULE_NOT_FOUND') throw error; }
const registryByLegacyId = new Map(NATIONAL_REGISTRY.sections.filter(s => s.legacyId).map(s => [s.legacyId, s]));
const registryById = new Map(NATIONAL_REGISTRY.sections.map(s => [s.id, s]));

function mergeOverrideSource(source, { defaultRegion, lookup }) {
  const registry = lookup(source.id) || {};
  const calendarUrls = [source.url, ...(registry.calendarUrls || []).filter((u) => u !== source.url)];
  return {
    ...registry,
    ...source,
    region: registry.region || defaultRegion,
    id: source.id,
    calendarUrls
  };
}

const lazioOverrideIds = new Set(LAZIO_SOURCES.map(s => s.id));
const abruzzoOverrideIds = new Set(ABRUZZO_SOURCES.map(s => s.id));
const calabriaOverrideIds = new Set(CALABRIA_SOURCES.map(s => s.id));
const sardegnaOverrideIds = new Set(SARDEGNA_SOURCES.map(s => s.id));
const overrideIds = new Set([
  ...lazioOverrideIds,
  ...abruzzoOverrideIds,
  ...calabriaOverrideIds,
  ...sardegnaOverrideIds
]);

// Override scrape fields (url/kind/template/extractor/enabled) must win over
// registry discovery metadata. Registry still contributes website/directoryUrl/etc.
const SOURCES = [
  ...LAZIO_SOURCES.map(source => mergeOverrideSource(source, {
    defaultRegion: 'Lazio',
    lookup: (id) => registryByLegacyId.get(id)
  })),
  ...ABRUZZO_SOURCES.map(source => mergeOverrideSource(source, {
    defaultRegion: 'Abruzzo',
    lookup: (id) => registryById.get(id)
  })),
  ...CALABRIA_SOURCES.map(source => mergeOverrideSource(source, {
    defaultRegion: 'Calabria',
    lookup: (id) => registryById.get(id)
  })),
  ...SARDEGNA_SOURCES.map(source => mergeOverrideSource(source, {
    defaultRegion: 'Sardegna',
    lookup: (id) => registryById.get(id)
  })),
  ...NATIONAL_REGISTRY.sections.filter(source =>
    !overrideIds.has(source.id) && !(source.legacyId && overrideIds.has(source.legacyId))
  )
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
  ABRUZZO_SOURCES,
  CALABRIA_SOURCES,
  SARDEGNA_SOURCES,
  NATIONAL_REGISTRY,
  enabledSources,
  findSource,
  isCheerioSource,
  sourceMeta
};
