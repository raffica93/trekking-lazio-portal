# Raccolta Lombardia — CAI Brescia, run04

- Run `cai-20261022-lombardia-brescia04`; branch `codex/cai-orchestrator-luna`; checkpoint remoto pre-run `c46f8c8064795204ddec37f8e05f730b11d47194` verificato uguale a `origin/codex/cai-orchestrator-luna`.
- Perimetro unico: `cai-brescia-9216005`; orchestratore deterministico; concurrency 1; `SCRAPE_MAX_DOCUMENTS=39`; `SCRAPE_SOURCE_BUDGET_MS=240000`; una sola collect. Nessun test, import, DB, commit/push o altra sezione.
- Stato run: collection `partial`, files `ready`, database `pending`. La sola sezione Brescia resta `partial` con 51 eventi; 143 estrazioni documentali; aggiornamento `2026-10-22T18:56:33.228Z`.
- Documenti completati: 38 URL. Confrontando gli URL registrati col report run03: 26 già osservati nel run03 e 12 URL ulteriori visitati. Questo è un confronto degli URL nei file, non un contatore interno del runner. Un candidato aggiuntivo ha fallito HTTP 404; restano Discovery budget reached; 2 candidate documents remain..
- Delta catalogo rispetto al checkpoint run03: 0 nuovi ID Brescia, 0 record esistenti cambiati, 0 rimossi. Nessun record nuovo o mutato; non è stato fatto geocoding e nessun campo/località/coordinate è stato corretto manualmente.
- Estrazioni grezze: 143 rispetto a 136 nel run03 (+7); il runner non espone il count di dedup per documento, quindi non si attribuisce un numero di duplicati. Il catalogo non ha delta di ID.
- Cooldown: 66 issue ripetute per 2 URL 403 distinti; nessun retry. 1 entry `https://archivio.cai.it/sezione/brescia/calendario-iniziative/`; 65 entry `https://organizzazione.cai.it/sez-brescia/attivita/scuola-adamello-tullio-corbellini/chi-siamo-2/`.

## Copertura

| Sezione | Checked | Complete | Partial | Unreachable | Eventi nuovi verificati | Rimossi |
|---|---:|---:|---:|---:|---:|---:|
| CAI Brescia (`cai-brescia-9216005`) | 1 | 0 | 1 | 0 | 0 | 0 |

## Documenti completati

