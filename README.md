# Trekking Lazio Portal

Portale Angular ed Express per consultare sulla mappa le escursioni pubblicate dalle sezioni CAI del Lazio.

## Avvio locale

Con Docker:

```bash
docker compose up --build
```

Il portale è disponibile su `http://localhost:8080`.

La versione pubblica è distribuita tramite GitHub Pages. Con Supabase configurato il frontend
legge i luoghi `published` da `places`. La cache statica `frontend/public/excursions.json`
resta aggiornata dallo scrape come fallback.

Per lo sviluppo senza Docker, avviare `npm start` prima in `backend` e poi in `frontend`.

## Aggiornamento dati

```bash
cd backend
npm ci
npm run scrape:roma
npm run scrape:all
```

Ogni sede CAI ha uno script (`npm run scrape:sora`, `scrape:tivoli`, …). `scrape:all` le lancia una alla volta così un timeout Gemini non azzera le altre. Lo stato per sezione sta in `backend/data/scrape-status.json` e in admin `/#/admin/sedi`.

Lo script aggiorna `backend/data/excursions.json` in modo atomico, lascia il file invariato quando i dati non cambiano e ritenta automaticamente gli errori di rete o le risposte HTML non valide. `SCRAPE_RETRIES` e `SCRAPE_TIMEOUT_MS` valgono per CAI Roma; `GEMINI_TIMEOUT_MS` (default 5 minuti) e `GEMINI_PAUSE_MS` (default 10s in `scrape:all`, 15s in Actions) per le altre. Un 429 di quota non viene ritentato: le sedi Gemini successive restano sulla cache. Un 429 di rate-limit o un 503 aspetta e riprova.

CAI Roma viene letto con il parser HTML. Le altre sezioni abilitate usano Gemini 3.5 Flash sul loro template (pagina programma, calendario o PDF). Serve `GEMINI_KEY` in `backend/.env` in locale, e lo stesso nome come secret nelle GitHub Actions. Senza chiave lo scrape di Roma continua e le altre sezioni restano sulla cache.

```bash
npm run scrape:tivoli -- --dry-run
npm run scrape -- --source alatri
```

Le sezioni si accendono in `backend/sources.js` (`enabled: true`). Un fallimento di una fonte non cancella le altre; se una sede muore senza cache lo script esce con codice 1. L’arricchimento già classificato (summary, coordinate) viene conservato se id, titolo, data e località non cambiano. Dettaglio sedi: `docs/cai-scrape-riepilogo.md`.

## Supabase e pannello amministratore

Il pannello è disponibile su `/#/admin` (necessario per funzionare anche su GitHub Pages). La migrazione in `supabase/migrations/` crea la tabella `places`, il bucket immagini, i profili admin e tutte le policy RLS. Applica la migrazione al progetto Supabase, quindi crea un utente nella sezione Authentication e rendilo amministratore con la query commentata in fondo alla migrazione.

Nei progetti Supabase recenti, verifica inoltre nelle impostazioni **Data API** che la tabella `public.places` sia esposta: le tabelle nuove possono non esserlo automaticamente. La migrazione concede già soltanto le operazioni necessarie a `anon` e `authenticated` e attiva RLS.

Nel file `frontend/public/supabase-config.js` inserisci l'URL del progetto e la sua **publishable key**. La chiave è sicura da distribuire nel browser: i permessi sono controllati dalle policy RLS. Non inserire mai la service role key nel frontend.

Per trasferire le escursioni esistenti, copia `backend/.env.example` in `backend/.env`, imposta le variabili nel tuo terminale e poi esegui:

```bash
cd backend
npm run import:supabase
```

L'import locale inserisce solo i `source_id` ancora assenti in `places` e, per sicurezza, li marca come bozze salvo `SUPABASE_IMPORT_STATUS=published`. Le righe già presenti non vengono aggiornate, così correzioni, stato e foto del pannello restano intatti.

Lo scrape locale (`npm run scrape`) continua a scrivere soltanto il JSON. Lo scrape pianificato su GitHub Actions, dopo aver aggiornato la cache, importa in automatico i `source_id` nuovi come `published`. Serve configurare i secret `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` nel repository.

## Classificazione Grok (manuale)

Lo scrape programmato estrae i calendari con Gemini 3.5 Flash (Roma resta sul parser HTML), ma **non** classifica le schede (coordinate precise, quota, riassunto). Per completare le escursioni:

```bash
cd backend
npm test
npm run classify -- --limit 2 --dry-run
```

Serve `XAI_API_KEY` da [console.x.ai](https://console.x.ai/team/default/api-keys). Flag utili: `--dry-run` (non scrive), `--limit N`, `--id roma-...`.

Senza `--dry-run` lo script aggiorna `backend/data/excursions.json` e, se presente, `frontend/public/excursions.json`. Le uscite già classificate (stesso id, titolo, data e località) vengono riusate e non costano una nuova chiamata.

## Automazione

- `CI and release` esegue test e build. Su `main` e sui tag `v*` pubblica le immagini frontend e backend nel GitHub Container Registry.
- `Refresh excursion data` viene eseguito ogni giorno alle 04:17 UTC e può essere lanciato anche manualmente, anche per una sola sede (input `source`). Lancia gli script uno per sezione, aggiorna cache e `scrape-status.json` su `main`, poi inserisce in Supabase solo i `source_id` nuovi come `published`. Serve `GEMINI_KEY`; senza secret aggiorna solo CAI Roma. Se una sede fallisce senza cache il job resta rosso, ma i JSON delle sedi riuscite vengono comunque committati. Richiede i secret `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`. Non esegue il classificatore Grok e non sovrascrive le schede già in database.
- `Deploy GitHub Pages` verifica e pubblica il frontend statico a ogni aggiornamento di `main`.

Il repository GitHub deve consentire a GitHub Actions la scrittura dei contenuti e dei package. Se `main` è protetto, autorizzare il bot oppure adattare il workflow affinché apra una pull request.
