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
| `cai-20261022-lombardia-brescia04` — CAI Brescia | 1 | 0 | 1 | 0 | 0 nuovi (51 eventi presenti nello status sezione) | 0 aggiunti/rimossi; overlap semantico non applicabile al delta vuoto | QA importer PASS; suite backend 178/178 dopo la raccolta; catalogo invariato | Discovery limit: 2 candidati; 1 URL GGS HTTP 404 senza sostituto; 2 URL storici 403 in cooldown (66 voci ripetute, nessun retry) | Checkpoint `1d73684492ffdf330f7ac8bb43b39d16ddcf096b` pubblicato; poi run05 solo sui 2 candidati Brescia |
| `cai-20261022-lombardia-brescia05` — CAI Brescia | 1 | 0 | 1 | 0 | 0 nuovi; 51 eventi sezione esistenti | 0 aggiunti/rimossi/cambiati; overlap semantico non applicabile | Due candidati residuali raggiunti; PDF letto, quattro date passate; `/category/attivita/` senza parser (zero estrazioni non prova calendario vuoto); importer QA PASS; backend 178/178 | 69 skip cooldown su 3 URL distinti (2 storici 403, 1 GGS 404); nessun retry. Nessun discovery-limit residuo | Checkpoint pubblicato; preflight del cooldown 503 CAI Varese prima di ogni run |

Questi valori descrivono esclusivamente il singolo run Brescia. I conteggi Lombardia complessivi (229/125/56/68/1/104) restano quelli dello snapshot storico del 20 ottobre, non sono stati ricalcolati. Sono stati rigenerati contatori `excursions` in record status globali senza ricontrollare le relative fonti; non considerarli copertura aggiornata.


## Preflight CAI Varese — 22 ottobre 2026

Nessuna raccolta avviata. L’endpoint iCal cicloescursionismo `https://www.caivarese.it/?post_type=tribe_events&ical=1&eventDisplay=list&tribe_events_cat=cicloescursionismo-mtb` ha storico HTTP 503. Il cooldown transitorio di 6 ore è scaduto e il collector standard lo pianificherebbe; non esiste un’esclusione puntuale. Il preflight è solo codice/stato in lettura e non ha effettuato richieste. Varese resta bloccata prima del run. Prossimo passo: selezionare una diversa fonte ufficiale Lombardia e verificare preventivamente che la coda non includa URL in cooldown scaduto/non disponibili.


## CAI Valmadrera bounded sample — 22 ottobre 2026

| Run / sezione | Controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | ID duplicati esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---|---:|---:|---:|---:|---|---:|---|---|---|
| `cai-20261022-lombardia-valmadrera01` — CAI Valmadrera | 1 | 0 | 1 | 0 | 0 nuovi/cambiati; 7 eventi esistenti restituiti e invariati; 8 estrazioni documento | 0 ID duplicati nel catalogo; sovrapposizione delle estrazioni non esposta dal report di raccolta | Coda discovery ridotta da 24 a 7; nessun errore HTTP nel campione | `discovery-limit`: 7 documenti candidati non ancora visitati | Pubblicare checkpoint file/report; poi un altro campione Valmadrera circoscritto |

Il catalogo resta a 3.345 ID unici: 0 aggiunte, 0 rimozioni, 0 modifiche. La sezione è parziale, non è prova di calendario vuoto. Nessun dato geografico aggiunto. Test backend dopo la raccolta: 178/178; copie backend/frontend identiche. Report SHA `7862920ad009f600de515810382dd3f72a9d15b4c70b604eaa868386e657d02d`, manifest SHA `0156a229ef3e776af9f1b373d9e355e93960ae062249df11cb45d1dc97d0271a`. I totali regionali Lombardia della tabella storica del 20 ottobre non sono stati ricalcolati.


## CAI Valmadrera bounded sample 03 — 22 ottobre 2026

| Run / sezione | Controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | ID duplicati esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---|---:|---:|---:|---:|---|---:|---|---|---|
| `cai-20261022-lombardia-valmadrera03` — CAI Valmadrera | 1 | 0 | 1 | 0 | 0 nuovi/cambiati; 7 eventi esistenti invariati; 19 estrazioni documento | 0 duplicati ID nel catalogo; overlap tra estrazioni non esposto | 5 dei 7 candidati preesistenti raggiunti; zero errori HTTP osservati | discovery-limit: 23 candidati; 2 precedenti non visitati (`/eventi/oggi/`, `/eventi/elenco/?eventDisplay=past`) | Dopo QA/test/checkpoint, run04 max40 documenti/240 s sulla stessa sezione |

Il run02 ha ripetuto i primi 12 documenti senza avanzare la coda e non è stato checkpointato separatamente; run03 ha allargato il campione e ha aperto ulteriori pagine candidate. Catalogo invariato a 3.345 ID unici. Report SHA `befb8a7914e6d6dbe835b9d56678a22e8c3f984bcb132a23ffd8e3d2ec61b255`, manifest SHA `5370bb422bcb39ef0b44a31f1379f98d066aaaeb49a311d0f9bcd3eb45466897`. Nessun import DB; i conteggi regionali complessivi non sono stati aggiornati.


## CAI Valmadrera bounded sample 04 — 22 ottobre 2026

