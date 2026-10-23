# Piano di passaggio al lavoro interamente cloud

Stato aggiornato al 23 ottobre 2026: branch remoto verificato a `9f99117fb676a74630084b51f644d9924e74c863`. Cesena e Sora programma01 sono checkpointati senza delta; il feed iCal Sora è stato letto correttamente (VCALENDAR 2.0, 0 VEVENT), quindi vuoto per quello specifico feed, mentre la sezione intera resta partial per PDF OCR/discovery e annuncio discovery. Importer PASS, nessun DB; backend test 206/206. Report/evidenza iCal pubblicati a `b143fe5`; preflight Liguria ed Emilia-Romagna senza target residui sicuri; non ripetere le code note. Riprendere con un run bounded solo quando una nuova URL ufficiale exact-host sia evidenziata e checkpointata. Non ripetere Valmadrera, Fivizzano o batch storico 3.336. I passi S0–S7 sotto sono piano storico, non affermazioni sul completamento nazionale.

## Sequenza

| Passo | Responsabile | Lavoro | Prova di completamento |
|---|---|---|---|
| S0 — contesto condiviso | Orchestratore | Allineare il branch; predisporre questo spazio e indicare l'ultimo lotto verificato. | File di coordinamento pubblicati su GitHub; riferimenti e JSON validi. |
| S1 — baseline e formato | Orchestratore + importer | Definire formato LF per gli artefatti sigillati, distinguere snapshot storici dal catalogo corrente e fissare il commit dei dati di partenza. | Checkout nuovo: i sei hash della baseline passano senza cambiare manifest o dati. Riconosciuto come incompleto `cai-20261020-piemonte-ocr-01`. |
| S2 — avvio riproducibile | Collector | Correggere bootstrap non-root, individuazione del checkout, versioni Node/proxy e dati OCR. Eliminare dipendenze indispensabili da `/tmp` o `.env` non ricostruibili. | Ambiente ripubblicato; una sessione nuova verifica Node, Poppler, `ita`/`eng`, rete e TLS senza intervento sul PC. |
| S3 — preflight e test isolati | Orchestratore + collector | Registrare identità dell'ambiente, commit e controlli reali; separare gli output dei test dal catalogo. Provare rete con lo stesso stack e worker usati dallo scraper. | Il test non modifica alcun file del catalogo; HTML e PDF di prova sono raggiungibili tramite il proxy previsto. |
| S4 — lotto durevole | Collector + orchestratore | Prevedere input/output recuperabili per run, manifest e prove minime per fonte; salvare un checkpoint remoto prima dell'import. | Da un checkout nuovo si ricostruisce esattamente l'input dell'import dal commit indicato. Non basta un manifest che punta a file correnti già sovrascritti. |
| S5 — import e ricevuta uniformi | Importer | Definire il percorso supportato CLI/MCP e registrarlo; collegare ricevuta, commit e hash. Rendere recuperabile anche un import interrotto dopo scritture DB. | Query e ricevuta verificano ID presenti/pubblicati/mancanti e contenuti protetti. `database=completed` da solo non vale come nuova verifica. |
| S6 — prova tra sessioni | Orchestratore + due agenti | Sessione A raccoglie un piccolo lotto e lo pubblica; sessione B, appena creata, verifica gli stessi file e completa l'import o la riconciliazione. | Tutti gli obiettivi O1–O6 soddisfatti con evidenze salvate; nessun file recuperato dal PC o dalla sessione A. |
| S7 — estensione regionale | Orchestratore | Applicare la procedura qualificata alle fonti ancora aperte, in lotti limitati. | Ogni lotto ha checkpoint e ricevuta; errori/parziali restano in coda senza retry infiniti o attività ricorrenti. |

Dipendenze: S1 → S2 → S3 → S4 → S5 → S6 → S7. La progettazione di S5 può
procedere in parallelo a S2–S4; nessuna scrittura DB anticipa il checkpoint S4.

## Impedimenti osservati e correzioni da progettare

