# Raccolta Lombardia — CAI Brescia, residui documentali

- Run: `cai-20261022-lombardia-brescia03`; checkout remoto verificato a `c0456e347a5e1b87a3b84b833a1623ca87cb0ede` = `origin/codex/cai-orchestrator-luna` al preflight.
- Perimetro: esclusivamente `cai-brescia-9216005`; raccolta deterministica; concurrency 1; `SCRAPE_MAX_DOCUMENTS=26` (12 URL noti dal run02 + fino a 14 candidati successivi); `SCRAPE_SOURCE_BUDGET_MS=240000`; un solo `collect`. Nessun test in parallelo, nessun import/DB, nessun commit/push.
- Esito: collection `partial`, files `ready`, database `pending`. Una sola sezione controllata: Brescia partial; nessuna altra fonte o regione ricontrollata.
- Run ha esaminato 26 documenti (12 URL già presenti nella tabella run02, riaperti/ricontrollati e 14 URL ulteriori raggiunti dal grafo ufficiale). I 14 sono gli ulteriori candidati raggiunti con budget esteso; il sistema non persiste la queue con il conteggio individuale del run02, quindi non si attribuisce un URL specifico a quei 14 solo sulla base del contatore precedente.
- Stato corrente Brescia: `partial`, 51 eventi; 136 righe estratte nei documenti; aggiornato `2026-10-22T18:37:26.824Z`. Discovery budget residuo: Discovery budget reached; 13 candidate documents remain.. La sezione resta partial.
- Delta rispetto al checkpoint remoto: 7 nuovi ID Brescia, 0 record esistenti cambiati, 0 rimossi. Run02 resta storico; l’evento cinema del 21-10-2026 continua senza `durationHours`.
- Errori cooldown: 42 voci ripetute, ma 2 URL distinti con precedente HTTP 403; non è stato inviato alcun retry. 1 voci: `https://archivio.cai.it/sezione/brescia/calendario-iniziative/`; 41 voci: `https://organizzazione.cai.it/sez-brescia/attivita/scuola-adamello-tullio-corbellini/chi-siamo-2/`.

## Copertura della sezione

| Sezione | Checked | Complete | Partial | Unreachable | Eventi nuovi verificati | ID rimossi |
|---|---:|---:|---:|---:|---:|---:|
| CAI Brescia (`cai-brescia-9216005`) | 1 | 0 | 1 | 0 | 7 | 0 |

## Record nuovi e controllo geolocalità

Tutti i record seguenti provengono da pagine ufficiali CAI (URL e hash nel registro documentale). Nessun punto geografico né coordinate sono stati assegnati: le prove disponibili descrivono eventi formativi/aula o non specificano il luogo; non si usano coordinate di sede o capoluogo. `location=Località da verificare`, `coordinatesQuality=unknown`; provenienza testo `html-table`, stato da verificare. Non è stata consultata una mappa perché le fonti non individuano un punto escursionistico da verificare. Per le due righe che menzionano “Sede CAI Brescia, Sala Consiglio”, il testo è conservato nella descrizione come prova della sede dell’incontro, ma non viene convertito in lat/lng né in punto di partenza.

