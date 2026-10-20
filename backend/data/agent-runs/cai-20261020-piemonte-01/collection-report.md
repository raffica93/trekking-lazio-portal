# Raccolta CAI Piemonte — cai-20261020-piemonte-01

- Raccolta: `collection=partial`; file correnti: `2567`; file finali: `3337` eventi con ID unici.
- Stato di importazione: `database=completed`; 40 nuovi eventi confermati importati come `published` nel progetto autorizzato.

## Ricostruzione controllata del corpus

Il file locale di partenza conteneva 2,567 record e mancava una copia della baseline sigillata. Il confronto read-only fornito dall’importer ha identificato 833 righe `published` attive nel progetto `snwzxegtqnnuvlawnpgl` assenti dal file locale. Sono state ricostruite nel formato locale usando `source_id` come `id` locale e `cai_section_id` come `sourceId`, conservando i valori DB di `title`, `status`, `cover_image_path` (nel file come `coverImagePath`, tutti i valori di questo artifact sono null) e gli altri campi disponibili. L’UUID DB è conservato anche come `databaseId`.

La ricostruzione include inoltre 90 righe `published` attive DB-based che risultavano fuori dal vecchio manifest; il database non registra la provenienza per run, quindi sono conservate per sicurezza e non attribuite a questa raccolta. Una riga Roma mantiene il `dateEnd` locale 2026-10-03 anche se l’artifact DB contiene 2026-09-26: non è stato aggiornato il DB né sovrascritto il valore locale.

Composizione verificata: 3,337 = 2.464 record locali rimasti dopo QA dei 103 file-only + 833 record DB attivi ripristinati + 40 eventi Piemonte verificati nuovi. Dei 41 candidati con evidenza, uno (Monte Teggiolo, 4 ottobre) era già presente nel file locale con titolo corretto; è contato come duplicato locale, non come nuovo evento. I restanti 62 candidati sono stati esclusi per data errata, cancellazione, assenza di data/evento verificabile o estrazione intersezionale ambigua.

## QA dei 103 candidati file-only

- Confermati da fonti ufficiali: 41; nuovi aggiunti: 40; duplicato locale: 1.
- Esclusi: 62. L’elenco completo ID per ID, con URL ufficiale, motivazione, correzioni titolo/data e ID finale, è in `candidate-qa.json`.

Fonti con candidati esaminati:
- **cai-fossano-9212034** — status raccolta `ok`; 46 candidati: 0 nuovi, 0 duplicato locale, 46 esclusi.
  - URL: https://www.caifossano.it/documenti/2026_CAI-Fossano-Attivita.pdf
  - URL: https://www.caifossano.it/documenti/2026_Libretto-gite-Alpi-del-Sole.pdf
  - QA ID: cai-fossano-9212034-8fd7017579c4 (escluso); cai-fossano-9212034-7043f113f341 (escluso); cai-fossano-9212034-2f4662412720 (escluso); cai-fossano-9212034-1794a119525e (escluso); cai-fossano-9212034-e5cfaf5d0115 (escluso); cai-fossano-9212034-85a2a1480157 (escluso); cai-fossano-9212034-d26fdfc6f892 (escluso); cai-fossano-9212034-5be18f3e520a (escluso); cai-fossano-9212034-9c84f8af8813 (escluso); cai-fossano-9212034-3f4c6b1ac4c7 (escluso); cai-fossano-9212034-0bb901a8d12b (escluso); cai-fossano-9212034-65f73678a858 (escluso); cai-fossano-9212034-f678e6a83651 (escluso); cai-fossano-9212034-9c27e06daaca (escluso); cai-fossano-9212034-42466bde077d (escluso); cai-fossano-9212034-b42decb78215 (escluso); cai-fossano-9212034-73dbccea8420 (escluso); cai-fossano-9212034-b5d512598772 (escluso); cai-fossano-9212034-c8424686ead7 (escluso); cai-fossano-9212034-a92d56c212c4 (escluso); cai-fossano-9212034-aa36d8148c2d (escluso); cai-fossano-9212034-057e20a0e8bb (escluso); cai-fossano-9212034-f43a7a1848c9 (escluso); cai-fossano-9212034-13e20e22bb2b (escluso); cai-fossano-9212034-b9d7821f4657 (escluso); cai-fossano-9212034-2da3dc997814 (escluso); cai-fossano-9212034-49ca0dff084b (escluso); cai-fossano-9212034-a8e6d6781d69 (escluso); cai-fossano-9212034-b4b299be26b1 (escluso); cai-fossano-9212034-00984fda4adc (escluso); cai-fossano-9212034-5aaa794d6708 (escluso); cai-fossano-9212034-c7c83f57a0a0 (escluso); cai-fossano-9212034-566bcee9798b (escluso); cai-fossano-9212034-705148fc2362 (escluso); cai-fossano-9212034-9287947cd5e6 (escluso); cai-fossano-9212034-a15b0c583c59 (escluso); cai-fossano-9212034-def18d627201 (escluso); cai-fossano-9212034-9f35c7150669 (escluso); cai-fossano-9212034-da7510ff1866 (escluso); cai-fossano-9212034-6400b0c54202 (escluso); cai-fossano-9212034-a1346dce0001 (escluso); cai-fossano-9212034-579f66d6a755 (escluso); cai-fossano-9212034-0f1965654e7d (escluso); cai-fossano-9212034-573b3873fd25 (escluso); cai-fossano-9212034-254176c72611 (escluso); cai-fossano-9212034-77266fc72640 (escluso)
  - Evidenza/criterio: Official 2026 activity booklet gave annual 01-01/12-31 filler; shared four-column excursion PDF interleaved other CAI sections and OCR/text rows cannot be attributed safely.