| ID | Evidenza nel repository o nei rapporti | Conseguenza |
|---|---|---|
| G1 | `.codex/setup-cloud.sh` presume `sudo` nel ramo non-root; il primo run cloud ha dovuto predisporre i dati lingua a parte. | Installazione e disponibilità OCR non sono garantite in una sessione nuova. |
| G2 | Il setup accetta genericamente Node 22+, mentre la raccolta usa il proxy nativo tramite `NODE_USE_ENV_PROXY=1`. | Pin e verifica della versione effettivamente provata; il runtime precedente era Node 24.19.0. Non basta "22+". |
| G3 | Cache in `backend/node_modules/.cache/cai`, discovery e OCR sotto directory temporanee; gli artefatti non contengono sistematicamente estratti OCR con pagina e hash. | Le cache possono essere ricostruibili, ma le prove indispensabili devono sopravvivere alla sessione. |
| G4 | `orchestrate-cai.js` sigilla tre JSON correnti; il lotto Piemonte storico ne sigilla sei, inclusi i mirror. Il rapporto ha un hash separato nello stato. | Unificare il contratto per i nuovi lotti, senza riscrivere i manifest storici. |
| G5 | L'import CLI richiede variabili backend; il run storico ha completato l'import tramite Supabase MCP e registrato l'esito nello stato. | Il percorso MCP va formalizzato e verificato; non può dipendere da interventi manuali non descritti. |
| G6 | `status` legge soltanto il file; un import già `completed` ritorna senza interrogare il DB. | Prevedere una riconciliazione in lettura per la ripresa, senza rietichettare operazioni non eseguite. |
| G7 | Il workflow manuale importa prima del commit. L'upload ha già `if: always()`, ma avviene dopo il DB e non include `excursions.json`. | Non garantisce un input recuperabile remoto prima della prima scrittura DB. Il percorso Codex non deve dipendere dal workflow che fa push su `main`. |
| G8 | `backend/test/sede.test.js` passa file temporanei a `runScrape`, ma `backend/scripts/scrape.js` copia comunque il payload in `frontend/public/excursions.json`. | Il test può sostituire il catalogo pubblico con una fixture; aggiungere output frontend iniettabile e prova d'isolamento. |
| G9 | Con `core.autocrlf=true`, i sei file locali Windows differiscono nei byte dai blob Git, che coincidono tutti col manifest del run Piemonte. | Fissare i terminatori degli artefatti; un hash valido sul blob non autorizza l'import di byte locali non verificati. |
| G10 | Il lock dell'orchestratore è una directory nel checkout; due sessioni cloud hanno filesystem distinti. | Una sola sessione scrittrice per run; definire ownership e controllo di concorrenza tra sessioni, senza trattare il lock locale come protezione distribuita. |

## Contratto proposto per i nuovi lotti — ancora da implementare

- Input di partenza identificato da commit e manifest verificati.
- Sessione responsabile del lotto identificata esplicitamente. La ripresa avviene
  dopo la chiusura o il passaggio documentato della precedente sessione; progettare
  un controllo condiviso prima di consentire due sessioni scrittrici concorrenti.
- Copie dei file da importare recuperabili per run, senza dipendere dai soli file
  canonici mutabili. Usare snapshot versionati per JSON compatti; valutare artifact
  durevoli con hash e identificativo per documenti grandi, evitando duplicazioni.
- Evidenze minime: URL pubblico, momento del recupero, hash documento, metodo,
  pagina/estratto rilevante, decisione QA e problemi. Non ripubblicare PDF interi
  indiscriminatamente o contenuti personali.
- Manifest con elenco esatto dei file che l'import legge; report sigillato
  separatamente oppure nel contratto esplicito. Nessuna firma che dipenda dal
  proprio hash o dal proprio futuro commit.
- Checkpoint A: file, prove, stato e manifest committati e push verificato.
- Import dal checkpoint A, tramite metodo autorizzato osservato nel runtime.
- Checkpoint B: ricevuta e query di verifica salvate e pubblicate. Se la sessione
  termina tra import e B, prima riconciliare gli ID in lettura; poi riprendere in
  modo idempotente.

## Confine di questa revisione