| Run / sezione | Controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | ID duplicati esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---|---:|---:|---:|---:|---|---:|---|---|---|
| `cai-20261022-lombardia-valmadrera04` — CAI Valmadrera | 1 | 0 | 1 | 0 | 0 nuovi/cambiati; 7 eventi esistenti invariati; 41 estrazioni documento | 0 ID duplicati nel catalogo; overlap estrazioni non esposto | Coda discovery 23→12; pagine giornaliere raggiunte fino al 17 ottobre; zero errori HTTP | 12 candidati discovery non visitati | Dopo QA/test/checkpoint, un altro campione Valmadrera delimitato |

Il catalogo resta a 3.345 ID unici, delta 0. Nessun nuovo punto geografico. Sezione parziale; non si assume calendario vuoto dai documenti non visitati. Report SHA `fd1776b3354afaa3575c048d8db5a421dec2b45180fa2305ba9948c7081d709b`, manifest SHA `e7df409743d2265e64d0862abfcd24d4be02c8e9a01e9690f6ff97385cd6c6f6`. Nessun import DB. Conteggi regionali complessivi restano snapshot storico del 20 ottobre.


## CAI Valmadrera bounded sample 05 — 22 ottobre 2026

| Run / sezione | Controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---|---:|---:|---:|---:|---|---|---|---|---|
| `cai-20261022-lombardia-valmadrera05` — CAI Valmadrera | 1 | 0 | 1 | 0 | 7 già presenti; 0 nuovi, 20 documenti, 34 estrazioni | 0 ID duplicati nel catalogo; overlap tra righe estratte non esposto | 12 URL espliciti e 8 ICS scoperti raggiunti senza errori HTTP | 38 candidati non verificati | Dopo checkpoint, max8 URL di calendari correnti/futuri e categorie escursioni/scialpinismo; lasciare fuori archive passati, API non attribuibile e attività incerta |

Delta catalogo contro `c5036ff`: 0 aggiunti, 0 rimossi, 5 modifiche a `sourceDocument` ufficiali; 2 record hanno inoltre descrizioni abbreviate. 3.345 ID unici; nessun campo editoriale/geografico modificato, nessuna coordinata aggiunta. La fonte resta parziale: zero errori di rete non equivale a calendario completo. Nessun import DB, dato che non sono emersi ID nuovi; nessuna query DB. Importer QA PASS, suite backend 186/186, copie backend/frontend identiche dopo i test. Manifest SHA `f88571727bbbcda6dceec0c5205f3da7dfdc95c4c1a70897444daf33f092e2a2`; report SHA `cc50445c9c91cedef90a672e4f0809ac7074fe6275b787ab8154f74e142cfb25`. I totali complessivi Lombardia rimangono lo snapshot storico del 20 ottobre.


## CAI Valmadrera bounded sample 06 — 22 ottobre 2026

| Run / sezione | Controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---|---:|---:|---:|---:|---|---:|---|---|---|
| `cai-20261022-lombardia-valmadrera06` — CAI Valmadrera | 1 | 0 | 1 | 0 | 7 eventi unici esistenti; 8 estrazioni, 0 nuovi ID | 1 riga estratta duplicata esclusa; zero ID duplicati nel catalogo | 8/8 URL ufficiali raggiunti senza errori HTTP | discovery-limit: 19 candidati sul calendario PDF ufficiale | Dopo checkpoint, valutare solo quel PDF con run max1 doc/180 s, se non già visitato |

Confronto con commit `f00a1e4`: 3.345 ID unici; 0 aggiunti/rimossi; 5 righe aggiornate (quattro `sourceDocument`, Moregallo anche description). Nessun campo geografico/editoriale amministrato alterato. Sezione ancora parziale, nessuna coordinata o attribuzione aggiunta e nessuna query/import DB. QA importer PASS; backend tests 186/186; copie backend/frontend byte-identiche dopo i test. Report SHA `42837b9104b440128911a879b2a0b9adcda54699eaf5983835f7b4f5dc0ff082`; manifest SHA `f673039b1a8b2286067637a9ddb524c04868656bc1a6e6505b2ac6252934d64d`. I totali regionali Lombardia restano lo snapshot storico del 20 ottobre.


## QA parser PDF CAI Valmadrera — 22 ottobre 2026

Il PDF annuale ufficiale è già in cache e `pdftotext -layout` ne legge 12 pagine (gennaio–dicembre 2026); l’estrazione deterministica precedente produceva `recognized=false` e zero eventi. La diagnosi ha verificato le posizioni visive: 14 attività da ottobre a dicembre, incluse Gita sociale media montagna Valmalenco il 1 novembre, Gita culturale enogastronomica il 22 novembre e Cena sociale il 4 dicembre. Il corso PIACCO è il 25 ottobre (il 24 è vuoto). L’errore `official-calendar-grid-unrecognized` resta aperto in `.agents/cai/FAILURES.json` finché la correzione non viene rielaborata dal run orchestrato.

Correzione candidata: parser a griglia con ancora sul giorno 1 e colonne dei giorni, fusione della data domenicale separata solo quando le posizioni X completano le sette colonne; versione cache deterministic 10→11. Il test usa testo pdf.js catturato e PDF ufficiale in fixture `backend/test/fixtures/cai-valmadrera-2026-calendar.pdf` (12 pagine, SHA `f3939cb69b55824e4db4026d989acea993a58e7fa81671d8c7a3093d3b4103e9`), chiama `pdfText()` di produzione e `parseCalendarLines()`, verifica le 14 date/titoli, rifiuta l’errata data 24 ottobre e asserisce `sourceDocument` ufficiale, località non verificata e coordinate assenti. Fixture testo SHA `38af603c521ed5c5f64c1bc0e856ad545d853bc57dfb7287af8eb031a34bd911`. Focused backend test 20/20; suite completa 187/187; copie catalogo backend/frontend invariate e identiche. Importer QA PASS. La correzione è pubblicata al commit `75be6e65b19a727250346c5e1c4e3c4287f9b277`; prima del run cache-backed e nessuna riga del catalogo/DB è stata modificata.

