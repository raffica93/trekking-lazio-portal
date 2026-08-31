# Frontend Trekking CAI

Frontend Angular del portale [trekking-cai.it](https://trekking-cai.it). Mostra
le escursioni delle sezioni CAI del Lazio su una mappa Leaflet e include il
pannello amministratore collegato a Supabase.

## Sviluppo locale

Dal repository principale, installa le dipendenze e avvia il server di sviluppo:

```bash
cd frontend
npm ci
ng serve
```

Apri `http://localhost:4200/`. Per usare l'API locale insieme al frontend,
avvia anche il backend con `cd ../backend && npm start`; la configurazione proxy
è in `proxy.conf.json`.

## Build e test

```bash
npm test -- --watch=false
npm run build
```

La build di produzione viene scritta in `dist/frontend/browser/`. Il workflow
GitHub Pages la pubblica con base `/` e conserva il dominio personalizzato
definito in `public/CNAME`.

## Configurazione

Per collegare Supabase in locale, configura URL e publishable key in
`public/supabase-config.js`. Non inserire mai la service role key nel frontend:
le autorizzazioni sono applicate dalle policy RLS di Supabase.