| ID | Data | Titolo | Evidenza località nella fonte | Punto / precisione / review |
|---|---|---|---|---|
| `cai-brescia-9216005-88839fa0b832` | 2026-12-17 | Presentazione corso , materiali ed equipaggiamento. | La fonte non indica luogo puntuale | nessuna coordinata; tipo non-escursione/aula o ignoto; precisione assente; da verificare |
| `cai-brescia-9216005-61a19bc01652` | 2027-02-18 | Autosoccorso in valanga. | La fonte non indica luogo puntuale | nessuna coordinata; tipo non-escursione/aula o ignoto; precisione assente; da verificare |
| `cai-brescia-9216005-290204ef6b3c` | 2027-03-04 | Preparazione e conduzione della gita , schizzo di rotta. | La fonte non indica luogo puntuale | nessuna coordinata; tipo non-escursione/aula o ignoto; precisione assente; da verificare |
| `cai-brescia-9216005-89fdf0fc5840` | 2027-03-07 | Introduzione all’uso di bussola , altimetro , mappa e esercitazioni di autosoccorso in valanga. | La fonte non indica luogo puntuale | nessuna coordinata; tipo non-escursione/aula o ignoto; precisione assente; da verificare |
| `cai-brescia-9216005-b4e49b6eaa07` | 2027-04-15 | Preparazione uscita finale , quiz di verifica. | La fonte non indica luogo puntuale | nessuna coordinata; tipo non-escursione/aula o ignoto; precisione assente; da verificare |
| `cai-brescia-9216005-0576181b163e` | 2027-06-17 | Preparazione di una uscita su roccia e scale delle difficoltà Sede CAI Brescia, Sala Consiglio | Sede CAI Brescia, Sala Consiglio (testo ufficiale) | nessuna coordinata; tipo non-escursione/aula o ignoto; precisione assente; da verificare |
| `cai-brescia-9216005-1d5a1ae69cda` | 2027-07-01 | Storia dell’alpinismo su roccia nelle dolomiti di Brenta Sede CAI Brescia, Sala Consiglio | Sede CAI Brescia, Sala Consiglio (testo ufficiale) | nessuna coordinata; tipo non-escursione/aula o ignoto; precisione assente; da verificare |

Record preesistente cambiati: nessuno.

## Documenti esaminati