Prossimo: checkpoint codice/fixture/test, poi un solo run orchestrato max 1 documento sul PDF con cache valida e versione parser nuova; niente fetch ripetuto. Confrontare i record estratti con i 7 già presenti e classificare via Mercury gli eventuali nuovi ID prima di un import.

## CAI Valmadrera bounded sample 07 — 22 ottobre 2026

| Run / sezione | Controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---|---:|---:|---:|---:|---|---:|---|---|---|
| `cai-20261022-lombardia-valmadrera07` — PDF ufficiale CAI Valmadrera 2026 | 1 | 0 | 1 | 0 | 21 eventi futuri riconciliati: 7 esistenti +14 nuovi; 65 righe estratte | 0 ID duplicati catalogo; duplicati semantici delle righe sorgente non esposti | Parser month-grid VERSION 11 verificato sul run reale; fonte `ok`, 0 issue | Lombardia complessiva resta aperta per altre fonti/sezioni; questo run non ne ha selezionate | Dopo checkpoint file, classificare solo i 14 nuovi ID con Mercury; QA e secondo checkpoint prima dell'upsert classification-only |

Confronto con checkpoint `e65379e4791bddbb92f8898767f0951135a04173`: 3.345→3.359 ID unici, +14, 0 rimossi, 0 record esistenti modificati. Tutti i nuovi record citano il PDF ufficiale; restano `Località da verificare`, senza coordinate o attribuzioni inventate. Importer QA PASS, suite backend 187/187, copie backend/frontend di catalogo e scrape-status byte-identiche e invariate dopo i test. Il report non dichiara il codice HTTP: una sola GET condizionale ha avuto successo, 304 dedotto dai timestamp cache invariati. Nessuna query/import DB.

Report SHA `66cfdef7a09d8b998a4da3dc50625b11493968ed0bece873191651518b5873ca`; manifest SHA `80338c4a5952334c28cb8dc7ce436e6b0d8ea0aea9309046356e7909bc3a9335`; state SHA `f54437f765a93c5affb604b478f5c778bec07f4152308e069b2ba4ed63564140`. Il conteggio di copertura complessivo della Lombardia non è stato ricalcolato.


## CAI Cernusco bounded continuation 03 — 22 ottobre 2026

| Run / sezione | Controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---|---:|---:|---:|---:|---|---:|---|---|---|
| `cai-20261022-lombardia-cernusco03` — CAI Cernusco sul Naviglio | 1 PDF ufficiale | 0 | 1 | 0 | 4 ID sezione già presenti; zero nuovi; 8 righe estratte dal PDF | 0 | Cache estrazione OCR v11 invalidata con VERSION 12; falso ID `cb33842fc3c2` assente; record Alpe Devero esistente confermato | 3 issue storiche restano, 36 documenti di fonte preservati; regione ancora incompleta | Checkpoint dcbee9e pubblicato e verificato; collector sceglie una diversa fonte Lombardia con preflight in lettura |

Catalogo: 3.359→3.359 ID, zero aggiunti/rimossi, una sola descrizione aggiunta al record 13 dicembre; campi amministrati e geografici invariati. Copie backend/frontend identiche. Report SHA `d2a14c92fc8a918596d6ab6e68044b28b0278d857805fc874f067f5a4863068a`; manifest SHA `c9164d3839dd1abebc62e9262fb40aca590fe7812e4f7c33e8a76c35ea2bba14`; stato run SHA prima dell'aggiornamento report `218b54ee8afce0a9bb4dd1113715668165bf3eeb6b9adf7006f441bfffe6b7c2`. Backend npm test 197/197 dopo raccolta, hash dei quattro file pubblici invariati dai test. Nessuna classificazione o scrittura DB; `database=pending` descrive solo che il run non ha richiesto delivery, non un import incompleto. I totali Lombardia complessivi restano lo snapshot storico del 20 ottobre e non sono query correnti.


## CAI Premana bounded continuation 01 — 22 ottobre 2026

| Run / sezione | Controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---|---:|---:|---:|---:|---|---:|---|---|---|
| `cai-20261022-lombardia-premana01` — CAI Premana | 1 pagina ufficiale | 0 | 1 | 0 | Un evento esistente CENA SOCIALE (24-10-2026), JSON-LD ufficiale; 0 nuovi ID | 0 | Coda discovery avanzata da 10 a 2 candidati | Due candidati non ancora letti; fonte parziale, 40 URL storici conservati | Checkpoint ba07970 verificato; identificare localmente i due URL e proseguire solo se mirabili senza replay, altrimenti altra fonte Lombardia |

Catalogo invariato a 3.359 ID quanto a cardinalità: zero aggiunti/rimossi e una sola variazione del campo `sourceDocument` per l’evento esistente. Nessuna coordinata o evento inventato; nessuna classificazione/import DB. Report SHA `77f32437389b7be23778640b826659e65160a21cca9d354d401d244a5d86f322`; manifest SHA `abf50e4b5e4cd5532755beb85c9446836c03b26b7bead244e42e5ce4e868f6d4`. Suite backend 197/197 dopo la raccolta; copie backend/frontend identiche e i quattro hash invariati dai test. La regione Lombardia complessiva non è stata ricalcolata.


