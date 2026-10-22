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

Branch `codex/cai-orchestrator-luna`; checkpoint remoto corrente `0fdd1dc79a9027bbd765095460173cb39b8660b4`. La classificazione completa del catalogo e i delta precedenti (incluso Valmadrera) sono chiusi e riconciliati; non ripetere gli import storici. Campania non ha al momento un URL distinto sicuro senza replay delle code bloccate.

Il run Cesena `cai-20261022-emilia-cesena-index01` ha letto una sola pagina ufficiale; la fonte resta `partial`, `method=null`, 0 estrazioni non equivale a calendario vuoto. 3.366 ID nazionali invariati, nessun delta o DB. QA importer PASS; backend `npm test` 205/205 e sei JSON pubblici invariati. Il checkpoint operativo dei file Cesena e del presente handoff deve essere pubblicato prima del prossimo fetch. Preflight offline ha selezionato un solo URL successivo, JPEG ufficiale 2026: `https://www.caicesena.com/images/download/2026/programma_2026_escursionismo_adattato_cai_cesena.jpg`, max1 documento/120s/concurrency1. I PDF annuale e giovani restano distinti e non vanno ripetuti.

Orchestratore e due ruoli `cai-collector`/`cai-importer` sono richiesti/configurati GPT-6 Luna high; l’identità/effort effettivi non sono attestati dalla telemetria runtime. Nessun merge, deploy, cron o cancellazione DB.

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
