# Classificazione Mercury e revisione QA — Fivizzano

Run: `cai-map-20261023-fivizzano01`

Input isolato: `backend/data/agent-runs/cai-20261023-toscana-fivizzano-calendar01/classification-input.json`, SHA-256 `1aba5906e6a743318ecb63b82b733deca9263759e943710308352901e3b33334`. Modello richiesto `inception/mercury-decide`, Decisions API. Tutte le quattro risposte attestano provider Inception e risposta `inception/mercury-decide-20260930`; `modelVersion` coincide con `responseModel`, `modelAttested=true`. L’alias richiesto resta distinto dall’identificativo di risposta. Nessuna sostituzione del modello. Le metriche `confidence` e `probability` sono conservate come valori distinti. Stato batch: 4/4 pronti, zero errori.

| Evento | Candidato Mercury | Esito effettivo dopo QA | Nota |
|---|---|---|---|
| `…-25b520da9498` Monte Sumbra | trekking / a piedi | trekking / a piedi | Descrizione ufficiale di itinerario e difficoltà. |
| `…-4ac183446fc1` Mont’Alto / Sullioni | trekking / a piedi | trekking / a piedi | Descrizione ufficiale di itinerario e difficoltà. |
| `…-9ad6725f7fbe` Lago Padule | trekking / altro | **da_verificare / altro** | Override di revisione: la sola dicitura “Uscita del gruppo Montagnaterapia con la Casa Cardinale Maffi di Fivizzano” non attesta itinerario o modalità a piedi; non confermare come trekking né includere come attività verificata. Evidenza: https://www.caifivizzano.it/eventi/lago-padule-al-passo-del-cerreto/ |
| `…-eba39ba9cdc6` Climbing Day | da_verificare / alpinismo/ferrata | da_verificare / alpinismo/ferrata | Descrizione ufficiale identifica arrampicata sportiva; mantenerla da verificare secondo il contratto, senza forzare trekking. |

Conteggi del modello: 3 trekking, 0 non trekking, 1 da verificare. Conteggi effettivi dopo revisione: 2 trekking, 0 non trekking, 2 da verificare, 0 errori. Il duplicato semantico `…-5b1c92eec5ec` e i due aggiornamenti sourceDocument-only restano esclusi. Nessuna coordinata aggiunta.

QA importer indipendente finale PASS sugli output con override: manifest/input/output/state/report verificati; 4/4 ID esatti, nessuna modifica ai campi evento, delta-only pronto. Nessun accesso o write DB è avvenuto. Il checkpoint remoto include classificato, state, manifest e questo report; import e ricevuta restano subordinati al preflight DB read-only.
