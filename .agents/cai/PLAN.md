# Piano di passaggio al lavoro interamente cloud

Stato aggiornato al 22 ottobre 2026: classificazione completa del catalogo importata e riconciliata. Il lavoro attivo è la ripresa regionale Lombardia a campioni limitati; le sezioni più sotto che indicano il batch come prossimo passo sono piano storico, superato dalla ricevuta DB e dagli aggiornamenti finali.

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