## CAI Premana residual continuation 02 — 22 ottobre 2026

| Run / sezione | Controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---|---:|---:|---:|---:|---|---:|---|---|---|
| `cai-20261022-lombardia-premana02` — CAI Premana | 2 URL ufficiali mirati | 0 | 1 | 0 | 9 eventi storici controllati, 0 prossimi, 0 ID nuovi | 0 | `/oggi/` e listing archivio letti; nessun evento futuro dal campione | Discovery 2→4 residui; esatti quattro URL non salvati; fonte in pausa per prevenire replay | Checkpoint 10178cd verificato; poi altra fonte Lombardia con campione ufficiale delimitato |

Il catalogo resta a 3.359 ID e non ha righe evento cambiate; sono cambiati i due hash dei documenti, la metadata di coverage e la issue con la nuova coda. La status history conserva 40 URL, zero aggiunti/rimossi. La CLI sul sottoinsieme ha segnalato `unsupported`, il run e la sezione restano `partial`; non è un calendario vuoto e non è complete coverage. Nessuna classification/import DB. Report SHA `88e6e56c0da6a4d89da4212015886dba6fcef4cc1f05cbf25e7b78cdfa067551`; manifest SHA `4b00cb7e88e787e93cf47d08960c80ecf48dfc8e1e42d11cc29669070206990d`; test backend 197/197, copie identiche. Non sono stati ricalcolati i totali regionali.


## CAI S.E.M. bounded continuation 02 — 22 ottobre 2026

| Run / sezione | Controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---|---:|---:|---:|---:|---|---:|---|---|---|
| `cai-20261022-lombardia-sem02` — CAI S.E.M. | 1 PDF ufficiale mirato | 0 | 1 | 0 | 14 eventi esistenti; 33 righe estratte; 0 nuovi ID | 0 ID duplicati nel catalogo; duplicati di righe sorgente non esposti | Merge status corretto e verificato in sem02 | Discovery-limit esatto: 12 candidati residui; nessun URL specifico persistito | Checkpoint `3553eb6` verificato; poi un campione mirato su una diversa fonte Lombardia |

Catalogo: 3.359→3.359 ID unici; zero aggiunti, rimossi o righe evento cambiate. Fonte `partial`, 40 documenti conservati; il conteggio residuo 12 è mantenuto dopo la continuation. Importer QA PASS; backend npm test 201/201 dopo la raccolta. Stato run `collection=partial`, `files=ready`, `database=pending`; nessun accesso/scrittura DB a delta eventi zero. Report SHA `ad5609b4fd7a281e281b53ff8698e5584a681da01b46420420f99e9858565105`; manifest SHA `cc2edad797f5ced938dbad2ebf013a14504c1eecd0681f7026dfc3216357485f`; state SHA `9668cdaf1cb18c2251be3c603527f505ceb4372f2c9dfd85c4afaa893f867a12`. Copie backend/frontend identiche. Conteggi globali Lombardia non ricalcolati.


## CAI Missaglia bounded continuation 01 — 22 ottobre 2026

| Run / sezione | Controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---|---:|---:|---:|---:|---|---:|---|---|---|
| `cai-20261022-lombardia-missaglia01` — CAI Missaglia | 1 URL ufficiale | 0 | 1 | 0 | 0 correnti; 1 riga 2024 estratta e filtrata come passata | 0 ID duplicati catalogo | `gite.php` letto e parsato; discovery 41→1 | Pagina vecchia (2014/2024); 1 candidato non visitato; errore OCR pagina 21 conservato, manual QA = testo corso non calendario | Checkpoint 7968b4e verificato; poi Busto Arsizio bounded max1 sul calendario invernale ufficiale |

Catalogo 3.359→3.359 ID; zero aggiunti/rimossi/cambiati. Fonte `partial`; zero righe correnti non prova un calendario completo. Importer QA PASS read-only, backend npm test 201/201 dopo raccolta, mirror backend/frontend identici, nessun import DB. Report SHA `701f74343c3a479de34dc9285f296129753241da53b42ddbdfe83ad693bcf56c`; manifest SHA `9f73e0a51f0cec7a7794e14b943ec9e235d7b50ecac93acf274d09e4a4d92b04`; state SHA `cfac59d0bae4ad27bc47aaec354b5b11848b20f51bb0c37f913f6293c5f5eb4b`. Conteggi globali regionali non ricalcolati.


## CAI Busto Arsizio bounded continuation 01 — 22 ottobre 2026

| Run / sezione | Controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---|---:|---:|---:|---:|---|---:|---|---|---|
| `cai-20261022-lombardia-busto01` — CAI Busto Arsizio | 1 URL ufficiale → canonical same-host | 0 | 1 | 0 | 1 evento preesistente conservato; pagina 2026 elenca solo date passate, nessun calendario 2027 | 0 ID duplicati | Target ufficiale letto via redirect; oEmbed storici esclusi | Discovery-limit: 1 candidato residuo; “altre uscite” future non pubblicate nel campione | Checkpoint `a83d607` verificato; poi preflight read-only su fonte distinta, senza ripetere pagina scaduta |

