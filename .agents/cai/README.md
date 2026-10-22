# Spazio operativo degli agenti CAI

Punto di ingresso per riprendere il progetto da una sessione cloud nuova,
senza dipendere dal PC o dai file non pubblicati di una chat precedente.

**Visibilità:** questo spazio eredita quella del repository, attualmente pubblico.
Non è un archivio privato. Conserva solo contesto di progetto ed evidenze pubbliche;
credenziali, `.env`, cookie e conversazioni personali restano fuori da Git.

## Leggere all'avvio

1. [Obiettivi](OBJECTIVES.md): risultato da ottenere e criteri misurabili.
2. [Piano](PLAN.md): passi ordinati, dipendenze e impedimenti osservati.
3. [Stato](STATE.json): fase attuale e riferimenti alla baseline verificata.
4. [Passaggio di consegne](HANDOFF.md): istruzioni per la prossima sessione cloud.
5. [Decisioni](DECISIONS.md): regole condivise da non riscoprire ogni volta.
6. [Registro errori](FAILURES.json): fonti/fasi osservate, tentativi effettivi
   quando noti, cooldown candidati e verifiche risolutive.
7. [Avanzamento regionale](REGIONS.md): stato aggregato dell'ultimo snapshot,
   con limiti e prossima regione da lavorare.
8. [Soluzioni verificate](LEARNINGS.md): solo correzioni con test e commit.

Completano il contesto `AGENTS.md`, `docs/orchestratore-cai.md`,
`docs/cai-italia.md` e `docs/procedura-pdf-cai.md`.

## Dove risiede ogni informazione

| Informazione | Fonte da usare |
|---|---|
| Codice, piano, contesto e checkpoint condivisi | Commit pubblicato sul branch GitHub |
| Stato e prove di un lotto | `backend/data/agent-runs/<run-id>/` |
| Catalogo corrente e copia statica | `backend/data/` e `frontend/public/` |
| Eventi effettivamente importati | Supabase, verificato con query e ricevuta |
| Rete, strumenti e accessi della sessione | Osservazioni del runtime cloud corrente |
| Segreti | Configurazione autorizzata dell'ambiente o connessioni già autorizzate |
| Cache e temporanei OCR | Ricostruibili; non sono l'unica copia di una prova |

Una modifica non committata non è un checkpoint condiviso. Un commit locale non
è pubblicato finché il push non è confermato. La persistenza della stessa chat
non dimostra che una chat nuova possa recuperare il lavoro.

## Stato di questo passaggio

Checkpoint al 22 ottobre 2026, branch `codex/cai-orchestrator-luna`. Il codice è stato pubblicato e verificato ai commit `902a180` e `3f93525`; il campione reale Mercury `cai-map-20261022-sample02` è completo, revisionato e sigillato. Il campione ha 20/20 richieste HTTP riuscite, senza errori provider. Dopo QA indipendente i valori effettivi sono 5 `trekking`, 3 `non_trekking`, 12 `da_verificare`; le decisioni Mercury candidate restano registrate separatamente dai sei override QA.

L’export fresco per `cai-map-20261022-full01` contiene 3.336 righe e 3.336 `source_id` univoci, osservato il 22 ottobre alle 17:25:59 UTC, SHA-256 `2963f287c4ccedb20a70068b2551dad3565b264d871194ec91324d0f98bb0687`. La query DB alle 17:27:56 ha trovato 4.346 pubblicati, 3.336 nella mappa secondo `date >= 2026-10-01 OR date_end >= 2026-10-01`, e nessuna tabella classificazioni. Batch completo e scritture DB non sono ancora iniziati. Il file campione/cache, input completo, report, manifest, stato e registro errori vengono salvati nel repository prima del batch.

Il runtime attuale è connesso, rete enforced, osservazioni correnti; `OPENROUTER_API_KEY` risulta pronta solo per `openrouter.ai` ed è stata controllata soltanto come presenza booleana. Il modello richiesto è `inception/mercury-decide`; nel campione il provider ha attestato `inception/mercury-decide-20260930`. UI e configurazione chiedono GPT-6 Luna high per orchestratore e i due agenti; il runtime non espone telemetria del modello effettivo. Tesseract italiano manca (solo `eng`/`osd`).

La baseline storica resta `cai-20261020-piemonte-01` / `9919927`, 3.337 ID e 40 nuovi eventi Piemonte; il run OCR pending non la sostituisce. Lombardia resta aperta con i soli conteggi storici riportati nel handoff. Nessun merge, deploy, cron o cancellazione DB.

## Responsabilità

- Orchestratore: aggiorna questo spazio, assegna il run, verifica i checkpoint e
  registra il prossimo passo. È l'unico autore di `STATE.json` e `HANDOFF.md`.
- `cai-collector`, `gpt-6-luna`: fonti, parser, raccolta, file ed evidenze del lotto.
- `cai-importer`, `gpt-6-luna`: verifica del passaggio file/DB, import e ricevuta.
- La classificazione Mercury usa solo `inception/mercury-decide` e l'endpoint
  Decisions documentato. La sessione aggiornata separata ha riferito una smoke sintetica live riuscita; questo checkout non ha effettuato chiamate live e il relativo artefatto di 12 fixture non è qui.

Non duplicare qui il catalogo o l'intero stato di tutte le fonti: usare riferimenti
ai lotti. I modelli per sessioni e ricevute sono in [templates](templates/).
I modelli vuoti non attestano operazioni eseguite.

## Chiusura di ogni sessione

Aggiornare stato e prossimo passo, salvare i file necessari, eseguire commit e
push sul branch di lavoro e verificare il commit remoto. Se il push fallisce,
registrare il blocco e conservare un artifact recuperabile; non chiamare il lavoro
"online". Nessun cron, nessun merge o deploy implicito.
