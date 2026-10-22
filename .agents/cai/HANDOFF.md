# Passaggio operativo CAI — classificazione catalogo mappa

## Stato al 22 ottobre 2026 — storico fino alla classificazione completa

Branch `codex/cai-orchestrator-luna`, repository `raffica93/trekking-lazio-portal`. Il checkpoint precedente è stato recuperato e il branch remoto aggiornato. I commit di codice `902a180` e `3f93525` sono stati pushati e letti di nuovo da origin. Non sono state fatte scritture DB.

La sessione ha usato l’orchestratore GPT-6 Luna high richiesto; l’utente ha confermato la selezione UI. L’API di stato cloud mostra runtime connesso, rete enforced, osservazioni correnti e segreto `OPENROUTER_API_KEY` pronto solo per `openrouter.ai`. La chiave non è stata letta o stampata. Per Mercury si usa soltanto POST `https://openrouter.ai/api/alpha/decisions`, modello richiesto `inception/mercury-decide`; il campione ha ricevuto e attestato `inception/mercury-decide-20260930`. L’identità/effort runtime di Luna non è esposta dalla telemetria.

I due soli agenti autorizzati, `cai-collector` e `cai-importer`, entrambi configurati Luna high, hanno completato i compiti indicati sotto. Tesseract 5 dispone solo di `eng` e `osd`; OCR italiano resta indisponibile. Nessun cron, merge o deploy.

## Codice e test

- Commit `902a180`: arresto del lotto su HTTP 401/402/403/429 e risposta con modello non verificato; attese in corso concluse ma non si avviano nuove POST. Gli errori restano sanitizzati e il run parziale/non importabile.
- Commit `3f93525`: l’import classification-only conserva `candidate_decision`/`candidate_category` Mercury e registra `decision`/`category` effettive più `review_metadata`; primo caricamento preserva conflitti, migration usa FK `ON DELETE RESTRICT`, RLS/ruoli restano abilitati.
- Backend `npm test`: 173/173; test specifici importer 28/28. Frontend 43/43 su 11 file dopo le modifiche mappa già presenti nel commit precedente. Cataloghi pubblici invariati: entrambi SHA-256 `1200e9a3921b606f341de413e34665b29fe91b5f6f86c5090c21d18effd12877`.

## Campione reale e QA

Run `cai-map-20261022-sample02`: 20 righe, 20 HTTP success, 0 errori, modello attestato per le risposte. Input SHA-256 `7b6cc657343149a10dad55faab3928cef35049638dada7f08da301b1021c6631`. Catalogo dopo QA SHA-256 `4c6fee6b09bf6f5cba10dc627e3dd53494ed0098a4fa230b6555b48a35c9c760`; stato SHA-256 `12f3c02e4d7b1a2f9cec1562a7848fcf1466573f60602772ece2c64e281efe5a`; manifest SHA-256 `1ca628106e2af3b12143c786a0886df842d65398463c4b875ca74a186ca9a7bc`; report QA SHA-256 `0ebedcc73665812e413fc331cbc4107dd14468079aeec8639f89d09019b7a509`.

Il collector ha verificato 18 fonti su 20; i due link 404 sono Lago di Limo (SAT Cavalese) e Castagnata in Casera Ceresera (CAI Sacile). I 6 override tracciati nel catalogo sigillato sono: Sacile non provato → `da_verificare`; Santuario di Monte Tranquillo ad Alatri → `da_verificare` per data non corrispondente (record 10 ottobre vs calendario 22 febbraio); pranzo attribuito ad Arosio → `da_verificare` perché il PDF attribuisce a Seregno; Castagnata a Crocette → `da_verificare` perché il PDF attribuisce a Piedimulera; Omegna → `trekking/a piedi` in base al PDF Est Monte Rosa (difficoltà E), con luogo indefinito e coordinate nulle; parete CAI Vimodrone → `non_trekking` perché il PDF la descrive come attività indoor settimanale. Rimangono intatti i candidati Mercury originali. Alatri Monte Gemma, Napoli, Varese e Padova hanno riscontro ufficiale; i punti di partenza/itinerari non deducibili restano senza coordinate nuove.

