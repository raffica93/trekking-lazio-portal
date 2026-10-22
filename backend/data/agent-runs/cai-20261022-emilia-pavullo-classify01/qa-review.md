# QA semantica e overlay — CAI Pavullo classify01

Run `cai-20261022-emilia-pavullo-classify01`; input SHA-256 `68df90eadf95b3acdd5521741f1e3805b3bde2ad2905dd81e06db41fd75a6144`. L’output Mercury grezzo resta conservato in ogni `classification` con i campi modello richiesto/attestato, confidence, probability, fingerprint e rationale. Il campo separato `review` registra il giudizio effettivo per l’import; non modifica la decisione candidata Mercury. Fonte primaria: https://www.caipavullo.it/calendario-2026/.

| ID | Candidato Mercury decision/category | Review effettiva | Import gate |
|---|---|---|---|
| `...195cdeaaefee` | trekking / altro | trekking / a piedi | ammesso dopo override categoria, unico senza match semantico plausibile; data 4 ottobre è trascorsa ma è nel mese corrente del catalogo |
| `...911b3fb35e48` | da_verificare / alpinismo/ferrata | da_verificare / alpinismo/ferrata | hold; possibile Spigolo Bianco duplicato con località discordante |
| `...0d5f7b164d74` | trekking / a piedi | da_verificare / a piedi | hold; possibile sovrapposizione “Borghi e Sentieri” stessa data |
| `...ed6b83da6a5f` | trekking / sci | da_verificare / a piedi | hold; categoria Mercury incoerente e possibile duplicato Lago Terzo |
| `...201b098e6e08` | da_verificare / sci (confidence 0.084) | da_verificare / a piedi | hold; categoria non supportata e possibile duplicato Colbricon |

Il titolo della pagina e l’intestazione dicono 2026, mentre la tabella riporta 2025; i cinque weekday concordano con il 2026. La discrepanza resta registrata. Le quattro righe in hold non producono place né classificazioni DB finché la deduplica semantica non è conclusa. Nessuna coordinata inventata.