- **cai-biella-9212005** — status raccolta `partial`; 3 candidati: 3 nuovi, 0 duplicato locale, 0 esclusi.
  - URL: https://www.caibiella.it/wp-content/uploads/2026/05/Programma-AG-2026-03-2026.pdf
  - URL: https://www.caibiella.it/wp-content/uploads/2025/11/2026-programma-GE.pdf
  - QA ID: cai-biella-9212005-fa46fce15572 → cai-biella-9212005-fa46fce15572; cai-biella-9212005-19590a31d222 → cai-biella-9212005-25279a2a772c; cai-biella-9212005-7cc61f2ce703 → cai-biella-9212005-7cc61f2ce703
  - Evidenza/criterio: Official CAI Biella 2026 AG/GE programs confirm listed date and section. The Oct 11 record title is normalized to the printed heading “CAI e CASB insieme”.
- **cai-cuorgne-9212072** — status raccolta `partial`; 3 candidati: 3 nuovi, 0 duplicato locale, 0 esclusi.
  - URL: https://cairivarolo.it/wp-content/uploads/2025/12/Annuario-gite-CAI-Alto-Canavese-2026.pdf
  - QA ID: cai-cuorgne-9212072-3fe1c38c061c → cai-cuorgne-9212072-3fe1c38c061c; cai-cuorgne-9212072-b976da09a42f → cai-cuorgne-9212072-b976da09a42f; cai-cuorgne-9212072-b7fc12d4eff1 → cai-cuorgne-9212072-b7fc12d4eff1
  - Evidenza/criterio: Official CAI Alto Canavese 2026 annual PDF has explicit “Sez. Cuorgnè” headings adjacent to the accepted date/title rows.
- **cai-settimo-torinese-9112022** — status raccolta `ok`; 1 candidati: 0 nuovi, 0 duplicato locale, 1 esclusi.
  - URL: https://www.caisettimotorinese.it/wp-content/uploads/2026/07/Pieghevole-CAI-interno_2026-2.pdf
  - QA ID: cai-settimo-torinese-9112022-aaa88d4bfed1 (escluso)
  - Evidenza/criterio: Official program date line states 04-05/07/2026, not October; the extracted Oct 4 date is a parsing error, so excluded.