| Classe rispetto a run03 | URL | Metodo | Eventi estratti | SHA-256 |
|---|---|---|---:|---|
| già osservato in run03 | https://organizzazione.cai.it/sez-brescia/wp-content/uploads/sites/7/2026/02/Programma-Escursionismo-2026.pdf | `pdf-text` | 26 | `5cf9de44a727ec139ed73c330d90297d2f50ab1c3f23060c9a675455443641b1` |
| già osservato in run03 | https://organizzazione.cai.it/sez-brescia/eventi/?ical=1 | `nessun parser` | 0 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| già osservato in run03 | https://organizzazione.cai.it/sez-brescia/attivita/gruppo-juniores/juniores2026/ | `html-calendar` | 4 | `a9087f46e6167a9573dc22f57401a69d1c46fa4076f8c24af4590047fd1dc6f0` |
| già osservato in run03 | https://organizzazione.cai.it/sez-brescia/attivita/escursionismo/commissione-escursionismo/ | `html-calendar` | 26 | `a4ea631aa8c483bc6f8eea07b80de71dee6c20ff0ff22411ef09d63e60c1bd66` |
| già osservato in run03 | https://organizzazione.cai.it/sez-brescia/2025/12/gruppo-escursionistico-seniores-1997-calendario-escursioni-trekking-2026/ | `nessun parser` | 0 | `d22579c3ba7d4468fbffc58010feb7690f28f398434da40799c5e6a7cdb4b1be` |
| già osservato in run03 | https://organizzazione.cai.it/sez-brescia/wp-content/uploads/sites/7/2026/03/Trekking-delle-Orobie-2026.pdf | `pdf-text` | 0 | `448749a9a7e1151dd4ee0354421a7ef135008c8d7f04b63c1e2b7b3caf989da4` |
| già osservato in run03 | https://organizzazione.cai.it/sez-brescia/wp-content/uploads/sites/7/2026/09/20260913-Punta-Setteventi.pdf | `pdf-text` | 0 | `8693e1b18454ecb54cb6c25f53aff2b9b1b85515566456b20aea4587055fd2a0` |
| già osservato in run03 | https://organizzazione.cai.it/sez-brescia/ | `html-calendar` | 3 | `8e16b7bb070ba0949f5c3db9a29b9e10d682bcf8065c42d6f298b9489645a52e` |
| già osservato in run03 | https://organizzazione.cai.it/wp-json/tribe/events/v1/events?start_date=2026-10-01&per_page=100 | `wordpress-events` | 0 | `6c0f37426b628d04f19d67bfa81b0c2cc8984cf143db381fc1c6fc5db4cf5825` |
| già osservato in run03 | https://organizzazione.cai.it/sez-brescia/wp-content/uploads/sites/7/2025/12/Elenco-escursioni-trekking-CAI-SENIORES-anno-2026.pdf | `pdf-text` | 34 | `45efa6b8a661bae7755efe61304ce51dc76df064a390651a5c99ab1ea4b8834a` |
| già osservato in run03 | https://organizzazione.cai.it/sez-brescia/2026/09/54corso-sci-di-fondo-escursionistico-anno-2026-2027/ | `nessun parser` | 0 | `fbc408fe39a76c0c1f10c0a16e201b2bc15ab9bb5aa836edf4c77320c2048665` |
| già osservato in run03 | https://organizzazione.cai.it/sez-brescia/2026/10/gruppo-escursionistico-seniores-1997-settimana-escursionistica-invernale-a-moena-val-di-fassa-trentino-a-a/ | `nessun parser` | 0 | `74b556c4cd536da7a725ab8568b01a448c44e926de03bd26fbf57d6222e9e3a5` |
| già osservato in run03 | https://organizzazione.cai.it/sez-brescia/2026/10/gruppo-escursionistico-seniores-1997-escursione-martedi-27-10-26-o-mercoledi-28-10-26-chiusa-val-isarco-bressanone-4-e-ultima-tappa-sentiero-del-castagno-trentino-a-a/ | `nessun parser` | 0 | `d8b8c0c5bf5ee8b755c87160ac5e6d428e207da6d48f31776d36e80bbe66bd1c` |
| già osservato in run03 | https://organizzazione.cai.it/sez-brescia/2026/10/gruppo-escursionistico-seniores-1997-escursione-martedi-20-10-26-o-mercoledi-21-10-26-albino-anello-della-cornagera-monte-poieto-val-seriana-bg/ | `nessun parser` | 0 | `cea466502e4a7b74dc60a35ba10b1d4fa94cc536e61aac8cc49c374c740b9506` |
| già osservato in run03 | https://organizzazione.cai.it/sez-brescia/attivita/ | `nessun parser` | 0 | `085fee630370b5632a7755e620b724a62ade69a61c6900a2dc2ffa9ec8ecc3ad` |
| già osservato in run03 | https://organizzazione.cai.it/sez-brescia/attivita/scuola-adamello-tullio-corbellini/ | `nessun parser` | 0 | `f8e7b5d30364099d1a944df9cc6188c4783266ddd00ab1603a3afb76a47aa27d` |
| già osservato in run03 | https://organizzazione.cai.it/sez-brescia/attivita/scuola-adamello-tullio-corbellini/corso-a1-alpinismo-base/ | `html-calendar` | 13 | `4000f50bf4a89a81deacbfae3eaff4ee1bb86953aff1a87d13374784b411db76` |
| già osservato in run03 | https://organizzazione.cai.it/sez-brescia/attivita/scuola-adamello-tullio-corbellini/corso-acg1-cascate-di-ghiaccio/ | `nessun parser` | 0 | `f983c5b748ccd1a6935bfc7d70b676c23e6cde10a9a0eecae241e4fa50250663` |
| già osservato in run03 | https://organizzazione.cai.it/sez-brescia/attivita/scuola-adamello-tullio-corbellini/corso-sa1-scialpinismo-base/ | `html-calendar` | 10 | `0b1bd8341ccddde6046f1f479b4485ce552e52ecd5cdeaaee559da88837e1571` |
| già osservato in run03 | https://organizzazione.cai.it/sez-brescia/attivita/scuola-adamello-tullio-corbellini/corso-sa2-scialpinismo-avanzato/ | `html-calendar` | 5 | `661972b40ef3675d225ce1a0c11f4a24a753a8bccb652e9f12093fe4d69aa06a` |
| già osservato in run03 | https://organizzazione.cai.it/sez-brescia/attivita/scuola-adamello-tullio-corbellini/corso-al1-arrampicata-libera-base/ | `html-calendar` | 5 | `b08fa7fc387631e526d1e98881219b5651596224af3d3516b9303d391a58111a` |
| già osservato in run03 | https://organizzazione.cai.it/sez-brescia/attivita/scuola-adamello-tullio-corbellini/corso-al2-arrampicata-libera-avanzato/ | `nessun parser` | 0 | `e4872b04924efd54d7f141ac4ce8888f10a532643fba6ce2274c4ab2fd78ada4` |
| già osservato in run03 | https://organizzazione.cai.it/sez-brescia/attivita/scuola-adamello-tullio-corbellini/corso-ar1-arrampicata-su-roccia/ | `html-calendar` | 10 | `491929e1eeacf45bc3ef0aaf350bf7547325eb9f18333dbabf31357ca9d9ffc5` |
| già osservato in run03 | https://organizzazione.cai.it/sez-brescia/attivita/scuola-adamello-tullio-corbellini/corso-m-av-autosoccorso-in-valanga/ | `nessun parser` | 0 | `e8d8ee949e5c8be4923865b4675cc688cdad4daf21c9440a2d8f000ef46ba481` |
| già osservato in run03 | https://organizzazione.cai.it/sez-brescia/attivita/scuola-adamello-tullio-corbellini/la-nostra-storia-2/ | `nessun parser` | 0 | `ea0c116b5c8fc06dac138f78b08e19f35873753e4277e652e2e81d39db40678a` |
| già osservato in run03 | https://organizzazione.cai.it/sez-brescia/attivita/gruppo-gite-alpinismo-gga/ | `nessun parser` | 0 | `a70b57f60b0f9fda31941ef7bf5f54a640eca36de000cb54640bb22f49962f8b` |
| nuovo URL raggiunto | https://organizzazione.cai.it/sez-brescia/attivita/gruppo-gite-scialpinismo-ggs/ | `html-calendar` | 1 | `97c26925e7e54ffc26e12e65e5e3da6517dabd5b532ae114a7e2487d38df76b5` |
| nuovo URL raggiunto | https://organizzazione.cai.it/sez-brescia/attivita/gruppo-gite-scialpinismo-ggs/programmi-anni-precedenti/ | `nessun parser` | 0 | `640fb8303f3f0a96c0ce4465edcd12e68d0b39699accfb9ef32fbbead5c3df4a` |
| nuovo URL raggiunto | https://organizzazione.cai.it/sez-brescia/attivita/gruppo-juniores/ | `nessun parser` | 0 | `e916123e1983b8bd49a6fc3f98219bc816ab89313701c2b010b72c0b8721766c` |
| nuovo URL raggiunto | https://organizzazione.cai.it/sez-brescia/attivita/escursionismo/ | `nessun parser` | 0 | `41029cc4d531c2bdf4b53b02999dac874a0442f7ad91a32c28682ee18cc30278` |
| nuovo URL raggiunto | https://organizzazione.cai.it/sez-brescia/attivita/escursionismo/gpe-seniores-1987/ | `nessun parser` | 0 | `5e01c0a562cc74a3781c7e8205e49202bddffd034d50b15484711bc7911ef537` |
| nuovo URL raggiunto | https://organizzazione.cai.it/sez-brescia/attivita/escursionismo/gpe-seniores/ | `html-calendar` | 5 | `3e4a79b9a416793e034e92c630d08fee5940412c3e638f49105d8dc2075c7de4` |
| nuovo URL raggiunto | https://organizzazione.cai.it/sez-brescia/attivita/alpinismo-giovanile/ | `nessun parser` | 0 | `4885107c73594bdebb859d8e6715157c21834a0c2eedb7ef9322308dac4906ec` |
| nuovo URL raggiunto | https://organizzazione.cai.it/sez-brescia/attivita/commissione-sanitaria/ | `nessun parser` | 0 | `801a49b0d6ed9e7be906cfbf9bf24ececa3ba1c7c8dd5ef18bbf7910a1a01203` |
| nuovo URL raggiunto | https://organizzazione.cai.it/sez-brescia/attivita/scuola-di-sciescursionismo/ | `nessun parser` | 0 | `ac790e64fc5823840969edc6200d66bb55fa9f6af1a23859458b99bf6b358701` |
| nuovo URL raggiunto | https://organizzazione.cai.it/sez-brescia/attivita/tutela-ambiente-montano-tam/ | `html-calendar` | 1 | `8b0837dfb5a3bceb1cf545d9d8640330476434bbf4620b374fba2c9cd8ad010b` |
| nuovo URL raggiunto | https://organizzazione.cai.it/sez-brescia/attivita/tutela-ambiente-montano-tam/archivio/ | `nessun parser` | 0 | `d9e7533812842c9448065c02a6dad041436170dac582a2c8f7cb9b2fa2c365de` |
| nuovo URL raggiunto | https://organizzazione.cai.it/sez-brescia/attivita/escursioni-di-sci-fondo-escursionismo/ | `nessun parser` | 0 | `8826562fecebd64f9b6c126b433d0aab29079b6420c91ad96ad51728e95f04bf` |