| URL | Metodo | Eventi estratti | SHA-256 |
|---|---|---:|---|
| https://organizzazione.cai.it/sez-brescia/wp-content/uploads/sites/7/2026/02/Programma-Escursionismo-2026.pdf | `pdf-text` | 26 | `5cf9de44a727ec139ed73c330d90297d2f50ab1c3f23060c9a675455443641b1` |
| https://organizzazione.cai.it/sez-brescia/eventi/?ical=1 | `nessun parser` | 0 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| https://organizzazione.cai.it/sez-brescia/attivita/gruppo-juniores/juniores2026/ | `html-calendar` | 4 | `8263a096257549a277bf64c92d00674a52c9951f141318a5caf16ccd7ff715da` |
| https://organizzazione.cai.it/sez-brescia/attivita/escursionismo/commissione-escursionismo/ | `html-calendar` | 26 | `72d20ddff8341e43b25d8edf7d5883a4e85d6fc6540033d7dcf1e54366397a85` |
| https://organizzazione.cai.it/sez-brescia/2025/12/gruppo-escursionistico-seniores-1997-calendario-escursioni-trekking-2026/ | `nessun parser` | 0 | `4951d42a6804f89baf8f7fc5c63c08915652ff97b883c8b49b78cbafbfe2db38` |
| https://organizzazione.cai.it/sez-brescia/wp-content/uploads/sites/7/2026/03/Trekking-delle-Orobie-2026.pdf | `pdf-text` | 0 | `448749a9a7e1151dd4ee0354421a7ef135008c8d7f04b63c1e2b7b3caf989da4` |
| https://organizzazione.cai.it/sez-brescia/wp-content/uploads/sites/7/2026/09/20260913-Punta-Setteventi.pdf | `pdf-text` | 0 | `8693e1b18454ecb54cb6c25f53aff2b9b1b85515566456b20aea4587055fd2a0` |
| https://organizzazione.cai.it/sez-brescia/ | `html-calendar` | 3 | `b47a9b09caa30a3db8dfa93f1dcad8860287fe6fd057a593c6b38a0becd902cc` |
| https://organizzazione.cai.it/wp-json/tribe/events/v1/events?start_date=2026-10-01&per_page=100 | `wordpress-events` | 0 | `6c0f37426b628d04f19d67bfa81b0c2cc8984cf143db381fc1c6fc5db4cf5825` |
| https://organizzazione.cai.it/sez-brescia/wp-content/uploads/sites/7/2025/12/Elenco-escursioni-trekking-CAI-SENIORES-anno-2026.pdf | `pdf-text` | 34 | `45efa6b8a661bae7755efe61304ce51dc76df064a390651a5c99ab1ea4b8834a` |
| https://organizzazione.cai.it/sez-brescia/2026/09/54corso-sci-di-fondo-escursionistico-anno-2026-2027/ | `nessun parser` | 0 | `1fa71d4c31404b527d117eae324b4e9f6c026c65daa43e0e7aa834f5dca18d40` |
| https://organizzazione.cai.it/sez-brescia/2026/10/gruppo-escursionistico-seniores-1997-settimana-escursionistica-invernale-a-moena-val-di-fassa-trentino-a-a/ | `nessun parser` | 0 | `d03dc298018c2768f8cf03a5020982b6703ece7ca322a7d5155336241ec72ad2` |
| https://organizzazione.cai.it/sez-brescia/2026/10/gruppo-escursionistico-seniores-1997-escursione-martedi-27-10-26-o-mercoledi-28-10-26-chiusa-val-isarco-bressanone-4-e-ultima-tappa-sentiero-del-castagno-trentino-a-a/ | `nessun parser` | 0 | `c046745f2d8e4b31fcc3265dbf4aefc1c2d9004ea52085a561ece26254ee3841` |
| https://organizzazione.cai.it/sez-brescia/2026/10/gruppo-escursionistico-seniores-1997-escursione-martedi-20-10-26-o-mercoledi-21-10-26-albino-anello-della-cornagera-monte-poieto-val-seriana-bg/ | `nessun parser` | 0 | `ceea3c406d49cab141bad56b0c8222b0ba5a7ffd4379e7a2da94fa86f12a667a` |
| https://organizzazione.cai.it/sez-brescia/attivita/ | `nessun parser` | 0 | `669b8e149ae6c9ccdcca400e71a833dd0c6b076d92e4c7d3b96b71e2e2a732c1` |
| https://organizzazione.cai.it/sez-brescia/attivita/scuola-adamello-tullio-corbellini/ | `nessun parser` | 0 | `b60e23aa9b90bcfbb2fb05733959eeb14faceb29f7e84031b8954bd3c7f9a3ac` |
| https://organizzazione.cai.it/sez-brescia/attivita/scuola-adamello-tullio-corbellini/corso-a1-alpinismo-base/ | `html-calendar` | 13 | `9e797bfa33b27e7f0840669e3787efa060361ab8ca5dc3596ae5a60eddc9d4c1` |
| https://organizzazione.cai.it/sez-brescia/attivita/scuola-adamello-tullio-corbellini/corso-acg1-cascate-di-ghiaccio/ | `nessun parser` | 0 | `759cc4485f1a39c23d21d0d77be7a2a40f054047a5681753594744676293a1b5` |
| https://organizzazione.cai.it/sez-brescia/attivita/scuola-adamello-tullio-corbellini/corso-sa1-scialpinismo-base/ | `html-calendar` | 10 | `85c30e51214ca08285cf94ffda6f86f78c7fc6b410808113b9ea72220bcab4c2` |
| https://organizzazione.cai.it/sez-brescia/attivita/scuola-adamello-tullio-corbellini/corso-sa2-scialpinismo-avanzato/ | `html-calendar` | 5 | `801abee4bc9924837cfa03297f0c0db3baa325b29942afaee6ec176df8da5a6c` |
| https://organizzazione.cai.it/sez-brescia/attivita/scuola-adamello-tullio-corbellini/corso-al1-arrampicata-libera-base/ | `html-calendar` | 5 | `a051a16858f2217a7158de781c9bf3fbe873744788966bd6603c7dc855bdc6a3` |
| https://organizzazione.cai.it/sez-brescia/attivita/scuola-adamello-tullio-corbellini/corso-al2-arrampicata-libera-avanzato/ | `nessun parser` | 0 | `7efa8be88747a85b66e11ddec6732b4b68c961194b01a027b54ad923b85dbb60` |
| https://organizzazione.cai.it/sez-brescia/attivita/scuola-adamello-tullio-corbellini/corso-ar1-arrampicata-su-roccia/ | `html-calendar` | 10 | `1b1c5886421d0678c2d3fd6476e5608ac7c5ecc0d4709b5ae55464f63113db57` |
| https://organizzazione.cai.it/sez-brescia/attivita/scuola-adamello-tullio-corbellini/corso-m-av-autosoccorso-in-valanga/ | `nessun parser` | 0 | `c80bc3ea09d2fba242cb5fb9bae495bf9b3e7feca3774271d25ef46bff481396` |
| https://organizzazione.cai.it/sez-brescia/attivita/scuola-adamello-tullio-corbellini/la-nostra-storia-2/ | `nessun parser` | 0 | `a69262798293b459057511dac533bfb938af03e3d6f8d8e1ee6669aa12dbb9e4` |
| https://organizzazione.cai.it/sez-brescia/attivita/gruppo-gite-alpinismo-gga/ | `nessun parser` | 0 | `52f8cffb847f5361de09e96bfae6f713fccda7e89dcdb928e2124a01f9031aa3` |