- **cai-gozzano-9212037** — status raccolta `partial`; 6 candidati: 3 nuovi, 1 duplicato locale, 2 esclusi.
  - URL: https://www.caigozzano.it/
  - URL: https://www.caigozzano.it/media/attachments/2025/12/29/definitivo-attivita-escursioni-2026-pag-2.pdf
  - URL: https://www.caigozzano.it/attivita
  - QA ID: cai-gozzano-9212037-4d781f9a5c22 (duplicato: cai-gozzano-9212037-6f3d74ae0576); cai-gozzano-9212037-5a6ef3e32e72 (escluso); cai-gozzano-9212037-447712564973 → cai-gozzano-9212037-f87da440f936; cai-gozzano-9212037-fc6c1e47ed92 → cai-gozzano-9212037-1791b442bf6e; cai-gozzano-9212037-0bd5796fa873 → cai-gozzano-9212037-0bd5796fa873; cai-gozzano-9212037-8b56e54e8549 (escluso)
  - Evidenza/criterio: Official CAI Gozzano 2026 PDF gives exact program dates; Oct 4 Monte Teggiolo (already present locally under the corrected title), Oct 18 Family CAI, Oct 22–25 forest tour, and Nov 28 section anniversary. Oct 17 navigation fragment excluded.
- **cai-alba-9212064** — status raccolta `partial`; 4 candidati: 4 nuovi, 0 duplicato locale, 0 esclusi.
  - URL: https://organizzazione.cai.it/sez-alba/wp-content/uploads/sites/160/2025/12/Programma-2026.pdf
  - QA ID: cai-alba-9212064-f12f51a88cac → cai-alba-9212064-f12f51a88cac; cai-alba-9212064-aa0b9828aa2a → cai-alba-9212064-aa0b9828aa2a; cai-alba-9212064-cde4e46514ed → cai-alba-9212064-cde4e46514ed; cai-alba-9212064-ff0c0b6f6011 → cai-alba-9212064-98367b53c380
  - Evidenza/criterio: Official CAI Alba 2026 program PDF confirms dates/headings. Oct 18 title normalized to “Valle Grana - Narbona e Rocca Cernauda”.
- **cai-rivarolo-canavese-9212041** — status raccolta `partial`; 4 candidati: 4 nuovi, 0 duplicato locale, 0 esclusi.
  - URL: https://cairivarolo.it/wp-content/uploads/2025/12/Annuario-gite-CAI-Alto-Canavese-2026.pdf
  - QA ID: cai-rivarolo-canavese-9212041-11dd4eecdf2e → cai-rivarolo-canavese-9212041-11dd4eecdf2e; cai-rivarolo-canavese-9212041-0bd842d1ec29 → cai-rivarolo-canavese-9212041-0bd842d1ec29; cai-rivarolo-canavese-9212041-306fc9028e66 → cai-rivarolo-canavese-9212041-306fc9028e66; cai-rivarolo-canavese-9212041-4e36a13ccebb → cai-rivarolo-canavese-9212041-4e36a13ccebb
  - Evidenza/criterio: Official CAI Alto Canavese 2026 annual PDF rows explicitly marked “Sez. Rivarolo”.
- **cai-bardonecchia-9212052** — status raccolta `partial`; 1 candidati: 1 nuovi, 0 duplicato locale, 0 esclusi.
  - URL: https://www.caibardonecchia.it/wp-content/uploads/2025/10/CAI_Bardonecchia-PROGRAMMA_2026-V0.pdf
  - QA ID: cai-bardonecchia-9212052-2c9431cf8825 → cai-bardonecchia-9212052-2c9431cf8825
  - Evidenza/criterio: Official CAI Bardonecchia 2026 program, Oct 4 row explicitly names Punta Nera.
- **cai-cervasca-9212081** — status raccolta `partial`; 4 candidati: 0 nuovi, 0 duplicato locale, 4 esclusi.
  - URL: https://www.caicervasca.it/attivita/opuscolo-gite/2026?view=archive&month=9
  - QA ID: cai-cervasca-9212081-5ced2efacb8f (escluso); cai-cervasca-9212081-c33038f7abb3 (escluso); cai-cervasca-9212081-81c7f2c0aba1 (escluso); cai-cervasca-9212081-cd787e365220 (escluso)
  - Evidenza/criterio: Official source archive/news pages point to historical events and older courses; extracted 2026 dates are not supported by a 2026 schedule, so excluded.
