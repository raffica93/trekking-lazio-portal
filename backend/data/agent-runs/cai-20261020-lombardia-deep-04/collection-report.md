# Raccolta Lombardia deep-04

- Run: `cai-20261020-lombardia-deep-04`
- Stato raccolta: `partial`; file: `ready`; database: `completed` dopo controllo Supabase.
- Passaggio unico bounded: 27 fonti selezionate, concurrency 8, massimo 40 documenti e 90 secondi per fonte. Nessun retry aggiuntivo.
- Batch prima della revisione manuale: 3.184 eventi; deep-03: 3.170.
- QA: rimossi 5 record totali (3 Codogno, 1 Sesto Calende, 1 variante duplicata Cernusco); corretto 1 titolo valido (Somma). File prima del controllo supplementare: 3180 eventi, variazione netta +10 rispetto a deep-03. Dopo la rimozione della variante duplicata Cernusco: 3179 eventi, variazione netta +9.
- Nuovi record netti mantenuti: Codogno +2 (Cena Sociale 14/11; Assemblea Regionale dei Delegati 15/11), Cernusco +0 (la variante titolo modificata è stata rimossa perché duplicava l’ID preesistente del concerto del 16/10; riga esistente conservata), Somma Lombardo +1 (Sacra di San Michele 04/10), Sesto Calende +6 (date ufficiali 2026). Alcune date sono già trascorse alla data di raccolta e restano incluse perché documentate nel calendario 2026.
- Import verificato nel progetto `snwzxegtqnnuvlawnpgl`: 3179/3179 source ID presenti e pubblicati, 0 draft, 0 mancanti. L’import ha inserito 12 ID; il duplicato Cernusco `cai-cernusco-sul-naviglio-9216051-dda58dc0afc9` è stato rimosso dopo QA, lasciando 11 nuovi record effettivi e 3168 ID preesistenti preservati. Due righe DB preesistenti non incluse nel file sono state lasciate intatte e sono elencate nello state del run. Query finale: `places=4338`, `cai_sections=837`. Le copie frontend sono sincronizzate byte per byte con i file backend; il manifest aggiornato è verificato.

## Controllo manuale

| Fonte | Record rimosso | Motivo |
|---|---|---|
| CAI Codogno | `cai-codogno-9216071-bfe5c3553005` | Data ambigua “Domenica 15 o Sabato 21”; non determinabile dal PDF. |
| CAI Codogno | `cai-codogno-9216071-282383842231` | Falsa associazione tra righe in colonne diverse: titolo Rif. Grassi associato alla data del Progetto Donne. |
| CAI Codogno | `cai-codogno-9216071-6159f1b267dd` | Duplicato del Progetto Donne 08/11; mantenuto il PDF ufficiale già acquisito. |
| CAI Sesto Calende | `cai-sesto-calende-9216044-141f17fa1d1a` | Pagina del 29/09/2026 per presentare il programma 2027; anno di evento estratto erroneamente come 2027. |

Titolo Somma Lombardo aggiornato dal PDF: “Sacra di San Michele”. Il titolo Cernusco corretto dalla locandina è stato mantenuto nel file come evento distinto, mentre la variante di titolo/virgolette del concerto già presente è stata rimossa. Gli ID sono stati ricalcolati con la funzione stableId del progetto.

## Stato delle 27 fonti processate

| sourceId | Stato | Eventi nel file | Problemi registrati |
|---|---:|---:|---|
| cai-brescia-9216005 | partial | 43 | previous-unavailable-skipped, discovery-limit |
| cai-premana-9216089 | partial | 1 | non-calendar-link-skipped, discovery-limit |
| cai-casorate-sempione-9116045 | partial | 6 | previous-unavailable-skipped, status code 404 |
| cai-borno-9216113 | partial | 1 | previous-unavailable-skipped, issue, discovery-limit |
| cai-carate-brianza-9216030 | partial | 6 | issue, discovery-limit |
| cai-cernusco-sul-naviglio-9216051 | partial | 2 | non-calendar-link-skipped |
| cai-codogno-9216071 | partial | 13 | non-calendar-link-skipped, discovery-limit, manual-qa-ambiguous-date-skipped, manual-qa-multicolumn-date-skipped, manual-qa-duplicate-skipped |
| cai-dongo-9216131 | partial | 13 | discovery-limit |
| cai-gazzada-schianno-9216148 | partial | 11 | previous-unavailable-skipped, issue, discovery-limit |
| cai-inveruno-9216128 | partial | 10 | previous-unavailable-skipped, discovery-limit |
| cai-iseo-9216157 | partial | 4 | previous-unavailable-skipped, discovery-limit |
| cai-s-e-m-9216028 | partial | 14 | discovery-limit |
| cai-sesto-calende-9216044 | partial | 7 | non-calendar-link-skipped, issue, discovery-limit, manual-qa-year-mismatch-skipped |
| cai-sesto-s-giovanni-9216020 | partial | 6 | non-calendar-link-skipped, previous-unavailable-skipped, discovery-limit |
| cai-somma-lombardo-9216065 | partial | 1 | issue, discovery-limit |
| cai-valmadrera-9216081 | partial | 7 | discovery-limit |
| cai-varese-9216009 | partial | 58 | discovery-limit |
| cai-veduggio-9216147 | partial | 13 | discovery-limit |
| cai-cremona-9216007 | partial | 6 | previous-unavailable-skipped, discovery-limit |
| cai-erba-9216099 | ok | 3 | — |
| cai-gavirate-9216059 | unsupported | 0 | discovery-limit |
| cai-legnano-9216022 | partial | 3 | discovery-limit |
| cai-lissone-9216040 | partial | 7 | discovery-limit |
| cai-milano-9216003 | partial | 9 | discovery-limit |
| cai-missaglia-9216150 | unsupported | 0 | issue, discovery-limit |
| cai-seregno-9216016 | partial | 7 | discovery-limit |
| cai-colico-9216123 | unsupported | 0 | issue |

Gli stati `partial`/`unsupported` restano tali dove permangono limiti o errori. Due OCR restano irrisolti: CAI Colico (PDF ufficiale, OCR psm6 fallito e fallback psm4 oltre il budget) e CAI Missaglia (PDF ufficiale per attività giovanili, OCR psm6 fallito e fallback psm4 oltre il budget). Erba è `ok` con 3 eventi dopo esclusione di PDF assicurativi non pertinenti; Somma Lombardo è `partial` con 1 evento.

## Copertura complessiva Lombardia

Sulle 125 fonti Lombardia enabled risultano 38 `ok`, 18 `no-upcoming`, 39 `partial` e 30 `unsupported`: 69 restano unresolved. Le fonti non processate da questo passaggio mantengono stato e issue precedenti. Il batch aumenta i record verificati senza dichiarare completa la copertura CAI.


## Riconciliazione duplicato Cernusco

Rimosso il solo nuovo ID `cai-cernusco-sul-naviglio-9216051-dda58dc0afc9`, che replicava il record preesistente `cai-cernusco-sul-naviglio-9216051-767f6d7d47c4` per evento/data/URL. Il record preesistente, compreso il titolo originale, è conservato senza modifiche. Database non modificato.
