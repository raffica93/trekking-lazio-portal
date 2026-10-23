# Avanzamento regionale CAI

## Ultimo checkpoint operativo — 23 ottobre 2026

I dati aggregati della tabella seguente restano lo snapshot storico del 20 ottobre. Questo aggiornamento separa il risultato degli ultimi controlli circoscritti; non è una nuova query nazionale né un audit complessivo.

| Regione / run | Sezioni controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---|---:|---:|---:|---:|---|---:|---|---|---|
| Veneto — `cai-20261023-veneto-alpago-programma01`, CAI Alpago | 1 URL richiesta | 0 | 1 | 0 | 3 raw, 0 attribuibili/verificati, 0 nuovi ID | 0; due record Lastoi restano separati e ambigui | 0 | attribuzione `/programma-2/` non persistita; discovery-limit preesistenti su `/programma-2-3/` (72) e `/programma-2-2/` (1) | Non ripetere la pagina senza evidenza di risposta distinta; nessuna importazione |
| Lombardia — scansione offline fonti aperte | 125 sezioni enabled già registrate nello status | 0 nuove | non ricalcolate | non ricalcolate | 0 nuovi eventi (nessun fetch) | 0 | 0 | candidati esatti già consumati/passati, falliti/in cooldown o code senza URL figlio persistito; cache di raccolta assente da questa checkout | Lombardia resta incompleta; target offline successivo da valutare dopo le regioni in ordine |
| Marche — scansione offline fonti aperte | 12 sezioni enabled con status | 0 nuove | non ricalcolate | non ricalcolate | 0 nuovi eventi (nessun fetch) | 0 | 0 | URL calendario già lette/in coda/unsupported; 4 sezioni disabled senza sito; cache di raccolta assente da questa checkout | Marche resta incompleta; nessun URL nuovo dalla snapshot, scansione Molise conclusa |
| Molise — scansione offline fonti aperte | 1 sezione enabled (Campobasso) con status | 0 nuove | non ricalcolate | non ricalcolate | 0 nuovi eventi (nessun fetch) | 0 | 0 | tutte le URL registrate sono già in status/FAILURES; due discovery-limit senza URL figlie esatte; 3 sezioni disabled senza sito; cache non disponibile | Molise resta incompleto; nessun URL nuovo dalla snapshot, scansione Puglia conclusa |
| Puglia — scansione offline fonti aperte | 5 sezioni con status; 4 enabled | 0 nuove | non ricalcolate | non ricalcolate | 0 nuovi eventi (nessun fetch); Grottaglie resta `no-upcoming` nello status | 0 | 0 | le 4 fonti enabled hanno già URL in status/FAILURES/run artifacts; parser/discovery issues preesistenti; cache non disponibile | Puglia non dichiarata completa; nessun URL nuovo dalla snapshot, scansione Sardegna conclusa |
| Sardegna — scansione offline fonti aperte | 7 fonti; 4 enabled | 0 nuove | non ricalcolate | non ricalcolate | 0 nuovi eventi (nessun fetch); Villagrande `no-upcoming` nello status | 0 | 0 | URL calendario delle 4 enabled già in status/FAILURES/run artifacts; Cagliari, Nuoro e Oristano partial; cache non disponibile | Sardegna non dichiarata completa; nessun URL nuovo dalla snapshot, scansione Calabria conclusa |
| Calabria — scansione offline fonti aperte | 9 sezioni; 3 enabled | 0 nuove | non ricalcolate | non ricalcolate | 0 nuovi eventi (nessun fetch) | 0 | 0 | Castrovillari/Catanzaro/Reggio Calabria: URL registrate già lette, attribuzione insufficiente o coda senza URL figlia esatta; 6 disabled; cache non disponibile | Calabria non completa; nessun URL nuovo dalla snapshot, scansione Campania conclusa |
| Campania — scansione offline fonti aperte | 17 sezioni; 7 enabled | 0 nuove | non ricalcolate | non ricalcolate | 0 nuovi eventi (nessun fetch) | 0 | 0 | URL registrate già in status/run artifacts o coda; due PDF Caserta senza evidenza attuale di calendario; 10 disabled; cache non disponibile | Campania non completa; nessun URL nuovo dalla snapshot, scansione Emilia-Romagna conclusa |
| Emilia-Romagna — `cai-20261023-emilia-romagna-cesena-attivita01`, CAI Cesena | 1 URL richiesta; contenuto non verificabile | 0 | 1 | 0 | 0 verificati; status registra 0 estratti ma non prova calendario vuoto | 0 | 0 | 4 issue: OCR PDF giovani, discovery-limit 7 PDF annuale, 1 `/programma-attivita`, 1 `/attivita`; nessun body/cache o HTTP metadata | Attribuzione HOLD; checkpoint run, poi preflight offline Friuli-Venezia Giulia |
| Friuli-Venezia Giulia — preflight offline | 12 fonti abilitate (su 39); 81 URL calendariali exact-host controllate | Non ricalcolate | Non ricalcolate | Non ricalcolate | 0 nuovi: nessun fetch | 0 | 0 | Tutte le URL same-host rappresentate in status/FAILURES/250 run artifact esaminati; cache non disponibile, nessun cache miss attestato | Regione incompleta; passaggio al Lazio |
| Lazio — `cai-20261023-lazio-sora-programma01`, CAI Sora `sora` | 1 URL letta (pagina annuncio, non calendario) | 0 complete | 1 partial | 0 unreachable | 0 verificati; HTML annuncia il programma e linka il PDF già fallito | 0 | 0 | PDF OCR failure + discovery-limit 9; nuova discovery-limit 1 sulla pagina | Nessun delta; checkpoint poi preflight offline di altra fonte Lazio |

Alpago: catalogo file 3.376 righe prima/dopo; due record esistenti cambiano solo `link`/`sourceDocument` sulla base del body preesistente `/programma-2-2/`, non attribuibile alla URL richiesta. QA importer integrità PASS, attribuzione HOLD. Database: 0 classificazioni, 0 eventi consegnati, nessuna query o scrittura. Test backend 206/206 dopo il run; hash dei sei JSON pubblici identici pre/post. Questi contatori descrivono il campione e non costituiscono copertura regionale completa.