Esito effettivo campione: 5 trekking, 3 non-trekking, 12 da verificare. Il QA ha escluso soltanto attività sociali o indoor supportate; i casi con fonte 404 o attribuzione dubbia non sono esclusioni. L’importer ha validato le 20 righe dal manifest. DB non toccato.

## Input completo e prossimi passi

Query Supabase osservata il 22 ottobre 2026 alle 17:27:56 UTC: 4.346 pubblicati totali; 3.307 con `date >= 2026-10-01`; 3.300 con `date_end >= 2026-10-01`; 3.336 unici soddisfano l’OR effettivo; tabella `place_classifications` assente. Export via Data API osservato alle 17:25:59 UTC: 3.336 righe, 3.336 source ID univoci, SHA-256 `2963f287c4ccedb20a70068b2551dad3565b264d871194ec91324d0f98bb0687` in `backend/data/agent-runs/cai-map-20261022-full01/input.json`. La query e l’export sono distinti per osservazione e metodo; i conteggi sono osservazioni correnti, non la baseline storica.

Piano iniziale completato e superato: `cai-map-20261022-full01` è stato sigillato, verificato, importato classification-only e riconciliato. La ricevuta DB e i conteggi osservati sono nella sezione successiva; non usare questo paragrafo come istruzione operativa corrente.

La migration è stata applicata e verificata nella ricevuta successiva. Il sito live non è stato controllato/aggiornato; le modifiche frontend mappa non sono state deployate. Il codice sul branch non equivale al comportamento in produzione.

## Baseline distinta

La baseline storica resta run `cai-20261020-piemonte-01`, commit `9919927`, 3.337 ID e 40 nuovi eventi Piemonte. `cai-20261020-piemonte-ocr-01` è un run OCR pending, non baseline da reimportare. Lombardia rimane la regione aperta; ultimo handoff storico: 229 sezioni, 125 controllate, 56 complete, 68 parziali, 1 irraggiungibile, 104 non verificate e 69 fonti parziali/irraggiungibili. Questi sono conteggi storici, non risultati query attuali.


## Checkpoint classificazione completa — 22 ottobre 2026

Il run `cai-map-20261022-full01` è completo e pronto per checkpoint/import: input da 3.336 candidati effettivi della mappa, 3.336 ID univoci e allineati, 0 errori. Query di sola lettura Supabase alle 18:12:15.676 UTC: 4.405 `places`, 4.346 pubblicati, 3.336 nella mappa con predicate `published AND (date >= 2026-10-01 OR date_end >= 2026-10-01)`, tabella classificazioni assente. Latest `places.updated_at` osservato: 2026-10-20 11:51:23.239637 UTC. Nessuna scrittura DB.

Modello richiesto `inception/mercury-decide`, risposta attestata `inception/mercury-decide-20260930`, policy `cai-trekking-v2`. Run 4 concurrency / 200 ms, una ripresa idempotente; il final output rigenerato sullo stesso input ha 0 errori. Mercury è non deterministico: i valori da usare sono quelli nel manifest finale, non i conteggi della prima generazione.

| Classificazione | Candidati Mercury | Valore effettivo dopo QA |
|---|---:|---:|
| Trekking | 973 | 969 |
| Non trekking | 478 | 9 |
| Da verificare | 1.885 | 2.358 |

QA collector indipendente: 157 dei 462 candidati `non_trekking` originari revisionati in 11 gruppi fonte; 8 esclusioni con riscontro diretto, 5 falsi negativi corretti a trekking, 27 righe miste/mismatch e 117 inconclusive mantenute `da_verificare`; 305 non esaminate puntualmente. Gli altri candidati non trekking senza prova individuale sono conservati come `da_verificare`. 43 overlay di gruppo conservativi e 6 riscontri dal campione reale (conteggi review totali 496). Importer ha indipendentemente PASS-validato manifest, conteggi, unicità/allineamento, alias/snapshot e override.

