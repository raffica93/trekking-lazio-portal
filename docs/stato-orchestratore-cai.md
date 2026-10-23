# Stato orchestratore CAI

Aggiornamento: 20 ottobre 2026 (Europe/Rome).

## Completato

- Recuperato il lavoro nazionale esistente e il contesto della verifica accessi.
- Verificato Supabase `snwzxegtqnnuvlawnpgl`: 2.680 righe in `places`, 837 in
  `cai_sections`. Nessun dato è stato modificato durante la preparazione.
- Configurati i ruoli `cai-collector` e `cai-importer` su `gpt-6-luna`, con massimo
  due sottoagenti. Due sottoagenti Luna di questa chat hanno preparato e verificato
  il codice; non sono sessioni Codex Cloud.
- Aggiunto fallback PDF OCR italiano/inglese con Poppler/Tesseract, timeout,
  pulizia temporanei e riprova degli errori; conservati parser e cache precedenti.
- Aggiunto comando manuale `orchestrate` con stato persistente, attività per fonte,
  cronologia, lock e fasi raccolta → file verificati → importazione.
- Aggiunta verifica SHA-256 di tutti e tre i file prima del DB; l'import usa gli
  snapshot verificati in memoria. Righe esistenti deduplicate e contenuti
  amministrati preservati.
- Preparati setup Linux e prompt per l'orchestratore remoto.
- Accesso ChatGPT completato e ambiente cloud privato `trekking-lazio-portal`
  creato e pubblicato. Chat di configurazione: `01a15548-ef47-77d2-9d06-100fe20a9056`.
- Configurazione cloud: Node.js 24, dipendenze dai lockfile, setup Poppler e
  Tesseract italiano, istruzioni dei due ruoli Luna e destinazioni delle fonti
  censite consentite. Non sono stati aggiunti segreti DB.
- Verifica iniziale remota sul codice `main`: 169 test e build development
  superati; frontend e API rispondono. La build production ha incontrato un 403
  sui Google Fonts prima dell'applicazione della configurazione di rete.
- Verifica finale: 141 test backend superati; sintassi TOML e Bash valida;
  workflow YAML valido con solo trigger manuale.
- Preparato il lotto `cai-20261019-01`, ancora con raccolta/file/DB in `pending`.
  Branch di preparazione: `codex/cai-orchestrator-luna`.
- Controllato workflow GitHub: `Refresh excursion data` usa solo avvio manuale;
  nessuna esecuzione dello scrape in corso al controllo.
- Integrato lo stesso passaggio verificato anche nel workflow manuale: import
  bloccato su errori di raccolta/file, stato e manifest conservati negli artifact.
- Controllato Supabase: estensione `pg_cron` assente, tabella `cron.job` assente.
- Nessuna automazione Codex locale corrispondente al progetto trovata nel controllo.

## Esito del lotto `cai-20261019-cloud-01`

- Branch operativo: `codex/cai-orchestrator-luna`, partenza da `9c215cd`.
- Verificati i file e il manifest SHA-256; 3.033 eventi nel lotto.
- Copertura su 838 fonti: 118 `ok`, 39 `no-upcoming`, 141 `partial`, 141
  `unsupported`, 19 `failed`, 380 disabilitate. Restano 301 fonti abilitate da
  completare o riprendere; l'import non dichiara completa la copertura nazionale.
- Import completato nel progetto `snwzxegtqnnuvlawnpgl` tramite Supabase MCP:
  3.033/3.033 source ID presenti e pubblicati, 1.510 nuovi record e 1.523 ID già
  presenti preservati. Totali verificati: 4.190 `places` e 837 `cai_sections`.
- Il comando locale `orchestrate import` non ha trovato `SUPABASE_URL`; l'accesso
  SQL MCP già disponibile ha completato l'import e la query di verifica senza
  creare chiavi o ampliare permessi.
- Il runtime aveva Tesseract `eng` ma non `ita`; il setup non ha potuto installare
  il pacchetto di sistema perché non-root e senza `sudo`. Per la raccolta sono
  stati verificati entrambi i dati lingua con Tesseract e un tessdata temporaneo.
- Rapporto, stato per fonte e manifest: `backend/data/agent-runs/cai-20261019-cloud-01/`.

Non sono stati creati cron o aggiornamenti ricorrenti; non sono stati eseguiti
merge o deploy.

## Aggiornamento regionale: Lombardia, 20 ottobre 2026

- Lotto `cai-20261020-lombardia-01`: `collection=partial`, `files=ready`,
  `database=completed`; manifest SHA-256 verificato su tutti e tre i file.
- I file complessivi contengono 3.036 eventi. Import verificato nel progetto
  `snwzxegtqnnuvlawnpgl`: tre source ID nuovi pubblicati, 3.033 esistenti
  preservati; 4.193 `places` e 837 `cai_sections`.
