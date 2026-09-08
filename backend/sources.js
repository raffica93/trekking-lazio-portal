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


// Friuli-Venezia Giulia overrides win over registry discover stubs (same precedence as ABRUZZO).
// Hub ASCA shares Tolmezzo PDF; hub SAF Udine shares Programma 2026; hub SAG-AXXXO shares joint calendar.
// Buja keeps HTTP URL (caigemona.it). Out of scope: HTML-only, website-only, scrapes.
const FRIULI_SOURCES = [
  // --- Hub ASCA (shared PDF: caitolmezzo.it/escursioni.pdf) ---
  {
    id: 'cai-tolmezzo-9222002',
    organizer: 'CAI Tolmezzo',
    url: 'https://caitolmezzo.it/escursioni.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-forni-di-sopra-9222021',
    organizer: 'CAI Forni Di Sopra',
    url: 'https://caitolmezzo.it/escursioni.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-ravascletto-9222020',
    organizer: 'CAI Ravascletto',
    url: 'https://caitolmezzo.it/escursioni.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-sappada-9220033',
    organizer: 'CAI Sappada',
    url: 'https://caitolmezzo.it/escursioni.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-forni-avoltri-9222022',
    organizer: 'CAI Forni Avoltri',
    url: 'https://caitolmezzo.it/escursioni.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-moggio-udinese-9222013',
    organizer: 'CAI Moggio Udinese',
    url: 'https://caitolmezzo.it/escursioni.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-tarvisio-9222010',
    organizer: 'CAI Tarvisio',
    url: 'https://caitolmezzo.it/escursioni.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  // --- Hub SAF Udine (shared PDF: CAI-sez-UDINE-Programma-2026.pdf) ---
  {
    id: 'cai-s-a-f-udine-9222003',
    organizer: 'CAI S.a.f.- Udine',
    url: 'https://www.alpinafriulana.it/wp-content/uploads/2025/12/CAI-sez-UDINE-Programma-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-artegna-9122009',
    organizer: 'CAI Artegna',
    url: 'https://www.alpinafriulana.it/wp-content/uploads/2025/12/CAI-sez-UDINE-Programma-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-palmanova-9122020',
    organizer: 'CAI Palmanova',
    url: 'https://www.alpinafriulana.it/wp-content/uploads/2025/12/CAI-sez-UDINE-Programma-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-pasian-di-prato-9122012',
    organizer: 'CAI Pasian Di Prato',
    url: 'https://www.alpinafriulana.it/wp-content/uploads/2025/12/CAI-sez-UDINE-Programma-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-s-daniele-del-friuli-9122014',
    organizer: 'CAI S.daniele Del Friuli',
    url: 'https://www.alpinafriulana.it/wp-content/uploads/2025/12/CAI-sez-UDINE-Programma-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-tarcento-cai-udine-9122015',
    organizer: 'CAI Tarcento Cai Udine',
    url: 'https://www.alpinafriulana.it/wp-content/uploads/2025/12/CAI-sez-UDINE-Programma-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  // --- Hub SAG-AXXXO (shared PDF: SAG-AXXXO-CALENDARIO-2026-giu.pdf) ---
  {
    id: 'cai-s-a-g-trieste-9222001',
    organizer: 'CAI S.a.g.- Trieste',
    url: 'https://caisag.ts.it/wp-content/uploads/2026/06/SAG-AXXXO-CALENDARIO-2026-giu.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-xxx-ottobre-9222011',
    organizer: 'CAI Xxx Ottobre',
    url: 'https://caisag.ts.it/wp-content/uploads/2026/06/SAG-AXXXO-CALENDARIO-2026-giu.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  // --- Sezionali (own PDF) ---
  {
    id: 'cai-cervignano-del-friuli-9222026',
    organizer: 'CAI Cervignano Del Friuli',
    url: 'https://www.caicervignano.it/wp-content/uploads/2026/01/Programma_C_2026_rev_3_rid.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-codroipo-9222027',
    organizer: 'CAI Codroipo',
    url: 'https://www.caicodroipo.it/res/download/pdf/346_it.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-maniago-9222008',
    organizer: 'CAI Maniago',
    url: 'https://organizzazione.cai.it/sez-maniago/wp-content/uploads/sites/28/2026/01/Guida-CAI-2026-compresso.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-monfalcone-9222012',
    organizer: 'CAI Monfalcone',
    url: 'https://www.caimonfalcone.org/uploads/Main/2026_pieghevole_v7.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-pordenone-9222006',
    organizer: 'CAI Pordenone',
    url: 'https://www.cai.pordenone.it/documenti/escursionismo/_2026/programma-escursioni-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-s-vito-al-tagliamento-9222019',
    organizer: 'CAI S.vito Al Tagliamento',
    url: 'https://www.caisanvito.it/wp-content/uploads/2025/12/CALENDARIO-GITE-CAI-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-sacile-9222024',
    organizer: 'CAI Sacile',
    url: 'https://organizzazione.cai.it/sez-sacile/wp-content/uploads/sites/145/2026/01/Libretto-escursioni-sociali-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-tricesimo-9222029',
    organizer: 'CAI Tricesimo',
    url: 'https://organizzazione.cai.it/sez-tricesimo/wp-content/uploads/sites/144/2025/12/Calendario-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-gorizia-9222005',
    organizer: 'CAI Gorizia',
    url: 'https://www.caigorizia.it/wp-content/themes/cai/programmi_cai/programma_2026_web.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-pontebba-9222023',
    organizer: 'CAI Pontebba',
    url: 'https://www.caipontebba.it/gite/asca_2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-cividale-del-friuli-9222014',
    organizer: 'CAI Cividale Del Friuli',
    url: 'https://www.caicividale.org/s/CAI-Cividale-programma-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-buja-9122003',
    organizer: 'CAI Buja',
    url: 'http://www.caigemona.it/dati/images/pdf/gjoldi_de_mont/GjoldileMontdeVierte_2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  }
];


// The generated directory is the complete list, including sections without a
// usable public calendar. Each enabled row is its own configurable adapter.
// Piemonte overrides win over registry discover stubs (same precedence as FRIULI/VENETO).
// Hubs: Est Monterosa (shared PDF), Alto Canavese, Cumiana-Pinerolo-Valgermanasca,
// Varallo shared ICS, Bardonecchia (+Sauze/Avigliana), Chivasso parent.
// Out of scope: html/facebook/missing, scrapes.
const PIEMONTE_SOURCES = [
  // --- Hub Est Monterosa (shared pdf: estmonterosa-programma-escursioni-2026.pdf) ---
  {
    id: 'cai-borgomanero-9212025',
    organizer: 'CAI Borgomanero',
    url: 'https://www.estmonterosa.it/images/documenti/estmonterosa-programma-escursioni-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-domodossola-9212003',
    organizer: 'CAI Domodossola',
    url: 'https://www.estmonterosa.it/images/documenti/estmonterosa-programma-escursioni-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-formazza-9212070',
    organizer: 'CAI Formazza',
    url: 'https://www.estmonterosa.it/images/documenti/estmonterosa-programma-escursioni-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-macugnaga-9212050',
    organizer: 'CAI Macugnaga',
    url: 'https://www.estmonterosa.it/images/documenti/estmonterosa-programma-escursioni-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-novara-9212014',
    organizer: 'CAI Novara',
    url: 'https://www.estmonterosa.it/images/documenti/estmonterosa-programma-escursioni-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-omegna-9212020',
    organizer: 'CAI Omegna',
    url: 'https://www.estmonterosa.it/images/documenti/estmonterosa-programma-escursioni-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-pallanza-9212027',
    organizer: 'CAI Pallanza',
    url: 'https://www.estmonterosa.it/images/documenti/estmonterosa-programma-escursioni-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-piedimulera-9212028',
    organizer: 'CAI Piedimulera',
    url: 'https://www.estmonterosa.it/images/documenti/estmonterosa-programma-escursioni-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-valle-vigezzo-9212056',
    organizer: 'CAI Valle Vigezzo',
    url: 'https://www.estmonterosa.it/images/documenti/estmonterosa-programma-escursioni-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-varzo-9212055',
    organizer: 'CAI Varzo',
    url: 'https://www.estmonterosa.it/images/documenti/estmonterosa-programma-escursioni-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-verbano-verbania-9212007',
    organizer: 'CAI Verbano-Verbania',
    url: 'https://www.estmonterosa.it/images/documenti/estmonterosa-programma-escursioni-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  // --- Hub Alto Canavese (shared pdf: Annuario-gite-CAI-Alto-Canavese-2026.pdf) ---
  {
    id: 'cai-cuorgne-9212072',
    organizer: "CAI Cuorgne'",
    url: 'https://cairivarolo.it/wp-content/uploads/2025/12/Annuario-gite-CAI-Alto-Canavese-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-forno-canavese-9212067',
    organizer: 'CAI Forno Canavese',
    url: 'https://cairivarolo.it/wp-content/uploads/2025/12/Annuario-gite-CAI-Alto-Canavese-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-rivarolo-canavese-9212041',
    organizer: 'CAI Rivarolo Canavese',
    url: 'https://cairivarolo.it/wp-content/uploads/2025/12/Annuario-gite-CAI-Alto-Canavese-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-sparone-9112033',
    organizer: 'CAI Sparone',
    url: 'https://cairivarolo.it/wp-content/uploads/2025/12/Annuario-gite-CAI-Alto-Canavese-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  // --- Hub Cumiana-Pinerolo-Valgermanasca (shared pdf: Programma-gite-con-descrizioni-.pdf) ---
  {
    id: 'cai-cumiana-9212060',
    organizer: 'CAI Cumiana',
    url: 'https://www.caipinerolo.it/wp/wp-content/uploads/2025/11/Programma-gite-con-descrizioni-.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-pinerolo-9212009',
    organizer: 'CAI Pinerolo',
    url: 'https://www.caipinerolo.it/wp/wp-content/uploads/2025/11/Programma-gite-con-descrizioni-.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-valgermanasca-9212049',
    organizer: 'CAI Valgermanasca',
    url: 'https://www.caipinerolo.it/wp/wp-content/uploads/2025/11/Programma-gite-con-descrizioni-.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  // --- Hub Varallo / caivarallo.com (shared ics: ?ical=1) ---
  {
    id: 'cai-alagna-9112025',
    organizer: 'CAI Alagna',
    url: 'https://www.caivarallo.com/eventi-attivita-cai/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-borgosesia-9112026',
    organizer: 'CAI Borgosesia',
    url: 'https://www.caivarallo.com/eventi-attivita-cai/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-ghemme-9112027',
    organizer: 'CAI Ghemme',
    url: 'https://www.caivarallo.com/eventi-attivita-cai/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-grignasco-9112028',
    organizer: 'CAI Grignasco',
    url: 'https://www.caivarallo.com/eventi-attivita-cai/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-romagnano-9112029',
    organizer: 'CAI Romagnano',
    url: 'https://www.caivarallo.com/eventi-attivita-cai/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-scopello-9112030',
    organizer: 'CAI Scopello',
    url: 'https://www.caivarallo.com/eventi-attivita-cai/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-varallo-sesia-9212002',
    organizer: 'CAI Varallo Sesia',
    url: 'https://www.caivarallo.com/eventi-attivita-cai/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  // --- Hub Bardonecchia (+Sauze/Avigliana) (shared pdf: CAI_Bardonecchia-PROGRAMMA_2026-V0.pdf) ---
  {
    id: 'cai-avigliana-9112002',
    organizer: 'CAI Avigliana',
    url: 'https://www.caibardonecchia.it/wp-content/uploads/2025/10/CAI_Bardonecchia-PROGRAMMA_2026-V0.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-bardonecchia-9212052',
    organizer: 'CAI Bardonecchia',
    url: 'https://www.caibardonecchia.it/wp-content/uploads/2025/10/CAI_Bardonecchia-PROGRAMMA_2026-V0.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-sauze-d-oulx-9112054',
    organizer: "CAI Sauze D'oulx",
    url: 'https://www.caibardonecchia.it/wp-content/uploads/2025/10/CAI_Bardonecchia-PROGRAMMA_2026-V0.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  // --- Hub Chivasso parent (shared pdf: Trekking_sezionali_2026.pdf) ---
  {
    id: 'cai-chivasso-9212013',
    organizer: 'CAI Chivasso',
    url: 'https://www.caichivasso.it/media/news/attachment/Trekking_sezionali_2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-foglizzo-9112039',
    organizer: 'CAI Foglizzo',
    url: 'https://www.caichivasso.it/media/news/attachment/Trekking_sezionali_2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-saluggia-9112009',
    organizer: 'CAI Saluggia',
    url: 'https://www.caichivasso.it/media/news/attachment/Trekking_sezionali_2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  // --- Sezionali PDF ---
  {
    id: 'cai-acqui-terme-9212036',
    organizer: 'CAI Acqui Terme',
    url: 'https://www.caiacquiterme.it/wp-content/uploads/2025/11/programma-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-ala-di-stura-9212076',
    organizer: 'CAI Ala Di Stura',
    url: 'https://www.caialadistura.it/docs/gite/2026/CAI_Ala_di_Stura-Programma_2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-alba-9212064',
    organizer: 'CAI Alba',
    url: 'https://organizzazione.cai.it/sez-alba/wp-content/uploads/sites/160/2025/12/Programma-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-alessandria-9212017',
    organizer: 'CAI Alessandria',
    url: 'http://www.caialessandria.it/wp-content/uploads/2025/12/Cai-Programma-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-almese-9212061',
    organizer: 'CAI Almese',
    url: 'https://www.caialmese.it/modules/tinyevent/Attivita_26.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-baveno-9212032',
    organizer: 'CAI Baveno',
    url: 'https://www.caibaveno.it/images/2026/programma-escursioni-cai-baveno-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-biella-9212005',
    organizer: 'CAI Biella',
    url: 'https://www.caibiella.it/wp-content/uploads/2025/11/2026-programma-GE.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-bussoleno-9212023',
    organizer: 'CAI Bussoleno',
    url: 'https://cai-bussoleno.it/images/Gite_2026/Gite_2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-casale-monferrato-9212015',
    organizer: 'CAI Casale Monferrato',
    url: 'https://www.caicasalemonferrato.it/files/PieghevoleCAI_2026-compresso.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-cervasca-9212081',
    organizer: 'CAI Cervasca',
    url: 'https://www.caicervasca.it/images/PDF/Opuscolo_gite/Depliant_2026_Rev00.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-chieri-9212084',
    organizer: 'CAI Chieri',
    url: 'https://www.caichieri.it/public/file/programma-escursionismo-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-fossano-9212034',
    organizer: 'CAI Fossano',
    url: 'https://www.caifossano.it/documenti/2026_CAI-Fossano-Attivita.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-gozzano-9212037',
    organizer: 'CAI Gozzano',
    url: 'https://www.caigozzano.it/media/attachments/2025/12/29/definitivo-attivita-escursioni-2026-pag-2.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-gravellona-toce-9212035',
    organizer: 'CAI Gravellona Toce',
    url: 'https://www.caigravellona.it/wp-content/uploads/2025/12/programma-completo-2.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-novi-ligure-9212054',
    organizer: 'CAI Novi Ligure',
    url: 'https://lnx.cainoviligure.it/wp/wp-content/uploads/2026/01/260108-Programma-Pieghevole-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-ovada-9212068',
    organizer: 'CAI Ovada',
    url: 'https://www.caiovada.it/wp-content/uploads/2025/12/CALENDARIO-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-peveragno-9212073',
    organizer: 'CAI Peveragno',
    url: 'https://www.caipeveragno.it/images/immagini%20link/pieghevole%20Cai%202026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-pinasca-9212062',
    organizer: 'CAI Pinasca',
    url: 'https://www.caipinasca.it/images/Calendario/PDF/CalendarioGite2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-susa-9212004',
    organizer: 'CAI Susa',
    url: 'https://www.caisusa.it/joomla/images/Programmi_gite/CAI-SUSA-programma_2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-uget-valpellice-torre-pellice-9212021',
    organizer: 'CAI Uget Valpellice - Torre Pellice',
    url: 'https://www.caivalpellice.it/_files/ugd/27b82e_e6545f707eca4f7fa8d757f207c664b5.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-venaria-reale-9212042',
    organizer: 'CAI Venaria Reale',
    url: 'https://www.caivenaria.it/wp-content/uploads/2026/01/Calendario-CAI-2026-PAG-Sing.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-vercelli-9212016',
    organizer: 'CAI Vercelli',
    url: 'https://www.caivercelli.it/public/escursioni/programmi/escursioni-2026-cai_vercelli.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-volpiano-9212053',
    organizer: 'CAI Volpiano',
    url: 'https://organizzazione.cai.it/sez-volpiano/wp-content/uploads/sites/153/2026/03/2026_calendario_CAI_Volpiano.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  // --- Sezionali ICS ---
  {
    id: 'cai-ceva-9212058',
    organizer: 'CAI Ceva',
    url: 'https://organizzazione.cai.it/sez-ceva/eventi/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-ivrea-9212008',
    organizer: 'CAI Ivrea',
    url: 'https://www.caiivrea.it/events/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-pianezza-9212066',
    organizer: 'CAI Pianezza',
    url: 'https://caipianezza.it/eventi/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-pino-torinese-9212078',
    organizer: 'CAI Pino Torinese',
    url: 'https://www.caipinotorinese.it/eventi/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-tortona-9212040',
    organizer: 'CAI Tortona',
    url: 'https://www.caitortona.net/calendario/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-val-della-torre-9212065',
    organizer: 'CAI Val Della Torre',
    url: 'https://organizzazione.cai.it/sez-val-della-torre/eventi/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-valenza-9212057',
    organizer: 'CAI Valenza',
    url: 'https://organizzazione.cai.it/sez-valenza/eventi/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-villadossola-9212022',
    organizer: 'CAI Villadossola',
    url: 'https://organizzazione.cai.it/sez-villadossola/eventi/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  }
];


// Lombardia overrides win over registry discover stubs (same precedence as PIEMONTE/FRIULI).
// Hubs: Brescia PDF, Valtellinese-Sondrio PDF (+ Teglio sibling), Vimercate, Merate, Mariano Comense,
// Meda/Lentate, Mantova ICS, Gallarate ICS, Premana ICS.
// Out of scope: html/facebook/missing, scrapes.
const LOMBARDIA_SOURCES = [
  // --- Hub Brescia (shared pdf: Programma-Escursionismo-2026.pdf) ---
  {
    id: 'cai-bagolino-9116018',
    organizer: 'CAI Bagolino',
    url: 'https://organizzazione.cai.it/sez-brescia/wp-content/uploads/sites/7/2026/02/Programma-Escursionismo-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-brescia-9216005',
    organizer: 'CAI Brescia',
    url: 'https://organizzazione.cai.it/sez-brescia/wp-content/uploads/sites/7/2026/02/Programma-Escursionismo-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-cidneo-o-m-9116019',
    organizer: 'CAI Cidneo O.m.',
    url: 'https://organizzazione.cai.it/sez-brescia/wp-content/uploads/sites/7/2026/02/Programma-Escursionismo-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-collebeato-9116110',
    organizer: 'CAI Collebeato',
    url: 'https://organizzazione.cai.it/sez-brescia/wp-content/uploads/sites/7/2026/02/Programma-Escursionismo-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-iseo-diventata-sezione-9116023',
    organizer: 'CAI Iseo (diventata Sezione)',
    url: 'https://organizzazione.cai.it/sez-brescia/wp-content/uploads/sites/7/2026/02/Programma-Escursionismo-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-manerbio-9116106',
    organizer: 'CAI Manerbio',
    url: 'https://organizzazione.cai.it/sez-brescia/wp-content/uploads/sites/7/2026/02/Programma-Escursionismo-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-marone-9116024',
    organizer: 'CAI Marone',
    url: 'https://organizzazione.cai.it/sez-brescia/wp-content/uploads/sites/7/2026/02/Programma-Escursionismo-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-nave-9116093',
    organizer: 'CAI Nave',
    url: 'https://organizzazione.cai.it/sez-brescia/wp-content/uploads/sites/7/2026/02/Programma-Escursionismo-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-odolo-9116025',
    organizer: 'CAI Odolo',
    url: 'https://organizzazione.cai.it/sez-brescia/wp-content/uploads/sites/7/2026/02/Programma-Escursionismo-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-provaglio-d-iseo-9116123',
    organizer: 'CAI Provaglio D\'iseo',
    url: 'https://organizzazione.cai.it/sez-brescia/wp-content/uploads/sites/7/2026/02/Programma-Escursionismo-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-santicolo-9116029',
    organizer: 'CAI Santicolo',
    url: 'https://organizzazione.cai.it/sez-brescia/wp-content/uploads/sites/7/2026/02/Programma-Escursionismo-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },

  // --- Hub Valtellinese-Sondrio (shared pdf: 2026_Programma_gite.pdf) ---
  {
    id: 'cai-berbenno-9116142',
    organizer: 'CAI Berbenno',
    url: 'https://www.caivaltellinese.it/wp/wp-content/uploads/2026/01/2026_Programma_gite.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-ponte-in-valtellina-9116109',
    organizer: 'CAI Ponte In Valtellina',
    url: 'https://www.caivaltellinese.it/wp/wp-content/uploads/2026/01/2026_Programma_gite.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-tirano-9116089',
    organizer: 'CAI Tirano',
    url: 'https://www.caivaltellinese.it/wp/wp-content/uploads/2026/01/2026_Programma_gite.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-valdidentro-9116140',
    organizer: 'CAI Valdidentro',
    url: 'https://www.caivaltellinese.it/wp/wp-content/uploads/2026/01/2026_Programma_gite.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-valtellinese-sondrio-9216001',
    organizer: 'CAI Valtellinese-Sondrio',
    url: 'https://www.caivaltellinese.it/wp/wp-content/uploads/2026/01/2026_Programma_gite.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },

  // --- Hub Teglio sibling PDF (2026_Programma_gite_CAI_TEGLIO.pdf) ---
  {
    id: 'cai-teglio-9216158',
    organizer: 'CAI Teglio',
    url: 'https://www.caivaltellinese.it/wp/wp-content/uploads/2026/01/2026_Programma_gite_CAI_TEGLIO.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-teglio-diventata-sezione-9116143',
    organizer: 'CAI Teglio (diventata Sezione)',
    url: 'https://www.caivaltellinese.it/wp/wp-content/uploads/2026/01/2026_Programma_gite_CAI_TEGLIO.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },

  // --- Hub Vimercate (shared pdf: Programma-Escursionismo-2026-x-stampa-D-.pdf) ---
  {
    id: 'cai-arcore-9116092',
    organizer: 'CAI Arcore',
    url: 'https://www.caivimercate.it/wp-content/uploads/2026/03/Programma-Escursionismo-2026-x-stampa-D-.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-burago-molgora-9116134',
    organizer: 'CAI Burago Molgora',
    url: 'https://www.caivimercate.it/wp-content/uploads/2026/03/Programma-Escursionismo-2026-x-stampa-D-.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-cavenago-brianza-9116136',
    organizer: 'CAI Cavenago Brianza',
    url: 'https://www.caivimercate.it/wp-content/uploads/2026/03/Programma-Escursionismo-2026-x-stampa-D-.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-sulbiate-9116121',
    organizer: 'CAI Sulbiate',
    url: 'https://www.caivimercate.it/wp-content/uploads/2026/03/Programma-Escursionismo-2026-x-stampa-D-.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-vimercate-9216048',
    organizer: 'CAI Vimercate',
    url: 'https://www.caivimercate.it/wp-content/uploads/2026/03/Programma-Escursionismo-2026-x-stampa-D-.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },

  // --- Hub Merate (shared pdf: programma-attivita-2026.pdf) ---
  {
    id: 'cai-merate-9216023',
    organizer: 'CAI Merate',
    url: 'https://www.caimerate.it/wp/wp-content/uploads/programma-attivita-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-usmate-9116064',
    organizer: 'CAI Usmate',
    url: 'https://www.caimerate.it/wp/wp-content/uploads/programma-attivita-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },

  // --- Hub Mariano Comense (shared pdf: LibretttoCAI-2026.pdf) ---
  {
    id: 'cai-arosio-9116060',
    organizer: 'CAI Arosio',
    url: 'http://www.caimariano.it/wp-content/uploads/2025/12/LibretttoCAI-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-mariano-comense-9216077',
    organizer: 'CAI Mariano Comense',
    url: 'http://www.caimariano.it/wp-content/uploads/2025/12/LibretttoCAI-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },

  // --- Hub Meda / Lentate (shared pdf: IDS26_Meda_LOCANDINA_.pdf) ---
  {
    id: 'cai-lentate-sul-seveso-9116061',
    organizer: 'CAI Lentate Sul Seveso',
    url: 'https://www.comune.meda.mb.it/export/sites/default/.galleries/documenti/eventi-news/IDS26_Meda_LOCANDINA_.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-meda-9216042',
    organizer: 'CAI Meda',
    url: 'https://www.comune.meda.mb.it/export/sites/default/.galleries/documenti/eventi-news/IDS26_Meda_LOCANDINA_.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },

  // --- Hub Mantova (shared ics: sez-mantova/eventi/?ical=1) ---
  {
    id: 'cai-mantova-9216025',
    organizer: 'CAI Mantova',
    url: 'https://organizzazione.cai.it/sez-mantova/eventi/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-quistello-9116059',
    organizer: 'CAI Quistello',
    url: 'https://organizzazione.cai.it/sez-mantova/eventi/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-suzzara-9116097',
    organizer: 'CAI Suzzara',
    url: 'https://organizzazione.cai.it/sez-mantova/eventi/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },

  // --- Hub Gallarate (shared ics: sez-gallarate/eventi/?ical=1) ---
  {
    id: 'cai-casorate-sempione-9116045',
    organizer: 'CAI Casorate Sempione',
    url: 'https://organizzazione.cai.it/sez-gallarate/eventi/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-gallarate-9216015',
    organizer: 'CAI Gallarate',
    url: 'https://organizzazione.cai.it/sez-gallarate/eventi/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },

  // --- Hub Premana (shared ics: sez-premana/eventi/?ical=1) ---
  {
    id: 'cai-esino-lario-9116099',
    organizer: 'CAI Esino Lario',
    url: 'https://organizzazione.cai.it/sez-premana/eventi/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-premana-9216089',
    organizer: 'CAI Premana',
    url: 'https://organizzazione.cai.it/sez-premana/eventi/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },

  // --- Sezionali (pdf/ics) ---
  {
    id: 'cai-albiate-9216107',
    organizer: 'CAI Albiate',
    url: 'https://organizzazione.cai.it/sez-albiate/eventi/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-arsago-seprio-9216153',
    organizer: 'CAI Arsago Seprio',
    url: 'https://www.caiarsago.it/uploads/ckeditor/attachments/92/Programma_2026_Arsago_Completo_v3.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-barlassina-9216090',
    organizer: 'CAI Barlassina',
    url: 'https://www.caibarlassina.org/uploads/9/5/4/2/95425450/locandina_gite_sociali_2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-besozzo-superiore-9216026',
    organizer: 'CAI Besozzo Superiore',
    url: 'https://organizzazione.cai.it/sez-besozzo-superiore/eventi/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-boffalora-sopra-ticino-9216114',
    organizer: 'CAI Boffalora Sopra Ticino',
    url: 'https://organizzazione.cai.it/sez-boffalora-sopra-ticino/eventi/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-borno-9216113',
    organizer: 'CAI Borno',
    url: 'https://www.caiborno.it/_files/ugd/cf96c6_184faae3a5c04a3687bb070840761b9c.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-bozzolo-9216140',
    organizer: 'CAI Bozzolo',
    url: 'https://organizzazione.cai.it/sez-bozzolo/eventi/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-brugherio-9216072',
    organizer: 'CAI Brugherio',
    url: 'https://www.caibrugherio.com/data/sites/1/documenti/programma2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-carate-brianza-9216030',
    organizer: 'CAI Carate Brianza',
    url: 'https://www.caicaratebrianza.it/phocadownload/Programmi_Tascabili/Programma%20CAI%202026%20WEB.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-caslino-d-erba-9216063',
    organizer: 'CAI Caslino D\'erba',
    url: 'https://organizzazione.cai.it/sez-caslino-derba/eventi/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-castellanza-9216036',
    organizer: 'CAI Castellanza',
    url: 'https://www.caicastellanza.it/wp-content/uploads/2026/01/cai-_programma-2026-def.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-castiglione-stiviere-9216096',
    organizer: 'CAI Castiglione Stiviere',
    url: 'https://www.caicastiglione.it/events/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-cedegolo-9216062',
    organizer: 'CAI Cedegolo',
    url: 'https://organizzazione.cai.it/sez-cedegolo/eventi/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-cermenate-9216116',
    organizer: 'CAI Cermenate',
    url: 'https://organizzazione.cai.it/sez-cermenate/eventi/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-cernusco-sul-naviglio-9216051',
    organizer: 'CAI Cernusco Sul Naviglio',
    url: 'https://organizzazione.cai.it/sez-cernusco-sul-naviglio/wp-content/uploads/sites/19/2025/12/Locandina-programma-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-chiari-9216052',
    organizer: 'CAI Chiari',
    url: 'https://www.caichiari.it/images/documenti/2026/2026_libretto.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-chiavenna-9216018',
    organizer: 'CAI Chiavenna',
    url: 'https://www.caichiavenna.it/wp-content/uploads/2026/04/programma_estivo_2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-coccaglio-9216139',
    organizer: 'CAI Coccaglio',
    url: 'http://www.cai-coccaglio.it/files/Programma-2026-completo.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-codogno-9216071',
    organizer: 'CAI Codogno',
    url: 'https://www.caicodogno.it/media/137807/a4-programma-2026-one-page.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-colico-9216123',
    organizer: 'CAI Colico',
    url: 'https://www.caicolico.it/_files/ugd/f57be4_a702a4a3971c4b099eefeec536ce4a42.pdf?index=true',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-cornaredo-9216149',
    organizer: 'CAI Cornaredo',
    url: 'https://organizzazione.cai.it/sez-cornaredo/eventi/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-corsico-9216115',
    organizer: 'CAI Corsico',
    url: 'https://caicorsico.it/eventi/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-crema-9216027',
    organizer: 'CAI Crema',
    url: 'https://caicrema.it/wp-content/uploads/2026/03/Pieghevole-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-desenzano-9216136',
    organizer: 'CAI Desenzano',
    url: 'https://organizzazione.cai.it/sez-desenzano/eventi/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-dongo-9216131',
    organizer: 'CAI Dongo',
    url: 'http://www.caidongo.it/wp-content/uploads/2026/02/Calendario-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-gazzada-schianno-9216148',
    organizer: 'CAI Gazzada Schianno',
    url: 'https://www.caigazzadaschianno.it/images/dettaglio-escursioni/2026escursioni/Calendario-escursioni26.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-germignaga-9216031',
    organizer: 'CAI Germignaga',
    url: 'https://www.caigermignaga.it/wp-content/uploads/2026/07/PROGRAMMA-SENIOR-AGOSTO-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-inveruno-9216128',
    organizer: 'CAI Inveruno',
    url: 'https://www.caiinveruno.it/doc/2026/Locandina%20programma%20CAI%20INVERUNO%202026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-iseo-9216157',
    organizer: 'CAI Iseo',
    url: 'https://organizzazione.cai.it/sez-iseo/eventi/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-livigno-9216120',
    organizer: 'CAI Livigno',
    url: 'https://organizzazione.cai.it/sez-livigno/eventi/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-malnate-9216067',
    organizer: 'CAI Malnate',
    url: 'https://caimalnate.it/wp-content/uploads/2026/03/calendario-gite-2026-CAI-Malnate-approvato-V2.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-menaggio-9216060',
    organizer: 'CAI Menaggio',
    url: 'https://organizzazione.cai.it/sez-menaggio/eventi/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-nerviano-9216100',
    organizer: 'CAI Nerviano',
    url: 'https://www.cainerviano.it/images/CAI/Documents/2026/2026_Varie/2025_11_21_Programma_CAI_2026_Stampa_013.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-paderno-dugnano-9216057',
    organizer: 'CAI Paderno Dugnano',
    url: 'https://www.caipadernodugnano.it/events/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-parabiago-9216138',
    organizer: 'CAI Parabiago',
    url: 'https://www.caiparabiago.it/wp-content/uploads/2025/12/Programma-CAI-2026-Web-2.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-pavia-9216012',
    organizer: 'CAI Pavia',
    url: 'https://www.caipavia.it/doc/2026/CaiPV2026-Riferimenti.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-rho-9216021',
    organizer: 'CAI Rho',
    url: 'https://organizzazione.cai.it/sez-rho/eventi/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-romano-di-lombardia-9216087',
    organizer: 'CAI Romano Di Lombardia',
    url: 'https://organizzazione.cai.it/sez-romano-di-lombardia/eventi/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-rovagnate-9216068',
    organizer: 'CAI Rovagnate',
    url: 'https://www.cairovagnate.it/wp-content/uploads/2026/02/Calendario-26-A3-pdf_compressed-1.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-s-e-m-9216028',
    organizer: 'CAI S.e.m.',
    url: 'https://www.caisem.org/sezione/gitesociali/pdf/GiteSEM2026.pdf?ed1601',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-salo-9216076',
    organizer: 'CAI Salo\'',
    url: 'https://www.caisalo.it/wp-content/uploads/Libretto_CAI_2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-sesto-calende-9216044',
    organizer: 'CAI Sesto Calende',
    url: 'https://caisestocalende.it/wp-content/uploads/2026/01/Libretto-Programma-2026-CAI-SESTO-CALENDE.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-sesto-s-giovanni-9216020',
    organizer: 'CAI Sesto S.giovanni',
    url: 'https://www.caisestosg.it/eventi/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-somma-lombardo-9216065',
    organizer: 'CAI Somma Lombardo',
    url: 'https://caisomma.it/wp-content/uploads/pdf/Escursioni/2026/SIEL_Programma%20Escursionistico%202026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-valle-intelvi-9216130',
    organizer: 'CAI Valle Intelvi',
    url: 'https://organizzazione.cai.it/sez-valle-intelvi/eventi/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-valmadrera-9216081',
    organizer: 'CAI Valmadrera',
    url: 'https://organizzazione.cai.it/sez-valmadrera/wp-content/uploads/sites/56/2026/03/Calendario-attivita-2026_rev.04_16-03-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-valmalenco-9216112',
    organizer: 'CAI Valmalenco',
    url: 'https://www.caivalmalenco.it/Sites/407/WebExplorer/CAI/Attivita/Programmi/programmaValmalenco2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-varese-9216009',
    organizer: 'CAI Varese',
    url: 'https://www.caivarese.it/eventi/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-veduggio-9216147',
    organizer: 'CAI Veduggio',
    url: 'https://organizzazione.cai.it/sez-veduggio/eventi/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-vigevano-9216013',
    organizer: 'CAI Vigevano',
    url: 'https://www.caivigevano.it/wp-content/uploads/2025/12/Libretto_26-1.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-vimodrone-9216151',
    organizer: 'CAI Vimodrone',
    url: 'https://www.caivimodrone.it/deposito/File/2026/CaiVimo2026.pdf.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
];

// Trentino-Alto Adige overrides win over registry discover stubs (same precedence as LOMBARDIA/PIEMONTE).
// PDF Gemini pdf-programma for Alto Adige sezioni + SAT Trentino; ICS deterministic for SAT Cavalese.
// Keep HTTP URLs as discovered (caiegna.it, satmale.it, sattrento.it). Out of scope: html/website-only, scrapes.
const TRENTINO_SOURCES = [
  // --- Alto Adige sezioni (organizzazione.cai.it / caiegna.it PDFs) ---
  {
    id: 'cai-appiano-c-a-i-a-a-9219001',
    organizer: 'CAI Appiano C.a.i. A.a.',
    url: 'https://organizzazione.cai.it/sez-appiano-caiaa/wp-content/uploads/sites/152/2025/12/PROGRAMMA-ATTIVITA-CAI-APPIANO-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-bolzano-9219002',
    organizer: 'CAI Bolzano',
    url: 'https://organizzazione.cai.it/sez-bolzano-caiaa/wp-content/uploads/sites/6/2025/12/Attivita-Cai-2026_compressed.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-bronzolo-c-a-i-a-a-9219004',
    organizer: 'CAI Bronzolo C.a.i. A.a.',
    url: 'https://organizzazione.cai.it/sez-bronzolo/wp-content/uploads/sites/163/2026/01/Calendario-2026-Cai-Bronzolo_Optimized-1.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-egna-c-a-i-a-a-9219007',
    organizer: 'CAI Egna C.a.i. A.a.',
    url: 'http://www.caiegna.it/wp-content/uploads/Programma-2026_2_compressed.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  // --- SAT Trentino PDF sezionali ---
  {
    id: 'cai-s-a-t-ledrense-9118033',
    organizer: 'S.a.t. Ledrense',
    url: 'https://www.satledrense.it/wp-content/uploads/2026/02/Attivita-SAT-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-s-a-t-male-9118036',
    organizer: "S.a.t. Male'",
    url: 'http://www.satmale.it/wp-content/uploads/2026/02/Sat-di-Male-programma-attivita-2026.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-s-a-t-mori-9118041',
    organizer: 'S.a.t. Mori',
    url: 'https://www.sat-mori.it/app/download/15433973123/Sat+Mori+2026_Libretto_v3_Optimized3.pdf?t=1785509041',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-s-a-t-pergine-9118043',
    organizer: 'S.a.t. Pergine',
    url: 'https://www.satpergine.it/wp-content/uploads/2026/02/SAT_Programma-2026-WEB.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-s-a-t-s-o-s-a-t-9118061',
    organizer: 'S.a.t. S.o.s.a.t.',
    url: 'https://www.sosat.it/wp-content/uploads/2026/01/SOSAT_Programma-guide-2026_WEB.pdf',
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  {
    id: 'cai-s-a-t-trento-9118068',
    organizer: 'S.a.t. Trento',
    url: "http://www.sattrento.it/PROGRAMMA%20ATTIVITA'%20SAT%20TRENTO%202026_def.pdf",
    kind: 'pdf',
    template: 'pdf-programma',
    extractor: 'gemini',
    enabled: true,
    status: 'calendar-found'
  },
  // --- SAT Cavalese ICS ---
  {
    id: 'cai-s-a-t-cavalese-9118022',
    organizer: 'S.a.t. Cavalese',
    url: 'https://www.satcavalese.it/events/?ical=1',
    kind: 'ics',
    template: 'icalendar',
    extractor: 'deterministic',
    enabled: true,
    status: 'calendar-found'
  }
];


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
const friuliOverrideIds = new Set(FRIULI_SOURCES.map(s => s.id));
const piemonteOverrideIds = new Set(PIEMONTE_SOURCES.map(s => s.id));
const lombardiaOverrideIds = new Set(LOMBARDIA_SOURCES.map(s => s.id));
const trentinoOverrideIds = new Set(TRENTINO_SOURCES.map(s => s.id));
const overrideIds = new Set([
  ...lazioOverrideIds,
  ...abruzzoOverrideIds,
  ...calabriaOverrideIds,
  ...sardegnaOverrideIds,
  ...campaniaOverrideIds,
  ...valleDaostaOverrideIds,
  ...venetoOverrideIds,
  ...friuliOverrideIds,
  ...piemonteOverrideIds,
  ...lombardiaOverrideIds,
  ...trentinoOverrideIds
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
  ...FRIULI_SOURCES.map(source => mergeOverrideSource(source, {
    defaultRegion: 'Friuli-Venezia Giulia',
    lookup: (id) => registryById.get(id)
  })),
  ...PIEMONTE_SOURCES.map(source => mergeOverrideSource(source, {
    defaultRegion: 'Piemonte',
    lookup: (id) => registryById.get(id)
  })),
  ...LOMBARDIA_SOURCES.map(source => mergeOverrideSource(source, {
    defaultRegion: 'Lombardia',
    lookup: (id) => registryById.get(id)
  })),
  ...TRENTINO_SOURCES.map(source => mergeOverrideSource(source, {
    defaultRegion: 'Trentino-Alto Adige',
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
  FRIULI_SOURCES,
  PIEMONTE_SOURCES,
  LOMBARDIA_SOURCES,
  TRENTINO_SOURCES,
  NATIONAL_REGISTRY,
  enabledSources,
  findSource,
  isCheerioSource,
  sourceMeta
};