Artifact da pubblicare: input `2963f287c4ccedb20a70068b2551dad3565b264d871194ec91324d0f98bb0687`; catalogo effettivo `e3c5d5b09d268bdc43fdeff4a91b67054fd9e8d75e04eeb00042bfe75969aa5c`; stato run `180c28394488e942d7c31b5715b7103d2ce5f1105aef718b6a03d054586fbf10`; manifest `5d7b2423edcad5f116c6e375bc8897139cba371e3bbae525ac24a0f74d83ce98`; QA report `0f828750cda80138c2d32599be0154e80033a6938601692e40ffc22152cb310a`. Fixture QA: `backend/test/fixtures/cai-map-20261022-full01-source-qa.json`; test: `backend/test/full-classification-source-qa.test.js`. Backend `npm test`: 174/174; cataloghi backend/frontend invariati, SHA256 `1200e9a3921b606f341de413e34665b29fe91b5f6f86c5090c21d18effd12877`.

Un artefatto intermedio dell’overlay si è ridotto a un record per errore di preparazione input. È stato ripristinato dall’input completo e dalla cache prima del QA, rigenerato e poi verificato dall’importer; non è avvenuta alcuna scrittura DB. I due backup corrotti sono stati rimossi.

**Gate:** nessuna migration o import prima che commit e push del checkpoint file siano riletti su `origin/codex/cai-orchestrator-luna`. Dopo il push, applicare solo la migration `place_classifications` e inserire record classificazione mancanti; conflitti preesistenti restano intatti, nessuna UPDATE/DELETE su `places`. Usare Supabase MCP perché `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` non sono presenti nel runtime backend. Fare query digest/invarianti immediatamente prima e dopo, salvare ricevuta recuperabile in un checkpoint successivo, poi soltanto riprendere Lombardia. Nessun deploy, merge o scheduler.


## Ricevuta database e ripresa Lombardia — 22 ottobre 2026

Dopo il checkpoint remoto `0ae5b14e61b0dd8b49fa503ee08eedc13696b2e7`, applicata via Supabase MCP migration `create_place_classifications_20261021090000`, migration version `20261022181444`. La tabella era vuota alla verifica 18:15:02 UTC. Sono stati inseriti 3.336/3.336 record classificazione, con `ON CONFLICT DO NOTHING`; conflitti preservati: 0. L’import è classification-only: nessun `UPDATE`/`DELETE` o altra write su `places`.

La riconciliazione post-import ha confrontato ogni colonna applicativa della tabella con l’output sigillato in 84 batch SQL: 3.336 matched, 0 mismatches. Query fresca 18:20:59.696 UTC: 4.405 places, 4.346 published, 3.336 righe nella mappa (3.336 source ID univoci), 3.336 classificate. Valori effettivi: 969 trekking, 9 non trekking validi, 2.358 da verificare; review metadata su 496. Il default app rende visibili 3.327 righe (trekking + dubbi), esclude soltanto 9 non trekking confermati; 0 righe senza classificazione. Modello richiesto `inception/mercury-decide`; tutte le 3.336 righe sono attestate come `inception/mercury-decide-20260930`. RLS attivo e FK `ON DELETE RESTRICT`.

Invarianti editoriali prima/dopo: digest ordinato di `id,title,status,cover_image_path` identico `5ed97ae6d6fa8274e66663ba66f28a45`; max `places.updated_at` identico `2026-10-20T11:51:23.239637Z`. Nessuna modifica a titolo, stato, foto, località o coordinate. Nessun delete. Nessun deploy: codice filtro mappa è sul branch ma il sito live non è stato aggiornato. Nessun merge, cron o deploy.

Il checkpoint DB è registrato in `.agents/cai/STATE.json`; prossimo passo riprende Lombardia, ultima regione aperta, a campioni circoscritti e una sezione per volta. Storico handoff: 229 sezioni, 125 controllate, 56 complete, 68 parziali, 1 irraggiungibile, 104 non verificate; sono valori storici, non una query attuale. Nessuna raccolta si è sovrapposta al batch o import.


