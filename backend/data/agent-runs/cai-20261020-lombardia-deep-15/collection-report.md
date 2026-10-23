# Raccolta CAI Lombardia — deep-15

- Run: `cai-20261020-lombardia-deep-15`.
- Raccolta singola bounded su 3 fonti Lombardia residue con URL ufficiali non già analizzate nei run deep06–14; `maxDocuments=40`, `90 s/fonte`, concorrenza 8. Nessun retry successivo, nessuna fonte social o ad attribuzione condivisa.
- Risultato: deep14 3.206 → deep15 3.206 record nei file, delta locale 0. Nessuna delle tre fonti ha prodotto record candidati. Conteggio fonte-specifico: 0 per ciascuna.
- QA: conteggi fonte e URL/metodo/hash verificati nel registro `scrape-status.json`; nessun nuovo titolo/data/luogo da approvare. Non sono stati creati o modificati record evento.
- Stato: `collection=partial`, `files=ready`, `database=completed` dopo verifica DB in sola lettura; `inserted=0`. Nessuna scrittura DB è stata necessaria. Le fonti indicate restano irrisolte; copertura CAI Lombardia incompleta.

## Fonti esaminate

| Source ID | Esito | URL ufficiale raggiunto | Metodo registrato | Eventi | Residuo |
|---|---|---|---|---:|---|
| `cai-lentate-sul-seveso-9116061` | `unsupported` | https://www.comune.meda.mb.it/export/sites/default/.galleries/documenti/eventi-news/IDS26_Meda_LOCANDINA_.pdf | `pdf-ocr`; cache SHA-256 `070473a7d1d15b6392b84377d5944fa8cc0d5012fca85e5a8e2aeb926279504b` | 0 | Documento PDF elaborato, nessun evento estratto; nessun issue tecnico registrato. La fonte è ospitata dal Comune di Meda e non ha fornito record con attribuzione/evento CAI verificabile per questa sezione. |
| `cai-aldo-mantovani-9116111` | `unsupported` | https://www.alpinistimonzesi.it/ | nessun parser positivo; cache visitata a `https://alpinistimonzesi.it/`, SHA-256 `ff761aecb2e22893f54e3aaa4fedf0b62086569c6a3d7010be3d6b6c69ff09f4` | 0 | Pagina ufficiale raggiunta, nessun documento o calendario evento estraibile registrato; nessun issue tecnico registrato. |
| `cai-trezzo-sull-adda-9216156` | `unsupported` | https://www.caitrezzo.eu/ | nessun parser positivo; cache SHA-256 `ed898604f44f35b2a64e65b79e14eda0b37eeb738d81e5402aac94f86dc42072` | 0 | Homepage ufficiale raggiunta, nessun documento/calendario con eventi estraibili registrato; nessun issue tecnico registrato. |

## Fonti residue escluse

- I dieci gruppi CAI Brescia rimasti puntano tutti allo stesso PDF della sezione Brescia; senza intestazione o attribuzione certa alle singole sottosezioni non sono importabili.
- Casorate Sempione e Varano Borghi condividono calendari di altre sezioni/intersezionali, quindi l'attribuzione sarebbe ambigua.
- Bovisio Masciago ha precedenti HTTP 503; Villa Carcina ha un precedente 404. Nessun nuovo tentativo è stato eseguito.

## File e integrità

Il manifest SHA-256 del run contiene i sei JSON backend/frontend. Ogni copia frontend è byte-identica al corrispondente JSON backend; tutti e sei i file passano `JSON.parse`. Le hash sono in `manifest.json`.

## Verifica database

Verifica read-only sul progetto `snwzxegtqnnuvlawnpgl`: 3.206 ID del manifest corrispondono a 3.206 righe `published`; 0 `draft`, 0 mancanti. Totali: 4.365 `places`, 837 `cai_sections`. Inseriti: 0. Tutti e sei i file del manifest sono stati verificati e le copie frontend corrispondono ai JSON backend.
