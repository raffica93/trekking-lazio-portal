# Collection report — CAI Caserta / Monte Scalambra

- Run: `cai-20261022-campania-caserta-scalambra01`; source `cai-caserta-9238006`; collection `partial`, files `ready`, database `pending`.
- Scope: exactly one explicit URL, concurrency 1, max 1 document, 120 s source budget: `https://www.caicaserta.it/escursioni/Monte%20Scalambra.pdf`. No discovery follow-up, annual PDF retry, other URL, tests, classification, import, or database operation was started.
- Cached PDF: 244304 bytes, SHA-256 `d239fdc33cf9583b292bf84189c0c3b2dce0532a289b660b133e420a62142b9b`, content type `application/pdf`, Last-Modified `Tue, 13 Oct 2026 16:56:40 GMT`; HTTP status was not persisted. Cache key SHA-256 `5635a0bd620cd92cf3b58a01b570d762ec0b39fb16118d59dc8fe087da45f4a0`. `source-document.pdf` is byte-identical to the cache body.
- Production status records `method=pdf-text`, 0 event candidates for this document. Independent `pdftotext -layout` inspection of the same cached bytes finds “Domenica 25 ottobre 2026”, “C.A.I. Caserta”, “Anello del Monte Scalambra (1420 m)”, “E/Escursionistica”, and the Serrone–Eremo di San Michele Arcangelo route. This is direct evidence for the outing and date even though the parser emitted no candidate.
- The body corroborates existing catalog ID `cai-caserta-9238006-8ca304031e6a`: title “Da Serrone al Monte Scalambra (1420 m) per l’Eremo di San Michele Arcangelo”, date `2026-10-25`, organizer `CAI Caserta`, location `Monti Ernici`. The PDF calls the outing “Anello del Monte Scalambra” and describes the same Serrone/Eremo/Monte Scalambra route; it identifies the mountain with the Monti Ernici chain. No new row or manual row edit was made.
- Caution: PDF document properties show title “Microsoft Word - 20 - Capin di Ponente da Camporosso.doc” and author “Tricesimo1”, which conflict with the body. Attribution above rests on the PDF body and the captured official CAI Caserta page link, not those file properties.
- The extracted PDF text contains no latitude/longitude pair. Existing catalog coordinates `41.802, 13.486` with quality `massif` remain unchanged and are not newly verified by this document. No location, region, editorial, or administrative fields were updated.
- Catalog comparison against baseline `775d3604840d636637af1e0be804708ccf03febf` by ID prefix `cai-caserta-9238006-`: 50 rows before and after, 0 added, 0 removed, 0 changed. Canonical sorted-row SHA-256 `1bc3d52b28218c621596dfbeb21e00a7b90bdb9fa2b0e0c4b405557498cb3b74` is identical. Focused record row SHA-256 `b517322f48fc25483b6f180c8045e7a399b8e0a5239b4ab4b753848ddd3babb9` is identical. Total catalog event rows remain 3366.
- The source remains `partial`; status retains 5 prior documents plus this PDF (6 total). The annual PDF discovery backlog (5), HTML-index continuation (1), and unrelated Francigena OCR failure remain open. This targeted document did not resolve the queue or establish section completeness.
- Full excursions JSON SHA changed from `d3e8e73a66063319c606fbe921695f08f4336ca50dc0ebfb3f69cd29d34f426f` to `bd876be48ceb6e34333bd1de425e06b76caeab2b6bd54b1533c5c7ecdfd7c5c7`; event rows are unchanged while generated metadata/source hash changed. Sections JSON is unchanged. Scrape-status SHA changed from `dfd5fd676ec87d5b3e4897cbd067ed86875707ec6fb326364609e0dca3adc3e3` to `32de30e2a1cacb1fc1095b9aa02675538abe318a3cfd487e94ce3e2cd58d5567` to record the new PDF and its `pdf-text`/0-candidate result. Backend/frontend mirrors are byte-identical.

## Public JSON hashes

| File | Baseline SHA-256 | After run SHA-256 |
|---|---|---|
| excursions (backend/frontend mirror) | `d3e8e73a66063319c606fbe921695f08f4336ca50dc0ebfb3f69cd29d34f426f` | `bd876be48ceb6e34333bd1de425e06b76caeab2b6bd54b1533c5c7ecdfd7c5c7` |
| cai-sections (backend/frontend mirror) | `f0245e11e429ef27913c56d91f37a71e1430f7398592da3e442fa27dff2fa48b` | `f0245e11e429ef27913c56d91f37a71e1430f7398592da3e442fa27dff2fa48b` |
| scrape-status (backend/frontend mirror) | `dfd5fd676ec87d5b3e4897cbd067ed86875707ec6fb326364609e0dca3adc3e3` | `32de30e2a1cacb1fc1095b9aa02675538abe318a3cfd487e94ce3e2cd58d5567` |

Orchestrator manifest/state are unchanged after collection; their hashes are referenced by the evidence manifest.