## Ripresa operativa — Lombardia/Brescia, 22 ottobre 2026

Il checkpoint classificazione è chiuso e riconciliato nel DB come riportato sopra. L’istanza cloud corrente è connessa, rete enforced, `OPENROUTER_API_KEY` presente e limitata a `openrouter.ai` (controllo booleano; il valore non è stato letto). La UI conferma GPT-6 Luna high per orchestratore/agenti, ma la telemetria runtime non attesta il modello effettivo. Mercury resta separato dalla raccolta geografica.

Run `cai-20261022-lombardia-brescia02` (source `cai-brescia-9216005`): `collection=partial`, `files=ready`, `database=pending`. Sono stati osservati 12 URL, una sola sezione, 44 eventi risultanti e 93 estrazioni documentali registrate; restano 14 candidati discovery. Il run non ha aggiunto nuovi ID rispetto al risultato corretto: nel confronto con il checkpoint `6d0bd13`, il catalogo ha un solo nuovo ID Brescia (`cai-brescia-9216005-3badd4cc403c`), 0 rimozioni, 0 modifiche esistenti e 3.338 ID unici. La card CAI ufficiale attesta una serata cinema il 21 ottobre; è stato rimosso il falso `durationHours=26`, senza inferire luogo o coordinate. Questo evento resta fuori dal DB finché la classificazione e il trattamento sicuro non siano definiti.

Il bug del parser era il match del suffisso `26 ore` dentro `2026 ore 20,45`. La regex ora richiede un confine numerico a sinistra. Fixture `backend/test/fixtures/cai-brescia-cinema-time.json`, test `backend/test/scraper.test.js`; suite backend completa 175/175. QA read-only indipendente importer: PASS, manifest/hash/copie backend-frontend corretti, nessuna modifica alle righe esistenti. Manifest SHA `092ad634fd84e60a307349661026423e18a2fd1e75c4422f5b936ab973dded77`; report SHA `7c65412514a18d03cc08c230e5fca09bfc8d1ddc8afd8351f1c91453abe1d852`. Run01 è uno snapshot superato e non importabile.

Le 13 occorrenze `previous-unavailable-skipped` del report rappresentano 2 URL storici HTTP 403 (12 voci Scuola Adamello e 1 archivio), saltati per cooldown e non ritentati. Resta inoltre un problema discovery-limit con 14 documenti. Nessuna raccolta su altre sezioni. Il pipeline ha aggiornato anche alcuni contatori derivati nello stato globale: ciò non significa che quelle fonti siano state ricontrollate. La tabella `REGIONS.md` distingue questi dati dal conteggio storico.

**Passi separati:** raccolta completa solo per il perimetro limitato del run; file pronti/verificati; test passati; commit/push da completare; import DB in attesa e da non eseguire per il record cinema senza classificazione; copertura Lombardia ancora aperta (1 parziale, 0 complete, 0 irraggiungibili nel campione corrente). Prossimo: pubblicare il checkpoint, poi un nuovo run circoscritto ai residui Brescia, senza ampliare la regione. Nessun merge, deploy o cron.

## Run03 — campione Brescia e correzione parser, 22 ottobre 2026

Run `cai-20261022-lombardia-brescia03` ha ricontrollato una sola sezione (CAI Brescia) con 26 documenti, 51 eventi di sezione e 136 righe estratte. Esito `collection=partial`, `files=ready`, `database=pending`: +7 ID, 0 modifiche e 0 rimozioni; totale catalogo 3.345 ID unici. Il manifest SHA-256 è `17106240bf08667584315cb48922060c00c673e265c7cc898adfaf57a75f3ec3`, il report SHA-256 `d4dec037f4c99b299b9d3c0ea64c92dd21432213d9264e9af22fba5f28f54388`. Le copie backend/frontend di `excursions.json` e `scrape-status.json` coincidono byte per byte. Importer QA indipendente: PASS; nessuna query o scrittura DB.