Catalogo 3.359→3.359 ID; zero aggiunti/rimossi/cambiati. Fonte `partial`; attività elencate 2025-12-07→2026-03-22 sono tutte passate al 2026-10-22. Importer QA PASS read-only, backend npm test 201/201 dopo raccolta, copie identiche, nessun import DB. Report SHA `47959134cd4b0aff118dec3f190454c4d049b239c323f04cd951389f07c34a32`; manifest SHA `471ae7a692b8a09a00d899e225fe0f544f930c31290a9c2fc1222a37c90fe791`; state SHA `6a75dd045b4277b36b8d55577c8d9434776c8b8d0427205aa21ec28a4d4f1dd5`. Nessun ricalcolo dei totali Lombardia.

## Campioni live 22 ottobre 2026 — sequenza corrente

I totali regionali della tabella iniziale restano lo snapshot storico 2026-10-20; i campioni seguenti sono osservazioni circoscritte e non ricalcolano tutta la Lombardia.

| Run / sezione | Controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---|---:|---:|---:|---:|---|---:|---|---|---|
| `cai-20261022-lombardia-stradastorta02` — CAI Strada Storta | 1 | 0 | 1 | 0 | 6 card parse; 1 nuovo candidato (Monte Pisello, 25-10-2026) importato; 5 righe catalogo con soli campi sourceDocument/description | 0 duplicati ID | Parser v13 fixture-backed e importer post-query: 1 place + 1 classification riconciliati | 1 discovery-limit; destinazione aggiornata non identificata, luogo da verificare | Pubblicare ricevuta DB e verificarla da origin; poi diversa fonte Lombardia |


### Classificazione/delivery separato — Strada Storta

Il lotto `cai-map-20261022-stradastorta02` classifica solo l’ID nuovo: 0 trekking, 0 non trekking, 1 da verificare, 0 errori. Mercury risposta attestata, nessun override. File QA PASS ma DB pending; la consegna attende checkpoint remoto. Conteggi di copertura regionali rimangono lo snapshot storico in testa a questo file.


Il delta separato `cai-map-20261022-stradastorta02` ha 1 classificazione `da_verificare`/`altro`; receipt DB conferma 1 place + 1 classificazione inseriti, 0 mismatch, 0 update, 0 delete. Receipt SHA `bef3ff50b4266d0486eb343f9c281fdb96ea3a14b2f6a07727be57e2d00acf32`, ancora da pubblicare. Nessun nuovo punto geografico: coordinate null.


### Prossima regione

Preflight Lombardia: nessun target nuovo tra i candidati verificati offline (Sesto Calende già visitata; Carate PDF duplicato; Legnano pagina datata; Aldo Mantovani senza calendario). Non è una dichiarazione di copertura completa; problemi aperti di Lombardia restano registrati. Prossimo campione Piemonte: CAI Pinasca, URL ufficiale `https://www.caipinasca.it/index.php/calendario-gite`, fonte `unsupported` con PDF precedente non leggibile via OCR. Target URL non visitata, campione futuro max 1 documento/120 s.

## CAI Pinasca bounded sample 02 — Piemonte, 22 ottobre 2026

| Run / sezione | Controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---|---:|---:|---:|---:|---|---:|---|---|---|
| `cai-20261022-piemonte-pinasca02` — CAI Pinasca | 1 URL ufficiale | 0 | 1 | 0 | 27 righe HTML estratte, 4 nuove righe nel catalogo | 0 ID duplicati | Contatore merged `extractedEvents` corretto e testato nel checkpoint codice `4175eb9`; catalogo/parser QA PASS | PDF OCR fallito; discovery-limit 1 candidato residuo | Checkpoint file remoto e delivery esatta dei 4 ID, poi fonte regionale diversa |

Catalogo 3.360→3.364 ID unici; +4, 0 rimossi, 0 record preesistenti cambiati. Classificazione QA PASS: 2 trekking, 2 non trekking, 0 dubbi/errori. Mercury richiesto `inception/mercury-decide`; risposta attestata `inception/mercury-decide-20260930` per 4/4. Località non verificate, coordinate assenti. Source `partial`; raccolta e classificazione non equivalgono alla copertura completa della sezione. Backend test 204/204 dopo il run; sei hash JSON pubblici invariati. Report raccolta SHA `eadb956d7859be058db76842cc326822a2a9b35f9688966be3efd02292a27125`; manifest SHA `4bec0f0bf1067f7ef6b1075b7d9341892e8c7bc2b6df9d0b4f4857b5d9848182`; classificazione manifest SHA `3dd59a810621ede84d09b4b3bb7bed0b0c766bc1c215f86ef2245defd881ffd5`. DB ancora pending: nessuna query/scrittura. I record del 3 e 18 ottobre sono passati alla data del campione e non sono indicati come eventi imminenti.

Delivery Pinasca02: prima del DML 0/4 place e 0/4 classificazioni presenti; inserite 4 + 4. La SELECT joined separata ha riconciliato 4/4 senza mismatch/missing. Updates/deletes 0; campi geografici restano null. Write timestamp `2026-10-22 22:14:25.13088+00`; post-query `2026-10-22 22:15:18.267267+00`; pre-query timestamp non restituito dal MCP. Ricevuta SHA `7baeb4307d6d8ef91d2dfd42a05f84e936ff9126dee9c83ba379ae99c2d3d41a`, report SHA `0d384f9cbe614b480d8b1d37708efcbaf49adc1287550dcdf7a54064a4ce4422`; entrambi da pubblicare nel checkpoint receipt dedicato. Prossimo target read-only preflight: CAI Potenza Picena (Marche), `https://www.caipotenzapicena.it/attivita2026`, bounded max1 doc/120s/concurrency1 dopo checkpoint.