Qui vengono definiti obiettivi, ordine, spazio e criteri di riuscita. Non vengono
eseguiti nuovi scrape/import, modifiche ai permessi o al database, ripubblicazioni
dell'ambiente, merge, deploy o scheduler. Le prove già registrate non equivalgono
a un collaudo del runtime cloud corrente.


## Stato 2026-10-22 — classificazione catalogo mappa (piano storico, completato)

- S0–S4 completati: branch e runtime verificati, input mappa 3.336 ID sigillato, run Mercury pronto senza errori, QA fonti e verifica indipendente importer concluse.
- QA fonti indipendente: 157/462 candidati originari esaminati in 11 gruppi; 8 esclusioni documentate, 5 falsi negativi portati a trekking, 27 misti/mismatch e 117 inconclusivi restano da verificare; 305 non esaminati singolarmente.
- Conteggi candidati definitivi: trekking 973, non trekking 478, da verificare 1.885. Conteggi effettivi dopo QA: trekking 969, non trekking 9, da verificare 2.358. Nessun errore Mercury.
- Test backend 174/174; cataloghi pubblici invariati. Importer PASS su manifest/output; database ancora senza tabella classificazioni e senza scritture.
- Prossimo: commit/push di file e report e verifica del ref remoto. Poi migration classification-only + inserimenti mancanti con conflitti preservati via Supabase MCP. Query/ricevuta prima e dopo, mai aggiornare `places`. Nessun deploy. Lombardia resta ferma finché l’import non è riconciliato.


## Ricevuta DB — 22 ottobre 2026, 18:20 UTC

Migration `create_place_classifications_20261021090000` registrata dal progetto Supabase come versione `20261022181444`. Inseriti 3.336 record solo in `public.place_classifications`, con `ON CONFLICT DO NOTHING`: 3.336 nuovi, 0 conflitti preesistenti. Riconciliazione esatta di tutti i 17 campi applicativi: 3.336 confrontati, 0 differenze. Conteggi effettivi: 969 trekking, 9 non trekking, 2.358 da verificare; 496 con review metadata. Query della mappa: 3.336/3.336 classificati, 9 non trekking esclusi, 2.358 dubbi conservati, 3.327 visibili nel default. Digest editoriale `places` prima/dopo identico (`5ed97ae6d6fa8274e66663ba66f28a45`), latest `places.updated_at` identico, nessuna write/delete su `places`. Repository/app non deployati: la UI live non è stata aggiornata. S7 riapre ora Lombardia dopo la ricevuta pubblicata.


## Avanzamento dopo import classificazioni — 22 ottobre 2026

- Completata la riconciliazione classification-only DB (3.336 righe, zero differenze; vedere HANDOFF/STATE), poi ripresa Lombardia.
- Run Brescia `cai-20261022-lombardia-brescia05`: 40 documenti, 143 estrazioni, entrambi i residui raggiunti, 0 delta catalogo. PDF fondo riletto: quattro date tutte passate; pagina categoria senza parser non è prova di calendario vuoto. Sezione partial per 3 URL non disponibili distinti, zero retry; importer QA PASS, backend 178/178, nessun accesso DB.
- Checkpoint run04 pubblicato in `1d73684492ffdf330f7ac8bb43b39d16ddcf096b`; run05 e verifica manuale del PDF sono pubblicati in `92ac86393416325560e753e43b8bd022741cb708`. Preflight 2026-10-22: non esiste un’esclusione puntuale per l’endpoint 503 di CAI Varese `cai-varese-9216009`; il cooldown di 6h è scaduto e il collector standard lo pianificherebbe. Nessuna richiesta è stata fatta. Lasciare Varese bloccata e scegliere un’altra fonte ufficiale Lombardia con coda sicura. Non ritentare i tre URL Brescia in cooldown.
- I contatori rigenerati su altre righe status non sono nuova copertura. Nessun import, merge, deploy o cron.

- Run Valmadrera `cai-20261022-lombardia-valmadrera01`: 12 documents, 8 extracted rows, 7 existing events unchanged, 0 catalog delta; discovery backlog 7 remains. Importer PASS; backend tests 178/178. Checkpoint report/files, then continue one bounded sample on Valmadrera; no DB import unless a verified new event changes the catalog.

