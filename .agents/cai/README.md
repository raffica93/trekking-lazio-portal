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

## Stato di questo passaggio — 22 ottobre 2026

Branch `codex/cai-orchestrator-luna`. Checkpoint remoto corrente `0d08224ec4ebe5a104e38d8db8f20bdc58686363`; il checkpoint file Penne è pubblicato e verificato al commit `19548380898b52fcf867b6f9e3943d2556351ce4`. È completato il delta Campobasso: 2 places + 2 classificazioni riconciliati, ricevuta remota al commit `9bc54c5`. Il campione CAI Penne `cai-20261022-abruzzo-penne01` ha 0 nuovi ID, 8 righe identiche, 0 query/scritture DB; fonte partial (PDF discovery 60, HTML continuation 1). La pagina richiesta è la canonical già nota, con `method=null`: zero estrazioni non prova un calendario vuoto. Il run ha rigenerato metadata excursions, esplicitati nel report e nel relativo evidence manifest.

Test backend 205/205 sono passati dopo la raccolta Penne e i sei hash dei JSON pubblici sono rimasti stabili durante il test. Importer ha passato QA di manifest, report, sidecar, mirror e righe evento. Nessun batch nazionale o lotto storico viene ripetuto.

Orchestratore e due ruoli cai-collector/cai-importer sono richiesti/configurati GPT-6 Luna high; l'UI conferma la selezione dell'orchestratore, ma la telemetria runtime non attesta il modello effettivo. `OPENROUTER_API_KEY` è stata controllata solo come presenza booleana, senza lettura del valore, per il solo host `openrouter.ai`. Mercury non è stato chiamato nel campione Penne. Nessun merge, deploy, cron o cancellazione DB.

Dopo Penne il run CAI L'Aquila `cai-20261022-abruzzo-laquila01` ha provato una sola URL ufficiale e ricevuto HTTP 403; stop immediato, nessun retry/body/cache, nessun delta o DB. Il report chiarisce che lo status source-level mantiene la sorella `?commissioni=legale`; l'URL tentata è attestata dai sidecar. Il risultato L'Aquila e il registro 403 sono pubblicati/verificati al commit `d9fbdca0ab0cafdc4e8ca1c91c534df4a026b7cf`; il preflight offline ha escluso Abruzzo e Basilicata come fonti senza target distinto; il prossimo target è CAI Castrovillari in Calabria, URL ufficiale non letta `/prog.php`, limitata a una sola pagina dopo questo checkpoint.

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