Lombardia: il preflight ha esaminato i target candidati Busto, Carate, Legnano, Livigno, Missaglia, Sesto, Strada Storta e Varese; non è stato scelto un replay. Le fonti con 403/503 e i cooldown restano rispettati. L’assenza di una cache locale limita la conclusione: non si attesta che i candidati siano assenti dalla cache.

Marche: la scansione exact-host di registry, status, FAILURES e run artifacts non ha trovato un URL calendario non visitato selezionabile. Amandola/Sarnano/Pesaro hanno solo homepage unsupported; Ancona/Jesi, Fermo, San Benedetto, Senigallia e Potenza Picena hanno documenti già letti, problemi di parsing o discovery-limit; Macerata pagine già lette; Camerino programmi 2023/24; 4 disabilitate senza sito. La cache non era disponibile per controllo indipendente. Nessun evento verificato o database consegnato in questa scansione; la regione non è completa.

Molise: l’unica sezione enabled è Campobasso; le altre tre sono disabled senza sito/calendario. Il PDF programma 2026, i PDF SNE, il calendario attività, homepage/oEmbed e pagine SNE sono già rappresentati in status o FAILURES; restano due discovery-limit senza URL figlia esatta sicura. Nessun evento verificato o database consegnato; la cache locale non era disponibile, quindi non si attesta cache miss e Molise non è completa.

Puglia: le cinque sezioni hanno status, quattro sono enabled. Bari ha PDF senza parsing e discovery aperta; Foggia ha pagine lette e PDF annuale 404/size-limit; Gioia del Colle ha PDF letto, parser zero, discovery e oEmbed 500; Lecce ha PDF/pagine già lette con discovery aperta; Grottaglie è `no-upcoming` con iCal già letto. Non è emersa una URL calendario ufficiale exact-host unvisited selezionabile. Nessun fetch, evento nuovo o delivery DB; cache non disponibile, Puglia non viene dichiarata completa.

Sardegna: sette fonti, quattro enabled e tre disabled. Cagliari PAE, Nuoro e Oristano hanno URL ufficiali già nei documenti/status/failure e restano partial con discovery o parsing aperti; Villagrande è `no-upcoming`. Non è emersa una URL calendario exact-host unvisited selezionabile; il Google Calendar esterno in 403 non è sostituto sicuro. Nessun fetch/evento/delivery DB. La cache non è disponibile per controllo indipendente; Sardegna resta incompleta.

Calabria: 9 sezioni, 3 enabled (`cai-castrovillari-9244005`, `cai-catanzaro-9244004`, `cai-reggio-calabria-9244001`) e 6 disabled. Castrovillari `/prog.php` è già campionata e le URL candidate restanti non hanno attribuzione sufficiente o non sono calendari; Catanzaro ha già letto archivio/dettagli e discovery-limit senza URL figlia esatta; Reggio Calabria ha URL calendario già lette e resta un Google Drive 403 non utilizzabile. Nessun nuovo fetch o evento; cache non disponibile, Calabria non è completa.

Campania: 17 sezioni, 7 enabled e 10 disabled. Non è emerso un URL official-host exact selezionabile: gli eventi e le pagine sono già rappresentati in status/run artifacts o in discovery queue. I due PDF aggiuntivi di Caserta (“La Laghetta” e “badia di cava”) appaiono solo come riferimenti metadata e non sono nel body d’indice salvato, senza titolo/data o contesto attuale; non sono stati selezionati. Nessun fetch o evento; cache non disponibile, Campania resta incompleta.

Emilia-Romagna: CAI Cesena `cai-20261023-emilia-romagna-cesena-attivita01` ha richiesto una sola URL official-host, `https://www.caicesena.com/index.php/attivita`, max1/120s/concurrency1/no discovery. Status registra hash `63bd28…237bc`, 0 eventi e `method=null`, ma non persistono HTTP status, content type o body, e importer non ha trovato cache body. QA file PASS, attribuzione contenuto HOLD: non dichiarare calendario vuoto. Catalogo 3.376→3.376, 6 righe Cesena invariate, 0 add/remove/change/verified events; nessun Mercury/DB. Fonte partial, quattro issue aperte. Run file Cesena checkpointato a `71a6e18` e handoff a `05302da`. FVG: 39 sezioni, 12 enabled; 81 URL calendario same-host risultano già rappresentate in status/FAILURES/250 run artifacts esaminati; nessun cache miss attestato, regione incompleta. Lazio — run Sora `cai-20261023-lazio-sora-programma01`: cache HTML 75.149 byte, SHA `59df2257b67d462f64ffe2eee243f28c02310d0ec52c135349bed3576c9ea742`, titolo “Programma Escursionistico 2026”, articolo 17 gennaio 2026 che annuncia il programma e collega `QUI` al PDF `http://www.caisora.it/sito/wp-content/uploads/2026/02/2026.pdf`. PDF preesistente con OCR failure e discovery-limit 9, non seguito. La pagina annuncio è stata letta, non il calendario; `method=null`/0 righe non implica calendario vuoto. 3.376 righe nazionali, 10 ID `sora-*` invariati; 0 add/remove/change/verified events. Importer file-integrity/catalog PASS, copertura HOLD; test backend 206/206. Nessun DB. Dopo checkpoint, preflight offline di una diversa fonte Lazio, poi passaggio alla regione successiva se non selezionabile. Conteggi regionali storici non ricalcolati.

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
| Campania, CAI Caserta `cai-caserta-9238006` | 7 fonti enabled controllate offline; 1 indice specifico idoneo | 0 nuove verifiche evento | 7 status già partial/complete, nessun aggiornamento live | 0 nuove | Nessuno nel preflight; nessuna pagina letta | 0 | Nessuno | PDF annuale Caserta `CAI-F-d8cbb0f4bd01c6f5` discovery-budget-exhausted; altre code discovery restano da lavorare | Dopo checkpoint remoto, un solo run `https://www.caicaserta.it/escursioni.html`, max1 doc/120s/concurrency1 |

La pagina `/escursioni.html` è registrata come URL ufficiale (`calendarUrls` e `calendarEvidence`, `foundOn=self`), e manca da status documents, history dei run, cache con body/meta e FAILURES. Il suo cache key non ha contenuti persistiti. Il PDF annuale non va ripetuto: applicare solo la strategia bounded all'indice, senza seguire automaticamente i figli. Conteggi cumulativi Campania restano lo snapshot storico in testa al file, non una query attuale.

