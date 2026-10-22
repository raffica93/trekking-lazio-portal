# Raccolta Lombardia — CAI Brescia, run05

- Run ID: `cai-20261022-lombardia-brescia05`.
- Checkpoint pre-run: branch `codex/cai-orchestrator-luna`, HEAD e ref remoto `273fcb67894a192895cc688e27675abe3843156b`.
- Perimetro: solo `cai-brescia-9216005`; concurrency 1; `SCRAPE_MAX_DOCUMENTS=40`; `SCRAPE_SOURCE_BUDGET_MS=240000`; una init e una collect, senza `--retry-failed`.
- Esito: collection `partial`, files `ready`, database `pending`; Brescia `partial`, 51 eventi correnti, 143 estrazioni grezze su 40 documenti registrati. `discovery-limit` assente: entrambi i candidati residui sono comparsi tra i documenti completati.

## Candidati residui controllati

| URL | Metodo | Eventi estratti | SHA-256 |
|---|---|---:|---|
| `https://organizzazione.cai.it/sez-brescia/wp-content/uploads/sites/7/2026/01/elenco-escursioni-fondo-2026.pdf` | `pdf-text` | 0 | `8fdea80e94f0e10f0ced300a53b63b0ccfac53a32eed3b572cb0713d3e046592` |
| `https://organizzazione.cai.it/sez-brescia/category/attivita/` | nessun parser | 0 | `1aff700d90bcf7581b4580265cef7c3fc5d92d1afd69eaac3e0b11fa8fd49005` |

I due candidati sono stati raggiunti e registrati; il PDF non ha prodotto nuove estrazioni. Non sono stati introdotti eventi o coordinate manuali.

### Verifica del risultato vuoto

Il PDF è stato riesaminato in sola lettura dalla cache documentale con `pdftotext -layout`: documento PDF ufficiale di 1 pagina, estrazione di 40 righe non vuote. Il programma elenca il 1 febbraio, il 5–8 febbraio, il 22 febbraio e l’8 marzo 2026; tutte le date sono precedenti al 22 ottobre 2026. Perciò l’assenza di eventi futuri da questo programma è verificata, non deriva da un fallimento di lettura. La pagina `/category/attivita/` ha invece `nessun parser`: il suo zero estrazioni non è interpretato come calendario vuoto o copertura completa.

## Stato e delta

- Confronto di `backend/data/excursions.json` col checkpoint: Brescia 51 -> 51; 0 ID nuovi, 0 record cambiati, 0 rimossi. Le 143 righe estratte sono estrazioni documentali, non eventi nuovi.
- Non resta un errore `discovery-limit`. La sezione resta `partial` per URL storicamente non disponibili che l'orchestratore ha saltato senza retry: i due URL 403 in cooldown e il candidato GGS che aveva restituito 404 nel run04 (ora `previous-unavailable-skipped`). Nessun nuovo tentativo su tali URL.
- Nessun import, query o scrittura DB; nessun test durante la raccolta; nessun commit/push.
- Nessun lookup cartografico o geocoding: il catalogo Brescia non ha avuto delta.

## Ricevuta file

Il manifest del run sigilla i tre file dati; le copie backend/frontend sono byte-identiche.
