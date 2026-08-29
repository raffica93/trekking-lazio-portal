# Trekking Lazio Portal

Portale Angular ed Express per consultare sulla mappa le escursioni pubblicate dal CAI Roma.

## Avvio locale

Con Docker:

```bash
docker compose up --build
```

Il portale è disponibile su `http://localhost:8080`.

Per lo sviluppo senza Docker, avviare `npm start` prima in `backend` e poi in `frontend`.

## Aggiornamento dati

```bash
cd backend
npm ci
npm run scrape
```

Lo script aggiorna `backend/data/excursions.json` in modo atomico e lascia il file invariato quando i dati non cambiano.

## Automazione

- `CI and release` esegue test e build. Su `main` e sui tag `v*` pubblica le immagini frontend e backend nel GitHub Container Registry.
- `Refresh excursion data` viene eseguito ogni giorno alle 04:17 UTC e può essere lanciato anche manualmente. Se trova modifiche, aggiorna la cache su `main`, attivando un nuovo rilascio.

Il repository GitHub deve consentire a GitHub Actions la scrittura dei contenuti e dei package. Se `main` è protetto, autorizzare il bot oppure adattare il workflow affinché apra una pull request.