- Run03 Valmadrera: 20 documenti, 19 estrazioni, 7 eventi preesistenti invariati, coda discovery 23; 5/7 candidati precedenti raggiunti, zero HTTP failures. Il run02 ha ripetuto i seed e non ha ridotto la coda. Dopo QA/test/checkpoint run03, un singolo run04 max40/240s/concurrency1 per la coda osservata; poi rivalutare il nuovo backlog, senza import DB a delta zero.

- Run04 Valmadrera: 40 documenti, 41 estrazioni, 7 eventi esistenti invariati, discovery 23→12, zero errori HTTP e zero delta catalogo. Dopo QA/test/checkpoint, un altro campione delimitato sulla stessa fonte; nessun import a delta zero.

- Run04 leaves 12 known official URLs, and the default 40-document run restarts from the same prefix. Implement and fixture-test a source-scoped, same-host explicit URL continuation option before run05; do not claim completion by repeating the default run.

- Safe continuation correction published in `20dbaf2e1b8a8b6f63c97efe2d3e96c06bc6910c` with URL allowlist, redirect guard, retry-state persistence, 40 focused / 186 full backend tests. Run05 may now target the 12 Valmadrera URLs from run04 via repeated `--source-url`, max20/180s/concurrency1; verify actual reached/remaining URLs and keep DB pending at zero delta.

## Stato 2026-10-22 — Valmadrera run05

- Run `cai-20261022-lombardia-valmadrera05`: 12 URL espliciti raggiunti, 8 ICS scoperti, 20 documenti/34 estrazioni; 7 eventi fonte già noti, 38 candidati ancora da verificare. Zero errori HTTP osservati; sezione ancora partial.
- Delta contro `c5036ff`: 3.345 ID unici, zero aggiunti/rimossi, cinque righe cambiate solo nei riferimenti sorgente ufficiali e due descrizioni abbreviate. Nessun nuovo evento/coordinate; DB non consultato né scritto e nessun reimport di classificazioni.
- Importer QA PASS; `npm test` backend 186/186; copie backend/frontend invariate. Report e manifest SHA registrati in HANDOFF. Checkpoint run05 da pushare/verificare prima di procedere.
- Discovery offline conferma 38 residui. Dopo checkpoint, un solo continuation run max8 documenti sui calendari correnti/futuri e sulle categorie escursioni/scialpinismo. Escludere dalla lista esplicita archivio passato, programma 2024, feed di eventi già passati, API root non attribuibile e pagina attività ancora incerta. Varese resta bloccata senza richiesta per il 503 in cooldown scaduto.

## Stato 2026-10-22 — Valmadrera run06

- Run `cai-20261022-lombardia-valmadrera06`, dopo checkpoint run05: gli 8 URL espliciti sono stati raggiunti, 8 estrazioni riconciliate a 7 record (1 duplicato estratto escluso); discovery-limit lascia 19 candidati sul calendario PDF ufficiale. Zero errori HTTP del run; fonte partial.
- Catalogo 3.345 ID: 0 aggiunte/rimozioni, 5 record esistenti con cambi di provenienza/descrizione; nessun campo geografico/editoriale amministrato alterato e nessuna coordinata nuova. Nessun DB import/query.
- Importer QA PASS, backend `npm test` 186/186, copie output pubblico/backend identiche. Report e manifest SHA in HANDOFF. Checkpoint run06 da pushare e verificare.
- Poi valutare un solo run esplicito, max1 doc/180s, per il PDF calendario 2026 se è ancora candidato distinto; non estendere oltre e preservare cache su errore.

## Problema parsing PDF Valmadrera — 22 ottobre 2026

Il PDF ufficiale `Calendario-attivita-2026_rev.04_16-03-2026.pdf` è in cache e leggibile: 12 pagine, `pdftotext -layout` mostra righe future (1 e 22 novembre), ma l’adapter restituisce `recognized=false`, zero eventi e zero issue. Questo non è un calendario vuoto: fallimento registrato in FAILURES come `official-calendar-grid-unrecognized`, fase parsing, status open. Il collector sta verificando una fixture dalle pagine cached e un parser a griglia con mapping cella/data verificato; niente coordinate inferite. Dopo test, rielaborare solo il PDF da cache in un run max1 e valutare la classificazione dei nuovi eventi prima di ogni import.

