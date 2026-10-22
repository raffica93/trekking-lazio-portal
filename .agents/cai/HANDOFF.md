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