Il run ha raggiunto 14 URL oltre i 12 già osservati; la discovery si è fermata con 13 candidati residui. Le 42 voci di cooldown sono due URL distinti già soggetti a HTTP 403 (41 + 1), senza nuovi tentativi. L'errore parser sul suffisso dell'anno è risolto e coperto da fixture, test e commit `cb7148f`. Non sono stati identificati duplicati per ID; il report non consente una misura affidabile di sovrapposizione semantica.

I sette nuovi eventi provengono da pagine CAI ufficiali, ma non attestano coordinate di partenza/cima/area escursionistica. Due citano la sede come sala d'incontro: non è stata usata come destinazione. Coordinate assenti e posizione da verificare. La patch importer aggiunge provenienza geospaziale strutturata, conserva coordinate curate/parziali e salta nuovi eventi senza classificazione valida; fixture e suite backend `178/178` passano. La migration `20261022200000_places_geo_evidence.sql` è soltanto nel checkpoint proposto e non è applicata al DB.

**Stati indipendenti:** raccolta parziale; file pronti e verificati; commit/push del run03 e patch importer in attesa; import DB pending e non avviato; copertura corrente = Lombardia 1 sezione controllata, 0 complete, 1 partial, 0 irraggiungibili. Il checkpoint remoto `831e031808af7bdd01508e83afd023b02f6ae7d5` è stato verificato. Prossimo: solo run04 limitato ai 13 residui Brescia. Nessun merge, deploy o cron.

## Run04 — aggiornamento Brescia, 22 ottobre 2026

Checkpoint di partenza `c46f8c8064795204ddec37f8e05f730b11d47194`, checkout remoto verificato. Un solo `init` e una sola `collect` per `cai-brescia-9216005`, concurrency 1, massimo 39 documenti e 240 s. Esito `collection=partial`, `files=ready`, `database=pending`. Il confronto indipendente di due report trova 38 URL completati: 26 sovrapposti al run03, 12 nuovi; 143 estrazioni contro 136 del run03. Brescia resta partial con 51 eventi in status e 2 candidati residui. Report SHA `5fd661f1ad357553cf8e7c4945da1be935845b56b7786f0ea8d8cd564a6b24b6`; manifest SHA `97ee22d3b78840a6327b7869bbad8139481457239cbf6b9282bbdde688a10ff5`.

Delta catalogo rispetto al checkpoint: 3.345 ID unici prima e dopo, 0 aggiunte, 0 rimozioni, 0 modifiche; nessun nuovo punto geografico da classificare o geolocalizzare. Sezione: 1 controllata, 0 complete, 1 partial, 0 unreachable; nuovi eventi verificati 0, duplicati ID esclusi 0, duplicati semantici non stabiliti. Issue: 66 skip cooldown ripetuti su 2 URL storici HTTP 403 (nessun retry); un URL annuale di GGS ha restituito HTTP 404 e resta senza sostituto accertato; discovery-limit con 2 residui. Importer QA indipendente PASS, senza DB; backend `npm test` dopo la raccolta 178/178; copie backend/frontend e catalogo invariati dopo i test.

**Stati indipendenti:** raccolta parziale; file pronti/verificati; checkpoint run04 `1d73684492ffdf330f7ac8bb43b39d16ddcf096b` pushato e verificato; DB pending e non scritto; copertura Lombardia limitata a Brescia, ancora parziale. Prossimo: ricostruire offline i due URL residui e svolgere run05 solo su Brescia, evitando retry dei due URL 403.

## Run05 — esaurimento coda Brescia, 22 ottobre 2026

