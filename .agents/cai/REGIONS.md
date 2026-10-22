# Avanzamento regionale CAI

Snapshot storico delle fonti: 2026-10-20T08:09:26.672Z. Non è una nuova verifica live. Le sezioni provengono dal registro (837 record); gli stati/eventi sono l’ultimo report salvato per fonte (838 righe, una non agganciata al registro).

"Controllate" significa che esiste uno stato aggiornato nel report; "complete" = ok/reused/no-upcoming; "parziali" include unsupported; "irraggiungibili" = failed o senza stato. "Open" conta fonti partial/unreachable, non issue atomiche. "Disabilitate" non sono state verificate. Gli eventi sono conteggi aggregati dichiarati dal report, non auditati di nuovo; i duplicati conteggiano solo ID evento identici esclusi, non duplicati semantici.

| Regione | Sezioni | Controllate | Complete | Parziali | Irraggiungibili | Disabilitate/non verificate | Eventi nel report | ID duplicati esclusi | Open | Prossimo tentativo |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| Abruzzo | 31 | 23 | 9 | 12 | 2 | 8 | 122 | 0 | 14 | In coda; nessuna automazione pianificata |
| Basilicata | 4 | 4 | 1 | 3 | 0 | 0 | 8 | 0 | 3 | In coda; nessuna automazione pianificata |
| Calabria | 9 | 6 | 2 | 4 | 0 | 3 | 95 | 0 | 4 | In coda; nessuna automazione pianificata |
| Campania | 17 | 10 | 3 | 7 | 0 | 7 | 381 | 0 | 7 | In coda; nessuna automazione pianificata |
| Emilia-Romagna | 29 | 14 | 0 | 14 | 0 | 15 | 79 | 0 | 14 | In coda; nessuna automazione pianificata |
| Friuli-Venezia Giulia | 39 | 28 | 15 | 12 | 1 | 11 | 173 | 0 | 13 | In coda; nessuna automazione pianificata |
| Lazio | 31 | 19 | 3 | 16 | 0 | 12 | 333 | 0 | 16 | In coda; nessuna automazione pianificata |
| Liguria | 26 | 5 | 2 | 3 | 0 | 21 | 28 | 0 | 3 | In coda; nessuna automazione pianificata |
| Lombardia | 229 | 125 | 56 | 68 | 1 | 104 | 503 | 0 | 69 | Lotto corrente: audit circoscritto dopo il checkpoint codice |
| Marche | 16 | 12 | 2 | 10 | 0 | 4 | 35 | 0 | 10 | In coda; nessuna automazione pianificata |
| Molise | 4 | 1 | 0 | 1 | 0 | 3 | 43 | 0 | 1 | In coda; nessuna automazione pianificata |
| Piemonte | 113 | 83 | 22 | 59 | 2 | 30 | 241 | 0 | 61 | In coda; nessuna automazione pianificata |
| Puglia | 5 | 5 | 1 | 4 | 0 | 0 | 3 | 0 | 4 | In coda; nessuna automazione pianificata |
| Sardegna | 7 | 4 | 1 | 3 | 0 | 3 | 65 | 0 | 3 | In coda; nessuna automazione pianificata |
| Sicilia | 29 | 4 | 1 | 3 | 0 | 25 | 4 | 0 | 3 | In coda; nessuna automazione pianificata |
| Toscana | 37 | 17 | 2 | 14 | 1 | 20 | 85 | 0 | 15 | In coda; nessuna automazione pianificata |
| Trentino-Alto Adige | 102 | 15 | 8 | 5 | 2 | 87 | 48 | 0 | 7 | In coda; nessuna automazione pianificata |
| Umbria | 8 | 6 | 1 | 5 | 0 | 2 | 53 | 0 | 5 | In coda; nessuna automazione pianificata |
| Valle d'Aosta | 5 | 4 | 2 | 2 | 0 | 1 | 26 | 0 | 2 | In coda; nessuna automazione pianificata |
| Veneto | 76 | 68 | 25 | 39 | 4 | 8 | 242 | 0 | 43 | In coda; nessuna automazione pianificata |
| Nazionale | 20 | 4 | 0 | 3 | 1 | 16 | 0 | 0 | 4 | In coda; nessuna automazione pianificata |

Catalogo snapshot: 3337 eventi, 3337 ID unici, 0 duplicati esatti per ID. Conteggi nazionali da report status: 2567; differiscono dal catalogo perché il report per fonte non coincide byte-per-byte con lo snapshot catalogo.

## Regione corrente e decisione

Lombardia resta la regione corrente perché i run regionali cai-20261020-lombardia-01 e deep-01–deep-15 sono database=completed ma collection=partial; i report documentano 69 fonti irrisolte (39 partial, 30 unsupported), senza dichiarare copertura completa. La tabella per sezione viene dal report sorgente del 20 ottobre e non sostituisce la revisione fonte per fonte.

Dopo il checkpoint del classificatore: scegliere un piccolo gruppo di fonti Lombardia con errori recuperabili e documenti ufficiali. Una fonte resta aperta se il parser/OCR/discovery è incompleto anche quando i suoi eventi validi sono stati importati. Chiudere quel passaggio prima di aprire una seconda regione.

## Limiti dei dati

- "Complete" descrive l’esito della raccolta salvata, non la verifica che il sito abbia pubblicato tutti i suoi eventi.
- I duplicati semantici tra titoli diversi non sono conteggiati da questa tabella; consultare QA e run report prima di dichiarare un duplicato.
- Gli errori risolti storicamente e il numero di richieste HTTP reali non si ricavano dai contatori per fonte; usare .agents/cai/FAILURES.json e i rapporti del run.


## Campione corrente Lombardia — 22 ottobre 2026

| Run | Sezioni controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | ID duplicati esatti esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---|---:|---:|---:|---:|---:|---:|---|---|---|
| `cai-20261022-lombardia-brescia02` — CAI Brescia | 1 | 0 | 1 | 0 | 1 evento ufficiale del cinema (classificazione DB in attesa) | 0; duplicati semantici non determinati | Falso `durationHours=26` dal suffisso anno corretto; fixture/test e run reale verificati | Discovery limit: 14 documenti; 2 URL con storico 403 tenuti in cooldown (13 voci ripetute, nessun retry) | Pubblicare checkpoint, poi campione limitato ai residui della stessa sezione |
| `cai-20261022-lombardia-brescia03` — CAI Brescia | 1 | 0 | 1 | 0 | 7 nuovi eventi ufficiali | 0 ID esatti; overlap semantico non determinato | Correzione parser mantenuta; suite backend 178/178; importer QA PASS | Discovery limit: 13 candidati; 2 URL storici 403 in cooldown (42 voci ripetute, nessun retry); nessuna evidenza di punto escursionistico per geolocalizzare i 7 record | Checkpoint 831e031 pubblicato; poi run04 solo sui residui Brescia |

Questi valori descrivono esclusivamente il singolo run Brescia. I conteggi Lombardia complessivi (229/125/56/68/1/104) restano quelli dello snapshot storico del 20 ottobre, non sono stati ricalcolati. Sono stati rigenerati contatori `excursions` in record status globali senza ricontrollare le relative fonti; non considerarli copertura aggiornata.
