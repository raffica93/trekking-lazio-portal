# Spazio operativo degli agenti CAI

Punto di ingresso per riprendere il progetto da una sessione cloud nuova, senza dipendere dal PC o dai file non pubblicati di una chat precedente.

**Visibilità:** questo spazio eredita quella del repository, attualmente pubblico. Non è un archivio privato. Conserva solo contesto di progetto ed evidenze pubbliche; credenziali, `.env`, cookie e conversazioni personali restano fuori da Git.

## Leggere all’avvio

1. [Obiettivi](OBJECTIVES.md), [Piano](PLAN.md), [Stato](STATE.json) e [Passaggio](HANDOFF.md).
2. [Decisioni](DECISIONS.md), [Registro errori](FAILURES.json), [Avanzamento regionale](REGIONS.md) e [Soluzioni verificate](LEARNINGS.md).
3. `AGENTS.md`, `docs/orchestratore-cai.md`, `docs/cai-italia.md` e `docs/procedura-pdf-cai.md`.

## Dove risiede ogni informazione

| Informazione | Fonte da usare |
|---|---|
| Codice, piano, contesto e checkpoint condivisi | Commit pubblicato sul branch GitHub |
| Stato e prove di un lotto | `backend/data/agent-runs/<run-id>/` |
| Catalogo corrente e copia statica | `backend/data/` e `frontend/public/` |
| Eventi effettivamente importati | Supabase, verificato con query e ricevuta |
| Rete, strumenti e accessi | Osservazioni del runtime cloud corrente |
| Segreti | Configurazione autorizzata dell’ambiente o connessioni già autorizzate |

## Passaggio corrente — 23 ottobre 2026

Branch `codex/cai-orchestrator-luna` verificato a `71a6e18fc51d8838f028fe6e58e548776f1c297d` (discendente da `50352f7`; include run Cesena e prove). Valmadrera07 (14 eventi + 14 classificazioni) e Fivizzano calendar01 (+4 +4) sono già consegnati; non ripetere i delta o il batch storico 3.336.

Cesena Attività01 è stato raccolto su una sola URL. Stato `partial / files ready / database pending`; il manifest e i mirror sono coerenti, catalogo 3.376→3.376, sei righe Cesena invariate. L’attribuzione del contenuto è HOLD: mancano body/cache e metadati HTTP, `method=null` e zero righe estratte non provano calendario vuoto. Importer ha dato PASS all’integrità, HOLD all’attribuzione. Nessun nuovo evento, classificazione o DB; quattro issue Cesena restano aperte. Backend `npm test` 206/206 dopo il run e sei JSON pubblici stabili.

Il checkpoint Cesena è pubblicato (`71a6e18`; handoff riallineato a `05302da`). Preflight FVG offline: 12 fonti abilitate/39 e 81 URL calendariali same-host, tutte già rappresentate nei documenti status/failure/run esaminati; nessun cache miss attestato, regione incompleta. Run Sora `cai-20261023-lazio-sora-programma01` ha letto la cache HTML da 75.149 B (SHA `59df2257b67d462f64ffe2eee243f28c02310d0ec52c135349bed3576c9ea742`): articolo datato 17 gennaio che annuncia il programma e punta al PDF sorella già OCR-failed/discovery9, non seguito. La pagina è leggibile ma non è il calendario; zero righe non prova assenza di uscite. Dieci ID esistenti invariati, zero delta/DB. Importer integrità PASS e copertura HOLD; backend test 206/206. Dopo checkpoint remoto, preflight offline di un'altra fonte Lazio o passaggio alla regione successiva. Runtime ha richiesto GPT-6 Luna high per orchestratore e i due ruoli esistenti cai-collector/cai-importer; telemetria effettiva non attesta modello/effort. Nessun DB accesso per Cesena, cron, merge, deploy o coordinate inventate.


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

## Stato operativo corrente — Fivizzano classification-ready (23 ottobre 2026)

Il run `cai-map-20261023-fivizzano01` è concluso sui soli quattro nuovi ID sigillati. Mercury richiesto `inception/mercury-decide`; tutte le quattro risposte attestano provider Inception e `response.model=inception/mercury-decide-20260930`. Conteggi grezzi: 3 trekking, 0 non trekking, 1 da verificare, 0 errori. Dopo QA semantica indipendente: 2 trekking, 0 non trekking, 2 da verificare; Lago Padule resta in revisione per mancanza di evidenza sul modo/itinerario. Importer PASS per delta-only, senza update/delete. Nessuna query o scrittura DB.

Input collection/evidence checkpointati al commit `3341fc9f4862bdb17a3592ba30111d422d5e1d26`; output classificato e documenti correnti sono in attesa del commit verificato dal branch dopo `b2d64f8dcbce1746d3aa54a76838887fe89c66f8`. Prossimo: pubblicare/verificare output, poi query read-only su schema/FK e quattro `source_id`, controlli conflitti e digest editoriale. Solo dopo il gate, import mirato e ricevuta. Raccolta Toscana resta parziale (10 righe, 4 ID candidati, un duplicato escluso); non inferire completezza o coordinate.