Ricevuta Pinasca02 pubblicata/verificata al commit `0d5f978`; delivery chiuso, 4/4 righe place e classification riconciliate (receipt SHA `7baeb4307d6d8ef91d2dfd42a05f84e936ff9126dee9c83ba379ae99c2d3d41a`). Prossimo run autorizzato e preflightato: CAI Potenza Picena, Marche, `https://www.caipotenzapicena.it/attivita2026`, bounded max1 doc/120s/concurrency1.

## CAI Potenza Picena bounded sample 01 — Marche, 22 ottobre 2026

| Run / sezione | Controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---|---:|---:|---:|---:|---|---:|---|---|---|
| `cai-20261022-marche-potenzapicena01` — CAI Potenza Picena | 1 URL ufficiale | 0 | 1 | 0 | 0 nuovi; la pagina Wix generica non attesta calendario vuoto; 1 evento catalogo esistente invariato | 0 | Nessuno | Extractor `method=null`; discovery-limit 11 aperto | Checkpoint file, quindi fonte ufficiale diversa senza replay della pagina Wix |

Catalogo 3.364→3.364 ID unici, 0 aggiunti/rimossi/cambiati. Status source partial, `events=1`, history `extractedEvents=2`; la singola pagina letta ha 0 estrazioni e method null. L’unico evento esistente resta invariato, location non verificata e coordinate assenti. Importer QA PASS. Backend test 204/204 dopo la raccolta, sei hash pubblici invariati. Manifest SHA `2d5dd8ebca32ea25fdf52a84679cf553f42475d4791845cf875b509dfed39fa1`; report SHA `28df16309f4e8a296020f5d37b7153a276faa3ad8b1525ac35030ebf8ade7b3a`. Nessuna query o scrittura DB per delta zero.

## Preflight prossimo campione — Molise

Marche: nessun target ufficiale inedito mirabile nel preflight; Potenza Picena resta partial/unreadable. Molise: l’unica sezione enabled è CAI Campobasso. Tutte le 12 URL registrate sono state visitate; per verificare eventuali aggiornamenti recenti è selezionato un solo refresh dell’indice ufficiale `https://caicampobasso.it/calendario-delle-attivita/` (precedente 118 estrazioni, hash body `ce4421de6c30de30d0d50ce79627b65f6e62932ca519cb0c5e03ad4dea7acbbc`; snapshot 19 ottobre). PDF annuale ha discovery-limit 37 senza URL residui stabili. Run pianificato `cai-20261022-molise-campobasso01`, max1 documento/120s/concurrency1; eventuale esito invariato significa zero progresso e no replay.


## Campione corrente Molise — CAI Campobasso, 22 ottobre 2026

| Run / sezione | Controllate | Complete | Parziali | Irraggiungibili | Eventi fonte verificati | Nuovi ID file | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | DB consegnati | Prossimo passo |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|---:|---|
| `cai-20261022-molise-campobasso01` — CAI Campobasso | 1 indice HTML ufficiale | 0 | 1 | 0 | 127 righe | 2 | 0 | Scope discovery-limit corretto con fixture/test `d16ebc0`; PDF count 37 separato dall’indice HTML count 1 | Coda PDF 37; continuation HTML 1 senza URL esatto persistito | 2 place + 2 classificazioni riconciliati (ricevuta remota al commit `9bc54c5`) | Ricevuta verificata al commit `9bc54c5`; preflight offline code residue, poi fonte successiva senza replay |

Delta catalogo 3.364→3.366 ID unici, zero rimozioni, una riga preesistente modificata solo in source/link/description, coordinate nuove 0. Classificazione Mercury QA PASS: 1 trekking/altro, 0 non trekking, 1 da verificare/altro, 0 errori; modello richiesto `inception/mercury-decide`, risposta attestata `inception/mercury-decide-20260930`. DB non interrogato/scritto nel checkpoint file. Fonte partial: nessun zero-event assumption. I conteggi storici aggregati non sono ricalcolati.

Il delta `cai-map-20261022-campobasso01` è stato consegnato via insert-only: 2 `places` pubblicati e 2 classificazioni; dopo un singolo CAS sul solo fingerprint Lago Vivo, query joined finale 2/2, zero mismatch/missing, zero update `places` e zero delete. Ricevuta/report sono pubblicati e verificati al commit `9bc54c5`. Il run di raccolta resta partial: consegna DB non equivale a copertura completa.


## Preflight offline successivo — Abruzzo / CAI Penne, 22 ottobre 2026

| Fonte | Regione | URL mirata | Precedenti e cooldown | Esito preflight | Prossimo passo |
|---|---|---|---|---|---|
| CAI Penne `cai-penne-9234006` | Abruzzo | `https://caipenne.it/2026/03/09/programma-sezionale-2026/` | Discovery-limit 60 sull’URL PDF annuale; nessun HTTP failure/cooldown; articolo 7 marzo e PDF già letti | Pagina 9 marzo elencata nelle evidenze calendar URL ufficiali, non nei 12 documenti visitati; può duplicare il programma già letto | Run nuovo `cai-20261022-abruzzo-penne01`, una sola URL, max1 documento/120s/concurrency1; no delta presunto |

