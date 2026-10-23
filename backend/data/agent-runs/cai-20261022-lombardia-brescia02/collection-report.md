# Raccolta Lombardia — campione CAI Brescia, verifica parser durata

- Run: `cai-20261022-lombardia-brescia02` (22 ottobre 2026), unica fonte `cai-brescia-9216005`; concurrency 1; `SCRAPE_MAX_DOCUMENTS=12`; `SCRAPE_SOURCE_BUDGET_MS=120000`; un solo `collect`.
- Esito orchestratore: `collection=partial`, `files=ready`, `database=pending`. Raccolta deterministica senza Gemini. Cache esistente riutilizzata; nessun test in parallelo, nessun DB/import, commit o push.
- Copertura del perimetro: CAI Brescia è l'unica sezione controllata in questo run: 0 complete, 1 partial, 0 unreachable. Sono elencati 12 URL/documenti osservati dalla fonte; questo non equivale a 12 sezioni né a copertura completa. Gli stati delle altre fonti conservati nell'indice globale non sono stati ricontrollati da questo run.
- Stato Brescia: `partial`, 44 eventi, 93 estrazioni documentali registrate, aggiornato `2026-10-22T18:30:08.856Z`. Limite discovery raggiunto: 14 documenti candidati residui sul programma ufficiale. Nessuna espansione oltre la fonte assegnata.
- 13 voci di errore `previous-unavailable-skipped` rappresentano 2 URL distinti già in cooldown per precedenti HTTP 403: 12 voci per la pagina della Scuola Adamello e 1 per il calendario dell'archivio CAI. Nessun nuovo tentativo è stato fatto su tali URL; i contatori non rappresentano 13 fonti distinte.

## Verifica del record Brescia

- ID `cai-brescia-9216005-3badd4cc403c`, titolo `Serata Cinema Nuovo Eden – CAI Brescia – The Wall of Shadows – mercoledì`, data 2026-10-21.
- La pagina CAI ufficiale `https://organizzazione.cai.it/sez-brescia/` contiene la card e il permalink `https://organizzazione.cai.it/sez-brescia/2026/10/serata-cinema-nuovo-eden-cai-brescia-the-wall-of-shadows-mercoledi-21-ottobre-2026-ore-2045/`; il testo alt riporta `Serata Cinema Nuovo Eden – CAI Brescia – The Wall of Shadows – mercoledì 21 ottobre 2026 ore 20,45`.
- Nel record aggiornato data, titolo, descrizione e fonte corrispondono alla card ufficiale. `durationHours` è assente: `ore 20,45` è l'orario dell'evento, non una durata. Il parser non inventa luogo, coordinate o categoria specifica; conserva `Località da verificare`, coordinate unknown e categoria generica `Attività CAI`. Non è stata fatta una correzione manuale del catalogo.
- La correzione parser/test è in `backend/scraper.js`, `backend/test/scraper.test.js` e fixture `backend/test/fixtures/cai-brescia-cinema-time.json`; il test mirato 13/13 era stato eseguito prima di questo run. Nessun test ha girato durante la raccolta.
- ID nuovo in questa verifica: 0. Il record preesistente viene ora estratto senza il valore anomalo `durationHours=26` del run01; nessun campo editoriale o coordinata è stato cambiato manualmente. Il run01 resta uno snapshot storico non importabile.

## Documenti osservati

| URL | Metodo | Eventi estratti | SHA-256 |
|---|---|---:|---|
| https://organizzazione.cai.it/sez-brescia/wp-content/uploads/sites/7/2026/02/Programma-Escursionismo-2026.pdf | `pdf-text` | 26 | `5cf9de44a727ec139ed73c330d90297d2f50ab1c3f23060c9a675455443641b1` |
| https://organizzazione.cai.it/sez-brescia/eventi/?ical=1 | nessun parser | 0 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| https://organizzazione.cai.it/sez-brescia/attivita/gruppo-juniores/juniores2026/ | `html-calendar` | 4 | `4adef65f8fdab03013d351abb6dbc748b34fca5be3496b525baf0082b51f0803` |
| https://organizzazione.cai.it/sez-brescia/attivita/escursionismo/commissione-escursionismo/ | `html-calendar` | 26 | `6f0482e9793cd499b1bd9cf93480c818dbe4199a6a810f82297f6267bc8ca6ea` |
| https://organizzazione.cai.it/sez-brescia/2025/12/gruppo-escursionistico-seniores-1997-calendario-escursioni-trekking-2026/ | nessun parser | 0 | `42ba122dcbcd584ac4a8bd1bfc300949376d4d6ccfb354f38f448eb299eb02ab` |
| https://organizzazione.cai.it/sez-brescia/wp-content/uploads/sites/7/2026/03/Trekking-delle-Orobie-2026.pdf | `pdf-text` | 0 | `448749a9a7e1151dd4ee0354421a7ef135008c8d7f04b63c1e2b7b3caf989da4` |
| https://organizzazione.cai.it/sez-brescia/wp-content/uploads/sites/7/2026/09/20260913-Punta-Setteventi.pdf | `pdf-text` | 0 | `8693e1b18454ecb54cb6c25f53aff2b9b1b85515566456b20aea4587055fd2a0` |
| https://organizzazione.cai.it/sez-brescia/ | `html-calendar` | 3 | `ed1cc00ad68cf4cb3d5e8cb9c223848c024fc51c70e1ec146b36048c9ecc4ed2` |
| https://organizzazione.cai.it/wp-json/tribe/events/v1/events?start_date=2026-10-01&per_page=100 | `wordpress-events` | 0 | `6c0f37426b628d04f19d67bfa81b0c2cc8984cf143db381fc1c6fc5db4cf5825` |
| https://organizzazione.cai.it/sez-brescia/wp-content/uploads/sites/7/2025/12/Elenco-escursioni-trekking-CAI-SENIORES-anno-2026.pdf | `pdf-text` | 34 | `45efa6b8a661bae7755efe61304ce51dc76df064a390651a5c99ab1ea4b8834a` |
| https://organizzazione.cai.it/sez-brescia/2026/09/54corso-sci-di-fondo-escursionistico-anno-2026-2027/ | nessun parser | 0 | `27b919abf1a39a664b43b836286725a713b67caf5bd30ec9b5caef17529a186b` |
| https://organizzazione.cai.it/sez-brescia/2026/10/gruppo-escursionistico-seniores-1997-settimana-escursionistica-invernale-a-moena-val-di-fassa-trentino-a-a/ | nessun parser | 0 | `0085f5fc4d07962c48be2784ecf973a4cc1a047e9daac85ea234c583db879916` |

## Prossimo passo

La correzione del parser è verificata sul caso reale e su un controllo positivo per durata esplicita. Il run resta parziale e non è importato; per chiudere la fonte occorre pianificare un successivo run limitato ai 14 candidati residui, senza ampliare il perimetro.
