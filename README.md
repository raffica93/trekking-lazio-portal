# Trekking Lazio Portal

Portale Angular ed Express per consultare sulla mappa le escursioni pubblicate dalle sezioni CAI del Lazio.

## Avvio locale

Con Docker:

```bash
docker compose up --build
```

Il portale è disponibile su `http://localhost:8080`.

La versione pubblica è distribuita tramite GitHub Pages. Il frontend usa la cache statica
`frontend/public/excursions.json`, aggiornata automaticamente dal workflow di scraping.

Per lo sviluppo senza Docker, avviare `npm start` prima in `backend` e poi in `frontend`.

## Aggiornamento dati

```bash
cd backend
npm ci
npm run scrape
```

Lo script aggiorna `backend/data/excursions.json` in modo atomico, lascia il file invariato quando i dati non cambiano e ritenta automaticamente gli errori di rete o le risposte HTML non valide. È possibile personalizzare la chiamata con `SCRAPE_RETRIES` e `SCRAPE_TIMEOUT_MS`.

CAI Roma viene letto con il parser HTML. Le altre sezioni abilitate (Tivoli, Viterbo, Rieti, Monterotondo, Frosinone, Leonessa) usano Gemini 3.5 Flash per estrarre il calendario da HTML o PDF. Serve `GEMINI_KEY` in `backend/.env` in locale, e lo stesso nome come secret nelle GitHub Actions. Senza chiave lo scrape di Roma continua e le altre sezioni restano sulla cache.

```bash
npm run scrape -- --source tivoli
npm run scrape -- --dry-run
```

Le sezioni si accendono in `backend/sources.js` (`enabled: true`). Un fallimento di una fonte non cancella le altre. L’arricchimento già classificato (summary, coordinate) viene conservato se id, titolo, data e località non cambiano.

## Supabase e pannello amministratore

Il pannello è disponibile su `/#/admin` (necessario per funzionare anche su GitHub Pages). La migrazione in `supabase/migrations/` crea la tabella `places`, il bucket immagini, i profili admin e tutte le policy RLS. Applica la migrazione al progetto Supabase, quindi crea un utente nella sezione Authentication e rendilo amministratore con la query commentata in fondo alla migrazione.

Nei progetti Supabase recenti, verifica inoltre nelle impostazioni **Data API** che la tabella `public.places` sia esposta: le tabelle nuove possono non esserlo automaticamente. La migrazione concede già soltanto le operazioni necessarie a `anon` e `authenticated` e attiva RLS.

Nel file `frontend/public/supabase-config.js` inserisci l'URL del progetto e la sua **publishable key**. La chiave è sicura da distribuire nel browser: i permessi sono controllati dalle policy RLS. Non inserire mai la service role key nel frontend.

Per trasferire le escursioni esistenti, copia `backend/.env.example` in `backend/.env`, imposta le variabili nel tuo terminale e poi esegui:

```bash
cd backend
npm run import:supabase
```

L'import crea o aggiorna i luoghi usando l'ID originale come chiave; per sicurezza li importa come bozze, salvo `SUPABASE_IMPORT_STATUS=published`. Lo scraping pianificato continua ad aggiornare soltanto la cache JSON: l'import resta esplicito, così non sovrascrive stati di pubblicazione o correzioni fatte nel pannello.

## Classificazione Grok (manuale)

Lo scrape programmato estrae i calendari con Grok, ma **non** classifica le schede (coordinate precise, quota, riassunto). Per completare le escursioni:

```bash
cd backend
npm test
npm run classify -- --limit 2 --dry-run
```

Serve `XAI_API_KEY` da [console.x.ai](https://console.x.ai/team/default/api-keys). Flag utili: `--dry-run` (non scrive), `--limit N`, `--id roma-...`.

Senza `--dry-run` lo script aggiorna `backend/data/excursions.json` e, se presente, `frontend/public/excursions.json`. Le uscite già classificate (stesso id, titolo, data e località) vengono riusate e non costano una nuova chiamata.

## Automazione

- `CI and release` esegue test e build. Su `main` e sui tag `v*` pubblica le immagini frontend e backend nel GitHub Container Registry.
- `Refresh excursion data` viene eseguito ogni giorno alle 04:17 UTC e può essere lanciato anche manualmente. Se trova modifiche, aggiorna la cache su `main`, attivando un nuovo rilascio. Estrae i calendari delle altre sezioni con Gemini 3.5 Flash se il secret `GEMINI_KEY` è configurato nel repository; senza secret aggiorna solo CAI Roma. Non esegue il classificatore Grok.
- `Deploy GitHub Pages` verifica e pubblica il frontend statico a ogni aggiornamento di `main`.

Il repository GitHub deve consentire a GitHub Actions la scrittura dei contenuti e dei package. Se `main` è protetto, autorizzare il bot oppure adattare il workflow affinché apra una pull request.