- **cai-baveno-9212032** — status raccolta `ok`; 1 candidati: 1 nuovi, 0 duplicato locale, 0 esclusi.
  - URL: https://www.caibaveno.it/images/2026/programma-escursioni-cai-baveno-2026.pdf
  - QA ID: cai-baveno-9212032-dc206926f576 → cai-baveno-9212032-dc206926f576
  - Evidenza/criterio: Official CAI Baveno program verifies the Oct 10–11 Lake Garda event.
- **cai-stresa-9212030** — status raccolta `ok`; 1 candidati: 1 nuovi, 0 duplicato locale, 0 esclusi.
  - URL: https://www.caistresa.it/programma-2026.html
  - QA ID: cai-stresa-9212030-ab5515e678b4 → cai-stresa-9212030-ab5515e678b4
  - Evidenza/criterio: Official CAI Stresa 2026 program verifies the same co-organized Oct 10–11 Lake Garda event; retained only under its separately explicit section attribution.
- **cai-arona-9212018** — status raccolta `partial`; 2 candidati: 2 nuovi, 0 duplicato locale, 0 esclusi.
  - URL: https://caiarona.it/attivita/
  - QA ID: cai-arona-9212018-ee2948218533 → cai-arona-9212018-3405b5078bbe; cai-arona-9212018-f84cc5cbc834 → cai-arona-9212018-1f1db53c33c2
  - Evidenza/criterio: Official CAI Arona activity page explicitly lists Alpe Fornà on Oct 11 and Monte Torriggia on Oct 25; titles normalized to page headings.
- **cai-volpiano-9212053** — status raccolta `partial`; 1 candidati: 1 nuovi, 0 duplicato locale, 0 esclusi.
  - URL: https://organizzazione.cai.it/sez-volpiano/wp-content/uploads/sites/153/2026/03/2026_calendario_CAI_Volpiano.pdf
  - QA ID: cai-volpiano-9212053-0605fc42dcdd → cai-volpiano-9212053-0605fc42dcdd
  - Evidenza/criterio: Official CAI Volpiano program PDF confirms the Oct 11 Rifugio Gastaldi / Lago della Rossa itinerary.
- **cai-bussoleno-9212023** — status raccolta `ok`; 3 candidati: 1 nuovi, 0 duplicato locale, 2 esclusi.
  - URL: https://cai-bussoleno.it/images/Gite_2026/Gite_2026.pdf
  - QA ID: cai-bussoleno-9212023-738faca3a093 → cai-bussoleno-9212023-738faca3a093; cai-bussoleno-9212023-55728af9ba42 (escluso); cai-bussoleno-9212023-7d14f5b5ea13 (escluso)
  - Evidenza/criterio: Official CAI UGET Bussoleno program lists Oct 11 under its Escursionismo heading; itinerary is announced as follow-up flyer, so title remains generic and no details are inferred.
- **cai-acqui-terme-9212036** — status raccolta `partial`; 6 candidati: 6 nuovi, 0 duplicato locale, 0 esclusi.
  - URL: https://www.caiacquiterme.it/wp-content/uploads/2025/11/programma-2026.pdf
  - QA ID: cai-acqui-terme-9212036-e11e46843051 → cai-acqui-terme-9212036-e11e46843051; cai-acqui-terme-9212036-242c0eef9210 → cai-acqui-terme-9212036-242c0eef9210; cai-acqui-terme-9212036-b35150d2a562 → cai-acqui-terme-9212036-b35150d2a562; cai-acqui-terme-9212036-8e94b17ea49a → cai-acqui-terme-9212036-8e94b17ea49a; cai-acqui-terme-9212036-19b2218903e6 → cai-acqui-terme-9212036-19b2218903e6; cai-acqui-terme-9212036-c151b3a0b35a → cai-acqui-terme-9212036-40f1f91f27fc
  - Evidenza/criterio: Official CAI Acqui Terme 2026 program confirms all six dates and headings. Dec 11 title cleaned to “Serata Auguri di Natale” (footer excluded).