## Campania — CAI Caserta bounded index sample (22 ottobre 2026)

| Regione / run | Sezioni controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | DB consegnati | Prossimo passo |
|---|---:|---:|---:|---:|---|---:|---|---|---:|---|
| Campania, `cai-20261022-campania-caserta-index01` | 1 | 0 | 1 | 0 | 50 esistenti riconciliati invariati; 0 estratti dall'indice, `method=null` non prova calendario vuoto | 0 | Nessuno | Annual PDF discovery-limit 5; PDF Francigena OCR failure; indice `/escursioni.html` discovery-limit 1 | 0; nessun candidato, classificazione o query/write DB | Dopo checkpoint remoto, preflight offline dei link figli esatti |

Source `cai-caserta-9238006`; indice ufficiale 7.179 byte, body SHA `bb3bf1b613641c692e434db5496e461858509686bd2600b0cf299b80dd6ce039`. Catalogo nazionale 3366→3366 ID; prefisso Caserta 50→50, 0 add/remove/change, canonical SHA `1bc3d52b28218c621596dfbeb21e00a7b90bdb9fa2b0e0c4b405557498cb3b74`. Nessuna coordinata/campo evento modificato. Excursions si è rigenerato solo per metadata/source hash; sections invariato; status registra il documento e discovery. Backend `npm test` 205/205 dopo il run; hash JSON post-test uguali ai file sigillati e mirror backend/frontend identici. Importer QA PASS. La fonte resta parziale; i conteggi cumulativi tabellari restano lo snapshot storico del 20 ottobre. Il dettaglio hash è nel HANDOFF e nel run manifest.

Checkpoint completo di `cai-20261022-campania-caserta-index01` verificato sul branch al commit `52deb84835e47a355d66da4662dc7e9a877f2ab4`; manifest e blob catalogo/status corrispondono agli hash del report. Nessuna scrittura DB. Il preflight offline dei link figli è il prossimo passo, non ancora una raccolta.

## Preflight offline Caserta — link evento Monte Scalambra (22 ottobre 2026)

| Regione / fonte | Link verificati | Target futuri attribuibili | Già passati/archivio/non calendario | Fallimenti/cooldown | Prossimo passo |
|---|---:|---:|---:|---|---|
| Campania, `cai-caserta-9238006` | 7 link dalla pagina index checkpointata | 1: scheda Monte Scalambra, 25 ottobre (contesto 2026; anno da attestare nel PDF) | 2 eventi passati (17/18 ottobre), archivio 2025, flyer senza data, regolamento; PDF annuale bloccato già escluso | Nessun issue specifico sul dettaglio; annuale resta `discovery-budget-exhausted` | Dopo checkpoint remoto, un solo URL Monte Scalambra max1/120s/concurrency1; stop senza discovery |

Il target `https://www.caicaserta.it/escursioni/Monte%20Scalambra.pdf` è linkato accanto al testo che identifica Serrone, Monte Scalambra ed Eremo San Michele; è assente da status/history/cache/FAILURES. Il sample dovrà verificare evidenza nel documento e non assumere l'anno. Nessuna richiesta di rete nel preflight; nessun evento è contato o importato.

## Campania — CAI Caserta Scalambra01 (22 ottobre 2026)

| Regione / run | Sezioni controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | DB consegnati | Prossimo passo |
|---|---:|---:|---:|---:|---|---:|---|---|---:|---|
| Campania, `cai-20261022-campania-caserta-scalambra01` | 1 | 0 | 1 | 0 | 1 evento esistente corroborato dal PDF; 0 candidati parser; 50 righe sezione identiche | 0 | Nessuno | Annual discovery 5; index continuation 1; OCR failure PDF Francigena | 0; no classification/query/write | Checkpoint remoto, poi preflight offline altre fonti Campania |

PDF ufficiale della scheda Scalambra letto: 244.304 byte, SHA `d239fdc33cf9583b292bf84189c0c3b2dce0532a289b660b133e420a62142b9b`; il corpo attesta CAI Caserta, 25-10-2026, Anello Monte Scalambra 1420 m, E, Serrone/Eremo. Corrobora `cai-caserta-9238006-8ca304031e6a`; 3366 ID totali e 50 Caserta unchanged, zero delta; row hash `b517322f…3babb9`. Le coordinate esistenti `41.802,13.486` quality `massif` sono preservate e non attestate dal PDF. Properties del file hanno title/author estranei, caveat nel report; l'attribuzione deriva da body e pagina ufficiale linkante. Test backend 205/205, sei JSON stabili; importer QA PASS. Nessun DB. Caserta e Campania restano parziali; conteggi cumulativi in testa sono storico 20 ottobre.

Checkpoint Scalambra01, PDF fonte, report, evidence, catalog/status e registro copertura verificati remoti al commit `ae663ecfe2e1b7bb821832cf8f1b0e6bac6a94d3`. Stato database: nessuna scrittura perché il documento ha corroborato un evento già presente. Prossimo: preflight offline delle fonti Campania residue, senza estendere raccolta finché non c'è un URL distinto selezionato e checkpointato.

## Preflight Campania → Emilia-Romagna — 22 ottobre 2026

| Regione / fonti | Sezioni esaminate offline | Complete | Parziali/consumate | Irraggiungibili | Eventi verificati nel preflight | Duplicati esclusi | Issue aperte | Prossimo passo |
|---|---:|---:|---:|---:|---|---:|---|---|
| Campania, sei fonti enabled diverse da Caserta | 6 | 1 fonte senza issue (Monte Bulgheria, 6/6 docs letti) | 5 con URL configurati già letti o discovery queue non persistite | 0 nuove | Nessun nuovo evento verificato; preflight offline | 0 | Caserta annual discovery5/index continuation1/Francigena OCR; altre code discovery esistenti | Regione partial, passaggio a Emilia-Romagna senza dichiararla completa |
| Emilia-Romagna, CAI Cesena `cai-cesena-9224012` | 1 target selezionato | 0 nuove | Fonte `unsupported`; annual PDF ha discovery-limit7; PDF giovani distinto ha OCR failure | 0 nuove | Nessuno: URL non ancora letta | 0 | Annual discovery7 e PDF giovani OCR issue restano aperti, nessun cooldown sull'indice | Dopo checkpoint remoto, un solo `https://www.caicesena.com/index.php/programma-attivita`, max1/120s/concurrency1 |