## Correzione parser griglia PDF Valmadrera — candidata verificata

- Fixture reale end-to-end con PDF cache (SHA `f3939cb69b...3b4103e9`) e output pdf.js; parser a griglia per header mese/giorni/colonne, merge del giorno separato solo se coordinate X completano sette celle; cache version 10→11.
- Rileva 14 attività con date corrette Oct–Dec 2026, inclusi attività trekking e non trekking; test rifiuta Oct24 e assenza di coordinate inventate. Focused 20/20, suite backend 187/187, importer QA PASS.
- Codice non ancora checkpointato e FAILURES rimane open fino alla verifica run orchestrato. Dopo push, un solo documento PDF da cache con `SCRAPE_MAX_DOCUMENTS=1`; poi QA file e classificazione Mercury per gli ID nuovi prima dell’eventuale DB import. No rete/DB prima del checkpoint.

## Prossima fase — Valmadrera run07

Run `cai-20261022-lombardia-valmadrera07` ha rielaborato il PDF CAI ufficiale con parser VERSION 11: 65 righe, 14 nuovi ID, source status ok. QA indipendente PASS e backend 187/187. Prima pubblicare il checkpoint file/report. Poi classificare in Mercury esclusivamente i 14 ID nuovi con run/output isolati, verificare modello richiesto/attestato, fixture/contratto e QA importer. Pubblicare manifest e checkpoint verificabili prima della scrittura DB; poi upsert soltanto delle classificazioni mancanti, `ON CONFLICT DO NOTHING`, senza chiamare import generale su `places`; fare query/ricevuta esatta. Se il modello opzionale fallisce, mantenere file classificati pending e proseguire solo attività deterministiche indipendenti.


## Attività corrente — Campobasso, 22 ottobre 2026

- Raccolta `cai-20261022-molise-campobasso01`: 1 indice HTML, 127 righe fonte, 2 nuovi ID, 0 rimossi, 1 riga esistente con soli campi source/link/description aggiornati; fonte `partial` (PDF 37 residui e HTML continuation 1 senza URL persistito).
- Classificazione `cai-map-20261022-campobasso01`: 1 `trekking`, 1 `da_verificare`, 0 errori; QA importer PASS e modello Mercury attestato.
- Preflight read-only confermato 0/2 target presenti e zero conflitti ID/slug; FK `ON DELETE RESTRICT`.
- Checkpoint file remoto `31d81ea`; poi insert-only 2 place + 2 classificazioni. Il primo controllo ha rilevato un fingerprint Lago Vivo trascritto male; CAS sul solo fingerprint, seguito da joined query 2/2 senza mismatch/missing, place update o delete.
- Receipt/report e stato sono checkpointati e verificati a `9bc54c5`. Prossimo: preflight offline delle 38 discovery residue Campobasso; se non sono URL stabili, chiudere la regione come parziale e passare oltre. Nessun cron, merge o deploy.

## Stato operativo 2026-10-22 — Penne01, poi L'Aquila bounded

Il checkpoint regionale più recente prima di questo campione era `805d90922c605a5893edb6a20629c1c00f18647c`. Run `cai-20261022-abruzzo-penne01` ha richiesto una singola URL CAI Penne; canonicalizzazione a pagina già letta, body identico, 0 estrazioni, 8 righe evento invariate. Report SHA `4fed13dd8d782ff0fddeff8547763e7c8ef125b003377930e094e9bae9f9c0ce`; evidence-manifest SHA `14810335e8adc5676c02a67fdad96d9cb4d5e651529ed9b0846d52f924916f38`; importer QA PASS. Il JSON excursions ha metadata rigenerati, documentati nel report, senza differenze nelle righe evento. Backend test 205/205 dopo la raccolta; nessun import/query DB a delta zero.