- **cai-savigliano-9212033** — status raccolta `ok`; 2 candidati: 1 nuovi, 0 duplicato locale, 1 esclusi.
  - URL: https://www.caisavigliano.it/files/depliant-CAI-2026.pdf
  - QA ID: cai-savigliano-9212033-6b1337c8082d (escluso); cai-savigliano-9212033-2883fe9622c8 → cai-savigliano-9212033-9b9487b34eba
  - Evidenza/criterio: Official CAI Savigliano program confirms Oct 28 “Anello di San Mauro da Brossasco - Valle Varaita”; title/date from neighboring columns corrected.
- **cai-chivasso-9212013** — status raccolta `partial`; 3 candidati: 2 nuovi, 0 duplicato locale, 1 esclusi.
  - URL: https://www.caichivasso.it/
  - QA ID: cai-chivasso-9212013-aecaa9273e71 (escluso); cai-chivasso-9212013-06abd444df15 → cai-chivasso-9212013-717b6b55563c; cai-chivasso-9212013-239ea183e237 → cai-chivasso-9212013-4c11be78437f
  - Evidenza/criterio: Official CAI Chivasso program page confirms Nov 5 “Immaginando 34: VISION” and Nov 13 “Immaginando: Ma perché le formiche?”.
- **cai-valenza-9212057** — status raccolta `partial`; 2 candidati: 1 nuovi, 0 duplicato locale, 1 esclusi.
  - URL: https://organizzazione.cai.it/sez-valenza/
  - QA ID: cai-valenza-9212057-6e33a4727fc8 → cai-valenza-9212057-2ee26ae7c12e; cai-valenza-9212057-2018859efe93 (escluso)
  - Evidenza/criterio: Official CAI Valenza homepage confirms Oct 17 Camogli–San Fruttuoso–Santa Margherita; duplicate generic “Prossima escursione sabato” row excluded.
- **cai-almese-9212061** — status raccolta `partial`; 1 candidati: 0 nuovi, 0 duplicato locale, 1 esclusi.
  - URL: https://www.caialmese.it/modules/tinyevent/index.php?ord=1
  - QA ID: cai-almese-9212061-5cd09c089f4e (escluso)
  - Evidenza/criterio: Official source labels the event cancelled due to bad weather; excluded.
- **cai-gruppo-speleologico-9112011** — status raccolta `ok`; 1 candidati: 0 nuovi, 0 duplicato locale, 1 esclusi.
  - URL: https://www.gsptorino.it/index.php/gite-e-corsi/
  - QA ID: cai-gruppo-speleologico-9112011-ebc5c6ab559a (escluso)
  - Evidenza/criterio: Official source describes only one outing in spring and one in autumn without a dated calendar or concrete title. Extracted Oct 24 is unverified; excluded.
- **cai-ovada-9212068** — status raccolta `partial`; 1 candidati: 1 nuovi, 0 duplicato locale, 0 esclusi.
  - URL: https://www.caiovada.it/eventi/
  - QA ID: cai-ovada-9212068-6df04f03c3bc → cai-ovada-9212068-6df04f03c3bc
  - Evidenza/criterio: Official CAI Ovada event page confirms Oct 25 Anello di Merana.
- **cai-susa-9212004** — status raccolta `partial`; 3 candidati: 2 nuovi, 0 duplicato locale, 1 esclusi.
  - URL: https://www.caisusa.it/
  - URL: https://www.caisusa.it/joomla/images/Programmi_gite/CAI-SUSA-programma_2026.pdf
  - QA ID: cai-susa-9212004-b9cb7b5eab57 (escluso); cai-susa-9212004-70e1caf489b6 → cai-susa-9212004-70e1caf489b6; cai-susa-9212004-10d1ea7b9b02 → cai-susa-9212004-10d1ea7b9b02
  - Evidenza/criterio: Official CAI Susa 2026 PDF confirms the Dec 13 and Dec 20 introductory cross-country skiing events; the Oct 25 page entry is explicitly cancelled and excluded.