L'indice Cesena è registrato e same-host; assente da status documents, cache e FAILURES. Preflight non ha fatto richieste. Nessun evento o stato di completezza è dedotto da un indice non ancora letto; i conteggi cumulativi regionali restano storico 20 ottobre.


## Emilia-Romagna — CAI Cesena index01 (22 ottobre 2026)

| Regione / run | Sezioni controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---|---:|---:|---:|---:|---|---:|---|---|---|
| Emilia-Romagna, `cai-20261022-emilia-cesena-index01` | 1 | 0 | 1 | 0 | 6 record esistenti verificati invariati; indice: 0 estratti con `method=null`, nessuna inferenza di calendario vuoto | 0 | 0 | annual PDF discovery7; PDF giovani OCR failure; indice discovery1 | Checkpoint file; poi un singolo JPEG ufficiale di escursionismo 2026 linkato dall’indice |

Run partial, file ready, DB pending. Il catalogo ha 3.366 ID prima/dopo, 0 add/remove/change; nessuna classificazione/import. L’unico documento HTML pesa 33.413 byte (SHA `292708d5ddddb26a9e412d30777ac7bfb47efc22fc51af71ea27c5642b8bc9c9`); la pagina presenta “Prossimi eventi - link calendario attività”, ma il parser restituisce method null. QA importer PASS, backend test 205/205 e sei JSON pubblici invariati durante la suite. Prossimo target già preflightato offline: `https://www.caicesena.com/images/download/2026/programma_2026_escursionismo_adattato_cai_cesena.jpg`; non risulta visitato né in cache/failure. Cumulativi regionali in testa rimangono snapshot storico 20 ottobre.


## Emilia-Romagna — CAI Cesena Escursionismo Adattato01 (22 ottobre 2026)

| Regione / run | Sezioni controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---|---:|---:|---:|---:|---|---:|---|---|---|
| Emilia-Romagna, `cai-20261022-emilia-cesena-escursionismo01` | 1 | 0 | 1 | 0 | 0 record completi; poster OCR con date 2026 non abbinate a titoli/destinazioni; 6 righe Cesena preesistenti invariate | 0 | 0 | annual PDF discovery7; PDF giovani OCR failure; index discovery1 | Dopo checkpoint remoto `b23dea1`, CAI Pavullo: un URL ufficiale calendario 2026, max1/120s/concurrency1 |

Il JPEG ufficiale 2026 pesa 685.319 byte (SHA `6c11893a0b371c51650c39a8275a777d13bc06f29dc0f9204fd6aaf6bc72702c`), OCR `image-ocr`; il poster elenca date future ma non titoli o destinazioni per singola escursione. Non sono stati prodotti eventi o coordinate. Catalogo nazionale 3.366→3.366 ID; zero add/remove/change, sei righe Cesena invariate. Fonte partial. QA importer PASS; backend test 205/205 e sei JSON pubblici invariati. Nessuna classificazione/DB. Prossimo target offline: CAI Pavullo `https://www.caipavullo.it/calendario-2026/`, URL ufficiale same-host non visitato né in cache/failure; altre issue Pavullo sono su URL distinti e non si ripetono. Cumulativi regionali in testa restano storico del 20 ottobre.


## Emilia-Romagna — CAI Pavullo calendario01 (22 ottobre 2026)

| Regione / fonte | Sezioni controllate | Complete | Parziali | Irraggiungibili | Eventi estratti / approvati / hold | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---|---:|---:|---:|---:|---|---|---|---|---|
| Emilia-Romagna, `cai-pavullo-nel-frignano-9224020` | 1 URL | 0 | 1 | 0 | 5 ID nuovi estratti; 1 approvato per consegna; 4 `da_verificare` per possibile sovrapposizione o categoria incoerente | Conteggio semantico esatto non persistito | Nessuno | PDF legacy timeout; iCal discovery5; calendario continuation1; incongruenza header anno | Dopo checkpoint e consegna mirata Hoabonti, preflight offline della successiva URL distinta lavorabile |

Il campione è parziale. La pagina ufficiale restituisce 23 righe; catalogo 3.366→3.371 ID, zero rimozioni/modifiche alle righe esistenti. Mercury richiesto `inception/mercury-decide`, risposta attestata `inception/mercury-decide-20260930`, 5/5 senza errori. La review approva solo Monte Hoabonti/Monte Cola (EE), categoria effettiva `a piedi`; holds: Spigolo Bianco, Anello dei Colli, Lago Terzo, Giro del Colbricon. Nessuna coordinata. Test backend 205/205 dopo raccolta, sei JSON pubblici invariati. Preflight DB: 4.422 places, Hoabonti assente, tabella classification presente, FK RESTRICT; scrittura ancora pending.


### Pavullo database delivery (22 ottobre 2026)

1 place + 1 classification realmente inseriti: `cai-pavullo-nel-frignano-9224020-195cdeaaefee`. DB place count 4.422→4.423; target assente in entrambe le tabelle prima dell’import, joined 1/1 dopo. Saltati 0, update/delete 0. Nessuna coordinata o cover assegnata. Quattro candidati in revisione non inclusi. Ricevuta `backend/data/agent-runs/cai-20261022-emilia-pavullo-deliver01/output/delta-import-receipt.json`; commit dati `5697dcd`.


## Lombardia — CAI Sesto Calende preflight offline (22 ottobre 2026)

| Regione / fonte | Controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Duplicati esclusi | Issue aperte | Prossimo passo |
|---|---:|---:|---:|---:|---|---|---|---|
| Lombardia, `cai-sesto-calende-9216044` | 1 URL in sola lettura offline | 0 | fonte già parziale, 0 nuovi fetch | 0 | 0 nel preflight | n/a | PDF annuale con OCR/dimensione bloccata | Dopo checkpoint, un solo fetch pagina HTML max1/120s/concurrency1; non ripetere PDF annuale |

La URL `https://caisestocalende.it/calendario-sezionale/` è collegata alla fonte da `calendarUrls`/`calendarEvidence`, assente da status, cache e FAILURES; nessun cooldown specifico. Nessun evento o stato calendario dedotto dall’indice non letto. Nessuna rete nel preflight.