## Errori e residui

- `http-removed` HTTP 404: `https://organizzazione.cai.it/sez-brescia/2025/11/programma-gite-ggs-gruppo-gite-scialpinismo-2026/` — Request failed with status code 404
- Discovery budget: `Discovery budget reached; 2 candidate documents remain.` URL indicato: `https://organizzazione.cai.it/sez-brescia/wp-content/uploads/sites/7/2026/02/Programma-Escursionismo-2026.pdf`.
- Le 66 voci `previous-unavailable-skipped` sono ripetizioni di due URL 403 distinti, non 66 fonti: 1 voce per `https://archivio.cai.it/sezione/brescia/calendario-iniziative/` e 65 per `https://organizzazione.cai.it/sez-brescia/attivita/scuola-adamello-tullio-corbellini/chi-siamo-2/`. Cooldown intatto, nessun retry.
- I 2 URL storici/di archivio restano nel perimetro solo attraverso i link della fonte; nel run04 il candidato GGS 2025 ha dato HTTP 404 e non è entrato nei documenti completati.

## Delta eventi e geolocalità

- Nessun record evento nuovo. Le pagine GGS, Seniores e TAM hanno prodotto solo estrazioni che si riconciliano con ID già presenti; nessun dato di località è stato aggiornato.
- Nessun lookup cartografico è stato fatto: nessun nuovo record da geolocalizzare. La sede CAI o il capoluogo non sono stati usati come sostituti di destinazioni.
- Record cinema `cai-brescia-9216005-3badd4cc403c` resta senza `durationHours`; catalogo e luogo non sono stati corretti a mano.

## Manifest e copie frontend

Il manifest sigilla `backend/data/excursions.json`, `backend/data/cai-sections.json` e `backend/data/scrape-status.json`; le copie frontend sono state confrontate byte per byte.
