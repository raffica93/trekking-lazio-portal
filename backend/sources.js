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


// Campania overrides win over registry discover stubs (same precedence as ABRUZZO).
// Avella shares the Avellino PDF (subsection of Avellino). Hub Napoli multi-section later.
const CAMPANIA_SOURCES = [
  {
    id: 'cai-avellino-9238004',
    organizer: 'CAI Avellino',
    url: 'http://www.caiavellino.it/images/programma/Programma_Attivita_CAI_Avellino_2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-avella-9138007',
    organizer: 'CAI Avella',
    url: 'http://www.caiavellino.it/images/programma/Programma_Attivita_CAI_Avellino_2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-benevento-9238008',
    organizer: 'CAI Benevento',
    url: 'https://www.caibenevento.it/wp-content/uploads/2026/01/Programma_CAI_BN_2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-caserta-9238006',
    organizer: 'CAI Caserta',
    url: 'https://www.caicaserta.it/documenti/Calendario%20escursionistico%202026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-piedimonte-matese-9238005',
    organizer: 'CAI Piedimonte Matese',
    url: 'https://www.caipiedimontematese.it/wp-content/uploads/2026/programma_sezionale_2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-monte-bulgheria-9238010',
    organizer: 'CAI Monte Bulgheria',
    url: 'https://www.caimontebulgheria.it/Programmi/Programma_Sez_MB_2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  }
];


// Valle d'Aosta overrides win over registry discover stubs (same precedence as ABRUZZO).
// Gressoney deferred (no calendar PDF in this batch). Barthelemy is subsection of Aosta.
const VALLE_DAOSTA_SOURCES = [
  {
    id: 'cai-aosta-9214001',
    organizer: 'CAI Aosta',
    url: 'https://www.caivda.it/wp-content/uploads/2025/12/annuario-2026-cai-aosta.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-barthelemy-9114002',
    organizer: 'CAI Barthelemy',
    url: 'https://www.caivda.it/wp-content/uploads/2026/01/CAI-StB-Annuario-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-chatillon-9214004',
    organizer: 'CAI Chatillon',
    url: 'https://www.caivda.it/wp-content/uploads/2026/01/Pieghevole-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-verres-9214003',
    organizer: 'CAI Verres',
    url: 'https://www.caiverres.it/attachments/article/9/CAI%20Verres%20-%20Opuscolo%202026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  }
];

// Veneto overrides win over registry discover stubs (same precedence as ABRUZZO).
// Asiago/Spresiano keep HTTP URLs (HTTPS SSL broken / 999). Pieve shares Calalzo PDF.
// Pedemontana Grappa uses Feltre parent Annuario PDF (Feltre itself not enabled here).
// Out of scope: ICS Pieve di Soligo/Recoaro; scrapes.
const VENETO_SOURCES = [
  {
    id: 'cai-asiago-9220040',
    organizer: 'CAI Asiago',
    url: 'http://www.caiasiago.it/documenti/Libretto%20CAI%20Asiago%202026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-cittadella-9220020',
    organizer: 'CAI Cittadella',
    url: 'https://www.caicittadella.it/wp-content/uploads/2026/02/Programma2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-este-9220032',
    organizer: 'CAI Este',
    url: 'https://www.caieste.org/wp-content/uploads/2025/12/Libretto-rev-FUTURAMA-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-legnago-9220063',
    organizer: 'CAI Legnago',
    url: 'https://cailegnago.it/wp-content/uploads/2025/12/CAI-Legnago-Programma-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-treviso-9220009',
    organizer: 'CAI Treviso',
    url: 'https://www.caitreviso.it/wp-content/uploads/2026/01/calendario-CAI-Treviso-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-arzignano-9220024',
    organizer: 'CAI Arzignano',
    url: 'https://www.caiarzignano.info/attivita/programma/download/145_b1828245b46e81eef4f75fa63b08a761',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-calalzo-di-cadore-9220035',
    organizer: 'CAI Calalzo Di Cadore',
    url: 'https://caicalalzo.it/wp-content/uploads/2026/03/Escursioni-estate-2026-opuscolo.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-pieve-di-cadore-9220022',
    organizer: 'CAI Pieve Di Cadore',
    url: 'https://caicalalzo.it/wp-content/uploads/2026/03/Escursioni-estate-2026-opuscolo.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-canal-di-brenta-9120022',
    organizer: 'CAI Canal Di Brenta',
    url: 'https://organizzazione.cai.it/sez-bassano-del-grappa/wp-content/uploads/sites/113/2026/03/Sottosezione-Canal-di-Brenta-Escursioni-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-famiglia-alpinistica-9120013',
    organizer: 'CAI Famiglia Alpinistica',
    url: 'https://www.famigliaalpinistica.it/media/attachments/2025/11/28/calendario-f.a.-2026-senza-capo-gita.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-lonigo-9220015',
    organizer: 'CAI Lonigo',
    url: 'https://cailonigo.it/wp-content/uploads/2026/01/Cai-Lonigo-libretto-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-malo-9220046',
    organizer: 'CAI Malo',
    url: 'https://www.caimalo.it/wp-content/uploads/2025/12/2026_libretto-CAI.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-motta-di-livenza-9220051',
    organizer: 'CAI Motta Di Livenza',
    url: 'https://www.caimotta.it/wp-content/uploads/2026/01/escursioni-2026-calendario-e-relazioni.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-oderzo-9220052',
    organizer: 'CAI Oderzo',
    url: 'https://www.caioderzo.it/public/pdf/Librettocai2026_web.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-pedemontana-grappa-9120023',
    organizer: 'CAI Pedemontana Grappa',
    url: 'https://www.caifeltre.it/wp-content/uploads/2025/11/Annuario-CAI-Feltre-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-ponte-piave-salgareda-9220058',
    organizer: 'CAI Ponte Piave Salgareda',
    url: 'https://caipontesalgareda.it/wp-content/uploads/2025/12/Libretto_2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-s-bonifacio-9220060',
    organizer: 'CAI S.bonifacio',
    url: 'https://01baa50c-7b76-4f2f-86bb-e894771d9808.filesusr.com/ugd/fe6011_4ae5310122014e7586c720684b6ffbe7.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-s-pietro-in-cariano-9220059',
    organizer: 'CAI S.pietro In Cariano',
    url: 'https://www.caivalpolicella.it/wp-content/uploads/2025/11/CAI-San-Pietro-programma-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-spresiano-9220056',
    organizer: 'CAI Spresiano',
    url: 'http://www.cai-spresiano.it/escursioni26/prgm_short2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-tregnago-9220061',
    organizer: 'CAI Tregnago',
    url: 'https://www.caitregnago.it/wp-content/uploads/2026/01/2026-Programma-SOCIAL-.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-valdagno-9220012',
    organizer: 'CAI Valdagno',
    url: 'https://www.caivaldagno.it/images/DOC-CAI/CAI%20VALDAGNO%20calendario%202026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-verona-9220003',
    organizer: 'CAI Verona',
    url: 'https://www.caiverona.it/wp-content/uploads/2025/12/libretto-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-vigo-di-cadore-9220047',
    organizer: 'CAI Vigo Di Cadore',
    url: 'https://www.caivigodicadore.it/wp-content/uploads/2026/03/Escursioni-CAI-Estate-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-pieve-di-soligo-9220054',
    organizer: 'CAI Pieve Di Soligo',
    url: 'https://www.caipievedisoligo.it/index.php/eventi/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-recoaro-terme-9220045',
    organizer: 'CAI Recoaro Terme',
    url: 'https://www.cairecoaroterme.it/events/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
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
const campaniaOverrideIds = new Set(CAMPANIA_SOURCES.map(s => s.id));
const valleDaostaOverrideIds = new Set(VALLE_DAOSTA_SOURCES.map(s => s.id));
const venetoOverrideIds = new Set(VENETO_SOURCES.map(s => s.id));
const overrideIds = new Set([
  ...lazioOverrideIds,
  ...abruzzoOverrideIds,
  ...calabriaOverrideIds,
  ...sardegnaOverrideIds,
  ...campaniaOverrideIds,
  ...valleDaostaOverrideIds,
  ...venetoOverrideIds
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
  ...CAMPANIA_SOURCES.map(source => mergeOverrideSource(source, {
    defaultRegion: 'Campania',
    lookup: (id) => registryById.get(id)
  })),
  ...VALLE_DAOSTA_SOURCES.map(source => mergeOverrideSource(source, {
    defaultRegion: "Valle d'Aosta",
    lookup: (id) => registryById.get(id)
  })),
  ...VENETO_SOURCES.map(source => mergeOverrideSource(source, {
    defaultRegion: 'Veneto',
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
  CAMPANIA_SOURCES,
  VALLE_DAOSTA_SOURCES,
  VENETO_SOURCES,
  NATIONAL_REGISTRY,
  enabledSources,
  findSource,
  isCheerioSource,
  sourceMeta
};
