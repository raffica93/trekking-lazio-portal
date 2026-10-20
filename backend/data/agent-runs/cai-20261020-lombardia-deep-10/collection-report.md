# Raccolta CAI Lombardia — deep-10

- Run: `cai-20261020-lombardia-deep-10`; singola passata su 8 fonti abilitate.
- Limiti: massimo 40 documenti/fonte, 90 secondi/fonte, concorrenza 8. Estrazione deterministica HTML/ICS/PDF con cache; nessun modello generativo e nessun nuovo OCR usato.
- Confronto file: deep09 `3.205` eventi → deep10 `3.205`; **delta 0**. Nessun evento aggiunto o rimosso nel QA.
- Deduplica DB read-only: 38/38 `source_id` locali dei record nelle otto fonti risultano già presenti in `public.places`; nessun nuovo ID da importare. Database non modificato.
- Stato finale run: `collection=partial`, `files=ready`, `database=completed`. Tutte le fonti restano parziali per discovery incompleta; vedere i residui sotto.

## Esito fonte per fonte

| Source ID | Stato | Record locali deep09 → deep10 | Documenti | Metodi positivi | Residuo principale |
|---|---|---:|---:|---|---|
| `cai-premana-9216089` | `partial` | 1 → 1 | 40 | ics×14, html-calendar×9 | non-calendar-link-skipped×1, discovery-limit×1 |
| `cai-albiate-9216107` | `partial` | 5 → 5 | 34 | ics×9, html-calendar×14 | non-calendar-link-skipped×3 |
| `cai-cedegolo-9216062` | `partial` | 5 → 5 | 30 | ics×8, html-calendar×10 | non-calendar-link-skipped×1 |
| `cai-sesto-s-giovanni-9216020` | `partial` | 6 → 6 | 40 | ics×4, wordpress-events×1, html-calendar×7 | non-calendar-link-skipped×5, previous-unavailable-skipped×1, discovery-limit×1 |
| `cai-valmadrera-9216081` | `partial` | 7 → 7 | 40 | ics×6, html-calendar×27 | discovery-limit×1 |
| `cai-cremona-9216007` | `partial` | 6 → 6 | 38 | ics×24, html-calendar×8, wordpress-events×1 | previous-unavailable-skipped×1, error×2, discovery-limit×1 |
| `cai-calco-9216079` | `partial` | 4 → 4 | 19 | html-calendar×6 | non-calendar-link-skipped×3, previous-unavailable-skipped×21 |
| `cai-lodi-9216017` | `partial` | 4 → 4 | 16 | html-calendar×12 | non-calendar-link-skipped×1 |

### cai-premana-9216089 — CAI Premana

