# Raccolta CAI Lombardia deep-08

- Run: `cai-20261020-lombardia-deep-08`
- Stato finale: `collection=partial`, `files=ready`, `database=completed`.
- Record nel dataset dopo QA: **3.204**; confronto con il deep-07 verificato a 3.182: **22 nuovi record validi** (9 Sesto Calende, 13 Somma Lombardo).
- Le tre righe già importate nel deep-06 sono state preservate.
- Nessun retry sull’URL CAI Somma Lombardo conclusosi `aborted`.

## CAI Sesto Calende

Fonte: [Libretto Programma 2026](https://caisestocalende.it/wp-content/uploads/2026/01/Libretto-Programma-2026-CAI-SESTO-CALENDE.pdf), hash del PDF in cache `785e71ad46f017e80463b170589024c97f5636dfb28486efdf110cbc874f98c9`.

Il passaggio OCR è stato limitato a pagine PDF 17–24 (8 pagine). Sono stati renderizzati gli originali e controllati visivamente i record. La pagina 25 è stata prima verificata con `pdftotext` (nessun testo estratto) e poi renderizzata: è la pagina finale con immagine/contatti, non contiene calendario; non è stata eseguita OCR. Le pagine 17–24 sono le pp. stampate 32–45.

L’estrazione automatica ha restituito 29 candidati, molti con righe o colonne concatenate. Sono stati rimossi nove record OCR malformati/duplicati e aggiunte solo le nove voci qui riportate, lette direttamente nel documento originale. Le pagine del libretto sono così coperte da passaggi precedenti (1–16) e deep08 (17–24); p25 non è una pagina di programma. Restano fuori i calendari e PDF autonomi linkati dalla sezione, quindi lo stato di copertura della fonte resta **partial**.

| ID | Data | Titolo verificato | Riscontro |
|---|---|---|---|
| `cai-sesto-calende-9216044-ab5e428f62cc` | 2026-10-04 | Torrente Val Segnara (V3 A3 I) – Verbano | PDF p21, stampata 40; data, torrente e descrizione sono leggibili. |
| `cai-sesto-calende-9216044-baf97a36b8cb` | 2026-10-11 | Torrente Caldone (V3 A3 III) – Lecco | PDF p21, stampata 40; data, titolo, Lecco e descrizione leggibili. |
| `cai-sesto-calende-9216044-739a71454d4f` | 2026-10-18 | Torrente San Giulio e le sue cascate | PDF p21, stampata 40; data e titolo leggibili; luogo lasciato da verificare perché la riga non lo specifica. |
| `cai-sesto-calende-9216044-8eed09569eb5` | 2026-10-25 | Torrente Pescone (V3 A3 II) – Verbania, Omegna | PDF p21, stampata 40; titolo e descrizione indicano Verbania/Omegna. |
| `cai-sesto-calende-9216044-cd7b2ea14b54` | 2026-11-01 | Canyoning e speleo – allenamento, palestra di roccia | PDF p21 e p23 (stampate 40 e 44); titolo/data leggibili e confermati in entrambe le pagine. |
| `cai-sesto-calende-9216044-164e92ec7bbb` | 2026-11-08 | Grotta del Frassino – Varese, Campo dei Fiori | PDF p23, stampata 44; titolo, data e descrizione leggibili. |
| `cai-sesto-calende-9216044-dd3dab34a2c2` | 2026-11-15 | L’orrido di Cunardo – Varese, Cunardo | PDF p23, stampata 44; titolo, data e descrizione leggibili. |
| `cai-sesto-calende-9216044-b6eb7f0cd2bb` | 2026-11-22 | Grotta Remeron – Varese | PDF p23, stampata 44; titolo, data e descrizione leggibili. |
| `cai-sesto-calende-9216044-00a55561420f` | 2026-11-29 | Canyoning e speleo – allenamento, palestra di roccia | PDF p23, stampata 44; titolo e data leggibili. |

I nove candidati automatici scartati/rimpiazzati erano `6e06c33c121e` (titolo OCR corrotto, ricostruito da p21), `f66daf906cd7` (titolo OCR corrotto, ricostruito da p21), `1cbcf229f294` (colonna/data conflata), `6b4d76e32f65` (titolo OCR incompleto, ricostruito da p21), `3f356e93b431` (duplicato OCR di un evento già pubblicato nel programma Seniores), `14325add7bf7` (descrizione/colonna conflata, ricostruito da p21), `a45a5f4e579f` (titolo appeso a testo estraneo; il record Seniores verificato esistente è stato preservato), `e373951eedf3` (candidato novembre con titolo di altra colonna, sostituito dal titolo confermato alle pp. 21 e 23) e `3f1aba40f446` (duplicato OCR del pranzo Seniores già esistente). Nessuno degli ID preesistenti è stato sostituito.

## CAI Somma Lombardo

Il PDF condiviso SIEL è ufficialmente pubblicato da CAI Gazzada Schianno: [Libretto Escursioni 2026](https://www.caigazzadaschianno.it/images/siel/LibrettoEscursioni2026.pdf), SHA-256 `e9d979ff7ab7e0c5aca375d2e90dc5590c77bdb004319ae53d3b035cfa191761`, 167.318.309 byte e 19 pagine. Le pagine PDF 15–16 sono state lette con `pdftotext -layout` e renderizzate dall’originale. L’intestazione ripetuta “Sezione di SOMMA LOMBARDO” e le colonne della pagina sono distinguibili; i record sotto quell’intestazione sono attribuiti a Somma. È stato mantenuto `sourceDocument` uguale all’URL ufficiale Gazzada; nessun record è stato ricavato dal PDF compresso.

Pagina PDF 15 (stampata 28–29) contiene il programma gennaio–giugno, già trascorso alla data del passaggio. La pagina PDF 16 (stampata 30–31) contiene il programma ottobre–dicembre. È stata verificata e conservata la riga Somma preesistente del 4 ottobre (“Sacra di San Michele”); le altre 13 righe leggibili sotto l’intestazione Somma sono nuove:

| ID | Data | Titolo letto sulla pagina PDF 16 (stampata 31) |
|---|---|---|
| `cai-somma-lombardo-9216065-96b2b5775b99` | 2026-10-11 | Salecchio Superiore (1.510 m) – Valle Antigorio (VB) |
| `cai-somma-lombardo-9216065-6d143fce7d00` | 2026-10-11 | Corni di Canzo da Gajum (CO) |
| `cai-somma-lombardo-9216065-2f6b3304a3b0` | 2026-10-18 | Traversata Brunate–Asso – Triangolo Lariano |
| `cai-somma-lombardo-9216065-a42f39d7f02b` | 2026-10-18 | Creste sud del Resegone da Brumano (BG) |
| `cai-somma-lombardo-9216065-5f2df7c3189d` | 2026-10-25 | Foliage al Monte Generoso |
| `cai-somma-lombardo-9216065-3cb58e0cf38e` | 2026-11-08 | Strà Granda da Piedimulera a Ponte Grande – Valle Anzasca |
| `cai-somma-lombardo-9216065-4deca0e1233b` | 2026-11-08 | Monte Gambarogno (1.734 m) dal Passo di Neggia (CH) |
| `cai-somma-lombardo-9216065-ce2df0dd16fa` | 2026-11-15 | Monte Cazzola (2.330 m) – Alpe Devero (VB) |
| `cai-somma-lombardo-9216065-723ce026d607` | 2026-11-22 | Savogno da Chiavenna – Val Bregaglia |
| `cai-somma-lombardo-9216065-3e9d8885165f` | 2026-11-28 | Cena sociale CAI Somma Lombardo |
| `cai-somma-lombardo-9216065-55ef8038bff7` | 2026-12-06 | Da Como a Brunate |
| `cai-somma-lombardo-9216065-7566e8dac66a` | 2026-12-13 | Palestra di arrampicata – Gruppo Alpinismo Giovanile |
| `cai-somma-lombardo-9216065-0e59b5430b6b` | 2026-12-20 | Ciclabile Canale Villoresi da Monza |

L’URL diretto di Somma aveva fallito con `aborted` nel tentativo singolo precedente; in deep08 non è stato ritentato. La fonte rimane **partial**: 13 record recuperati dal SIEL condiviso, una riga preesistente preservata e il problema del download diretto registrato nel registro fonte. Gli eventi sono marcati con metodo `pdf-text-manual-page` e la fonte ufficiale condivisa è documentata nel registro.

## Verifiche finali e manifest

- Conteggio finale: 3.204 eventi; i 22 ID nuovi elencati sopra sono unici. I tre ID importati nel deep-06 sono rimasti presenti una volta ciascuno e con i dati invariati.
- I sei JSON backend/frontend sono stati parseati e verificati byte-per-byte identici a coppie. Il manifest li copre tutti con SHA-256.
- Import nel progetto Supabase autorizzato `snwzxegtqnnuvlawnpgl`: 22 ID nuovi inseriti come `published`, preservando i 3.182 ID preesistenti. Query finale: 3.204/3.204 ID del run presenti e `published`, 0 draft e 0 mancanti; 4.363 `places` e 837 `cai_sections`.
- La raccolta è parziale: Sesto resta aperta per i calendari/PDF autonomi collegati; Somma mantiene l’errore del download diretto nonostante il recupero dal PDF SIEL condiviso.