Run `cai-20261022-lombardia-brescia05`, una sola collect e solo la sezione `cai-brescia-9216005`, concurrency 1, massimo 40 documenti/240 s, nessun retry-failed. Il checkpoint di partenza era `273fcb67894a192895cc688e27675abe3843156b`. Sono stati registrati 40 documenti e 143 estrazioni; i due residui run04 sono stati entrambi raggiunti. Esito `collection=partial`, `files=ready`, `database=pending`; discovery-limit assente. Il catalogo resta a 3.345 ID: 0 aggiunte, 0 modifiche e 0 rimozioni. QA importer indipendente PASS; nessun accesso o scrittura DB.

Il PDF ufficiale “Programma escursioni 2026” del fondo è stato estratto (una pagina, 40 righe) e verificato manualmente: le sole date riportate sono 1 febbraio, 5–8 febbraio, 22 febbraio e 8 marzo 2026, tutte passate al 22 ottobre. Lo zero di eventi futuri è quindi un calendario letto correttamente. La pagina `/category/attivita/` non ha parser; il suo zero estrazioni non viene trattato come calendario vuoto. Nessun nuovo evento o punto geografico è stato creato.

La sezione Brescia resta parziale esclusivamente per 3 URL distinti già non disponibili: 2 con storico HTTP 403 e il permalink GGS con HTTP 404 nel run04. Run05 contiene 69 voci `previous-unavailable-skipped` (1 archivio 403, 67 scuola 403, 1 permalink GGS 404); non è stato ritentato nessun URL. Il parser discovery non segnala più candidati. Il report sigillato con la verifica manuale ha SHA `315eda0b3c37eae0e5d2e5e693729f7f1d7d1c8b3233f131d9c08d77f2409ee2`; il manifest è `d3088019fa7840f7002b472611207356e237b662350c135d7861cd4475fc17e6`.

**Stati indipendenti:** raccolta parziale per cooldown; file pronti/verificati; checkpoint run05 `92ac86393416325560e753e43b8bd022741cb708` pubblicato e verificato; DB pending e non toccato; Lombardia resta la regione corrente. Run05 `92ac86393416325560e753e43b8bd022741cb708` è pubblicato e verificato. Preflight 2026-10-22: CAI Varese (`cai-varese-9216009`) resta bloccata: l’endpoint storico 503 è di nuovo eleggibile dopo il cooldown e verrebbe pianificato dal collector standard; non c’è esclusione puntuale. Nessuna richiesta è stata fatta. Scegliere un’altra fonte ufficiale in Lombardia dopo preflight della sua coda. I 3 URL Brescia restano in cooldown. Suite backend dopo raccolta: 178/178; copie backend/frontend identiche.


## Run Valmadrera — `cai-20261022-lombardia-valmadrera01`

Dopo il preflight read-only che ha bloccato Varese per il retry 503, è stato eseguito un singolo campione CAI Valmadrera, run ID univoco, concurrency 1, massimo 12 documenti e 120 s. Stato `collection=partial`, `files=ready`, `database=pending`; una sezione controllata: 0 complete, 1 parziale, 0 irraggiungibili. Sono state elaborate 12 fonti/documenti; la sezione riporta 7 eventi e 8 estrazioni per documento. Tutti i 7 record erano già presenti identici al baseline Git; delta catalogo 0 aggiunte/rimozioni/modifiche su 3.345 ID unici. Il conteggio di duplicati tra estrazioni non è disponibile nel rapporto sorgente; nessun nuovo punto o attribuzione geografica. La discovery è scesa da 24 a 7 candidati; zero errori HTTP osservati nel campione, ma i 7 candidati residui restano da verificare, quindi non dichiarare calendario vuoto.

Backend `npm test` dopo la raccolta: 178/178. Manifest `0156a229ef3e776af9f1b373d9e355e93960ae062249df11cb45d1dc97d0271a`, report `7862920ad009f600de515810382dd3f72a9d15b4c70b604eaa868386e657d02d`. Copie backend/frontend dei tre file sigillati identiche. Nessun accesso DB e nessun import, coerentemente con delta catalogo zero. File/report pronti per checkpoint Git; poi un altro campione Valmadrera circoscritto. I conteggi regionali complessivi sono ancora lo snapshot del 20 ottobre.