- Stato: `partial`; record nel file: 1; documenti registrati: 40; record nuovi rispetto al deep09: 0.
- URL iniziale: https://organizzazione.cai.it/sez-premana/eventi/?ical=1. Metodi riconosciuti: html-calendar, ics, wordpress-events.
- Documenti con estrazione positiva (max 10 mostrati; registro completo e cache SHA nel `scrape-status.json`):
  - [https://organizzazione.cai.it/sez-premana/eventi/?ical=1](https://organizzazione.cai.it/sez-premana/eventi/?ical=1) · `ics` · 1 eventi estratti · cache SHA `625ca9a3cf99d59a…`.
  - [https://organizzazione.cai.it/sez-premana/eventi/](https://organizzazione.cai.it/sez-premana/eventi/) · `html-calendar` · 1 eventi estratti · cache SHA `fb309031593f71cc…`.
  - [https://organizzazione.cai.it/sez-premana/eventi/elenco/](https://organizzazione.cai.it/sez-premana/eventi/elenco/) · `html-calendar` · 1 eventi estratti · cache SHA `e25fd6aac10af66d…`.
  - [https://organizzazione.cai.it/sez-premana/eventi/mese/](https://organizzazione.cai.it/sez-premana/eventi/mese/) · `html-calendar` · 1 eventi estratti · cache SHA `3c4a250cb99a39ae…`.
  - [https://organizzazione.cai.it/sez-premana/eventi/elenco/?eventDisplay=past](https://organizzazione.cai.it/sez-premana/eventi/elenco/?eventDisplay=past) · `html-calendar` · 9 eventi estratti · cache SHA `31694e70d70ea632…`.
  - [https://organizzazione.cai.it/sez-premana/](https://organizzazione.cai.it/sez-premana/) · `html-calendar` · 1 eventi estratti · cache SHA `b00b35aeeb144c05…`.
  - [https://organizzazione.cai.it/sez-premana/eventi/elenco/?ical=1](https://organizzazione.cai.it/sez-premana/eventi/elenco/?ical=1) · `ics` · 1 eventi estratti · cache SHA `88a6e6191f2aa6ab…`.
  - [https://organizzazione.cai.it/sez-premana/eventi/elenco/?outlook-ical=1](https://organizzazione.cai.it/sez-premana/eventi/elenco/?outlook-ical=1) · `ics` · 1 eventi estratti · cache SHA `6791db6fd4d526da…`.
  - [https://organizzazione.cai.it/sez-premana/eventi/mese/?ical=1](https://organizzazione.cai.it/sez-premana/eventi/mese/?ical=1) · `ics` · 1 eventi estratti · cache SHA `8df1a9c03b1b510a…`.
  - [https://organizzazione.cai.it/sez-premana/eventi/mese/?outlook-ical=1](https://organizzazione.cai.it/sez-premana/eventi/mese/?outlook-ical=1) · `ics` · 1 eventi estratti · cache SHA `1f40e64bd9bd3679…`.
- Errori/residui:
  - `non-calendar-link-skipped` (1): Skipped social, feed, metadata, sharing, or unrelated image URL. URL: [https://organizzazione.cai.it/sez-premana/eventi/feed/](https://organizzazione.cai.it/sez-premana/eventi/feed/)
  - `discovery-limit` (1): Discovery budget reached; 10 candidate documents remain. URL: [https://organizzazione.cai.it/sez-premana/eventi/?ical=1](https://organizzazione.cai.it/sez-premana/eventi/?ical=1)
- Cache: valida conservata; nessuna cancellazione o nuovo retry.

### cai-albiate-9216107 — CAI Albiate

- Stato: `partial`; record nel file: 5; documenti registrati: 34; record nuovi rispetto al deep09: 0.
- URL iniziale: https://organizzazione.cai.it/sez-albiate/eventi/?ical=1. Metodi riconosciuti: html-calendar, ics, wordpress-events.
- Documenti con estrazione positiva (max 10 mostrati; registro completo e cache SHA nel `scrape-status.json`):
  - [https://organizzazione.cai.it/sez-albiate/eventi/?ical=1](https://organizzazione.cai.it/sez-albiate/eventi/?ical=1) · `ics` · 1 eventi estratti · cache SHA `2378808ef85a3adb…`.
  - [https://organizzazione.cai.it/sez-albiate/2026/06/programma-2026/](https://organizzazione.cai.it/sez-albiate/2026/06/programma-2026/) · `html-calendar` · 11 eventi estratti · cache SHA `a73edd6395fbcb00…`.
  - [https://organizzazione.cai.it/sez-albiate/eventi/categoria/50-cai-albiate/](https://organizzazione.cai.it/sez-albiate/eventi/categoria/50-cai-albiate/) · `html-calendar` · 1 eventi estratti · cache SHA `af22627d69115c1b…`.
  - [https://organizzazione.cai.it/sez-albiate/eventi/categoria/50-cai-albiate/elenco/](https://organizzazione.cai.it/sez-albiate/eventi/categoria/50-cai-albiate/elenco/) · `html-calendar` · 1 eventi estratti · cache SHA `4f11fe36ebbded5e…`.
  - [https://organizzazione.cai.it/sez-albiate/](https://organizzazione.cai.it/sez-albiate/) · `html-calendar` · 1 eventi estratti · cache SHA `ee673c04ff5eb99b…`.
  - [https://organizzazione.cai.it/sez-albiate/eventi/categoria/50-cai-albiate/elenco/?ical=1](https://organizzazione.cai.it/sez-albiate/eventi/categoria/50-cai-albiate/elenco/?ical=1) · `ics` · 1 eventi estratti · cache SHA `e22356e8c11f3163…`.
  - [https://organizzazione.cai.it/sez-albiate/eventi/categoria/50-cai-albiate/elenco/?outlook-ical=1](https://organizzazione.cai.it/sez-albiate/eventi/categoria/50-cai-albiate/elenco/?outlook-ical=1) · `ics` · 1 eventi estratti · cache SHA `866eb51b56b5ddce…`.
  - [https://organizzazione.cai.it/sez-albiate/eventi/categoria/50-cai-albiate/?post_type=tribe_events&ical=1&eventDisplay=list](https://organizzazione.cai.it/sez-albiate/eventi/categoria/50-cai-albiate/?post_type=tribe_events&ical=1&eventDisplay=list) · `ics` · 1 eventi estratti · cache SHA `58b4a36ad98e6e15…`.
  - [https://organizzazione.cai.it/sez-albiate/eventi/](https://organizzazione.cai.it/sez-albiate/eventi/) · `html-calendar` · 1 eventi estratti · cache SHA `da529f9908cf06e1…`.
  - [https://organizzazione.cai.it/sez-albiate/eventi/elenco/?ical=1](https://organizzazione.cai.it/sez-albiate/eventi/elenco/?ical=1) · `ics` · 1 eventi estratti · cache SHA `b77a94dd082dfbce…`.
- Errori/residui:
  - `non-calendar-link-skipped` (3): Skipped social, feed, metadata, sharing, or unrelated image URL. URL: [https://organizzazione.cai.it/sez-albiate/wp-json/oembed/1.0/embed?url=https%3A%2F%2Forganizzazione.cai.it%2Fsez-albiate%2F2026%2F06%2Fprogramma-2026%2F](https://organizzazione.cai.it/sez-albiate/wp-json/oembed/1.0/embed?url=https%3A%2F%2Forganizzazione.cai.it%2Fsez-albiate%2F2026%2F06%2Fprogramma-2026%2F); [https://organizzazione.cai.it/sez-albiate/wp-json/oembed/1.0/embed?url=https%3A%2F%2Forganizzazione.cai.it%2Fsez-albiate%2F2026%2F06%2Fprogramma-2026%2F&format=xml](https://organizzazione.cai.it/sez-albiate/wp-json/oembed/1.0/embed?url=https%3A%2F%2Forganizzazione.cai.it%2Fsez-albiate%2F2026%2F06%2Fprogramma-2026%2F&format=xml); [https://organizzazione.cai.it/sez-albiate/eventi/feed/](https://organizzazione.cai.it/sez-albiate/eventi/feed/)
- Cache: valida conservata; nessuna cancellazione o nuovo retry.

### cai-cedegolo-9216062 — CAI Cedegolo

- Stato: `partial`; record nel file: 5; documenti registrati: 30; record nuovi rispetto al deep09: 0.
- URL iniziale: https://organizzazione.cai.it/sez-cedegolo/eventi/?ical=1. Metodi riconosciuti: html-calendar, ics, wordpress-events.
- Documenti con estrazione positiva (max 10 mostrati; registro completo e cache SHA nel `scrape-status.json`):
  - [https://organizzazione.cai.it/sez-cedegolo/eventi/?ical=1](https://organizzazione.cai.it/sez-cedegolo/eventi/?ical=1) · `ics` · 1 eventi estratti · cache SHA `c91a561ac286b561…`.
  - [https://organizzazione.cai.it/sez-cedegolo/?post_type=tribe_events&ical=1&eventDisplay=list](https://organizzazione.cai.it/sez-cedegolo/?post_type=tribe_events&ical=1&eventDisplay=list) · `ics` · 1 eventi estratti · cache SHA `846286c054f5e1be…`.
  - [https://organizzazione.cai.it/sez-cedegolo/eventi/elenco/?ical=1](https://organizzazione.cai.it/sez-cedegolo/eventi/elenco/?ical=1) · `ics` · 1 eventi estratti · cache SHA `ee318dd429d649c5…`.
  - [https://organizzazione.cai.it/sez-cedegolo/eventi/](https://organizzazione.cai.it/sez-cedegolo/eventi/) · `html-calendar` · 1 eventi estratti · cache SHA `17c42acfe0de9693…`.
  - [https://organizzazione.cai.it/sez-cedegolo/eventi/elenco/](https://organizzazione.cai.it/sez-cedegolo/eventi/elenco/) · `html-calendar` · 1 eventi estratti · cache SHA `24016c4235b43827…`.
  - [https://organizzazione.cai.it/sez-cedegolo/](https://organizzazione.cai.it/sez-cedegolo/) · `html-calendar` · 1 eventi estratti · cache SHA `f520af9068368085…`.
  - [https://organizzazione.cai.it/sez-cedegolo/eventi/elenco/?outlook-ical=1](https://organizzazione.cai.it/sez-cedegolo/eventi/elenco/?outlook-ical=1) · `ics` · 1 eventi estratti · cache SHA `cfac1ad63fcca057…`.
  - [https://organizzazione.cai.it/sez-cedegolo/eventi/mese/](https://organizzazione.cai.it/sez-cedegolo/eventi/mese/) · `html-calendar` · 3 eventi estratti · cache SHA `6d090b8c24a34036…`.
  - [https://organizzazione.cai.it/sez-cedegolo/eventi/mese/?ical=1](https://organizzazione.cai.it/sez-cedegolo/eventi/mese/?ical=1) · `ics` · 1 eventi estratti · cache SHA `9cb31084bd0dcb5a…`.
  - [https://organizzazione.cai.it/sez-cedegolo/eventi/mese/?outlook-ical=1](https://organizzazione.cai.it/sez-cedegolo/eventi/mese/?outlook-ical=1) · `ics` · 1 eventi estratti · cache SHA `3ab9eb32de03766e…`.
- Errori/residui:
  - `non-calendar-link-skipped` (1): Skipped social, feed, metadata, sharing, or unrelated image URL. URL: [https://organizzazione.cai.it/sez-cedegolo/eventi/feed/](https://organizzazione.cai.it/sez-cedegolo/eventi/feed/)
- Cache: valida conservata; nessuna cancellazione o nuovo retry.

### cai-sesto-s-giovanni-9216020 — CAI Sesto S.giovanni

- Stato: `partial`; record nel file: 6; documenti registrati: 40; record nuovi rispetto al deep09: 0.
- URL iniziale: https://www.caisestosg.it/eventi/?ical=1. Metodi riconosciuti: html-calendar, ics, image-ocr, wordpress-events.
- Documenti con estrazione positiva (max 10 mostrati; registro completo e cache SHA nel `scrape-status.json`):
  - [https://www.caisestosg.it/eventi/?ical=1](https://www.caisestosg.it/eventi/?ical=1) · `ics` · 2 eventi estratti · cache SHA `74dd1e5a00b6ae6d…`.
  - [https://www.caisestosg.it/wp-json/tribe/events/v1/events?start_date=2026-10-01&per_page=100](https://www.caisestosg.it/wp-json/tribe/events/v1/events?start_date=2026-10-01&per_page=100) · `wordpress-events` · 5 eventi estratti · cache SHA `63911701eaba2c83…`.
  - [https://www.caisestosg.it/escursionismo-sezionale/8-corso-di-escursionismo-avanzato-2026/](https://www.caisestosg.it/escursionismo-sezionale/8-corso-di-escursionismo-avanzato-2026/) · `html-calendar` · 2 eventi estratti · cache SHA `a315a2119b06cb0b…`.
  - [https://www.caisestosg.it/escursionismo-sezionale/8-corso-di-escursionismo-avanzato-2026/?s=](https://www.caisestosg.it/escursionismo-sezionale/8-corso-di-escursionismo-avanzato-2026/?s=) · `html-calendar` · 2 eventi estratti · cache SHA `3d96996dcd991a80…`.
  - [https://www.caisestosg.it/eventi/](https://www.caisestosg.it/eventi/) · `html-calendar` · 2 eventi estratti · cache SHA `130a5ebe183e20b9…`.
  - [https://www.caisestosg.it/eventi/elenco/?ical=1](https://www.caisestosg.it/eventi/elenco/?ical=1) · `ics` · 2 eventi estratti · cache SHA `74dd1e5a00b6ae6d…`.
  - [https://www.caisestosg.it/eventi/elenco/?outlook-ical=1](https://www.caisestosg.it/eventi/elenco/?outlook-ical=1) · `ics` · 2 eventi estratti · cache SHA `28a179e860d2ec9e…`.
  - [https://www.caisestosg.it/?post_type=tribe_events&ical=1&eventDisplay=list](https://www.caisestosg.it/?post_type=tribe_events&ical=1&eventDisplay=list) · `ics` · 2 eventi estratti · cache SHA `74dd1e5a00b6ae6d…`.
  - [https://www.caisestosg.it/sezione/attivita-culturali/conferenze/](https://www.caisestosg.it/sezione/attivita-culturali/conferenze/) · `html-calendar` · 1 eventi estratti · cache SHA `adee5a372cbdf954…`.
  - [https://www.caisestosg.it/escursionismo-sezionale/programmi-e-proposte/](https://www.caisestosg.it/escursionismo-sezionale/programmi-e-proposte/) · `html-calendar` · 1 eventi estratti · cache SHA `3e085593e6ceec5e…`.
- Errori/residui:
  - `non-calendar-link-skipped` (5): Skipped social, feed, metadata, sharing, or unrelated image URL. URL: [https://www.caisestosg.it/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fwww.caisestosg.it%2Fattivita%2Falpinismo-giovanile%2Fcalendario-gite-2026%2F](https://www.caisestosg.it/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fwww.caisestosg.it%2Fattivita%2Falpinismo-giovanile%2Fcalendario-gite-2026%2F); [https://www.caisestosg.it/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fwww.caisestosg.it%2Fattivita%2Falpinismo-giovanile%2Fcalendario-gite-2026%2F&format=xml](https://www.caisestosg.it/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fwww.caisestosg.it%2Fattivita%2Falpinismo-giovanile%2Fcalendario-gite-2026%2F&format=xml); [https://twitter.com/intent/tweet?text=Calendario%20Gite%202026&url=https%3A%2F%2Fwww.caisestosg.it%2Fattivita%2Falpinismo-giovanile%2Fcalendario-gite-2026%2F](https://twitter.com/intent/tweet?text=Calendario%20Gite%202026&url=https%3A%2F%2Fwww.caisestosg.it%2Fattivita%2Falpinismo-giovanile%2Fcalendario-gite-2026%2F) (altri URL nel registro manifestato)
  - `previous-unavailable-skipped` (1): Skipped URL previously confirmed unavailable: Skipped URL previously confirmed unavailable: Skipped URL previously confirmed unavailable: Request failed with status code 404 URL: [https://www.caisestosg.it/escursionismo-sezionale/8-corso-di-escursionismo-avanzato-2026/_wp_link_placeholder](https://www.caisestosg.it/escursionismo-sezionale/8-corso-di-escursionismo-avanzato-2026/_wp_link_placeholder)
  - `discovery-limit` (1): Discovery budget reached; 46 candidate documents remain. URL: [https://www.caisestosg.it/eventi/?ical=1](https://www.caisestosg.it/eventi/?ical=1)
- Cache: valida conservata; nessuna cancellazione o nuovo retry.

### cai-valmadrera-9216081 — CAI Valmadrera

- Stato: `partial`; record nel file: 7; documenti registrati: 40; record nuovi rispetto al deep09: 0.
- URL iniziale: https://organizzazione.cai.it/sez-valmadrera/wp-content/uploads/sites/56/2026/03/Calendario-attivita-2026_rev.04_16-03-2026.pdf. Metodi riconosciuti: html-calendar, ics, pdf-text, wordpress-events.
- Documenti con estrazione positiva (max 10 mostrati; registro completo e cache SHA nel `scrape-status.json`):
  - [https://organizzazione.cai.it/sez-valmadrera/eventi/?ical=1](https://organizzazione.cai.it/sez-valmadrera/eventi/?ical=1) · `ics` · 1 eventi estratti · cache SHA `94b0ac5f4518917f…`.
  - [https://organizzazione.cai.it/sez-valmadrera/?post_type=tribe_events&ical=1&eventDisplay=list](https://organizzazione.cai.it/sez-valmadrera/?post_type=tribe_events&ical=1&eventDisplay=list) · `ics` · 1 eventi estratti · cache SHA `7bc88e835f0f4dab…`.
  - [https://organizzazione.cai.it/sez-valmadrera/eventi/elenco/?ical=1](https://organizzazione.cai.it/sez-valmadrera/eventi/elenco/?ical=1) · `ics` · 1 eventi estratti · cache SHA `d2fb0ec31bb64200…`.
  - [https://organizzazione.cai.it/sez-valmadrera/eventi/](https://organizzazione.cai.it/sez-valmadrera/eventi/) · `html-calendar` · 1 eventi estratti · cache SHA `18865ff99d0a37bf…`.
  - [https://organizzazione.cai.it/sez-valmadrera/attivita/valma-street-block-2026/](https://organizzazione.cai.it/sez-valmadrera/attivita/valma-street-block-2026/) · `html-calendar` · 2 eventi estratti · cache SHA `92adf56bfd7f0268…`.
  - [https://organizzazione.cai.it/sez-valmadrera/](https://organizzazione.cai.it/sez-valmadrera/) · `html-calendar` · 1 eventi estratti · cache SHA `c7ab78a2320aec7e…`.
  - [https://organizzazione.cai.it/sez-valmadrera/eventi/elenco/?outlook-ical=1](https://organizzazione.cai.it/sez-valmadrera/eventi/elenco/?outlook-ical=1) · `ics` · 1 eventi estratti · cache SHA `86754044d416c5fd…`.
  - [https://organizzazione.cai.it/sez-valmadrera/eventi/](https://organizzazione.cai.it/sez-valmadrera/eventi/) · `html-calendar` · 1 eventi estratti · cache SHA `db47c38176b18fc1…`.
  - [https://organizzazione.cai.it/sez-valmadrera/eventi/elenco/](https://organizzazione.cai.it/sez-valmadrera/eventi/elenco/) · `html-calendar` · 1 eventi estratti · cache SHA `edb1f50c870e05c1…`.
  - [https://organizzazione.cai.it/sez-valmadrera/eventi/mese/](https://organizzazione.cai.it/sez-valmadrera/eventi/mese/) · `html-calendar` · 4 eventi estratti · cache SHA `94c136d6d8b61b76…`.
- Errori/residui:
  - `discovery-limit` (1): Discovery budget reached; 24 candidate documents remain. URL: [https://organizzazione.cai.it/sez-valmadrera/wp-content/uploads/sites/56/2026/03/Calendario-attivita-2026_rev.04_16-03-2026.pdf](https://organizzazione.cai.it/sez-valmadrera/wp-content/uploads/sites/56/2026/03/Calendario-attivita-2026_rev.04_16-03-2026.pdf)
- Cache: valida conservata; nessuna cancellazione o nuovo retry.

### cai-cremona-9216007 — CAI Cremona

- Stato: `partial`; record nel file: 6; documenti registrati: 38; record nuovi rispetto al deep09: 0.
- URL iniziale: https://www.caicremona.it/attivita/trekking-levanto-26-30-settembre-2026/?ical=1. Metodi riconosciuti: html-calendar, ics, pdf-text, wordpress-events.
- Documenti con estrazione positiva (max 10 mostrati; registro completo e cache SHA nel `scrape-status.json`):
  - [https://www.caicremona.it/attivita/trekking-levanto-26-30-settembre-2026/?ical=1](https://www.caicremona.it/attivita/trekking-levanto-26-30-settembre-2026/?ical=1) · `ics` · 1 eventi estratti · cache SHA `7ffc4b604e208a84…`.
  - [https://www.caicremona.it/attivita/?ical=1](https://www.caicremona.it/attivita/?ical=1) · `ics` · 1 eventi estratti · cache SHA `2e135a236550091e…`.
  - [https://www.caicremona.it/?post_type=tribe_events&ical=1&eventDisplay=list](https://www.caicremona.it/?post_type=tribe_events&ical=1&eventDisplay=list) · `ics` · 2 eventi estratti · cache SHA `ae05d2a05802423b…`.
  - [https://www.caicremona.it/attivita/mese/?ical=1](https://www.caicremona.it/attivita/mese/?ical=1) · `ics` · 1 eventi estratti · cache SHA `2e135a236550091e…`.
  - [https://www.caicremona.it/attivita/mese/2026-08/](https://www.caicremona.it/attivita/mese/2026-08/) · `html-calendar` · 1 eventi estratti · cache SHA `8403fd0924c87f14…`.
  - [https://www.caicremona.it/attivita/mese/2026-08/?ical=1](https://www.caicremona.it/attivita/mese/2026-08/?ical=1) · `ics` · 1 eventi estratti · cache SHA `0fb369b8d94a2d51…`.
  - [https://www.caicremona.it/attivita/mese/2026-08/?outlook-ical=1](https://www.caicremona.it/attivita/mese/2026-08/?outlook-ical=1) · `ics` · 1 eventi estratti · cache SHA `3634b44ff662981c…`.
  - [https://www.caicremona.it/?post_type=tribe_events&tribe-bar-date=2026-08&ical=1&eventDisplay=list](https://www.caicremona.it/?post_type=tribe_events&tribe-bar-date=2026-08&ical=1&eventDisplay=list) · `ics` · 7 eventi estratti · cache SHA `4c6a9b2373c0aa17…`.
  - [https://www.caicremona.it/wp-json/tribe/events/v1/events?start_date=2026-10-01&per_page=100](https://www.caicremona.it/wp-json/tribe/events/v1/events?start_date=2026-10-01&per_page=100) · `wordpress-events` · 4 eventi estratti · cache SHA `871d2ef92ba13389…`.
  - [https://www.caicremona.it/attivita/elenco/?tribe-bar-date=2026-08-01](https://www.caicremona.it/attivita/elenco/?tribe-bar-date=2026-08-01) · `html-calendar` · 7 eventi estratti · cache SHA `9826c938004bb502…`.
- Errori/residui:
  - `previous-unavailable-skipped` (1): Skipped URL previously confirmed unavailable: Skipped URL previously confirmed unavailable: Skipped URL previously confirmed unavailable: Request failed with status code 503 URL: [https://www.caicremona.it/attivita/](https://www.caicremona.it/attivita/)
  - `error` (2): Request failed with status code 503 URL: [https://www.caicremona.it/attivita/trekking-levanto-26-30-settembre-2026/](https://www.caicremona.it/attivita/trekking-levanto-26-30-settembre-2026/); [https://www.caicremona.it/](https://www.caicremona.it/)
  - `discovery-limit` (1): Discovery budget reached; 84 candidate documents remain. URL: [https://www.caicremona.it/attivita/trekking-levanto-26-30-settembre-2026/?ical=1](https://www.caicremona.it/attivita/trekking-levanto-26-30-settembre-2026/?ical=1)
- Cache: valida conservata; nessuna cancellazione o nuovo retry.

### cai-calco-9216079 — CAI Calco

- Stato: `partial`; record nel file: 4; documenti registrati: 19; record nuovi rispetto al deep09: 0.
- URL iniziale: https://www.caicalco.it/2025/12/22/calendario-gite-sezionali-2026/. Metodi riconosciuti: html-calendar.
- Documenti con estrazione positiva (max 10 mostrati; registro completo e cache SHA nel `scrape-status.json`):
  - [https://www.caicalco.it/2025/12/22/calendario-gite-sezionali-2026/](https://www.caicalco.it/2025/12/22/calendario-gite-sezionali-2026/) · `html-calendar` · 9 eventi estratti · cache SHA `449a14b21b5ddd75…`.
  - [https://www.caicalco.it/2025/12/22/calendario-escursioni-2026-gruppo-eta-doro-g-e-o/](https://www.caicalco.it/2025/12/22/calendario-escursioni-2026-gruppo-eta-doro-g-e-o/) · `html-calendar` · 12 eventi estratti · cache SHA `82cdda2fc24ac365…`.
  - [https://www.caicalco.it/](https://www.caicalco.it/) · `html-calendar` · 3 eventi estratti · cache SHA `ee3836a579a800fd…`.
  - [https://www.caicalco.it/2025/12/22/21-giugno-2026-pizzo-tre-signori-escursionistica/](https://www.caicalco.it/2025/12/22/21-giugno-2026-pizzo-tre-signori-escursionistica/) · `html-calendar` · 1 eventi estratti · cache SHA `de19511624849d18…`.
  - [https://www.caicalco.it/2025/12/22/19-26-settembre-2026-penisola-sorrentina-trekking/](https://www.caicalco.it/2025/12/22/19-26-settembre-2026-penisola-sorrentina-trekking/) · `html-calendar` · 1 eventi estratti · cache SHA `715136990d0776a8…`.
  - [https://www.caicalco.it/category/gite-sezionali-2026/page/2/](https://www.caicalco.it/category/gite-sezionali-2026/page/2/) · `html-calendar` · 1 eventi estratti · cache SHA `fe17aa786bd8ec2d…`.
- Errori/residui:
  - `non-calendar-link-skipped` (3): Skipped social, feed, metadata, sharing, or unrelated image URL. URL: [https://www.caicalco.it/2025/12/22/calendario-gite-sezionali-2026/feed/](https://www.caicalco.it/2025/12/22/calendario-gite-sezionali-2026/feed/); [https://www.caicalco.it/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fwww.caicalco.it%2F2025%2F12%2F22%2Fcalendario-gite-sezionali-2026%2F](https://www.caicalco.it/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fwww.caicalco.it%2F2025%2F12%2F22%2Fcalendario-gite-sezionali-2026%2F); [https://www.caicalco.it/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fwww.caicalco.it%2F2025%2F12%2F22%2Fcalendario-gite-sezionali-2026%2F&format=xml](https://www.caicalco.it/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fwww.caicalco.it%2F2025%2F12%2F22%2Fcalendario-gite-sezionali-2026%2F&format=xml)
  - `previous-unavailable-skipped` (21): Skipped URL previously confirmed unavailable: Failed to establish tunnel to x.com:443 via http://proxy:8080: HTTP/1.1 403 Forbidden URL: [https://www.caicalco.it/2025/12/22/calendario-gite-sezionali-2026/?share=twitter](https://www.caicalco.it/2025/12/22/calendario-gite-sezionali-2026/?share=twitter); [https://www.caicalco.it/2025/12/22/calendario-gite-sezionali-2026/?share=jetpack-whatsapp](https://www.caicalco.it/2025/12/22/calendario-gite-sezionali-2026/?share=jetpack-whatsapp); [https://www.caicalco.it/2025/12/22/calendario-gite-sezionali-2026/?share=pinterest](https://www.caicalco.it/2025/12/22/calendario-gite-sezionali-2026/?share=pinterest) (altri URL nel registro manifestato)
- Cache: valida conservata; nessuna cancellazione o nuovo retry.

### cai-lodi-9216017 — CAI Lodi

- Stato: `partial`; record nel file: 4; documenti registrati: 16; record nuovi rispetto al deep09: 0.
- URL iniziale: https://www.cailodi.it/programma-eventi. Metodi riconosciuti: html-calendar.
- Documenti con estrazione positiva (max 10 mostrati; registro completo e cache SHA nel `scrape-status.json`):
  - [https://www.cailodi.it/events/escursionismo-rifugio-barba-ferrero](https://www.cailodi.it/events/escursionismo-rifugio-barba-ferrero) · `html-calendar` · 1 eventi estratti · cache SHA `65fc62eed359d430…`.
  - [https://www.cailodi.it/events/escursionismo-pietra-perduca-e-parcellara-uscita-intersezionale-ticinum](https://www.cailodi.it/events/escursionismo-pietra-perduca-e-parcellara-uscita-intersezionale-ticinum) · `html-calendar` · 1 eventi estratti · cache SHA `07f5799a1e8f0d64…`.
  - [https://www.cailodi.it/events/escursionismo-monte-cazzola](https://www.cailodi.it/events/escursionismo-monte-cazzola) · `html-calendar` · 1 eventi estratti · cache SHA `ce5dceeb9c506f5a…`.
  - [https://www.cailodi.it/](https://www.cailodi.it/) · `html-calendar` · 1 eventi estratti · cache SHA `6e2f9dc09a18730f…`.
  - [https://www.cailodi.it/events/escursionismo-polentata-2](https://www.cailodi.it/events/escursionismo-polentata-2) · `html-calendar` · 1 eventi estratti · cache SHA `66c2285dbf3d51a5…`.
  - [https://www.cailodi.it/events/escursionismo-giro-dei-corni-di-canzo](https://www.cailodi.it/events/escursionismo-giro-dei-corni-di-canzo) · `html-calendar` · 1 eventi estratti · cache SHA `a5383e6cbd3f9e16…`.
  - [https://www.cailodi.it/events/cicloescursionismo-parco-adda-sud](https://www.cailodi.it/events/cicloescursionismo-parco-adda-sud) · `html-calendar` · 1 eventi estratti · cache SHA `be488930c4844714…`.
  - [https://www.cailodi.it/events/escursionismo-rifugio-olmo](https://www.cailodi.it/events/escursionismo-rifugio-olmo) · `html-calendar` · 1 eventi estratti · cache SHA `be6356bc2685e913…`.
  - [https://www.cailodi.it/events/escursionismo-sentiero-delle-anime](https://www.cailodi.it/events/escursionismo-sentiero-delle-anime) · `html-calendar` · 1 eventi estratti · cache SHA `33c51f56635c5ead…`.
  - [https://www.cailodi.it/events/escursionismo-laghi-gemelli](https://www.cailodi.it/events/escursionismo-laghi-gemelli) · `html-calendar` · 1 eventi estratti · cache SHA `7b89162a32eec780…`.
- Errori/residui:
  - `non-calendar-link-skipped` (1): Skipped social, feed, metadata, sharing, or unrelated image URL. URL: [https://twitter.com/intent/tweet?url=https://www.cailodi.it/events/escursionismo-rifugio-barba-ferrero&text=Dai%20un%27occhiata%20a%20questo%20evento.%20Ti%20aspettiamo!](https://twitter.com/intent/tweet?url=https://www.cailodi.it/events/escursionismo-rifugio-barba-ferrero&text=Dai%20un%27occhiata%20a%20questo%20evento.%20Ti%20aspettiamo!)
- Cache: valida conservata; nessuna cancellazione o nuovo retry.

## QA, DB e copertura

La passata non ha creato ID nuovi; perciò non ci sono titoli/date/location nuovi da approvare manualmente. Tutti i 38 ID locali appartenenti alle fonti selezionate sono stati verificati con una query `SELECT` sul progetto autorizzato `snwzxegtqnnuvlawnpgl` e risultano già presenti. Verifica finale sull'intero run: 3.205/3.205 ID presenti e `published`, zero draft/mancanti; 4.364 `places` e 837 `cai_sections`. Nessuna scrittura DB è stata eseguita.

Tutte le otto fonti hanno `status=partial`; la copertura Lombardia resta incompleta. Le principali code da riprendere sono: Premana (10 candidati), Sesto San Giovanni (46), Valmadrera (24), Cremona (96); le altre hanno residui di navigazione/social o calendari già letti senza ulteriore record. Nessun retry automatico è previsto.

## File

I tre JSON backend e le tre copie `frontend/public` sono stati verificati con `JSON.parse` e SHA-256. I relativi digest sono nel `manifest.json`; SHA del report registrato anche nello state del run.