## Lombardia — CAI Sesto Calende Sesto01 (22 ottobre 2026)

| Regione / run | Sezioni controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---|---:|---:|---:|---:|---|---:|---|---|---|
| `cai-20261022-lombardia-sesto01`, CAI Sesto Calende | 1 pagina HTML | 0 | 1 | 0 | 0 estratti; 18 record Sesto esistenti invariati | 0 | Nessuno | PDF annuale storico (29 righe, manual-QA), index discovery-limit 1 | Dopo checkpoint, preflight offline prossima fonte Lombardia distinta |

La pagina HTML ufficiale è 121.924 byte, hash `28e233db…bde8`; `method=null`, quindi zero estrazioni non prova calendario vuoto. Il PDF collegato è già stato letto e non è stato ritentato. Catalogo 3.371 ID invariati. Importer QA PASS; backend 205/205; sei JSON pubblici stabili; nessuna scrittura DB.


## Lombardia — CAI Somma Lombardo preflight offline (22 ottobre 2026)

| Regione / fonte | Controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Duplicati esclusi | Issue aperte | Prossimo passo |
|---|---:|---:|---:|---:|---|---|---|---|
| `cai-somma-lombardo-9216065` | 1 URL in offline preflight | 0 | fonte attuale partial, 0 nuovi fetch | 0 | 0 nel preflight | n/a | SIEL full programme download/size/OCR issues; summary PDF size-limit; Varese 503 unrelated | Checkpoint, then one specific Blinnenhorn PDF max1/120s/concurrency1 |

Il flyer puntuale `Rifugio Somma - Blinnenhorn (EE)` è registrato nella registry come evidenza ufficiale e assente da cache/status/FAILURES; nessuna richiesta di rete nel preflight. Il calendario SIEL generale e gli URL bloccati non saranno ripetuti.


### Correzione target Somma prima del fetch

Il primo `orchestrate init` sull’host apex è stato rifiutato prima della rete: il validator richiede `www.caisomma.it`. Nessun run, lock o request è stato creato. Offline registry conferma `source.website=https://www.caisomma.it/` e `calendarEvidence` registra il medesimo path flyer sull’apex; la variante www same-path è assente da cache/status/FAILURES. Dopo checkpoint, un solo fetch www bounded; risposta/redirect ancora non verificati.


## Lombardia — CAI Somma Lombardo Blinnenhorn01 (22 ottobre 2026)

| Regione / run | Sezioni controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---|---:|---:|---:|---:|---|---:|---|---|---|
| `cai-20261022-lombardia-somma-blinnenhorn01`, Somma Lombardo | 1 PDF puntuale | 0 | 1 | 0 | 0 eventi completi; flyer attesta itinerario EE ma non data dell’uscita; scadenza iscrizione 25/07/2026 esclusa | 0 | Nessuno | SIEL full-PDF download-aborted; scheda riepilogativa size-limit; Varese endpoint 503 | Checkpoint e poi preflight offline altra fonte Lombardia distinta |

Il catalogo resta 3.371 ID; 14 righe Somma invariate. No coordinates, classification, query or DB write. Importer QA PASS; backend tests 205/205; sei public JSON stabili.


## Lombardia — CAI Varese calendarannual preflight (22 ottobre 2026)

| Regione / fonte | Controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Duplicati esclusi | Issue aperte | Prossimo passo |
|---|---:|---:|---:|---:|---|---|---|---|
| `cai-varese-9216009` | 1 URL selezionata offline | 0 | fonte partial, 39 documenti / 2 issue | 0 | 0 nel preflight | n/a | 503/cooldown trascorso su iCal distinto; iCal discovery-limit | Checkpoint e fetch solo della pagina annuale max1/120s/concurrency1 |

`https://www.caivarese.it/calendarioannuale` è registrata come calendario annuale ufficiale e assente da cache/status/FAILURES/run precedenti. Il 503 non riguarda questa URL; l’iCal non verrà seguito. Nessuna richiesta di rete nel preflight.

## Lombardia — CAI Varese calendarannual01, esito corrente (22 ottobre 2026)

| Regione / run | Sezioni controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---|---:|---:|---:|---:|---|---:|---|---|---|
| `cai-20261022-lombardia-varese-calendar01`, CAI Varese | 1 URL esplicita | 0 | 1 | 0 | 0 nuovi; la richiesta calendarannual risolve nel cache mapping a un PDF CAI Calendar2025 già noto (58 record Varese restano invariati); non attestata freschezza del calendario 2026 | 0 | Nessuno | cache senza status HTTP 200/304; iCal MTB 503; iCal eventi discovery-limit 93 | Dopo checkpoint, preflight offline di una diversa fonte Lombardia; non ripetere calendarannual o code iCal senza nuova evidenza/strumentazione |

Catalogo 3.371→3.371 ID unici; Varese 58→58, add/remove/change 0. Importer ha validato i manifest/cataloghi ma ha messo in HOLD l’accettazione della freschezza fonte; nessun evento da classificare, nessuna coordinata o scrittura DB. Il body in cache ha hash `ce93c4c3b0cfeff2da1f94641a43dc698920c7440ef959e4af5812ae285f09ce`, 3.208.298 byte, final URL il PDF 2025. Il relativo `collection-report.md` chiarisce che il cache non prova se il body sia stato trasferito con 200 o rivalidato con 304 e che “zero nuovi eventi” non equivale a calendario vuoto. Backend `npm test` 205/205 dopo collection; sei JSON pubblici byte-identici prima/dopo i test.

Correzione offline: Lissone è esclusa prima del run perché il target apex non supera l’host validator, mentre la variante www risulta già visitata nel run `cai-20261020-lombardia-deep-11` (24 eventi, `html-calendar`). Nessuna richiesta è stata fatta.

Preflight Carate distingueva correttamente la URL richiesta nuova dal suo alias finale, ma la final URL del PDF risultava già nei 18 documenti di status; dunque è stato un controllo limitato della stessa evidenza, non nuova copertura documentale. Il volantino ufficiale del 63° Corso di Alpinismo ha host esatto www.caicaratebrianza.it e consentito; un solo documento max1/120s/concurrency1. La fonte rimane parziale per backlog 344 sull’annuale e timeout palestra, entrambi fuori scope.