## Nuovi URL raggiunti oltre la lista del run02

- `https://organizzazione.cai.it/sez-brescia/2026/10/gruppo-escursionistico-seniores-1997-escursione-martedi-20-10-26-o-mercoledi-21-10-26-albino-anello-della-cornagera-monte-poieto-val-seriana-bg/`
- `https://organizzazione.cai.it/sez-brescia/2026/10/gruppo-escursionistico-seniores-1997-escursione-martedi-27-10-26-o-mercoledi-28-10-26-chiusa-val-isarco-bressanone-4-e-ultima-tappa-sentiero-del-castagno-trentino-a-a/`
- `https://organizzazione.cai.it/sez-brescia/attivita/`
- `https://organizzazione.cai.it/sez-brescia/attivita/gruppo-gite-alpinismo-gga/`
- `https://organizzazione.cai.it/sez-brescia/attivita/scuola-adamello-tullio-corbellini/`
- `https://organizzazione.cai.it/sez-brescia/attivita/scuola-adamello-tullio-corbellini/corso-a1-alpinismo-base/`
- `https://organizzazione.cai.it/sez-brescia/attivita/scuola-adamello-tullio-corbellini/corso-acg1-cascate-di-ghiaccio/`
- `https://organizzazione.cai.it/sez-brescia/attivita/scuola-adamello-tullio-corbellini/corso-al1-arrampicata-libera-base/`
- `https://organizzazione.cai.it/sez-brescia/attivita/scuola-adamello-tullio-corbellini/corso-al2-arrampicata-libera-avanzato/`
- `https://organizzazione.cai.it/sez-brescia/attivita/scuola-adamello-tullio-corbellini/corso-ar1-arrampicata-su-roccia/`
- `https://organizzazione.cai.it/sez-brescia/attivita/scuola-adamello-tullio-corbellini/corso-m-av-autosoccorso-in-valanga/`
- `https://organizzazione.cai.it/sez-brescia/attivita/scuola-adamello-tullio-corbellini/corso-sa1-scialpinismo-base/`
- `https://organizzazione.cai.it/sez-brescia/attivita/scuola-adamello-tullio-corbellini/corso-sa2-scialpinismo-avanzato/`
- `https://organizzazione.cai.it/sez-brescia/attivita/scuola-adamello-tullio-corbellini/la-nostra-storia-2/`

## Residui e limiti

- 1 issue di discovery: `Discovery budget reached; 13 candidate documents remain.`.
- Le due fonti già note in cooldown sono state saltate; il registro corrente può ripetere più volte la stessa causa quando la pagina è raggiungibile da più collegamenti, quindi le voci non sono fonti distinte.
- Duplicati cross-documento: orchestratore deduplica per ID; il report non fornisce un contatore affidabile di overlap. Non si deduce un numero dai totali estratti.
- L’origine e il tipo di punto sono richiesti per geolocalizzare, ma queste pagine di corso non riportano una località escursionistica e non sono stati fatti geocoding o lookup cartografici. Coordinate lasciate assenti.
- Nessuna scrittura a mano dei dati; nessun test, import, DB, commit o push eseguito dopo il run.

## Manifest

Il manifest sigilla i tre JSON backend; le copie frontend sono state confrontate byte per byte.
