# Raccolta CAI Lombardia deep-07

- Run: `cai-20261020-lombardia-deep-07`
- Stato finale: `collection=partial`, `files=ready`, `database=completed` (verifica read-only).
- Eventi nel file dopo QA: **3.182**, invariati rispetto al deep-06; delta verificato dal deep-07: **0 nuovi record validi**.
- Fonti lavorate una volta sola: CAI Sesto Calende (pagine selezionate del PDF originale) e CAI Somma Lombardo (un solo download streaming con timeout 180 s). Nessun altro crawl o retry.

## CAI Sesto Calende

- Fonte ufficiale: [Libretto Programma 2026](https://caisestocalende.it/wp-content/uploads/2026/01/Libretto-Programma-2026-CAI-SESTO-CALENDE.pdf), PDF originale in cache, 25 pagine.
- Passaggio limitato alle pagine PDF 9–16, 8 pagine OCR totali. Le pagine originali sono state renderizzate e controllate visivamente a risoluzione leggibile; non è stata usata una copia compressa.
- OCR ha prodotto 25 candidati grezzi; il riconoscimento ha concatenato colonne e righe. Nessun candidato di questo passaggio è stato accettato come nuovo record: i testi non superavano la verifica di titolo/data/attribuzione o duplicavano righe già presenti. Le pagine 17–25 non sono state processate.
- Escluso il falso positivo `cai-sesto-calende-9216044-f40653f40b8d` (2026-10-03, `TC/TC - Dislivello Salita 310 m, discesa`): il titolo è frammentario e non corrisponde alle righe leggibili nelle pagine controllate.
- Il record già verificato nel deep-06 `cai-sesto-calende-9216044-c09ad45a0483` (“Castagnata sezionale”, 2026-10-25) resta invariato. Restano 8 record CAI Sesto nel file.
- Stato fonte: **partial**, 8 record nel file; OCR 25 candidati grezzi, zero nuovi validi; pagine PDF 17–25 ancora da esaminare. URL, hash e metodo `pdf-ocr` sono mantenuti in `scrape-status.json`.

## CAI Somma Lombardo

- Fonte ufficiale: [Programma Escursionistico SIEL 2026](https://caisomma.it/wp-content/uploads/pdf/Escursioni/2026/SIEL_Programma%20Escursionistico%202026.pdf).
- Unico tentativo streaming del lotto con timeout PDF di 180 s e budget fonte finito; esito esatto riportato dal collector: **`aborted`**. Il download non ha prodotto un documento utilizzabile e non è stato ritentato.
- La riga preesistente “Sacra di San Michele” (`cai-somma-lombardo-9216065-25f28820d036`) e la cache valida sono state conservate; nessun evento Somma nuovo aggiunto.
- Stato fonte: **failed**, 1 record preesistente; `documents=[]`, `methods=[]`, `error="aborted"`. Il registro mantiene l’URL ufficiale e l’hash già verificato.

## Riconciliazione e verifiche

- I tre record importati nel deep-06 restano presenti e intatti: `cai-gazzada-schianno-9216148-16ce1116224d`, `cai-gazzada-schianno-9216148-03dca13544c6` e `cai-sesto-calende-9216044-c09ad45a0483`.
- Il totale è stato riportato da 3.183 a 3.182 rimuovendo soltanto il falso positivo OCR indicato sopra. Non è stata eseguita alcuna scrittura DB.
- `backend/data/excursions.json`, `cai-sections.json` e `scrape-status.json` e le tre copie in `frontend/public/` sono parseabili come JSON e byte-per-byte identici a coppie.
- Manifest SHA-256 del run comprende i tre JSON backend e i rispettivi mirror pubblici frontend. La query SHA finale è verificabile da `manifest.json`; il rapporto è salvato accanto allo stato.
- Verifica Supabase in sola lettura sul progetto `snwzxegtqnnuvlawnpgl`: tutti i 3.182 ID del run sono presenti e `published`, 0 draft, 0 mancanti; 4.341 `places`, 837 `cai_sections`. Import `inserted=0`; nessuna scrittura DB nel deep-07.
- La copertura CAI della Lombardia resta incompleta: Sesto pp. 17–25 non verificate; Somma è bloccata dal download `aborted`. Nessun dato non verificato viene proposto per l’import.
