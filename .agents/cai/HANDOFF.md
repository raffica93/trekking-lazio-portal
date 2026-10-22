# Passaggio operativo CAI — classificazione catalogo mappa

## Stato al 22 ottobre 2026

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

Dopo push e verifica del checkpoint di questo handoff, eseguire il run nuovo `cai-map-20261022-full01` con input sigillato, cache campione riutilizzata, concurrency 4 e rate 200 ms. Usare solo il modello Mercury attestato; fermare il batch su auth/quota/429 o modello non verificato. Non avviare raccolta Lombardia mentre il batch è in corso. Dopo output pronto, QA indipendente degli esclusi e dei dubbi, override con evidenza tracciabile, report e manifest, commit/push verificato. Solo dopo questo checkpoint l’importer può applicare la migration e l’upsert classification-only, senza modificare `places` o righe preesistenti. Verificare query/ricevuta e comportamento mappa; nessun deploy implicito.

La migration non è applicata e la tabella classificazioni non esisteva nell’ultima query. Il sito live non è stato controllato/aggiornato; le modifiche frontend mappa non sono state deployate. Il codice sul branch non equivale al comportamento in produzione.

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