- Il primo run regionale aveva 39 fonti complete e 86 da riprendere. Sono seguiti
  quattro passaggi mirati, senza retry ricorrenti, con parser deterministico,
  OCR italiano/inglese, verifica manuale dei nuovi record e manifest SHA-256:

  | Run | Eventi nel file | Nuovi effettivi | Esito DB verificato |
  |---|---:|---:|---|
  | `cai-20261020-lombardia-deep-01` | 3.084 | 48 | 3.084/3.084 pubblicati; 4.241 `places` |
  | `cai-20261020-lombardia-deep-02` | 3.163 | 79 | 3.163/3.163 pubblicati; 4.320 `places` |
  | `cai-20261020-lombardia-deep-03` | 3.170 | 7 netti | 3.170/3.170 pubblicati; 4.327 `places` |
  | `cai-20261020-lombardia-deep-04` | 3.179 | 11 inseriti, 1 duplicato rimosso; +9 netti | 3.179/3.179 pubblicati; 4.338 `places` |
  | `cai-20261020-lombardia-deep-05` | 3.179 | 0 | 3.179/3.179 pubblicati; verifica read-only, 4.338 `places` |
  | `cai-20261020-lombardia-deep-06` | 3.182 | 3 | 3.182/3.182 pubblicati; 4.341 `places` |
  | `cai-20261020-lombardia-deep-07` | 3.182 | 0 | 3.182/3.182 pubblicati; verifica read-only, 4.341 `places` |
  | `cai-20261020-lombardia-deep-08` | 3.204 | 22 | 3.204/3.204 pubblicati; 4.363 `places` |
  | `cai-20261020-lombardia-deep-09` | 3.205 | 1 | 3.205/3.205 pubblicati; 4.364 `places` |
  | `cai-20261020-lombardia-deep-10` | 3.205 | 0 | 3.205/3.205 pubblicati; verifica read-only, 4.364 `places` |
  | `cai-20261020-lombardia-deep-11` | 3.205 | 0 | 3.205/3.205 pubblicati; verifica read-only, 4.364 `places` |
  | `cai-20261020-lombardia-deep-12` | 3.205 | 0 | 3.205/3.205 pubblicati; verifica read-only, 4.364 `places` |
  | `cai-20261020-lombardia-deep-13` | 3.206 | 1 | 3.206/3.206 pubblicati; 4.365 `places` |
  | `cai-20261020-lombardia-deep-14` | 3.206 | 0 | 3.206/3.206 pubblicati; verifica read-only, 4.365 `places` |
  | `cai-20261020-lombardia-deep-15` | 3.206 | 0 | 3.206/3.206 pubblicati; verifica read-only, 4.365 `places` |

- Nel deep-03 è stata rimossa dal file e dal DB la riga Codogno con data ambigua
  (“15 o 21”). Nel deep-04 il QA ha scartato altre quattro righe con date
  ambigue/errate o duplicate e ha rimosso una variante duplicata del titolo
  Cernusco, preservando il record già esistente. Le righe preesistenti non sono
  state sovrascritte. I conteggi finali Supabase sono 4.338 `places` e 837
  `cai_sections`; la query conferma 3.179 source ID del manifest tutti
  `published`, 0 draft e 0 mancanti. Due righe precedenti non presenti nell’ultimo
  file sono rimaste intatte nel DB.
