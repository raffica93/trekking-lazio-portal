# Piano di passaggio al lavoro interamente cloud

Stato al 21 ottobre 2026: revisione e spazio operativo predisposti; implementazione
e qualifica dei punti seguenti ancora da eseguire. Il codice del portale, i dati
e le procedure esistenti sono il punto di partenza.

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
