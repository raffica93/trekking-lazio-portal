# CAI Fivizzano — bounded Attività landing-page sample

Run ID: `cai-20261023-toscana-fivizzano-attivita01`  
Source: `cai-fivizzano-9226019`  
Scope: one explicit official URL, max 1 document, 120-second source budget, concurrency 1. No child/discovery URL was fetched.

## Source result

The requested URL `https://www.caifivizzano.it/attivita/` returned a cached HTML body of 120061 bytes (SHA-256 `604cf46e065b652ead0d4a894369733eaa94f7456a84a35fa6ffbf61b9c4ab0d`, content type `text/html; charset=UTF-8`). The cache records only the requested URL; it does not persist HTTP status or a canonical/final URL. The extractor reports `method=null`, `events=0`.

The cached page is headed “Attività” and introduces the section’s ways to participate in outings, trail maintenance, and local heritage activities. It exposes navigation for “Calendario completo”, “Escursionismo”, “Sentieristica”, T.A.M., schools, and Montagnaterapia. This is an activity landing/navigation page; it contains no dated activity rows recognized by the deterministic extractor. Therefore the zero extraction is **not** evidence that the section calendar is empty. No dates, events, locations, or coordinates were inferred, and no linked child page was visited. Source excerpts with byte offsets are in `source-evidence.json`.

## Coverage and catalog

| Sezioni controllate | Complete | Partial | Unreachable | Eventi datati verificati da questa pagina | Nuovi ID | Righe Fivizzano | Duplicati esclusi | Fallimenti risolti | Fallimenti aperti |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 1 | 0 | 1 | 0 | 0 | 0 | 12, invariati | 0 | 0 | Annual PDF OCR failure; discovery-limit 8 sul PDF e 1 ciascuno per calendario uscite, Miniera, Escursionismo e Attività |

The source remains `partial`. Its status records 12 existing extracted events across document history; this page contributes zero event rows. The catalog contained 3,376 rows before and after, and the CAI Fivizzano ID prefix selects 12 rows before and after. No event row was added, removed, or changed. The sorted source-row hash is `052158f0d916607fe02a746b29c0027d44a39239fd6a16fa282d1c48a04c9905` before and after (ID-prefix filter, ascending ID sort, Node.js `JSON.stringify`, UTF-8 SHA-256). The catalog file SHA changed from pre-run `d02a525382f6d7b31c571a49c0ced7c9ed292b5e67ba138ee060b4adbca4fa83` to post-run `c66e963a9d025dfb1184492362cd3235051f04e0318f88f1985b0d81951e2f03` because generated metadata/source hashes and coverage were refreshed; event rows are unchanged.

Backend/frontend mirrors are byte-identical after the run: excursions `c66e963a9d025dfb1184492362cd3235051f04e0318f88f1985b0d81951e2f03`, scrape status `ac2d38e59aa5d00633cd2090e50b1cb265238b4fa4a5f25bc137c36a94bc9e0b`, sections `f0245e11e429ef27913c56d91f37a71e1430f7398592da3e442fa27dff2fa48b`. No database write, test, classification, import, or commit was performed. Run state is `collection=partial`, `files=ready`, `database=pending`.