- Copertura Lombardia dopo i passaggi: 125 fonti abilitate, 38 `ok`, 18
  `no-upcoming`, 39 `partial`, 30 `unsupported`; 69 restano irrisolte. I motivi
  documentati comprendono domini che rispondono 403/404/5xx, limiti di scoperta,
  PDF informativi invece che calendari (CAI Colico e CAI Missaglia), calendari
  condivisi senza attribuzione certa e fonti senza calendario ufficiale parsabile.
  Nel deep-05 un ulteriore passaggio bounded sulle 24 code di discovery non ha
  aggiunto record validi; sono rimasti espliciti i residui, tra cui proxy 403,
  timeout, il precedente limite di 32 MiB sui PDF, OCR fallito sulla pagina non
  pertinente di Missaglia, calendario condiviso di
  Varano Borghi e 258 candidati Gavirate oltre il budget. Non si dichiara
  completata la copertura regionale. Nel deep-06 la procedura PDF ha permesso di
  estrarre e verificare il SIEL di Gazzada (167,3 MB, compresso solo su copia
  temporanea a 3,9 MB; testo estratto dall'originale) e di recuperare tre eventi
  verificati: due Gazzada e una Castagnata di Sesto Calende. La query DB conferma
  3.182/3.182 ID del lotto `published`, 0 draft e 0 mancanti; conteggi finali
  4.365 `places` e 837 `cai_sections`. Il run resta `collection=partial`:
  Colico/Missaglia non erano calendari; Sesto ha 9 eventi recuperati dal libretto
  e resta aperta per PDF autonomi collegati; Somma ha restituito `aborted` nei
  tentativi diretti, ma 13 uscite verificabili sono state recuperate dalle
  pagine 15–16 del PDF SIEL intersezionale ufficiale, sotto l'intestazione
  “Sezione di SOMMA LOMBARDO”. Il deep-07 ha scartato 25 candidati OCR di Sesto
  come duplicati, scaduti o malformati; deep-08 ne ha scartati altri nove e ha
  verificato i record dal rendering originale. Le query confermano 3.204 ID
  `published`, 0 draft/mancanti. Nel deep-09 è stato importato l'evento Dongo
  del 29 ottobre; il candidato Veduggio col titolo tronco è stato escluso e la
  riga completa preesistente è rimasta intatta. La query deep-09 conferma 3.205
  ID `published`, 0 draft/mancanti; il DB conta 4.364 `places` e 837 sezioni.
  Deep-10, deep-11 e deep-12 non hanno aggiunto eventi e hanno riconfermato
  tutti i 3.205 ID pubblicati. Deep-13 ha importato come `published` l'uscita
  Alpe Devero (VB) del 25 ottobre, verificata sulla locandina CAI Cernusco:
  3.206/3.206 ID pubblicati, 0 draft/mancanti; il DB ora conta 4.365 `places`.
  Deep-14 e deep-15 hanno provato altre undici fonti senza record verificabili: deep-14 otto siti ufficiali non parsabili, deep-15 tre residue senza calendario attribuibile; la verifica deep-15 conferma 3.206/3.206 pubblicati, 0 draft/mancanti, 0 inserimenti e totali DB 4.365 `places`/837 sezioni. Restano 69 fonti Lombardia irrisolte: 39
  `partial`, 30 `unsupported`.
- Rapporti, stati e manifest per fonte sono conservati sotto
  `backend/data/agent-runs/cai-20261020-lombardia-deep-01/` fino a
  `deep-15/`; il riepilogo più aggiornato è in
  `backend/data/agent-runs/cai-20261020-lombardia-deep-15/collection-report.md`.
  La procedura riutilizzabile per PDF grandi, layout a colonne e OCR selettivo è
  documentata in `docs/procedura-pdf-cai.md`.

## Piemonte, 20 ottobre 2026

- Run `cai-20261020-piemonte-01`: `collection=partial`, `files=ready`,
  `database=completed`. Il corpus finale ha 3.337 ID unici: 3.297 righe già
  pubblicate (2.464 mantenute dal file locale e 833 ripristinate dallo snapshot
  DB) e 40 nuovi eventi verificati e importati.
- Il vecchio file esatto da 3.206 righe non era recuperabile dal checkout o dai
  log DB. La ricostruzione ha usato solo righe `published` ancora attive presenti
  in Supabase. Tra le 833 righe ripristinate, 90 erano attive in DB ma fuori dal
  precedente snapshot locale; sono state conservate come supplemento già
  pubblicato. Non è quindi una ricostruzione byte-per-byte della vecchia
  baseline, ma una base superset verificata, senza sovrascrivere le righe DB.
- Dei 103 candidati locali assenti da Supabase, 41 erano supportati da fonti
  ufficiali; uno era già presente nel corpus, 40 erano nuovi e 62 sono stati
  esclusi per dati ambigui, duplicati, storici, annullati o malformati. Per ogni
  candidato QA conserva fonte, decisione ed eventuali correzioni. Sono stati
  validati gli hash dei sei file e l'identità byte-per-byte dei tre mirror
  backend/frontend.
- Supabase ha inserito i 40 nuovi `source_id` con stato `published` e
  `ON CONFLICT(source_id) DO NOTHING`. Query finale: 3.337/3.337 ID del corpus
  presenti e pubblicati, 0 draft, 0 mancanti e 0 discrepanze sui 40 nuovi record.
  Conteggi progetto: 4.405 `places`, 837 `cai_sections`.
- Il run resta `collection=partial`: la verifica dei candidati non completa la
  copertura di tutte le sezioni piemontesi. Stato per fonte, QA, recovery,
  manifest e rapporto: `backend/data/agent-runs/cai-20261020-piemonte-01/`.
  SHA-256 manifest: `3824c028aea07417f599e6317cc845bf891f355b677289ed10821ec291aed7c6`;
  SHA-256 rapporto finale: `3796f22cd6ef444f969f36016c3787d6ec8d114f8f95a1f213fb6348cef3eeb5`.