## Fivizzano classification checkpoint e preflight DB (23 ottobre 2026)

Output Mercury e QA indipendente sono pubblicati nel commit `2179e0c644c0af0031ebe0b22c256820a671d93f` (parent `b2d64f8dcbce1746d3aa54a76838887fe89c66f8`); branch e nove blob verificati. Run `cai-map-20261023-fivizzano01`, manifest `0bbe6dea10f07ded946bf19af714d6306ab1cc098b3c239361007d3fffc82b8b`, input `1aba5906e6a743318ecb63b82b733deca9263759e943710308352901e3b33334`, output `d07dfc27108dc38eee95ae35fac95e9ab66041806375db18968a522667c3d337`. Quattro ID classificati senza errori: candidati grezzi 3 trekking/0 non trekking/1 da verificare; dopo revisione 2 trekking/0 non trekking/2 da verificare. QA importer finale PASS.

Il preflight read-only Supabase del `2026-10-23T00:33:32.978008Z` ha osservato 4/4 target assenti sia in `places` sia in `place_classifications` (conteggi tabella: 4.423 places, 3.354 classifications). FK `place_classifications.source_id` punta a `places.source_id`; `places.geo_evidence` è presente. Nessun write eseguito. Prossimo passo: nuovo preflight immediato, poi eseguire soltanto `orchestrate import --delta-only --manifest` per questi quattro ID; importer inserisce eventi nuovi e classificazioni con conflitti ignorati, riconcilia titolo/stato/foto/coordinate e produce ricevuta. Non usare classifications-only: i place non esistono ancora.

## Delivery DB Fivizzano — 23 ottobre 2026

Preflight read-only aveva trovato 0/4 ID presenti. Dopo gate importer PASS, il canale Supabase MCP ha eseguito insert `ON CONFLICT DO NOTHING` applicando i row builder del repository: **4 places inseriti e 4 classificazioni inserite**, 0 conflitti, 0 update/delete, 0 coordinate. Query dopo: 4/4 places e classificazioni riconciliati; contatori DB 4.427 / 3.358 alle `2026-10-23T00:35:17.325134Z`. Record nuovi in stato `draft`; la mappa pubblica non è stata aggiornata né è avvenuto deploy. Receipt `backend/data/agent-runs/cai-map-20261023-fivizzano01/import-receipt.json`; source state ed evidence-manifest sono stati aggiornati per rendere il passaggio riprendibile.

Conteggi copertura Toscana: raccolta 10 righe verificate da 1 fonte ancora partial; +5 ID grezzi, 1 duplicato semantico escluso; classificazioni effective 2 trekking, 0 non trekking, 2 da verificare; database 4 inseriti/4 classificazioni. Due aggiornamenti sourceDocument-only non sono stati consegnati al DB. Fonti aperte: PDF annuale OCR/discovery 8, pagina calendario discovery 1. Nessun altro fetch in questo lotto.

## Ricevuta DB checkpointata e stato successivo

La ricevuta del delta Fivizzano, lo stato database completato e l’evidence seal aggiornato sono pubblicati a `52c9cd3a36e3128932fc4d140def45d01a021936`; ref remoto e 8 blob del commit verificati, manifest delle 5 prove passa hash/byte. Regione Toscana ancora partial per PDF OCR/discovery 8 e pagina discovery 1. Dopo questo checkpoint, il collector esistente esegue soltanto preflight offline per un target diverso già registrato come sicuro; niente replay del run Fivizzano.

## Preflight offline successivo — CAI Pescia (Toscana, 23 ottobre 2026)

Dopo aver chiuso il delta Fivizzano, il primo URL esatto e distinto work-ready è `https://www.caipescia.it/cp/calendario-attivita-cai-pescia/`, sezione `cai-pescia-9226026`. È elencato nel registry come URL di calendario ufficiale e collegato dalla homepage; la validazione locale di host e URL per lo scraper è PASS. Questa URL non compare in status documents, cache, run artifacts o FAILURES. La sorella mensile `?mo=8&yr=2026` ha un `discovery-budget-exhausted`: non ritentarla e non seguire link dal nuovo campione. Dopo checkpoint remoto selezione, max 1 documento/120s/concurrency 1.

Contesto Toscana da scrape-status persistito (non ricalcolato live): 37 registrate, 17 enabled — 9 partial, 5 unsupported, 1 failed, 1 ok, 1 no-upcoming — e 90 eventi nel catalogo locale. Fivizzano: +5 raw IDs, 1 duplicato escluso, 4 delivered places + 4 classifications in draft; 2 sourceDocument-only non consegnati. Restano aperti i tre failure Fivizzano.
