# Report raccolta — CAI Pescia index01

Run `cai-20261023-toscana-pescia-index01`; target esatto `https://www.caipescia.it/cp/calendario-attivita-cai-pescia/`, dopo checkpoint selezione `90715a2b3868b8ad6395e497446c706d3268605c`. Un singolo fetch autorizzato, `SCRAPE_MAX_DOCUMENTS=1`, `SCRAPE_SOURCE_BUDGET_MS=120000`, concurrency 1.

La richiesta è terminata con errore client `timeout of 8000ms exceeded`. Non è stato osservato status HTTP, non è stato restituito o memorizzato body, non è stata scritta nuova cache e non sono stati estratti eventi. Non c'è stato retry. Il timeout di 8 s è più breve del budget scraper configurato; non inferire che la pagina sia vuota o irraggiungibile in generale.

Il primo output del collector aveva sostituito la riga Pescia dello status eliminando 12 documenti storici e la precedente issue `discovery-limit` della URL mensile agosto. Lo status è stato corretto recuperando tali dati dal checkpoint remoto `FETCH_HEAD=90715a2b3868b8ad6395e497446c706d3268605c`, preservando i 12 documenti e l'issue mensile e aggiungendo una issue distinta sul timeout della URL `/cp/`. Il registro FAILURES ha mantenuto il record di discovery agosto e aggiunto `CAI-F-6ccdc9044ca287f1` per il timeout attuale.

Catalogo: 3.376→3.376 ID unici, zero aggiunti/rimossi/modificati. `backend/data/excursions.json` SHA-256 `92eb1e16428787e068b77a872cd1301218f71b3c000a803f395f7f6963bda3c8`, identico al mirror frontend. `scrape-status.json` backend/frontend sono stati riallineati; i mirror coincidono. Nessuna classificazione o query/write DB. Fonte parziale/failed per questo tentativo; il problema è registrato e la URL non va ritentata senza strategia distinta.