Molise resta parziale: PDF 37 residui senza URL persistite né body cache; continuation HTML 1 non persistita, unica URL ricostruibile già nella history. Nessuna nuova raccolta o rete nel preflight.

## Campione corrente Abruzzo — CAI Penne, 22 ottobre 2026

| Run / sezione | Controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Nuovi ID file | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | DB consegnati | Prossimo passo |
|---|---:|---:|---:|---:|---|---:|---:|---|---|---:|---|
| `cai-20261022-abruzzo-penne01` — CAI Penne | 1 URL ufficiale | 0 | 1 | 0 | 8 righe catalogo esistenti riconfermate byte-identiche; pagina nuova richiesta canonizza su contenuto storico, `method=null`, zero righe estratte (nessuna conclusione di calendario vuoto) | 0 | 0 ID; nessuna decisione semantica possibile senza delta eventi | Nessuno | PDF annuale discovery 60; HTML continuation 1, URL richiesta ha ripetuto canonicalmente pagina già nota | 0; nessun candidato e nessuna query DB | Checkpoint Penne pubblicato al commit `1954838`; poi 1 URL distinta CAI L'Aquila in Abruzzo |

Catalogo: 3366 ID prima/dopo, zero aggiunti/rimossi/modificati come righe evento. Otto righe della fonte Penne hanno SHA canonico ordinato `2e6e61eb7229ec3fa46580d0de75a7c83bba17c5ba95f6af6367266afa064960` in entrambi gli snapshot. Il file excursions ha solo metadati generati diversi: full SHA `243cdf4c…`→`dd756f6f…`, coverage `parsed 1/unsupported 0`→`parsed 0/unsupported 1`; report ed evidence-manifest aggiornati. Collection `partial`, files QA `ready`, database `not-applicable-no-delta`. Backend test 205/205 dopo la raccolta, con hash dei sei JSON pubblici stabili durante i test.

Preflight offline collector: URL ufficiale CAI L'Aquila `https://cailaquila.it/le-attivita-del-cai/programma-2026/?commissioni=escursionismo`, abilitata e non letta/non in cache. Nessun cooldown/record failure specifico; esiste un 403 su URL sorella con filtro `commissioni=legale`, perciò solo un fetch max1 doc/120s/concurrency1 e stop immediato al 403. Checkpoint Penne remoto verificato al commit `19548380898b52fcf867b6f9e3943d2556351ce4`; il singolo run L'Aquila può partire ora. Questa è una misura del campione; le statistiche cumulative Abruzzo restano storico 20 ottobre, non ricalcolate.

## CAI L'Aquila bounded sample — 22 ottobre 2026

| Run / sezione | Controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Nuovi ID file | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | DB consegnati | Prossimo passo |
|---|---:|---:|---:|---:|---|---:|---:|---|---|---:|---|
| `cai-20261022-abruzzo-laquila01` — CAI L'Aquila | 1 URL ufficiale | 0 | 0 | 1 | 0 estrazioni (HTTP 403, nessun body/cache; non prova calendario vuoto) | 0 | 0 | Nessuno | HTTP 403 sulla sola URL `commissioni=escursionismo`; pagina sorella `commissioni=legale` già 403 nello status configurato; no retry/espansione | 0; nessun candidato, nessuna query DB | Checkpoint del fallimento, poi preflight offline di fonte distinta o regione successiva |

Run `cai-20261022-abruzzo-laquila01` è distinto dal precedente Penne01. Catalogo totale 3366 ID; full excursions SHA e righe evento identici alla baseline `9853c72`; L'Aquila aveva 0 righe prima/dopo. Solo scrape-status è cambiato per l'esito failed; mirrors backend/frontend byte-identici. Files `ready` secondo orchestratore e QA importer PASS; database non interrogato né scritto. La fonte è irraggiungibile in questo singolo URL, non si dichiara calendario vuoto né regione completa. Il registro dei fallimenti conserva il 403 esatto e impedisce replay nel ciclo corrente. Cumulative counts Abruzzo restano lo snapshot storico del 20 ottobre; questa tabella registra solo il campione corrente.

Il report dice anche che lo status source-level conserva `url` configurato `?commissioni=legale` e non materializza `issues`/`documents`; l'associazione del 403 a `?commissioni=escursionismo` deriva dal run state/output e sidecar. Report SHA `b3b15f1af73988430f5d3153e361725f4c9c2d5aac38211dca468edccd2cb834`; evidence-manifest SHA `7830f4a30c7f92dc1337c771e8b4e823c8f74318e560d33d21153d8fd7dc53cc`.

Verifica suite dopo il run L'Aquila01: backend `npm test` 205/205; checksum dei sei JSON pubblici identici prima e dopo i test. Non è stata eseguita raccolta in parallelo ai test. Run e aggiornamento failure sono remoti/verificati al commit `d9fbdca0ab0cafdc4e8ca1c91c534df4a026b7cf`; il preflight successivo è in sola lettura e non riapre questa URL.

## Copertura Abruzzo — esito del preflight di avanzamento

Abruzzo non è completo; si passa alla regione successiva solo perché non c'è un altro target distinto sicuro in cache/registry. La tabella corrente ha 1 sezione parziale (Penne) e 1 irraggiungibile (L'Aquila), eventi estratti da Penne non nuovi, L'Aquila 0 estrazioni; nessun import DB nel passaggio. Penne open: PDF discovery 60 + HTML continuation 1 non persistita, URL testata è alias canonical già letto. L'Aquila open: 403 sulla sola query escursionismo, niente body/cache, stop/no retry. Preflight offline ha escluso URL consumate, canonical replay, residui senza URL e fonti con cooldown/access failure. Conteggi cumulativi Abruzzo restano lo snapshot storico al 20 ottobre e non vengono ricalcolati.

