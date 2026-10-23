# Raccolta PDF CAI Lombardia deep-06

- Run: `cai-20261020-lombardia-deep-06`
- Stato finale: `collection=partial`, `files=ready`, `database=completed`.
- Confronto con il deep-05, verificato a 3.179 eventi: 3 nuovi record validi, 3.182 eventi dopo QA, variazione netta **+3**.
- Passaggio singolo su cinque fonti PDF con concurrency 5, massimo 40 documenti e 240 secondi per fonte. Timeout download 180 secondi solo sui due URL SIEL grandi; OCR massimo 8 pagine per PDF, 90 secondi complessivi e 20 secondi per comando. URL PDF espliciti in allowlist; nessun link social o retry ciclico.
- PDF estratti in streaming su disco entro 180 MiB, massimo 400 pagine. I file originali restano in cache. Il manifest include gli hash dei JSON backend e delle copie pubbliche frontend.

## Nuovi eventi verificati

Le prime due righe provengono dal documento SIEL ufficiale di Gazzada. Sono passate rispetto al 20 ottobre, ma appartengono a ottobre e restano nel lotto secondo la finestra mensile del progetto. Il testo del PDF indica `Meta da stabilire`; non sono state aggiunte coordinate.

| ID | Data | Titolo | Fonte e riscontro |
|---|---|---|---|
| `cai-gazzada-schianno-9216148-16ce1116224d` | 2026-10-04 | 3° Stage avvicinamento alle ferrate | [PDF SIEL Gazzada](https://www.caigazzadaschianno.it/images/siel/LibrettoEscursioni2026.pdf), pagina PDF 10 (pagina stampata 18), intestazione “Sezione di GAZZADA SCHIANNO”; riga completa: `DOM 04 Ottobre - 3° Stage avvicinamento alle ferrate`, meta da stabilire. |
| `cai-gazzada-schianno-9216148-03dca13544c6` | 2026-10-18 | 3° Stage avvicinamento alle ferrate | Stesso PDF, pagina PDF 10 (pagina stampata 18), riga completa: `DOM 18 Ottobre - 3° Stage avvicinamento alle ferrate`, meta da stabilire. |
| `cai-sesto-calende-9216044-c09ad45a0483` | 2026-10-25 | Castagnata sezionale | [Libretto ufficiale CAI Sesto Calende](https://caisestocalende.it/wp-content/uploads/2026/01/Libretto-Programma-2026-CAI-SESTO-CALENDE.pdf), pagina PDF 7 (pagina stampata 12): `DOM 25 Ottobre - CASTAGNATA SEZIONALE`; descrizione: giornata informativa e conviviale sul territorio sestese in collaborazione con l’Amministrazione Comunale. La pagina non specifica una sede più precisa. |

Il parser a righe aveva accodato colonne diverse nei due record Gazzada. La pagina originale è stata controllata e i soli titolo, data e luogo letteralmente pubblicati sono stati mantenuti. L’evento Sesto è stato corretto dopo verifica visiva, eliminando i nomi e telefoni dei coordinatori finiti nel titolo OCR.

## Altri output OCR Sesto scartati

L’OCR limitato alle prime 8 pagine del PDF ha restituito otto righe; solo quella del 25 ottobre è nuova e verificabile. Le altre non sono state importate:

| ID candidato | Motivo |
|---|---|
| `cai-sesto-calende-9216044-5c3a9d31c9c5` | 2026-04-19, evento leggibile ma già trascorso rispetto alla finestra del lotto. |
| `cai-sesto-calende-9216044-af6410070cc4` | Data/titolo OCR conflati: la pagina 8 separa l’uscita dell’11 gennaio dal corso del 15 febbraio; candidato non attendibile. |
| `cai-sesto-calende-9216044-39fed330f825` | 2026-01-18, uscita intersezionale già trascorsa. |
| `cai-sesto-calende-9216044-e00e41765ab1` | 2026-01-25, uscita “Rupe del Gesso”, già trascorsa; OCR ha aggiunto testo del giorno successivo. |
| `cai-sesto-calende-9216044-807d3aca4ce0` | Falsa associazione tra la data 25 gennaio e testo di altre righe/colonne; scartato. |
| `cai-sesto-calende-9216044-d934fb7d3e65` | 2026-02-01, corso intersezionale già trascorso; descrizione OCR attraversa righe adiacenti. |
| `cai-sesto-calende-9216044-9126edf8ef9c` | 2026-02-08, eventuale recupero già trascorso; OCR ha appeso intestazione e recapiti. |

## Stato per fonte

| sourceId | Stato | Eventi nel file | Metodo e problema |
|---|---:|---:|---|
| `cai-colico-9216123` | unsupported | 0 | OCR PDF ufficiale pagina 12; scala difficoltà e istruzioni di sicurezza in una brochure 2023, non calendario eventi. URL: `https://www.caicolico.it/_files/ugd/f57be4_a702a4a3971c4b099eefeec536ce4a42.pdf?index=true`. |
| `cai-missaglia-9216150` | unsupported | 0 | OCR PDF ufficiale pagina 21; sezione primo soccorso di un manuale didattico, non calendario. URL: `https://www.caimissaglia.it/file/AlpGiovani/AndiamoMontagna.pdf`. |
| `cai-gazzada-schianno-9216148` | partial | 13 | Testo estratto da pagina 10 del SIEL; 2 nuovi eventi verificati. Le colonne non attribuibili non sono state usate. Altri candidati e limiti discovery/source-error preesistenti restano nel registro. |
| `cai-sesto-calende-9216044` | partial | 8 | PDF da 33.693.066 B, 25 pagine; OCR limitato alle pagine 1–8, una nuova riga verificata. Le pagine 9–25 restano da verificare; il registro conserva discovery-limit e altre issue precedenti. |
| `cai-somma-lombardo-9216065` | failed | 1 | Il download del PDF SIEL è terminato con `aborted` durante il passaggio limitato. Il file temporaneo parziale è stato rimosso; la riga/cache preesistente è rimasta. URL: `https://caisomma.it/wp-content/uploads/pdf/Escursioni/2026/SIEL_Programma%20Escursionistico%202026.pdf`. |

## Prova compressione e procedura

Il PDF SIEL di Gazzada è stato scaricato su disco (167.318.309 B, 19 pagine). Ghostscript 10.05.1 ha creato in meno di 180 secondi una copia temporanea `/ebook` di 3.897.565 B, riduzione del 97,67%. `pdftotext` ha prodotto 217.010 B dall’originale e 212.686 B dalla copia; il contenuto non è identico, benché la pagina 10 resti leggibile a 120 dpi. La copia compressa non è stata usata per estrarre i record.

La procedura riutilizzabile, i cap finiti, i comandi e i controlli sono in `docs/procedura-pdf-cai.md`. È stata dimostrata l’estrazione offline di pagine specifiche dal PDF da 167 MB e l’OCR selettivo su un PDF ufficiale scansito. Nessun dato è stato inventato o attribuito a una sezione diversa.

## Verifiche finali

- Backend e frontend contengono gli stessi 3.182 eventi; le copie di `excursions.json` e `scrape-status.json` coincidono byte per byte.
- I tre record nuovi sono univoci per ID e attribuiti alla sezione indicata nell’intestazione ufficiale.
- Import nel progetto Supabase autorizzato `snwzxegtqnnuvlawnpgl`: i tre nuovi ID sono stati inseriti come `published`, preservando 3.179 record preesistenti. Query finale: 3.182/3.182 ID del lotto presenti e `published`, zero draft e zero mancanti; 4.341 `places` e 837 `cai_sections`.
- Restano fonti parziali o non supportate; la copertura Lombardia non è completa.