Penne resta parziale (PDF 60 candidati, HTML continuation 1). Checkpoint file e registro corrente da pubblicare prima del prossimo fetch. Collector ha eseguito preflight offline: prossimo target distinto è URL ufficiale CAI L'Aquila `https://cailaquila.it/le-attivita-del-cai/programma-2026/?commissioni=escursionismo`, una pagina, max1 documento/120 s/concurrency1. La pagina sorella commissioni=legale ha un 403 storico; fare un solo tentativo e fermarsi sul 403, senza retry o allargamento. Run nuovo, niente test simultanei alla raccolta; i test backend sono già passati dopo l'ultimo run e non è cambiato codice.

## Stato operativo 2026-10-22 — CAI L'Aquila 403

Dopo checkpoint Penne (1954838), run univoco `cai-20261022-abruzzo-laquila01` ha tentato una sola URL ufficiale `commissioni=escursionismo`, max1 documento/120s/concurrency1. Risposta orchestratore HTTP 403, stop immediato, nessun retry/espansione e nessun body/cache. Nessuna estrazione, nessun delta o DB; zero righe non è prova di calendario vuoto. Importer QA PASS. Il report distingue ora correttamente la `url` rimasta nel record status source-level (`commissioni=legale`) dall'URL effettivamente provata, documentata da scrapeArgs/output nel sidecar run. Report SHA `b3b15f1af73988430f5d3153e361725f4c9c2d5aac38211dca468edccd2cb834`, evidence-manifest SHA `7830f4a30c7f92dc1337c771e8b4e823c8f74318e560d33d21153d8fd7dc53cc`; manifest SHA `6b11181be1a701a8e9d03171c8b26c4cde4df9ef34b07fda2adfd115b4617687`. Scrape-status changed, event rows/sections unchanged, mirrors identical. Nessun test durante il run; suite 205/205 era successiva a Penne, codice invariato. Il risultato L'Aquila e il registro 403 sono pubblicati/verificati a `d9fbdca0ab0cafdc4e8ca1c91c534df4a026b7cf`. Prima di un altro fetch, preflight offline un target ufficiale distinto; niente replay del 403.

## Passaggio regionale 2026-10-22 — Abruzzo non ha target offline sicuri

Il preflight collector ha escluso replay o URL con failure/cooldown: per Penne la continuazione canonizza sul contenuto già letto, L'Aquila ha il 403 appena osservato, e i residui delle altre sezioni sono già consumati/non persistiti o soggetti a size/cooldown. Basilicata ugualmente non ha URL attuale distinta. Abruzzo e Basilicata rimangono con copertura aperta/parziale, senza dichiarazione di completezza. Primo target work-ready: CAI Castrovillari (`cai-castrovillari-9244005`), `https://www.caicastrovillari.it/prog.php`, URL ufficiale calendar registry non presente in history/cache/FAILURES; il PDF 2026 è già partial con OCR failure/discovery 8. Dopo checkpoint regionale eseguire una sola pagina max1/120s/concurrency1, senza allargare la coda.

## Stato corrente — Calabria, Castrovillari01

Run unico HTML `cai-20261022-calabria-castrovillari01`: pagina indice 9.830 byte acquisita, `method=null`, 0 eventi, 1 residuo discovery HTML; PDF annuale non ritentato (OCR failure pagina 2/discovery8 conservati). Catalog rows correttamente selezionati via prefisso ID: 12→12, zero cambi; il source-evidence è stato corretto dopo un filtro errato su `sourceId` assente, e report/evidence-manifest ora allineati. Hash e QA importer PASS indicati in HANDOFF. Backend test 205/205 dopo la raccolta; sei JSON pubblici stabili. Nessuna classificazione/DB.

Dopo il checkpoint remoto `6e10ae12b6d521c6035de81b9c5cbf1c1dd2f18e`, preflight offline dei link ufficiali PDF apparsi nella pagina, verificando history/cache/failure prima di selezionare al massimo un URL distinto. Non ripetere il PDF annuale né dichiarare copertura completa.

## Ripresa operativa — 22 ottobre 2026

