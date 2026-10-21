# Passaggio operativo CAI — checkpoint per la nuova chat cloud

## Destinatario e stato al 21 ottobre 2026

La prossima sessione operativa è la chat Codex Cloud `01a1604c-7018-7460-8316-df3c57dfd077`, “Orchestratore CAI cloud — ripresa regionale”. Questa sessione non la contatta. Il codice è pubblicato sul branch `codex/cai-orchestrator-luna` al commit `3469923fe6c21e28f2182753b7b5c4aa528baa91`; questo handoff sarà incluso nel commit documentale successivo. La nuova chat deve fare fetch e verificare il branch.

I due agenti autorizzati (`cai-collector` e `cai-importer`, configurati GPT-6 Luna high) hanno completato i rispettivi cambiamenti e sono idle/completed. Nessun terzo agente è stato creato. In questa sessione sono stati eseguiti solo test offline e query di lettura riferite dalla chat aggiornata: nessun run di raccolta/classificazione, nessun file catalogo classificato, nessuna migration o scrittura DB.

## Verifiche di questo checkpoint

- `cd backend && npm test`: 161 passati, 0 falliti dopo la correzione di “Escursione in bici” e l’aspettativa corretta sui messaggi provider sanitizzati.
- `cd frontend && npm test -- --watch=false`: 43 passati in 11 file.
- Il catalogo non è cambiato: `backend/data/excursions.json` e `frontend/public/excursions.json` hanno entrambi SHA-256 `1200e9a3921b606f341de413e34665b29fe91b5f6f86c5090c21d18effd12877`.
- Migrazione `place_classifications` preparata ma non applicata. La classification è separata da titolo, stato, foto e altri campi editoriali. La mappa filtra soltanto record con decisione trekking; errore/assenza classificazione non comporta esclusione automatica.
- Il modello è richiesto come `inception/mercury-decide` via `POST https://openrouter.ai/api/alpha/decisions`. La risposta live riferita non include `model`; il codice conserva `model_requested` e non inventa `response_model` o attestazione.
- L’utente riferisce dalla sessione aggiornata una smoke sintetica HTTP 200 e un’evaluation 12/12 casi sintetici, tutti HTTP 200, zero retry. SHA dell’artefatto dichiarato: `1217543a8ec74d875bc5d6243a0b3ae0b020c62d450f9c5160eba6e9a79fea7b`. Il file `/tmp/mercury-decide-live-evaluation-20261021.json` non è presente qui: non è incluso né attestato da questo checkpoint. Nessun dato reale del catalogo è stato valutato.
- Query in sola lettura riferita dall’utente, progetto `snwzxegtqnnuvlawnpgl`, 2026-10-21 21:11:27 UTC: 4.405 `places`, 4.346 published, 3.307 published con `date >= 2026-10-01`, nessuna tabella `classif`/`trek` trovata. Questi numeri sono una nuova osservazione esterna, non la baseline storica.

## Ripresa classificatore — non iniziare dal solo JSON

La UI legge da Supabase `places` pubblicati con `date >= Rome current-month start OR date_end >= start`, poi carica classificazioni per `source_id`. Il catalogo statico contiene 3.337 righe e non copre da solo tutta la popolazione attuale della mappa. Nella nuova chat esportare tramite connettore Supabase già autorizzato la popolazione DB effettiva della mappa, inclusi almeno `source_id`, titoli, descrizione/evidenze, date, URL e posizione disponibili. Non trasferire o creare chiavi.

Prima fare un run isolato di campione (una riga reale con fonte ufficiale/evidenza verificabile) e un controllo umano dei candidati esclusi e dubbi; poi classificazione idempotente completa, con manifest SHA-256 e output isolato. Il batch non può usare fallback offline per dichiararsi pronto. Usare decisioni conservative; errori, output invalidi e ambiguità restano da verificare. La 12-case sintetica non sostituisce questa QA.

Esempio per il run completo dopo la verifica del campione, usando file esportato e directory nuovi:

```bash
cd backend
MERCURY_DECIDE_ENABLED=1 OPENROUTER_ALLOWED_HOSTS=openrouter.ai npm run classify:catalog -- --input /path/db-map-candidates.json --output /path/cai-classify-map-20261021 --run cai-classify-map-20261021 --concurrency 2 --rate-ms 1000
```

La chiave deve essere già ereditata dal runtime; non metterla in CLI, file, log o report. Per campione e batch usare run ID distinti. Prima di migration/upsert verificare conteggi, esclusioni, dubbi, manifest, hash e checkpoint remoto. Importare soltanto risultati validi conservando deduplica `source_id` e campi amministrati. Verificare dopo con query DB e ricevuta. Nessuna cancellazione, merge o deploy.

## Raccolta regionale

La raccolta regionale rimane separata dalla classificazione mappa. La priorità corrente è Lombardia: lo snapshot del 20 ottobre riporta 229 sezioni, 125 controllate, 56 complete, 68 parziali, 1 irraggiungibile e 104 non verificate; 69 fonti parziali/irraggiungibili restano aperte. Sono dati storici aggregati, non nuova verifica live. Non aprire un’altra regione prima di un checkpoint circoscritto Lombardia; una fonte parziale resta aperta anche se i suoi eventi validi risultano importati.

Il lotto Piemonte `cai-20261020-piemonte-01` (commit storico `9919927`) resta la baseline, 3.337 ID e import storico +40. Non confondere con copertura nazionale completa.

## Ordine di ripresa

1. Fetch del branch e verifica di commit/status/test.
2. Usare la connessione Supabase già autorizzata per ricavare la popolazione completa corrente della mappa; non classificare soltanto il JSON statico.
3. Run campione reale Mercury, controllare evidenze e falsi positivi, salvare report.
4. Batch con output/manifest isolati, review indipendente e checkpoint remoto.
5. Applicare migration e upsert solo dopo il gate file pronti; preservare campi admin e verificare con query/ricevuta.
6. Riprendere un piccolo gruppo verificabile di fonti Lombardia, chiudere il relativo lotto prima di ampliare.

Dettagli macchina, baseline, osservazioni e test sono in `.agents/cai/STATE.json`; il registro storico dei problemi è `.agents/cai/FAILURES.json`, e la copertura regionale aggregata è `REGIONS.md`.