Il checkpoint Valmadrera è stato pubblicato e verificato su `origin/codex/cai-orchestrator-luna` al commit `a6c27b5a5e835a6f3ac2ef3b525acf2162d6bdc0` alle 2026-10-22T19:17:43Z. Prossimo passo: un solo campione Valmadrera delimitato a 12 documenti/120 s, poi QA indipendente e test backend dopo la raccolta.


## Run Valmadrera 03 — `cai-20261022-lombardia-valmadrera03`

Campione bounded: 20 documenti/180 s, concurrency1, 19 righe estratte per documento, 7 eventi fonte già esistenti, delta catalogo 0 su 3.345 ID. Cinque dei sette candidati residui precedenti sono stati raggiunti; rimangono non visitati `/eventi/oggi/` e `/eventi/elenco/?eventDisplay=past`. La navigazione ha scoperto ulteriori pagine e lascia 23 candidati: la sezione è ancora partial, senza errori HTTP nel campione. L’esatta deduplicazione tra righe estratte non è esposta; report non inventa un conteggio. Run02 aveva ripetuto i primi 12 documenti senza progresso e non è un checkpoint autonomo; run03 contiene la fotografia valida per il prossimo checkpoint. Import DB non necessario a delta zero. Report SHA `befb8a7914e6d6dbe835b9d56678a22e8c3f984bcb132a23ffd8e3d2ec61b255`, manifest SHA `5370bb422bcb39ef0b44a31f1379f98d066aaaeb49a311d0f9bcd3eb45466897`. Prossimo passo dopo QA e test: run04 max40 documenti/240 s sulla stessa fonte; verificare l’URL effettivamente raggiunto e non assumere esaurita la coda.

Run03 file/report checkpoint verificato su `origin/codex/cai-orchestrator-luna` al commit `9045ec84b981193669deaa2e82dd075c3609cf6d`. QA importer PASS; backend tests 178/178 dopo la raccolta. Ora procede run04 Valmadrera, singola sezione, massimo 40 documenti/240 s/concurrency1.


## Run Valmadrera 04 — `cai-20261022-lombardia-valmadrera04`

Campione da 40 documenti/240 s, concurrency 1. Sono state trattate 40 pagine e registrate 41 estrazioni; i 7 eventi di sezione restano invariati e il catalogo è 3.345 ID unici, delta 0. Le pagine giornaliere fino al 17 ottobre sono state raggiunte; la coda discovery scende da 23 a 12. Nessun errore HTTP osservato, ma la fonte resta partial e le 12 candidate non visitate non sono considerate vuote. Nessuna geolocalizzazione, query o scrittura DB. Report SHA `fd1776b3354afaa3575c048d8db5a421dec2b45180fa2305ba9948c7081d709b`, manifest SHA `e7df409743d2265e64d0862abfcd24d4be02c8e9a01e9690f6ff97385cd6c6f6`. Prossimo passo: QA/test/checkpoint, poi un unico campione bounded sulla stessa fonte se utile.

Run04 importer QA PASS; backend npm test 178/178 after collection. The default crawl restarts at the same 40-document prefix, so run05 must wait for a tested, explicit same-host URL continuation mechanism; do not repeat the same prefix or call the queue complete.

Continuation correction checkpoint: commit `20dbaf2e1b8a8b6f63c97efe2d3e96c06bc6910c` adds repeated `--source-url` scoped to exactly one source, official-host/redirect validation, and persisted retry state. Focused tests 40/40; backend suite 186/186. It has not yet been used on a live regional collection. Next run05 applies only the 12 URLs documented in the run04 report, max20 documents/180s/concurrency1; no DB import at zero catalog delta.


## Run Valmadrera 05 — `cai-20261022-lombardia-valmadrera05`