## Lombardia — CAI Carate Brianza corsoalpinismo01 (23 ottobre 2026)

| Regione / run | Sezioni controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---|---:|---:|---:|---:|---|---:|---|---|---|
| `cai-20261023-lombardia-carate-corsoalpinismo01`, CAI Carate Brianza | 1 PDF ufficiale | 0 | 1 | 0 | 1 evento storico del corso verificato con date corrette 4–5 luglio; 0 eventi futuri/nuovi, 6 record Carate invariati | 0 | parsing `04/05-lug` corretto con fixture/test in `e277de5` | annuale discovery-limit 344; pagina palestra timeout | checkpoint report/fix, poi preflight Lombardia distinta; nessun retry annuale/palestra |

Il PDF finale è `Volantino 63 Corso Alpinismo 2026 Rev.03.pdf`, 928.543 byte, SHA `05117835947e634494ceea7eea854398af8e3f839a62cce9fc55d8c5e8edfd8c`; status HTTP non esposto. L’estrazione iniziale era errata (`2026-05-04`, senza intervallo); il testo `04/05-lug` ora produce 2026-07-04..05 e il parser cache version è passato a 14. Fixture minimizzata, focused tests 2/2, backend `npm test` 206/206 dopo il run; i sei JSON pubblici non sono stati riscritti dai test. Il documento era già nello status alla baseline, il catalogo nazionale resta 3.371 ID e nessuna riga Carate è stata aggiunta/rimossa/modificata. Il corso è passato al 23 ottobre, quindi non si classifica/importa. Importer QA: manifest/mirror validi, nessun delta idoneo; nessuna coordinata o DB write.


## Passaggio regionale — Lombardia esaurita per la selezione corrente → Sicilia (23 ottobre 2026)

| Regione / fonti esaminate | Sezioni controllate | Complete | Parziali | Irraggiungibili | Eventi verificati in questo preflight | Duplicati esclusi | Fallimenti risolti/aperti | Prossimo passo |
|---|---:|---:|---:|---:|---|---:|---|---|
| Lombardia, preflight offline post-Carate | fonti residue ricontrollate nel registry, cache, status, FAILURES e run artifacts; nessun nuovo URL host-exact lavorabile | 0 nuove | fonti restano parziali | 0 nuove richieste | 0 nuovi eventi (preflight senza rete) | 0 | Risolti: parser Carate e range 04/05-lug fixture-backed; aperti: Varese 503+iCal discovery 93, Brescia 403/404 cooldown, più residui già campionati/non produttivi | Passare oltre senza dichiarare Lombardia completa; non ripetere URL consumate |
| Marche, Molise, Piemonte, Puglia, Sardegna | verifica offline in ordine regionale fino al primo target | 0 nuove | registri/campionamenti storici restano parziali | 0 nuove richieste | 0 (nessuna raccolta) | 0 | Nessun nuovo errore risolto; candidate escluse perché alias/già lette, passate, consumate o fallite | Nessun target selezionato in queste regioni |
| Sicilia — CAI Belpasso `cai-belpasso-9246010` | 1 URL ufficiale distinto, preflightato | 0 (non ancora fetch) | 1 selezionata; issue PDF OCR e iCal discovery sono separate | 0 | 0 (pagina non ancora letta) | 0 | Nessuna nuova failure osservata offline | Dopo checkpoint remoto selezione: run singolo `cai-20261023-sicilia-belpasso-programma01`, URL programma 2026, max1 documento/120s/concurrency1; non seguire PDF/iCal |

I totali regionali nella tabella storica iniziale restano snapshot 2026-10-20; questo preflight non ha interrogato o ricalcolato la copertura aggregata. Conteggi raccolta/file/DB per Belpasso restano 0/0/0 finché il run e l’eventuale delivery non saranno verificati.


## Sicilia — CAI Belpasso programma01 (23 ottobre 2026)

| Regione / run | Sezioni controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Sicilia, `cai-20261023-sicilia-belpasso-programma01` | 1 URL ufficiale | 0 | 1 | 0 | 0 estratti (unsupported/method=null; non equivale a calendario vuoto) | 0 | 0 | Program page discovery-limit 1; brochure PDF OCR failure; iCal discovery-limit 7 | Dopo checkpoint, preflight offline di un URL Sicilia distinto; Belpasso è informativa, non prova di calendario vuoto; non ripetere PDF/iCal |

Catalogo da checkpoint remoto `1695a08`: 3.371→3.371 ID unici; Belpasso 0→0, nessun add/remove/change. File 1 run manifest verificato e pronto, nessun candidato DB; classificazioni/import consegnati: 0. Test backend 206/206, sei JSON pubblici invariati pre/post. I valori regionali storici in testa restano snapshot 2026-10-20 e non sono query correnti.


Diagnosi offline del body: articolo informativo sul programma 2026, senza date/event rows/calendar markup/JSON-LD Event; metodo `unsupported` corretto, nessun parser fix. Nessuna raccolta ulteriore in parallelo.


## Preflight Sicilia completato — passaggio Toscana (23 ottobre 2026)

| Regione / ambito | Sezioni controllate | Complete (stato registrato) | Parziali (stato registrato) | Irraggiungibili | Eventi verificati nel preflight | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Sicilia, sezioni abilitate | 4 | 1 `no-upcoming` (Giarre, stato persistito) | 3 (Belpasso, Cefalù, Erice) | 0 nuove | 0 | 0 | 0 | Belpasso brochure OCR/iCal; Cefalù e Erice discovery-limit senza URL residua persistita | Regione incompleta ma senza ulteriore target esatto selezionabile; passare Toscana |
| Sicilia, sezioni disabilitate | 25 | n/a | n/a | 1 Catania | 0 | 0 | 0 | 24 missing-website; 1 unreachable | Conservare come non verificate/irraggiungibili, nessuna URL inventata |

I conteggi `complete/partial` riflettono gli stati persistiti, non nuovi test di rete né un ricalcolo regionale. Il preflight non ha aggiunto eventi e non ha interrogato o scritto DB. I totali nazionali in testa restano snapshot storico 2026-10-20.


## Preflight Toscana — CAI Fivizzano (23 ottobre 2026)

