# Rapporto lotto CAI `cai-20261019-cloud-01`

Aggiornato: 19 ottobre 2026 (Europe/Rome)
Branch di lavoro: `codex/cai-orchestrator-luna`, base verificata `9c215cd` (PR #27)
Stato finale: `collection=partial`, `files=ready`, `database=completed`.

## File e manifest

Il lotto contiene 3.033 eventi. I tre file raccolti sono coperti dal manifest SHA-256 e sono stati verificati di nuovo prima dell’import:

| File | SHA-256 |
| --- | --- |
| `backend/data/excursions.json` | `1563ebbb8055bc98b1c3f603a52919e098d4223f37c1297d0f1a335fba5e2942` |
| `backend/data/cai-sections.json` | `853a327b90fdb8fc3bec729711e084a4fcda6c0a9d8bd7fda458d1503c512e43` |
| `backend/data/scrape-status.json` | `7f9aed86dc41ff85972c812164b4af9d9f211f89ec1192818bc4fbc45ddead57` |

Il registro per fonte conserva URL ufficiali e URL calendario selezionati, metodi/evidenze, esiti e problemi. Le cache valide sono state mantenute; non sono state inventate date, titoli o coordinate.

## Copertura delle fonti

Sono registrate 838 fonti: 118 `ok`, 39 `no-upcoming`, 141 `partial`, 141 `unsupported`, 19 `failed` e 380 disabilitate. Le fonti `ok` e `no-upcoming` (157) risultano completate. Restano 301 fonti abilitate da fare o riprendere: 141 parziali, 141 non supportate e 19 fallite. Le 380 disabilitate non sono state interrogate.

Il primo passaggio ha incontrato il proxy non configurato per Node. Il retry, limitato alle fonti ancora `todo`, ha abilitato il proxy d’ambiente all’avvio di Node e la relativa modalità Axios. Restano problemi specifici registrati per fonte, tra cui risposte HTTP 403/404, tunnel proxy negati e PDF oltre il limite di 18 MiB. Non sono stati rilanciati passaggi ripetuti sulle fonti completate.

## Import Supabase

Progetto autorizzato `snwzxegtqnnuvlawnpgl`. L’importatore locale si è fermato prima di qualsiasi accesso al database perché nel runtime mancava `SUPABASE_URL`. L’import è stato completato tramite l’accesso SQL MCP già disponibile, applicando la trasformazione dell’importatore e `ON CONFLICT(source_id) DO NOTHING`.

| Verifica | Risultato |
| --- | ---: |
| ID evento del lotto presenti nel DB | 3.033 / 3.033 |
| ID evento del lotto con stato `published` | 3.033 |
| ID evento del lotto in bozza | 0 |
| Nuove righe inserite | 1.510 |
| ID già presenti preservati | 1.523 |
| `places` totali dopo import | 4.190 (baseline 2.680) |
| `places` pubblicati / bozze, totale progetto | 4.131 / 59 |
| `cai_sections` dopo sincronizzazione | 837 / 837 |

Le righe esistenti non sono state aggiornate: titolo, stato e foto restano intatti. La sincronizzazione delle 837 sezioni ha mantenuto i campi di scoperta protetti e le note amministrative. La query finale ha verificato i conteggi nel progetto autorizzato.

## Runtime e controlli

- Node.js `v24.19.0`; Poppler `pdftoppm 26.05.0`.
- Tesseract di sistema aveva `eng` ma non `ita`; `.codex/setup-cloud.sh` non ha potuto installare il pacchetto di sistema perché il runtime non-root non dispone di `sudo`. Per questa raccolta, `eng` e il file ufficiale `ita.traineddata` (Tesseract `tessdata_fast` 4.1.0) sono stati caricati da `/tmp/cai-tessdata` e verificati con `TESSDATA_PREFIX`: entrambi risultavano in `--list-langs`. Il puntatore è in `backend/.env`, file locale ignorato da Git, senza credenziali.
- Un primo avvio del retry è terminato prima di richieste HTTP per una forma CLI non valida; corretta la sintassi, il retry limitato è terminato e i file sono stati riverificati.
- `orchestrate import` locale è rimasto non disponibile senza `SUPABASE_URL`; il percorso MCP autorizzato ha completato e verificato l’import. Nessuna nuova chiave o permesso è stato creato.
- Non sono stati aggiunti cron, scheduler, merge o deploy. Non sono stati avviati frontend/backend e non sono stati eseguiti test che riscrivono cache.
