# Rapporto lotto Lombardia `cai-20261020-lombardia-01`

Aggiornato: 20 ottobre 2026 (Europe/Rome)
Branch di lavoro: `codex/cai-orchestrator-luna`, base `9c215cd` (PR #27)
Stato finale: `collection=partial`, `files=ready`, `database=completed`.

## File e manifest

Il file eventi complessivo contiene 3.036 eventi. Il manifest copre e verifica questi tre file:

| File | SHA-256 |
| --- | --- |
| `backend/data/excursions.json` | `a73ad056fcfeeeb181985163770c59bba0c337b359f0f0f325843fb9a948cc18` |
| `backend/data/cai-sections.json` | `853a327b90fdb8fc3bec729711e084a4fcda6c0a9d8bd7fda458d1503c512e43` |
| `backend/data/scrape-status.json` | `fcdd69fc97cde33a454990cc11bcbbae0aa1af5dbdfc163c000d23eb837c62f4` |

URL ufficiali, calendari selezionati, metodi, evidenze e problemi restano nel registro `scrape-status.json`. Il collector ha conservato le cache valide e non ha inventato date, titoli o coordinate.

## Fonti Lombardia

Il registro contiene 229 fonti lombarde: 104 disabilitate e 125 processate. Di queste, 28 sono `ok`, 11 `no-upcoming`, 36 `partial`, 49 `unsupported` e 1 `failed`. Sono quindi completate 39 fonti; 86 fonti abilitate restano da fare o riprendere.

L’unico errore `failed` è CAI Vigevano: il PDF ufficiale `https://www.caivigevano.it/wp-content/uploads/2025/12/Libretto_26-1.pdf` supera il limite di download di 18 MiB. Gli stati `partial` e `unsupported` sono mantenuti come copertura incompleta.

## Import Supabase

Import verificato sul progetto autorizzato `snwzxegtqnnuvlawnpgl`. Prima dell’import, 3.033 dei 3.036 ID erano già presenti; i tre mancanti sono stati inseriti come `published`. La verifica SQL finale ha confermato 3.036/3.036 source ID presenti e pubblicati, 0 bozze, 4.193 `places` totali e 837 `cai_sections`. Tutte le 837 sezioni sono state sincronizzate preservando i campi amministrati.

Il comando locale `orchestrate import` non disponeva di `SUPABASE_URL` e si è fermato prima di accedere al DB. L’import e la verifica sono stati completati tramite l’accesso SQL MCP già autorizzato, senza creare chiavi o ampliare permessi. Gli ID già presenti sono stati lasciati intatti con deduplica `source_id`.

## Stato operativo

La raccolta è parziale anche se l’import è completato: la pubblicazione degli eventi validi non chiude le 86 fonti lombarde ancora aperte né le 104 disabilitate. Nessun cron, scheduler, merge o deploy è stato creato o eseguito.