- **cai-pino-torinese-9212078** — status raccolta `partial`; 1 candidati: 1 nuovi, 0 duplicato locale, 0 esclusi.
  - URL: https://www.caipinotorinese.it/eventi/?ical=1
  - QA ID: cai-pino-torinese-9212078-dec3f6c49d6a → cai-pino-torinese-9212078-dec3f6c49d6a
  - Evidenza/criterio: Official CAI Pino Torinese calendar ICS confirms Oct 25 Polentata al Rifugio Colle del Lys.
- **cai-forno-canavese-9212067** — status raccolta `partial`; 1 candidati: 1 nuovi, 0 duplicato locale, 0 esclusi.
  - URL: https://cairivarolo.it/wp-content/uploads/2025/12/Annuario-gite-CAI-Alto-Canavese-2026.pdf
  - QA ID: cai-forno-canavese-9212067-8e3247cecb0f → cai-forno-canavese-9212067-8e3247cecb0f
  - Evidenza/criterio: Official CAI Alto Canavese PDF row is explicitly marked “Sez. Forno”; Oct 25 title verified as Polentata at Rifugio Pagliero.
- **cai-pianezza-9212066** — status raccolta `ok`; 1 candidati: 1 nuovi, 0 duplicato locale, 0 esclusi.
  - URL: https://caipianezza.it/eventi/?ical=1
  - QA ID: cai-pianezza-9212066-a6275fadcf10 → cai-pianezza-9212066-a6275fadcf10
  - Evidenza/criterio: Official CAI Pianezza calendar ICS confirms Oct 31 “nodi&corde”, pratica in parete.
- **cai-g-e-a-t-9112020** — status raccolta `ok`; 1 candidati: 0 nuovi, 0 duplicato locale, 1 esclusi.
  - URL: https://www.geatcaitorino.it/wp-content/uploads/2024/12/Calendario-GEAT-2026.pdf
  - QA ID: cai-g-e-a-t-9112020-15c0ad5a3fec (escluso)
  - Evidenza/criterio: Official multi-column PDF extraction joined a February event description to a December date; page text does not support that pairing, so excluded.

## Verifiche e limiti

- JSON backend validato con `JSON.parse`; i mirror frontend di excursions, cai-sections e scrape-status sono byte-identici ai rispettivi file backend.
- I 833 record ricostruiti sono stati confrontati uno a uno su `source_id`/ID locale, titolo, status, cover e `cai_section_id`; nessuna discrepanza. Gli ID locali finali sono unici.
- Il manifest copre i sei JSON backend/frontend con SHA-256. Stato `files=ready` viene impostato solo dopo la verifica indipendente di hash, conteggi, parse e mirror.
- Le fonti non accessibili, non supportate e i residui della raccolta restano tali nel registro: questa ricostruzione ripara i dati pubblicati persi nel file, non dimostra copertura nazionale o completezza delle 40 fonti Piemonte.
- Nessuna riga preesistente è stata aggiornata; gli 833 record ricostruiti erano già presenti nel DB e sono rimasti intatti.


## Importazione e verifica Supabase

- Progetto autorizzato: `snwzxegtqnnuvlawnpgl`; manifesto a sei file verificato, SHA-256 del file `manifest.json`: `3824c028aea07417f599e6317cc845bf891f355b677289ed10821ec291aed7c6`.
- Precheck read-only sui 40 `confirmed-new finalId`: 40 assenti da `public.places.source_id`; i restanti 3.297 ID del corpus erano presenti e `published`.
- Import via Supabase MCP usando la trasformazione `toPlaceRow` dell’importer, `status=published`, `ON CONFLICT(source_id) DO NOTHING`: 40 inseriti, 0 aggiornati. Le righe esistenti, inclusi gli 833 record recuperati, non sono state modificate.
- Verifica SQL sui 40 ID: 40 presenti, 40 `published`, 0 `draft`, nessun mismatch su titolo/date/link/sezione/cover. Totali progetto dopo import: `places=4405`, `cai_sections=837`.
- Stato: `collection=partial`, `files=ready`, `database=completed`; la copertura CAI resta incompleta. Gli esatti 40 ID inseriti sono in `state.json#importResult.insertedSourceIds`.
