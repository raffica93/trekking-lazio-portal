# Trekking CAI

Portale Angular ed Express per consultare sulla mappa le escursioni pubblicate dalle sezioni CAI del Lazio. Il dominio canonico è `https://trekking-cai.it`.

## Avvio locale

Prerequisiti: Node.js 22+ per i servizi locali e Docker Desktop per l'avvio
integrato.

Con Docker:

```bash
docker compose up --build
```

Il portale è disponibile su `http://localhost:8080`.

La versione pubblica è distribuita tramite GitHub Pages. Il file `frontend/public/CNAME` associa il dominio personalizzato; configura su DNS il record indicato da GitHub Pages e abilita HTTPS nelle impostazioni del repository. Con Supabase configurato il frontend
legge i luoghi `published` da `places`. La cache statica `frontend/public/excursions.json`
resta aggiornata dallo scrape come fallback.

Per lo sviluppo senza Docker, avviare `npm start` prima in `backend` e poi in `frontend`.

I test si eseguono separatamente nei due servizi:

```bash
cd backend && npm ci && npm test
cd ../frontend && npm ci && npm test -- --watch=false
```

Il frontend usa Angular e Leaflet; il backend espone l'API Express e mantiene
la cache JSON delle escursioni. La struttura principale è:

- `frontend/`: applicazione web e asset pubblicati su GitHub Pages;
- `backend/`: API, scraper, classificatore e import Supabase;
- `supabase/`: migrazioni e Edge Function per il tracking dei click CAI;
- `docs/`: documentazione delle fonti e della pipeline di scraping.

## Aggiornamento dati

```bash
cd backend
npm ci
npm run scrape:roma
npm run scrape:all
```

Ogni sede CAI ha uno script (`npm run scrape:sora`, `scrape:tivoli`, …). `scrape:all` le lancia una alla volta così un timeout Gemini non azzera le altre. Lo stato per sezione sta in `backend/data/scrape-status.json` e in admin `/admin/sedi`.

Lo script aggiorna `backend/data/excursions.json` in modo atomico, lascia il file invariato quando i dati non cambiano e ritenta automaticamente gli errori di rete o le risposte HTML non valide. `SCRAPE_RETRIES` e `SCRAPE_TIMEOUT_MS` valgono per CAI Roma; `GEMINI_TIMEOUT_MS` (default 5 minuti) e `GEMINI_PAUSE_MS` (default 10s in `scrape:all`, 15s in Actions) per le altre. Un 429 di quota non viene ritentato: le sedi Gemini successive restano sulla cache. Un 429 di rate-limit o un 503 aspetta e riprova.

CAI Roma viene letto con il parser HTML. Le altre sezioni abilitate usano Gemini 3.5 Flash sul loro template (pagina programma, calendario o PDF). Serve `GEMINI_KEY` in `backend/.env` in locale, e lo stesso nome come secret nelle GitHub Actions. Senza chiave lo scrape di Roma continua e le altre sezioni restano sulla cache.

```bash
npm run scrape:tivoli -- --dry-run
npm run scrape -- --source alatri
```

Le sezioni si accendono in `backend/sources.js` (`enabled: true`). Un fallimento di una fonte non cancella le altre; se una sede muore senza cache lo script esce con codice 1. L’arricchimento già classificato (summary, coordinate) viene conservato se id, titolo, data e località non cambiano. Dettaglio sedi: `docs/cai-scrape-riepilogo.md`.

## Supabase e pannello amministratore

Il pannello è disponibile su `/admin`. La migrazione in `supabase/migrations/` crea la tabella `places`, il bucket immagini, i profili admin e tutte le policy RLS. Applica la migrazione al progetto Supabase, quindi crea un utente nella sezione Authentication e rendilo amministratore con la query commentata in fondo alla migrazione.

Nei progetti Supabase recenti, verifica inoltre nelle impostazioni **Data API** che la tabella `public.places` sia esposta: le tabelle nuove possono non esserlo automaticamente. La migrazione concede già soltanto le operazioni necessarie a `anon` e `authenticated` e attiva RLS.

Nel file `frontend/public/supabase-config.js` inserisci l'URL del progetto e la sua **publishable key**. La chiave è sicura da distribuire nel browser: i permessi sono controllati dalle policy RLS. Non inserire mai la service role key nel frontend.

### Tracking dei link CAI

Dopo il consenso Analytics, i link CAI passano attraverso la Edge Function
`track-cai-click`. La funzione invia l'evento fisso `click_sito_cai` a GA4 con
Measurement Protocol, attende la risposta di raccolta e poi reindirizza al sito
CAI. Il segreto GA4 resta esclusivamente nell'ambiente Supabase.

```bash
npx supabase secrets set GA4_API_SECRET=<secret-measurement-protocol> --project-ref <project-ref>
npx supabase functions deploy track-cai-click --project-ref <project-ref> --no-verify-jwt --use-api
```

La funzione è pubblica perché i visitatori non sono autenticati, ma accetta un
solo evento e permette redirect esclusivamente verso la allow-list dei domini
CAI. Per verificare soltanto la configurazione, senza generare un evento:

```text
https://<project-ref>.supabase.co/functions/v1/track-cai-click?health=1
```

Per trasferire le escursioni esistenti, copia `backend/.env.example` in `backend/.env`, imposta le variabili nel tuo terminale e poi esegui:

```bash
cd backend
npm run import:supabase
```

L'import locale inserisce i `source_id` ancora assenti in `places` e, per sicurezza, li marca come bozze salvo `SUPABASE_IMPORT_STATUS=published`. Titolo, stato e foto delle righe già presenti restano intatti. Se una scheda ha ancora le coordinate di fallback su Roma e non è classificata (`peak` / `trailhead` / `massif`), l'import aggiorna solo latitudine, longitudine e `coordinates_quality`.

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
- `Refresh excursion data` viene eseguito ogni giorno alle 04:17 UTC e può essere lanciato anche manualmente, anche per una sola sede (input `source`). Lancia gli script uno per sezione, aggiorna cache e `scrape-status.json` su `main`, poi inserisce in Supabase i `source_id` nuovi come `published` e riallinea le coordinate di fallback su Roma. Serve `GEMINI_KEY`; senza secret aggiorna solo CAI Roma. Se una sede fallisce senza cache il job resta rosso, ma i JSON delle sedi riuscite vengono comunque committati. Richiede i secret `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`. Non esegue il classificatore Grok e non sovrascrive titolo, stato o foto delle schede già in database.
- `Deploy GitHub Pages` verifica e pubblica il frontend statico a ogni aggiornamento di `main`.

Il repository GitHub deve consentire a GitHub Actions la scrittura dei contenuti e dei package. Se `main` è protetto, autorizzare il bot oppure adattare il workflow affinché apra una pull request.
