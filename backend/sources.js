const { CAI_ROMA_URL } = require('./scraper');

const SOURCES = [
  {
    id: 'roma',
    organizer: 'CAI Roma',
    url: CAI_ROMA_URL,
    kind: 'html',
    extractor: 'cheerio',
    enabled: true
  },
  {
    id: 'viterbo',
    organizer: 'CAI Viterbo',
    url: 'https://www.caiviterbo.it/index.php/programma',
    kind: 'html',
    extractor: 'grok',
    enabled: true
  },
  {
    id: 'tivoli',
    organizer: 'CAI Tivoli',
    url: 'https://www.caitivoli.it/wp-content/uploads/2025/12/Programma_CAI_2026.pdf',
    kind: 'pdf',
    extractor: 'grok',
    enabled: true
  },
  {
    id: 'rieti',
    organizer: 'CAI Rieti',
    url: 'https://organizzazione.cai.it/sez-rieti/wp-content/uploads/sites/45/2026/01/CAI_RI_programma_attivita_2026_completo.pdf',
    kind: 'pdf',
    extractor: 'grok',
    enabled: true
  },
  {
    id: 'monterotondo',
    organizer: 'CAI Monterotondo',
    url: 'https://organizzazione.cai.it/sez-monterotondo/wp-content/uploads/sites/141/2026/01/Calendario-escursioni-2026-CAI-Monterotondo-estratto-PDF.pdf',
    kind: 'pdf',
    extractor: 'grok',
    enabled: true
  },
  {
    id: 'frosinone',
    organizer: 'CAI Frosinone',
    url: 'https://www.caifrosinone.it/',
    kind: 'html',
    extractor: 'grok',
    enabled: true
  },
  {
    id: 'leonessa',
    organizer: 'CAI Leonessa',
    url: 'https://organizzazione.cai.it/sez-leonessa/wp-content/uploads/sites/26/2025/12/CAI-Pieghevole-2026.pdf',
    kind: 'pdf',
    extractor: 'grok',
    enabled: true
  },
  {
    id: 'latina',
    organizer: 'CAI Latina',
    url: 'http://www.cailatina.com/',
    kind: 'discover',
    extractor: 'grok',
    enabled: false
  },
  {
    id: 'alatri',
    organizer: 'CAI Alatri',
    url: 'http://www.caialatri.it/',
    kind: 'discover',
    extractor: 'grok',
    enabled: false
  },
  {
    id: 'amatrice',
    organizer: 'CAI Amatrice',
    url: 'http://www.caiamatrice.it/',
    kind: 'discover',
    extractor: 'grok',
    enabled: false
  },
  {
    id: 'antrodoco',
    organizer: 'CAI Antrodoco',
    url: 'http://www.caiantrodoco.it/',
    kind: 'discover',
    extractor: 'grok',
    enabled: false
  },
  {
    id: 'aprilia',
    organizer: 'CAI Aprilia',
    url: 'http://www.caiaprilia.com/',
    kind: 'discover',
    extractor: 'grok',
    enabled: false
  },
  {
    id: 'cassino',
    organizer: 'CAI Cassino',
    url: 'http://www.caicassino.com/',
    kind: 'discover',
    extractor: 'grok',
    enabled: false
  },
  {
    id: 'colleferro',
    organizer: 'CAI Colleferro',
    url: 'http://caicolleferro.it/',
    kind: 'discover',
    extractor: 'grok',
    enabled: false
  },
  {
    id: 'esperia',
    organizer: 'CAI Esperia',
    url: 'http://www.caiesperia.it/',
    kind: 'discover',
    extractor: 'grok',
    enabled: false
  },
  {
    id: 'frascati',
    organizer: 'CAI Frascati',
    url: 'http://www.caifrascati.it/',
    kind: 'discover',
    extractor: 'grok',
    enabled: false
  },
  {
    id: 'gallinaro',
    organizer: 'CAI Gallinaro',
    url: 'https://caisezionedigallinaro.wordpress.com/',
    kind: 'discover',
    extractor: 'grok',
    enabled: false
  },
  {
    id: 'palestrina',
    organizer: 'CAI Palestrina',
    url: 'http://www.caipalestrina.it/',
    kind: 'discover',
    extractor: 'grok',
    enabled: false
  },
  {
    id: 'sora',
    organizer: 'CAI Sora',
    url: 'http://www.caisora.it/',
    kind: 'discover',
    extractor: 'grok',
    enabled: false
  }
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
    url: source.url,
    kind: source.kind
  };
}

module.exports = {
  SOURCES,
  enabledSources,
  findSource,
  sourceMeta
};
