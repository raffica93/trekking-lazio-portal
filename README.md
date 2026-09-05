# Trekking CAI

Portale Angular ed Express per consultare calendario e mappa degli eventi pubblicati dalle sezioni CAI di tutta Italia. Il dominio canonico è `https://trekking-cai.it`. È un aggregatore indipendente: le attività sono organizzate dalle singole sezioni CAI, cui rimandano i collegamenti originali.

Il calendario mostra tutti gli eventi dal mese corrente, senza limite superiore; i mesi precedenti scompaiono dinamicamente nel fuso Europe/Rome. Ricerca, regione della sezione CAI, sezione, mese e filtri escursionistici aiutano a consultare il catalogo. L'elenco è paginato e la mappa raggruppa i punti vicini. Le uscite senza posizione verificata restano nell'elenco.

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

L'entry point è `npm run scrape -- --all --concurrency 8`. L'orchestratore avvia un processo isolato per ciascuna sezione, con URL e configurazione specifici nel registro nazionale. Gli alias storici `scrape:roma`, `scrape:tivoli`, ecc. restano compatibili. Sono disponibili `--source ID`, `--region Lazio`, `--dry-run` e `--strict`. Lo stato e le evidenze per sezione si trovano in `backend/data/scrape-status.json`.

Lo script aggiorna `backend/data/excursions.json` atomicamente. I parser condividono pattern per JSON-LD Event, ICS, calendari WordPress, tabelle HTML e programmi PDF testuali. Hash dei documenti e cache HTTP evitano estrazioni ripetute; timeout e limiti di concorrenza isolano gli errori delle fonti. Lo stato distingue raccolta riuscita, parziale, nessun evento futuro, formato non supportato e fonte irraggiungibile.

La raccolta nazionale usa parser deterministici e non richiede chiavi AI. Il parser dedicato Roma è conservato. I moduli Gemini/Grok storici restano disponibili nel codice, ma non vengono invocati dalla raccolta nazionale predefinita.

```bash
npm run scrape:tivoli -- --dry-run
npm run scrape -- --source alatri
```

Il censimento riproducibile parte dalla directory ufficiale CAI: `node scripts/discover-cai-sections.js`. Produce `backend/data/cai-sections.json` e la copia pubblica. `--directory-only` aggiorna il censimento; `--websites-only` verifica i siti già censiti. Il registro distingue sezioni censite da calendari trovati e da eventi effettivamente estratti: la presenza nel registro non implica copertura completa del programma. PDF scansionati, siti irraggiungibili e calendari non leggibili sono segnalati, senza inventare eventi. Dettagli in `docs/cai-italia.md`.

Un fallimento di una fonte conserva la sua cache e non cancella i risultati delle altre. `--strict` restituisce errore anche per fonti fallite senza cache. Le coordinate delle sedi CAI non vengono usate come mete delle escursioni. `organizerRegion` è la regione della sezione; `region` è quella della destinazione, quando riconoscibile.

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

L'import locale inserisce i `source_id` assenti in `places`, inclusi gli eventi senza coordinate, come bozze salvo `SUPABASE_IMPORT_STATUS=published`. Titolo, stato e foto delle righe esistenti restano intatti. L'import arricchisce i metadati della sezione mancanti e sostituisce coordinate di fallback quando possibile. Il registro nazionale e lo stato delle fonti vengono sincronizzati in `cai_sections`, pubblicamente leggibile e scrivibile solo dal backend.

Lo scrape locale scrive il JSON. Il workflow manuale su GitHub Actions aggiorna la cache e importa i dati in Supabase come `published`. Usa i secret esistenti `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`. Il frontend legge le righe pubblicate con paginazione, superando il limite predefinito di 1.000 record; la copia statica resta il fallback.

## Classificazione Grok (manuale)

La raccolta nazionale non esegue la classificazione AI. Per l'arricchimento manuale opzionale delle escursioni:

```bash
cd backend
npm test
npm run classify -- --limit 2 --dry-run
```

Serve `XAI_API_KEY` da [console.x.ai](https://console.x.ai/team/default/api-keys). Flag utili: `--dry-run` (non scrive), `--limit N`, `--id roma-...`.

Senza `--dry-run` lo script aggiorna `backend/data/excursions.json` e, se presente, `frontend/public/excursions.json`. Le uscite già classificate (stesso id, titolo, data e località) vengono riusate e non costano una nuova chiamata.

## Automazione

- `CI and release` esegue test e build. Su `main` e sui tag `v*` pubblica le immagini frontend e backend nel GitHub Container Registry.
- `Refresh excursion data` è esclusivamente manuale: il cron giornaliero è stato rimosso. Gli input `source` e `region` consentono aggiornamenti mirati, oppure si raccolgono tutte le fonti abilitate. Il workflow salva cache e rapporto di copertura, importa sezioni ed eventi in Supabase e attiva la pubblicazione del sito.
- `Deploy GitHub Pages` verifica e pubblica il frontend statico a ogni aggiornamento di `main`.

Il repository GitHub deve consentire a GitHub Actions la scrittura dei contenuti e dei package. Se `main` è protetto, autorizzare il bot oppure adattare il workflow affinché apra una pull request.