Castrovillari01 è completato e remoto; il preflight dei quattro link non ha trovato una fonte sicura non letta: Cerchiara è già visitata, Corigliano/Rossano e Morano non sono fonti registrate, `proposta25.pdf` non è un calendario. Non ripetere quei link né il PDF annuale Castrovillari. La prossima attività è il solo preflight offline Campania di cai-collector, con Caserta come candidato da verificare (PDF già letto, discovery-limit aperto). Per un eventuale nuovo run servono target figlio distinto, prove d'attribuzione, assenza di cooldown e checkpoint prima del fetch. Lombardia/Calabria e le altre regioni restano parziali finché le fonti aperte non sono risolte.

### Campania — target dopo preflight offline (22 ottobre 2026)

Unica fonte selezionata per il prossimo campione: `cai-caserta-9238006`, `https://www.caicaserta.it/escursioni.html`. È una pagina indice ufficiale distinta, registrata e senza history/cache/failure specifica. Il PDF annuale resta bloccato da `CAI-F-d8cbb0f4bd01c6f5` (`discovery-budget-exhausted`), quindi il run deve specificare soltanto l'indice e limitare a un documento/120s/concurrency1. Fare prima push e verifica remota di questo checkpoint; dopo raccolta, fermare ogni ulteriore fetch, poi QA importer e test backend seriali.

### Esito CAI Caserta index01

Il solo campione sull'indice `/escursioni.html` è concluso: una pagina/7.179 byte, `method=null`, 0 candidati. La fonte resta parziale e i 50 record Caserta, su 3.366 totali, sono invariati; nessun import. QA importer PASS; test backend 205/205 eseguiti dopo la raccolta, i JSON post-test corrispondono al manifest e i mirror coincidono. Prima di un'altra richiesta, pubblicare questo run e poi preflight offline i link figli esatti contro storico, cache e FAILURES; il PDF annuale resta bloccato. Il risultato non è prova di calendario vuoto.

Il checkpoint remoto `52deb84835e47a355d66da4662dc7e9a877f2ab4` è verificato (run artifacts, cataloghi, status, docs e blob hashes). La fase corrente è soltanto preflight offline dei link figli della pagina Caserta già salvata; non si avvia rete prima di una selezione esatta e di un nuovo checkpoint remoto.

### Preflight link figli Caserta

Un solo figlio work-ready: PDF scheda Monte Scalambra `https://www.caicaserta.it/escursioni/Monte%20Scalambra.pdf`, linkato dall'indice ufficiale accanto all'evento del 25 ottobre da Serrone. La pagina inquadra il programma 2026 ma l'anno non è adiacente alla data; il documento deve attestare l'anno/titolo/attribuzione. È assente da history/cache/FAILURES. Dopo il checkpoint remoto del preflight, un solo run explicit URL `cai-20261022-campania-caserta-scalambra01`, max1/120s/concurrency1, senza seguire discovery. Gli altri link sono passati, archivio, flyer senza data o regolamento.

### Esito Scalambra01

Un solo PDF detail letto e QA-validato: il corpo attesta il 25 ottobre 2026 e corrobora un evento già presente; metadata PDF discordanti sono esplicitamente segnalati. Zero candidati parser, nessuna riga nuova/modificata, coordinate curate non toccate/non riattestate. Importer PASS; backend test 205/205 con sei hash JSON stabili. Caserta resta parziale per annual discovery, indice continuation e OCR Francigena. Pubblicare il run completo prima di qualunque altra richiesta; poi preflight offline le restanti fonti Campania abilitate.

Scalambra01 è checkpointato e verificato al commit remoto `ae663ecfe2e1b7bb821832cf8f1b0e6bac6a94d3`; i file testati e i mirror pubblici sono recuperabili. Prossimo solo preflight offline delle restanti fonti Campania, poi singolo target bounded con checkpoint prima del fetch.

### Emilia-Romagna — CAI Cesena

Campania resta parziale; preflight offline non ha trovato URL distinta sicura oltre alle code già viste/issue note. Target Cesena `cai-cesena-9224012`, indice ufficiale registrato `https://www.caicesena.com/index.php/programma-attivita`, assente da documents/cache/FAILURES. Dopo push/verifica del checkpoint di selezione, un solo run explicit URL max1/120s/concurrency1. Non ritentare annual PDF discovery7 né il distinto PDF giovani con OCR failure; l'indice non consente di dichiarare calendario completo.

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