| Regione / sezione | Controllate offline | Complete | Parziali (stato registrato) | Irraggiungibili | Eventi verificati nel preflight | Duplicati esclusi | Fallimenti risolti/aperti | Prossimo passo |
|---|---:|---:|---:|---:|---:|---:|---|---|
| Toscana — CAI Fivizzano `cai-fivizzano-9226019` | 1 URL selezionato | 0 nuove verifiche | 1 fonte `unsupported` nello stato persistito | 0 nuove | 0 (URL non letta) | 0 | Nessuno risolto; PDF annuale OCR failure e discovery-limit 8 restano aperti su URL separata | Dopo checkpoint, campione singolo `https://www.caifivizzano.it/calendario-uscite/`, max1/120s/concurrency1 |

Il target pagina è nuovo rispetto a documenti/status/cache/FAILURES/run artifacts; non implica calendario vuoto o completo. Nessuna raccolta/DB avvenuta.


## Toscana — CAI Fivizzano calendar01 (23 ottobre 2026)

| Regione / run | Sezioni controllate | Complete | Parziali | Irraggiungibili | Eventi estratti/verificati | Duplicati semantici esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Toscana, `cai-20261023-toscana-fivizzano-calendar01` | 1 | 0 | 1 | 0 | 10 righe documento; 5 nuovi ID grezzi, di cui 4 classificabili | 1 escluso (`5b1c92eec5ec` → esistente `b759d3dd85b0`) | 0 | Annual PDF OCR failure/discovery 8; pagina calendario discovery 1 | Checkpoint file, classificare solo 4 ID; QA e checkpoint batch, poi import mirato/receipt |

Delta file contro checkpoint remoto `316f03b`: 3371→3376 ID unici, +5/0 remove/2 existing updates (solo `sourceDocument`). Due righe esistenti non vanno aggiornate in DB. Nuovi eventi senza coordinate verificate. Run `partial/files ready/database pending`; importer QA PASS; test 206/206, sei JSON pubblici stabili pre/post. DB inseriti: 0; classificazioni: 0 (ancora pending). I totali Toscana nazionali restano lo snapshot storico 2026-10-20, non una query corrente.


## Toscana — stato Fivizzano al 23 ottobre 2026

| Regione / fonte | Sezioni controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Toscana — `cai-fivizzano-9226019`, `calendar01` | 1 | 0 | 1 | 0 | 10 righe di calendario; 4 nuovi ID non duplicati candidati | 1 | 0 | PDF annuale OCR failure/discovery-limit 8; pagina discovery-limit 1 | Classificazione isolata sospesa finché il runtime non torna online; poi QA/import mirato |

Raccolta/file: 3.371→3.376 ID unici, +5 raw, 0 rimossi; 2 record esistenti cambiano solo `sourceDocument` e non fanno parte del delta DB. Database: 0 inserimenti, 0 classificazioni, nessuna query o write in questo passaggio. Il duplicato `5b1c92eec5ec` resta escluso in favore di `b759d3dd85b0`; 4 ID attendono classificazione. I conteggi nazionali sono snapshot storici, non una query corrente. Runtime `connectivity=offline`; si riprende dopo preflight online, senza ripetere raccolta.


### Aggiornamento operativo — dopo checkpoint remoto Fivizzano

Il delta file e input di classificazione sono recuperabili dal branch a `3341fc9`; 4 ID attendono Mercury, 1 duplicato escluso, nessun evento/classificazione scritto nel DB. Il runtime è ora `connected` e `openrouter.ai` consentito; prossimo passo: run Mercury circoscritto, QA importer, checkpoint e import mirato. Toscana resta parziale: non confondere il singolo campione con copertura regionale completa.

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


## Toscana — Pescia index01 e selezione successiva (23 ottobre 2026)

| Regione / run | Sezioni controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---|---:|---:|---:|---:|---|---:|---|---|---|
| Toscana, `cai-20261023-toscana-pescia-index01`, CAI Pescia | 1 URL `/cp/calendario-attivita-cai-pescia/` tentata | 0 | 1 (esito di run `failed`, regione ancora aperta) | 0 osservati; errore client timeout | 0; nessun body/status HTTP/cache, non implica calendario vuoto | 0 | regressione di status riparata, conservati 12 documenti e discovery-limit agosto | timeout 8.000 ms su `/cp/`; issue mensile agosto resta separata | pubblicare checkpoint e passare a singolo URL Fivizzano miniera |

Catalogo 3.376→3.376, 0 add/remove/change; nessuna classification/import/DB. QA importer PASS; manifest `c5e3e308...dd74c81`, state `afae40f6...cc9db1`, report `e9a5d66e...4905b49`. FAILURES 716→717 con record `CAI-F-6ccdc9044ca287f1`. Suite backend 206/206 dopo la raccolta e la riparazione; sei JSON pubblici invariati e mirror identici. Fresh join dello status toscano persistito alle 00:42:23Z: 37 sezioni, 17 enabled (9 partial, 4 unsupported, 2 failed, 1 ok, 1 no-upcoming), 90 eventi; non è audit di rete.

Collector ha fatto preflight offline senza richieste/test/scritture. Prossimo singolo target: CAI Fivizzano, `https://www.caifivizzano.it/eventi/le-miniere-di-calcaferro/`, URL ufficiale distinta presente nel registro ma assente da status/cache/FAILURES; fonte ancora partial con errori PDF/discovery separati. Run proposto `cai-20261023-toscana-fivizzano-miniere01`, max1 documento/120s/concurrency1/no discovery, solo dopo checkpoint remoto. Nessun conteggio storico nazionale presentato come query attuale.


## Toscana — Fivizzano miniera01 e selezione Escursionismo (23 ottobre 2026)

| Regione / run | Sezioni controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---|---:|---:|---:|---:|---|---:|---|---|---|
| Toscana, `cai-20261023-toscana-fivizzano-miniere01`, CAI Fivizzano | 1 pagina ufficiale | 0 | 1 | 0 | 1 record verificato, 06-09-2026 “Expired!”, nessun evento futuro importabile | 0 | 0 | PDF OCR; discovery-limit PDF 8, calendario 1, pagina miniera 1 | checkpoint file/QA, poi pagina categoria `/escursionismo/` max1/120s/concurrency1 |