## Prossimo campione — Calabria, CAI Castrovillari

| Run pianificato | Regione | Sezione | URL | Scope | Evidenza preflight | Limiti aperti | Prossimo passo |
|---|---|---|---|---|---|---|---|
| `cai-20261022-calabria-castrovillari01` | Calabria | CAI Castrovillari `cai-castrovillari-9244005` | `https://www.caicastrovillari.it/prog.php` | Una URL, max1 doc/120s/concurrency1 | URL da calendarUrls/calendarEvidence, linkata da sito ufficiale; non in documents/cache/FAILURES | PDF 2026 già partial: OCR failure e discovery-limit 8; pagina può non essere estrattiva | Pubblicare questo preflight; poi una sola raccolta bounded, nessuna deduzione da method=null |

## CAI Castrovillari bounded sample — Calabria, 22 ottobre 2026

| Run / sezione | Controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Nuovi ID file | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | DB consegnati | Prossimo passo |
|---|---:|---:|---:|---:|---|---:|---:|---|---|---:|---|
| `cai-20261022-calabria-castrovillari01` — CAI Castrovillari | 1 URL ufficiale | 0 | 1 | 0 | 12 righe catalogo preesistenti verificate invariate; 0 eventi estratti dall'HTML indice | 0 | 0 | Nessuno | PDF annuale OCR failure pagina 2 + discovery 8; HTML `/prog.php` discovery 1 | 0; nessun candidato/query DB | Checkpoint report/source-evidence/evidence-manifest corretti; poi preflight offline di un singolo PDF ufficiale distinto |

Righe selezionate per prefisso `event.id`: 12→12; 0 add/remove/change; SHA canonico `bc44d552e7eaf43748fcea8849a6d5d13ec383115fd06cb0ee3b14cdcaa52407`. Catalogo nazionale 3366→3366 ID. SHA completo excursions `dd756f6f…`→`704ea832…` per metadata generatedAt/sourceHashes; status `a58baf3e…`; sections `f0245e11…`. Mirror backend/frontend identici. QA importer PASS dopo correzione del selettore iniziale errato su `sourceId`; 205/205 backend test dopo il run e sei JSON pubblici invariati durante i test. Nessuna classificazione/import/DB.

La pagina indice rivela link ufficiali a un PDF gruppo Corigliano/Rossano, PDF sottosezione Cerchiara, e proposta attività; confrontare ogni target con history/cache prima di sceglierne uno, evitando il PDF annuale Castrovillari già letto e con OCR failure. Cumulative Calabria counts restano storico 20 ottobre, non ricalcolati.

## Esito preflight Calabria → Campania — 22 ottobre 2026

| Regione | Sezioni controllate in questo preflight | Complete | Parziali | Irraggiungibili | Eventi verificati | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---|---:|---:|---:|---:|---|---:|---|---|---|
| Calabria, CAI Castrovillari | 4 link dell'indice verificati offline | 0 | 4 esiti non lavorabili (uno già letto, due non attribuibili, uno non calendario) | 0 | 0 nuovi; i 12 record esistenti restano invariati dal run Castrovillari01 | 0 | Nessuno | PDF OCR pagina 2/discovery8; HTML index discovery1 | Passare al preflight offline Campania; nessuna dichiarazione di copertura completa |

Dettaglio: `programmacerchiara26.pdf` replay già letto sotto CAI Cerchiara; `programmacoro26.pdf` appartiene a gruppo Corigliano/Rossano non registrato; `familycaimorano.pdf` non ha attribuzione sufficiente per CAI Morano; `proposta25.pdf` è una proposta, non un programma eventi. Nessun fetch, test o DB in questo preflight. Campania: CAI Caserta PDF ha già `discovery-limit` aperto; è solo candidato al controllo offline, non autorizzazione a ripeterlo. I conteggi regionali cumulativi in tabella restano snapshot storico del 20 ottobre e non sono query correnti.

## Campania — preflight offline CAI Caserta (22 ottobre 2026)

| Regione | Sezioni controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---|---:|---:|---:|---:|---|---:|---|---|---|
| Campania, CAI Caserta `cai-caserta-9245001` | 7 fonti enabled controllate offline; 1 indice specifico idoneo | 0 nuove verifiche evento | 7 status già partial/complete, nessun aggiornamento live | 0 nuove | Nessuno nel preflight; nessuna pagina letta | 0 | Nessuno | PDF annuale Caserta `CAI-F-d8cbb0f4bd01c6f5` discovery-budget-exhausted; altre code discovery restano da lavorare | Dopo checkpoint remoto, un solo run `https://www.caicaserta.it/escursioni.html`, max1 doc/120s/concurrency1 |

La pagina `/escursioni.html` è registrata come URL ufficiale (`calendarUrls` e `calendarEvidence`, `foundOn=self`), e manca da status documents, history dei run, cache con body/meta e FAILURES. Il suo cache key non ha contenuti persistiti. Il PDF annuale non va ripetuto: applicare solo la strategia bounded all'indice, senza seguire automaticamente i figli. Conteggi cumulativi Campania restano lo snapshot storico in testa al file, non una query attuale.