## Stato operativo aggiornato — Pescia chiuso senza delta; Fivizzano miniera selezionata (23 ottobre 2026)

Run `cai-20261023-toscana-pescia-index01`: timeout di 8.000 ms sulla URL `/cp/`, senza risposta HTTP/body/cache, retry, estrazioni o delta DB. Registro e cache storici sono preservati: 12 documenti e discovery-limit agosto, più un distinto `fetch-timeout`; QA importer PASS. Catalogo resta a 3.376 ID. Test backend 206/206 eseguiti in sequenza dopo raccolta e riparazione; i sei JSON pubblici sono rimasti stabili.

Il preflight offline toscano non ha trovato altri link sicuri oltre alla nuova pagina ufficiale Fivizzano `/eventi/le-miniere-di-calcaferro/`. Selezionata unicamente per 1 documento/120 s/concurrency 1/no discovery. Dopo commit e verifica dei file, eseguire quel run; poi fermare la raccolta, fare QA importer e test soltanto se necessari, checkpoint file, e procedere a classificazione/import solo se esiste delta verificato. Pescia resta esclusa senza una strategia di timeout distinta. Totali di raccolta, file e DB restano separati; niente run storico o reimport.


## Stato operativo successivo — Fivizzano miniera01 a delta zero (23 ottobre 2026)

La pagina `/eventi/le-miniere-di-calcaferro/` ha prodotto un solo record passato (06-09-2026, marcato “Expired!”); nessun nuovo evento catalogo o candidato DB. Catalogo e 12 righe Fivizzano sono invariati. Source partial con PDF OCR failure e discovery-limit PDF 8/calendario 1/pagina 1. Run artifacts/evidence sono localmente sigillati; importer QA read-only è in corso. Test backend 206/206 dopo raccolta, sei JSON pubblici invariati dai test.

Prossimo target offline distinto: la pagina CAI Fivizzano `/escursionismo/`, ufficiale, nel registro e non ancora visitata/cache/failure. Dopo checkpoint remoto del run e della selezione, fare un solo fetch max1/120s/concurrency1/no discovery. Non tornare su Pescia senza strategia diversa; se non produce delta, riportare la regione parziale e proseguire alla prossima fonte sicura.


## Aggiornamento successivo — pagina Escursionismo corroborata, nessun delta (23 ottobre 2026)

La pagina Fivizzano `/escursionismo/` ha restituito una riga futura del 15 novembre 2026, identica all’ID catalogo `cai-fivizzano-9226019-2d592e7a1731`. Nessuna nuova riga, duplicato escluso, coordinata o modifica catalogo; nessun candidato Mercury/DB. QA importer PASS; suite backend 206/206 dopo il run, hash pubblici stabili e mirror identici. La fonte rimane parziale con OCR/discovery PDF e discovery-limit delle pagine visitate.

Il preflight offline ha selezionato la landing ufficiale `/attivita/`, ancora non visitata o in cache/failure. Dopo checkpoint remoto del run corrente e della selezione, fare un singolo fetch max1/120s/concurrency1/no discovery; verificare il contenuto effettivo. Pescia rimane esclusa per timeout senza strategia diversa.


## Passaggio a Veneto — Alpago selezionato (23 ottobre 2026)

Le tre pagine Fivizzano lette dopo il calendar01 hanno prodotto: una riga scaduta esclusa, una corrispondenza esatta a evento già catalogato e una landing informativa senza righe datate. Nessun delta catalogo o DB, nessuna coordinata. QA importer PASS; test backend 206/206 dopo le due raccolte più recenti, hash pubblici stabili e mirror identici. Fivizzano resta partial per OCR/discovery. Preflight offline: nessuna altra URL toscana sicura distinta; non ritentare Pescia senza strategia diversa né la URL già valutata come duplicato semantico.

Prossimo singolo target CAI Alpago (Veneto), `https://www.caialpago.it/programma-2/`, ufficiale e non consumato; status partial per un diverso backlog. Dopo checkpoint remoto eseguire `cai-20261023-veneto-alpago-programma01`, max1/120s/concurrency1/no discovery, poi test/QA seriali e solo import se delta verificato.