Raccolta/file: body in cache 78.848 B SHA `964450e315da16e5a176b174462eac8b9f446b9475222ea766cb0756749e3b27`; output conferma 3.376→3.376 catalogo e 12→12 righe Fivizzano, row hash invariato `052158f0d916607fe02a746b29c0027d44a39239fd6a16fa282d1c48a04c9905` (righe per prefix, ordinate per id, Node JSON.stringify UTF-8 SHA-256); nessuna aggiunta/rimozione/modifica. Nessun duplicato o fallimento risolto. DB: 0 eventi, 0 classificazioni, nessuna query/write. Test backend 206/206 dopo raccolta; sei hash JSON pubblici stabili prima/dopo; QA importer PASS dopo correzione hash. Fivizzano resta partial, non completa.

Preflight offline dopo il run: selezionata `https://www.caifivizzano.it/escursionismo/`, URL ufficiale categoria distinta in registry, assente da status/cache/FAILURES; outcome da verificare senza aspettarsi eventi. Proposto run `cai-20261023-toscana-fivizzano-escursionismo01`, max1 documento/120s/concurrency1/no discovery, solo dopo checkpoint remoto.


## Toscana — Fivizzano escursionismo01 e selezione landing Attività (23 ottobre 2026)

| Regione / run | Sezioni controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---|---:|---:|---:|---:|---|---:|---|---|---|
| Toscana, `cai-20261023-toscana-fivizzano-escursionismo01`, CAI Fivizzano | 1 URL ufficiale categoria | 0 | 1 | 0 | 1 evento futuro (15-11-2026), corroborato con esistente `...-2d592e7a1731` | 0; match esatto a riga esistente | 0 | PDF OCR + discovery 8; calendario 1; Miniera 1; Escursionismo 1 | checkpoint file/QA; poi landing `/attivita/` max1/120s/concurrency1 |

Raccolta/file: 1 evento verificato, 1 esistente corroborato, 0 nuovo ID, 0 aggiornamenti/rimozioni. Catalogo 3.376→3.376, prefix Fivizzano 12→12; riga corroborata SHA `1b23109177824b6f4f830f8d3baf96175009e7985666e80a1bf831a238a574ea` immutata. 0 coordinate nuove. DB: nessuna classificazione/import/query/write. Importer PASS; backend `npm test` 206/206 dopo raccolta e sei hash JSON pubblici identici pre/post; mirror coincidenti. Fonte resta partial.

Preflight offline successivo ha selezionato `https://www.caifivizzano.it/attivita/`, URL landing ufficiale distinta non presente nei documenti status, cache o FAILURES. Un solo run `cai-20261023-toscana-fivizzano-attivita01`, max1 documento/120s/concurrency1/no discovery dopo checkpoint remoto; nessuna aspettativa di calendario fino alla verifica del contenuto.


## Toscana — Fivizzano Attività e passaggio a Veneto (23 ottobre 2026)

| Regione / run | Sezioni controllate | Complete | Parziali | Irraggiungibili | Eventi verificati | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti | Prossimo passo |
|---|---:|---:|---:|---:|---|---:|---|---|---|
| Toscana, `cai-20261023-toscana-fivizzano-attivita01`, CAI Fivizzano | 1 landing ufficiale | 0 | 1 | 0 | 0 righe datate riconosciute; pagina informativa e link a calendari, zero non significa calendario vuoto | 0 | 0 | PDF annuale OCR; discovery-limit 8 PDF, calendario 1, Miniera 1, Escursionismo 1, Attività 1 | Toscana esaurita per URL esatte sicure; passare a CAI Alpago in Veneto |

Raccolta/file: pagina HTML cached 120.061 B, SHA `604cf46e065b652ead0d4a894369733eaa94f7456a84a35fa6ffbf61b9c4ab0d`; `method=null`, no dated rows. Catalogo totale 3.376, Fivizzano 12, zero add/remove/change; nessuna coordinata. File QA PASS; test backend 206/206 post-run, sei hash pubblici stabili e mirror identici. Database/classificazioni: nessun candidato, nessuna query/write. Fivizzano resta parziale. In sequenza, i due run precedenti sono: Miniera01 (un record passato scaduto, escluso) e Escursionismo01 (una riga futura esattamente corroborata con ID esistente, no delta).

Preflight offline dopo Attività: nessuna ulteriore URL Toscana sicura distinta; unica URL Fivizzano non visitata è già esclusa come duplicato semantico, Pescia è in timeout, le altre URL sono consumate/failed o backlog senza target esatto. Il preflight Trentino non trova URL sicure; Umbria e Valle d’Aosta non hanno URL host-exact nuove. Primo target successivo: CAI Alpago `cai-alpago-9220065`, Veneto, `https://www.caialpago.it/programma-2/`, official-host linked by homepage, assente da status/cache/FAILURES; un solo documento/120s/concurrency1 dopo checkpoint.


Cesena Attività01: manifest `fac455d43a27e0c481290615a3fa0fcb6fc51b59395643f80676562aba2fd8d6`, state iniziale orchestratore `1459a291193ec93e6443cc5089d9bab9a80599284a4155d3887a1d808032ef75` (successivamente arricchito con report/evidenza), catalogo `d46ab729d0622ada4690df4a3ff80a55b33156db011010160538ad42913db180`, status `594840969f883b3bdb98d9bef311fe986843c3c414e0efe81c67f638451204ce`; run report ed evidence-manifest nel run directory. Test backend 206/206 dopo raccolta; sei JSON pubblici stabili. La regione resta parziale e non coperta completamente.


Preflight FVG/Lazio: scansione read-only senza rete o test. Per FVG nessun URL nuovo selezionabile nella snapshot. Per Sora, il run `cai-20261023-lazio-sora-programma01` resta subordinato al checkpoint remoto della selezione; non interpretare il precedente stato PDF della sezione come esito della nuova pagina.

Sora01 hash manifest `dc7f33fc5539548b66ff4aad9d494520df6a4dd50e37cfbb651430eb22a1dad7`, state `75f503ae185ee9738852eb89e903b7842b3314f8512d7a4501a0edb424098637`; catalogo excursions `8b85cc89fab45cfe8cfd8ab87b98ed1d4d23eda55a9d9f616747524e10207717`, scrape-status `17878e18154e304fb603fd630b9514c2b82311b49a038c15f6f8b16eca5f486f`; run artifacts con source evidence e receipt file checkpoint in preparazione.
