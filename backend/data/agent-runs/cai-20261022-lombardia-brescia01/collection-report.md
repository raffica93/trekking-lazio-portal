# Raccolta Lombardia — campione CAI Brescia

- Run: `cai-20261022-lombardia-brescia01` (unico, creato 2026-10-22T18:24:08Z).
- Scope: una sola fonte, `cai-brescia-9216005`; `--concurrency 1`, `SCRAPE_MAX_DOCUMENTS=12`, `SCRAPE_SOURCE_BUDGET_MS=120000`. Un solo `collect`, nessuna ripresa ulteriore. Orchestratore deterministico, senza classificazione AI.
- Esito: `collection=partial`, `files=ready`, `database=pending`; 12 documenti controllati, limite documenti raggiunto. La sezione conserva 44 eventi rispetto ai 43 del precedente stato (2026-10-20 03:47 UTC).
- Nuovo evento verificato: `cai-brescia-9216005-3badd4cc403c`, “Serata Cinema Nuovo Eden – CAI Brescia – The Wall of Shadows – mercoledì”, 2026-10-21. La pagina ufficiale CAI Brescia `https://organizzazione.cai.it/sez-brescia/` mostra la card e il permalink `/2026/10/serata-cinema-nuovo-eden-cai-brescia-the-wall-of-shadows-mercoledi-21-ottobre-2026-ore-2045/`; estrazione `html-calendar`. Luogo e coordinate restano non verificati/null; nessun attributo amministrato è stato corretto. Il record estratto riporta `durationHours=26`, valore anomalo da verificare prima di riuso.
- Delta globale sui file catalogo rispetto al commit `6d0bd13`: 3.337 → 3.338 eventi; 1 ID aggiunto, 0 rimossi, 0 righe esistenti modificate. I 43 eventi Brescia già in cache sono stati preservati. Nessun nuovo ID duplicato nel catalogo globale; l’orchestratore deduplica per ID, ma non produce un contatore separato di duplicati tra documenti. Non si deduce il numero di overlap sottraendo gli eventi finali dal totale delle estrazioni, perché le fonti includono eventi fuori dalla finestra temporale.
- Fonte primaria residua: il PDF ufficiale è accessibile e invariato; lo stato rimane `partial` con `discovery-limit` (“14 candidate documents remain”). Nessuna affermazione di copertura completa.

## Copertura della regione in questo campione

| Sezione controllata | Complete | Partial | Unreachable | Eventi nuovi verificati | Duplicati nuovi esclusi |
|---|---:|---:|---:|---:|---:|
| CAI Brescia (`cai-brescia-9216005`) | 0 | 1 | 0 | 1 | 0 (nessun ID duplicato nel delta globale; overlap per documento non rendicontato separatamente) |

Questi conteggi coprono soltanto la fonte assegnata, non l’intero censimento CAI Lombardia.

## Documenti della fonte controllati

| URL | Metodo | Eventi estratti | SHA-256 del contenuto |
|---|---|---:|---|
| https://organizzazione.cai.it/sez-brescia/wp-content/uploads/sites/7/2026/02/Programma-Escursionismo-2026.pdf | `pdf-text` | 26 | `5cf9de44a727ec139ed73c330d90297d2f50ab1c3f23060c9a675455443641b1` |
| https://organizzazione.cai.it/sez-brescia/eventi/?ical=1 | nessun parser | 0 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| https://organizzazione.cai.it/sez-brescia/attivita/gruppo-juniores/juniores2026/ | `html-calendar` | 4 | `ed878a380c0898cf7c26595af1ec8635f523772ba7b8eeaa84ca02a5e4997267` |
| https://organizzazione.cai.it/sez-brescia/attivita/escursionismo/commissione-escursionismo/ | `html-calendar` | 26 | `ed982508a4adfb80836611b7e4f06c2ba4cee397909ce4d4934dca64d3b13d56` |
| https://organizzazione.cai.it/sez-brescia/2025/12/gruppo-escursionistico-seniores-1997-calendario-escursioni-trekking-2026/ | nessun parser | 0 | `8af908b974eeaaef016172c39326e31c3aec70451498ba387ad1440442d62cd6` |
| https://organizzazione.cai.it/sez-brescia/wp-content/uploads/sites/7/2026/03/Trekking-delle-Orobie-2026.pdf | `pdf-text` | 0 | `448749a9a7e1151dd4ee0354421a7ef135008c8d7f04b63c1e2b7b3caf989da4` |
| https://organizzazione.cai.it/sez-brescia/wp-content/uploads/sites/7/2026/09/20260913-Punta-Setteventi.pdf | `pdf-text` | 0 | `8693e1b18454ecb54cb6c25f53aff2b9b1b85515566456b20aea4587055fd2a0` |
| https://organizzazione.cai.it/sez-brescia/ | `html-calendar` | 3 | `c3a98cfef0f494e8fc0d0b88bbfe9ec4cb99a7e0793a4f8b6cb2607d03c3dbce` |
| https://organizzazione.cai.it/wp-json/tribe/events/v1/events?start_date=2026-10-01&per_page=100 | `wordpress-events` | 0 | `6c0f37426b628d04f19d67bfa81b0c2cc8984cf143db381fc1c6fc5db4cf5825` |
| https://organizzazione.cai.it/sez-brescia/wp-content/uploads/sites/7/2025/12/Elenco-escursioni-trekking-CAI-SENIORES-anno-2026.pdf | `pdf-text` | 34 | `45efa6b8a661bae7755efe61304ce51dc76df064a390651a5c99ab1ea4b8834a` |
| https://organizzazione.cai.it/sez-brescia/2026/09/54corso-sci-di-fondo-escursionistico-anno-2026-2027/ | nessun parser | 0 | `952f91039122acc304fcea88eedbb66b6a61ad2611ffbbda03fba1d4568c710e` |
| https://organizzazione.cai.it/sez-brescia/2026/10/gruppo-escursionistico-seniores-1997-settimana-escursionistica-invernale-a-moena-val-di-fassa-trentino-a-a/ | nessun parser | 0 | `6e5c358cc07f16d309ad1f06e2965795646065d6c615599f982cf993ef52daaf` |

## Errori e prossimo passo

- Risolto: nessun errore di trasporto sulla fonte ufficiale accessibile durante questo run; il parser deterministico ha estratto il PDF e il calendario HTML.
- Aperto: la scoperta sul PDF segnala 14 documenti candidati residui dopo il limite 12. In precedenza lo stato riportava 2 residui; il valore nuovo riflette questo tentativo limitato e non dimostra che quei documenti siano stati esaminati.
- Aperto: due URL ufficiali avevano precedenti HTTP 403 e sono stati saltati per cooldown, senza nuova richiesta in questo run: `https://archivio.cai.it/sezione/brescia/calendario-iniziative/` e `https://organizzazione.cai.it/sez-brescia/attivita/scuola-adamello-tullio-corbellini/chi-siamo-2/`. Gli altri URL precedentemente indisponibili mantengono lo stato storico registrato.
- Prossimo passo: dopo review del report e dei file aggiornati, programmare un successivo campione limitato soltanto per i 14 documenti residui del PDF; non espandere ad altre fonti o sezioni in questa ripresa.

## Manifest e limiti

`manifest.json` sigilla i JSON backend usati dal run; le copie frontend sono state aggiornate dall’orchestratore e confrontate byte-per-byte con quelle backend. `state.json` resta `database=pending`. Nessun test è stato eseguito in parallelo alla raccolta; nessuna classificazione, import, query o scrittura DB, commit o push è stata effettuata.
