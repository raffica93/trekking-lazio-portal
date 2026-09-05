# Registro CAI nazionale

Il portale parte dalla directory ufficiale [Sezioni e sottosezioni del CAI](https://www.cai.it/sezioni-territoriali/sezioni-e-sottosezioni/) e mantiene un registro riproducibile in `backend/data/cai-sections.json`, copiato in `frontend/public/cai-sections.json`.

## Copertura censita

L'ultimo aggiornamento del registro contiene 837 record: 525 sezioni, 309 sottosezioni e 3 enti nazionali distribuiti su 20 regioni. La directory ufficiale viene usata come fonte dell'identità della sezione; il sito e il calendario pubblici vengono verificati separatamente.

Gli stati hanno questo significato:

- `calendar-found`: è stato trovato almeno un URL pubblico candidato a calendario;
- `website-only`: il sito è raggiungibile ma non pubblica un link calendario riconoscibile;
- `unreachable`: il sito non ha risposto entro il limite di rete;
- `missing-website`: la directory non pubblica un sito;
- `social-only`: è disponibile soltanto un profilo social.

La presenza nel registro non significa che esista un programma leggibile o che siano stati estratti eventi. PDF scansionati, calendari annuali senza date strutturate e siti irraggiungibili restano visibili come fonte da verificare, senza generare eventi inventati.

## Aggiornamento

Da `backend/`:

```bash
node scripts/discover-cai-sections.js --directory-only
node scripts/discover-cai-sections.js --websites-only
node scripts/discover-cai-sections.js --sanitize-only
```

La scoperta usa cache con TTL di 24 ore, un massimo di due richieste concorrenti per dominio e un massimo di otto URL calendario per sezione. Sono esclusi asset tecnici, plugin e temi WordPress, social network e documenti amministrativi. Per aggiornare la cache si può aggiungere `--refresh`.

## Scraping degli eventi

`node scripts/scrape.js --all --concurrency 8` avvia un worker isolato per ogni fonte abilitata. Gli adattatori deterministici condividono i parser per JSON-LD Event, ICS, WordPress Events API, tabelle HTML e PDF testuali; la configurazione della fonte decide solo URL, pattern e limiti. Le coordinate vengono accettate soltanto se pubblicate dalla fonte dell'evento: le coordinate della sede CAI non vengono copiate sugli eventi.

Il filtro temporale usa il primo giorno del mese corrente nel fuso `Europe/Rome`. Non esiste un limite superiore: gli eventi futuri rimangono disponibili e quelli del mese precedente spariscono automaticamente.

## Aggiornamento manuale

Il workflow GitHub Actions `Refresh excursion data` è manuale (`workflow_dispatch`) e accetta una fonte o una regione. Non è presente un cron giornaliero: il catalogo cambia solo quando viene lanciata un'azione di aggiornamento o viene eseguito lo script localmente.
