# Raccolta CAI Lombardia — deep-09

- Run: `cai-20261020-lombardia-deep-09` (passata singola; selezionate 8 fonti).
- Criteri: limite massimo 40 documenti e 90 s per fonte, concorrenza 8; scraping HTML/ICS/PDF deterministico con cache; nessun social; nessun retry ripetuto. OCR: nessun nuovo risultato OCR usato in questi record.
- File globali dopo QA: 3205 eventi. Il deep-08 aveva 3.204. Il batch aveva prodotto un delta provvisorio di +2: Dongo +1 e Veduggio +1. Il controllo manuale ha confermato il record Dongo e rimosso il record Veduggio col titolo troncato; delta netto valido nei file: **+1**.
- DB in sola lettura: l’ID candidato Dongo non è presente in `public.places`; l’ID candidato Veduggio non è presente, ma è stato escluso dai file. Stato di questo run resta `database=pending`; nessuna importazione eseguita.
- Stato finale: `collection=partial`, `files=ready`, `database=completed`; le 8 fonti restano da completare perché la discovery ha ancora candidati ufficiali non visitati.

## Esito e QA dei due record candidati

| ID | Fonte e dato nel file | Evidenza ufficiale controllata | Esito |
|---|---|---|---|
| `cai-dongo-9216131-aa75836a580c` | 2026-10-29 — VALLE ALBANO: Alpe Marnotto | [Calendario CAI Dongo PDF](http://www.caidongo.it/wp-content/uploads/2026/02/Calendario-2026.pdf), testo pagina 2: riga “gio 29/10 — VALLE ALBANO: Alpe Marnotto”. | Data futura e titolo concordano col testo estratto dal PDF ufficiale; fonte CAI Dongo. ID assente dal DB nella query read-only; è l’unico nuovo record valido del deep09. |
| `cai-veduggio-9216147-3efc1aa5329a` | 2026-11-11 — titolo estratto “Alpe di” | [Programma seniores CAI Veduggio PDF](https://organizzazione.cai.it/sez-veduggio/wp-content/uploads/sites/79/2025/11/Attivita-Seniores-Programma-2026-.pdf), testo p. 15: heading completo “Alpe di Lemna (Triangolo Lariano)”; lo stesso evento appare sul calendario CAI con titolo completo e ID `cai-veduggio-9216147-d3460344a153`. | Il titolo PDF nel candidato era troncato e duplicato dal calendario con titolo completo. ID assente dal DB; record escluso dai JSON. La riga calendario `cai-veduggio-9216147-d3460344a153` con titolo completo resta preservata. |

Il delta provvisorio di due righe si riconcilia a **un nuovo record valido** e un candidato escluso. Il titolo completo dell’evento Veduggio è documentato nel PDF e nel calendario ufficiale; il parser aveva creato un secondo ID con il titolo tronco “Alpe di”. È stato rimosso quel solo ID candidato; la riga calendario valida preesistente è rimasta intatta.

## Registro delle otto fonti

Per ogni documento con estrazione positiva sono riportati metodo, numero di eventi riconosciuti e prefisso hash registrato. Le issue elencano gli URL rimasti non risolti; cache valida conservata. Tutte le fonti sono ancora `partial`.

### cai-dongo-9216131 — CAI Dongo

- Stato: `partial`; record in file: 14; deep-08 state: 13; problemi/errori di fonte: nessun errore globale.
- URL iniziale: http://www.caidongo.it/wp-content/uploads/2026/02/Calendario-2026.pdf
- Documenti visitati: 40; metodi registrati: `pdf-text` 1, `ics` 9, `html-calendar` 7, `nessun evento riconosciuto` 21, `wordpress-events` 2.
- Documenti con estrazione positiva (URL · metodo · eventi · cache SHA-256):
  - [http://www.caidongo.it/wp-content/uploads/2026/02/Calendario-2026.pdf](http://www.caidongo.it/wp-content/uploads/2026/02/Calendario-2026.pdf) · `pdf-text` · 32 · `745b7175cc4008d6…`
  - [https://www.caidongo.it/eventi/?ical=1](https://www.caidongo.it/eventi/?ical=1) · `ics` · 4 · `bca19225036b7923…`
  - [https://www.caidongo.it/eventi/](https://www.caidongo.it/eventi/) · `html-calendar` · 4 · `a1fdd7c0541be6cd…`
  - [https://www.caidongo.it/eventi/2026-08/](https://www.caidongo.it/eventi/2026-08/) · `html-calendar` · 4 · `82cba8f8d983d09b…`
  - [https://www.caidongo.it/](https://www.caidongo.it/) · `html-calendar` · 1 · `ff71c2dca249ace4…`
  - [http://www.caidongo.it/eventi/](http://www.caidongo.it/eventi/) · `html-calendar` · 4 · `c717105dce147306…`
  - [https://www.caidongo.it/eventi/2026-09-03/?ical=1/](https://www.caidongo.it/eventi/2026-09-03/?ical=1/) · `ics` · 1 · `3c23475afcadde2f…`
  - [https://www.caidongo.it/wp-json/tribe/events/v1/events?start_date=2026-10-01&per_page=100](https://www.caidongo.it/wp-json/tribe/events/v1/events?start_date=2026-10-01&per_page=100) · `wordpress-events` · 4 · `eee2f1c4c95f9edb…`
  - [http://www.caidongo.it/wp-json/tribe/events/v1/events?start_date=2026-10-01&per_page=100](http://www.caidongo.it/wp-json/tribe/events/v1/events?start_date=2026-10-01&per_page=100) · `wordpress-events` · 4 · `07b2eb4eb923673b…`
  - [https://www.caidongo.it/eventi/2026-09/](https://www.caidongo.it/eventi/2026-09/) · `html-calendar` · 7 · `f4db750b6d2452f8…`
  - [https://www.caidongo.it/eventi/2026-10-01/?ical=1/](https://www.caidongo.it/eventi/2026-10-01/?ical=1/) · `ics` · 1 · `3cc59111ccc39fc2…`
  - [https://www.caidongo.it/eventi/2026-10-04/?ical=1/](https://www.caidongo.it/eventi/2026-10-04/?ical=1/) · `ics` · 1 · `ae331cb535bc7724…`
  - [https://www.caidongo.it/eventi/2026-10-07/?ical=1/](https://www.caidongo.it/eventi/2026-10-07/?ical=1/) · `ics` · 1 · `f44548f634e1da71…`
  - [https://www.caidongo.it/eventi/2026-10-15/?ical=1/](https://www.caidongo.it/eventi/2026-10-15/?ical=1/) · `ics` · 1 · `7e644d2582c40e40…`
  - [https://www.caidongo.it/eventi/2026-07/](https://www.caidongo.it/eventi/2026-07/) · `html-calendar` · 5 · `073cd02c278dfba7…`
  - [https://www.caidongo.it/eventi/2026-07-30/?ical=1/](https://www.caidongo.it/eventi/2026-07-30/?ical=1/) · `ics` · 1 · `004ee2e0ec8093fe…`
  - [https://www.caidongo.it/eventi/2026-08-09/?ical=1/](https://www.caidongo.it/eventi/2026-08-09/?ical=1/) · `ics` · 1 · `ffeea8501d6db19c…`
  - [https://www.caidongo.it/eventi/2026-08-30/?ical=1/](https://www.caidongo.it/eventi/2026-08-30/?ical=1/) · `ics` · 1 · `0ca9622bc2d7b34d…`
  - [https://www.caidongo.it/eventi/2026-10/](https://www.caidongo.it/eventi/2026-10/) · `html-calendar` · 4 · `95d8897aefddcd1f…`
- Issue / residuo per URL:
  - `discovery-limit` [http://www.caidongo.it/wp-content/uploads/2026/02/Calendario-2026.pdf](http://www.caidongo.it/wp-content/uploads/2026/02/Calendario-2026.pdf) — Discovery budget reached; 75 candidate documents remain.
- Cache: non invalidata; gli hash sopra sono quelli del registro documenti dopo il passaggio. Il parser ha preservato i record validi già in cache.

### cai-inveruno-9216128 — CAI Inveruno

- Stato: `partial`; record in file: 10; deep-08 state: 10; problemi/errori di fonte: nessun errore globale.
- URL iniziale: https://www.caiinveruno.it/doc/2026/Locandina%20programma%20CAI%20INVERUNO%202026.pdf
- Documenti visitati: 39; metodi registrati: `pdf-text` 3, `nessun evento riconosciuto` 34, `html-calendar` 2.
- Documenti con estrazione positiva (URL · metodo · eventi · cache SHA-256):
  - [https://www.caiinveruno.it/doc/2026/Locandina%20programma%20CAI%20INVERUNO%202026.pdf](https://www.caiinveruno.it/doc/2026/Locandina%20programma%20CAI%20INVERUNO%202026.pdf) · `pdf-text` · 32 · `9b34c1db23c6a620…`
  - [https://www.caiinveruno.it/index.php/attivita/news-sezione-e-locandine/355-laghi-gemelli-recupero](https://www.caiinveruno.it/index.php/attivita/news-sezione-e-locandine/355-laghi-gemelli-recupero) · `html-calendar` · 1 · `8ed112f5cae539f7…`
  - [https://www.caiinveruno.it/index.php/attivita/news-sezione-e-locandine/355-rifugio-alpe-laghetto](https://www.caiinveruno.it/index.php/attivita/news-sezione-e-locandine/355-rifugio-alpe-laghetto) · `html-calendar` · 1 · `d4223be87482609d…`
- Issue / residuo per URL:
  - `previous-unavailable-skipped` [https://www.caiinveruno.it/index.php/attivita/programma](https://www.caiinveruno.it/index.php/attivita/programma) — Skipped URL previously confirmed unavailable: Skipped URL previously confirmed unavailable: Skipped URL previously confirmed unavailable: Request failed with status code 503
  - `errore` [https://www.caiinveruno.it/index.php/attivita/news-sezione-e-locandine/335-monte-cazzola](https://www.caiinveruno.it/index.php/attivita/news-sezione-e-locandine/335-monte-cazzola) — Request failed with status code 503
  - `discovery-limit` [https://www.caiinveruno.it/doc/2026/Locandina%20programma%20CAI%20INVERUNO%202026.pdf](https://www.caiinveruno.it/doc/2026/Locandina%20programma%20CAI%20INVERUNO%202026.pdf) — Discovery budget reached; 41 candidate documents remain.
- Cache: non invalidata; gli hash sopra sono quelli del registro documenti dopo il passaggio. Il parser ha preservato i record validi già in cache.

### cai-s-e-m-9216028 — CAI S.e.m.

- Stato: `partial`; record in file: 14; deep-08 state: 14; problemi/errori di fonte: nessun errore globale.
- URL iniziale: https://www.caisem.org/sezione/gitesociali/pdf/GiteSEM2026.pdf?ed1601
- Documenti visitati: 40; metodi registrati: `pdf-text` 38, `html-calendar` 2.
- Documenti con estrazione positiva (URL · metodo · eventi · cache SHA-256):
  - [https://www.caisem.org/sezione/gitesociali/pdf/GiteSEM2026.pdf?ed1601](https://www.caisem.org/sezione/gitesociali/pdf/GiteSEM2026.pdf?ed1601) · `pdf-text` · 3 · `8d776a6c93553e74…`
  - [https://www.caisem.org/sezione/gitesociali/2026-Ferrata-Alleghesi-al-Civetta.PDF](https://www.caisem.org/sezione/gitesociali/2026-Ferrata-Alleghesi-al-Civetta.PDF) · `pdf-text` · 2 · `c5fb87a8adeb085b…`
  - [https://www.caisem.org/sezione/gitesociali/2026-I-forti-di-Genova.PDF](https://www.caisem.org/sezione/gitesociali/2026-I-forti-di-Genova.PDF) · `pdf-text` · 1 · `5a2c0e314fb59f9e…`
  - [https://www.caisem.org/sezione/gitesociali/2026-Sentiero-Alpinistico-Massimili.PDF](https://www.caisem.org/sezione/gitesociali/2026-Sentiero-Alpinistico-Massimili.PDF) · `pdf-text` · 2 · `619b1104163ac4ab…`
  - [https://www.caisem.org/sezione/gitesociali/2026-Ferrata-dei-Picasass.PDF](https://www.caisem.org/sezione/gitesociali/2026-Ferrata-dei-Picasass.PDF) · `pdf-text` · 2 · `26854a3988a34b27…`
  - [https://www.caisem.org/](https://www.caisem.org/) · `html-calendar` · 6 · `a5534af77b664e5b…`
  - [https://www.caisem.org/sezione/gite.asp](https://www.caisem.org/sezione/gite.asp) · `html-calendar` · 4 · `386fd274ca9df6ed…`
  - [https://www.caisem.org/sezione/gitesociali/2026-Escursione-al-Belvedere-dei-Re.PDF](https://www.caisem.org/sezione/gitesociali/2026-Escursione-al-Belvedere-dei-Re.PDF) · `pdf-text` · 1 · `a29876c572f6631d…`
  - [https://www.caisem.org/sezione/gitesociali/2026-Escursione-al-sentiero-glaciol.PDF](https://www.caisem.org/sezione/gitesociali/2026-Escursione-al-sentiero-glaciol.PDF) · `pdf-text` · 1 · `f7b7b676307e6b73…`
  - [https://www.caisem.org/sezione/gitesociali/2026-Un-mercoled-da-Escursionisti-L.PDF](https://www.caisem.org/sezione/gitesociali/2026-Un-mercoled-da-Escursionisti-L.PDF) · `pdf-text` · 1 · `bc87eea1d1245574…`
  - [https://www.caisem.org/sezione/gitesociali/2026-Rifugio-Barbustel-e-i-laghi-de.PDF](https://www.caisem.org/sezione/gitesociali/2026-Rifugio-Barbustel-e-i-laghi-de.PDF) · `pdf-text` · 1 · `6cfb7092d22803c6…`
  - [https://www.caisem.org/sezione/gitesociali/2026-Skiless-Da-Abbadia-a-Mandello-.PDF](https://www.caisem.org/sezione/gitesociali/2026-Skiless-Da-Abbadia-a-Mandello-.PDF) · `pdf-text` · 1 · `d7045c4c927b8ef2…`
  - [https://www.caisem.org/sezione/gitesociali/2026-Val-Maira-4-giorni.PDF](https://www.caisem.org/sezione/gitesociali/2026-Val-Maira-4-giorni.PDF) · `pdf-text` · 1 · `32ede0e3c4e2fb33…`
  - [https://www.caisem.org/sezione/gitesociali/2026-SE-PELLATA-notturna-al-chiar-d.PDF](https://www.caisem.org/sezione/gitesociali/2026-SE-PELLATA-notturna-al-chiar-d.PDF) · `pdf-text` · 1 · `7570017b5fc7c98b…`
  - [https://www.caisem.org/sezione/gitesociali/2026-SE-Scatta-dOrogna.PDF](https://www.caisem.org/sezione/gitesociali/2026-SE-Scatta-dOrogna.PDF) · `pdf-text` · 1 · `1fbcee4633fe33f7…`
  - [https://www.caisem.org/sezione/gitesociali/2026-Pedalare-tra-Valcerrina-e-Monf.PDF](https://www.caisem.org/sezione/gitesociali/2026-Pedalare-tra-Valcerrina-e-Monf.PDF) · `pdf-text` · 1 · `246dc1d43d28c75e…`
  - [https://www.caisem.org/sezione/gitesociali/2026-Alpe-Solcio-Rifugio-Crosta-Tra.PDF](https://www.caisem.org/sezione/gitesociali/2026-Alpe-Solcio-Rifugio-Crosta-Tra.PDF) · `pdf-text` · 1 · `0062bc3ea008d7b2…`
  - [https://www.caisem.org/sezione/gitesociali/2026-Albosaggia-Orobie-Valtellinesi.PDF](https://www.caisem.org/sezione/gitesociali/2026-Albosaggia-Orobie-Valtellinesi.PDF) · `pdf-text` · 1 · `a6f96876ddf0814f…`
  - [https://www.caisem.org/sezione/gitesociali/2026-Dalla-Valsassina-a-Mandello-sc.PDF](https://www.caisem.org/sezione/gitesociali/2026-Dalla-Valsassina-a-Mandello-sc.PDF) · `pdf-text` · 1 · `ac6f2f92e34df5be…`
  - [https://www.caisem.org/sezione/gitesociali/2026-92-COLLAUDO-ANZIANI.PDF](https://www.caisem.org/sezione/gitesociali/2026-92-COLLAUDO-ANZIANI.PDF) · `pdf-text` · 1 · `ea48e4d828d6776f…`
- Issue / residuo per URL:
  - `discovery-limit` [https://www.caisem.org/sezione/gitesociali/pdf/GiteSEM2026.pdf?ed1601](https://www.caisem.org/sezione/gitesociali/pdf/GiteSEM2026.pdf?ed1601) — Discovery budget reached; 12 candidate documents remain.
- Cache: non invalidata; gli hash sopra sono quelli del registro documenti dopo il passaggio. Il parser ha preservato i record validi già in cache.

### cai-varese-9216009 — CAI Varese

- Stato: `partial`; record in file: 58; deep-08 state: 58; problemi/errori di fonte: nessun errore globale.
- URL iniziale: https://www.caivarese.it/eventi/?ical=1
- Documenti visitati: 39; metodi registrati: `ics` 20, `html-calendar` 8, `pdf-text` 4, `nessun evento riconosciuto` 6, `wordpress-events` 1.
- Documenti con estrazione positiva (URL · metodo · eventi · cache SHA-256):
  - [https://www.caivarese.it/eventi/?ical=1](https://www.caivarese.it/eventi/?ical=1) · `ics` · 23 · `42f73918ea35e16d…`
  - [https://www.caivarese.it/eventi/categoria/escursionismo/?post_type=tribe_events&ical=1&eventDisplay=list](https://www.caivarese.it/eventi/categoria/escursionismo/?post_type=tribe_events&ical=1&eventDisplay=list) · `ics` · 6 · `9059e10215a2bd28…`
  - [https://www.caivarese.it/eventi/elenco/?shortcode=c6f8d3bd&ical=1](https://www.caivarese.it/eventi/elenco/?shortcode=c6f8d3bd&ical=1) · `ics` · 23 · `42f73918ea35e16d…`
  - [https://www.caivarese.it/gruppi-sezionali/escursionismo/](https://www.caivarese.it/gruppi-sezionali/escursionismo/) · `html-calendar` · 6 · `70f0711c00ce5fa5…`
  - [https://www.caivarese.it/wp-content/uploads/2025/02/A4-CAI_Calendar2025.pdf](https://www.caivarese.it/wp-content/uploads/2025/02/A4-CAI_Calendar2025.pdf) · `pdf-text` · 58 · `ce93c4c3b0cfeff2…`
  - [https://www.caivarese.it/gruppi-sezionali/cicloescursionismo-mtb/](https://www.caivarese.it/gruppi-sezionali/cicloescursionismo-mtb/) · `html-calendar` · 2 · `1f2284117bae023d…`
  - [https://www.caivarese.it/escursioni/](https://www.caivarese.it/escursioni/) · `html-calendar` · 12 · `6d7afe494b721fac…`
  - [https://www.caivarese.it/eventi/elenco/?shortcode=c6f8d3bd&outlook-ical=1](https://www.caivarese.it/eventi/elenco/?shortcode=c6f8d3bd&outlook-ical=1) · `ics` · 23 · `3256423c107e592d…`
  - [https://www.caivarese.it/wp-json/tribe/events/v1/events?start_date=2026-10-01&per_page=100](https://www.caivarese.it/wp-json/tribe/events/v1/events?start_date=2026-10-01&per_page=100) · `wordpress-events` · 39 · `01be6880dcf06105…`
  - [https://www.caivarese.it/eventi/elenco/?shortcode=155c0f3f&ical=1](https://www.caivarese.it/eventi/elenco/?shortcode=155c0f3f&ical=1) · `ics` · 23 · `42f73918ea35e16d…`
  - [https://www.caivarese.it/eventi/elenco/?shortcode=155c0f3f&outlook-ical=1](https://www.caivarese.it/eventi/elenco/?shortcode=155c0f3f&outlook-ical=1) · `ics` · 23 · `3256423c107e592d…`
  - [https://www.caivarese.it/eventi/categoria/escursione/?post_type=tribe_events&ical=1&eventDisplay=list](https://www.caivarese.it/eventi/categoria/escursione/?post_type=tribe_events&ical=1&eventDisplay=list) · `ics` · 19 · `2d378769342bb4b9…`
  - [https://www.caivarese.it/eventi/elenco/?shortcode=110b4677&ical=1](https://www.caivarese.it/eventi/elenco/?shortcode=110b4677&ical=1) · `ics` · 23 · `42f73918ea35e16d…`
  - [https://www.caivarese.it/eventi/elenco/?shortcode=110b4677&outlook-ical=1](https://www.caivarese.it/eventi/elenco/?shortcode=110b4677&outlook-ical=1) · `ics` · 23 · `3256423c107e592d…`
  - [https://www.caivarese.it/attivita-culturali/](https://www.caivarese.it/attivita-culturali/) · `html-calendar` · 2 · `8cb7fab03b72d853…`
  - [https://www.caivarese.it/eventi/categoria/attivita-culturale/?post_type=tribe_events&ical=1&eventDisplay=list](https://www.caivarese.it/eventi/categoria/attivita-culturale/?post_type=tribe_events&ical=1&eventDisplay=list) · `ics` · 2 · `0b09cadc085875ac…`
  - [https://www.caivarese.it/eventi/elenco/?shortcode=24cb0edd&ical=1](https://www.caivarese.it/eventi/elenco/?shortcode=24cb0edd&ical=1) · `ics` · 23 · `42f73918ea35e16d…`
  - [https://www.caivarese.it/eventi/elenco/?shortcode=24cb0edd&outlook-ical=1](https://www.caivarese.it/eventi/elenco/?shortcode=24cb0edd&outlook-ical=1) · `ics` · 23 · `3256423c107e592d…`
  - [https://www.caivarese.it/eventi/elenco/?shortcode=bf581a3e&ical=1](https://www.caivarese.it/eventi/elenco/?shortcode=bf581a3e&ical=1) · `ics` · 23 · `42f73918ea35e16d…`
  - [https://www.caivarese.it/eventi/elenco/?shortcode=bf581a3e&outlook-ical=1](https://www.caivarese.it/eventi/elenco/?shortcode=bf581a3e&outlook-ical=1) · `ics` · 23 · `3256423c107e592d…`
  - [https://www.caivarese.it/evento/escursione-notturna/](https://www.caivarese.it/evento/escursione-notturna/) · `html-calendar` · 1 · `c6ed6093c4ead8bc…`
  - [https://www.caivarese.it/evento/escursione-notturna/?ical=1](https://www.caivarese.it/evento/escursione-notturna/?ical=1) · `ics` · 1 · `bf800bb964839208…`
  - [https://www.caivarese.it/evento/escursione-intersezionale-al-rifugio-citta-di-somma-da-riale/](https://www.caivarese.it/evento/escursione-intersezionale-al-rifugio-citta-di-somma-da-riale/) · `html-calendar` · 1 · `0a08b0b53a850a6a…`
  - [https://www.caivarese.it/evento/escursione-intersezionale-al-rifugio-citta-di-somma-da-riale/?ical=1](https://www.caivarese.it/evento/escursione-intersezionale-al-rifugio-citta-di-somma-da-riale/?ical=1) · `ics` · 1 · `d1eb48148e07392e…`
  - [https://www.caivarese.it/eventi/elenco/?shortcode=c6f8d3bd](https://www.caivarese.it/eventi/elenco/?shortcode=c6f8d3bd) · `html-calendar` · 12 · `95cab2652a20a3da…`
  - [https://www.caivarese.it/eventi/elenco/?ical=1](https://www.caivarese.it/eventi/elenco/?ical=1) · `ics` · 23 · `42f73918ea35e16d…`
  - [https://www.caivarese.it/eventi/elenco/?outlook-ical=1](https://www.caivarese.it/eventi/elenco/?outlook-ical=1) · `ics` · 23 · `3256423c107e592d…`
  - [https://www.caivarese.it/?post_type=tribe_events&ical=1&eventDisplay=list](https://www.caivarese.it/?post_type=tribe_events&ical=1&eventDisplay=list) · `ics` · 23 · `42f73918ea35e16d…`
  - [https://www.caivarese.it/eventi/mese/?shortcode=c6f8d3bd](https://www.caivarese.it/eventi/mese/?shortcode=c6f8d3bd) · `html-calendar` · 54 · `164cc73bebaef40e…`
  - [https://www.caivarese.it/eventi/mese/?ical=1](https://www.caivarese.it/eventi/mese/?ical=1) · `ics` · 9 · `9b0f498a61caf572…`
- Issue / residuo per URL:
  - `errore` [https://www.caivarese.it/?post_type=tribe_events&ical=1&eventDisplay=list&tribe_events_cat=cicloescursionismo-mtb](https://www.caivarese.it/?post_type=tribe_events&ical=1&eventDisplay=list&tribe_events_cat=cicloescursionismo-mtb) — Request failed with status code 503
  - `discovery-limit` [https://www.caivarese.it/eventi/?ical=1](https://www.caivarese.it/eventi/?ical=1) — Discovery budget reached; 93 candidate documents remain.
- Cache: non invalidata; gli hash sopra sono quelli del registro documenti dopo il passaggio. Il parser ha preservato i record validi già in cache.

### cai-veduggio-9216147 — CAI Veduggio

- Stato: `partial`; record in file: 14; deep-08 state: 13; problemi/errori di fonte: nessun errore globale.
- URL iniziale: https://organizzazione.cai.it/sez-veduggio/eventi/?ical=1
- Documenti visitati: 40; metodi registrati: `ics` 6, `html-calendar` 12, `nessun evento riconosciuto` 16, `pdf-text` 5, `wordpress-events` 1.
- Documenti con estrazione positiva (URL · metodo · eventi · cache SHA-256):
  - [https://organizzazione.cai.it/sez-veduggio/eventi/?ical=1](https://organizzazione.cai.it/sez-veduggio/eventi/?ical=1) · `ics` · 2 · `3cb9dc9941f27f07…`
  - [https://organizzazione.cai.it/sez-veduggio/?post_type=tribe_events&ical=1&eventDisplay=list](https://organizzazione.cai.it/sez-veduggio/?post_type=tribe_events&ical=1&eventDisplay=list) · `ics` · 2 · `616574b7aa9624ad…`
  - [https://organizzazione.cai.it/sez-veduggio/eventi/elenco/?ical=1](https://organizzazione.cai.it/sez-veduggio/eventi/elenco/?ical=1) · `ics` · 2 · `46df2502ac573677…`
  - [https://organizzazione.cai.it/sez-veduggio/eventi/](https://organizzazione.cai.it/sez-veduggio/eventi/) · `html-calendar` · 2 · `4a4f826eb99d1559…`
  - [https://organizzazione.cai.it/sez-veduggio/](https://organizzazione.cai.it/sez-veduggio/) · `html-calendar` · 2 · `62f9528ca593a7c7…`
  - [https://organizzazione.cai.it/sez-veduggio/wp-content/uploads/sites/79/2025/11/Attivita-Ragazzi-6-17-anni-Programma-2026.pdf](https://organizzazione.cai.it/sez-veduggio/wp-content/uploads/sites/79/2025/11/Attivita-Ragazzi-6-17-anni-Programma-2026.pdf) · `pdf-text` · 7 · `de66b96e384cd7f5…`
  - [https://organizzazione.cai.it/sez-veduggio/wp-content/uploads/sites/79/2025/11/Attivita-Giovani-18-40-anni-Programma-2026-.pdf](https://organizzazione.cai.it/sez-veduggio/wp-content/uploads/sites/79/2025/11/Attivita-Giovani-18-40-anni-Programma-2026-.pdf) · `pdf-text` · 4 · `e36c4f88537a5cf6…`
  - [https://organizzazione.cai.it/sez-veduggio/wp-content/uploads/sites/79/2025/11/Attivita-Adulti-Programma-2026-.pdf](https://organizzazione.cai.it/sez-veduggio/wp-content/uploads/sites/79/2025/11/Attivita-Adulti-Programma-2026-.pdf) · `pdf-text` · 4 · `8163faec85ad8d17…`
  - [https://organizzazione.cai.it/sez-veduggio/eventi/elenco/?outlook-ical=1](https://organizzazione.cai.it/sez-veduggio/eventi/elenco/?outlook-ical=1) · `ics` · 2 · `4adadcbc9c759506…`
  - [https://organizzazione.cai.it/sez-veduggio/wp-content/uploads/sites/79/2025/11/Attivita-Seniores-Programma-2026-.pdf](https://organizzazione.cai.it/sez-veduggio/wp-content/uploads/sites/79/2025/11/Attivita-Seniores-Programma-2026-.pdf) · `pdf-text` · 10 · `12d2e72ecb20644a…`
  - [https://organizzazione.cai.it/sez-veduggio/wp-content/uploads/sites/79/2025/11/Attivita-Invernali-Programma-2026.pdf](https://organizzazione.cai.it/sez-veduggio/wp-content/uploads/sites/79/2025/11/Attivita-Invernali-Programma-2026.pdf) · `pdf-text` · 3 · `34154743bcdb2963…`
  - [https://organizzazione.cai.it/sez-veduggio/eventi/](https://organizzazione.cai.it/sez-veduggio/eventi/) · `html-calendar` · 2 · `4fb0d8ce33381946…`
  - [https://organizzazione.cai.it/sez-veduggio/eventi/elenco/](https://organizzazione.cai.it/sez-veduggio/eventi/elenco/) · `html-calendar` · 2 · `6603cbcea848f722…`
  - [https://organizzazione.cai.it/sez-veduggio/eventi/mese/](https://organizzazione.cai.it/sez-veduggio/eventi/mese/) · `html-calendar` · 3 · `06bdc91fc9bcc3e7…`
  - [https://organizzazione.cai.it/sez-veduggio/eventi/mese/2026-09/](https://organizzazione.cai.it/sez-veduggio/eventi/mese/2026-09/) · `html-calendar` · 6 · `bd765216eaec10e5…`
  - [https://organizzazione.cai.it/sez-veduggio/eventi/mese/2026-11/](https://organizzazione.cai.it/sez-veduggio/eventi/mese/2026-11/) · `html-calendar` · 1 · `9093aa79b3e17f66…`
  - [https://organizzazione.cai.it/sez-veduggio/eventi/2026-10-04/](https://organizzazione.cai.it/sez-veduggio/eventi/2026-10-04/) · `html-calendar` · 1 · `ada6b3e8c899b393…`
  - [https://organizzazione.cai.it/sez-veduggio/eventi/2026-10-11/](https://organizzazione.cai.it/sez-veduggio/eventi/2026-10-11/) · `html-calendar` · 1 · `f1bac5815dfc7344…`
  - [https://organizzazione.cai.it/sez-veduggio/eventi/2026-10-14/](https://organizzazione.cai.it/sez-veduggio/eventi/2026-10-14/) · `html-calendar` · 1 · `60433e4722e6243b…`
  - [https://organizzazione.cai.it/sez-veduggio/eventi/2026-11-11/](https://organizzazione.cai.it/sez-veduggio/eventi/2026-11-11/) · `html-calendar` · 1 · `007be6db65b8ec33…`
  - [https://organizzazione.cai.it/sez-veduggio/eventi/elenco/?eventDisplay=past](https://organizzazione.cai.it/sez-veduggio/eventi/elenco/?eventDisplay=past) · `html-calendar` · 12 · `fc4491abd3e616fc…`
  - [https://organizzazione.cai.it/sez-veduggio/eventi/elenco/?eventDisplay=past&ical=1](https://organizzazione.cai.it/sez-veduggio/eventi/elenco/?eventDisplay=past&ical=1) · `ics` · 30 · `d09443cecea7dbe2…`
  - [https://organizzazione.cai.it/sez-veduggio/eventi/elenco/?eventDisplay=past&outlook-ical=1](https://organizzazione.cai.it/sez-veduggio/eventi/elenco/?eventDisplay=past&outlook-ical=1) · `ics` · 30 · `a6460babd9d4afe4…`
- Issue / residuo per URL:
  - `discovery-limit` [https://organizzazione.cai.it/sez-veduggio/eventi/?ical=1](https://organizzazione.cai.it/sez-veduggio/eventi/?ical=1) — Discovery budget reached; 25 candidate documents remain.
- Cache: non invalidata; gli hash sopra sono quelli del registro documenti dopo il passaggio. Il parser ha preservato i record validi già in cache.

### cai-milano-9216003 — CAI Milano

- Stato: `partial`; record in file: 9; deep-08 state: 9; problemi/errori di fonte: nessun errore globale.
- URL iniziale: https://www.arcaimilano.eu/OnLine/gite/Login.asp
- Documenti visitati: 40; metodi registrati: `nessun evento riconosciuto` 30, `html-calendar` 6, `pdf-text` 4.
- Documenti con estrazione positiva (URL · metodo · eventi · cache SHA-256):
  - [https://www.caimilano.org/gite-scifondo-escursionismo/](https://www.caimilano.org/gite-scifondo-escursionismo/) · `html-calendar` · 1 · `2c8907e4010e95b1…`
  - [https://www.caimilano.org/?jet_download=95a9b31caa6812bafef2d26938134abbe318258b](https://www.caimilano.org/?jet_download=95a9b31caa6812bafef2d26938134abbe318258b) · `pdf-text` · 8 · `469a2fb61681be58…`
  - [https://www.caimilano.org/?jet_download=f254eddde8ec8a5910eaa1690382ca6c1c61ba49](https://www.caimilano.org/?jet_download=f254eddde8ec8a5910eaa1690382ca6c1c61ba49) · `pdf-text` · 24 · `9cedf6d17b26d34b…`
  - [https://www.caimilano.org/?jet_download=9397bf57cc7bb2dceb919aabe23d697aa1165b7a](https://www.caimilano.org/?jet_download=9397bf57cc7bb2dceb919aabe23d697aa1165b7a) · `pdf-text` · 6 · `546992e1036effaf…`
  - [https://www.caimilano.org/scuola-scidifondo/](https://www.caimilano.org/scuola-scidifondo/) · `html-calendar` · 1 · `320aec28d9fb111d…`
  - [https://www.caimilano.org/zanchi-news/presentazione-corso-di-sci-escursionismo-se2-2026/30210/](https://www.caimilano.org/zanchi-news/presentazione-corso-di-sci-escursionismo-se2-2026/30210/) · `html-calendar` · 1 · `bae97765d063431a…`
  - [https://www.caimilano.org/gite-scifondo-escursionismo/](https://www.caimilano.org/gite-scifondo-escursionismo/) · `html-calendar` · 1 · `d93135a292c12273…`
  - [https://www.caimilano.org/cicloescursionismo-news/corso-mtb-caimilano/31902/](https://www.caimilano.org/cicloescursionismo-news/corso-mtb-caimilano/31902/) · `html-calendar` · 1 · `626414d97963fdbf…`
  - [https://www.caimilano.org/wp-content/uploads/2026/06/calendario-def-1.pdf](https://www.caimilano.org/wp-content/uploads/2026/06/calendario-def-1.pdf) · `pdf-text` · 3 · `92c094d649e1eaed…`
  - [https://www.caimilano.org/cicloescursionismo-news/corsi-di-guida-mtb-proposti-dal-club-alpino-italiano/31935/](https://www.caimilano.org/cicloescursionismo-news/corsi-di-guida-mtb-proposti-dal-club-alpino-italiano/31935/) · `html-calendar` · 3 · `a52415a7029d0c72…`
- Issue / residuo per URL:
  - `discovery-limit` [https://www.arcaimilano.eu/OnLine/gite/Login.asp](https://www.arcaimilano.eu/OnLine/gite/Login.asp) — Discovery budget reached; 54 candidate documents remain.
- Cache: non invalidata; gli hash sopra sono quelli del registro documenti dopo il passaggio. Il parser ha preservato i record validi già in cache.

### cai-seregno-9216016 — CAI Seregno

- Stato: `partial`; record in file: 7; deep-08 state: 7; problemi/errori di fonte: nessun errore globale.
- URL iniziale: https://www.caiseregno.it/calendario/mese/2026-08
- Documenti visitati: 40; metodi registrati: `nessun evento riconosciuto` 26, `html-calendar` 9, `pdf-ocr` 2, `pdf-text` 3.
- Documenti con estrazione positiva (URL · metodo · eventi · cache SHA-256):
  - [https://www.caiseregno.it/calendario/mese/2026-10](https://www.caiseregno.it/calendario/mese/2026-10) · `html-calendar` · 3 · `fdb7221b6a029eb1…`
  - [https://www.caiseregno.it/calendario/mese](https://www.caiseregno.it/calendario/mese) · `html-calendar` · 3 · `b24c5da5abeded72…`
  - [https://www.caiseregno.it/calendario](https://www.caiseregno.it/calendario) · `html-calendar` · 3 · `9651c2854ee4d09d…`
  - [https://www.caiseregno.it/calendario/mese/2026-07](https://www.caiseregno.it/calendario/mese/2026-07) · `html-calendar` · 3 · `ff5f4debe86bc334…`
  - [https://www.caiseregno.it/calendario/mese/2026-09](https://www.caiseregno.it/calendario/mese/2026-09) · `html-calendar` · 4 · `6304962b7976869a…`
  - [https://www.caiseregno.it/calendario/mese/2026-11](https://www.caiseregno.it/calendario/mese/2026-11) · `html-calendar` · 2 · `26303a8f9a4eaf33…`
  - [https://www.caiseregno.it/calendario/mese/2026-06](https://www.caiseregno.it/calendario/mese/2026-06) · `html-calendar` · 6 · `b17f17546343e6a1…`
  - [https://www.caiseregno.it/calendario/mese/2026-12](https://www.caiseregno.it/calendario/mese/2026-12) · `html-calendar` · 2 · `0250f1feda0c8671…`
  - [https://www.caiseregno.it/attivita/scuola-di-escursionismo](https://www.caiseregno.it/attivita/scuola-di-escursionismo) · `html-calendar` · 1 · `dbe74e5fe77eb04f…`
  - [https://www.caiseregno.it/sites/default/files/allegati/Quaderno_1_Sentieri_escursionismo_2010.pdf](https://www.caiseregno.it/sites/default/files/allegati/Quaderno_1_Sentieri_escursionismo_2010.pdf) · `pdf-text` · 3 · `6ae7fc08a86d3d97…`
- Issue / residuo per URL:
  - `discovery-limit` [https://www.caiseregno.it/calendario/mese/2026-08](https://www.caiseregno.it/calendario/mese/2026-08) — Discovery budget reached; 21 candidate documents remain.
- Cache: non invalidata; gli hash sopra sono quelli del registro documenti dopo il passaggio. Il parser ha preservato i record validi già in cache.

### cai-iseo-9216157 — CAI Iseo

- Stato: `partial`; record in file: 4; deep-08 state: 4; problemi/errori di fonte: nessun errore globale.
- URL iniziale: https://organizzazione.cai.it/sez-iseo/eventi/?ical=1
- Documenti visitati: 40; metodi registrati: `ics` 6, `html-calendar` 9, `nessun evento riconosciuto` 24, `wordpress-events` 1.
- Documenti con estrazione positiva (URL · metodo · eventi · cache SHA-256):
  - [https://organizzazione.cai.it/sez-iseo/eventi/?ical=1](https://organizzazione.cai.it/sez-iseo/eventi/?ical=1) · `ics` · 2 · `1ed1a153afd17205…`
  - [https://organizzazione.cai.it/sez-iseo/?post_type=tribe_events&ical=1&eventDisplay=list](https://organizzazione.cai.it/sez-iseo/?post_type=tribe_events&ical=1&eventDisplay=list) · `ics` · 2 · `dfa9329ec3a55ecd…`
  - [https://organizzazione.cai.it/sez-iseo/eventi/elenco/?ical=1](https://organizzazione.cai.it/sez-iseo/eventi/elenco/?ical=1) · `ics` · 2 · `4fea1dc2c832ea1e…`
  - [https://organizzazione.cai.it/sez-iseo/eventi/](https://organizzazione.cai.it/sez-iseo/eventi/) · `html-calendar` · 2 · `2504ce932ca62124…`
  - [https://organizzazione.cai.it/sez-iseo/categorie/escursioni/](https://organizzazione.cai.it/sez-iseo/categorie/escursioni/) · `html-calendar` · 3 · `74ee4cacb9678b12…`
  - [https://organizzazione.cai.it/sez-iseo/](https://organizzazione.cai.it/sez-iseo/) · `html-calendar` · 2 · `438f6643e4ae5b1c…`
  - [https://organizzazione.cai.it/sez-iseo/eventi/elenco/?outlook-ical=1](https://organizzazione.cai.it/sez-iseo/eventi/elenco/?outlook-ical=1) · `ics` · 2 · `ec3edb5172cc1e41…`
  - [https://organizzazione.cai.it/sez-iseo/2026/05/escursione-pizzo-formico/](https://organizzazione.cai.it/sez-iseo/2026/05/escursione-pizzo-formico/) · `html-calendar` · 1 · `3a23228e454dca72…`
  - [https://organizzazione.cai.it/sez-iseo/eventi/elenco/](https://organizzazione.cai.it/sez-iseo/eventi/elenco/) · `html-calendar` · 2 · `2198711a1e45c479…`
  - [https://organizzazione.cai.it/sez-iseo/eventi/mese/](https://organizzazione.cai.it/sez-iseo/eventi/mese/) · `html-calendar` · 3 · `2777e821687eb7f4…`
  - [https://organizzazione.cai.it/sez-iseo/eventi/mese/?ical=1](https://organizzazione.cai.it/sez-iseo/eventi/mese/?ical=1) · `ics` · 2 · `c5f26b729f3537ee…`
  - [https://organizzazione.cai.it/sez-iseo/eventi/mese/?outlook-ical=1](https://organizzazione.cai.it/sez-iseo/eventi/mese/?outlook-ical=1) · `ics` · 2 · `c57e4543aff7d7ee…`
  - [https://organizzazione.cai.it/sez-iseo/eventi/mese/2026-09/](https://organizzazione.cai.it/sez-iseo/eventi/mese/2026-09/) · `html-calendar` · 7 · `115f99bda60959a0…`
  - [https://organizzazione.cai.it/sez-iseo/eventi/mese/2026-11/](https://organizzazione.cai.it/sez-iseo/eventi/mese/2026-11/) · `html-calendar` · 1 · `c84a0643cd743a0c…`
  - [https://organizzazione.cai.it/sez-iseo/eventi/2026-10-10/](https://organizzazione.cai.it/sez-iseo/eventi/2026-10-10/) · `html-calendar` · 1 · `b4ea91a84ff254e7…`
- Issue / residuo per URL:
  - `previous-unavailable-skipped` [https://organizzazione.cai.it/sez-iseo/2026/05/escursione-pizzo-formico/facebook.com/cai.iseo](https://organizzazione.cai.it/sez-iseo/2026/05/escursione-pizzo-formico/facebook.com/cai.iseo) — Skipped URL previously confirmed unavailable: Skipped URL previously confirmed unavailable: Skipped URL previously confirmed unavailable: Request failed with status code 404
  - `discovery-limit` [https://organizzazione.cai.it/sez-iseo/eventi/?ical=1](https://organizzazione.cai.it/sez-iseo/eventi/?ical=1) — Discovery budget reached; 40 candidate documents remain.
- Cache: non invalidata; gli hash sopra sono quelli del registro documenti dopo il passaggio. Il parser ha preservato i record validi già in cache.

## Verifiche file e manifest

- I sei JSON backend/frontend sono stati letti con `JSON.parse` e verificati hash-per-hash; i mirror corrispondono byte per byte.
- Il manifest SHA-256 copre i tre JSON backend e le copie `frontend/public` corrispondenti.
- Il report viene conservato accanto allo stato del run.
- Supabase progetto `snwzxegtqnnuvlawnpgl`: il solo Dongo `cai-dongo-9216131-aa75836a580c` è stato inserito come `published`; Veduggio non ha inserimenti. Query finale: 3.205/3.205 ID presenti e pubblicati, 0 draft/mancanti; 4.364 `places`, 837 `cai_sections`.

## Copertura

La raccolta non chiude la copertura Lombardia: restano 8/8 fonti selezionate `partial` con candidati discovery ancora da visitare e ulteriori fonti non selezionate nel registro nazionale. Questo run non cambia tale stato.