Run limitato a una sezione, 20 documenti/180 s, concurrency 1, con 12 URL ufficiali passati esplicitamente tramite `--source-url`. Tutti i 12 target sono stati raggiunti; 8 documenti ICS aggiuntivi sono stati scoperti e letti, per 20 documenti e 34 righe estratte. Il calendario restituisce 7 eventi già noti. Sezione `partial`: restano 38 candidati discovery. Non ci sono errori HTTP nel run; non dichiarare la fonte completa o vuota.

Confronto file con `c5036ff`: catalogo 3.345 ID unici, 0 aggiunti, 0 rimossi, 5 record esistenti modificati. Le modifiche sono limitate a URL `sourceDocument` ufficiali e descrizioni più brevi in due record (367→209 e 357→200 caratteri Unicode); titoli, date, stato editoriale, copertine e campi geografici sono invariati. Zero ID duplicati nel catalogo; sovrapposizione/deduplica delle righe documentali non esposta dal collector. Nessuna nuova coordinata o attribuzione; nessuna query o scrittura DB. Non serve reimportare classificazioni già complete.

Manifest SHA `f88571727bbbcda6dceec0c5205f3da7dfdc95c4c1a70897444daf33f092e2a2`, report SHA `cc50445c9c91cedef90a672e4f0809ac7074fe6275b787ab8154f74e142cfb25`. Hash cataloghi backend/frontend identici e stabili dopo `npm test` backend 186/186. QA indipendente importer PASS; nessuna operazione DB. Stato separato: raccolta parziale, file pronti, database pending/non necessario per delta eventi zero.

Ricostruzione offline della discovery dai 20 body cache conferma i 38 candidati residui. Sono identificati feed calendario correnti/futuri e categorie `/attivita/escursioni/`, `/attivita/gite-sociali-di-scialpinismo/`; candidati da lasciare fuori: API root con attribuzione incerta, archivio esplicitamente passato, programma 2024 e quattro feed iCal di escursioni datate nel passato. `/attivita/valma-street-block-2026/` resta incerta. Dopo il checkpoint run05, il prossimo campione sarà limitato a massimo 8 documenti sui soli feed correnti/futuri e categorie pertinenti, senza candidati storici o di attribuzione incerta. Varese resta bloccata per cooldown 503 scaduto; nessuna richiesta è stata fatta. Lombardia rimane la sola regione attiva.


## Run Valmadrera 06 — `cai-20261022-lombardia-valmadrera06`

Dopo checkpoint remoto run05 `f00a1e4eb4eaea4a2eb916578ba1d6dce7e3d377`, è stata eseguita una sola fonte Valmadrera con 8 URL espliciti, concurrency 1, massimo 8 documenti e budget 180 s. Tutti gli URL sono stati raggiunti; 8 righe estratte sono state riconciliate a 7 eventi unici, con 1 riga duplicata esclusa. Il run resta `collection=partial`, `files=ready`, `database=pending`: discovery-limit lascia 19 candidati associati al calendario PDF ufficiale. Nessun errore HTTP della fonte nel run e nessun'altra sezione tentata.

Confronto catalogo: 3.345 ID unici, 0 aggiunti, 0 rimossi, 5 record esistenti cambiati. Quattro cambi solo `sourceDocument`; Moregallo `e2177dd44e1a` ha inoltre descrizione più completa. Titoli, date, fine date, stato, foto, località e coordinate sono invariati. Nessun dato geografico aggiunto, nessuna query o scrittura DB; non si reimportano classificazioni già complete. Importer QA PASS; backend `npm test` 186/186; copie backend/frontend identiche e stabili dopo i test.

Report SHA `42837b9104b440128911a879b2a0b9adcda54699eaf5983835f7b4f5dc0ff082`; manifest SHA `f673039b1a8b2286067637a9ddb524c04868656bc1a6e6505b2ac6252934d64d`. Il report dettaglia gli otto URL e gli hash dei body. Prossimo passo, dopo checkpoint remoto: valutare una sola richiesta esplicita al PDF ufficiale 2026 se distinto e non ancora visitato; massimo 1 documento, mantenendo cache in caso di errore. Varese e altri run restano fermi.
