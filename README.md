# Trekking Lazio Portal

Portale Angular ed Express per consultare sulla mappa le escursioni pubblicate dal CAI Roma.

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

## Classificazione Grok (manuale)

Lo scrape programmato **non** chiama Grok. Per completare le escursioni con coordinate più precise, quota, km e un riassunto:

```bash
cd backend
npm test
npm run classify -- --limit 2 --dry-run
```

Serve `XAI_API_KEY`, oppure una sessione Grok CLI già loggata (`~/.grok/auth.json`). Flag utili: `--dry-run` (non scrive), `--limit N`, `--id roma-...`.

Senza `--dry-run` lo script aggiorna `backend/data/excursions.json` e, se presente, `frontend/public/excursions.json`. Le uscite già classificate (stesso id, titolo, data e località) vengono riusate e non costano una nuova chiamata.

## Automazione

- `CI and release` esegue test e build. Su `main` e sui tag `v*` pubblica le immagini frontend e backend nel GitHub Container Registry.
- `Refresh excursion data` viene eseguito ogni giorno alle 04:17 UTC e può essere lanciato anche manualmente. Se trova modifiche, aggiorna la cache su `main`, attivando un nuovo rilascio. Non esegue il classificatore Grok.
- `Deploy GitHub Pages` verifica e pubblica il frontend statico a ogni aggiornamento di `main`.

Il repository GitHub deve consentire a GitHub Actions la scrittura dei contenuti e dei package. Se `main` è protetto, autorizzare il bot oppure adattare il workflow affinché apra una pull request.
